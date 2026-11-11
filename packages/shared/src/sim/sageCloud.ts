// 제천대성 근두운 갈래: 번개·속도 10가지 (몸 갈래와 따로 무작위, 따로 시간이 돎)
// 따라붙는 번개 셋 · 둘레 번개 여덟 · 가로지르는 돌진 · 방 전체 번개비 · 둘러싸는 번개 · 들이받기 추격 · 번개 줄기 · 지그재그 돌진 · 떨어지는 번개 · 느린 전기 구슬
// 타고 있으면 근두운이 움직일 때 제천대성도 같이 움직임 (bossSage)
import { shotDamage } from "./bossKit";
import { damagePlayer as damagePlayer_ } from "./combat";
import { rot } from "./orbit";
import { hz, sageDmg, sageRange, sageRng } from "./sageKit";
import type { EnemyState, RunState } from "./types";
import { enemyShot, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";
import { srcFn } from "./dmgSrc";
const damagePlayer = srcFn("sageCloud", () => damagePlayer_);

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  BOLT_R: 24,
  BOLT_WARN: 32,
  STORM: 18,
  RING_R: 60,
  DASH_LEN: 260,
  DASH_W: 14,
  DASH_SPEED: 6,
  RUSH: 120,
  RUSH_SPEED: 2.2,
  RUSH_HIT: 30,
  ZIG_LEN: 200,
  RAIN: 10,
  ORBS: 4,
  /** 근두운 몸 반경 (들이받기) */
  CLOUD_R: 20,
};
export { R as SAGE_CLOUD_RULES };

type G = NonNullable<EnemyState["sage"]>;
const toward = (s: RunState, g: G): [number, number] => normalize(s.player.x - g.cx, s.player.y - g.cy) ?? [1, 0];
const clampX = (x: number) => Math.max(ROOM_MIN_X + 10, Math.min(ROOM_MAX_X - 10, x));
const clampY = (y: number) => Math.max(ROOM_MIN_Y + 10, Math.min(ROOM_MAX_Y - 10, y));

function bolt(s: RunState, e: EnemyState, x: number, y: number, warn: number, appear = 0): void {
  hz(s, e, warn, { x, y, radius: R.BOLT_R, damage: sageDmg(s, e, 0.9), fx: "holy" }, appear);
}

function act(s: RunState, e: EnemyState, name: string): void {
  const g = e.sage!;
  g.cAct = name;
  g.cAt = s.tick;
}

/** 근두운으로 하는 공격 10가지: 시작하고 걸리는 틱을 돌려줌 */
export const CLOUD_MOVES: readonly ((s: RunState, e: EnemyState) => number)[] = [
  // 따라붙는 번개 셋 (그때그때 플레이어 자리)
  (s, e) => (act(s, e, "bolt3"), 70),
  // 둘레 번개 다섯
  (s, e) => {
    const rng = sageRng(s, e, "chain");
    for (let i = 0; i < 8; i++) bolt(s, e, s.player.x + rng.int(-70, 70), s.player.y + rng.int(-70, 70), 36);
    return 40;
  },
  // 가로지르는 돌진: 플레이어를 지나 방 끝까지
  (s, e) => {
    const g = e.sage!;
    const d = toward(s, g);
    g.cDir = d;
    const l = R.DASH_LEN * sageRange(e);
    hz(s, e, 30, { x: g.cx, y: g.cy, radius: 0, toX: clampX(g.cx + d[0] * l), toY: clampY(g.cy + d[1] * l), width: R.DASH_W, damage: sageDmg(s, e), fx: "gleam" });
    act(s, e, "dash");
    return 30 + R.DASH_LEN / R.DASH_SPEED;
  },
  // 방 전체 번개비
  (s, e) => {
    const rng = sageRng(s, e, "storm");
    for (let i = 0; i < R.STORM; i++) bolt(s, e, ROOM_MIN_X + 16 + rng.nextFloat() * (ROOM_MAX_X - ROOM_MIN_X - 32), ROOM_MIN_Y + 16 + rng.nextFloat() * (ROOM_MAX_Y - ROOM_MIN_Y - 32), R.BOLT_WARN + i * 8, i * 8);
    return R.STORM * 8;
  },
  // 둘러싸는 번개 → 가운데
  (s, e) => {
    const p = s.player;
    for (let i = 0; i < 8; i++) {
      const r = rot((i * Math.PI) / 4 - Math.PI);
      bolt(s, e, p.x + r[0] * R.RING_R, p.y + r[1] * R.RING_R, 36);
    }
    bolt(s, e, p.x, p.y, 62);
    return 64;
  },
  // 들이받기: 근두운이 빠르게 쫓아옴
  (s, e) => (act(s, e, "rush"), R.RUSH),
  // 번개 줄기: 근두운에서 플레이어 쪽으로 길게
  (s, e) => {
    const g = e.sage!;
    const d = toward(s, g);
    const l = 300 * sageRange(e);
    hz(s, e, 30, { x: g.cx, y: g.cy, radius: 0, toX: g.cx + d[0] * l, toY: g.cy + d[1] * l, width: 8, damage: sageDmg(s, e), fx: "gleam" });
    return 34;
  },
  // 지그재그 돌진 세 번
  (s, e) => (act(s, e, "zig"), 120),
  // 떨어지는 번개: 위에서 아래로
  (s, e) => {
    const rng = sageRng(s, e, "rain");
    for (let i = 0; i < R.RAIN; i++) {
      const x = ROOM_MIN_X + 10 + rng.nextFloat() * (ROOM_MAX_X - ROOM_MIN_X - 20);
      Object.assign(enemyShot(s, x, ROOM_MIN_Y + 4, 0, 1, 1.6 + rng.nextFloat(), shotDamage(s)), { look: "bolt" as const, r: 3 });
    }
    return 30;
  },
  // 느린 전기 구슬
  (s, e) => {
    const g = e.sage!;
    const d = toward(s, g);
    for (let i = 0; i < R.ORBS; i++) {
      const r = rot(-0.5 + i / (R.ORBS - 1));
      Object.assign(enemyShot(s, g.cx, g.cy, d[0] * r[0] - d[1] * r[1], d[0] * r[1] + d[1] * r[0], 1, shotDamage(s)), { look: "light" as const, r: 5, ticksLeft: 300 });
    }
    return 30;
  },
];

/** 근두운의 이어지는 공격 (따라붙는 번개 · 돌진 · 들이받기 · 지그재그) */
export function cloudTick(s: RunState, e: EnemyState): void {
  const g = e.sage!;
  const t = s.tick - g.cAt!;
  const p = s.player;
  if (g.cAct === "bolt3") {
    if (t % 22 === 0) bolt(s, e, p.x, p.y, R.BOLT_WARN);
    if (t >= 44) delete g.cAct;
  } else if (g.cAct === "dash") {
    if (t >= 30) move(g, g.cDir!, R.DASH_SPEED);
    if (t >= 30 + R.DASH_LEN / R.DASH_SPEED) delete g.cAct;
  } else if (g.cAct === "rush") {
    move(g, toward(s, g), R.RUSH_SPEED);
    const rr = R.CLOUD_R + p.r;
    if (t % R.RUSH_HIT === 0 && (p.x - g.cx) ** 2 + (p.y - g.cy) ** 2 < rr * rr) damagePlayer(s, sageDmg(s, e, 0.8));
    if (t >= R.RUSH) delete g.cAct;
  } else if (g.cAct === "zig") {
    const k = t % 40;
    if (k === 0) {
      const d = toward(s, g);
      // 플레이어 쪽에서 조금씩 비껴 지그재그
      const r = rot(((Math.floor(t / 40) % 2) * 2 - 1) * 0.5);
      g.cDir = [d[0] * r[0] - d[1] * r[1], d[0] * r[1] + d[1] * r[0]];
      const l = R.ZIG_LEN * sageRange(e);
      hz(s, e, 24, { x: g.cx, y: g.cy, radius: 0, toX: clampX(g.cx + g.cDir[0] * l), toY: clampY(g.cy + g.cDir[1] * l), width: R.DASH_W, damage: sageDmg(s, e), fx: "gleam" });
    } else if (k >= 24 && k < 24 + R.ZIG_LEN / 12) move(g, g.cDir!, 12);
    if (t >= 119) delete g.cAct;
  }
}

function move(g: G, d: readonly [number, number], speed: number): void {
  g.cx = clampX(g.cx + d[0] * speed);
  g.cy = clampY(g.cy + d[1] * speed);
}
