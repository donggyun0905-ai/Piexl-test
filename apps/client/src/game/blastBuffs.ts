// 버프 창: 새벽의 성흔 줄 (달빛 각성 남은 시간 · 블래스트 · 네일러 · 시저스)
import type { PlayerState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { RoomBuff } from "./roomBuffs";

const LABEL: Partial<Record<string, TextKey>> = { blast: "bfSgAwake", nailer: "bfNlAwake", scissors: "bfSxAwake" };

export function blastBuffs(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  const k = LABEL[p.characterId];
  if (!k || !(p.sgAwake ?? 0)) return [];
  return [{ key: "sgAwake", label: t(k).replace("{s}", String(Math.ceil(p.sgAwake! / 60))), tip: t("sgGaugeTip") }];
}
