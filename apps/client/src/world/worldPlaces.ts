// 장소 표의 틀: 지도 그림 파일 · 처음 서는 자리 · 마을·던전 입구·표지판·문·가구·순간 이동석 (칸 좌표) — 지도 모양은 scripts/art/world_map.py
// 문(door) → 건물 안 지도(같은 표의 다른 Region) · 나가는 문(exit) → 들어온 문 앞으로 · 나라마다 장소는 places/
// 지도 그림을 고치면 places/ 좌표도 같이 맞춤
import type { CharacterId } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { FactionId } from "../story/storyData";
import { factionOpen } from "../progress/storyStage";
import type { ShopTab } from "../shop/ShopScreen";
import { ASCALON_FIELD } from "./places/ascalonField";
import { ASCALON_INSIDE } from "./places/ascalonInside";
import { HELIOS_FIELD, HELIOS_INSIDE } from "./places/heliosField";
import { DESERT_FIELD } from "./places/desertField";
import { SILBER_FIELD, SILBER_INSIDE } from "./places/silberField";
import { THAL_FIELD, THAL_INSIDE } from "./places/thalassiaField";
import { TERRA_FIELD, TERRA_INSIDE } from "./places/terraField";
import { VIRDIA_FIELD, VIRDIA_INSIDE } from "./places/virdiaField";
import { INDOOR_SKIN } from "./places/skins";
import { CYBER_FIELD, CYBER_INSIDE } from "./places/cyberField";
import { DAWN_INSIDE } from "./places/dawnHideout";
import { HELL_FIELD } from "./places/hellField";
import { SEONGGUK_FIELD, SEONGGUK_INSIDE } from "./places/seonggukField";
import { UNDERSEA_FIELD, UNDERSEA_INSIDE } from "./places/underseaField";
import { WINDTOWN_FIELD, WINDTOWN_INSIDE } from "./places/windtownField";
import { CHAPELS_INSIDE, HOUSES_INSIDE } from "./places/interiors";
import { DECO_R, type DecoArt } from "./worldDeco";
import { WTILE } from "./worldMap";
import type { Mood } from "./worldMood";

/** npc = 말 거는 사람 (부딪힘) · door = 건물 문(들어가기) · exit = 건물 안 나가는 문 · deco = 가구 (부딪힘, 말 못 검) · warp = 순간 이동석 · pass = 국경 통로(다른 나라 필드로, 그 나라가 스토리에서 열렸을 때만) */
export type PlaceKind = "dungeon" | "town" | "sign" | "npc" | "door" | "exit" | "deco" | "warp" | "pass";
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
  /** door: 들어갈 건물 안 Region 이름 · deco: 가구 그림 · exit: 안쪽 문 대신 그릴 그림(계단) */
  to?: string;
  art?: DecoArt;
  /** dungeon: tower = 기억의 탑 (무한 모드·영웅의 길 고르는 창) · colosseum = 콜로세움 (패왕전) · arena = 헬리오스 광장 황제 석상 (레이드 아레나) · swarm = 사막 태초의 신전 (광야의 새벽) · td = 실베르 악마의 문 경비원 (타워 디펜스, 주민에게 붙임) · 없으면 기본 혼자 하기 */
  gate?: "tower" | "colosseum" | "arena" | "swarm" | "td";
  /** pass: 건너간 나라에서 설 칸 */
  land?: readonly [number, number];
  /** npc: 말 걸면 여는 창 (대사 대신) */
  menu?: WorldMenu;
  /** door: 가게 간판 */
  icon?: ShopIcon;
  /** door: 이 진영이 스토리에서 열려야 들어감 (아니면 `{name}Text` 글) */
  open?: FactionId;
}

export interface Region {
  /** public/ 아래 지도 그림 */
  map: string;
  start: { tx: number; ty: number };
  places: readonly Place[];
  /** 나라 필드: 진영 (이름·깃발 색·국경 통로가 열리는 장) */
  faction?: FactionId;
  /** 나라가 아닌 필드(사막 등): 이름 · 색 · 이 진영이 스토리에서 열리면 들어갈 수 있음 */
  area?: { name: TextKey; color: string; open: FactionId };
  /** 건물 안: 이름(나라 이름 대신) · 구름·나비 없음 */
  title?: TextKey;
  indoor?: boolean;
  /** 이 지역에서 바꿔 끼우는 그림 (기본 이름 → 그림 이름, worldTex.setArtSkin) · 건물 안은 INDOOR_SKIN 위에 덧씀 */
  skin?: Readonly<Record<string, string>>;
  /** 분위기 효과 (worldMood: 불씨·거품·비·꽃잎·금빛) · 없으면 나비·구름 그림자 */
  mood?: Mood;
  /** 지옥 불씨가 초록이 되는 가운데 칸 */
  moodCenter?: readonly [number, number];
  /** 나라 지도(M) 색 바꾸기: 땅 종류 번호 → 색 */
  mini?: Readonly<Partial<Record<number, string>>>;
  /** 타고 가는 곳(열차 안): secs초 뒤 to 지역의 land 칸에 내림 */
  ride?: { to: string; land: readonly [number, number]; secs: number };
}
export const skinOf = (r: Region): Readonly<Record<string, string>> | undefined => (r.indoor ? { ...INDOOR_SKIN, ...r.skin } : r.skin);

/** 나라 필드 · 건물 안 (장소 표는 places/ 나라마다) */
export const REGIONS: Record<string, Region> = {
  ascalon: ASCALON_FIELD,
  ...ASCALON_INSIDE,
  terracore: TERRA_FIELD,
  ...TERRA_INSIDE,
  virdia: VIRDIA_FIELD,
  ...VIRDIA_INSIDE,
  helios: HELIOS_FIELD,
  ...HELIOS_INSIDE,
  desert: DESERT_FIELD,
  silber: SILBER_FIELD,
  ...SILBER_INSIDE,
  thalassia: THAL_FIELD,
  ...THAL_INSIDE,
  ...DAWN_INSIDE,
  hell: HELL_FIELD,
  undersea: UNDERSEA_FIELD,
  ...UNDERSEA_INSIDE,
  cyber: CYBER_FIELD,
  ...CYBER_INSIDE,
  windtown: WINDTOWN_FIELD,
  ...WINDTOWN_INSIDE,
  seongguk: SEONGGUK_FIELD,
  ...SEONGGUK_INSIDE,
  ...HOUSES_INSIDE,
  ...CHAPELS_INSIDE,
};

/** 나라·지역 필드인지 (건물 안이 아님) */
export const isField = (r: Region | undefined): boolean => !!(r?.faction || r?.area);
/** 그 필드가 스토리에서 열렸는지 */
export const fieldOpen = (r: Region | undefined): boolean => {
  const f = r?.faction ?? r?.area?.open;
  return !!f && factionOpen(f);
};

/** 장소 가운데(픽셀) */
export const placeXY = (p: Place): [number, number] => [(p.tx + 0.5) * WTILE, (p.ty + 0.5) * WTILE];

/** 이 거리 안이면 F로 들어감·읽음 */
export const PLACE_NEAR = 20;

/** 사람(npc)·가구(deco)와 부딪히는지 */
export function hitsNpc(r: Region, x: number, y: number, rad: number): boolean {
  return r.places.some((p) => {
    if (p.kind === "npc") return Math.hypot(placeXY(p)[0] - x, placeXY(p)[1] + 4 - y) < rad + 8;
    if (p.gate === "tower") return Math.abs(placeXY(p)[0] - x) < rad + 14 && y < placeXY(p)[1] + rad + 4 && y > placeXY(p)[1] - 40;
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
