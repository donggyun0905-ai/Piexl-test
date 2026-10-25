import { describe, expect, it } from "vitest";
import { WEAPONS } from "../content";
import type { PassiveId } from "../items";
import { updateDelayed } from "./combat";
import { gunMoveMul, reloadTicksOf, SPIN_FULL } from "./gun";
import { droneCount, GRENADE_FLY, updateBleed } from "./gunExtras";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { onRoomCleared, weaponPool } from "./loot";
import { enemy, FIRE } from "./perkTestUtil";
import { gunner, hold } from "./gunTestUtil";

const bullets = (s: RunState) => s.projectiles.filter((p) => p.fromPlayer);

describe("거너 총", () => {
  it("최대 체력은 체력 아이템을 먹어도 40 고정", () => {
    expect(createRun(3, "gunner").player.hp).toBe(40);
    const s = gunner("pistol", "sturdyHeart", "heavyPlate", "furySeal");
    expect(s.player.stats.maxHp).toBe(40);
    expect(s.player.hp).toBeLessThanOrEqual(40);
  });

  it("거너는 전용 무기만 얻음", () => {
    for (const id of weaponPool(gunner())) expect(WEAPONS[id]).toMatchObject({ exclusive: "gunner" });
  });

  it("권총: 8발 쏘면 장전, 장전이 끝나야 다시 쏨", () => {
    const s = gunner();
    hold(s, 200);
    expect(s.player.attackCount).toBe(8);
    expect(s.player.reloadLeft).toBeGreaterThan(0);
    hold(s, reloadTicksOf(s.player) + 30);
    expect(s.player.attackCount).toBeGreaterThan(8);
  });

  it("쏘지 않고 1초 지나면 남은 탄도 채움", () => {
    const s = gunner();
    hold(s, 25);
    const left = s.player.ammo!;
    expect(left).toBeLessThan(8);
    hold(s, 61 + reloadTicksOf(s.player) + 2, false);
    expect(s.player.ammo).toBe(8);
  });

  it("샷건: 5발 부채꼴, 장전 중에도 한 발씩 채워지며 쏨", () => {
    const s = gunner("shotgun");
    hold(s, 1);
    expect(bullets(s)).toHaveLength(5);
    hold(s, 600);
    // 8발 탄창이지만 계속 한 발씩 채워져 8번보다 많이 쏨
    expect(s.player.attackCount).toBeGreaterThan(12);
  });

  it("저격총: 관통·강한 한 발 · 쌍권총: 두 발씩", () => {
    const s = gunner("sniper");
    hold(s, 1);
    expect(bullets(s)[0]).toMatchObject({ pierce: 5 });
    const d = gunner("dualpistol");
    hold(d, 1);
    expect(bullets(d)).toHaveLength(2);
  });

  it("총검: 쏠 때 앞을 찌르고, 대시하면 둘레에 피해", () => {
    const s = gunner("bayonet");
    const e = enemy(1, 135, 72);
    s.enemies = [e];
    hold(s, 1);
    expect(e.hp).toBeLessThan(e.maxHp);
    const b = gunner("bayonet");
    const o = enemy(2, 100, 72);
    b.enemies = [o];
    stepSim(b, { ...EMPTY_INPUT, dash: true, moveY: -100 });
    expect(o.hp).toBeLessThan(o.maxHp);
  });

  it("기관단총: 쏘는 동안 느려짐 · 미니건: 2초 예열 뒤에 쏘고 예열 중 느려짐", () => {
    const s = gunner("smg");
    hold(s, 3);
    expect(gunMoveMul(s.player, s.tick)).toBeLessThan(1);
    const m = gunner("minigun");
    hold(m, SPIN_FULL - 5);
    expect(m.player.attackCount).toBe(0);
    expect(gunMoveMul(m.player, m.tick)).toBe(0.5);
    hold(m, 20);
    expect(m.player.attackCount).toBeGreaterThan(0);
  });

  it("수류탄: 던진 뒤 잠시 뒤에 그 자리에서 큰 폭발", () => {
    const s = gunner("grenade");
    const e = enemy(1, 200, 72);
    s.enemies = [e];
    hold(s, 1);
    expect(e.hp).toBe(e.maxHp);
    for (let i = 0; i < GRENADE_FLY + 1; i++) {
      s.tick++;
      updateDelayed(s);
    }
    expect(e.hp).toBeLessThan(e.maxHp);
  });

  it("드론: 1대로 시작, 10마리 처치마다 +1, 스스로 적을 쏨", () => {
    const s = gunner("drone");
    s.enemies = [enemy(1, 160, 72)];
    hold(s, 2);
    expect(droneCount(s)).toBe(1);
    expect(bullets(s).length).toBeGreaterThan(0);
    s.kills += 25;
    expect(droneCount(s)).toBe(3);
    s.kills += 500;
    expect(droneCount(s)).toBe(5);
  });

  it("드론 무기 한 발 피해: 1대면 2, 1대 늘 때마다 +1 (최대 5대라 6까지)", () => {
    const shot = (kills: number) => {
      const s = gunner("drone");
      s.enemies = [enemy(1, 160, 72)];
      hold(s, 1);
      s.kills += kills;
      s.projectiles = [];
      s.player.droneCd = [];
      hold(s, 1);
      return Math.min(...bullets(s).map((b) => b.damage / (b.crit ? 1.5 : 1)));
    };
    expect(shot(0)).toBeCloseTo(2);
    expect(shot(20)).toBeCloseTo(4);
    expect(shot(200)).toBeCloseTo(6);
  });

  it("같은 시드·입력이면 결과가 같음", () => {
    const play = () => {
      const s = createRun(21, "gunner");
      for (let i = 0; i < 600; i++) stepSim(s, { ...FIRE, autoAim: true, moveX: i % 200 < 100 ? 60 : -60 });
      return [s.player.x, s.player.ammo, s.kills, s.enemies.map((e) => e.hp)];
    };
    expect(play()).toEqual(play());
  });
});

describe("거너 전용 아이템", () => {
  it("능력치: 군기·총 공격·특급·연발", () => {
    const base = gunner().player.stats;
    expect(gunner("pistol", "discipline").player.stats.moveSpeed).toBeCloseTo(base.moveSpeed + 0.2);
    const a = gunner("pistol", "allIn").player.stats;
    expect([a.maxHp, a.damage]).toEqual([40, base.damage + 5]);
    const r = gunner("pistol", "rapidFire").player;
    expect(r.stats.attackSpeed).toBeCloseTo(base.attackSpeed * 2);
    expect(reloadTicksOf(r)).toBe(Math.round(72 * 0.5));
    expect(reloadTicksOf(gunner("pistol", "elite").player)).toBe(Math.round(72 * 0.9));
  });

  it("화력 집중: 치명타가 자주 남 · 폐급: 모두 치명타지만 가끔 고장", () => {
    const crits = (perk?: PassiveId) => {
      const s = perk ? gunner("smg", perk) : gunner("smg");
      hold(s, 3000);
      const all = bullets(s);
      return all.filter((b) => b.crit).length / all.length;
    };
    expect(crits("focusFire")).toBeGreaterThan(crits() + 0.15);
    expect(crits("scrapGun")).toBe(1);
    const s = gunner("minigun", "scrapGun");
    let jammed = false;
    for (let i = 0; i < 1500 && !jammed; i++) {
      hold(s, 1);
      jammed = (s.player.jamTicks ?? 0) > 0;
    }
    expect(jammed).toBe(true);
  });

  it("지원 사격: 가끔 3초 지원 드론 · 출혈: 맞힌 적이 피를 흘림 · 전투식량: 방 정리하면 10% 회복", () => {
    const s = gunner("smg", "supportFire");
    hold(s, 60);
    expect(s.player.support?.length ?? 0).toBeGreaterThan(0);
    const b = gunner("pistol", "bleed");
    const e = enemy(1, 140, 72, 1000);
    b.enemies = [e];
    for (let i = 0; i < 10; i++) stepSim(b, FIRE);
    expect(e.bleedTicks).toBeGreaterThan(0);
    const hp = e.hp;
    for (let i = 0; i < 31; i++) {
      b.tick++;
      updateBleed(b);
    }
    expect(hp - e.hp).toBeCloseTo(10);
    const r = gunner("pistol", "ration");
    r.player.hp = 10;
    const room = r.map.rooms.findIndex((x) => x.type === "combat");
    onRoomCleared(r, room);
    expect(r.player.hp).toBeCloseTo(10 + r.player.stats.maxHp * 0.1);
  });

  it("지원사격은 드론 무기와도 같이 됨 (드론이 쏠 때 지원 드론이 붙음)", () => {
    const s = gunner("drone", "supportFire");
    s.enemies = [enemy(1, 160, 72)];
    hold(s, 600);
    expect(s.player.support?.length ?? 0).toBeGreaterThan(0);
  });

  it("지원 드론은 최대 5대, 지원 드론 탄은 치명타 없음", () => {
    const s = gunner("smg", "supportFire", "focusFire");
    s.enemies = [enemy(1, 160, 72, 99999)];
    for (let i = 0; i < 600; i++) {
      hold(s, 1);
      expect(s.player.support?.length ?? 0).toBeLessThanOrEqual(5);
    }
    // 치명타 탄은 모두 본인 탄 (지원 드론 탄 피해 0.4배라 치명타가 붙어도 0.7배를 못 넘음)
    expect(bullets(s).some((b) => b.crit)).toBe(true);
    expect(bullets(s).filter((b) => b.crit).every((b) => b.damage > s.player.stats.damage * 0.7)).toBe(true);
  });

  it("건 마스터: 가져 본 다른 총이 가끔 같이 쏨", () => {
    const s = gunner("pistol", "gunMaster");
    s.player.gunsOwned = ["pistol", "shotgun"];
    hold(s, 300);
    expect(s.effects.some((fx) => fx.kind === "ghostgun") || bullets(s).length > s.player.attackCount).toBe(true);
  });
});
