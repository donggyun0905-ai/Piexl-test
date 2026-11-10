// 레이드 방 숨는 돌기둥(엄폐물) · 루시퍼 방어 (2026-11-09 사용자 요청)
// 돌기둥: 몸으로 지나갈 수 없고, 바로 옆에 붙어 있으면 루시퍼 쪽 공격(탄·위험 표시·기본 공격)을 막아 줌 · 막을 때마다 1회 → 정해진 횟수면 부서지고 잠시 뒤 다시 생김
// 루시퍼 방어: 석화의 기둥(1페이즈)이 남아 있으면 피해가 들어가지 않음 · 절망의 검(2페이즈)이 남아 있으면 받는 피해 -75% · 2페이즈는 루시퍼 쪽 공격이 더 아픔
// 기둥·검·상자는 밀리지 않음 (pinned: 스스로 움직인 자리만 인정)
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import type { EnemyKind } from "../content";
import { allPlayers } from "./party";
import { RAID_ROOM } from "./raidTypes";
import type { EnemyState, RunState } from "./types";
import { addEffect } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 돌기둥 반지름 · 붙어 있다고 보는 거리(기둥 가장자리에서) */
  RADIUS: 16,
  SHELTER: 12,
  /** 부서지기까지 막는 횟수 · 다시 생기기까지 틱 */
  HITS: 6,
  RESPAWN: 1200,
  /** 루시퍼가 받는 피해 줄이기: 1페이즈 기둥이 남아 있을 때 (1 = 피해 없음) · 2페이즈 검이 남아 있을 때 (0.75 = 75%) */
  P1_GUARD: 1,
  P2_GUARD: 0.75,
  /** 2페이즈: 사람이 받는 피해 배율 (루시퍼 공격력 업) */
  P2_DMG: 1.5,
};
export { R as LUC_COVER_RULES };

/** 돌기둥 자리 (방 너비·높이 비율): 위 넷 · 아래 넷 */
const SPOTS = [
  [0.14, 0.24],
  [0.38, 0.2],
  [0.62, 0.2],
  [0.86, 0.24],
  [0.14, 0.78],
  [0.38, 0.84],
  [0.62, 0.84],
  [0.86, 0.78],
];

/** 루시퍼 쪽 공격 (막을 수 있는 것) */
const BOSS_SIDE = new Set<string>(["lucifer", "lucpillar", "lucsword"]);

/** 돌기둥 [x, y, 남은 횟수, 다시 생기는 틱(부서졌을 때)] (처음이면 만듦) */
export function lucCovers(s: RunState): number[][] {
  const f = s.raidBoss?.fight;
  if (!f) return [];
  return (f.covers ??= SPOTS.map(([fx, fy]) => [ROOM_MIN_X + (ROOM_MAX_X - ROOM_MIN_X) * fx!, ROOM_MIN_Y + (ROOM_MAX_Y - ROOM_MIN_Y) * fy!, R.HITS, 0]));
}

/** 틱마다 (루시퍼가 부름): 다시 생기기 · 사람 밀어내기 · 루시퍼 쪽 탄 막기 */
export function coverTick(s: RunState): void {
  const covers = lucCovers(s);
  for (const c of covers) {
    if (c[2]! <= 0) {
      if (s.tick < c[3]!) continue;
      c[2] = R.HITS;
      addEffect(s, { kind: "lucFx", from: "coverUp", x: c[0]!, y: c[1]!, dirX: 0, dirY: 0, size: 30, maxTicks: 30, foe: true });
    }
    for (const p of allPlayers(s)) {
      const dx = p.x - c[0]!;
      const dy = p.y - c[1]!;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const min = R.RADIUS + p.r;
      if (d < min) [p.x, p.y] = [c[0]! + (dx / d) * min, c[1]! + (dy / d) * min];
    }
  }
  s.projectiles = s.projectiles.filter((pr) => {
    if (pr.fromPlayer) return true;
    const c = covers.find((k) => k[2]! > 0 && (pr.x - k[0]!) ** 2 + (pr.y - k[1]!) ** 2 <= (R.RADIUS + pr.r) ** 2);
    if (!c) return true;
    hitCover(s, c);
    return false;
  });
}

/** 돌기둥이 한 번 막음 (다 막으면 부서짐) */
function hitCover(s: RunState, c: number[]): void {
  c[2]!--;
  addEffect(s, { kind: "lucFx", from: c[2]! > 0 ? "coverHit" : "coverBreak", x: c[0]!, y: c[1]!, dirX: 0, dirY: 0, size: 26, maxTicks: c[2]! > 0 ? 12 : 30, foe: true });
  if (c[2]! <= 0) c[3] = s.tick + R.RESPAWN;
}

/** 지금 꺼내 놓은 사람이 받는 피해를 막는지 (combat.damagePlayer): 어둠의 세계(그 세계 몬스터만 때림) · 돌기둥 옆 (기둥이 1회 막음) */
export function raidGuard(s: RunState, from?: EnemyKind): boolean {
  const p = s.player;
  if (p.raidDark) return from !== "lucshade";
  const f = s.raidBoss?.fight;
  // 검기는 빈칸으로만 피함 (돌기둥이 막지 않음)
  if (!f?.covers || !from || !BOSS_SIDE.has(from) || f.slashAt === s.tick) return false;
  const c = f.covers.find((k) => k[2]! > 0 && (p.x - k[0]!) ** 2 + (p.y - k[1]!) ** 2 <= (R.RADIUS + R.SHELTER + p.r) ** 2);
  if (!c) return false;
  hitCover(s, c);
  return true;
}

/** 루시퍼 방어 중인지 (그리기): 기둥·검이 남아 있음 */
export const lucGuarded = (s: RunState) => s.enemies.some((o) => (o.kind === "lucpillar" || o.kind === "lucsword") && o.hp > 0);
/** 지금 줄어드는 비율 (1 = 피해 없음) */
const guardNow = (s: RunState) => (lucGuarded(s) ? (s.raidBoss?.fight?.phase === 2 ? R.P2_GUARD : R.P1_GUARD) : 0);

/** 루시퍼가 받는 피해 배율 (classTaken.foeTaken) */
export function lucGuardTaken(s: RunState, e: EnemyState): number {
  return e.kind === "lucifer" ? 1 - guardNow(s) : 1;
}
export const LUC_GUARD_PCT = (s: RunState) => Math.round(guardNow(s) * 100);

/** 사람이 받는 피해 배율 (classTaken.classTaken): 2페이즈 레이드 방이면 더 아픔 */
export const lucP2Taken = (s: RunState) => (s.raidBoss?.fight?.phase === 2 && s.roomId === RAID_ROOM.boss ? R.P2_DMG : 1);
export const COVER_RADIUS = () => R.RADIUS;
export const COVER_HITS = () => R.HITS;

/** 밀리지 않는 적 (기둥·검·루시퍼·상자): 지난 틱 끝 자리로 되돌린 뒤 스스로 움직임 */
export function pinned(e: EnemyState, move: () => void): void {
  if (e.anchor) [e.x, e.y] = e.anchor;
  move();
  e.anchor = [e.x, e.y];
}
