// 탈라시아 훅 글자 (한·영·일): 갈고리 무기 6 이름·기술 설명 · 전용 아이템 10 이름·효과 (수치는 weaponsHook·HOOK_PERKS와 맞춤)
import type { HookKind, HookStyle, PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

type HkWeapon = "hkRusty" | "hkKraken" | "hkHarpoon" | "hkStorm" | "hkDragon" | "hkUndertow";
type HkPassive = "hkChain" | "hkGrapnel" | "hkSwing" | "hkDoubleTap" | "hkPowder" | "hkWreck" | "hkPlunder" | "hkRum" | "hkJolly" | "hkFreedom";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const HK_WEAPON_NAMES: Record<HkWeapon & WeaponId, Names> = {
  hkRusty: c("녹슨 갈고리", "Rusty Hook", "錆びたフック"),
  hkKraken: c("크라켄 갈고리", "Kraken Hook", "クラーケンのフック"),
  hkHarpoon: c("작살 갈고리", "Harpoon Hook", "銛のフック"),
  hkStorm: c("폭풍탄 산탄총", "Stormshot Scattergun", "嵐弾の散弾銃"),
  hkDragon: c("용의 숨결탄", "Dragon's Breath Shells", "竜の息吹弾"),
  hkUndertow: c("역조 갈고리", "Undertow Hook", "逆潮のフック"),
};

/** 갈고리마다 기술 */
const KIND: Record<HookKind, Names> = {
  rusty: c("고른 성능의 기본 갈고리", "the basic, well-rounded hook", "バランスのよい基本のフック"),
  kraken: c("한 번에 2마리 더 걸림 · 산탄이 조금 넓게", "snags 2 more foes at once · slightly wider spread", "一度に2体多く掛かる · 散弾が少し広い"),
  harpoon: c("갈고리가 35% 멀리 · 30% 빠르게 날아감", "the hook flies 35% farther and 30% faster", "フックが35%遠く · 30%速く飛ぶ"),
  storm: c("산탄에 맞은 적에게서 가까운 적에게 번개가 튐", "lightning jumps from shot foes to nearby ones", "散弾が当たった敵から近くの敵へ雷が跳ぶ"),
  dragon: c("산탄이 35% 넓게 퍼지고 맞은 적이 불탐", "shells spread 35% wider and set foes ablaze", "散弾が35%広がり敵が燃える"),
  undertow: c("걸리지 않은 적을 50% 멀리 밀어내고 난파 피해 2배", "pushes unhooked foes 50% farther · 2x wreck damage", "掛かっていない敵を50%遠くへ押し出し難破ダメージ2倍"),
};

/** 갈고리 무기 설명: 종류 기술 */
export function grappleDesc(st: HookStyle, lang: Lang): string {
  return KIND[st.hook][lang];
}

export const HK_PASSIVE_NAMES: Record<HkPassive & PassiveId, Names> = {
  hkChain: c("닻사슬", "Anchor Chain", "錨の鎖"),
  hkGrapnel: c("네 갈래 갈고리", "Grapnel", "四爪錨"),
  hkSwing: c("밧줄 그네", "Rope Swing", "ロープブランコ"),
  hkDoubleTap: c("쌍발 연사", "Double Tap", "二連射"),
  hkPowder: c("흑색 화약", "Black Powder", "黒色火薬"),
  hkWreck: c("난파선", "Shipwreck", "難破船"),
  hkPlunder: c("약탈", "Plunder", "略奪"),
  hkRum: c("럼주 한 병", "Bottle of Rum", "ラム酒一瓶"),
  hkJolly: c("해골 깃발", "Jolly Roger", "海賊旗"),
  hkFreedom: c("자유의 돛", "Sail of Freedom", "自由の帆"),
};

export const HK_EFFECTS: Partial<Record<HkPassive & PassiveId, Names>> = {
  hkChain: c("갈고리 거리 +{reach:up}%", "+{reach:up}% hook range", "フックの距離+{reach:up}%"),
  hkGrapnel: c("한 번에 걸리는 적 +{catch}", "+{catch} foes snagged at once", "一度に掛かる敵+{catch}"),
  hkSwing: c("벽으로 날아가 내리면 둘레 {r} 충격파 (공격력 {mul:pct}%) · 날아가는 동안 무적", "Landing from a wall swing sends a {r} shockwave ({mul:pct}% ATK) · invulnerable while swinging", "壁へ飛んで着地すると周囲{r}に衝撃波（攻撃力{mul:pct}%）· 飛んでいる間無敵"),
  hkDoubleTap: c("둘째 총열이 한 박자 뒤 한 번 더 (공격력 {mul:pct}%)", "The second barrel fires again a beat later ({mul:pct}% damage)", "2本目の銃身が一拍遅れてもう一発（{mul:pct}%）"),
  hkPowder: c("산탄 피해 {mul}배", "{mul}x shotgun damage", "散弾ダメージ{mul}倍"),
  hkWreck: c("난파 피해 {mul}배 · 기절 {stun}배", "{mul}x wreck damage · {stun}x stun", "難破ダメージ{mul}倍 · 気絶{stun}倍"),
  hkPlunder: c("끌어와 쏜 적이 쓰러지면 금화 +{gold}", "+{gold} gold when a hooked-and-shot foe falls", "引き寄せて撃った敵が倒れると金貨+{gold}"),
  hkRum: c("끌어온 적마다 최대 체력의 {heal:pct}% 회복", "Heal {heal:pct}% of max HP per hooked foe", "引き寄せた敵ごとに最大体力の{heal:pct}%回復"),
  hkJolly: c("산탄에 맞은 적이 겁먹어 {slow}틱 느려짐", "Shot foes are frightened and slowed for {slow} ticks", "散弾が当たった敵が怯えて{slow}ティック鈍化"),
  hkFreedom: c("받는 피해 -{taken:down}%", "-{taken:down}% damage taken", "被ダメージ-{taken:down}%"),
};
