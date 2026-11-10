// 버프 창: 래빗 줄 (슈퍼 럭키 준비·쿨타임 · 쿵쿵쿵 쌓인 피해 · 럭키 피버 남은 시간)
import { RABBIT_PERKS, rabbitOwned, type PlayerState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { RoomBuff } from "./roomBuffs";

const sec = (n: number | undefined) => String(Math.ceil((n ?? 0) / 60));

export function rabbitBuffs(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  if (p.characterId !== "rabbit") return [];
  const out: RoomBuff[] = [];
  const tip = t("bfRbUltTip");
  if (p.passives.includes("rbLucky")) {
    if ((p.rbUltCd ?? 0) > 0) out.push({ key: "rbUlt", label: t("bfRbUlt").replace("{s}", sec(p.rbUltCd)), tip });
    else out.push({ key: "rbUlt", label: t("bfRbReady").replace("{n}", String(rabbitOwned(p))).replace("{m}", String(RABBIT_PERKS.rbLucky.need)), tip, bad: rabbitOwned(p) < RABBIT_PERKS.rbLucky.need });
  }
  if ((p.rbStack ?? 0) > 0 && p.passives.includes("rbStomp")) out.push({ key: "rbStomp", label: t("bfRbStomp").replace("{n}", String(Math.round((p.rbStack ?? 0) * RABBIT_PERKS.rbStomp.add * 100))), tip });
  if ((p.rbFever ?? 0) > 0) out.push({ key: "rbFever", label: t("bfRbFever").replace("{s}", sec(p.rbFever)), tip });
  return out;
}
