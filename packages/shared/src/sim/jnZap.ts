// 존 번개 (황금 번개 기본 패시브): 번개 한 대 = 감전 피해(상태이상) → 잠시 뒤 같은 적에게 추가 타격 3번 (100% · 70% · 30%)
// nrKit.nrHit가 on.zap일 때 부름 (서로 불러오는 순환을 피해 nrKit을 불러오지 않음) · 추가 타격은 그 기술 출처로 셈 (srcEach)
import { JN_ZAP as Z } from "../itemsJaune";
import { ashDot } from "./ashDot";
import { bjAlive } from "./bjKit";
import { srcEach } from "./dmgSrc";
import type { EnemyState, RunState } from "./types";
import { addEffect } from "./util";

/** 번개 한 대: 감전 피해 · 들어가면 추가 타격 예약 · 준 피해 */
export function jnZapHit(s: RunState, e: EnemyState, dmg: number): number {
  const dealt = ashDot(s, e, "shock", dmg);
  if (dealt <= 0) return dealt;
  const q = (s.player.jnZaps ??= []);
  Z.muls.forEach((m, i) => {
    if (q.length < Z.max) q.push({ id: e.id, dmg: dmg * m, at: s.tick + Z.gap * (i + 1) });
  });
  return dealt;
}

/** 틱마다: 때가 된 추가 타격 (적이 죽었으면 사라짐) · 첫 추가 타격만 찌릿 그림 */
export function jnZapTick(s: RunState): void {
  const p = s.player;
  if (!p.jnZaps?.length) return;
  for (const z of srcEach(p.jnZaps)) {
    if (z.at !== s.tick) continue;
    const e = s.enemies.find((f) => f.id === z.id);
    if (!e || !bjAlive(e)) continue;
    if (ashDot(s, e, "shock", z.dmg) > 0 && z.at % 4 === 0) addEffect(s, { kind: "jnZap", x: e.x, y: e.y - e.r * 0.3, dirX: 0, dirY: 0, size: e.r + 10, maxTicks: 10 });
  }
  p.jnZaps = p.jnZaps.filter((z) => z.at > s.tick);
}
