import { describe, expect, it } from "vitest";
import { MIRYU as M } from "../weaponsMiryu";
import { MIRYU_PERKS as K } from "../itemsMiryu";
import type { WeaponId } from "../content";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { damagePlayer } from "./combat";
import { classMoveMul } from "./moveMul";
import { enemy, FIRE } from "./perkTestUtil";
import type { ProjectileState } from "./types";

const ALL: WeaponId[] = ["mrSeiran", "mrMoon", "mrTorrent", "mrVortex", "mrMirror", "mrWillow", "mrCrest", "mrFrost", "mrAbyss", "mrFormless"];
const IDLE = { ...FIRE, attack: false };

function miryu(weapon: WeaponId = "mrSeiran", ...perks: string[]): RunState {
  const s = createRun(5, "miryu");
  s.player.weaponId = weapon;
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 100;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.player.mrRoom = `${s.floor}/${s.roomId}`;
  s.enemies = [{ ...enemy(1, 100, 100, 99999), rootTicks: 99999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
function run(s: RunState, n: number, input = FIRE): void {
  for (let i = 0; i < n; i++) stepSim(s, input);
}
/** 베기 n번 (공격 대기 없이) */
function cuts(s: RunState, n: number): void {
  for (let i = 0; i < n; i++) {
    s.player.attackCooldown = 0;
    stepSim(s, FIRE);
  }
}
/** 적 탄 하나 (x, y에서 왼쪽으로) */
function shot(s: RunState, x: number, y: number): ProjectileState {
  const pr = { id: s.nextId++, fromPlayer: false, x, y, prevX: x, prevY: y, r: 3, vx: -2, vy: 0, damage: 5, ticksLeft: 200 };
  s.projectiles.push(pr);
  return pr;
}

describe("미류", () => {
  for (const w of ALL) {
    it(`대태도 ${w}: 적에게 피해`, () => {
      const s = miryu(w);
      run(s, 240);
      expect(lost(s)).toBeGreaterThan(0);
    });
  }

  it("3연격: 물결 가르기 → 역류 베기 → 해룡 일섬 (앞으로 미끄러짐), 벨 때마다 물길", () => {
    const s = miryu();
    cuts(s, 2);
    const cut = s.effects.filter((f) => f.kind === "mrCut");
    expect(cut.map((f) => f.style)).toEqual([1, -1]);
    expect(s.player.mrStreams?.length).toBe(2);
    const x0 = s.player.x;
    cuts(s, 1);
    expect(s.effects.some((f) => f.kind === "mrFlash")).toBe(true);
    expect(s.player.x).toBeGreaterThan(x0 + 20);
    expect(s.player.mrStreams?.length).toBe(3);
    expect(s.player.mrStep).toBe(0);
  });

  it("물길: 닿은 적을 흐르는 쪽으로 실어 나르며 벰, 시간이 지나면 사라짐", () => {
    const s = miryu();
    s.enemies = [{ ...enemy(1, 120, 150, 9999), rootTicks: 9999 }];
    s.player.mrStreams = [{ pts: [[100, 150], [160, 150], [220, 150]], t: 100, t0: 100, w: 10 }];
    const x0 = s.enemies[0]!.x;
    run(s, 30, IDLE);
    expect(s.enemies[0]!.x).toBeGreaterThan(x0 + 10);
    expect(lost(s)).toBeGreaterThan(0);
    run(s, 100, IDLE);
    expect(s.player.mrStreams).toBeUndefined();
  });

  it("내 물길 위에서는 빨리 움직임 (물길 타기는 더)", () => {
    const s = miryu();
    s.player.mrStreams = [{ pts: [[40, 100], [80, 100]], t: 100, t0: 100, w: 10 }];
    expect(classMoveMul(s.player, 0)).toBeCloseTo(M.surf);
    const t = miryu("mrSeiran", "mrSurf");
    t.player.mrStreams = s.player.mrStreams;
    expect(classMoveMul(t.player, 0)).toBeCloseTo(K.mrSurf.move);
  });

  it("휘는 칼날: 베기 밖 먼 적도 벰 (유엽은 셋을 이어서)", () => {
    const s = miryu();
    s.enemies = [{ ...enemy(1, 170, 100, 9999), rootTicks: 9999 }];
    cuts(s, 1);
    expect(s.effects.some((f) => f.kind === "mrBend")).toBe(true);
    expect(lost(s)).toBeGreaterThan(0);
    const w = miryu("mrWillow");
    w.enemies = [1, 2, 3].map((i) => ({ ...enemy(i, 150 + i * 20, 100 + i * 10, 9999), rootTicks: 9999 }));
    cuts(w, 1);
    expect(w.effects.filter((f) => f.kind === "mrBend").length).toBe(3);
  });

  it("흘리기: 벤 직후 칼 앞 적 탄을 물방울로 받고, 일섬에 물칼날로 되돌림", () => {
    const s = miryu();
    s.enemies = [{ ...enemy(1, 200, 100, 9999), rootTicks: 9999 }];
    cuts(s, 1);
    shot(s, 90, 100);
    run(s, 2, IDLE);
    expect(s.projectiles.some((p) => !p.fromPlayer)).toBe(false);
    expect(s.player.mrDrops).toBe(1);
    cuts(s, 2);
    expect(s.player.mrDrops).toBe(0);
    expect(s.player.mrBlades?.length ?? 0).toBeGreaterThan(0);
    const before = lost(s);
    run(s, 30, IDLE);
    expect(lost(s)).toBeGreaterThan(before);
  });

  it("흘리기: 대시 중엔 몸 둘레 탄을 받음 · 물방울이 가득이면 못 받음", () => {
    const s = miryu();
    s.player.dashTicks = 6;
    shot(s, 70, 100);
    stepSim(s, IDLE);
    expect(s.player.mrDrops).toBe(1);
    const t = miryu();
    t.player.mrDrops = M.dropMax;
    t.player.mrGuard = 10;
    shot(t, 90, 100);
    stepSim(t, IDLE);
    expect(t.projectiles.some((p) => !p.fromPlayer)).toBe(true);
  });

  it("해류 게이지가 차면 천류 해방: 해룡이 물길을 따라 흐르고 폭포로 내리꽂힘", () => {
    const s = miryu();
    s.enemies = [{ ...enemy(1, 200, 100, 99999), rootTicks: 99999 }];
    cuts(s, 2);
    s.player.mrFlow = M.flowMax;
    cuts(s, 1);
    expect(s.player.mrDragon).toBeDefined();
    expect(s.player.mrFlow).toBe(0);
    expect(s.effects.some((f) => f.kind === "mrRelease")).toBe(true);
    const before = lost(s);
    for (let i = 0; i < 400 && s.player.mrDragon; i++) stepSim(s, IDLE);
    expect(s.player.mrDragon).toBeUndefined();
    expect(s.effects.some((f) => f.kind === "mrFall")).toBe(true);
    expect(s.player.mrStreams).toBeUndefined();
    expect(lost(s)).toBeGreaterThan(before + s.player.stats.damage * M.fallMul * 0.5);
  });

  it("게이지는 벨수록 참 · 해룡이 나와 있는 동안은 안 참", () => {
    const s = miryu();
    s.enemies = [1, 2, 3].map((i) => ({ ...enemy(i, 100, 80 + i * 10, 9999), rootTicks: 9999 }));
    cuts(s, 1);
    expect(s.player.mrFlow ?? 0).toBeGreaterThanOrEqual(M.gainHit * 3);
    const t = miryu("mrSeiran", "mrBreath");
    t.enemies = s.enemies.map((e) => ({ ...e, hp: e.maxHp }));
    cuts(t, 1);
    expect(t.player.mrFlow!).toBeGreaterThan(s.player.mrFlow!);
  });

  it("와류: 셋째 타가 회오리 베기 + 둥근 물길 · 무형: 걸어온 길이 물길", () => {
    const s = miryu("mrVortex");
    cuts(s, 3);
    expect(s.effects.some((f) => f.kind === "mrWhirl")).toBe(true);
    expect(s.player.mrStreams?.some((w) => w.ring)).toBe(true);
    const f = miryu("mrFormless");
    run(f, 30, { ...IDLE, moveY: 100 });
    cuts(f, 1);
    expect(f.player.mrStreams!.length).toBe(2);
  });

  it("빙류: 물길에 닿으면 느려짐 · 폭포: 물길이 사라질 때 무너짐", () => {
    const s = miryu("mrFrost", "mrCascade");
    s.enemies = [{ ...enemy(1, 200, 150, 9999) }];
    s.player.mrStreams = [{ pts: [[180, 150], [220, 150]], t: 5, t0: 100, w: 10 }];
    run(s, 6, IDLE);
    expect(s.enemies[0]!.slowTicks ?? 0).toBeGreaterThan(0);
    expect(s.effects.some((f) => f.kind === "mrShatter")).toBe(true);
  });

  it("물줄기 걸음: 대시한 길이 물길 · 해룡 비늘: 게이지 절반 넘으면 덜 아픔", () => {
    const s = miryu("mrSeiran", "mrCourse");
    s.player.dashTicks = 8;
    s.player.dashDirX = 1;
    s.player.dashDirY = 0;
    run(s, 20, IDLE);
    expect(s.player.mrStreams?.length).toBe(1);
    const a = miryu();
    const b = miryu("mrSeiran", "mrScale");
    b.player.mrFlow = M.flowMax * 0.6;
    for (const t of [a, b]) {
      t.player.hp = t.player.stats.maxHp = 1000;
      t.player.invulnTicks = 0;
      damagePlayer(t, 100);
    }
    expect(1000 - b.player.hp).toBeLessThan(1000 - a.player.hp);
  });

  it("방이 바뀌면 물길·해룡을 거두고 게이지·물방울은 남김", () => {
    const s = miryu();
    cuts(s, 1);
    s.player.mrFlow = 40;
    s.player.mrDrops = 2;
    s.player.mrRoom = "other";
    stepSim(s, IDLE);
    expect(s.player.mrStreams).toBeUndefined();
    expect(s.player.mrFlow).toBe(40);
    expect(s.player.mrDrops).toBe(2);
  });
});
