// 아스칼론 건물 안 (지도 모양 scripts/art/world_map.py): 성채 · 가게 넷(같은 안 지도, 진열대·주인만 다름, 주인 = 게임 상점 탭: 무기점 뽑기·방어구점 스킨·물약점 이벤트 효과·잡화점 로비 꾸밈) · 대장간(대장장이 = 레이드 장신구) · 여관 · 민가는 places/interiors
import type { CharacterId } from "@pixel-rogue/shared";
import type { TextKey } from "../../i18n";
import type { DecoArt } from "../worldDeco";
import type { Place, Region, WorldMenu } from "../worldPlaces";
import { HALL_SKIN } from "./skins";

const deco = (id: string, tx: number, ty: number, name: TextKey, art: DecoArt): Place => ({ id, kind: "deco", tx, ty, name, art });
const out = (tx: number, ty: number): Place => ({ id: "exit", kind: "exit", tx, ty, name: "wpGoOut" });

/** 가게 안 13×9: 주인(6,3) 양옆 계산대 · 뒤 벽 진열 · 나가는 문 (6,7) */
export function shop(title: TextKey, who: CharacterId, line: TextKey, menu: WorldMenu, wall: DecoArt, side: DecoArt): Region {
  return {
    map: "world/ascalon_shop.png",
    start: { tx: 6, ty: 6 },
    title,
    indoor: true,
    places: [
      out(6, 7),
      { id: "keeper", kind: "npc", tx: 6, ty: 3, name: who, who, line, menu },
      deco("counterL", 4, 3, title, "counter"),
      deco("counterR", 8, 3, title, "counter"),
      ...[2, 10].map((x) => deco(`wall${x}`, x, 2, title, wall)),
      deco("side1", 1, 6, title, side),
      deco("side2", 11, 6, title, side),
    ],
  };
}

export const ASCALON_INSIDE: Record<string, Region> = {
  // 성채 안: 문(9,11)에서 카펫 따라 왕좌 · 장군 = 지금 연 장 이야기
  ascalonKeep: {
    map: "world/ascalon_keep.png",
    start: { tx: 9, ty: 10 },
    title: "wpAscalonKeep",
    indoor: true,
    skin: HALL_SKIN,
    places: [
      { id: "keepExit", kind: "exit", tx: 9, ty: 11, name: "wpGoOut" },
      { id: "ascalonGeneral", kind: "npc", tx: 9, ty: 4, name: "general", who: "general", scene: true },
      deco("keepThrone", 9, 2, "wpAscalonKeep", "throne"),
      ...[4, 14].flatMap((x) => [4, 8].map((y) => deco(`keepPillar${x}${y}`, x, y, "wpAscalonKeep", "pillar"))),
      deco("keepArmorL", 2, 2, "wpAscalonKeep", "armor"),
      deco("keepArmorR", 16, 2, "wpAscalonKeep", "armor"),
      deco("keepBarrel", 16, 10, "wpAscalonKeep", "barrel"),
      deco("keepTable", 2, 10, "wpAscalonKeep", "longTable"),
    ],
  },
  ascalonWeapon: shop("wpWeaponShop", "leo", "wnLeo", "shop:gacha", "rack", "barrel"),
  ascalonArmor: shop("wpArmorShop", "remnant", "wnRemnant", "shop:skins", "armor", "armor"),
  ascalonPotion: shop("wpPotionShop", "silk", "wnSilk", "shop:event", "potions", "plant"),
  ascalonGoods: shop("wpGoodsShop", "pungryu", "wnPungryu", "shop:lobby", "shelf", "barrel"),
  // 대장간 13×9: 화덕·모루·무기 걸이 · 대장장이
  ascalonSmithy: {
    map: "world/ascalon_smithy.png",
    start: { tx: 6, ty: 6 },
    title: "wpSmithy",
    indoor: true,
    places: [
      out(6, 7),
      { id: "smith", kind: "npc", tx: 7, ty: 3, name: "forgotten", who: "forgotten", line: "wnForgotten", menu: "smith" },
      deco("forge", 3, 2, "wpSmithy", "forge"),
      deco("anvil", 5, 4, "wpSmithy", "anvil"),
      deco("rack1", 9, 2, "wpSmithy", "rack"),
      deco("rack2", 11, 2, "wpSmithy", "rack"),
      deco("barrel", 11, 6, "wpSmithy", "barrel"),
    ],
  },
  // 여관 17×11: 주인 떠돌이(8,3) 양옆 계산대 · 벽난로 · 탁자 · 침대 · 나가는 문 (8,9)
  ascalonInn: {
    map: "world/ascalon_inn.png",
    start: { tx: 8, ty: 8 },
    title: "wpInn",
    indoor: true,
    places: [
      out(8, 9),
      { id: "innkeeper", kind: "npc", tx: 8, ty: 3, name: "drifter", who: "drifter", line: "wnDrifter" },
      deco("innCounterL", 6, 3, "wpInn", "counter"),
      deco("innCounterR", 10, 3, "wpInn", "counter"),
      deco("innFire", 3, 2, "wpInn", "fireplace"),
      deco("innShelf", 13, 2, "wpInn", "shelf"),
      deco("innTable1", 3, 6, "wpInn", "table"),
      deco("innTable2", 4, 8, "wpInn", "table"),
      deco("innBed1", 14, 5, "wpInn", "bed"),
      deco("innBed2", 14, 8, "wpInn", "bed"),
      deco("innBarrel", 1, 9, "wpInn", "barrel"),
      deco("innPlant", 11, 9, "wpInn", "plant"),
    ],
  },
};
