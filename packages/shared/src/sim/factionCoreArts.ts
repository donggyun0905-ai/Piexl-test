// 성국 각성 핵심 스킬의 추가 공격 (sim/factionCore가 부름 · 캐릭터마다 다름, 수치 factionDefs.FACTION_CORE_ART)
// 베아트리스 태양 고리 3겹(불탐) · 이안 인과의 실이 가까운 적들을 묶음 · 가브리엘 끌어당겨 내려찍기 · 세레나 사방 독 비수 · 라파엘 빛 화살 비 · 유리엘 앞쪽 세 갈래 철퇴 충격파 · 미카엘라 적마다 무기가 떨어져 폭발
import { FACTION_CORE_ART as A } from "../factionDefs";
import { ignite } from "./status";
import { alive, inCircle, inCone, isBoss, strike as strike_, stun } from "./s2Kit";
import type { EnemyState, RunState } from "./types";
import { addEffect } from "./util";
import { srcFn } from "./dmgSrc";
const strike = srcFn("factionCoreArts", () => strike_);

const STYLE: Record<string, number> = { beatrice: 0, ian: 1, gabriel: 2, serena: 3, rafael: 4, yuriel: 5, michaela: 6 };
const dist2 = (s: RunState, e: EnemyState) => (e.x - s.player.x) ** 2 + (e.y - s.player.y) ** 2;
/** 가까운 적 n명 */
const nearest = (s: RunState, n: number, r: number) =>
  alive(s)
    .filter((e) => dist2(s, e) <= r * r)
    .sort((a, b) => dist2(s, a) - dist2(s, b) || a.id - b.id)
    .slice(0, n);

function bolt(s: RunState, e: EnemyState, style: number, fromSky = false): void {
  const p = s.player;
  addEffect(s, { kind: "fcCoreBolt", x: fromSky ? e.x : p.x, y: fromSky ? e.y - 120 : p.y, toX: e.x, toY: e.y, dirX: 0, dirY: 0, size: 4, style, maxTicks: 18 });
}

export function coreArt(s: RunState): void {
  const p = s.player;
  const style = STYLE[p.characterId];
  if (style === undefined) return;
  const dmg = p.stats.damage * A.mul;
  addEffect(s, { kind: "fcCoreArt", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: A.r, style, maxTicks: 40 });
  switch (p.characterId) {
    case "beatrice":
      for (const e of inCircle(s, p.x, p.y, A.r)) {
        strike(s, e, dmg, 8, "burn");
        ignite(e, p.stats.damage * A.burn);
      }
      break;
    case "ian":
      for (const e of nearest(s, A.n, A.r * 1.4)) {
        bolt(s, e, style);
        strike(s, e, dmg, 0);
        e.rootTicks = Math.max(e.rootTicks ?? 0, A.root);
      }
      break;
    case "gabriel":
      for (const e of inCircle(s, p.x, p.y, A.r * 1.3)) {
        if (!isBoss(e)) {
          e.x = p.x + (e.x - p.x) * 0.3;
          e.y = p.y + (e.y - p.y) * 0.3;
        }
        strike(s, e, dmg * 1.2, 0);
        stun(e, A.stun);
      }
      break;
    case "serena":
      for (const e of inCircle(s, p.x, p.y, A.r * 1.2)) {
        strike(s, e, dmg * 0.8, 6, "poison");
        e.poisonTicks = Math.max(e.poisonTicks ?? 0, A.poison);
        e.poisonDmg = Math.max(e.poisonDmg ?? 0, p.stats.damage * A.burn);
      }
      break;
    case "rafael":
      for (const e of nearest(s, A.n + 2, A.r * 2)) {
        bolt(s, e, style, true);
        strike(s, e, dmg, 0, "radiance");
      }
      break;
    case "yuriel":
      for (const e of inCone(s, A.r * 1.6, 0.5)) strike(s, e, dmg * 1.3, 14, "radiance");
      break;
    case "michaela":
      for (const e of nearest(s, A.n, A.r * 2)) {
        bolt(s, e, style, true);
        for (const o of inCircle(s, e.x, e.y, 26)) strike(s, o, dmg * 0.7, 6);
      }
      break;
  }
}
