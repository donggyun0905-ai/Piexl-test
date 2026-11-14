// 비연 필드 장소 (256×160칸, 지도 모양 scripts/art/world_windtown.py — 지도를 고치면 좌표도 같이, 생성기가 걸을 수 있는 칸인지 검사)
// 비르디아 동쪽 해안에서 나룻배 (9장) · 꽃잎 길 · 개울 · 기와 마을(큰 기와집 안 지도) · 풍차 언덕 · 대나무숲 · 바람 골짜기 던전 · 순간 이동석 다섯
// 그림은 있는 칸에 비연 그림을 끼움 (skin) · 날리는 꽃잎·바람 줄기 (worldMood)
import type { Place, Region } from "../worldPlaces";
import { WIND_DECO_SPOTS, WIND_HOUSE_DOORS } from "./windtownLayout";

export const WINDTOWN_FIELD: Region = {
  map: "world/windtown.png",
  start: { tx: 6, ty: 80 },
  area: { name: "wpWindtown", color: "#9ae8c8", open: "thalassia" },
  skin: {
    path: "tileRoad", floor: "yard", sand: "petalPath", field: "bambooGround", water: "stream", house_red: "hanok", house_blue: "hanok", keep_art: "hanok_big",
    tree_oak: "blossom_tree", tree_pine: "bamboo", tree_pine2: "bamboo", bush: "jars",
  },
  mood: "petals",
  mini: { 2: "#a8a8a0", 5: "#e8b8c8", 8: "#d8c098", 13: "#a8b860", 15: "#8a5a3a", 16: "#6a4a3a" },
  places: [
    // 서쪽 나루 (비르디아 동쪽 해안으로)
    { id: "toVirdia", kind: "pass", tx: 2, ty: 80, name: "wpFerryVirdia", to: "virdia", land: [235, 60] },
    { id: "ferrySign", kind: "sign", tx: 8, ty: 76, name: "wpWindFerry" },
    // 기와 마을 · 큰 기와집
    { id: "windTown", kind: "town", tx: 150, ty: 70, name: "wpWindVillage" },
    { id: "manorDoor", kind: "door", tx: 150, ty: 37, name: "wpWindManor", to: "windManor" },
    ...WIND_HOUSE_DOORS.map(([tx, ty]): Place => ({ id: `house${tx}_${ty}`, kind: "door", tx, ty, name: "wpHouse", to: "houseBiyeon" })),
    { id: "windSummoner", kind: "npc", tx: 144, ty: 84, name: "summoner", who: "summoner", line: "wnWindSummoner" },
    { id: "windPuppeteer", kind: "npc", tx: 60, ty: 40, name: "puppeteer", who: "puppeteer", line: "wnWindPuppeteer" },
    { id: "windShadowing", kind: "npc", tx: 200, ty: 128, name: "shadowing", who: "shadowing", line: "wnWindShadowing" },
    { id: "bambooSign", kind: "sign", tx: 196, ty: 124, name: "wpBambooGrove" },
    // 바람 골짜기 던전 (혼자 하기)
    { id: "windValley", kind: "dungeon", tx: 210, ty: 10, name: "wpWindValley" },
    // 장식 (풍차·바람개비·천 깃발·정자·장독대·돌담·꽃나무)
    ...WIND_DECO_SPOTS.map(([art, tx, ty], i): Place => ({ id: `d${i}`, kind: "deco", tx, ty, name: "wpWindtown", art })),
    // 풍차 언덕 연 둘 · 마을 앞 연 하나 (줄 말뚝 자리, 연은 하늘에)
    ...([[48, 22], [64, 28], [146, 76]] as const).map(([tx, ty]): Place => ({ id: `kite${tx}_${ty}`, kind: "deco", tx, ty, name: "wpWindtown", art: "kite" })),
    // 순간 이동석
    { id: "warpWindFerry", kind: "warp", tx: 10, ty: 84, name: "wpWarpWindFerry" },
    { id: "warpWindVillage", kind: "warp", tx: 154, ty: 70, name: "wpWarpWindVillage" },
    { id: "warpWindmill", kind: "warp", tx: 50, ty: 26, name: "wpWarpWindmill" },
    { id: "warpBamboo", kind: "warp", tx: 204, ty: 130, name: "wpWarpBamboo" },
    { id: "warpWindValley", kind: "warp", tx: 206, ty: 13, name: "wpWarpWindValley" },
  ],
};

/** 큰 기와집 안 (성채 안 지도, 나무 바닥): 음양사 · 장독대·화분·책장 */
export const WINDTOWN_INSIDE: Record<string, Region> = {
  windManor: {
    map: "world/ascalon_keep.png",
    start: { tx: 9, ty: 10 },
    title: "wpWindManor",
    indoor: true,
    skin: { floor: "woodFloor" },
    places: [
      { id: "keepExit", kind: "exit", tx: 9, ty: 11, name: "wpGoOut" },
      { id: "windMystic", kind: "npc", tx: 9, ty: 4, name: "mystic", who: "mystic", line: "wnWindMystic" },
      ...[4, 14].flatMap((x) => [4, 8].map((y): Place => ({ id: `plant${x}${y}`, kind: "deco", tx: x, ty: y, name: "wpWindManor", art: "plant" }))),
      { id: "shelfL", kind: "deco", tx: 2, ty: 2, name: "wpWindManor", art: "shelf" },
      { id: "shelfR", kind: "deco", tx: 16, ty: 2, name: "wpWindManor", art: "shelf" },
      { id: "jars", kind: "deco", tx: 16, ty: 10, name: "wpWindManor", art: "jars" },
    ],
  },
};
