import { describe, expect, it } from "vitest";
import { WEAPONS, type CharmKind, type WeaponId } from "../content";
import { damageEnemy } from "./combat";
import { EMPTY_INPUT, stepSim, type ProjectileState, type RunState } from "./index";
import { weaponPool } from "./loot";
import { recalcStats } from "./items";
import { charmFields, charmHit, updateCharms } from "./talisman";
import { FIRE, enemy, hero } from "./perkTestUtil";

/** 부적 한 장 (피해 10) */
function charm(kind: CharmKind, extra: Partial<ProjectileState> = {}): ProjectileState {
  return { id: 999, fromPlayer: true, x: 100, y: 72, prevX: 100, prevY: 72, r: 2, vx: 3, vy: 0, damage: 10, ticksLeft: 60, charm: kind, ...extra };
}

/** 같은 적에게 n번 맞힘. 맞을 때마다 줄어든 체력 */
function hitN(s: RunState, kind: CharmKind, n: number): number[] {
  const e = s.enemies[0]!;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const before = e.hp;
    charmHit(s, charm(kind), e, 1, 0, []);
    out.push(before - e.hp);
  }
  return out;
}

function mystic(weapon: WeaponId, ...perks: Parameters<typeof hero>[1][]): RunState {
  const s = hero("mystic", ...perks);
  s.player.weaponId = weapon;
  recalcStats(s);
  return s;
}

describe("음양사 부적", () => {
  it("음양사는 부적(전용 무기)만 얻음", () => {
    const s = hero("mystic");
    const pool = weaponPool(s);
    expect(pool.length).toBeGreaterThan(0);
    for (const id of pool) expect(WEAPONS[id]).toMatchObject({ exclusive: "mystic" });
  });

  it("수제: 맞힐수록 +15%, 5번째는 2.5배, 그 뒤 처음으로", () => {
    const s = mystic("handcharm");
    s.enemies = [enemy(1, 100, 72)];
    const d = hitN(s, "ramp", 6);
    expect(d.map((x) => Math.round(x * 10) / 10)).toEqual([10, 11.5, 13, 14.5, 25, 10]);
  });

  it("강력: 5번째에 가까운 다른 적 3명도 맞음", () => {
    const s = mystic("mightcharm");
    s.enemies = [enemy(1, 100, 72), enemy(2, 120, 72), enemy(3, 130, 72), enemy(4, 140, 72), enemy(5, 150, 72), enemy(6, 230, 140)];
    hitN(s, "smite", 5);
    const hurt = s.enemies.slice(1).map((e) => e.hp < 9999);
    expect(hurt).toEqual([true, true, true, false, false]);
  });

  it("수양: 3장까지 붙고 0.5초마다 장 수만큼 피해, 3초 뒤 떨어짐", () => {
    const s = mystic("sealcharm");
    s.enemies = [enemy(1, 100, 72)];
    hitN(s, "seal", 4);
    const e = s.enemies[0]!;
    expect(e.seal).toBe(3);
    const hp = e.hp;
    s.tick = 29;
    for (let i = 0; i < 2; i++) {
      s.tick++;
      updateCharms(s);
    }
    expect(hp - e.hp).toBeCloseTo(3 * 10 * 0.25);
    for (let i = 0; i < 200; i++) updateCharms(s);
    expect(e.seal).toBe(0);
  });

  it("번개: 벽 통과, 3번째에 한 번 더 맞힘", () => {
    expect(charmFields(WEAPONS.thundercharm, 5)).toMatchObject({ ghost: true });
    const s = mystic("thundercharm");
    s.enemies = [enemy(1, 100, 72)];
    expect(hitN(s, "spark", 3)).toEqual([10, 10, 20]);
  });

  it("불꽃: 맞으면 불타고, 5번째는 3배 + 주변 폭발", () => {
    const s = mystic("flamecharm");
    s.enemies = [enemy(1, 100, 72), enemy(2, 110, 72)];
    const d = hitN(s, "blaze", 5);
    expect(d[4]).toBe(30);
    expect(s.enemies[0]!.burnTicks).toBeGreaterThan(0);
    expect(s.enemies[1]!.hp).toBe(9999 - 15);
  });

  it("얼음: 5번째에 1.5초 경직 (움직이지 않음)", () => {
    const s = mystic("frostcharm");
    s.enemies = [enemy(1, 60, 40)];
    hitN(s, "frost", 5);
    const e = s.enemies[0]!;
    expect(e.stunTicks).toBe(90);
    const x = e.x;
    for (let i = 0; i < 30; i++) stepSim(s, EMPTY_INPUT);
    expect(e.x).toBe(x);
  });

  it("벚꽃: 보통 빠르기로 나갔다가 점점 원래 빠르기까지 느려짐", () => {
    const s = mystic("blossomcharm");
    s.enemies = [];
    stepSim(s, FIRE);
    const pr = s.projectiles.find((p) => p.charm === "bloom")!;
    const speed = () => Math.hypot(pr.vx, pr.vy);
    expect(speed()).toBeGreaterThan(2);
    for (let i = 0; i < 30; i++) stepSim(s, EMPTY_INPUT);
    expect(speed()).toBeLessThan(1);
    for (let i = 0; i < 60; i++) stepSim(s, EMPTY_INPUT);
    expect(speed()).toBeCloseTo(s.player.stats.projectileSpeed);
  });

  it("벚꽃: 큰 꽃이 적을 뚫고, 5번째에 그 자리 폭발", () => {
    expect(charmFields(WEAPONS.blossomcharm, 5)).toMatchObject({ r: 8 });
    expect(WEAPONS.blossomcharm.pierce).toBeGreaterThan(10);
    const s = mystic("blossomcharm");
    s.enemies = [enemy(1, 100, 72), enemy(2, 120, 72)];
    hitN(s, "bloom", 5);
    expect(s.enemies[1]!.hp).toBe(9999 - 15);
  });

  it("빛: 3번째에 적을 밀어냄", () => {
    const s = mystic("lightcharm");
    s.enemies = [enemy(1, 100, 72)];
    hitN(s, "radiant", 2);
    const x = s.enemies[0]!.x;
    hitN(s, "radiant", 1);
    expect(s.enemies[0]!.x - x).toBeGreaterThan(20);
  });

  it("어둠: 부채꼴 5장, 5번 맞히면 등 뒤에서 유도 부적 5장이 나가 범위로 터짐", () => {
    const s = mystic("darkcharm");
    stepSim(s, FIRE);
    expect(s.projectiles.filter((p) => p.charm === "shade")).toHaveLength(5);
    s.enemies = [enemy(1, 100, 72)];
    const out: ProjectileState[] = [];
    for (let i = 0; i < 5; i++) charmHit(s, charm("shade"), s.enemies[0]!, 1, 0, out);
    expect(out).toHaveLength(5);
    expect(out.every((p) => p.homing && p.spirit === "seek" && (p.blast ?? 0) > 0)).toBe(true);
    // 바라보는 쪽(오른쪽)의 반대로 나감
    expect(out.every((p) => p.vx * s.player.faceX + p.vy * s.player.faceY < 0)).toBe(true);
    for (let i = 0; i < 4; i++) charmHit(s, charm("shade"), s.enemies[0]!, 1, 0, out);
    expect(out).toHaveLength(5);
    charmHit(s, charm("shade"), s.enemies[0]!, 1, 0, out);
    expect(out).toHaveLength(10);
  });

  it("땅: 지나가는 자리 주변 피해, 5번째에 공격 속도 증가", () => {
    const s = mystic("earthcharm");
    stepSim(s, FIRE);
    const pr = s.projectiles[0]!;
    expect(pr.aura).toBeGreaterThan(0);
    s.enemies = [enemy(1, pr.x + 10, pr.y + 8)];
    s.tick = 14;
    s.tick++;
    updateCharms(s);
    expect(s.enemies[0]!.hp).toBeLessThan(9999);
    hitN(s, "quake", 5);
    expect(s.player.hasteTicks).toBe(180);
  });

  it("부적은 적마다 따로 붙고, 추가 효과가 터지면 떨어짐", () => {
    const s = mystic("handcharm");
    s.enemies = [enemy(1, 100, 72), enemy(2, 140, 72)];
    const [a, b] = s.enemies as [ReturnType<typeof enemy>, ReturnType<typeof enemy>];
    damageEnemy(s, a, 5, 1, 0);
    expect(a.charms ?? 0).toBe(0);
    for (let i = 0; i < 4; i++) charmHit(s, charm("ramp"), a, 1, 0, []);
    charmHit(s, charm("ramp"), b, 1, 0, []);
    expect([a.charms, b.charms]).toEqual([4, 1]);
    charmHit(s, charm("ramp"), a, 1, 0, []);
    expect(a.charms).toBe(0);
    // 다른 부적에 맞으면 새로 셈
    charmHit(s, charm("spark"), b, 1, 0, []);
    expect([b.charmKind, b.charms]).toEqual(["spark", 1]);
  });
});
