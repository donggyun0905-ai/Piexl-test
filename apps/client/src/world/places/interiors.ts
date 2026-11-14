// 건물 안 공용 틀: 집 · 가게(ascalonInside.shop) · 성(성채 안) · 교회 — 바닥·벽·가구 그림은 모든 나라가 같이 쓰고, 나라 특색은 가구 조합·바닥 그림(skin)으로
// 집 안 12×9 (world_map.ascalon_house): 문(5,7)으로 나감 · 가구 자리 여덟 (문 앞 길은 비움) · 교회 안 17×14 (world_rooms.church) · 나가는 문 그림은 worldPlaceArt(안쪽 문)
import type { TextKey } from "../../i18n";
import type { DecoArt } from "../worldDeco";
import type { Mood } from "../worldMood";
import type { Place, Region } from "../worldPlaces";
import { HALL_SKIN } from "./skins";

/** 집 안 가구 자리: 침대 · 벽난로 자리 · 책장 자리 · 탁자 · 오른쪽 아래 · 왼쪽 아래 · 왼쪽 가운데 · 오른쪽 가운데 */
const SLOTS: readonly (readonly [number, number])[] = [[2, 3], [6, 2], [9, 2], [8, 5], [10, 7], [1, 7], [2, 6], [10, 4]];

interface HouseStyle {
  title?: TextKey;
  skin?: Readonly<Record<string, string>>;
  mood?: Mood;
  /** SLOTS 차례대로 (null = 비움) */
  furniture: readonly (DecoArt | null)[];
}

/** 나라마다 집 안 (가구 조합 · 바닥·벽 그림) */
const HOUSE_STYLES: Record<string, HouseStyle> = {
  ascalonHouse: { furniture: ["bed", "fireplace", "shelf", "table", "plant", "barrel"] },
  houseTerra: { skin: { woodFloor: "metalFloorIn", barrels: "crates" }, furniture: ["bed", "pipes", "shelf", "table", "lamp", "barrel", "crateStack"] },
  houseVirdia: { furniture: ["bed", "fireplace", "shelf", "table", "fern", "mushroom", "flowerBush", "plant"] },
  houseHelios: { skin: { woodFloor: "marble" }, furniture: ["bed", "fireplace", "shelf", "table", "plant", "barrel", "armor"] },
  houseSilber: { skin: { ...HALL_SKIN, woodFloor: "stoneFloor", fireplace: "fireplace_stone" }, furniture: ["bed", "fireplace", "rack", "table", "brazier", "barrel"] },
  houseThal: { skin: { woodFloor: "dockPlank", barrels: "crates" }, furniture: ["bed", "fireplace", "shelf", "table", "anchor", "barrel", "net"] },
  houseThalWare: { title: "wpWarehouse", skin: { woodFloor: "dockPlank", barrels: "crates" }, furniture: ["crateStack", "cargo", "barrel", "cargo", "barrel", "crateStack", "net", "crates"] },
  houseSea: { skin: { woodFloor: "pearlRoad", carpet: "coral" }, mood: "bubbles", furniture: ["bed", "clam", "coral", "table", "kelp", "chest"] },
  houseBiyeon: { furniture: ["bed", "jars", "shelf", "table", "plant", "jars", "pinwheel"] },
  houseHoly: { title: "wpMonastery", skin: { ...HALL_SKIN, woodFloor: "holyStone" }, mood: "holy", furniture: ["bed", "candles", "shelf", "pew", "angel", "plant"] },
};

function house(id: string, s: HouseStyle): Region {
  const title = s.title ?? "wpHouse";
  return {
    map: "world/ascalon_house.png",
    start: { tx: 5, ty: 6 },
    title,
    indoor: true,
    skin: s.skin,
    mood: s.mood,
    places: [
      { id: "houseExit", kind: "exit", tx: 5, ty: 7, name: "wpGoOut" },
      ...s.furniture.flatMap((art, i): Place[] => (art ? [{ id: `${id}${i}`, kind: "deco", tx: SLOTS[i]![0], ty: SLOTS[i]![1], name: title, art }] : [])),
    ],
  };
}

export const HOUSES_INSIDE: Record<string, Region> = Object.fromEntries(Object.entries(HOUSE_STYLES).map(([id, s]) => [id, house(id, s)]));

/** 교회 안 17×14: 문(8,12)에서 가운데 통로(카펫) 따라 제단 · 양옆 긴 의자 · 촛대 · 오르간 · 성직자 한 명 */
export function church(title: TextKey, who: NonNullable<Place["who"]>, line: TextKey, skin?: Readonly<Record<string, string>>): Region {
  const deco = (id: string, tx: number, ty: number, art: DecoArt): Place => ({ id, kind: "deco", tx, ty, name: title, art });
  return {
    map: "world/church.png",
    start: { tx: 8, ty: 11 },
    title,
    indoor: true,
    skin: { ...HALL_SKIN, ...skin },
    mood: "holy",
    places: [
      { id: "churchExit", kind: "exit", tx: 8, ty: 12, name: "wpGoOut" },
      { id: "priest", kind: "npc", tx: 8, ty: 4, name: who, who, line },
      deco("altar", 8, 2, "churchAltar"),
      deco("organ", 14, 2, "organ"),
      deco("candleL", 5, 2, "candleTall"),
      deco("candleR", 11, 2, "candleTall"),
      deco("angelL", 2, 3, "angel"),
      ...[3, 5, 11, 13].flatMap((x) => [6, 8, 10].map((y) => deco(`pew${x}_${y}`, x, y, "pew"))),
    ],
  };
}

/** 교회 둘 (아스칼론 상점가 동쪽 · 헬리오스 남쪽 큰길 옆, 들판 칸 chapel) */
export const CHAPELS_INSIDE: Record<string, Region> = {
  ascalonChapel: church("wpChapel", "lux", "wnChapelLux"),
  heliosChapel: church("wpChapel", "pilgrim", "wnChapelPilgrim", { floor: "marble" }),
};
