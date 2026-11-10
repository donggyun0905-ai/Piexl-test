// 버프 창: 베아트리스 줄 (심판의 불꽃 화염 계수·재생력 · 태양 검날 · 자애 · 치유 감소(회복 불가) · 심판까지 지운 악)
import { BEATRICE, BEATRICE_PERKS, btRegen, fireCoef, type PlayerState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { RoomBuff } from "./roomBuffs";

const sec = (ticks: number) => String(Math.ceil(ticks / 60));

export function beatriceBuffs(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  if (p.characterId !== "beatrice") return [];
  const out: RoomBuff[] = [];
  const fire = t("bfBtFire").replace("{n}", String(Math.round(fireCoef(p) * 100))).replace("{r}", String(Math.round(btRegen(p))));
  out.push({ key: "btFire", label: fire, tip: t("beatriceDesc") });
  if ((p.btSolar ?? 0) > 0) out.push({ key: "btSolar", label: t("bfBtSolar").replace("{s}", sec(p.btSolar!)), tip: t("btSkill1") });
  if ((p.btGrace ?? 0) > 0) out.push({ key: "btGrace", label: t("bfBtGrace").replace("{s}", sec(p.btGrace!)), tip: t("btSkill4") });
  if ((p.btNoHeal ?? 0) > 0) out.push({ key: "btNoHeal", label: t("bfBtNoHeal").replace("{s}", sec(p.btNoHeal!)), tip: t("btSkill4"), bad: true });
  const at = p.passives.includes("btVerdict") ? BEATRICE_PERKS.btVerdict.at : BEATRICE.judgeAt;
  out.push({ key: "btPurge", label: t("bfBtPurge").replace("{n}", String(p.btPurged ?? 0)).replace("{m}", String(at)), tip: t("beatriceDesc") });
  return out;
}
