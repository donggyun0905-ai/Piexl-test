// 보스 공용 도우미: 탄 피해·근접 범위 피해 · 체력 절반 · 고리·부채꼴 탄 · 벽에서 터지는 불덩이 · 거리 두기
import type { BossShotState } from "./bossTypes";
import { depth } from "./hero";
import type { EnemyState, ProjectileState, RunState } from "./types";
import { DIR16, enemyShot, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";

type Vec = readonly [number, number];
/** 보스 탄에 덧붙이는 값 */
type Extra = BossShotState & Partial<Pick<ProjectileState, "bounces" | "ticksLeft" | "r">>;

/** 보스 탄 피해 */
export function shotDamage(s: RunState): number {
  return 7 + depth(s);
}

/** 보스 근접·범위 공격 피해 (예고가 보이는 큰 공격) */
export function hitDamage(s: RunState): number {
  return 12 + 2 * depth(s);
}

/** 궁극기를 쓰는 라스트 보스 (태초의 빛·어둠은 혼자 남은 쪽만, 불려 나온 보스 제외) */
export function ultBoss(e: EnemyState): boolean {
  if (e.noGold) return false;
  return e.kind === "dragon" || e.kind === "godeater" || e.kind === "sandworm" || e.kind === "scorpion" || e.kind === "roc" || e.kind === "demigod" || e.kind === "sage" || ((e.kind === "plight" || e.kind === "pdark") && e.step === 2);
}

/** 궁극기 중이거나 곧 쓸 차례 (체력 10% 아래, 아직 안 씀): 기절·위압·얼음 시계에 멈추지 않음 */
export function ultBusy(e: EnemyState): boolean {
  if (e.ultAt !== undefined) return true;
  return !e.ultDone && e.hp > 0 && e.hp < e.maxHp * 0.1 && ultBoss(e);
}

/** 체력 절반 아래: 더 세짐 */
export const half = (e: EnemyState) => e.hp * 2 < e.maxHp;

/** 16방향 기준 k칸 돌린 방향 (복소수 곱) */
export function turn(d: Vec, k: number): [number, number] {
  const r = DIR16[((k % 16) + 16) % 16]!;
  return [d[0] * r[0] - d[1] * r[1], d[0] * r[1] + d[1] * r[0]];
}

/** 고리 모양 탄: step = 2면 8발, 1이면 16발. offset만큼 돌려서 */
export function ring(s: RunState, e: EnemyState, step: number, offset: number, speed: number, extra: Extra = {}): void {
  for (let i = offset % step; i < 16; i += step) {
    const d = DIR16[i]!;
    Object.assign(enemyShot(s, e.x, e.y, d[0], d[1], speed, shotDamage(s)), extra);
  }
}

/** 플레이어 쪽 부채꼴 탄: 방향을 16방향 기준 k칸씩 돌림 */
export function fan(s: RunState, e: EnemyState, toP: Vec, spread: number[], speed: number, extra: Extra = {}): void {
  for (const k of spread) {
    const d = turn(toP, k);
    Object.assign(enemyShot(s, e.x, e.y, d[0], d[1], speed, shotDamage(s)), extra);
  }
}

/** 튕김이 다 끝난 불덩이가 벽에서 터짐: 작은 불꽃 n개가 사방으로 (새 탄을 돌려줌, s.projectiles에는 넣지 않음) */
export function shatterShot(s: RunState, pr: ProjectileState, n: number): ProjectileState[] {
  const out: ProjectileState[] = [];
  for (let i = 0; i < n; i++) {
    const d = DIR16[Math.floor((i * 16) / n)]!;
    const x = Math.max(ROOM_MIN_X, Math.min(ROOM_MAX_X, pr.x));
    const y = Math.max(ROOM_MIN_Y, Math.min(ROOM_MAX_Y, pr.y));
    const sh = enemyShot(s, x, y, d[0], d[1], 1.6, Math.ceil(pr.damage / 2));
    s.projectiles.pop();
    sh.look = "fire";
    sh.r = 2;
    sh.ticksLeft = 70;
    out.push(sh);
  }
  return out;
}

/** 플레이어와 거리 want 근처를 유지 (멀면 다가가고 가까우면 물러남) */
export function keepAway(s: RunState, e: EnemyState, toP: Vec, go: Vec, want: number, speed: number): void {
  const dx = s.player.x - e.x;
  const dy = s.player.y - e.y;
  const d2 = dx * dx + dy * dy;
  const dir = d2 > (want + 15) * (want + 15) ? 1 : d2 < (want - 20) * (want - 20) ? -1 : 0;
  const m = dir > 0 ? go : toP;
  e.x += m[0] * speed * dir;
  e.y += m[1] * speed * dir;
}

/** 플레이어까지 거리 */
export function distTo(s: RunState, e: EnemyState): number {
  const dx = s.player.x - e.x;
  const dy = s.player.y - e.y;
  return Math.sqrt(dx * dx + dy * dy);
}
