// 상태이상 기술 피해: 보통 맞힘처럼 넣고, 피해 숫자는 그 상태이상의 색·아이콘으로 (화면 game/damageNumbers가 markDot 몫을 나눠 띄움)
import { damageEnemy } from "./combat";
import type { DotKind, EnemyState, RunState } from "./types";
import { markDot } from "./util";

export function statusHit(s: RunState, e: EnemyState, kind: DotKind, dmg: number, dirX = 0, dirY = 0, knock = true): void {
  const before = e.hp;
  damageEnemy(s, e, dmg, dirX, dirY, knock);
  markDot(s, e, kind, before - e.hp);
}
