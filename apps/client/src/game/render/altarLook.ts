// 제단의 방 성좌마다 색·문양 (카드 창·방 꾸밈·바닥 테마·효과가 같이 씀)
import type { AltarId } from "@pixel-rogue/shared";

export interface AltarLook {
  /** 주색 · 빛 색 · 어두운 바탕 · 카드 문양 */
  main: string;
  glow: string;
  deep: string;
  sigil: string;
}

export const ALTAR_LOOK: Record<AltarId, AltarLook> = {
  whale: { main: "#3a9aff", glow: "#bfe8ff", deep: "#0a2a4a", sigil: "≈" },
  turtle: { main: "#ff6a2a", glow: "#ffd08a", deep: "#3a1208", sigil: "▲" },
  hawk: { main: "#ffe04a", glow: "#ffffff", deep: "#1a2440", sigil: "ϟ" },
  wind: { main: "#5ae8c0", glow: "#e0fff4", deep: "#0a3a34", sigil: "≋" },
  sion: { main: "#fff0b0", glow: "#b48aff", deep: "#1a1028", sigil: "☯" },
  sylvester: { main: "#6ad85a", glow: "#e8ffb0", deep: "#0e2a10", sigil: "❦" },
  witch: { main: "#c05aff", glow: "#ff8ae0", deep: "#200a2e", sigil: "✶" },
  unknown: { main: "#8a8a9a", glow: "#ff3a5a", deep: "#08080c", sigil: "?" },
};
