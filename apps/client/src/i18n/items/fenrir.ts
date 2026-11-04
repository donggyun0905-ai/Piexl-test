// 비르디아 펜리르 글자 (한·영·일): 선왕의 대검 이름·설명 · 전용 아이템 이름·효과 (수치는 weaponsFenrir.FENRIR·FENRIR_PERKS와 맞춤)
import { FENRIR, type PassiveId, type WeaponId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

type FnPassive = "fnWisdom" | "fnHalo" | "fnFang" | "fnGale" | "fnHowl" | "fnStar" | "fnMoon" | "fnRift" | "fnVeteran" | "fnHunt";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const FN_WEAPON_NAMES: Record<"fnKingBlade" & WeaponId, Names> = {
  fnKingBlade: c("선왕의 대검", "Blade of the Late King", "先王の大剣"),
};

export const FN_PASSIVE_NAMES: Record<FnPassive & PassiveId, Names> = {
  fnWisdom: c("늙은 늑대의 지혜", "Old Wolf's Wisdom", "老狼の知恵"),
  fnHalo: c("선왕의 광륜", "Halo of the Late King", "先王の光輪"),
  fnFang: c("벼린 송곳니", "Honed Fangs", "研ぎ澄まされた牙"),
  fnGale: c("질풍", "Gale", "疾風"),
  fnHowl: c("늑대의 울부짖음", "Wolf's Howl", "狼の遠吠え"),
  fnStar: c("천랑성", "Sirius", "天狼星"),
  fnMoon: c("월광 난무", "Moonlit Frenzy", "月光乱舞"),
  fnRift: c("대지 가르기", "Earth Splitter", "大地割り"),
  fnVeteran: c("노장의 투혼", "Veteran's Spirit", "老将の闘魂"),
  fnHunt: c("사냥 본능", "Hunting Instinct", "狩りの本能"),
};

export const FN_EFFECTS: Partial<Record<FnPassive & PassiveId, Names>> = {
  fnWisdom: c("피해를 피하면 {ticks:sec}초 동안 공격력 +{dmg:pct}%", "Dodging a hit grants +{dmg:pct}% attack for {ticks:sec}s", "攻撃を回避すると{ticks:sec}秒間攻撃力+{dmg:pct}%"),
  fnHalo: c("쓰러질 피해를 층마다 한 번 견딤 (체력 1 · {invuln:sec}초 무적)", "Once per floor, survive a fatal hit (1 HP · {invuln:sec}s invincible)", "倒れるダメージを階ごとに1回耐える（体力1・{invuln:sec}秒無敵）"),
  fnFang: c("예리함 +{sharp:pct}%p · 예리함이 걸린 적에게 피해 +{dmg:pct}%", "+{sharp:pct}%p Sharpness · +{dmg:pct}% damage to Sharpened foes", "鋭さ+{sharp:pct}%p · 鋭さがかかった敵へのダメージ+{dmg:pct}%"),
  fnGale: c("이동 속도 +0.15 · 대시 대기 시간 -{dash:down}%", "+0.15 move speed · -{dash:down}% dash cooldown", "移動速度+0.15 · ダッシュの待ち時間-{dash:down}%"),
  fnHowl: c("천랑 낙인 착지 때 둘레 적 {stun:sec}초 기절", "Sirius Brand's landing stuns nearby foes for {stun:sec}s", "天狼の烙印の着地で周りの敵を{stun:sec}秒気絶"),
  fnStar: c("착지 검기 {n}갈래 · 검기가 {reach:up}% 더 멀리", "Landing sends {n} sword waves · waves travel {reach:up}% farther", "着地の剣気{n}本 · 剣気が{reach:up}%遠くまで"),
  fnMoon: c("난도 베기 {n}번 · 범위 +{r:up}%", "Frenzy Cut strikes {n} times · +{r:up}% area", "乱刀の斬撃{n}回 · 範囲+{r:up}%"),
  fnRift: c("지면 검기가 지나간 자리에 {ticks:sec}초 동안 균열 ({gap:sec}초마다 공격력 {mul:pct}%)", "The ground wave leaves rifts for {ticks:sec}s ({mul:pct}% attack every {gap:sec}s)", "地面の剣気が通った跡に{ticks:sec}秒間亀裂（{gap:sec}秒ごとに攻撃力{mul:pct}%）"),
  fnVeteran: c("체력 {hp:pct}% 아래일 때 회피 +{dodge:pct}%p", "+{dodge:pct}%p dodge while below {hp:pct}% HP", "体力{hp:pct}%未満の間、回避+{dodge:pct}%p"),
  fnHunt: c("적을 쓰러뜨리면 콤보 쉬는 시간이 끝나고 {ticks:sec}초 동안 이동 속도 +{move}", "Killing a foe ends the combo rest and grants +{move} move speed for {ticks:sec}s", "敵を倒すとコンボの休みが終わり、{ticks:sec}秒間移動速度+{move}"),
};

const pct = (v: number) => Math.round(v * 100);

/** 선왕의 대검 설명 (수치는 FENRIR에서) */
export function fangDesc(lang: Lang): string {
  const F = FENRIR;
  const sec = (t: number) => Math.round((t / 60) * 10) / 10;
  return {
    ko: `한 번 누르면 5연 콤보가 저절로 이어짐: 물어 베기(${pct(F.biteMul)}%) → 되베기(${pct(F.backMul)}%) → 지면 검기(${pct(F.waveMul)}%, 바닥을 그으며 나아가 뚫음) → 난도(한 자리를 사방에서 ${F.cutN}번, 번마다 ${pct(F.cutMul)}%) → 천랑 낙인(${sec(F.jumpTicks)}초 뛰어오른 동안 무적, 내려찍기 ${pct(F.landMul)}% + 사방 검기 ${F.starN}갈래 ${pct(F.starMul)}%)`,
    en: `One press runs a fixed 5-hit combo: Bite Slash (${pct(F.biteMul)}%) → Return Slash (${pct(F.backMul)}%) → Ground Wave (${pct(F.waveMul)}%, scrapes along the floor and pierces) → Frenzy Cut (${F.cutN} slashes from every side on one spot, ${pct(F.cutMul)}% each) → Sirius Brand (invincible for ${sec(F.jumpTicks)}s in the air, slam ${pct(F.landMul)}% + ${F.starN} sword waves in all directions, ${pct(F.starMul)}%)`,
    ja: `一度押すと5連コンボが自動で続く：噛み斬り（${pct(F.biteMul)}%）→ 返し斬り（${pct(F.backMul)}%）→ 地面の剣気（${pct(F.waveMul)}%、床をえぐりながら進み貫通）→ 乱刀（一か所を四方から${F.cutN}回、各${pct(F.cutMul)}%）→ 天狼の烙印（${sec(F.jumpTicks)}秒跳び上がる間は無敵、叩きつけ${pct(F.landMul)}% + 四方へ剣気${F.starN}本 ${pct(F.starMul)}%）`,
  }[lang];
}
