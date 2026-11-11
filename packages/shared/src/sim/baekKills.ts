// 백령 처치 처리 (baekSoul이 적어 둔 처치를 틱마다): 영혼 쌓기·게이지 칸 · 혼 흡수 · 혼등 날리기
import { ENEMIES } from "../enemyDefs";
import { BAEK_PERKS as K } from "../itemsBaekryeong";
import { createRng, deriveSeed } from "../rng";
import { BAEK_SOUL as S } from "../weaponsBaekryeong";
import { addSouls, hauntMul } from "./baekKit";
import { healPlayer } from "./combat";
import { alive, damageEnemyLite } from "./shadowingSpirits";
import type { EnemyState, RunState } from "./types";
import { addEffect, hasPerk, normalize } from "./util";

/** 틱마다: 적어 둔 처치마다 영혼 · 혼 흡수 · 혼등 */
export function soulTick(s: RunState): void {
  const p = s.player;
  const list = p.byKills;
  if (!list?.length) return;
  delete p.byKills;
  for (const [x, y, id, kind] of list) {
    const n = (ENEMIES[kind as EnemyState["kind"]]?.boss ? S.boss : 1) + (hasPerk(p, "byFeast") ? K.byFeast.extra : 0);
    if (addSouls(p, n) > 0) addEffect(s, { kind: "byLevel", x: p.x, y: p.y, dirX: 0, dirY: 0, size: p.byLv ?? 0, maxTicks: 40 });
    addEffect(s, { kind: "bySoul", x, y, toX: p.x, toY: p.y, dirX: 0, dirY: 0, size: 4, maxTicks: 24 });
    const rng = createRng(deriveSeed(s.seed, "byKill", s.tick, id));
    if (hasPerk(p, "byDrain") && rng.nextFloat() < K.byDrain.chance) healPlayer(s, K.byDrain.heal);
    if (hasPerk(p, "byWisp") && rng.nextFloat() < K.byWisp.chance) wisp(s, x, y);
  }
}

/** 혼등: 처치한 자리에서 혼불이 가까운 적 하나에게 날아감 */
function wisp(s: RunState, x: number, y: number): void {
  const p = s.player;
  let best = null;
  let bd = K.byWisp.dist ** 2;
  for (const e of s.enemies) {
    const d = (e.x - x) ** 2 + (e.y - y) ** 2;
    if (alive(e) && d < bd) {
      bd = d;
      best = e;
    }
  }
  if (!best) return;
  const d = normalize(best.x - x, best.y - y) ?? [0, 0];
  damageEnemyLite(s, best, p.stats.damage * K.byWisp.mul * hauntMul(p), d[0], d[1]);
  addEffect(s, { kind: "byWisp", x, y, toX: best.x, toY: best.y, dirX: d[0], dirY: d[1], size: 5, maxTicks: 18 });
}
