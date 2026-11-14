// 헬리오스 필드 장소 (256×160칸, 지도 모양 scripts/art/world_helios.py — 지도를 고치면 좌표도 같이, 생성기가 걸을 수 있는 칸인지 검사)
// 제국 도시(대리석 광장 황제 석상 = 레이드 아레나 · 황금 분수·깃발 · 황금 궁전 · 시장·재봉소·술집 · 뒷골목 검은 제단 · 주거지) · 농장 · 버려진 수로 던전 · 항구 · 사막 길(테라코어) · 순간 이동석 여섯
import { shop } from "./ascalonInside";
import type { Place, Region } from "../worldPlaces";
import { HALL_SKIN } from "./skins";
import { HELIOS_HOUSE_DOORS, HELIOS_SHOP_DOORS as D } from "./heliosLayout";

const deco = (id: string, tx: number, ty: number, art: Place["art"], name: Place["name"] = "wpHeliosCity"): Place => ({ id, kind: "deco", tx, ty, name, art });

export const HELIOS_FIELD: Region = {
  map: "world/helios.png",
  start: { tx: 128, ty: 12 },
  faction: "helios",
  // 술집 = 창고 칸에 술집 겉모습 그림
  skin: { warehouse_t: "tavern_outside", wetStone: "redBrick" },
  mini: { 50: "#a85a3a" },
  places: [
    // 대리석 광장 · 황제 석상(레이드 아레나) · 분수 · 깃발
    { id: "heliosTown", kind: "town", tx: 120, ty: 56, name: "wpHeliosCity" },
    { id: "heliosStatue", kind: "dungeon", tx: 128, ty: 58, name: "wpStatue", gate: "arena" },
    deco("fountainW", 116, 74, "fountainGold"),
    deco("fountainE", 140, 74, "fountainGold"),
    ...[108, 148].flatMap((tx) => [54, 81].map((ty) => deco(`banner${tx}_${ty}`, tx, ty, "banner"))),
    { id: "heliosBrawler", kind: "npc", tx: 136, ty: 56, name: "brawler", who: "brawler", line: "wnBrawler" },
    // 황금 궁전 · 근위
    { id: "gateNorth", kind: "deco", tx: 128, ty: 22, name: "wpHeliosCity", art: "cityGate" },
    { id: "gateSouth", kind: "deco", tx: 128, ty: 112, name: "wpHeliosCity", art: "cityGate" },
    { id: "chapelDoor", kind: "door", tx: 112, ty: 106, name: "wpChapel", to: "heliosChapel" },
    { id: "palaceDoor", kind: "door", tx: 128, ty: 39, name: "wpPalace", to: "heliosPalace" },
    { id: "heliosSlayer", kind: "npc", tx: 122, ty: 42, name: "slayer", who: "slayer", line: "wnSlayer" },
    deco("palaceBannerL", 104, 44, "banner", "wpPalace"),
    deco("palaceBannerR", 152, 44, "banner", "wpPalace"),
    // 시장 거리 (가게 주인 = 게임 상점) · 술집
    { id: "marketDoor", kind: "door", tx: D.market[0], ty: D.market[1], name: "wpMarket", to: "heliosMarket", icon: "bag" },
    { id: "tavernDoor", kind: "door", tx: D.tavern[0], ty: D.tavern[1], name: "wpTavern", to: "heliosTavern", icon: "bed" },
    { id: "armorDoor", kind: "door", tx: D.armor[0], ty: D.armor[1], name: "wpTailor", to: "heliosTailor", icon: "shield" },
    // 뒷골목 검은 제단 (스며든 악)
    deco("altar", 174, 42, "altar", "wpAltar"),
    { id: "altarSign", kind: "sign", tx: 171, ty: 45, name: "wpAltar" },
    { id: "heliosApostle", kind: "npc", tx: 177, ty: 45, name: "apostle", who: "apostle", line: "wnApostle" },
    // 주거지 (모두 같은 민가 안)
    ...HELIOS_HOUSE_DOORS.map(([tx, ty]): Place => ({ id: `house${tx}_${ty}`, kind: "door", tx, ty, name: "wpHouse", to: "houseHelios" })),
    { id: "heliosMukin", kind: "npc", tx: 62, ty: 63, name: "mukin", who: "mukin", line: "wnMukin" },
    // 북문 · 사막 길
    { id: "heliosBedouin", kind: "npc", tx: 124, ty: 8, name: "bedouin", who: "bedouin", line: "wnBedouin" },
    { id: "toDesert", kind: "pass", tx: 128, ty: 3, name: "wpDesertRoad", to: "desert", land: [128, 153] },
    // 농장 · 버려진 수로 던전
    { id: "farmSign", kind: "sign", tx: 44, ty: 64, name: "wpHeliosFarm" },
    { id: "heliosOni", kind: "npc", tx: 24, ty: 65, name: "oni", who: "oni", line: "wnOni" },
    { id: "aqueduct", kind: "dungeon", tx: 32, ty: 124, name: "wpAqueduct" },
    { id: "heliosEater", kind: "npc", tx: 35, ty: 119, name: "eater", who: "eater", line: "wnEater" },
    // 항구 · 동쪽 길
    { id: "harborSign", kind: "sign", tx: 122, ty: 142, name: "wpHeliosHarbor" },
    { id: "heliosPlague", kind: "npc", tx: 112, ty: 144, name: "plague", who: "plague", line: "wnPlague" },
    { id: "kalderanSign", kind: "sign", tx: 246, ty: 63, name: "wpSignKalderan" },
    // 순간 이동석
    { id: "warpHeliosPlaza", kind: "warp", tx: 140, ty: 62, name: "wpWarpHeliosPlaza" },
    { id: "warpPalace", kind: "warp", tx: 116, ty: 44, name: "wpWarpPalace" },
    { id: "warpDesert", kind: "warp", tx: 132, ty: 12, name: "wpWarpDesert" },
    { id: "warpHeliosHarbor", kind: "warp", tx: 140, ty: 144, name: "wpWarpHeliosHarbor" },
    { id: "warpAqueduct", kind: "warp", tx: 36, ty: 116, name: "wpWarpAqueduct" },
    { id: "warpHeliosFarm", kind: "warp", tx: 48, ty: 70, name: "wpWarpHeliosFarm" },
  ],
};

const inner = (id: string, tx: number, ty: number, name: Place["name"], art: Place["art"]): Place => ({ id, kind: "deco", tx, ty, name, art });

/** 궁전 안 (아스칼론 성채와 같은 안 지도, 이클립스) · 시장(베두인 = 뽑기) · 재봉소(닌자 = 스킨) · 술집(여관 안 지도, 사멸) */
export const HELIOS_INSIDE: Record<string, Region> = {
  heliosPalace: {
    map: "world/ascalon_keep.png",
    start: { tx: 9, ty: 10 },
    title: "wpPalace",
    indoor: true,
    skin: { ...HALL_SKIN, floor: "marble" },
    places: [
      { id: "keepExit", kind: "exit", tx: 9, ty: 11, name: "wpGoOut" },
      { id: "heliosEclipse", kind: "npc", tx: 9, ty: 4, name: "eclipse", who: "eclipse", line: "wnEclipse" },
      inner("throne", 9, 2, "wpPalace", "throne"),
      ...[4, 14].flatMap((x) => [4, 8].map((y) => inner(`pillar${x}${y}`, x, y, "wpPalace", "pillar"))),
      inner("bannerL", 2, 3, "wpPalace", "banner"),
      inner("bannerR", 16, 3, "wpPalace", "banner"),
    ],
  },
  heliosMarket: { ...shop("wpMarket", "bedouin", "wnBedouinShop", "shop:gacha", "rack", "barrel"), skin: { woodFloor: "marble" } },
  heliosTailor: { ...shop("wpTailor", "ninja", "wnNinja", "shop:skins", "armor", "armor"), skin: { woodFloor: "marble" } },
  heliosTavern: {
    map: "world/ascalon_inn.png",
    start: { tx: 8, ty: 8 },
    title: "wpTavern",
    indoor: true,
    // 새벽의 성흔 술집 그림: 술집 나무 바닥 · 둥근 탁자 · 바 카운터 · 돌 벽난로
    skin: { woodFloor: "tavernWood", dining_table: "round_table", shop_counter: "bar_counter", fireplace: "fireplace_stone" },
    places: [
      { id: "exit", kind: "exit", tx: 8, ty: 9, name: "wpGoOut" },
      { id: "tavernKeeper", kind: "npc", tx: 8, ty: 3, name: "samyeol", who: "samyeol", line: "wnSamyeol" },
      inner("counterL", 6, 3, "wpTavern", "counter"),
      inner("counterR", 10, 3, "wpTavern", "counter"),
      inner("fire", 3, 2, "wpTavern", "fireplace"),
      inner("shelf", 13, 2, "wpTavern", "shelf"),
      inner("table1", 3, 6, "wpTavern", "table"),
      inner("table2", 4, 8, "wpTavern", "table"),
      inner("table3", 13, 6, "wpTavern", "table"),
      inner("barrel1", 14, 9, "wpTavern", "barrel"),
      inner("barrel2", 1, 9, "wpTavern", "barrel"),
      // 구석 지하 계단 → 새벽의 성흔 아지트 (7장)
      inner("cellarStairs", 15, 7, "wpDawnStairs", "stairsDown"),
      { id: "dawnStairs", kind: "door", tx: 15, ty: 7, name: "wpDawnStairs", to: "dawnHideout", open: "dawn" },
    ],
  },
};
