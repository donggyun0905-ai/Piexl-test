// 새벽의 성흔 크루세이더 글자 (한·영·일): 성십자가 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsCrusader·CRUSADER_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type CrPassive =
  | "crHeavy" | "crLong" | "crQuick" | "crAfter" | "crPillar" | "crBrace" | "crPenance" | "crVerdict" | "crThorn" | "crHalo"
  | "crRamPow" | "crRamWide" | "crRamWall" | "crRamGain" | "crRamSlam" | "crSense" | "crEndless" | "crGiant" | "crRain" | "crGrave";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const CR_WEAPON_NAMES: Record<"crCross" & WeaponId, Names> = {
  crCross: c("성십자가", "Holy Cross", "聖十字架"),
};

export const CR_PASSIVE_NAMES: Record<CrPassive & PassiveId, Names> = {
  crHeavy: c("무거운 십자가", "Heavy Cross", "重い十字架"),
  crLong: c("갈라지는 대지", "Splitting Earth", "割れる大地"),
  crQuick: c("단련된 어깨", "Trained Shoulders", "鍛えた肩"),
  crAfter: c("여진", "Aftershock", "余震"),
  crPillar: c("성주", "Holy Pillars", "聖柱"),
  crBrace: c("굳건한 신앙", "Steadfast Faith", "揺るがぬ信仰"),
  crPenance: c("속죄", "Penance", "贖罪"),
  crVerdict: c("무거운 심판", "Heavy Verdict", "重い審判"),
  crThorn: c("가시 면류관", "Crown of Thorns", "茨の冠"),
  crHalo: c("가시 후광", "Thorned Halo", "茨の後光"),
  crRamPow: c("파성추", "Battering Ram", "破城槌"),
  crRamWide: c("넓은 방패", "Broad Bulwark", "広い盾"),
  crRamWall: c("성벽 충돌", "Wall Crash", "城壁激突"),
  crRamGain: c("순례의 길", "Pilgrim's Road", "巡礼の道"),
  crRamSlam: c("돌진 낙인", "Charging Brand", "突進の烙印"),
  crSense: c("신앙의 성흔", "Stigma of Faith", "信仰の聖痕"),
  crEndless: c("끝없는 강림", "Endless Descent", "果てなき降臨"),
  crGiant: c("거신", "Colossus", "巨神"),
  crRain: c("십자가 비", "Rain of Crosses", "十字架の雨"),
  crGrave: c("성묘", "Holy Grave", "聖墓"),
};

export const CR_EFFECTS: Partial<Record<CrPassive & PassiveId, Names>> = {
  crHeavy: c("내려찍기·십자 균열 피해 {mul}배", "{mul}x slam · cross fissure damage", "叩きつけ・十字の亀裂のダメージ{mul}倍"),
  crLong: c("십자 균열 팔마다 {more}마디 더", "+{more} joint on every cross fissure arm", "十字の亀裂の腕ごとに{more}節追加"),
  crQuick: c("들어 올리는 시간 {time:pct}%", "Heave time {time:pct}%", "持ち上げる時間{time:pct}%"),
  crAfter: c("새 공격: 찍은 자리가 {delay:sec}초 뒤 {r}배 넓게 한 번 더 무너짐 ({mul:pct}%)", "New attack: {delay:sec}s later the impact site collapses again, {r}x wider ({mul:pct}%)", "新攻撃：叩いた場所が{delay:sec}秒後に{r}倍広くもう一度崩れる（{mul:pct}%）"),
  crPillar: c("새 공격: 십자 균열 팔 끝마다 돌기둥이 솟음 ({mul:pct}% · 기절)", "New attack: a stone pillar bursts up at the tip of each cross fissure arm ({mul:pct}% · stun)", "新攻撃：十字の亀裂の腕の先ごとに石柱が突き出る（{mul:pct}%・気絶）"),
  crBrace: c("버팀 중 받는 피해 {cut:pct}%", "{cut:pct}% damage taken while Bracing", "踏ん張り中の被ダメージ{cut:pct}%"),
  crPenance: c("무게가 {gain}배 빨리 참", "Weight fills {gain}x faster", "重みが{gain}倍早く溜まる"),
  crVerdict: c("심판의 십자가 피해 {mul}배 · 범위 {r}배", "{mul}x Cross of Judgment damage · {r}x radius", "審判の十字架のダメージ{mul}倍・範囲{r}倍"),
  crThorn: c("새 공격: 버팀 중 맞으면 둘레로 가시가 터짐 ({mul:pct}%)", "New attack: when hit while Bracing, thorns burst out around you ({mul:pct}%)", "新攻撃：踏ん張り中に被弾すると周囲に茨が弾ける（{mul:pct}%）"),
  crHalo: c("새 공격: 내려찍기 {every}번마다 머리 위 가시 후광이 날아갔다 돌아옴 ({mul:pct}%)", "New attack: every {every} slams, your thorned halo flies out and returns ({mul:pct}%)", "新攻撃：叩きつけ{every}回ごとに頭上の茨の後光が飛んで戻る（{mul:pct}%）"),
  crRamPow: c("돌진 들이받기 피해 {mul}배", "{mul}x charge ram damage", "突進の体当たりダメージ{mul}倍"),
  crRamWide: c("돌진이 {r}배 넓게 적을 잡음", "Charge catches foes {r}x wider", "突進が{r}倍広く敵を捕らえる"),
  crRamWall: c("벽 충돌 피해 {mul}배 · 기절 +{stun:sec}초", "{mul}x wall crash damage · +{stun:sec}s stun", "壁激突のダメージ{mul}倍・気絶+{stun:sec}秒"),
  crRamGain: c("돌진으로 잡은 적마다 무게 +{weight}", "+{weight} Weight per foe caught by a charge", "突進で捕らえた敵ごとに重み+{weight}"),
  crRamSlam: c("새 공격: 돌진이 끝나면 앞 땅에 작은 십자 균열 ({mul:pct}%)", "New attack: when a charge ends, a small cross fissure splits the ground ahead ({mul:pct}%)", "新攻撃：突進が終わると前方の地面に小さな十字の亀裂（{mul:pct}%）"),
  crSense: c("성흔이 {gain}배 빨리 참", "Stigma fills {gain}x faster", "聖痕が{gain}倍早く満ちる"),
  crEndless: c("성십자가 강림 +{more:sec}초", "Descent of the Holy Cross +{more:sec}s", "聖十字架降臨+{more:sec}秒"),
  crGiant: c("강림 중 받는 피해 {cut:pct}% · 발걸음 범위 {r}배", "{cut:pct}% damage taken during the Descent · {r}x footstep radius", "降臨中の被ダメージ{cut:pct}%・足音の範囲{r}倍"),
  crRain: c("새 공격: 강림 중 {every:sec}초마다 둘레 적에게 작은 십자가가 떨어짐 ({mul:pct}%)", "New attack: during the Descent, a small cross falls on a nearby foe every {every:sec}s ({mul:pct}%)", "新攻撃：降臨中、{every:sec}秒ごとに周囲の敵へ小さな十字架が落ちる（{mul:pct}%）"),
  crGrave: c("새 공격: 심판의 십자가가 {ticks:sec}초 동안 땅에 박혀 {every:sec}초마다 둘레를 정화 ({mul:pct}%)", "New attack: Crosses of Judgment stay planted for {ticks:sec}s, purifying the area every {every:sec}s ({mul:pct}%)", "新攻撃：審判の十字架が{ticks:sec}秒間地面に刺さり、{every:sec}秒ごとに周囲を浄化（{mul:pct}%）"),
};
