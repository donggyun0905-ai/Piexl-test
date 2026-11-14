// 해저 도시 필드 장소 (256×160칸, 지도 모양 scripts/art/world_undersea.py — 지도를 고치면 좌표도 같이, 생성기가 걸을 수 있는 칸인지 검사)
// 탈라시아 잔교 끝 잠수 종으로 내려옴 (9장) · 진주 돌길 광장·조개 집 마을 · 해저 신전(안 지도) · 남쪽 깊은 해구 = 심연 던전 · 순간 이동석 다섯
// 그림은 있는 칸에 해저 그림을 끼움 (skin) · 거품·물결 빛 (worldMood)
import type { Place, Region } from "../worldPlaces";
import { HALL_SKIN } from "./skins";
import { SEA_DECO_SPOTS, SEA_HOUSE_DOORS } from "./underseaLayout";

const SKIN = { grass: "seabed", path: "pearlRoad", floor: "pearlRoad", sand: "coral", field: "kelpBed", water: "trench", deep: "trench" };

export const UNDERSEA_FIELD: Region = {
  map: "world/undersea.png",
  start: { tx: 128, ty: 6 },
  area: { name: "wpUndersea", color: "#5ad8ff", open: "thalassia" },
  skin: {
    ...SKIN, house_red: "shell_house", house_blue: "bubble_dome", keep_art: "sea_temple", bush: "clam", cave: "stairs_down",
    tree_oak: "kelp_tall", tree_oak2: "coral_big", tree_pine: "kelp_tall", tree_pine2: "coral_big",
  },
  mood: "bubbles",
  mini: { 1: "#8ab4c8", 2: "#c8e8ec", 3: "#0c1c3a", 4: "#060e22", 5: "#c86a8a", 6: "#3a8a5a", 8: "#c8e8ec", 13: "#4a7a4a", 15: "#e8d0b8", 16: "#2a6a6a" },
  places: [
    // 잠수 종 (탈라시아 잔교 끝으로 올라감)
    { id: "toThalassia", kind: "pass", tx: 128, ty: 2, name: "wpDivingBell", to: "thalassia", land: [223, 91] },
    // 광장 · 조개 집 마을 · 해저 신전
    { id: "seaTown", kind: "town", tx: 128, ty: 66, name: "wpSeaCity" },
    { id: "templeDoor", kind: "door", tx: 128, ty: 46, name: "wpSeaTemple", to: "seaTemple" },
    ...SEA_HOUSE_DOORS.map(([tx, ty]): Place => ({ id: `house${tx}_${ty}`, kind: "door", tx, ty, name: "wpHouse", to: "ascalonHouse" })),
    { id: "seaDuck", kind: "npc", tx: 122, ty: 74, name: "duck", who: "duck", line: "wnSeaDuck" },
    { id: "seaCollector", kind: "npc", tx: 60, ty: 68, name: "collector", who: "collector", line: "wnSeaCollector" },
    // 깊은 해구 (심연 던전)
    { id: "abyss", kind: "dungeon", tx: 128, ty: 119, name: "wpAbyss" },
    { id: "trenchSign", kind: "sign", tx: 122, ty: 116, name: "wpTrench" },
    // 장식 (큰 조개·가라앉은 상자·산호·해초)
    ...SEA_DECO_SPOTS.map(([art, tx, ty], i): Place => ({ id: `d${i}`, kind: "deco", tx, ty, name: "wpSeaCity", art })),
    // 순간 이동석
    { id: "warpSeaBell", kind: "warp", tx: 133, ty: 6, name: "wpWarpSeaBell" },
    { id: "warpSeaCity", kind: "warp", tx: 134, ty: 76, name: "wpWarpSeaCity" },
    { id: "warpSeaWest", kind: "warp", tx: 14, ty: 64, name: "wpWarpSeaWest" },
    { id: "warpSeaEast", kind: "warp", tx: 242, ty: 68, name: "wpWarpSeaEast" },
    { id: "warpAbyss", kind: "warp", tx: 134, ty: 118, name: "wpWarpAbyss" },
  ],
};

/** 해저 신전 안 (성채 안 지도): 운명의 여행자 · 산호·조개·보물 상자 */
export const UNDERSEA_INSIDE: Record<string, Region> = {
  seaTemple: {
    map: "world/ascalon_keep.png",
    start: { tx: 9, ty: 10 },
    title: "wpSeaTemple",
    indoor: true,
    skin: { ...HALL_SKIN, floor: "pearlRoad", carpet: "coral" },
    mood: "bubbles",
    places: [
      { id: "keepExit", kind: "exit", tx: 9, ty: 11, name: "wpGoOut" },
      { id: "seaVoyager", kind: "npc", tx: 9, ty: 4, name: "voyager", who: "voyager", line: "wnSeaVoyager" },
      ...[4, 14].flatMap((x) => [4, 8].map((y): Place => ({ id: `coral${x}${y}`, kind: "deco", tx: x, ty: y, name: "wpSeaTemple", art: "coral" }))),
      { id: "chestL", kind: "deco", tx: 2, ty: 3, name: "wpSeaTemple", art: "chest" },
      { id: "chestR", kind: "deco", tx: 16, ty: 3, name: "wpSeaTemple", art: "chest" },
      { id: "clam", kind: "deco", tx: 9, ty: 2, name: "wpSeaTemple", art: "clam" },
    ],
  },
};
