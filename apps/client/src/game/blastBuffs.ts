// 버프 창: 새벽의 성흔 줄 (각성 남은 시간 · 블래스트 · 네일러 · 시저스 · 헬피스트) · 헬피스트 악마화 스택 (사거리 증가)
import { HELLFIST, HELLFIST_PERKS, isHellfist, rageOf, type PlayerState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { RoomBuff } from "./roomBuffs";

const LABEL: Partial<Record<string, TextKey>> = { blast: "bfSgAwake", nailer: "bfNlAwake", scissors: "bfSxAwake", hellfist: "bfHfAwake" };

/** 헬피스트 악마화: 스택 · 늘어난 사거리 % */
function rageBuff(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  const n = isHellfist(p) ? rageOf(p) : 0;
  if (n <= 0) return [];
  const per = p.passives.includes("hfSpread") ? HELLFIST_PERKS.hfSpread.per : HELLFIST.ragePer;
  return [{ key: "hfRage", label: t("bfHfRage").replace("{n}", String(n)).replace("{p}", String(Math.round(n * per * 100))), tip: t("bfHfRageTip") }];
}

export function blastBuffs(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  const k = LABEL[p.characterId];
  const rage = rageBuff(p, t);
  if (!k || !(p.sgAwake ?? 0)) return rage;
  return [{ key: "sgAwake", label: t(k).replace("{s}", String(Math.ceil(p.sgAwake! / 60))), tip: t("sgGaugeTip") }, ...rage];
}
