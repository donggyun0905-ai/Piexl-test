// 나라 필드 장소 표: 지도 그림 파일 · 처음 서는 자리 · 마을·던전 입구·표지판 (칸 좌표) — 지도 모양은 scripts/art/world_map.py
// 지도 그림을 고치면 여기 좌표도 같이 맞춤
import type { CharacterId } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { FactionId } from "../story/storyData";
import { WTILE } from "./worldMap";

/** npc = 말 거는 사람 (부딪힘) */
export type PlaceKind = "dungeon" | "town" | "sign" | "npc";
export interface Place {
  id: string;
  kind: PlaceKind;
  /** 칸 좌표 (발 쪽) */
  tx: number;
  ty: number;
  /** 이름 (가까이 가면 뜸) · 표지판은 읽는 글 */
  name: TextKey;
  /** npc: 그림(캐릭터) · 하는 말 · scene이면 말 걸 때 지금 연 스토리 장을 보여 줌 */
  who?: CharacterId;
  line?: TextKey;
  scene?: boolean;
}

export interface Region {
  /** public/ 아래 지도 그림 */
  map: string;
  start: { tx: number; ty: number };
  places: readonly Place[];
}

export const REGIONS: Partial<Record<FactionId, Region>> = {
  ascalon: {
    map: "world/ascalon.png",
    start: { tx: 17, ty: 30 },
    places: [
      { id: "ascalonCastle", kind: "town", tx: 14, ty: 22, name: "wpAscalonCastle" },
      { id: "ascalonGeneral", kind: "npc", tx: 17, ty: 14, name: "general", who: "general", scene: true },
      { id: "ascalonMage", kind: "npc", tx: 11, ty: 18, name: "mage", who: "mage", line: "wnMage" },
      { id: "ascalonDrifter", kind: "npc", tx: 23, ty: 21, name: "drifter", who: "drifter", line: "wnDrifter" },
      { id: "ascalonNovice", kind: "npc", tx: 20, ty: 26, name: "novice", who: "novice", line: "wnNovice" },
      { id: "ascalonDungeon", kind: "dungeon", tx: 36, ty: 9, name: "wpDungeon" },
      { id: "ascalonSign", kind: "sign", tx: 38, ty: 30, name: "wpSignAscalon" },
      { id: "virdiaSign", kind: "sign", tx: 58, ty: 19, name: "wpSignVirdia" },
    ],
  },
};

/** 장소 가운데(픽셀) */
export const placeXY = (p: Place): [number, number] => [(p.tx + 0.5) * WTILE, (p.ty + 0.5) * WTILE];

/** 이 거리 안이면 F로 들어감·읽음 */
export const PLACE_NEAR = 20;

/** 사람(npc)과 부딪히는지 */
export function hitsNpc(r: Region, x: number, y: number, rad: number): boolean {
  return r.places.some((p) => p.kind === "npc" && Math.hypot(placeXY(p)[0] - x, placeXY(p)[1] + 4 - y) < rad + 8);
}

export function nearPlace(r: Region, x: number, y: number): Place | null {
  let best: Place | null = null;
  let bd = PLACE_NEAR;
  for (const p of r.places) {
    const [px, py] = placeXY(p);
    const d = Math.hypot(px - x, py + 6 - y);
    if (d < bd) [best, bd] = [p, d];
  }
  return best;
}
