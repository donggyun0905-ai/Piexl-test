// 실베르 필드 장소 (256×160칸, 지도 모양 scripts/art/world_silber.py — 지도를 고치면 좌표도 같이, 생성기가 걸을 수 있는 칸인지 검사)
// 수호성(성채·무기고·민가·막사·화로) · 북쪽 싸움터와 악마의 문(경비원 → 타워 디펜스) · 얼어붙은 호수 · 동쪽 망루 초소 · 얼음 동굴 던전 · 아스칼론 산길 · 순간 이동석 여섯 · 장식은 생성기가 자리를 정함
import type { Place, Region } from "../worldPlaces";
import { HALL_SKIN } from "./skins";
import { SILBER_ARMORY_DOOR as AD, SILBER_DECO_SPOTS, SILBER_HOUSE_DOORS } from "./silberLayout";

export const SILBER_FIELD: Region = {
  map: "world/silber.png",
  start: { tx: 128, ty: 152 },
  faction: "silber",
  places: [
    // 수호성 광장 · 성채 · 무기고 · 민가
    { id: "silberTown", kind: "town", tx: 120, ty: 90, name: "wpSilberFort" },
    { id: "silberKeepDoor", kind: "door", tx: 128, ty: 67, name: "wpSilberKeep", to: "silberKeep" },
    { id: "armoryDoor", kind: "door", tx: AD[0], ty: AD[1], name: "wpArmory", to: "silberArmory", icon: "hammer" },
    ...SILBER_HOUSE_DOORS.map(([tx, ty]): Place => ({ id: `house${tx}_${ty}`, kind: "door", tx, ty, name: "wpHouse", to: "ascalonHouse" })),
    { id: "silberJoker", kind: "npc", tx: 136, ty: 88, name: "joker", who: "joker", line: "wnJoker" },
    { id: "silberRabbit", kind: "npc", tx: 158, ty: 79, name: "rabbit", who: "rabbit", line: "wnRabbit" },
    // 북문 · 싸움터 · 악마의 문 (경비원 = 타워 디펜스)
    { id: "silberRaven", kind: "npc", tx: 122, ty: 52, name: "chessRaven", who: "chessRaven", line: "wnChessRaven" },
    { id: "battleSign", kind: "sign", tx: 134, ty: 40, name: "wpBattlefield" },
    // 악마의 문 너머 → 지옥 (9장)
    { id: "toHell", kind: "pass", tx: 128, ty: 15, name: "wpToHell", to: "hell", land: [128, 6] },
    { id: "gateGuard", kind: "npc", tx: 128, ty: 21, name: "asura", who: "asura", line: "wnAsura", gate: "td" },
    // 얼어붙은 호수 · 동쪽 망루 초소 · 얼음 동굴
    { id: "lakeSign", kind: "sign", tx: 64, ty: 82, name: "wpFrozenLake" },
    { id: "silberBingseol", kind: "npc", tx: 58, ty: 76, name: "bingseol", who: "bingseol", line: "wnBingseol" },
    { id: "silberBaekryeong", kind: "npc", tx: 214, ty: 93, name: "baekryeong", who: "baekryeong", line: "wnBaekryeong" },
    { id: "frostCave", kind: "dungeon", tx: 208, ty: 24, name: "wpFrostCave" },
    // 남쪽 입구 · 아스칼론 산길
    { id: "silberHonryeong", kind: "npc", tx: 122, ty: 148, name: "honryeong", who: "honryeong", line: "wnHonryeong" },
    { id: "toAscalon", kind: "pass", tx: 128, ty: 157, name: "wpToAscalon", to: "ascalon", land: [150, 7] },
    // 장식 (악마의 문·화로·막사·망루·바리케이드·투석기·마물 뼈·창 무더기·얼음 결정)
    ...SILBER_DECO_SPOTS.map(([art, tx, ty], i): Place => ({ id: `d${i}`, kind: "deco", tx, ty, name: art === "demonGate" ? "wpDemonGate" : "wpBattlefield", art })),
    // 순간 이동석
    { id: "warpSilberSouth", kind: "warp", tx: 134, ty: 150, name: "wpWarpSilberSouth" },
    { id: "warpSilberFort", kind: "warp", tx: 140, ty: 90, name: "wpWarpSilberFort" },
    { id: "warpBattlefield", kind: "warp", tx: 136, ty: 25, name: "wpWarpBattlefield" },
    { id: "warpLake", kind: "warp", tx: 66, ty: 78, name: "wpWarpLake" },
    { id: "warpOutpost", kind: "warp", tx: 210, ty: 96, name: "wpWarpOutpost" },
    { id: "warpFrostCave", kind: "warp", tx: 204, ty: 28, name: "wpWarpFrostCave" },
  ],
};

const inner = (id: string, tx: number, ty: number, name: Place["name"], art: Place["art"]): Place => ({ id, kind: "deco", tx, ty, name, art });

/** 성채 안 (아스칼론 성채와 같은 안 지도, 백인장) · 무기고 (가게 안 지도, 기어스 = 레이드 장신구 대장간) */
export const SILBER_INSIDE: Record<string, Region> = {
  silberKeep: {
    map: "world/ascalon_keep.png",
    start: { tx: 9, ty: 10 },
    title: "wpSilberKeep",
    indoor: true,
    skin: HALL_SKIN,
    places: [
      { id: "keepExit", kind: "exit", tx: 9, ty: 11, name: "wpGoOut" },
      { id: "silberCommander", kind: "npc", tx: 9, ty: 4, name: "baekinjang", who: "baekinjang", line: "wnBaekinjang" },
      inner("throne", 9, 2, "wpSilberKeep", "throne"),
      ...[4, 14].flatMap((x) => [4, 8].map((y) => inner(`pillar${x}${y}`, x, y, "wpSilberKeep", "pillar"))),
      inner("armorL", 2, 2, "wpSilberKeep", "armor"),
      inner("armorR", 16, 2, "wpSilberKeep", "armor"),
      inner("brazierL", 2, 9, "wpSilberKeep", "brazier"),
      inner("brazierR", 16, 9, "wpSilberKeep", "brazier"),
    ],
  },
  silberArmory: {
    map: "world/ascalon_shop.png",
    start: { tx: 6, ty: 6 },
    title: "wpArmory",
    indoor: true,
    skin: { ...HALL_SKIN, woodFloor: "stoneFloor" },
    places: [
      { id: "exit", kind: "exit", tx: 6, ty: 7, name: "wpGoOut" },
      { id: "armorer", kind: "npc", tx: 6, ty: 3, name: "gears", who: "gears", line: "wnGears", menu: "smith" },
      inner("forge", 2, 2, "wpArmory", "forge"),
      inner("anvil", 4, 4, "wpArmory", "anvil"),
      inner("rack", 10, 2, "wpArmory", "rack"),
      inner("spears", 10, 6, "wpArmory", "spears"),
    ],
  },
};
