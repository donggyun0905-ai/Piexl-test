// 지옥 필드 장소 (256×160칸, 지도 모양 scripts/art/world_hell.py — 지도를 고치면 좌표도 같이, 생성기가 걸을 수 있는 칸인지 검사)
// 실베르 악마의 문 너머 (9장) · 흑요석 성채 안 악마의 문 = 지옥 던전 · 용암 강 둘·호수 · 해골 기둥 초소 · 불 구덩이 벌판 · 순간 이동석 다섯
// 그림은 있는 칸에 지옥 그림을 끼움 (skin) · 불씨는 성채에 가까울수록 초록, 멀수록 붉음 (worldMood)
import type { Place, Region } from "../worldPlaces";
import { HELL_DECO_SPOTS } from "./hellLayout";

export const HELL_FIELD: Region = {
  map: "world/hell.png",
  start: { tx: 128, ty: 6 },
  area: { name: "wpHell", color: "#ff6a3a", open: "silber" },
  skin: {
    grass: "ash", path: "basalt", floor: "obsidian", sand: "bloodRock", water: "lava", deep: "lava", wallTop: "obsidian", wallFace: "basalt",
    rock_big: "spiky_rock", rock_small: "spiky_rock", bush: "chain_post", tree_oak: "bone_tree", tree_oak2: "bone_tree", tree_pine: "bone_tree", tree_pine2: "skull_pillar", keep_art: "demon_gate", cave: "stairs_down",
  },
  mood: "embers",
  moodCenter: [128, 80],
  mini: { 1: "#4a4248", 2: "#2a2228", 3: "#e0501a", 4: "#ff7a2a", 5: "#7a2a20", 6: "#c8b89a", 7: "#383040", 8: "#1a1420", 9: "#141018", 16: "#5a2a40" },
  places: [
    // 북쪽 끝: 실베르 악마의 문으로 돌아감
    { id: "toSilber", kind: "pass", tx: 128, ty: 2, name: "wpToSilber", to: "silber", land: [128, 16] },
    { id: "hellSign", kind: "sign", tx: 122, ty: 7, name: "wpHellGate" },
    // 흑요석 성채 · 악마의 문 (지옥 던전)
    { id: "hellCore", kind: "dungeon", tx: 128, ty: 73, name: "wpHellCore" },
    { id: "hellNoir", kind: "npc", tx: 120, ty: 90, name: "noir", who: "noir", line: "wnHellNoir" },
    { id: "hellRouge", kind: "npc", tx: 136, ty: 90, name: "rouge", who: "rouge", line: "wnHellRouge" },
    // 초소 · 불 구덩이 벌판
    { id: "hellMagenta", kind: "npc", tx: 28, ty: 84, name: "magenta", who: "magenta", line: "wnHellMagenta" },
    { id: "hellBlanc", kind: "npc", tx: 228, ty: 84, name: "blanc", who: "blanc", line: "wnHellBlanc" },
    { id: "lavaSign", kind: "sign", tx: 128, ty: 144, name: "wpFirePits" },
    // 장식 (해골 기둥·뒤틀린 탑·불 구덩이·사슬 기둥·가시 바위)
    ...HELL_DECO_SPOTS.map(([art, tx, ty], i): Place => ({ id: `d${i}`, kind: "deco", tx, ty, name: "wpHell", art })),
    // 순간 이동석
    { id: "warpHellGate", kind: "warp", tx: 133, ty: 6, name: "wpWarpHellGate" },
    { id: "warpHellCitadel", kind: "warp", tx: 136, ty: 100, name: "wpWarpHellCitadel" },
    { id: "warpHellWest", kind: "warp", tx: 22, ty: 82, name: "wpWarpHellWest" },
    { id: "warpHellEast", kind: "warp", tx: 234, ty: 82, name: "wpWarpHellEast" },
    { id: "warpHellSouth", kind: "warp", tx: 133, ty: 146, name: "wpWarpHellSouth" },
  ],
};
