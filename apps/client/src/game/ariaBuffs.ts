// 버프 창: 아리아 줄 (방의 음표 종류 · 놓인 악기 · 악보 완성)
import { AR_NOTE, type PlayerState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { RoomBuff } from "./roomBuffs";

export function ariaBuffs(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  if (p.characterId !== "aria") return [];
  const out: RoomBuff[] = [];
  if ((p.arFinale ?? 0) > 0) out.push({ key: "arFinale", label: t("bfArFinale"), tip: t("bfArFinaleTip") });
  const kinds = new Set((p.arNotes ?? []).map((n) => n.kind)).size;
  if (kinds > 0) out.push({ key: "arNotes", label: t("bfArNotes").replace("{n}", String(Math.min(kinds, AR_NOTE.kinds))), tip: t("bfArNotesTip") });
  const inst = new Set((p.arInst ?? []).map((i) => i.kind)).size;
  if (inst > 0) out.push({ key: "arInst", label: t("bfArInst").replace("{n}", String(inst)), tip: t("bfArInstTip") });
  return out;
}
