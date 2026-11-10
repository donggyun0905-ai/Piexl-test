// 루시퍼 즉사 패턴 (2026-11-10 사용자 요청: 페이즈마다 2개, 대시·위험 표시 피하기가 아닌 새로운 피하는 방식)
// 1페이즈 0 석화의 시선: 루시퍼가 눈을 뜸 → 끝날 때 루시퍼를 바라보고 있으면(조준·바라보는 쪽) 석화 즉사 = 등을 돌림
// 1페이즈 1 심판의 빛: 맵 한쪽 끝에서 빛이 쏟아짐 → 숨는 돌기둥(sim/lucCover) 그림자 속에 있어야 삶 (시작할 때 돌기둥이 모두 다시 섬)
// 2페이즈 2 영혼의 사슬: 둘씩 사슬로 묶임 → 끝날 때 짝과 붙어 있어야 삶 (홀수면 마지막 사람은 맨 앞 짝에 붙음)
// 2페이즈 3 왕좌의 품: 맵 전체가 터짐 → 루시퍼 바로 곁(품)에 파고들어야 삶
// 무적(다시 살아난 직후·컷신)만 막음 · 대시·보호막·돌기둥으로는 못 막음
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { COVER_RADIUS, lucCovers, LUC_COVER_RULES } from "./lucCover";
import { lucRng, lucTargets } from "./lucKit";
import type { LucFight } from "./lucTypes";
import { allPlayers } from "./party";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 페이즈가 시작되고 첫 즉사 패턴까지 · 다음 패턴까지 (틱) */
  FIRST: 2700,
  GAP: 3600,
  /** 경고 시간 (틱): 시선 · 빛 · 사슬 · 품 */
  WARN_GAZE: 200,
  WARN_LIGHT: 330,
  WARN_LINK: 330,
  WARN_HUG: 270,
  /** 그림자 길이 (돌기둥 뒤로) · 사슬 짝과 떨어져도 되는 거리 · 품 반지름 (루시퍼 둘레) */
  SHADOW: 120,
  LINK_R: 56,
  HUG_R: 110,
};
export { R as LUC_DEADLY_RULES };

/** 지금 즉사 패턴: 종류(0 시선 · 1 빛 · 2 사슬 · 3 품) · 터지는 틱 · 시작 틱 · 자료(빛: 방향 x·y / 사슬: 짝 자리 [a, b, a, b…]) */
export interface LucDeadly {
  kind: number;
  at: number;
  start: number;
  data: number[];
}

const warnOf = (k: number) => [R.WARN_GAZE, R.WARN_LIGHT, R.WARN_LINK, R.WARN_HUG][k]!;

/** 다른 큰 패턴(돔·검기·컷신·낙하 검·사슬 방향키·날개·하늘) 중에는 시작하지 않음 */
function calm(f: LucFight): boolean {
  if (f.phase === 1) return !f.dome && f.slashAt === undefined;
  return f.p2 === "swords" || f.p2 === "open";
}

/** 틱마다 (sim/lucifer, 컷신이 아닐 때) */
export function deadlyTick(s: RunState, f: LucFight, boss: EnemyState): void {
  if (f.dkPhase !== f.phase) {
    f.dkPhase = f.phase;
    f.dkAt = s.tick + R.FIRST;
    f.dk = undefined;
  }
  const d = f.dk;
  if (d) {
    if (s.tick >= d.at) resolve(s, f, d, boss);
    return;
  }
  if (s.tick < (f.dkAt ?? 0) || !calm(f) || lucTargets(s).length === 0) return;
  const n = (f.dkN = (f.dkN ?? 0) + 1);
  const kind = (f.phase === 1 ? 0 : 2) + (n % 2);
  const data: number[] = [];
  if (kind === 1) {
    // 빛이 오는 쪽: 왼쪽·오른쪽·위·아래 중 하나 (그쪽에서 맞은편으로)
    const side = lucRng(s, "dkLight", n).int(0, 3);
    data.push(...[[1, 0], [-1, 0], [0, 1], [0, -1]][side]!);
    for (const c of lucCovers(s)) c[2] = LUC_COVER_RULES.HITS;
  } else if (kind === 2) {
    const seats = lucTargets(s).map(([i]) => i);
    for (let k = 0; k + 1 < seats.length; k += 2) data.push(seats[k]!, seats[k + 1]!);
    if (seats.length % 2 === 1 && seats.length > 1) data.push(seats[0]!, seats[seats.length - 1]!);
  }
  f.dk = { kind, at: s.tick + warnOf(kind), start: s.tick, data };
  addEffect(s, { kind: "lucFx", from: ["dkGaze", "dkLight", "dkLink", "dkHug"][kind]!, x: boss.x, y: boss.y, dirX: 0, dirY: 0, size: 80, maxTicks: 40, foe: true });
}

/** 이 사람이 살아남는 자리·자세인지 (그리기·AI도 씀) */
export function deadlySafe(s: RunState, d: LucDeadly, seat: number, boss: EnemyState): boolean {
  const p = allPlayers(s)[seat]!;
  if (d.kind === 0) {
    // 루시퍼 쪽을 보고 있지 않음 (옆이나 뒤)
    const dx = boss.x - p.x;
    const dy = boss.y - p.y;
    return p.faceX * dx + p.faceY * dy <= 0;
  }
  if (d.kind === 1) return inShadow(s, d, p);
  if (d.kind === 2) {
    const mate = mateOf(d, seat);
    const q = mate === undefined ? undefined : allPlayers(s)[mate];
    return !q || q.hp <= 0 || q.raidDark || (p.x - q.x) ** 2 + (p.y - q.y) ** 2 <= R.LINK_R ** 2;
  }
  return (p.x - boss.x) ** 2 + (p.y - boss.y) ** 2 <= R.HUG_R ** 2;
}

/** 돌기둥 그림자: 빛 방향으로 기둥 뒤 SHADOW만큼 · 기둥 너비만큼 */
function inShadow(s: RunState, d: LucDeadly, p: PlayerState): boolean {
  const [lx, ly] = [d.data[0]!, d.data[1]!];
  return lucCovers(s).some((c) => {
    if (c[2]! <= 0) return false;
    const vx = p.x - c[0]!;
    const vy = p.y - c[1]!;
    const along = vx * lx + vy * ly;
    const side = Math.abs(vx * ly - vy * lx);
    return along >= 0 && along <= R.SHADOW && side <= COVER_RADIUS() + 4;
  });
}

/** 사슬 짝 (없으면 undefined) */
export function mateOf(d: LucDeadly, seat: number): number | undefined {
  for (let k = 0; k + 1 < d.data.length; k += 2) {
    if (d.data[k] === seat) return d.data[k + 1];
    if (d.data[k + 1] === seat) return d.data[k];
  }
  return undefined;
}

function resolve(s: RunState, f: LucFight, d: LucDeadly, boss: EnemyState): void {
  f.dk = undefined;
  f.dkAt = s.tick + R.GAP;
  const cx = (ROOM_MIN_X + ROOM_MAX_X) / 2;
  const cy = (ROOM_MIN_Y + ROOM_MAX_Y) / 2;
  addEffect(s, { kind: "lucFx", from: ["dkGazeEnd", "dkLightEnd", "dkLinkEnd", "dkHugEnd"][d.kind]!, x: d.kind === 3 ? boss.x : cx, y: d.kind === 3 ? boss.y : cy, dirX: d.data[0] ?? 0, dirY: d.data[1] ?? 0, size: ROOM_MAX_X - ROOM_MIN_X, maxTicks: 40, foe: true });
  allPlayers(s).forEach((p, i) => {
    if (p.hp <= 0 || p.raidDark || p.invulnTicks > 0 || deadlySafe(s, d, i, boss)) return;
    p.hp = 0;
    addEffect(s, { kind: "lucFx", from: "dkDie", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 30, maxTicks: 40, foe: true });
  });
}

/** AI: 즉사 패턴 중이면 갈 곳·볼 쪽 [가는 x, y, 볼 x, y] (없으면 null) */
export function deadlyBot(s: RunState, seat: number): [number, number, number, number] | null {
  const f = s.raidBoss?.fight;
  const d = f?.dk;
  const boss = s.enemies.find((e) => e.kind === "lucifer" && e.hp > 0);
  if (!d || !boss) return null;
  const p = allPlayers(s)[seat]!;
  const to = (x: number, y: number) => [x - p.x, y - p.y] as const;
  if (d.kind === 0) {
    const [ax, ay] = to(boss.x, boss.y);
    return [-ax, -ay, -ax, -ay];
  }
  if (d.kind === 1) {
    const covers = lucCovers(s).filter((c) => c[2]! > 0);
    const spot = covers.map((c) => [c[0]! + d.data[0]! * R.SHADOW * 0.5, c[1]! + d.data[1]! * R.SHADOW * 0.5] as const).sort((a, b) => (a[0] - p.x) ** 2 + (a[1] - p.y) ** 2 - ((b[0] - p.x) ** 2 + (b[1] - p.y) ** 2))[0];
    return spot ? [...to(spot[0], spot[1]), p.faceX, p.faceY] : null;
  }
  if (d.kind === 2) {
    const mate = mateOf(d, seat);
    const q = mate === undefined ? undefined : allPlayers(s)[mate];
    return q ? [...to(q.x, q.y), p.faceX, p.faceY] : null;
  }
  return [...to(boss.x, boss.y), boss.x - p.x, boss.y - p.y];
}
