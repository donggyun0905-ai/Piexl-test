// 버프 창: 쉐도잉 줄 (잉크·판 위 획 수 · 멈춘 시계 · 황금 문 남은 시간) · 인형술사 줄 (왕관·인형 친구·분신)
import { crownCap, inkOf, SHADOW_INK, type PlayerState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { RoomBuff } from "./roomBuffs";

export function shadowingBuffs(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  if (p.characterId !== "shadowing") return [];
  const sec = (n: number | undefined) => String(Math.ceil((n ?? 0) / 60));
  const out: RoomBuff[] = [
    { key: "sdInk", label: t("bfSdInk").replace("{n}", String(Math.floor(inkOf(p)))).replace("{m}", String(SHADOW_INK.ink)).replace("{k}", String(p.sdStrokes?.length ?? 0)), tip: t("bfSdInkTip") },
  ];
  if ((p.sdClockT ?? 0) > 0) out.push({ key: "sdClock", label: t("bfSdClock").replace("{s}", sec(p.sdClockT)), tip: t("bfSdInkTip") });
  if ((p.sdGateT ?? 0) > 0) out.push({ key: "sdGate", label: t("bfSdGate").replace("{s}", sec(p.sdGateT)), tip: t("bfSdInkTip") });
  return out;
}

/** 쉐도잉: 화면 커서 대신 게임 안 붓 그림 (render/shadowingArt) · 바뀔 때만 게임 화면 class를 바꿈 */
export function setBrushCursor(on: boolean, was: boolean): boolean {
  if (on !== was) document.querySelector(".game-screen")?.classList.toggle("brush-cursor", on);
  return on;
}

/** 버프 창: 인형술사 줄 (나무 왕관 수 · 인형 친구 다시 나오기까지 · 분신 다시 쓰기까지) */
export function puppetBuffs(p: PlayerState, t: (k: TextKey) => string): RoomBuff[] {
  if (p.characterId !== "puppeteer") return [];
  const sec = (n: number | undefined) => String(Math.ceil((n ?? 0) / 60));
  const tip = t("bfPpCrownTip");
  const out: RoomBuff[] = [{ key: "ppCrown", label: t("bfPpCrown").replace("{n}", String(p.ppAllies?.length ?? 0)).replace("{m}", String(crownCap(p))), tip }];
  if (!p.ppGolem && (p.ppGolemCd ?? 0) > 0) out.push({ key: "ppGolem", label: t("bfPpGolem").replace("{s}", sec(p.ppGolemCd)), tip });
  if ((p.ppCloneCd ?? 0) > 0) out.push({ key: "ppClone", label: t("bfPpClone").replace("{s}", sec(p.ppCloneCd)), tip });
  return out;
}
