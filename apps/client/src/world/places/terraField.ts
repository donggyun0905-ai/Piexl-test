// 테라코어 필드 장소 (256×160칸, 지도 모양 scripts/art/world_terra.py — 지도를 고치면 좌표도 같이, 생성기가 걸을 수 있는 칸인지 검사)
// 쇠 성벽 도시(광장 톱니 기념물·공장 굴뚝 연기·공방·주거지) · 역과 철길 · 콜로세움(패왕전) · 광산 던전 · 아스칼론 국경 통로 · 비르디아 국경 · 순간 이동석 다섯
import type { Place, Region } from "../worldPlaces";
import { TERRA_CHIMNEYS, TERRA_HOUSE_DOORS, TERRA_WORKSHOP_DOOR as WD } from "./terraLayout";

export const TERRA_FIELD: Region = {
  map: "world/terracore.png",
  start: { tx: 6, ty: 56 },
  faction: "terracore",
  places: [
    // 광장
    { id: "terraTown", kind: "town", tx: 121, ty: 61, name: "wpTerraCity" },
    { id: "terraGear", kind: "deco", tx: 128, ty: 51, name: "wpTerraCity", art: "gear" },
    { id: "terraGunner", kind: "npc", tx: 123, ty: 48, name: "gunner", who: "gunner", line: "wnGunner" },
    // 공장 지대 · 공방 · 굴뚝 연기
    { id: "workshopDoor", kind: "door", tx: WD[0], ty: WD[1], name: "wpWorkshop", to: "terraWorkshop", icon: "hammer" },
    ...TERRA_CHIMNEYS.map(([tx, ty]): Place => ({ id: `smoke${tx}_${ty}`, kind: "deco", tx, ty, name: "wpTerraCity", art: "smoke" })),
    { id: "factorySign", kind: "sign", tx: 100, ty: 41, name: "wpFactory" },
    // 주거지 (모두 같은 민가 안)
    ...TERRA_HOUSE_DOORS.map(([tx, ty]): Place => ({ id: `house${tx}_${ty}`, kind: "door", tx, ty, name: "wpHouse", to: "ascalonHouse" })),
    { id: "terraPunk", kind: "npc", tx: 101, ty: 74, name: "punk", who: "punk", line: "wnPunk" },
    // 서문 · 아스칼론 국경 통로
    { id: "terraAutomata", kind: "npc", tx: 66, ty: 53, name: "automata", who: "automata", line: "wnAutomata" },
    { id: "toAscalon", kind: "pass", tx: 2, ty: 56, name: "wpToAscalon", to: "ascalon", land: [244, 56] },
    // 역 · 철길
    { id: "stationSign", kind: "sign", tx: 106, ty: 102, name: "wpStation" },
    { id: "terraRider", kind: "npc", tx: 92, ty: 102, name: "rider", who: "rider", line: "wnRider" },
    // 콜로세움 (패왕전)
    { id: "colosseum", kind: "dungeon", tx: 150, ty: 138, name: "wpColosseum", gate: "colosseum" },
    { id: "terraTitan", kind: "npc", tx: 144, ty: 142, name: "titan", who: "titan", line: "wnTitan" },
    // 광산 던전 (혼자 하기)
    { id: "mineDungeon", kind: "dungeon", tx: 205, ty: 13, name: "wpMine" },
    { id: "terraBomber", kind: "npc", tx: 201, ty: 18, name: "bomber", who: "bomber", line: "wnBomber" },
    // 비르디아 국경
    { id: "virdiaSign", kind: "sign", tx: 247, ty: 53, name: "wpSignVirdia" },
    // 순간 이동석
    { id: "warpTerraPlaza", kind: "warp", tx: 135, ty: 61, name: "wpWarpTerraPlaza" },
    { id: "warpTerraWest", kind: "warp", tx: 9, ty: 60, name: "wpWarpTerraWest" },
    { id: "warpStation", kind: "warp", tx: 110, ty: 99, name: "wpWarpStation" },
    { id: "warpColosseum", kind: "warp", tx: 157, ty: 142, name: "wpWarpColosseum" },
    { id: "warpMine", kind: "warp", tx: 209, ty: 18, name: "wpWarpMine" },
  ],
};

/** 공방 안: 가게 안 지도 · 화덕·모루·무기 걸이 · 기술자 = 대장간 (레이드 장신구) */
export const TERRA_INSIDE: Record<string, Region> = {
  terraWorkshop: {
    map: "world/ascalon_shop.png",
    start: { tx: 6, ty: 6 },
    title: "wpWorkshop",
    indoor: true,
    places: [
      { id: "exit", kind: "exit", tx: 6, ty: 7, name: "wpGoOut" },
      { id: "engineer", kind: "npc", tx: 6, ty: 3, name: "engineer", who: "engineer", line: "wnEngineer", menu: "smith" },
      { id: "forge", kind: "deco", tx: 2, ty: 2, name: "wpWorkshop", art: "forge" },
      { id: "anvil", kind: "deco", tx: 4, ty: 4, name: "wpWorkshop", art: "anvil" },
      { id: "rack", kind: "deco", tx: 10, ty: 2, name: "wpWorkshop", art: "rack" },
      { id: "gear", kind: "deco", tx: 10, ty: 6, name: "wpWorkshop", art: "barrel" },
    ],
  },
};
