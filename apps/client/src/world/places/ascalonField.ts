// 아스칼론 필드 장소 (256×160칸, 지도 모양 scripts/art/world_ascalon.py — 지도를 고치면 좌표도 같이, 생성기가 걸을 수 있는 칸인지 검사)
// 성벽 도시(광장·성채·상점가·장인 거리·주거지·훈련장) · 강가 · 항구 · 농촌 · 던전 둘(혼자 하기) · 기억의 탑(무한·영웅) · 순간 이동석 여섯 · 국경 표지판
import type { Place, Region } from "../worldPlaces";
import { ASCALON_HOUSE_DOORS, ASCALON_SHOP_DOORS as S } from "./ascalonLayout";

const shop = (id: string, at: readonly [number, number], name: Place["name"], to: string, icon: Place["icon"]): Place => ({ id, kind: "door", tx: at[0], ty: at[1], name, to, icon });

export const ASCALON_FIELD: Region = {
  map: "world/ascalon.png",
  start: { tx: 100, ty: 67 },
  faction: "ascalon",
  places: [
    // 광장 · 성채
    { id: "ascalonCastle", kind: "town", tx: 94, ty: 61, name: "wpAscalonCastle" },
    { id: "ascalonKeepDoor", kind: "door", tx: 100, ty: 27, name: "wpAscalonKeep", to: "ascalonKeep" },
    { id: "ascalonMage", kind: "npc", tx: 110, ty: 50, name: "mage", who: "mage", line: "wnMage" },
    // 상점가 · 장인 거리
    shop("shopWeapon", S.weapon, "wpWeaponShop", "ascalonWeapon", "sword"),
    shop("shopArmor", S.armor, "wpArmorShop", "ascalonArmor", "shield"),
    shop("shopPotion", S.potion, "wpPotionShop", "ascalonPotion", "potion"),
    shop("shopGoods", S.goods, "wpGoodsShop", "ascalonGoods", "bag"),
    shop("shopSmithy", S.smithy, "wpSmithy", "ascalonSmithy", "hammer"),
    shop("shopInn", S.inn, "wpInn", "ascalonInn", "bed"),
    // 주거지 · 농촌 민가 (모두 같은 민가 안)
    ...ASCALON_HOUSE_DOORS.map(([tx, ty]): Place => ({ id: `house${tx}_${ty}`, kind: "door", tx, ty, name: "wpHouse", to: "ascalonHouse" })),
    // 훈련장 (허수아비·무기 걸이)
    { id: "trainingSign", kind: "sign", tx: 60, ty: 42, name: "wpTraining" },
    { id: "ascalonTracker", kind: "npc", tx: 63, ty: 33, name: "tracker", who: "tracker", line: "wnTracker" },
    ...[56, 60, 66, 70].map((tx): Place => ({ id: `dummy${tx}`, kind: "deco", tx, ty: 26, name: "wpTraining", art: "dummy" })),
    { id: "trainingRack", kind: "deco", tx: 72, ty: 24, name: "wpTraining", art: "rack" },
    // 남문 · 강가 · 항구
    { id: "citySign", kind: "sign", tx: 104, ty: 90, name: "wpSignCity" },
    { id: "riverSign", kind: "sign", tx: 80, ty: 92, name: "wpRiverside" },
    { id: "harborSign", kind: "sign", tx: 19, ty: 86, name: "wpSignHarbor" },
    { id: "ascalonWanderer", kind: "npc", tx: 4, ty: 87, name: "wanderer", who: "wanderer", line: "wnWanderer" },
    { id: "harborBarrel1", kind: "deco", tx: 14, ty: 88, name: "wpSignHarbor", art: "barrel" },
    { id: "harborBarrel2", kind: "deco", tx: 15, ty: 89, name: "wpSignHarbor", art: "barrel" },
    // 농촌 · 사막 쪽
    { id: "ascalonNovice", kind: "npc", tx: 96, ty: 119, name: "novice", who: "novice", line: "wnNovice" },
    { id: "desertSign", kind: "sign", tx: 103, ty: 150, name: "wpSignDesert" },
    { id: "toDesert", kind: "pass", tx: 103, ty: 155, name: "wpDesertRoad", to: "desert", land: [100, 6] },
    // 던전 · 동쪽 갈림길 · 국경
    { id: "ascalonDungeon", kind: "dungeon", tx: 176, ty: 14, name: "wpDungeon" },
    { id: "forestDungeon", kind: "dungeon", tx: 24, ty: 30, name: "wpForestDungeon" },
    { id: "ascalonSign", kind: "sign", tx: 217, ty: 52, name: "wpSignAscalon" },
    { id: "terraSign", kind: "sign", tx: 246, ty: 53, name: "wpSignTerra" },
    { id: "toSilber", kind: "pass", tx: 150, ty: 3, name: "wpToSilber", to: "silber", land: [128, 152] },
    { id: "toTerra", kind: "pass", tx: 248, ty: 56, name: "wpToTerra", to: "terracore", land: [7, 56] },
    // 기억의 탑 (무한 모드·영웅의 길 고르기)
    { id: "memoryTower", kind: "dungeon", tx: 232, ty: 49, name: "wpTower", gate: "tower" },
    // 순간 이동석 (한 번 만지면 다른 이동석에서 골라 갈 수 있음)
    { id: "warpPlaza", kind: "warp", tx: 106, ty: 61, name: "wpWarpPlaza" },
    { id: "warpFarm", kind: "warp", tx: 104, ty: 119, name: "wpWarpFarm" },
    { id: "warpDungeon", kind: "warp", tx: 180, ty: 19, name: "wpWarpDungeon" },
    { id: "warpHarbor", kind: "warp", tx: 16, ty: 88, name: "wpWarpHarbor" },
    { id: "warpEast", kind: "warp", tx: 214, ty: 60, name: "wpWarpEast" },
    { id: "warpTower", kind: "warp", tx: 236, ty: 52, name: "wpWarpTower" },
  ],
};
