// 빙설 피해·방향 도우미 (sim/bingseol·bsShots·bsArms·bsUlt가 같이 씀, 서로 불러오는 순환을 피해 따로 둠)
import { iceMul } from "./bsKit";
import { rot } from "./orbit";
import { damageEnemyLite } from "./shadowingSpirits";
import type { EnemyState, RunState } from "./types";

type P = RunState["player"];

/** 빙설 공격 한 번 맞힘 (쇄빙 배율) */
export function iceHit(s: RunState, e: EnemyState, dmg: number, dx: number, dy: number): void {
  damageEnemyLite(s, e, dmg * iceMul(s.player, e), dx, dy);
}

/** 바라보는 쪽을 a(라디안)만큼 돌린 방향 */
export function turn(p: P, a: number): [number, number] {
  const [c, n] = rot(a);
  return [p.faceX * c - p.faceY * n, p.faceX * n + p.faceY * c];
}
