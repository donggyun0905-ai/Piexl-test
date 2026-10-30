// 빛의 사도(한정) 글자 (한·영·일): 빛의 검 이름·설명 · 전용 아이템 10 + 빛의 조각 이름·효과 (수치는 weaponsLux·LUX_PERKS와 맞춤)
import type { Lang } from "../index";
import type { Names } from "./names";

const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const LX_WEAPON_NAMES = {
  luxBlade: c("빛의 검", "Blade of Light", "光の剣"),
};

/** 빛의 검 설명 (무기 설명 줄) */
const RADIANT_DESC: Names = c(
  "빠른 평타: 사거리 안 가장 가까운 적 자리에 작은 '+' 빛이 생겨 벰 · 세 번째 공격마다 더 넓은 곳의 적들 자리에 '+' 모양 빛의 검이 여러 번 생겨 벰",
  "Fast strikes: a small '+' of light forms on the nearest foe in range · every third attack, '+'-shaped light swords form again and again on foes in a wider area",
  "速い通常攻撃: 射程内で一番近い敵の位置に小さな「+」の光が生まれて斬る · 3回目の攻撃ごとにより広い範囲の敵の位置に「+」形の光の剣が何度も生まれて斬る",
);
export const radiantDesc = (lang: Lang) => RADIANT_DESC[lang];

export const LX_PASSIVE_NAMES = {
  lxShard: c("빛의 조각", "Shard of Light", "光のかけら"),
  lxHalo: c("빛의 고리", "Halo of Light", "光の輪"),
  lxSwift: c("신속의 깃", "Feather of Haste", "迅速の羽"),
  lxReach: c("먼 빛", "Distant Light", "遠い光"),
  lxGrace: c("은총의 옷자락", "Hem of Grace", "恩寵の裾"),
  lxMore: c("겹친 검날", "Layered Blades", "重なる刃"),
  lxQuick: c("빠른 단죄", "Swift Judgment", "速やかな断罪"),
  lxWide: c("넓은 십자", "Wide Cross", "広い十字"),
  lxPierce: c("꿰뚫는 빛", "Piercing Light", "貫く光"),
  lxJudge: c("단죄", "Condemnation", "断罪"),
  lxTattoo: c("빛의 문신", "Tattoo of Light", "光の紋"),
};

export const LX_EFFECTS = {
  lxShard: c(
    "떨어진 빛의 힘 한 조각 · 치명타 +1.5% · 예리함 +1.5% · 빛의 검 피해 +4% · 6개마다 몸이 커지고 빛의 검이 커지며 노리는 적 +1",
    "A shard of fallen light · crit +1.5% · sharpness +1.5% · light sword damage +4% · every 6: you grow, swords grow and hit one more foe",
    "落ちた光の力のかけら · 会心+1.5% · 鋭さ+1.5% · 光の剣ダメージ+4% · 6個ごとに体が大きくなり、光の剣が大きくなって狙う敵+1",
  ),
  lxMore: c("적마다 빛의 검 +{add}", "+{add} light sword per foe", "敵ごとに光の剣+{add}"),
  lxQuick: c("빛의 검이 {every}번 공격마다", "Light swords every {every} attacks", "光の剣が{every}回攻撃ごと"),
  lxWide: c("빛의 검 크기 ×{mul}", "Light sword size ×{mul}", "光の剣の大きさ×{mul}"),
  lxGrace: c(
    "빛의 검이 ×{reach} 넓은 곳까지 생기고 한 번에 {add}개 더 · 몸 둘레에 빛의 검 넷이 떠다님",
    "Light swords form ×{reach} farther and {add} more each time · four light swords float around you",
    "光の剣が×{reach}広い範囲に生まれ、1回につき{add}本多く · 体のまわりに光の剣が4本漂う",
  ),
  lxPierce: c(
    "빛의 검이 생긴 자리에 붉은 빛의 검이 한 번 더 꿰뚫음 (피해 ×{mul})",
    "A crimson light sword pierces again where each light sword formed (damage ×{mul})",
    "光の剣が生まれた場所に紅の光の剣がもう一度貫く（ダメージ×{mul}）",
  ),
  lxJudge: c("빛의 검 피해 ×{mul}", "Light sword damage ×{mul}", "光の剣ダメージ×{mul}"),
  lxTattoo: c("빛의 조각마다 최대 체력 +{hp} · 치명타 피해 +3%", "Per shard: +{hp} max HP · +3% crit damage", "かけらごとに最大体力+{hp} · 会心ダメージ+3%"),
};
