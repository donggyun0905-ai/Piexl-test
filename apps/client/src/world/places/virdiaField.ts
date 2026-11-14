// 비르디아 필드 장소 (256×160칸, 지도 모양 scripts/art/world_virdia.py — 지도를 고치면 좌표도 같이, 생성기가 걸을 수 있는 칸인지 검사)
// 숲속 성(생울타리 성벽·세계수 광장·성채·정령의 샘·약초 가게) · 나무 집 마을 · 강과 다리 · 정령의 숲터 · 깊은 숲 던전 · 동쪽 해안 · 테라코어 국경 통로 · 순간 이동석 여섯
import { shop } from "./ascalonInside";
import type { Place, Region } from "../worldPlaces";
import { VIRDIA_HERB_DOOR as HD, VIRDIA_HOUSE_DOORS } from "./virdiaLayout";

const VIRDIA_PROPS: readonly (readonly [Place["art"], number, number])[] = [
  ["lantern", 126, 36], ["lantern", 130, 36], ["lantern", 126, 64], ["lantern", 130, 64], ["lantern", 126, 76], ["lantern", 130, 76],
  ["mushroom", 104, 40], ["mushroom", 152, 40], ["mushroom", 106, 62], ["mushroom", 151, 80], ["fern", 112, 34], ["fern", 144, 34],
  ["fern", 117, 46], ["fern", 142, 49], ["flowerBush", 106, 72], ["flowerBush", 150, 60], ["flowerBush", 114, 82], ["flowerBush", 142, 82],
];

export const VIRDIA_FIELD: Region = {
  map: "world/virdia.png",
  start: { tx: 7, ty: 56 },
  faction: "virdia",
  // 낙엽 땅 길 · 맑은 샘물 · 엘프 성(밑은 풀밭) · 깊은 숲에 빛나는 버드나무
  skin: { path: "leafPath", water: "spring", floor: "grass", keep_art: "elf_castle", tree_pine2: "willow" },
  places: [
    // 세계수 광장 · 성채 · 약초 가게 · 정령의 샘
    { id: "virdiaTown", kind: "town", tx: 118, ty: 58, name: "wpVirdiaCity" },
    { id: "worldTree", kind: "sign", tx: 128, ty: 52, name: "wpWorldTree" },
    { id: "virdiaKeepDoor", kind: "door", tx: 128, ty: 34, name: "wpVirdiaKeep", to: "virdiaKeep" },
    { id: "herbDoor", kind: "door", tx: HD[0], ty: HD[1], name: "wpHerbShop", to: "virdiaHerb", icon: "potion" },
    { id: "spiritSpring", kind: "sign", tx: 115, ty: 78, name: "wpSpiritSpring" },
    // 성 안 뜰: 랜턴 기둥 · 빛나는 버섯 · 수풀 · 꽃 덤불 (그림 장식)
    ...VIRDIA_PROPS.map(([art, tx, ty], i): Place => ({ id: `prop${i}`, kind: "deco", tx, ty, name: "wpVirdiaCity", art })),
    { id: "virdiaIdra", kind: "npc", tx: 138, ty: 46, name: "idra", who: "idra", line: "wnIdra" },
    // 나무 집 (마을·성 안, 모두 같은 민가 안)
    ...VIRDIA_HOUSE_DOORS.map(([tx, ty]): Place => ({ id: `house${tx}_${ty}`, kind: "door", tx, ty, name: "wpHouse", to: "houseVirdia" })),
    { id: "villageSign", kind: "sign", tx: 60, ty: 60, name: "wpVillage" },
    { id: "virdiaByeonhui", kind: "npc", tx: 58, ty: 93, name: "byeonhui", who: "byeonhui", line: "wnByeonhui" },
    // 서문 · 테라코어 국경 통로
    { id: "virdiaBeast", kind: "npc", tx: 94, ty: 55, name: "beast", who: "beast", line: "wnBeast" },
    { id: "toTerra", kind: "pass", tx: 2, ty: 56, name: "wpToTerra", to: "terracore", land: [246, 56] },
    // 강 · 정령의 숲터
    { id: "riverSign", kind: "sign", tx: 126, ty: 100, name: "wpVirdiaRiver" },
    { id: "virdiaImugi", kind: "npc", tx: 130, ty: 121, name: "imugi", who: "imugi", line: "wnImugi" },
    { id: "spiritGrove", kind: "sign", tx: 128, ty: 138, name: "wpSpiritGrove" },
    { id: "virdiaSpiritist", kind: "npc", tx: 124, ty: 139, name: "spiritist", who: "spiritist", line: "wnSpiritist" },
    // 깊은 숲 던전 (혼자 하기) · 동쪽 해안
    { id: "deepForest", kind: "dungeon", tx: 210, ty: 16, name: "wpDeepForest" },
    { id: "virdiaRen", kind: "npc", tx: 207, ty: 19, name: "ren", who: "ren", line: "wnRen" },
    { id: "virdiaFly", kind: "npc", tx: 230, ty: 59, name: "fly", who: "fly", line: "wnFly" },
    // 동쪽 해안 나루 → 비연 (9장)
    { id: "toWindtown", kind: "pass", tx: 237, ty: 61, name: "wpFerryWindtown", to: "windtown", land: [6, 80] },
    // 순간 이동석
    { id: "warpVirdiaPlaza", kind: "warp", tx: 140, ty: 58, name: "wpWarpVirdiaPlaza" },
    { id: "warpVirdiaWest", kind: "warp", tx: 9, ty: 60, name: "wpWarpVirdiaWest" },
    { id: "warpVillage", kind: "warp", tx: 64, ty: 99, name: "wpWarpVillage" },
    { id: "warpGrove", kind: "warp", tx: 134, ty: 140, name: "wpWarpGrove" },
    { id: "warpDeepForest", kind: "warp", tx: 213, ty: 18, name: "wpWarpDeepForest" },
    { id: "warpCoast", kind: "warp", tx: 233, ty: 61, name: "wpWarpCoast" },
  ],
};

const deco = (id: string, tx: number, ty: number, art: Place["art"]): Place => ({ id, kind: "deco", tx, ty, name: "wpVirdiaKeep", art });

/** 성채 안 (아스칼론 성채와 같은 안 지도) · 장로 · 약초 가게 (원소술사 = 게임 상점 이벤트 효과 탭) */
export const VIRDIA_INSIDE: Record<string, Region> = {
  virdiaKeep: {
    map: "world/ascalon_keep.png",
    start: { tx: 9, ty: 10 },
    title: "wpVirdiaKeep",
    indoor: true,
    skin: { floor: "elfStone" },
    places: [
      { id: "keepExit", kind: "exit", tx: 9, ty: 11, name: "wpGoOut" },
      { id: "virdiaElder", kind: "npc", tx: 9, ty: 4, name: "elder", who: "elder", line: "wnElder" },
      deco("keepThrone", 9, 2, "throne"),
      ...[4, 14].flatMap((x) => [4, 8].map((y) => deco(`keepPlant${x}${y}`, x, y, "plant"))),
      deco("keepShelf", 2, 2, "shelf"),
      deco("keepShelf2", 16, 2, "shelf"),
    ],
  },
  virdiaHerb: shop("wpHerbShop", "elementalist", "wnElementalist", "shop:event", "potions", "plant"),
};
