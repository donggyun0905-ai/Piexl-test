// 루주 혈장미(기본 패시브): 공격할 때 확률로 바닥에 작은 장미 → 닿은 적은 고정 피해 1 + 출혈 한 스택 · 궁극기가 모두 모음
import { RG_ROSE as R } from "../itemsRouge";
import { nrAlive, nrRoll } from "./nrKit";
import { rgAfflict } from "./rgBleed";
import type { RunState } from "./types";
import { addEffect, markDot } from "./util";
import { rot } from "./orbit";

/** (x, y) 둘레에 장미 n송이 (퍼지는 거리 spread, 시드로 자리) · 가득 차면 오래된 것부터 사라짐 */
export function rgPlant(s: RunState, x: number, y: number, n: number, spread = R.spread): void {
  const roses = (s.player.rgRoses ??= []);
  for (let i = 0; i < n; i++) {
    const [c, sn] = rot(nrRoll(s, "rgRose") * Math.PI * 2);
    const d = spread * (0.3 + 0.7 * nrRoll(s, "rgRoseD"));
    roses.push({ x: x + c * d, y: y + sn * d, until: s.tick + R.life });
  }
  if (roses.length > R.max) roses.splice(0, roses.length - R.max);
}

/** 기본 공격 한 번: 확률로 공격 자리에 장미 한 송이 */
export function rgMaybePlant(s: RunState, x: number, y: number): void {
  if (nrRoll(s, "rgRoseP") < R.chance) rgPlant(s, x, y, 1);
}

/** 방의 장미를 모두 (x, y)로 모음 · 모인 수 (장미는 사라짐) */
export function rgGather(s: RunState, x: number, y: number): number {
  const roses = s.player.rgRoses ?? [];
  for (const r of roses) addEffect(s, { kind: "rgGather", x: r.x, y: r.y, dirX: 0, dirY: 0, size: 10, toX: x, toY: y, maxTicks: 24 });
  s.player.rgRoses = [];
  return roses.length;
}

/** 틱마다: 사라질 때가 된 장미 정리 · 닿은 적(같은 적은 30틱마다)에게 고정 피해 + 출혈 */
export function rgRoseTick(s: RunState): void {
  const p = s.player;
  if (!p.rgRoses?.length) return;
  p.rgRoses = p.rgRoses.filter((r) => r.until > s.tick);
  for (const e of s.enemies) {
    if (!nrAlive(e) || e.immune || (e.rgRoseAt ?? -1e9) + R.every > s.tick) continue;
    if (!p.rgRoses.some((r) => (r.x - e.x) ** 2 + (r.y - e.y) ** 2 <= (R.r + e.r) ** 2)) continue;
    e.rgRoseAt = s.tick;
    // 가디언 방패: 한 칸 깨고 끝 (다 깨져야 피해·출혈)
    if ((e.shield ?? 0) > 0) {
      e.shield = (e.shield ?? 0) - 1;
      e.hitFlash = 3;
      addEffect(s, { kind: "hit", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.shield === 0 ? 7 : 3, maxTicks: 8 });
      continue;
    }
    e.hp -= R.dmg;
    e.hitFlash = 3;
    markDot(s, e, "bleed", R.dmg);
    rgAfflict(s, e, { bleed: 1 });
  }
}
