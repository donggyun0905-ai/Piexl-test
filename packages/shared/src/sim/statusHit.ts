// 상태이상 기술 피해: 보통 맞힘처럼 넣고, 피해 숫자는 그 상태이상의 색·아이콘으로 (화면 game/damageNumbers가 markDot 몫을 나눠 띄움)
import { damageEnemy } from "./combat";
import { tideMul } from "./faction";
import type { DotKind, EnemyState, RunState } from "./types";
import { markDot } from "./util";
import { muteDot } from "./dmgSrc";

export function statusHit(s: RunState, e: EnemyState, kind: DotKind, dmg: number, dirX = 0, dirY = 0, knock = true): void {
  const before = e.hp;
  // 탈라시아 물결 콤보: 물 피해 증가 (sim/faction)
  damageEnemy(s, e, kind === "tide" ? dmg * tideMul(s) : dmg, dirX, dirY, knock);
  muteDot(() => markDot(s, e, kind, before - e.hp));
}
