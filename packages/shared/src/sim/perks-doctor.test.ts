import { describe, expect, it } from "vitest";
import { WEAPONS, type WeaponDef, type WeaponId } from "../content";
import type { PassiveId } from "../items";
import { damagePlayer, healPlayer } from "./combat";
import { createRun, type RunState } from "./index";
import { recalcStats } from "./items";
import { passivePool, weaponPool } from "./loot";
import { enemy, FIRE, run } from "./perkTestUtil";

/** 의사로 시작해 무기·아이템을 가진 채, 적 없는 방 가운데 */
function doctor(weapon: WeaponId = "syringe", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "doctor");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.enemies = [];
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 72;
  return s;
}

const dummy = (id: number, x: number, y: number) => ({ ...enemy(id, x, y), kind: "dummy" as const });
const lost = (s: RunState, id: number) => {
  const e = s.enemies.find((x) => x.id === id)!;
  return e.maxHp - e.hp;
};

describe("의사 초과 치료", () => {
  it("체력을 먼저 채우고 넘친 회복은 보호막 (최대 체력 35%까지, 체력 관리면 60%)", () => {
    const s = doctor();
    s.player.hp = 95;
    healPlayer(s, 20);
    expect(s.player.hp).toBe(100);
    expect(s.player.shieldPts).toBe(15);
    healPlayer(s, 100);
    expect(s.player.shieldPts).toBeCloseTo(100 * 0.35);
    const t = doctor("syringe", "healthCare");
    healPlayer(t, 100);
    expect(t.player.shieldPts).toBeCloseTo(100 * 0.6);
  });

  it("서든데스·다른 캐릭터는 보호막이 생기지 않음", () => {
    const s = createRun(3, "doctor", [], true);
    healPlayer(s, 50);
    expect(s.player.shieldPts ?? 0).toBe(0);
    const w = createRun(3, "warden");
    healPlayer(w, 50);
    expect(w.player.shieldPts ?? 0).toBe(0);
  });

  it("직접 피해의 4% 회복, 초당 3까지", () => {
    const s = doctor();
    s.player.hp = 40;
    s.enemies = [dummy(901, 100, 72)];
    run(s, 60, FIRE);
    expect(s.player.hp - 40).toBeCloseTo(lost(s, 901) * 0.04);
    const t = doctor();
    t.player.hp = 40;
    t.player.stats = { ...t.player.stats, damage: 500 };
    t.enemies = [dummy(901, 100, 72)];
    run(t, 60, FIRE);
    expect(t.player.hp).toBeCloseTo(43);
  });

  it("포션도 넘치면 보호막, 처방전이면 +50% (보호막 최대치까지)", () => {
    const s = doctor("syringe", "prescription");
    s.player.hp = 85;
    s.player.useSlots = ["potion", null];
    run(s, 1, { ...FIRE, attack: false, useSlot: 1 });
    expect(s.player.hp).toBe(100);
    expect(s.player.shieldPts).toBeCloseTo(Math.min(100 * 0.35, 100 * 0.35 * 1.5 - 15));
  });

  it("보호막이 먼저 깎이고, 항체 반응이면 막은 양의 200%를 주변에 돌려줌", () => {
    const s = doctor("syringe", "antibody");
    s.player.shieldPts = 20;
    s.enemies = [dummy(901, 80, 72)];
    damagePlayer(s, 10);
    expect(s.player.shieldPts).toBe(10);
    expect(s.player.hp).toBe(100);
    run(s, 1);
    expect(lost(s, 901)).toBeCloseTo(20);
  });

  it("의사 가운: 받는 피해 -15%, 맞은 뒤 1초 빨라짐", () => {
    const s = doctor("syringe", "doctorGown");
    damagePlayer(s, 10);
    expect(s.player.hp).toBeCloseTo(100 - 8.5);
    expect(s.player.gownTicks).toBe(60);
  });
});

describe("의사 패시브", () => {
  it("건강 체질: 보호막이 있으면 피해 +20% · 건강 검진: 3초 가득이면 다음 공격 3배", () => {
    // 주사기는 날아가서 맞음 (한 발 쏘고 기다림)
    const base = doctor();
    base.enemies = [dummy(901, 100, 72)];
    run(base, 1, FIRE);
    run(base, 12);
    expect(lost(base, 901)).toBeGreaterThan(0);
    const s = doctor("syringe", "robust");
    s.player.shieldPts = 5;
    s.enemies = [dummy(901, 100, 72)];
    run(s, 1, FIRE);
    run(s, 12);
    expect(lost(s, 901)).toBeCloseTo(lost(base, 901) * 1.2);
    const t = doctor("syringe", "checkup");
    t.enemies = [dummy(901, 100, 72)];
    run(t, 300);
    run(t, 1, FIRE);
    run(t, 12);
    expect(lost(t, 901)).toBeCloseTo(lost(base, 901) * 3);
  });

  it("과잉 진료: 보호막이 가득이면 공격 간격이 짧아짐", () => {
    const s = doctor("syringe", "overtreat");
    s.player.shieldPts = 100 * 0.35;
    s.enemies = [dummy(901, 100, 72)];
    run(s, 1, FIRE);
    expect(s.player.attackCooldown).toBeLessThan(9);
  });
});

describe("의사 무기", () => {
  it("주사기·알약·봉합 바늘은 날아가서 맞음 (쏜 순간엔 아직 안 맞음), 벽·사거리 끝에서 사라짐", () => {
    const s = doctor();
    s.enemies = [dummy(901, 100, 72)];
    run(s, 1, FIRE);
    expect(s.devices!.filter((d) => d.kind === "shot")).toHaveLength(1);
    expect(lost(s, 901)).toBe(0);
    run(s, 12);
    expect(lost(s, 901)).toBeGreaterThan(0);
    expect(s.devices!.filter((d) => d.kind === "shot")).toHaveLength(0);
    const t = doctor();
    run(t, 1, FIRE);
    run(t, 40);
    expect(t.devices!.filter((d) => d.kind === "shot")).toHaveLength(0);
  });

  it("메스: 앞쪽 짧은 부채꼴, 회복 3배", () => {
    const s = doctor("scalpel");
    s.player.hp = 40;
    s.enemies = [dummy(901, 85, 72), dummy(902, 120, 72)];
    run(s, 30, FIRE);
    expect(lost(s, 902)).toBe(0);
    expect(s.player.hp - 40).toBeCloseTo(lost(s, 901) * 0.12);
  });

  it("수혈 튜브: 한 적에 꽂혀 계속, 회복 4배", () => {
    const s = doctor("transfusion");
    s.player.hp = 40;
    s.enemies = [dummy(901, 100, 72)];
    run(s, 30, FIRE);
    expect(s.player.tubeTargetId).toBe(901);
    expect(s.player.hp - 40).toBeCloseTo(lost(s, 901) * 0.16);
  });

  it("제세동기: 앞쪽 범위 전기 충격, 기절", () => {
    const s = doctor("defibrillator");
    s.enemies = [enemy(901, 85, 72)];
    run(s, 1, FIRE);
    expect(s.enemies[0]!.stunTicks).toBeGreaterThan(0);
  });

  it("봉합 바늘: 꽂힌 적끼리 실로 이어져 사이의 적이 피해, 3초 뒤 봉합으로 가운데로 끌려 모임", () => {
    const s = doctor("sutureneedle");
    s.enemies = [enemy(901, 100, 72, 9999), enemy(902, 60, 120, 9999), enemy(903, 80, 96, 9999)];
    for (const e of s.enemies) e.stunTicks = 9999;
    s.player.faceX = 1;
    run(s, 1, FIRE);
    run(s, 60, { ...FIRE, aimX: 0, aimY: 1000 });
    expect(s.devices!.filter((d) => d.kind === "needle")).toHaveLength(2);
    expect(lost(s, 903)).toBeGreaterThan(0);
    const before = Math.abs(s.enemies[0]!.x - s.enemies[1]!.x);
    run(s, 160);
    expect(s.devices!.filter((d) => d.kind === "needle")).toHaveLength(0);
    expect(Math.abs(s.enemies[0]!.x - s.enemies[1]!.x)).toBeLessThan(before);
  });

  it("마취 가스통: 던진 곳에 3초 장판, 안의 적 피해·둔화", () => {
    const s = doctor("gascanister");
    s.enemies = [enemy(901, 110, 72)];
    s.enemies[0]!.stunTicks = 9999;
    run(s, 40, FIRE);
    expect(lost(s, 901)).toBeGreaterThan(0);
    expect(s.enemies[0]!.slowTicks).toBeGreaterThan(0);
  });

  it("링거 폴대: 한 바퀴 휘둘러 밀어냄", () => {
    const s = doctor("ivpole");
    s.enemies = [enemy(901, 40, 72)];
    run(s, 1, FIRE);
    expect(s.enemies[0]!.x).toBeLessThan(40);
  });

  it("알약 산탄: 가까울수록 많이 맞음", () => {
    const near = doctor("pillshot");
    near.enemies = [dummy(901, 72, 72)];
    run(near, 1, FIRE);
    run(near, 20);
    const far = doctor("pillshot");
    far.enemies = [dummy(901, 115, 72)];
    run(far, 1, FIRE);
    run(far, 20);
    expect(lost(far, 901)).toBeGreaterThan(0);
    expect(lost(near, 901)).toBeGreaterThan(lost(far, 901));
  });

  it("구급 키트: 던진 곳에서 폭발, 쓰러진 적은 확률로 회복 알약", () => {
    const s = doctor("medkitbomb");
    s.enemies = Array.from({ length: 10 }, (_, i) => enemy(901 + i, 100 + (i % 3) * 4, 66 + Math.floor(i / 3) * 4, 1));
    for (const e of s.enemies) e.stunTicks = 9999;
    run(s, 25, FIRE);
    expect(s.enemies).toHaveLength(0);
    expect(s.devices!.filter((d) => d.kind === "pill").length).toBeGreaterThan(0);
  });

  it("붕대 채찍: 앞으로 곧게, 맞은 적 속박", () => {
    const s = doctor("bandagewhip");
    s.enemies = [enemy(901, 110, 72)];
    run(s, 1, FIRE);
    expect(s.enemies[0]!.rootTicks).toBeGreaterThan(0);
  });

  it("구급차: 조준 방향에서 달려와 경로의 적을 침, 보호막 6이면 써서 왕복", () => {
    const s = doctor("ambulance");
    s.enemies = [dummy(901, 120, 72)];
    run(s, 110, FIRE);
    const once = lost(s, 901);
    expect(once).toBeGreaterThan(0);
    const t = doctor("ambulance");
    t.player.shieldPts = 12;
    t.enemies = [dummy(901, 120, 72)];
    run(t, 1, FIRE);
    expect(t.player.shieldPts).toBe(6);
    run(t, 180);
    expect(lost(t, 901)).toBeCloseTo(once * 2);
  });

  it("얻을 수 있는 무기는 의사 전용만, 패시브는 자기 전용 + 공용", () => {
    const s = doctor();
    expect(weaponPool(s).every((id) => (WEAPONS[id] as WeaponDef).exclusive === "doctor")).toBe(true);
    expect(weaponPool(s)).toHaveLength(10);
    expect(passivePool(s)).toContain("antibody");
    expect(passivePool(s)).not.toContain("highLens");
  });
});
