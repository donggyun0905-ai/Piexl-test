// 새벽의 성흔 헬피스트 글자 (한·영·일): 적혈의 주먹 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsHellfist·HELLFIST_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type HfPassive =
  | "hfKnuckle" | "hfDouble" | "hfCrush" | "hfQuake" | "hfIron" | "hfGrow" | "hfSpread" | "hfHold" | "hfFeed" | "hfMaw"
  | "hfNail" | "hfAim" | "hfRend" | "hfFar" | "hfEcho" | "hfBlood" | "hfLong" | "hfFrenzy" | "hfLeech" | "hfBurst";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const HF_WEAPON_NAMES: Record<"hfFist" & WeaponId, Names> = {
  hfFist: c("적혈의 주먹", "Crimson Blood Fist", "赤血の拳"),
};

export const HF_PASSIVE_NAMES: Record<HfPassive & PassiveId, Names> = {
  hfKnuckle: c("굳은 주먹", "Hardened Knuckles", "硬い拳"),
  hfDouble: c("쌍주먹", "Double Fist", "双拳"),
  hfCrush: c("짓밟기", "Trample", "踏み潰し"),
  hfQuake: c("땅울림", "Ground Quake", "地鳴り"),
  hfIron: c("무쇠 팔", "Iron Arm", "鉄の腕"),
  hfGrow: c("자라는 팔", "Growing Arm", "伸びる腕"),
  hfSpread: c("침식", "Corrosion", "侵食"),
  hfHold: c("깊은 저주", "Deep Curse", "深い呪い"),
  hfFeed: c("굶주린 팔", "Starving Arm", "飢えた腕"),
  hfMaw: c("악마의 아귀", "Demon's Maw", "悪魔の顎"),
  hfNail: c("긴 손톱", "Long Talons", "長い爪"),
  hfAim: c("사냥꾼의 검지", "Hunter's Finger", "狩人の人差し指"),
  hfRend: c("찢어발기기", "Rend Apart", "引き裂き"),
  hfFar: c("먼 손짓", "Distant Beckon", "遠い手招き"),
  hfEcho: c("잔상 할퀴기", "Afterimage Claw", "残像の爪"),
  hfBlood: c("끓는 피", "Boiling Blood", "沸く血"),
  hfLong: c("깨어난 악마", "Awakened Demon", "目覚めた悪魔"),
  hfFrenzy: c("광란", "Frenzy", "狂乱"),
  hfLeech: c("피의 갈증", "Blood Thirst", "血の渇き"),
  hfBurst: c("지옥불 분출", "Hellfire Eruption", "獄炎噴出"),
};

export const HF_EFFECTS: Partial<Record<HfPassive & PassiveId, Names>> = {
  hfKnuckle: c("1타 후리기 피해 {mul}배", "{mul}x Hook damage", "1打目の振り抜きダメージ{mul}倍"),
  hfDouble: c("1타 후리기가 한 번 더 때림 ({mul:pct}%)", "Hook strikes once more ({mul:pct}%)", "1打目の振り抜きがもう一度殴る（{mul:pct}%）"),
  hfCrush: c("2타 내려찍기 피해 {mul}배", "{mul}x Slam damage", "2打目の叩きつけダメージ{mul}倍"),
  hfQuake: c("2타 내려찍기에 맞은 적 {stun:sec}초 멈춤", "Slam stops foes for {stun:sec}s", "2打目の叩きつけで敵が{stun:sec}秒停止"),
  hfIron: c("2타 내려찍기 거리 {r}배 · 밀침 {push}배", "{r}x Slam reach · {push}x knockback", "2打目の叩きつけ距離{r}倍・押し出し{push}倍"),
  hfGrow: c("악마화 최대 +{add}", "+{add} max Demonization", "悪魔化の最大+{add}"),
  hfSpread: c("악마화 1마다 사거리 +{per:pct}%", "+{per:pct}% range per Demonization", "悪魔化1ごとに射程+{per:pct}%"),
  hfHold: c("악마화가 {hold:sec}초 동안 안 빠짐", "Demonization holds for {hold:sec}s", "悪魔化が{hold:sec}秒間減らない"),
  hfFeed: c("악마화가 한 번에 {add}씩 쌓임", "Demonization builds {add} at a time", "悪魔化が一度に{add}ずつ溜まる"),
  hfMaw: c("악마화가 가득이면 모든 피해 {mul}배", "{mul}x all damage at full Demonization", "悪魔化が最大なら全ダメージ{mul}倍"),
  hfNail: c("허공검격 +{add}줄", "+{add} Air Slash hit", "虚空剣撃+{add}本"),
  hfAim: c("허공검격 대상 +{add}", "+{add} Air Slash target", "虚空剣撃の対象+{add}"),
  hfRend: c("허공검격에 맞은 적 출혈 ({mul:pct}%)", "Air Slash makes foes bleed ({mul:pct}%)", "虚空剣撃で当たった敵が出血（{mul:pct}%）"),
  hfFar: c("허공검격 가리키는 거리 {r}배", "{r}x Air Slash pointing range", "虚空剣撃の指す距離{r}倍"),
  hfEcho: c("허공검격 둘레 {r}배 · 둘레 적 피해 {mul:pct}%", "Air Slash splash {r}x wider · {mul:pct}% to nearby foes", "虚空剣撃の周囲{r}倍・周囲の敵へ{mul:pct}%"),
  hfBlood: c("성흔이 {gain}배 빨리 참", "Stigma fills {gain}x faster", "聖痕が{gain}倍早く満ちる"),
  hfLong: c("적혈 각성 +{more:sec}초", "Crimson Awakening +{more:sec}s", "赤血覚醒+{more:sec}秒"),
  hfFrenzy: c("적혈 각성 중 공격 속도 {speed}배", "{speed}x attack speed while awakened", "赤血覚醒中の攻撃速度{speed}倍"),
  hfLeech: c("적혈 각성 회복 {mul}배", "{mul}x Crimson Awakening healing", "赤血覚醒の回復{mul}倍"),
  hfBurst: c("각성 지옥불 폭발 범위 {r}배 · 피해 {mul}배", "Awakening hellfire: {r}x radius · {mul}x damage", "覚醒の獄炎爆発 範囲{r}倍・ダメージ{mul}倍"),
};
