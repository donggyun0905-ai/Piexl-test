// 탈라시아 필드 장소 (256×160칸, 지도 모양 scripts/art/world_thalassia.py — 지도를 고치면 좌표도 같이, 생성기가 걸을 수 있는 칸인지 검사)
// 강 하구 항구 도시(광장 생선 노점 · 무역 상회 · 민가 · 창고) · 부두와 잔교 셋(범선·해적선·작은 배) · 등대 곶 · 해식 동굴 던전 · 대사막 땅길 · 순간 이동석 여섯
import { shop } from "./ascalonInside";
import type { Place, Region } from "../worldPlaces";
import { THAL_DECO_SPOTS, THAL_HOUSE_DOORS, THAL_TRADE_DOOR as TD, THAL_WAREHOUSE_DOORS } from "./thalassiaLayout";

export const THAL_FIELD: Region = {
  map: "world/thalassia.png",
  start: { tx: 8, ty: 92 },
  faction: "thalassia",
  places: [
    // 광장 · 무역 상회 · 민가 · 창고
    { id: "thalTown", kind: "town", tx: 138, ty: 88, name: "wpThalPort" },
    { id: "tradeDoor", kind: "door", tx: TD[0], ty: TD[1], name: "wpTradeHouse", to: "thalTrade", icon: "bag" },
    ...THAL_HOUSE_DOORS.map(([tx, ty]): Place => ({ id: `house${tx}_${ty}`, kind: "door", tx, ty, name: "wpHouse", to: "ascalonHouse" })),
    ...THAL_WAREHOUSE_DOORS.map(([tx, ty]): Place => ({ id: `ware${tx}_${ty}`, kind: "door", tx, ty, name: "wpWarehouse", to: "ascalonHouse" })),
    { id: "thalLevia", kind: "npc", tx: 142, ty: 100, name: "levia", who: "levia", line: "wnLevia" },
    { id: "thalTail", kind: "npc", tx: 104, ty: 66, name: "tail", who: "tail", line: "wnTail" },
    // 부두 · 잔교 · 월계선 선착장
    { id: "pierSign", kind: "sign", tx: 198, ty: 93, name: "wpPier" },
    { id: "thalThorken", kind: "npc", tx: 190, ty: 74, name: "thorken", who: "thorken", line: "wnThorken" },
    { id: "thalWave", kind: "npc", tx: 220, ty: 91, name: "wave", who: "wave", line: "wnWave" },
    { id: "thalMadQueen", kind: "npc", tx: 220, ty: 71, name: "madQueen", who: "madQueen", line: "wnMadQueen" },
    { id: "thalOrca", kind: "npc", tx: 192, ty: 126, name: "orca", who: "orca", line: "wnOrca" },
    // 등대 곶 · 해식 동굴 (혼자 하기)
    { id: "thalMiryu", kind: "npc", tx: 208, ty: 144, name: "miryu", who: "miryu", line: "wnMiryu" },
    { id: "seaCave", kind: "dungeon", tx: 166, ty: 15, name: "wpSeaCave" },
    // 서쪽 땅길 (대사막)
    { id: "toDesert", kind: "pass", tx: 2, ty: 92, name: "wpDesertRoad", to: "desert", land: [246, 92] },
    // 장식 (배·크레인·화물·등대·노점·닻·그물·말뚝)
    ...THAL_DECO_SPOTS.map(([art, tx, ty], i): Place => ({ id: `d${i}`, kind: "deco", tx, ty, name: "wpPier", art })),
    // 순간 이동석
    { id: "warpThalWest", kind: "warp", tx: 12, ty: 96, name: "wpWarpThalWest" },
    { id: "warpThalPort", kind: "warp", tx: 146, ty: 90, name: "wpWarpThalPort" },
    { id: "warpPier", kind: "warp", tx: 196, ty: 87, name: "wpWarpPier" },
    { id: "warpLighthouse", kind: "warp", tx: 204, ty: 140, name: "wpWarpLighthouse" },
    { id: "warpSeaCave", kind: "warp", tx: 162, ty: 19, name: "wpWarpSeaCave" },
    { id: "warpRiver", kind: "warp", tx: 100, ty: 72, name: "wpWarpRiver" },
  ],
};

/** 무역 상회 (가게 안 지도, 훅 = 게임 상점 뽑기) */
export const THAL_INSIDE: Record<string, Region> = {
  thalTrade: shop("wpTradeHouse", "hook", "wnHook", "shop:gacha", "shelf", "barrel"),
};
