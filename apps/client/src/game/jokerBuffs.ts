// 버프 창: 조커 줄 (판 위 카드 수·가장 센 카드 · 카드뽑기 게이지 · 달·붉은 일식 남은 시간)
import { cardCap, cardDamage, JOKER_DRAW, MOON_HEROES, type PlayerState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { RoomBuff } from "./roomBuffs";

export function jokerBuffs(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  if (p.characterId !== "joker") return [];
  const out: RoomBuff[] = [];
  const cards = p.jkCards ?? [];
  if (cards.length > 0) {
    const best = Math.max(...cards.map((c) => cardDamage(p, c)));
    out.push({ key: "jkCards", label: t("bfJkCards").replace("{n}", String(cards.length)).replace("{m}", String(cardCap(p))).replace("{d}", String(Math.round(best))), tip: t("jokerDesc") });
  }
  const b = p.jkBuff;
  const s = b ? String(Math.ceil(b.t / 60)) : "";
  if (b?.card === 0) out.push({ key: "jkMoon", label: t("bfJkMoon").replace("{s}", s).replace("{h}", t(MOON_HEROES[b.hero] as TextKey)), tip: t("bfJkGaugeTip") });
  else if (b?.card === 1) out.push({ key: "jkEclipse", label: t("bfJkEclipse").replace("{s}", s), tip: t("bfJkGaugeTip"), bad: true });
  else if (p.passives.includes("jkDraw" as never)) out.push({ key: "jkGauge", label: t("bfJkGauge").replace("{n}", String(p.jkGauge ?? 0)).replace("{m}", String(JOKER_DRAW.max)), tip: t("bfJkGaugeTip") });
  return out;
}
