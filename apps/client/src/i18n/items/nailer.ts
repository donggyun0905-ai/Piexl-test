// 새벽의 성흔 네일러 글자 (한·영·일): 망치와 못 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsNailer·NAILER_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type NlPassive =
  | "nlIron" | "nlBarb" | "nlQuick" | "nlSpread" | "nlDeep" | "nlSledge" | "nlWide" | "nlDrive" | "nlStun" | "nlEcho"
  | "nlChain" | "nlBind" | "nlBleed" | "nlCurse" | "nlFuse" | "nlRain" | "nlFocus" | "nlMoon" | "nlBlind" | "nlRelent";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const NL_WEAPON_NAMES: Record<"nlHammer" & WeaponId, Names> = {
  nlHammer: c("심판관의 망치와 못", "Judge's Hammer & Nails", "審判官の槌と釘"),
};

export const NL_PASSIVE_NAMES: Record<NlPassive & PassiveId, Names> = {
  nlIron: c("무거운 못", "Heavy Nail", "重い釘"),
  nlBarb: c("미늘 못", "Barbed Nail", "返し釘"),
  nlQuick: c("빠른 손목", "Quick Wrist", "素早い手首"),
  nlSpread: c("흩뿌리는 못", "Scattered Nails", "撒き釘"),
  nlDeep: c("깊은 못", "Deep Nail", "深い釘"),
  nlSledge: c("대형 망치", "Sledgehammer", "大槌"),
  nlWide: c("넓은 내려치기", "Wide Slam", "広い打ち下ろし"),
  nlDrive: c("못 박기", "Drive It Home", "釘打ち"),
  nlStun: c("머리 치기", "Head Strike", "脳天打ち"),
  nlEcho: c("울리는 쇠", "Ringing Iron", "響く鉄"),
  nlChain: c("붉은 실", "Crimson Thread", "紅の糸"),
  nlBind: c("단단한 고정", "Firm Binding", "固い縫い止め"),
  nlBleed: c("피의 원", "Circle of Blood", "血の円"),
  nlCurse: c("깊은 저주", "Deep Curse", "深い呪い"),
  nlFuse: c("긴 도화선", "Long Fuse", "長い導火線"),
  nlRain: c("못비", "Nail Rain", "釘の雨"),
  nlFocus: c("단 하나의 표적", "The Only Target", "ただ一つの標的"),
  nlMoon: c("달빛 못", "Moonlit Nail", "月光の釘"),
  nlBlind: c("눈가리개 붕대", "Blindfold Bandage", "目隠しの包帯"),
  nlRelent: c("끝없는 사냥", "Relentless Hunt", "終わらぬ狩り"),
};

export const NL_EFFECTS: Partial<Record<NlPassive & PassiveId, Names>> = {
  nlIron: c("못 피해 {mul}배", "{mul}x nail damage", "釘ダメージ{mul}倍"),
  nlBarb: c("박힌 못이 출혈 ({mul:pct}%)", "Stuck nails cause bleeding ({mul:pct}%)", "刺さった釘が出血（{mul:pct}%）"),
  nlQuick: c("1 못 던지기 대기 -{cd:down}%", "-{cd:down}% Nail Throw cooldown", "1 釘投げの待機-{cd:down}%"),
  nlSpread: c("1 못 던지기 3번째 못 +{add}개", "+{add} nails on Nail Throw's 3rd press", "1 釘投げ3回目の釘+{add}本"),
  nlDeep: c("못이 {from}개 이상 박힌 적에게는 못이 두 개씩", "Nails stick two at a time into foes with {from}+ nails", "釘が{from}本以上刺さった敵には2本ずつ"),
  nlSledge: c("망치 피해 {mul}배", "{mul}x hammer damage", "槌ダメージ{mul}倍"),
  nlWide: c("망치 거리 {r}배 · 반원으로 넓게", "{r}x hammer reach · hits a half circle", "槌の届く距離{r}倍・半円に広く"),
  nlDrive: c("망치로 못이 박힌 적을 치면 못 +{add}", "Hammering a nailed foe drives +{add} nail", "槌で釘が刺さった敵を叩くと釘+{add}"),
  nlStun: c("못 {from}개 이상 박힌 적을 망치로 치면 {ticks:sec}초 멈춤", "Hammering a foe with {from}+ nails stuns for {ticks:sec}s", "釘{from}本以上の敵を槌で叩くと{ticks:sec}秒停止"),
  nlEcho: c("박힌 못 하나마다 망치 피해 +{per:pct}% (최대 +{max:pct}%)", "+{per:pct}% hammer damage per stuck nail (max +{max:pct}%)", "刺さった釘1本ごとに槌ダメージ+{per:pct}%（最大+{max:pct}%）"),
  nlChain: c("2 붉은 실 돌진 피해 {mul}배 · 못 +{add}", "2 Red Thread dash: {mul}x damage · +{add} nails", "2 赤い糸の突進ダメージ{mul}倍・釘+{add}"),
  nlBind: c("2 붉은 실 고정 시간 {mul}배", "{mul}x Red Thread pin time", "2 赤い糸の固定時間{mul}倍"),
  nlBleed: c("2 붉은 실 망치 원 {r}배 · 출혈 {mul}배", "Red Thread hammer ring: {r}x size · {mul}x bleed", "2 赤い糸の槌の円{r}倍・出血{mul}倍"),
  nlCurse: c("3 저주의 도화선 못 하나마다 공격력 {perNail:pct}%", "Cursed Fuse: {perNail:pct}% attack per nail", "3 呪いの導火線 釘1本ごとに攻撃力{perNail:pct}%"),
  nlFuse: c("3 저주의 도화선 뒤 못 {keep:pct}% 남음", "{keep:pct}% of nails remain after Cursed Fuse", "3 呪いの導火線のあと釘{keep:pct}%残る"),
  nlRain: c("4 심판의 못비 +{add}번", "+{add} volleys of Nail Judgment", "4 釘の審判+{add}回"),
  nlFocus: c("4 심판의 못비 피해 {mul}배", "{mul}x Nail Judgment damage", "4 釘の審判ダメージ{mul}倍"),
  nlMoon: c("성흔이 {gain}배 빨리 참", "Stigma fills {gain}x faster", "聖痕が{gain}倍早く満ちる"),
  nlBlind: c("달빛 각성 +{more:sec}초", "Moonlight Awakening +{more:sec}s", "月光覚醒+{more:sec}秒"),
  nlRelent: c("못이 박힌 적을 처치하면 3번 대기 -{cut:sec}초", "Killing a nailed foe cuts Cursed Fuse cooldown by {cut:sec}s", "釘が刺さった敵を倒すと3番の待機-{cut:sec}秒"),
};
