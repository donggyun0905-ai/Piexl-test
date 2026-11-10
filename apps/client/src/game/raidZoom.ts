// 레이드 방(라스트 보스 방의 2배): 화면을 2배 줄여 넓게 봄 (들어갈 때 한 번 · 휠로 0.5까지 줄일 수 있음)
import { RAID_ROOM, type RunState } from "@pixel-rogue/shared";
import type { Controls } from "./controls";

const RAID_ZOOM = 0.5;
const seen = new WeakMap<Controls, boolean>();

export function raidZoom(c: Controls, s: RunState): void {
  const on = !!s.raidBoss && s.roomId === RAID_ROOM.boss;
  if ((seen.get(c) ?? false) === on) return;
  seen.set(c, on);
  c.setZoomMin(on ? RAID_ZOOM : 1);
  c.setZoom(on ? RAID_ZOOM : 1);
}
