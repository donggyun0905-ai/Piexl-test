// 새벽의 성흔 아지트 (헬리오스 술집 지하, 7장 · 안 지도 scripts/art/world_rooms.dawn_hideout 36×22)
// 술집 구석 지하 계단으로 내려옴 · 왼쪽 위 무기고 · 가운데 작전실(지도 탁자) · 오른쪽 위 훈련장(허수아비) · 아래 감옥·쉼터·사격장 · 악마 사냥꾼 아홉
import type { Place, Region } from "../worldPlaces";
import { HALL_SKIN } from "./skins";

const deco = (id: string, tx: number, ty: number, art: Place["art"]): Place => ({ id, kind: "deco", tx, ty, name: "wpDawnHideout", art });
const npc = (who: NonNullable<Place["who"]>, tx: number, ty: number, line: Place["line"]): Place => ({ id: `dawn_${who}`, kind: "npc", tx, ty, name: who, who, line });

export const DAWN_INSIDE: Record<string, Region> = {
  dawnHideout: {
    map: "world/dawn_hideout.png",
    start: { tx: 18, ty: 4 },
    title: "wpDawnHideout",
    indoor: true,
    skin: { ...HALL_SKIN, floor: "cellarStone" },
    mood: "cellar",
    places: [
      { id: "stairsUp", kind: "exit", tx: 18, ty: 2, name: "wpGoOut" },
      deco("stairsArt", 18, 2, "stairsUp"),
      // 무기고
      ...[3, 6, 9].map((x) => deco(`rack${x}`, x, 2, "rack")),
      deco("armCrates", 2, 11, "crates"),
      deco("armBarrel", 10, 11, "barrel"),
      npc("blast", 5, 7, "wnDawnBlast"),
      npc("nailer", 9, 9, "wnDawnNailer"),
      // 작전실
      deco("mapTable", 18, 10, "mapTable"),
      deco("warFire", 14, 2, "fireplace"),
      npc("crusader", 21, 8, "wnDawnCrusader"),
      npc("lunatic", 14, 9, "wnDawnLunatic"),
      // 훈련장
      ...[[26, 4], [29, 4], [32, 4], [26, 10], [32, 10]].map(([x, y]) => deco(`dummy${x}_${y}`, x!, y!, "dummy")),
      npc("hellfist", 29, 8, "wnDawnHellfist"),
      npc("scissors", 33, 7, "wnDawnScissors"),
      // 감옥 · 쉼터 · 사격장
      deco("cell1", 3, 15, "cell"),
      deco("cell2", 9, 15, "cell"),
      npc("incision", 6, 19, "wnDawnIncision"),
      deco("restTable", 16, 18, "table"),
      deco("restBarrels", 21, 19, "barrel"),
      npc("silverBullet", 19, 17, "wnDawnSilverBullet"),
      ...[26, 30, 33].map((x) => deco(`target${x}`, x, 14, "dummy")),
      npc("blueFlame", 29, 19, "wnDawnBlueFlame"),
    ],
  },
};
