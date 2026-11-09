// 적·보스 이름과 한 줄 설명 (한·영·일). 도감·한 판 요약·관리자·도트 편집이 같이 씀. 보스 이름은 game 글자의 boss* 키
import type { Lang } from "./index";
import { TEXT } from "./text";
import { DESC } from "./enemyDesc";

type Names = Record<Lang, string>;
const n = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

/** 보스 이름 (게임 글자 키) */
export const BOSS_TEXT: Record<string, string> = {
  hulk: "bossHulk", brood: "bossBrood", seer: "bossSeer", knight: "bossKnight", archer: "bossArcher", siren: "bossSiren", centaur: "bossCentaur",
  plant: "bossPlant", reaper: "bossReaper", swordgod: "bossSwordGod", archangel: "bossAngel", dragon: "bossDragon", godeater: "bossGodEater", plight: "bossLight", pdark: "bossDark",
  umbra: "bossUmbra", sandworm: "bossSandworm", scorpion: "bossScorpion", roc: "bossRoc", demigod: "bossDemigod", sage: "bossSage",
  toad: "bossToad", salamander: "bossSalamander", jelly: "bossJelly", captain: "bossCaptain",
  gatekeeper: "bossGatekeeper", twinlu: "bossTwinLu", twinre: "bossTwinRe", mooneater: "bossMoonEater",
  cerberus: "bossCerberus", cerbfist: "bossCerbFist", cerbflame: "bossCerbFlame", cerbblade: "bossCerbBlade",
  leviathan: "bossLeviathan", levwhale: "bossLevWhale", levking: "bossLevKing",
};

/** 보스가 아닌 적 이름 */
const NAMES: Record<string, Names> = {
  dummy: n("허수아비", "Scarecrow", "かかし"),
  fighter: n("패왕전 도전자", "Champion Rival", "覇王戦の挑戦者"),
  crawler: n("기어 오는 벌레", "Crawler", "這い寄る虫"),
  spitter: n("침 뱉는 벌레", "Spitter", "唾吐き虫"),
  mortar: n("포격 버섯", "Mortar Shroom", "砲撃キノコ"),
  charger: n("돌진 멧돼지", "Charger", "突進イノシシ"),
  gnat: n("날벌레", "Gnat", "羽虫"),
  guardian: n("방패 가디언", "Shield Guardian", "盾のガーディアン"),
  paladin: n("성기사", "Paladin", "聖騎士"),
  tower: n("천사장의 탑", "Archangel's Tower", "大天使の塔"),
  fort: n("숨은 시련 구조물", "Trial Structure", "隠れた試練の構造物"),
  soul: n("풀려난 영혼", "Freed Soul", "解き放たれた魂"),
  ghost: n("어둠의 유령", "Shadow Ghost", "闇の亡霊"),
  slime: n("슬라임", "Slime", "スライム"),
  runner: n("도마뱀", "Lizard", "トカゲ"),
  bat: n("박쥐", "Bat", "コウモリ"),
  beetle: n("딱정벌레", "Beetle", "カブトムシ"),
  golem: n("바위 골렘", "Rock Golem", "岩ゴーレム"),
  shaman: n("주술사", "Shaman", "呪術師"),
  eggsac: n("알주머니", "Egg Sac", "卵嚢"),
  wisp: n("도깨비불", "Wisp", "鬼火"),
  doppel: n("도플갱어", "Doppelganger", "ドッペルゲンガー"),
  venom: n("베놈", "Venom", "ヴェノム"),
  landfish: n("땅 물고기", "Land Fish", "土ザカナ"),
  lurker: n("그림자", "Shadow", "影"),
  bombbug: n("폭발풍뎅이", "Blast Beetle", "爆発コガネ"),
  skelarcher: n("스켈레톤 궁병", "Skeleton Archer", "スケルトン弓兵"),
  chainward: n("쇠사슬 간수", "Chain Warden", "鎖の看守"),
  highorc: n("하이오크", "High Orc", "ハイオーク"),
  hellgate: n("지옥문", "Hell Gate", "地獄門"),
  imp: n("임프", "Imp", "インプ"),
  moonshard: n("달 조각", "Moon Shard", "月の欠片"),
  incubus: n("인큐버스", "Incubus", "インキュバス"),
  ruinblade: n("파괴의 검", "Blade of Ruin", "破壊の剣"),
  chaosblade: n("혼돈의 검", "Blade of Chaos", "混沌の剣"),
};


export function enemyName(kind: string, lang: Lang): string {
  const key = BOSS_TEXT[kind];
  if (key) return (TEXT as Record<string, Names>)[key]?.[lang] ?? kind;
  return NAMES[kind]?.[lang] ?? kind;
}

export const enemyDesc = (kind: string, lang: Lang): string => DESC[kind]?.[lang] ?? "";
