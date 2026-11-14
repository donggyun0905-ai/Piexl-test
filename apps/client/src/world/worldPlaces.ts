// 장소 표의 틀: 지도 그림 파일 · 처음 서는 자리 · 마을·던전 입구·표지판·문·가구·순간 이동석 (칸 좌표) — 지도 모양은 scripts/art/world_map.py
// 문(door) → 건물 안 지도(같은 표의 다른 Region) · 나가는 문(exit) → 들어온 문 앞으로 · 나라마다 장소는 places/
// 지도 그림을 고치면 places/ 좌표도 같이 맞춤
import type { CharacterId } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { ShopTab } from "../shop/ShopScreen";
import { ASCALON_FIELD } from "./places/ascalonField";
import { ASCALON_INSIDE } from "./places/ascalonInside";
import { DECO_R, type DecoArt } from "./worldDeco";
import { WTILE } from "./worldMap";

/** npc = 말 거는 사람 (부딪힘) · door = 건물 문(들어가기) · exit = 건물 안 나가는 문 · deco = 가구 (부딪힘, 말 못 검) · warp = 순간 이동석 */
export type PlaceKind = "dungeon" | "town" | "sign" | "npc" | "door" | "exit" | "deco" | "warp";
/** 말 걸면 여는 창: 게임 상점(처음 탭) · 대장간(레이드 장신구 장비창·승급·강화·재설정) */
export type WorldMenu = `shop:${ShopTab}` | "smith";
/** 가게 문 위 간판 그림 */
export type ShopIcon = "sword" | "shield" | "potion" | "bag" | "hammer" | "bed";
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
  /** npc: 말 걸면 여는 창 (대사 대신) */
  menu?: WorldMenu;
  /** door: 가게 간판 */
  icon?: ShopIcon;
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

/** 나라 필드 · 건물 안 (장소 표는 places/ 나라마다) */
export const REGIONS: Record<string, Region> = {
  ascalon: ASCALON_FIELD,
  ...ASCALON_INSIDE,
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
