// 성국 미카엘라 글자 (한·영·일): 무한의 무기 보관소 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsMichaela·MICHAELA_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type McPassive =
  | "mcFrenzy" | "mcMadness" | "mcTempo" | "mcDouble" | "mcEcho" | "mcPowder" | "mcWide" | "mcResonance" | "mcFuse" | "mcShrapnel"
  | "mcJavelin" | "mcHeavy" | "mcSword" | "mcLance" | "mcHoard" | "mcStorm" | "mcBlink" | "mcVoid" | "mcArsenal" | "mcPrayer";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const MC_WEAPON_NAMES: Record<"mcArmory" & WeaponId, Names> = {
  mcArmory: c("무한의 무기 보관소 (투창과 검의 비행 집합체)", "Infinite Armory (a flying swarm of javelins and swords)", "無限の武器庫（投槍と剣の飛行集合体）"),
};

export const MC_PASSIVE_NAMES: Record<McPassive & PassiveId, Names> = {
  mcFrenzy: c("광란", "Frenzy", "狂乱"),
  mcMadness: c("광기", "Madness", "狂気"),
  mcTempo: c("끊이지 않는 박자", "Unbroken Tempo", "途切れぬ拍子"),
  mcDouble: c("바꿔치기", "Quick Switch", "すり替え"),
  mcEcho: c("메아리 투척", "Echo Throw", "こだまの投擲"),
  mcPowder: c("성스러운 화약", "Holy Powder", "聖なる火薬"),
  mcWide: c("넓은 폭심", "Wide Blast", "広い爆心"),
  mcResonance: c("공명", "Resonance", "共鳴"),
  mcFuse: c("긴 도화선", "Long Fuse", "長い導火線"),
  mcShrapnel: c("파편", "Shrapnel", "破片"),
  mcJavelin: c("공허의 투창", "Void Javelin", "虚空の投槍"),
  mcHeavy: c("무거운 날", "Heavy Edge", "重い刃"),
  mcSword: c("백은의 검", "Silver Sword", "白銀の剣"),
  mcLance: c("백금의 창", "Platinum Lance", "白金の槍"),
  mcHoard: c("무기 수집가", "Weapon Hoarder", "武器収集家"),
  mcStorm: c("쏟아지는 하늘", "Pouring Sky", "降り注ぐ空"),
  mcBlink: c("공허 걸음", "Void Step", "虚空の歩み"),
  mcVoid: c("공허의 칼날", "Void Edge", "虚空の刃"),
  mcArsenal: c("끝없는 무기고", "Endless Arsenal", "果てなき武器庫"),
  mcPrayer: c("인도자의 기도", "Guide's Prayer", "導き手の祈り"),
};

export const MC_EFFECTS: Partial<Record<McPassive & PassiveId, Names>> = {
  mcFrenzy: c("콤보 최대 +{more}", "+{more} max combo", "コンボ最大+{more}"),
  mcMadness: c("콤보 하나마다 피해 +{step:pct}% (원래 3%)", "+{step:pct}% damage per combo (was 3%)", "コンボ1つごとにダメージ+{step:pct}%（元3%）"),
  mcTempo: c("콤보 유지 +{more:sec}초", "Combo lasts +{more:sec}s", "コンボ維持+{more:sec}秒"),
  mcDouble: c("무기를 바꿀 때 콤보 +{more} 더", "+{more} more combo on swap", "持ち替え時コンボ+{more}"),
  mcEcho: c("던질 때 {chance:pct}% 확률로 비껴 한 번 더", "{chance:pct}% chance to throw once more at an angle", "投擲時{chance:pct}%の確率で斜めにもう一度"),
  mcPowder: c("폭발 피해 {mul}배", "{mul}x explosion damage", "爆発ダメージ{mul}倍"),
  mcWide: c("폭발 범위 {r}배", "{r}x explosion radius", "爆発範囲{r}倍"),
  mcResonance: c("연쇄 거리 {r}배", "{r}x chain reach", "連鎖距離{r}倍"),
  mcFuse: c("연쇄 폭발 피해 {mul}배", "{mul}x chain explosion damage", "連鎖爆発ダメージ{mul}倍"),
  mcShrapnel: c("폭발에 맞은 적 출혈 ({mul:pct}%)", "Explosions make foes bleed ({mul:pct}%)", "爆発を受けた敵が出血（{mul:pct}%）"),
  mcJavelin: c("투척 거리 {len}배 · 줄 위 모든 적을 꿰뚫음", "{len}x throw range · pierces every foe in line", "投擲距離{len}倍・線上の全ての敵を貫く"),
  mcHeavy: c("투척 피해 {mul}배", "{mul}x throw damage", "投擲ダメージ{mul}倍"),
  mcSword: c("검 베기 피해 {mul}배 · 더 넓게", "{mul}x sword slash damage · wider", "剣の斬りダメージ{mul}倍・より広く"),
  mcLance: c("창 찌르기 길이 {len}배 · 피해 {mul}배", "{len}x spear thrust length · {mul}x damage", "槍の突きの長さ{len}倍・ダメージ{mul}倍"),
  mcHoard: c("방에 들어설 때 무기 +{rain} · 박힌 무기 최대 +{max}", "+{rain} weapons on entering a room · +{max} max planted", "部屋に入るとき武器+{rain}・刺さった武器最大+{max}"),
  mcStorm: c("무기 비 +{more}개", "Weapon Rain +{more} weapons", "武器の雨+{more}本"),
  mcBlink: c("대시 순간 이동 범위 {r}배", "{r}x dash teleport range", "ダッシュ瞬間移動の範囲{r}倍"),
  mcVoid: c("순간 이동 도착 베기 {mul}배 · 무적 +{inv:sec}초", "{mul}x arrival slash · +{inv:sec}s invulnerability", "瞬間移動の到着斬り{mul}倍・無敵+{inv:sec}秒"),
  mcArsenal: c("무한의 무기고 +{more:sec}초 · 간격 {every}배", "Infinite Armory +{more:sec}s · {every}x interval", "無限の武器庫+{more:sec}秒・間隔{every}倍"),
  mcPrayer: c("모든 스킬 대기 -{cd:down}%", "-{cd:down}% all skill cooldowns", "全スキル待機-{cd:down}%"),
};
