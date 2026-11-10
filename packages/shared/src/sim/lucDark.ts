// 루시퍼 1페이즈: 기둥 둘이 부서진 뒤 어둠의 기둥이 사람마다 따라다니며 20초마다 내리침 → 맞으면 어둠의 세계
// 어둠의 세계: 치유 -100% · 아이템 사용 불가 · 사거리·공격 속도·이동 속도 -50% · 그 사람 몬스터를 다 잡으면 돌아옴 (다른 사람은 못 봄·못 때림)
// 체력 30줄부터 30초마다 악마의 불길 4마리: 어둠 화살 · 어둠 화살비
import type { StatMod } from "../stats";
import { recalcStats } from "./items";
import { addShape } from "./hazards";
import { lucRng, lucSpot, lucTargets, near } from "./lucKit";
import type { LucFight } from "./lucTypes";
import { allPlayers, eachSeat } from "./party";
import { damagePlayer } from "./combat";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, enemyShot, makeEnemy } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 어둠의 기둥: 따라가는 빠르기 · 내리치는 간격 · 멈추고 깜빡이는 틱 · 반지름 */
  DARK_SPEED: 0.85,
  DARK_GAP: 1200,
  DARK_LOCK: 60,
  DARK_R: 52,
  /** 어둠의 세계 몬스터 수 · 몸 닿는 피해 · 떨어져 나오는 거리 */
  SHADES: 4,
  SHADE_HIT: 6,
  SHADE_SPREAD: 60,
  /** 어둠의 세계 능력치 배율 (사거리·공격 속도·이동 속도) */
  DARK_MUL: 0.5,
  /** 악마의 불길: 한 번에 수 · 다시 나오는 틱 · 화살 간격 · 화살비 간격 · 화살 피해 · 화살비 피해 */
  FLAMES: 4,
  FLAME_GAP: 1800,
  ARROW_GAP: 150,
  RAIN_GAP: 260,
  ARROW_DMG: 16,
  RAIN_DMG: 22,
};
export { R as LUC_DARK_RULES };

/** 틱마다 (루시퍼가 부름, 기둥 둘 이상 부서진 1페이즈): 어둠의 기둥 */
export function darkTick(s: RunState, f: LucFight, spawned: EnemyState[]): void {
  const players = allPlayers(s);
  f.dark ??= players.map((p, i) => [p.x, p.y + 60, s.tick + 300 + i * 120]);
  players.forEach((p, i) => {
    const d = f.dark![i]!;
    const lock = s.tick >= d[2]! - R.DARK_LOCK;
    if (p.hp <= 0 || p.raidDark) {
      d[2] = Math.max(d[2]!, s.tick + R.DARK_LOCK + 30);
      return;
    }
    if (!lock) {
      const dx = p.x - d[0]!;
      const dy = p.y - d[1]!;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len > 1) {
        d[0]! += (dx / len) * Math.min(len, R.DARK_SPEED);
        d[1]! += (dy / len) * Math.min(len, R.DARK_SPEED);
      }
    }
    if (s.tick < d[2]!) return;
    d[2] = s.tick + R.DARK_GAP;
    addEffect(s, { kind: "lucFx", from: "dark", x: d[0]!, y: d[1]!, dirX: 0, dirY: 0, size: R.DARK_R, maxTicks: 24, foe: true });
    if (near(p, d[0]!, d[1]!, R.DARK_R + p.r) && p.dashTicks <= 0) intoDark(s, i, spawned);
  });
}

/** 어둠의 세계로 (그 사람 몬스터 넷) */
function intoDark(s: RunState, seat: number, spawned: EnemyState[]): void {
  eachSeat(s, (i) => {
    if (i !== seat) return;
    const p = s.player;
    p.raidDark = true;
    recalcStats(s);
    const rng = lucRng(s, "shade", seat);
    for (let k = 0; k < R.SHADES; k++) {
      const e = makeEnemy(s, "lucshade", p.x + (rng.nextFloat() - 0.5) * 2 * R.SHADE_SPREAD, p.y + (rng.nextFloat() - 0.5) * 2 * R.SHADE_SPREAD, 1, 30);
      e.count = seat;
      spawned.push(e);
    }
    addEffect(s, { kind: "lucFx", from: "toDark", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 30, maxTicks: 30, foe: true });
  });
}

/** 어둠의 세계 몬스터 (틱마다): 그 사람만 쫓고 그 사람만 때림 · 다 잡히면 그 사람은 돌아옴 */
export function updateShade(s: RunState, e: EnemyState): void {
  const p = allPlayers(s)[e.count];
  if (!p || !p.raidDark || p.hp <= 0) {
    e.hp = 0;
    return;
  }
  const dx = p.x - e.x;
  const dy = p.y - e.y;
  const d = Math.sqrt(dx * dx + dy * dy) || 1;
  e.x += (dx / d) * 0.75;
  e.y += (dy / d) * 0.75;
  if (--e.timer <= 0 && d < e.r + p.r + 2) {
    e.timer = 40;
    eachSeat(s, (i) => i === e.count && damagePlayer(s, R.SHADE_HIT, "lucshade"));
  }
}

/** 틱마다 (레이드): 몬스터를 다 잡은 사람은 어둠의 세계에서 돌아옴 */
export function darkReturn(s: RunState): void {
  eachSeat(s, (i) => {
    const p = s.player;
    if (!p.raidDark) return;
    if (p.hp > 0 && s.enemies.some((e) => e.kind === "lucshade" && e.count === i && e.hp > 0)) return;
    p.raidDark = false;
    recalcStats(s);
    addEffect(s, { kind: "lucFx", from: "fromDark", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 30, maxTicks: 30, foe: true });
  });
}

/** 어둠의 세계 능력치 (recalcStats, sim/station.stationMods) */
export function darkMods(p: PlayerState): StatMod[] {
  if (!p.raidDark) return [];
  return [
    { stat: "range", mul: R.DARK_MUL },
    { stat: "attackSpeed", mul: R.DARK_MUL },
    { stat: "moveSpeed", mul: R.DARK_MUL },
  ];
}

/** 받는 피해 배율 (sim/classTaken): 어둠의 세계 사람은 자기 몬스터만 · 그 몬스터는 그 사람만 때릴 수 있음 */
export function darkTaken(s: RunState, e: EnemyState): number {
  if (!s.raidBoss) return 1;
  const mine = e.kind === "lucshade" && e.count === (s.seat ?? 0);
  if (s.player.raidDark) return mine ? 1 : 0;
  return e.kind === "lucshade" ? 0 : 1;
}

/** 악마의 불길 넷 (30초마다) */
export function flameTick(s: RunState, f: LucFight, spawned: EnemyState[]): void {
  if (s.tick < (f.nextFlames ?? 0)) return;
  f.nextFlames = s.tick + R.FLAME_GAP;
  const rng = lucRng(s, "flame");
  for (let i = 0; i < R.FLAMES; i++) {
    const [x, y] = lucSpot(rng, 60);
    spawned.push(makeEnemy(s, "lucflame", x, y, 1, 60 + i * 20));
    addEffect(s, { kind: "lucFx", from: "flameIn", x, y, dirX: 0, dirY: 0, size: 24, maxTicks: 30, foe: true });
  }
}

/** 악마의 불길 하나 (틱마다): 천천히 다가오며 어둠 화살(세 갈래) · 어둠 화살비(사람 둘레 다섯 군데) */
export function updateFlame(s: RunState, e: EnemyState, toP: readonly [number, number]): void {
  if (s.raidBoss?.fight?.cut) return;
  e.x += toP[0] * 0.35;
  e.y += toP[1] * 0.35;
  e.count++;
  if (e.count % R.ARROW_GAP === 0) {
    for (const k of [-0.25, 0, 0.25]) {
      const dx = toP[0] - toP[1] * k;
      const dy = toP[1] + toP[0] * k;
      enemyShot(s, e.x, e.y, dx, dy, 1.8, R.ARROW_DMG).from = "lucArrow";
    }
  }
  if (e.count % R.RAIN_GAP === R.RAIN_GAP / 2) {
    const list = lucTargets(s);
    if (list.length === 0) return;
    const rng = lucRng(s, "rain", e.id);
    const [, p] = list[rng.int(0, list.length - 1)]!;
    for (let k = 0; k < 5; k++) addShape(s, 60, { x: p.x + (rng.nextFloat() - 0.5) * 70, y: p.y + (rng.nextFloat() - 0.5) * 70, radius: 16, damage: R.RAIN_DMG, fx: "lucFx", from: "rain", by: "lucflame" });
  }
}
