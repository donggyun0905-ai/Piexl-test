// 몰락한 왕(히든) 글자 (한·영·일): 츠바이핸더 이름·설명 · 전용 아이템 10 이름·효과 (수치는 weaponsFallenKing·FALLEN_KING_PERKS와 맞춤)
import type { Lang } from "../index";
import type { Names } from "./names";

const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const FK_WEAPON_NAMES = {
  fkZwei: c("몰락한 왕의 츠바이핸더", "Fallen King's Zweihänder", "没落した王のツヴァイヘンダー"),
};

/** 대검 설명 (무기 설명 줄) */
export const ZWEI_DESC: Names = c(
  "한 콤보: X자 두 번 베기 → 가로로 점점 길어지는 검기 → 검을 내리꽂으면 푸른 불꽃 선이 적에게 이어지고 점화선처럼 타고 가 거대한 불기둥",
  "One combo: two X slashes → a sword wave that keeps widening → plant the blade and blue flame lines race to foes like fuses, ending in giant fire pillars",
  "1コンボ: X字の二連斬り → 横に伸びていく剣気 → 剣を突き立てると青い炎の線が敵へつながり導火線のように走って巨大な火柱",
);
export const zweiDesc = (lang: Lang) => ZWEI_DESC[lang];

export const FK_PASSIVE_NAMES = {
  fkCrest: c("녹슨 제국 문장", "Rusted Imperial Crest", "錆びた帝国の紋章"),
  fkPlate: c("푸른 불꽃 흉갑", "Blue Flame Breastplate", "青い炎の胸甲"),
  fkGrip: c("왕의 손아귀", "King's Grip", "王の握力"),
  fkReach: c("긴 칼날", "Long Edge", "長い刃"),
  fkHarvest: c("영혼 수확", "Soul Harvest", "魂の収穫"),
  fkPyre: c("장작불", "Funeral Pyre", "薪の炎"),
  fkLines: c("끝없는 점화선", "Endless Fuses", "果てなき導火線"),
  fkCross: c("십자 처형", "Cross Execution", "十字の処刑"),
  fkMajesty: c("왕의 위엄", "Royal Majesty", "王の威厳"),
  fkRequiem: c("진혼곡", "Requiem", "鎮魂歌"),
};

export const FK_EFFECTS = {
  fkHarvest: c("처치마다 영혼을 하나 더 거둠", "Reap one extra soul per kill", "撃破ごとに魂をもう一つ刈り取る"),
  fkPyre: c("불기둥 범위 ×{r} · 피해 ×{mul}", "Fire pillar size ×{r} · damage ×{mul}", "火柱の範囲×{r} · ダメージ×{mul}"),
  fkLines: c("불꽃 선이 {add}개 더 (불기둥도 더)", "{add} more flame lines (and pillars)", "炎の線が{add}本増える (火柱も)"),
  fkCross: c("X자 베기 피해 ×{mul}", "X slash damage ×{mul}", "X字斬りのダメージ×{mul}"),
  fkMajesty: c("영혼 {per}개마다 받는 피해 -2% (최대 -30%)", "-2% damage taken per {per} souls (up to -30%)", "魂{per}個ごとに被ダメージ-2% (最大-30%)"),
  fkRequiem: c("불기둥 하나마다 최대 체력의 1% 회복", "Heal 1% max HP per fire pillar", "火柱ひとつごとに最大体力の1%回復"),
};
