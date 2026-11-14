// 사이버펑크 도시 필드 장소 (256×160칸, 지도 모양 scripts/art/world_cyber.py — 지도를 고치면 좌표도 같이, 생성기가 걸을 수 있는 칸인지 검사)
// 테라코어 역에서 해저 열차로 5분 (9장) · 서쪽 끝 해저 열차 역 · 현대 도시(빌딩·광장 홀로그램) · 동쪽 젖은 네온 거리 · 편의점(안 = 가게) · 순간 이동석 다섯
// 해저 열차 칸(안 지도 world_rooms.sea_train): 탄 뒤 5분이 지나면 반대편 역에 내림 (열차 안 보스전 등은 나중에)
import { shop } from "./ascalonInside";
import type { Place, Region } from "../worldPlaces";
import { CYBER_DECO_SPOTS, CYBER_HOUSE_DOORS } from "./cyberLayout";

export const CYBER_FIELD: Region = {
  map: "world/cyber.png",
  start: { tx: 12, ty: 75 },
  area: { name: "wpCyber", color: "#ff5ad8", open: "thalassia" },
  skin: {
    grass: "sidewalk", path: "asphalt", floor: "plaza", sand: "wetStreet", field: "neonTile", wallTop: "neonTile", wallFace: "wetStreet", marble: "plaza",
    villa_helios: "office_tower", palace: "neon_tower", house_red: "corner_store", house_blue: "corner_store", bush: "", cave: "stairs_down", rock_big: "air_vent", rock_small: "trash_bin",
  },
  mood: "rain",
  mini: { 1: "#8c8c94", 2: "#2a2a32", 5: "#3a2a4a", 7: "#4a3a6a", 8: "#c8c8d0", 13: "#3ad8e8", 15: "#c87a4a", 31: "#a04ad8", 32: "#4a8ac8" },
  places: [
    // 해저 열차 역 (테라코어로 돌아가는 열차)
    { id: "trainBack", kind: "pass", tx: 9, ty: 75, name: "wpTrainToTerra", to: "seaTrainWest", land: [36, 5] },
    { id: "stationSign", kind: "sign", tx: 12, ty: 68, name: "wpCyberStation" },
    // 광장 · 편의점 · 네온 거리
    { id: "cyberTown", kind: "town", tx: 115, ty: 76, name: "wpCyberPlaza" },
    ...CYBER_HOUSE_DOORS.map(([tx, ty]): Place => ({ id: `store${tx}_${ty}`, kind: "door", tx, ty, name: "wpCornerStore", to: "cyberStore", icon: "bag" })),
    { id: "cyberOnyx", kind: "npc", tx: 112, ty: 86, name: "onyx", who: "onyx", line: "wnCyberOnyx" },
    { id: "cyberChrono", kind: "npc", tx: 165, ty: 106, name: "chronomancer", who: "chronomancer", line: "wnCyberChrono" },
    { id: "cyberDoctor", kind: "npc", tx: 60, ty: 76, name: "doctor", who: "doctor", line: "wnCyberDoctor" },
    { id: "neonSign2", kind: "sign", tx: 165, ty: 94, name: "wpNeonStreet" },
    // 지하 데이터 센터 던전 (혼자 하기)
    { id: "dataCenter", kind: "dungeon", tx: 238, ty: 140, name: "wpDataCenter" },
    // 장식 (가로등·홀로그램·자판기·네온 간판·차·쓰레기통·환풍기·전선 기둥)
    ...CYBER_DECO_SPOTS.map(([art, tx, ty], i): Place => ({ id: `d${i}`, kind: "deco", tx, ty, name: "wpCyber", art })),
    // 순간 이동석
    { id: "warpCyberStation", kind: "warp", tx: 14, ty: 80, name: "wpWarpCyberStation" },
    { id: "warpCyberPlaza", kind: "warp", tx: 132, ty: 76, name: "wpWarpCyberPlaza" },
    { id: "warpNeon", kind: "warp", tx: 182, ty: 106, name: "wpWarpNeon" },
    { id: "warpCyberNorth", kind: "warp", tx: 140, ty: 8, name: "wpWarpCyberNorth" },
    { id: "warpDataCenter", kind: "warp", tx: 242, ty: 144, name: "wpWarpDataCenter" },
  ],
};

/** 해저 열차 칸: 창문 · 좌석 · 손님 (to 쪽 역에 내림) */
function train(to: string, land: readonly [number, number], who: Place["who"]): Region {
  return {
    map: "world/sea_train.png",
    start: { tx: 3, ty: 5 },
    area: { name: "wpSeaTrain", color: "#5ad8ff", open: "thalassia" },
    skin: { floor: "metalFloorIn" },
    mood: "bubbles",
    ride: { to, land, secs: 300 },
    places: [
      ...Array.from({ length: 9 }, (_, i): Place => ({ id: `win${i}`, kind: "deco", tx: 3 + i * 4, ty: 1, name: "wpSeaTrain", art: "trainWindow" })),
      ...[5, 13, 21, 29].flatMap((x) => [3, 7].map((y): Place => ({ id: `seat${x}_${y}`, kind: "deco", tx: x, ty: y, name: "wpSeaTrain", art: "pew" }))),
      { id: "rider", kind: "npc", tx: 20, ty: 6, name: who!, who, line: "wnTrainRider" },
    ],
  };
}

export const CYBER_INSIDE: Record<string, Region> = {
  /** 테라코어 → 사이버펑크 · 사이버펑크 → 테라코어 */
  seaTrainEast: train("cyber", [12, 75], "stargazer"),
  seaTrainWest: train("terracore", [97, 102], "miner"),
  /** 편의점 (가게 안 지도, 아티팩터 = 게임 상점 로비 꾸밈 탭) */
  cyberStore: { ...shop("wpCornerStore", "artifacter", "wnCyberStore", "shop:lobby", "potions", "crates"), skin: { woodFloor: "plaza" } },
};
