// 레이드 시간 글자 (분:초.백분의 1초)
import { TICK_RATE } from "@pixel-rogue/shared";

export function raidTime(ticks: number): string {
  const cs = Math.floor((ticks * 100) / TICK_RATE);
  const sec = Math.floor(cs / 100);
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}.${String(cs % 100).padStart(2, "0")}`;
}
