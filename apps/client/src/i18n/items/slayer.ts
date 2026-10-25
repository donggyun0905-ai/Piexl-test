// 학살자(헬리오스) 글자 (한·영·일): 대낫 이름 · 콤보 기술 이름(설명은 콤보로 만듦) · 전용 아이템 이름·효과 (수치는 weaponsSlayer·SLAYER_PERKS와 맞춤)
import type { Lang } from "../index";
import type { PassiveId, ScytheMove, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type SlayerWeapon = "bloodScythe" | "diamondScythe" | "whirlScythe" | "tideScythe" | "hungerScythe" | "flyingScythe" | "rushScythe" | "earthScythe" | "phantomScythe" | "executionScythe";
type SlayerPassive = "slPact" | "slMadness" | "slThirst" | "slNumb" | "slBerserk" | "slGrin" | "slCrimson" | "slHound" | "slLastBreath" | "slMassacre";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const SLAYER_WEAPON_NAMES: Record<SlayerWeapon & WeaponId, Names> = {
  bloodScythe: c("피의 대낫", "Blood Scythe", "血の大鎌"),
  diamondScythe: c("마름모 대낫", "Diamond Scythe", "菱形の大鎌"),
  whirlScythe: c("회오리 대낫", "Whirl Scythe", "旋風の大鎌"),
  tideScythe: c("핏물 대낫", "Blood Tide Scythe", "血潮の大鎌"),
  hungerScythe: c("굶주린 대낫", "Hungry Scythe", "飢えた大鎌"),
  flyingScythe: c("나는 대낫", "Flying Scythe", "飛ぶ大鎌"),
  rushScythe: c("돌진 대낫", "Charging Scythe", "突進の大鎌"),
  earthScythe: c("대지의 대낫", "Earth Scythe", "大地の大鎌"),
  phantomScythe: c("유령 대낫", "Phantom Scythe", "幽霊の大鎌"),
  executionScythe: c("처형 대낫", "Execution Scythe", "処刑の大鎌"),
};

const MOVE: Record<ScytheMove, Names> = {
  slash3: c("낫 베기 3연속", "triple slash", "鎌斬り3連"),
  raid: c("급습 베기", "raid slash", "急襲斬り"),
  line: c("일직선 베기", "line cleave", "一直線斬り"),
  wave3: c("강하게 베기 + 검기 셋", "heavy slash + three blade waves", "強斬り＋剣気3つ"),
  grand: c("더욱 강하게 베기", "grand slash", "渾身の大斬り"),
  spin: c("회오리 베기", "whirl", "旋風斬り"),
  diamond: c("마름모 검기", "diamond blades", "菱形の剣気"),
  chop: c("내려찍기", "chop", "叩きつけ"),
  throw: c("대낫 날리기", "scythe throw", "大鎌投げ"),
  rush: c("대낫 돌진", "scythe charge", "大鎌突進"),
  burst: c("땅 뒤집기", "earth upheaval", "地返し"),
  backstep: c("백스텝 검기", "backstep blades", "バックステップ剣気"),
  crossX: c("X자 베기", "X-cut", "X字斬り"),
  bloodNova: c("피의 검기 폭발", "blood nova", "血の剣気爆発"),
  reap: c("끌어당겨 베기", "reaping pull", "引き寄せ斬り"),
  skyfall: c("내려찍는 강하", "skyfall", "天墜"),
};

/** 대낫 설명: 한 번 누르면 나오는 5연속 콤보 */
export function scytheDesc(combo: readonly ScytheMove[], lang: Lang): string {
  const head = { ko: "아주 빠른 5연속 콤보 (끝나면 쉬고 다시)", en: "a blazing 5-move combo (then a short rest)", ja: "とても速い5連続コンボ（終わると一息）" }[lang];
  return `${head}: ${combo.map((m) => MOVE[m][lang]).join(" → ")}`;
}

export const SLAYER_PASSIVE_NAMES: Record<SlayerPassive & PassiveId, Names> = {
  slPact: c("피의 계약", "Blood Pact", "血の契約"),
  slMadness: c("광기", "Madness", "狂気"),
  slThirst: c("갈증", "Thirst", "渇き"),
  slNumb: c("무딘 고통", "Numb Pain", "鈍い痛み"),
  slBerserk: c("광전사", "Berserker", "狂戦士"),
  slGrin: c("섬뜩한 미소", "Eerie Grin", "不気味な笑み"),
  slCrimson: c("붉은 날", "Crimson Edge", "紅の刃"),
  slHound: c("사냥개", "Bloodhound", "猟犬"),
  slLastBreath: c("마지막 숨", "Last Breath", "最後の息"),
  slMassacre: c("대학살", "Massacre", "大虐殺"),
};

export const SLAYER_EFFECTS: Partial<Record<SlayerPassive & PassiveId, Names>> = {
  slPact: c("피의 학살 +{ticks:sec}초", "Blood Massacre +{ticks:sec}s", "血の虐殺+{ticks:sec}秒"),
  slMadness: c("게이지가 {mul:up}% 빨리 참", "The gauge fills {mul:up}% faster", "ゲージが{mul:up}%速く溜まる"),
  slThirst: c("피의 학살 흡혈 +{leech:pct}%", "Blood Massacre lifesteal +{leech:pct}%", "血の虐殺の吸血+{leech:pct}%"),
  slNumb: c("기술마다 체력 소모 {cost}", "Each move costs {cost} HP", "技ごとの体力消費{cost}"),
  slBerserk: c("체력이 낮을 때 공격력이 최대 {max}배", "At low HP damage rises up to ×{max}", "体力が低い時、攻撃力が最大{max}倍"),
  slGrin: c("적을 쓰러뜨리면 게이지 +{gauge}", "Kills add {gauge} to the gauge", "敵を倒すとゲージ+{gauge}"),
  slCrimson: c("검기·날린 대낫 피해 +{mul:up}%", "Blade waves and thrown scythes deal +{mul:up}%", "剣気・投げた大鎌のダメージ+{mul:up}%"),
  slHound: c("급습·돌진·백스텝·강하 거리 +{mul:up}%", "Raid, charge, backstep and skyfall reach +{mul:up}%", "急襲・突進・バックステップ・天墜の距離+{mul:up}%"),
  slLastBreath: c("한 판에 한 번, 쓰러질 피해를 받으면 체력 1로 버팀", "Once per run, survive a fatal blow with 1 HP", "1回のプレイで一度、倒れるダメージを体力1で耐える"),
  slMassacre: c("피의 학살 중 쓰러뜨린 적 자리가 터짐", "During Blood Massacre, foes you fell explode", "血の虐殺中、倒した敵の場所が爆発"),
};
