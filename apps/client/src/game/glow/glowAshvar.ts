// 빛 층: 아슈바르(느아르·루주·블뢰·존) 늘 켜진 빛 (glowSilber의 steady가 부름)
// 등 뒤 악마 계급 빛(계급이 오를수록 크고 진하게) · 루주 혈장미 · 블뢰 눈결정·결정탄·얼어 있는 적 · 존 날아가는 뇌구·종언 구체
import { isAshvar, type RunState } from "@pixel-rogue/shared";
import { ASHVAR_GLOW as G } from "./ashvarFxKinds";

type Put = (x: number, y: number, size: number, color: number, a: number) => void;

/** 캐릭터마다 계급 빛 색 */
const RANK: Record<string, number> = { noir: G.violet, rouge: G.red, bleu: G.ice, jaune: G.gold };
/** 눈결정은 많아서 가까운 몇 개만 */
const MAX_FLAKES = 12;

export function ashvarSteady(s: RunState, put: Put): void {
  const p = s.player;
  if (!isAshvar(p)) return;
  const rk = p.nrRank ?? 0;
  if (rk > 0) put(p.x, p.y - 12, 26 + rk * 8 + 3 * Math.sin(s.tick * 0.08), RANK[p.characterId] ?? G.violet, 0.06 + rk * 0.05);
  for (const r of p.rgRoses ?? []) put(r.x, r.y, 14, G.rose, 0.28);
  for (const b of p.buBolts ?? []) put(b.x, b.y, 22, G.ice, 0.55);
  for (const f of (p.buFlakes ?? []).slice(-MAX_FLAKES)) put(f.x, f.y - 6, 9, G.frost, 0.22);
  if (p.characterId === "bleu") for (const e of s.enemies) if (e.hp > 0 && (e.buIce ?? 0) > s.tick) put(e.x, e.y, e.r + 14, G.ice, 0.3);
  for (const b of p.jnBolts ?? []) put(b.x, b.y, 30, G.gold, 0.7);
  for (const v of p.nrVolleys ?? []) if (v.kind === "jnOrb" || v.kind === "jnFrenzy") put(v.x, v.y, v.r * 1.2, G.gold, 0.3);
}
