// 베두인 잔상 고리: 날아가는 차크람이 지나간 자리에 잔상을 남기고, 잔상은 3초 동안 돌며 닿은 적을 계속 벰
import { BEDOUIN_PERKS as K } from "../itemsBedouin";
import type { ThrownChakram } from "./bedouinTypes";
import type { RunState } from "./types";
import { hasPerk } from "./util";

/** 틱마다: 날아가는 차크람이면 몇 틱마다 잔상 하나 · 잔상마다 0.5초에 한 번 hit(자리, 반지름) */
export function ghostTick(s: RunState, c: ThrownChakram | undefined, hit: (x: number, y: number, r: number) => void): void {
  const p = s.player;
  if (c && c.mode !== "ground" && hasPerk(p, "whirlRing") && c.spin++ % K.whirlRing.every === 0) {
    (p.ghosts ??= []).push({ x: c.x, y: c.y, r: c.r, left: K.whirlRing.ticks });
  }
  if (!p.ghosts) return;
  for (const g of p.ghosts) {
    g.left--;
    if (g.left % 30 === 0) hit(g.x, g.y, g.r);
  }
  p.ghosts = p.ghosts.filter((g) => g.left > 0);
  if (!p.ghosts.length) p.ghosts = undefined;
}
