// 나라 필드 장소 표: 지도 그림 파일 · 처음 서는 자리 · 마을·던전 입구·표지판·문·가구 (칸 좌표) — 지도 모양은 scripts/art/world_map.py
// 문(door) → 건물 안 지도(같은 표의 다른 Region) · 나가는 문(exit) → 들어온 문 앞으로
// 지도 그림을 고치면 여기 좌표도 같이 맞춤
import type { CharacterId } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import { DECO_R, type DecoArt } from "./worldDeco";
import { WTILE } from "./worldMap";

/** npc = 말 거는 사람 (부딪힘) · door = 건물 문(들어가기) · exit = 건물 안 나가는 문 · deco = 가구 (부딪힘, 말 못 검) */
export type PlaceKind = "dungeon" | "town" | "sign" | "npc" | "door" | "exit" | "deco";
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
  /** door: 들어갈 건물 안 Region 이름 · deco: 가구 그림 */
  to?: string;
  art?: DecoArt;
}

export interface Region {
  /** public/ 아래 지도 그림 */
  map: string;
  start: { tx: number; ty: number };
  places: readonly Place[];
  /** 건물 안: 이름(나라 이름 대신) · 구름·나비 없음 */
  title?: TextKey;
  indoor?: boolean;
}

export const REGIONS: Record<string, Region> = {
  ascalon: {
    map: "world/ascalon.png",
    start: { tx: 17, ty: 30 },
    places: [
      { id: "ascalonCastle", kind: "town", tx: 14, ty: 22, name: "wpAscalonCastle" },
      { id: "ascalonKeepDoor", kind: "door", tx: 17, ty: 16, name: "wpAscalonKeep", to: "ascalonKeep" },
      { id: "ascalonHouse1", kind: "door", tx: 11, ty: 16, name: "wpHouse", to: "ascalonHouse" },
      { id: "ascalonHouse2", kind: "door", tx: 23, ty: 16, name: "wpHouse", to: "ascalonHouse" },
      { id: "ascalonHouse3", kind: "door", tx: 11, ty: 26, name: "wpHouse", to: "ascalonHouse" },
      { id: "ascalonHouse4", kind: "door", tx: 23, ty: 26, name: "wpHouse", to: "ascalonHouse" },
      { id: "ascalonMage", kind: "npc", tx: 11, ty: 18, name: "mage", who: "mage", line: "wnMage" },
      { id: "ascalonDrifter", kind: "npc", tx: 23, ty: 21, name: "drifter", who: "drifter", line: "wnDrifter" },
      { id: "ascalonNovice", kind: "npc", tx: 20, ty: 26, name: "novice", who: "novice", line: "wnNovice" },
      { id: "ascalonDungeon", kind: "dungeon", tx: 36, ty: 9, name: "wpDungeon" },
      { id: "ascalonSign", kind: "sign", tx: 38, ty: 30, name: "wpSignAscalon" },
      { id: "virdiaSign", kind: "sign", tx: 58, ty: 19, name: "wpSignVirdia" },
    ],
  },
  // 성채 안: 문(9,11)에서 카펫 따라 왕좌 · 장군 = 지금 연 장 이야기
  ascalonKeep: {
    map: "world/ascalon_keep.png",
    start: { tx: 9, ty: 10 },
    title: "wpAscalonKeep",
    indoor: true,
    places: [
      { id: "keepExit", kind: "exit", tx: 9, ty: 11, name: "wpGoOut" },
      { id: "ascalonGeneral", kind: "npc", tx: 9, ty: 4, name: "general", who: "general", scene: true },
      { id: "keepThrone", kind: "deco", tx: 9, ty: 2, name: "wpAscalonKeep", art: "throne" },
      ...[4, 14].flatMap((x) => [4, 8].map((y) => ({ id: `keepPillar${x}${y}`, kind: "deco" as const, tx: x, ty: y, name: "wpAscalonKeep" as const, art: "pillar" as const }))),
      { id: "keepArmorL", kind: "deco", tx: 2, ty: 2, name: "wpAscalonKeep", art: "armor" },
      { id: "keepArmorR", kind: "deco", tx: 16, ty: 2, name: "wpAscalonKeep", art: "armor" },
      { id: "keepBarrel", kind: "deco", tx: 16, ty: 10, name: "wpAscalonKeep", art: "barrel" },
    ],
  },
  // 민가 안 (집 넷이 같은 안 지도)
  ascalonHouse: {
    map: "world/ascalon_house.png",
    start: { tx: 5, ty: 6 },
    title: "wpHouse",
    indoor: true,
    places: [
      { id: "houseExit", kind: "exit", tx: 5, ty: 7, name: "wpGoOut" },
      { id: "houseBed", kind: "deco", tx: 2, ty: 3, name: "wpHouse", art: "bed" },
      { id: "houseFire", kind: "deco", tx: 6, ty: 2, name: "wpHouse", art: "fireplace" },
      { id: "houseShelf", kind: "deco", tx: 9, ty: 2, name: "wpHouse", art: "shelf" },
      { id: "houseTable", kind: "deco", tx: 8, ty: 5, name: "wpHouse", art: "table" },
      { id: "housePlant", kind: "deco", tx: 10, ty: 7, name: "wpHouse", art: "plant" },
      { id: "houseBarrel", kind: "deco", tx: 1, ty: 7, name: "wpHouse", art: "barrel" },
    ],
  },
};

/** 장소 가운데(픽셀) */
export const placeXY = (p: Place): [number, number] => [(p.tx + 0.5) * WTILE, (p.ty + 0.5) * WTILE];

/** 이 거리 안이면 F로 들어감·읽음 */
export const PLACE_NEAR = 20;

/** 사람(npc)·가구(deco)와 부딪히는지 */
export function hitsNpc(r: Region, x: number, y: number, rad: number): boolean {
  return r.places.some((p) => {
    if (p.kind === "npc") return Math.hypot(placeXY(p)[0] - x, placeXY(p)[1] + 4 - y) < rad + 8;
    if (p.kind !== "deco" || !p.art) return false;
    return Math.hypot(placeXY(p)[0] - x, placeXY(p)[1] + 2 - y) < rad + DECO_R[p.art];
  });
}

export function nearPlace(r: Region, x: number, y: number): Place | null {
  let best: Place | null = null;
  let bd = PLACE_NEAR;
  for (const p of r.places) {
    if (p.kind === "deco") continue;
    const [px, py] = placeXY(p);
    const d = Math.hypot(px - x, py + 6 - y);
    if (d < bd) [best, bd] = [p, d];
  }
  return best;
}
