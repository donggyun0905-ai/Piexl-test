// 성국 필드 장소 (256×160칸, 지도 모양 scripts/art/world_seongguk.py — 지도를 고치면 좌표도 같이, 생성기가 걸을 수 있는 칸인지 검사)
// 대사막 서남쪽 순례길 (8장) · 흰 성벽 성도 · 대성당(안 지도: 제단·긴 의자·촛대·오르간) · 수도원 · 종탑·성화·천사 석상 · 지하 묘지 던전 · 성스러운 호수 · 순간 이동석 다섯
// 그림은 있는 칸에 성국 그림을 끼움 (skin) · 떠오르는 금빛 (worldMood)
import type { Place, Region } from "../worldPlaces";
import { HALL_SKIN } from "./skins";
import { HOLY_DECO_SPOTS, HOLY_HOUSE_DOORS } from "./seonggukLayout";

const deco = (id: string, tx: number, ty: number, art: Place["art"]): Place => ({ id, kind: "deco", tx, ty, name: "wpCathedral", art });

export const SEONGGUK_FIELD: Region = {
  map: "world/seongguk.png",
  start: { tx: 248, ty: 80 },
  faction: "seongguk",
  skin: { grass: "garden", path: "pilgrimRoad", floor: "holyStone", wallTop: "holyStone", house_red: "monastery", house_blue: "monastery", keep_art: "cathedral", cave: "stairs_down", snowStone: "marble" },
  mood: "holy",
  mini: { 1: "#7ad05a", 2: "#d8d0c0", 7: "#e8e4dc", 8: "#f4f0e4", 15: "#c87a4a", 16: "#f8f4e8", 42: "#ece6da" },
  places: [
    // 동쪽 끝 순례길 (대사막으로)
    { id: "toDesert", kind: "pass", tx: 253, ty: 80, name: "wpDesertRoad", to: "desert", land: [7, 132] },
    { id: "pilgrimSign", kind: "sign", tx: 240, ty: 76, name: "wpPilgrimRoad" },
    // 성도 · 대성당 · 수도원
    { id: "holyTown", kind: "town", tx: 102, ty: 80, name: "wpHolyCity" },
    { id: "cathedralDoor", kind: "door", tx: 102, ty: 64, name: "wpCathedral", to: "seonggukCathedral" },
    ...HOLY_HOUSE_DOORS.map(([tx, ty]): Place => ({ id: `house${tx}_${ty}`, kind: "door", tx, ty, name: "wpMonastery", to: "houseHoly" })),
    { id: "holyIan", kind: "npc", tx: 150, ty: 82, name: "ian", who: "ian", line: "wnHolyIan" },
    { id: "holyGabriel", kind: "npc", tx: 96, ty: 72, name: "gabriel", who: "gabriel", line: "wnHolyGabriel" },
    { id: "holySerena", kind: "npc", tx: 108, ty: 96, name: "serena", who: "serena", line: "wnHolySerena" },
    { id: "holyRafael", kind: "npc", tx: 42, ty: 118, name: "rafael", who: "rafael", line: "wnHolyRafael" },
    { id: "holyYuriel", kind: "npc", tx: 80, ty: 80, name: "yuriel", who: "yuriel", line: "wnHolyYuriel" },
    // 성스러운 호수 · 지하 묘지 (혼자 하기)
    { id: "lakeSign", kind: "sign", tx: 52, ty: 124, name: "wpHolyLake" },
    { id: "catacombs", kind: "dungeon", tx: 46, ty: 28, name: "wpCatacombs" },
    { id: "holyMichaela", kind: "npc", tx: 50, ty: 32, name: "michaela", who: "michaela", line: "wnHolyMichaela" },
    // 장식 (종탑·성화·천사 석상·촛대·흰 깃발)
    ...HOLY_DECO_SPOTS.map(([art, tx, ty], i): Place => ({ id: `d${i}`, kind: "deco", tx, ty, name: "wpHolyCity", art })),
    // 순간 이동석
    { id: "warpPilgrim", kind: "warp", tx: 244, ty: 84, name: "wpWarpPilgrim" },
    { id: "warpHolyCity", kind: "warp", tx: 110, ty: 80, name: "wpWarpHolyCity" },
    { id: "warpCathedral", kind: "warp", tx: 110, ty: 68, name: "wpWarpCathedral" },
    { id: "warpCatacombs", kind: "warp", tx: 42, ty: 32, name: "wpWarpCatacombs" },
    { id: "warpHolyLake", kind: "warp", tx: 56, ty: 128, name: "wpWarpHolyLake" },
  ],
};

/** 대성당 안 (성채 안 지도, 흰 돌바닥·돌벽): 베아트리체 · 제단 · 긴 의자 · 촛대 · 오르간 */
export const SEONGGUK_INSIDE: Record<string, Region> = {
  seonggukCathedral: {
    map: "world/ascalon_keep.png",
    start: { tx: 9, ty: 10 },
    title: "wpCathedral",
    indoor: true,
    skin: { ...HALL_SKIN, floor: "holyStone" },
    mood: "holy",
    places: [
      { id: "keepExit", kind: "exit", tx: 9, ty: 11, name: "wpGoOut" },
      { id: "holyBeatrice", kind: "npc", tx: 9, ty: 4, name: "beatrice", who: "beatrice", line: "wnHolyBeatrice" },
      deco("altar", 9, 2, "churchAltar"),
      deco("organ", 16, 2, "organ"),
      deco("candleL", 6, 2, "candleTall"),
      deco("candleR", 12, 2, "candleTall"),
      ...[5, 13].flatMap((x) => [6, 8, 10].map((y) => deco(`pew${x}${y}`, x, y, "pew"))),
    ],
  },
};
