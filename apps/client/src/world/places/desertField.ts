// 사막 필드 장소 (256×160칸, 지도 모양 scripts/art/world_desert.py — 지도를 고치면 좌표도 같이, 생성기가 걸을 수 있는 칸인지 검사)
// 대상 길(아스칼론·테라코어 ↔ 헬리오스) · 오아시스와 천막 · 태초의 신전(광야의 새벽) · 세레스티아(묻힌 옛 도시·왕묘 던전) · 순간 이동석 여섯 · 장식은 생성기가 자리를 정함
import type { Place, Region } from "../worldPlaces";
import { DESERT_DECO_SPOTS } from "./desertLayout";

export const DESERT_FIELD: Region = {
  map: "world/desert.png",
  start: { tx: 100, ty: 6 },
  area: { name: "wpDesert", color: "#e8c070", open: "helios" },
  places: [
    // 국경 길 (아스칼론·테라코어·헬리오스)
    { id: "toAscalon", kind: "pass", tx: 100, ty: 2, name: "wpToAscalon", to: "ascalon", land: [103, 152] },
    { id: "toTerra", kind: "pass", tx: 200, ty: 2, name: "wpToTerra", to: "terracore", land: [100, 152] },
    { id: "toHelios", kind: "pass", tx: 128, ty: 157, name: "wpDesertRoad", to: "helios", land: [128, 10] },
    { id: "heliosSign", kind: "sign", tx: 124, ty: 152, name: "wpSignHelios" },
    // 오아시스 · 대상 천막
    { id: "oasisSign", kind: "sign", tx: 140, ty: 66, name: "wpOasis" },
    { id: "desertBedouin", kind: "npc", tx: 160, ty: 92, name: "bedouin", who: "bedouin", line: "wnDesertBedouin" },
    // 태초의 신전 (광야의 새벽)
    { id: "temple", kind: "dungeon", tx: 210, ty: 107, name: "wpTemple", gate: "swarm" },
    // 세레스티아 · 옛 왕묘 (혼자 하기)
    { id: "celestiaSign", kind: "sign", tx: 52, ty: 90, name: "wpCelestia" },
    { id: "royalTomb", kind: "dungeon", tx: 31, ty: 74, name: "wpTomb" },
    { id: "desertWanderer", kind: "npc", tx: 45, ty: 92, name: "wanderer", who: "wanderer", line: "wnDesertWanderer" },
    // 장식 (야자수·천막·기둥·석상·선인장·덤불·뼈)
    ...DESERT_DECO_SPOTS.map(([art, tx, ty], i): Place => ({ id: `d${i}`, kind: "deco", tx, ty, name: "wpDesert", art })),
    // 순간 이동석
    { id: "warpDesertNW", kind: "warp", tx: 106, ty: 9, name: "wpWarpDesertNW" },
    { id: "warpDesertNE", kind: "warp", tx: 194, ty: 9, name: "wpWarpDesertNE" },
    { id: "warpOasis", kind: "warp", tx: 136, ty: 86, name: "wpWarpOasis" },
    { id: "warpTemple", kind: "warp", tx: 216, ty: 110, name: "wpWarpTemple" },
    { id: "warpCelestia", kind: "warp", tx: 56, ty: 87, name: "wpWarpCelestia" },
    { id: "warpDesertSouth", kind: "warp", tx: 133, ty: 150, name: "wpWarpDesertSouth" },
  ],
};
