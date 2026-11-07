import { describe, expect, it } from "vitest";
import { WEAPONS, type WeaponDef, type WeaponId } from "../content";
import type { PassiveId } from "../items";
import { damagePlayer } from "./combat";
import { createRun, type RunState } from "./index";
import { recalcStats } from "./items";
import { beamInterval } from "./laser";
import { passivePool, weaponPool } from "./loot";
import { enemy, FIRE, run } from "./perkTestUtil";

/** 기계공학자로 시작해 무기·아이템을 가진 채, 적 없는 방 가운데 */
function engineer(weapon: WeaponId = "beamer", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "engineer");
  s.noFaction = true;
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.enemies = [];
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 72;
  return s;
}

/** 움직이지 않는 허수아비 */
function dummy(id: number, x: number, y: number) {
  return { ...enemy(id, x, y), kind: "dummy" as const };
}

const lost = (s: RunState, id: number) => {
  const e = s.enemies.find((x) => x.id === id)!;
  return e.maxHp - e.hp;
};

describe("기계공학자 레이저", () => {
  it("초당 피해 = 공격력 × 공격 속도 (1.5초에 1.5배), 밀어내지 않음", () => {
    const s = engineer();
    s.enemies = [dummy(901, 100, 72)];
    run(s, 90, FIRE);
    const st = s.player.stats;
    expect(lost(s, 901)).toBeCloseTo(st.damage * st.attackSpeed * 1.5);
    expect(s.enemies[0]!.x).toBe(100);
  });

  it("조사 간격: 공격 속도 2는 0.15초(9틱), 아무리 빨라도 2틱", () => {
    expect(beamInterval(2)).toBe(9);
    expect(beamInterval(10)).toBe(2);
  });

  it("빔은 첫 적에서 멈추고, 굴절 프리즘이면 뒤쪽 적도 절반", () => {
    const s = engineer();
    s.enemies = [dummy(901, 100, 72), dummy(902, 130, 72)];
    run(s, 30, FIRE);
    expect(lost(s, 902)).toBe(0);
    const t = engineer("beamer", "refractPrism");
    t.enemies = [dummy(901, 100, 72), dummy(902, 130, 72)];
    run(t, 30, FIRE);
    expect(lost(t, 902)).toBeCloseTo(lost(t, 901) * 0.5);
  });

  it("고출력 렌즈: 첫 적 바로 뒤 적도 같이 맞음, 피해 +10%", () => {
    const s = engineer("beamer", "highLens");
    s.enemies = [dummy(901, 100, 72), dummy(902, 110, 72)];
    run(s, 30, FIRE);
    expect(lost(s, 902)).toBeCloseTo(lost(s, 901));
    const base = engineer();
    base.enemies = [dummy(901, 100, 72)];
    run(base, 30, FIRE);
    expect(lost(s, 901)).toBeCloseTo(lost(base, 901) * 1.1);
  });

  it("빔 스플리터: 다른 방향의 적에게도 빔, 각 90%", () => {
    const s = engineer("beamer", "beamSplitter");
    s.enemies = [dummy(901, 100, 72), dummy(902, 60, 110)];
    run(s, 30, FIRE);
    expect(lost(s, 902)).toBeCloseTo(lost(s, 901));
    const base = engineer();
    base.enemies = [dummy(901, 100, 72)];
    run(base, 30, FIRE);
    expect(lost(s, 901)).toBeCloseTo(lost(base, 901) * 0.9);
  });

  it("열 축적: 2초 조사하면 열폭발이 옆의 적도 맞힘", () => {
    const s = engineer("beamer", "heatBuildup");
    s.enemies = [dummy(901, 100, 72), dummy(902, 100, 92)];
    run(s, 110, FIRE);
    expect(lost(s, 902)).toBe(0);
    run(s, 20, FIRE);
    expect(lost(s, 902)).toBeCloseTo(s.player.stats.damage * 1.2);
  });

  it("집속 코일: 같은 적을 오래 조사할수록 강해짐 (최대 +50%)", () => {
    const s = engineer("beamer", "focusCoil");
    s.enemies = [dummy(901, 100, 72)];
    run(s, 240, FIRE);
    const before = lost(s, 901);
    run(s, 90, FIRE);
    const st = s.player.stats;
    expect(lost(s, 901) - before).toBeCloseTo(st.damage * st.attackSpeed * 1.5 * 1.5);
  });

  it("장갑 용해: 맞은 적이 받는 피해 증가 (최대 10번)", () => {
    const s = engineer("beamer", "armorMelt");
    s.enemies = [dummy(901, 100, 72)];
    run(s, 120, FIRE);
    expect(s.enemies[0]!.melt).toBe(10);
  });

  it("에너지 회수: 처치하면 보호막, 체력보다 먼저 깎임", () => {
    const s = engineer("beamer", "energyRecycle");
    s.enemies = [dummy(901, 100, 72)];
    s.enemies[0]!.hp = 1;
    run(s, 2, FIRE);
    expect(s.player.shieldPts).toBe(4);
    const hp = s.player.hp;
    damagePlayer(s, 6);
    expect(s.player.shieldPts).toBe(0);
    expect(s.player.hp).toBe(hp - 2);
  });

  it("오버클럭: 체력 절반 이하면 틱 피해 +20%", () => {
    const s = engineer("beamer", "overclock");
    s.player.hp = s.player.stats.maxHp * 0.4;
    s.enemies = [dummy(901, 100, 72)];
    run(s, 90, FIRE);
    const st = s.player.stats;
    expect(lost(s, 901)).toBeCloseTo(st.damage * st.attackSpeed * 1.5 * 1.2);
  });

  it("집속 렌즈 캐논: 프리즘이 있어도 한 대상만", () => {
    const s = engineer("focuscannon", "refractPrism");
    s.enemies = [dummy(901, 100, 72), dummy(902, 130, 72)];
    run(s, 30, FIRE);
    expect(lost(s, 901)).toBeGreaterThan(0);
    expect(lost(s, 902)).toBe(0);
  });

  it("플라즈마 커터: 앞쪽 부채꼴 안 적 모두, 사거리 밖은 안 맞음", () => {
    const s = engineer("plasmacutter");
    s.enemies = [dummy(901, 85, 72), dummy(902, 85, 85), dummy(903, 130, 72)];
    run(s, 30, FIRE);
    expect(lost(s, 901)).toBeGreaterThan(0);
    expect(lost(s, 902)).toBeGreaterThan(0);
    expect(lost(s, 903)).toBe(0);
  });

  it("레이저 포탑: 조준한 곳으로 포탑을 던져 설치 (최대 3기, 6초 뒤 사라짐), 본체는 쏘지 않음", () => {
    const s = engineer("laserturret");
    s.enemies = [dummy(901, 120, 72)];
    run(s, 40, FIRE);
    const turrets = s.devices!.filter((d) => d.kind === "turret");
    expect(turrets).toHaveLength(1);
    expect(turrets[0]!.x).toBeGreaterThan(70);
    expect(s.effects.some((fx) => fx.follow)).toBe(false);
    expect(lost(s, 901)).toBeGreaterThan(0);
    run(s, 400, FIRE);
    expect(s.devices!.filter((d) => d.kind === "turret")).toHaveLength(3);
    const t = engineer("laserturret");
    run(t, 2, FIRE);
    run(t, 400);
    expect(t.devices!.filter((d) => d.kind === "turret")).toHaveLength(0);
  });

  it("반사 거울 드론: 드론 3기가 각자 다른 적에게, 적이 하나면 모두 그 적에게", () => {
    const s = engineer("mirrordrone");
    s.enemies = [dummy(901, 100, 72), dummy(902, 60, 110), dummy(903, 60, 30)];
    run(s, 30, FIRE);
    for (const id of [901, 902, 903]) expect(lost(s, id)).toBeGreaterThan(0);
    const t = engineer("mirrordrone");
    t.enemies = [dummy(901, 100, 72)];
    run(t, 90, FIRE);
    const st = t.player.stats;
    expect(lost(t, 901)).toBeCloseTo(st.damage * st.attackSpeed * 1.5 * 0.4 * 3);
  });

  it("테슬라 코일: 첫 적에서 가까운 적으로 번개가 건너감 (45%)", () => {
    const s = engineer("teslacoil");
    s.enemies = [dummy(901, 100, 72), dummy(902, 100, 110), dummy(903, 130, 110)];
    run(s, 30, FIRE);
    expect(lost(s, 902)).toBeCloseTo(lost(s, 901) * 0.45);
    expect(lost(s, 903)).toBeCloseTo(lost(s, 901) * 0.45);
  });

  it("자기장 발생기: 누르고 있으면 주변 적을 끌어당기고, 2.25초 모이면 펄스로 한꺼번에 피해·밀어내기", () => {
    const s = engineer("magnetfield");
    s.enemies = [dummy(901, 100, 72), dummy(902, 60, 30), dummy(903, 140, 72)];
    run(s, 120, FIRE);
    expect(lost(s, 901)).toBe(0);
    run(s, 20, FIRE);
    expect(lost(s, 901)).toBeGreaterThan(0);
    expect(lost(s, 902)).toBeGreaterThan(0);
    expect(lost(s, 903)).toBe(0);
    const t = engineer("magnetfield");
    t.enemies = [enemy(901, 110, 72)];
    t.enemies[0]!.stunTicks = 999;
    run(t, 30, FIRE);
    expect(t.enemies[0]!.x).toBeLessThan(105);
  });

  it("유압 해머: 0.8초마다 주변을 내려찍어 기절", () => {
    const s = engineer("hydraulichammer");
    s.enemies = [dummy(901, 85, 72), dummy(902, 120, 72)];
    run(s, 50, FIRE);
    expect(lost(s, 901)).toBeGreaterThan(0);
    expect(lost(s, 902)).toBe(0);
    const t = engineer("hydraulichammer");
    t.enemies = [enemy(901, 80, 72)];
    run(t, 50, FIRE);
    expect(t.enemies[0]!.stunTicks).toBeGreaterThan(0);
  });

  it("지뢰 투척기: 조준한 곳으로 지뢰가 날아가 떨어지고, 잠깐 뒤 적이 닿으면 터짐. 6개가 넘으면 오래된 것부터 터짐", () => {
    const s = engineer("minelauncher");
    run(s, 250, FIRE);
    expect(s.devices!.filter((d) => d.kind === "mine")).toHaveLength(6);
    const t = engineer("minelauncher");
    t.enemies = [dummy(901, 100, 72)];
    run(t, 10, FIRE);
    const mine = t.devices!.find((d) => d.kind === "mine")!;
    expect(mine.fly).toBeGreaterThan(0);
    expect(mine.x).toBeLessThan(100);
    expect(lost(t, 901)).toBe(0);
    run(t, 60, FIRE);
    expect(lost(t, 901)).toBeGreaterThan(0);
  });

  it("사거리 안을 누르면 지뢰·위성 포가 누른 곳으로 (거리 단계 12픽셀), 밖이면 사거리 끝", () => {
    const near = { ...FIRE, aimX: 100 * 4 };
    const s = engineer("minelauncher");
    run(s, 1, near);
    expect(s.devices![0]!.toX).toBeCloseTo(60 + 48);
    const t = engineer("orbitalcannon");
    run(t, 1, near);
    expect(t.devices![0]!.x).toBeCloseTo(60 + 48);
    const u = engineer("orbitalcannon");
    run(u, 1, FIRE);
    expect(u.devices![0]!.x).toBeCloseTo(60 + u.player.stats.range);
  });

  it("궤도 위성 포: 조준한 적 자리에 표시 → 0.5초 뒤 낙하", () => {
    const s = engineer("orbitalcannon");
    s.enemies = [dummy(901, 100, 72)];
    run(s, 20, FIRE);
    expect(s.devices!.some((d) => d.kind === "strike")).toBe(true);
    const before = lost(s, 901);
    run(s, 15);
    expect(lost(s, 901)).toBeGreaterThan(before);
  });

  it("과부하 리액터: 4초 조사하면 두 배, 끝나면 2초 과열", () => {
    const s = engineer("overreactor");
    s.enemies = [dummy(901, 100, 72)];
    run(s, 240, FIRE);
    expect(s.player.boostTicks).toBeGreaterThan(0);
    run(s, 300, FIRE);
    expect(s.player.overheatTicks).toBeGreaterThan(0);
    const before = lost(s, 901);
    run(s, 60, FIRE);
    expect(lost(s, 901)).toBe(before);
  });

  it("레이저가 아닌 무기도 렌즈(범위)·스플리터(보조 레이저)·프리즘(범위 피해) 효과", () => {
    // 렌즈: 해머 충격 범위가 넓어져 조금 먼 적도 맞음
    const far = 60 + 44 + 5 + 3;
    const base = engineer("hydraulichammer");
    base.enemies = [dummy(901, far, 72)];
    run(base, 1, FIRE);
    expect(lost(base, 901)).toBe(0);
    const lens = engineer("hydraulichammer", "highLens");
    lens.enemies = [dummy(901, far, 72)];
    run(lens, 1, FIRE);
    expect(lost(lens, 901)).toBeGreaterThan(0);
    // 스플리터: 지뢰 투척기도 가까운 적에게 보조 레이저
    const sp = engineer("minelauncher", "beamSplitter");
    sp.enemies = [dummy(901, 60, 110)];
    run(sp, 30, { ...FIRE, aimX: 1000 });
    expect(lost(sp, 901)).toBeGreaterThan(0);
    // 프리즘: 해머 범위 피해 +15%
    const pr = engineer("hydraulichammer", "refractPrism");
    pr.enemies = [dummy(901, 90, 72)];
    run(pr, 1, FIRE);
    const plain = engineer("hydraulichammer");
    plain.enemies = [dummy(901, 90, 72)];
    run(plain, 1, FIRE);
    expect(lost(pr, 901)).toBeCloseTo(lost(plain, 901) * 1.15);
  });

  it("얻을 수 있는 무기는 기계공학자 전용 레이저만, 패시브는 자기 전용 + 공용", () => {
    const s = engineer();
    expect(weaponPool(s).every((id) => (WEAPONS[id] as WeaponDef).exclusive === "engineer")).toBe(true);
    expect(weaponPool(s)).toHaveLength(10);
    const pool = passivePool(s);
    expect(pool).toContain("highLens");
    expect(pool).not.toContain("ricochet");
  });
});
