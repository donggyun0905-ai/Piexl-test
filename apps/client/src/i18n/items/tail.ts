// 탈라시아 테일 글자 (한·영·일): 바다 무기 이름·기술 설명 · 전용 아이템 10 이름·효과 (수치는 weaponsTail·TAIL_PERKS와 맞춤)
import type { PassiveId, SeaStyle, SharkSea, WeaponId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

type TlWeapon = "tlTide" | "tlHammer" | "tlMako" | "tlGreat" | "tlStorm" | "tlFrost" | "tlOcean" | "tlFrenzy" | "tlWhirl" | "tlMega";
type TlPassive = "tlFin" | "tlBlood" | "tlFeast" | "tlChain" | "tlFreedom" | "tlDeep" | "tlSchool" | "tlJaws" | "tlBreach" | "tlRip";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const TL_WEAPON_NAMES: Record<TlWeapon & WeaponId, Names> = {
  tlTide: c("밀물 바다", "Tide Sea", "満ち潮の海"),
  tlHammer: c("귀상어 바다", "Hammerhead Sea", "シュモクザメの海"),
  tlMako: c("청상아리 바다", "Mako Sea", "アオザメの海"),
  tlGreat: c("백상아리 바다", "Great White Sea", "ホホジロザメの海"),
  tlStorm: c("뇌우 바다", "Thunderstorm Sea", "雷雨の海"),
  tlFrost: c("빙해", "Ice Sea", "氷海"),
  tlOcean: c("대양", "Open Ocean", "大洋"),
  tlFrenzy: c("광란의 바다", "Frenzy Sea", "狂乱の海"),
  tlWhirl: c("소용돌이 바다", "Whirlpool Sea", "渦潮の海"),
  tlMega: c("메갈로돈 바다", "Megalodon Sea", "メガロドンの海"),
};

/** 바다마다 기술 */
const SEA: Record<SharkSea, Names> = {
  tide: c("세 상어가 고르게 나오는 기본 바다", "the basic sea where all three sharks appear evenly", "3種のサメが均等に現れる基本の海"),
  hammer: c("낙하 상어가 자주 나오고 기절이 2배", "drop sharks come often and stun twice as long", "落下のサメがよく現れ、気絶が2倍"),
  mako: c("돌진 상어가 자주 · 35% 빠르게 · 상어 간격 -15%", "dart sharks come often, 35% faster · -15% shark interval", "突進のサメがよく現れ35%速い · サメの間隔-15%"),
  great: c("삼키기 상어가 자주 · 크기 +20% · 피해 +15% (조금 드물게)", "gulp sharks come often · +20% size · +15% damage (a little rarer)", "丸呑みのサメがよく現れる · 大きさ+20% · ダメージ+15%（少しまれ）"),
  storm: c("상어가 문 적에게서 가까운 적에게 번개가 튐", "lightning jumps from the bitten foe to a nearby one", "サメが噛んだ敵から近くの敵へ雷が跳ぶ"),
  frost: c("바다 안의 적이 느려짐 (상어 피해 -5%)", "foes inside the sea are slowed (-5% shark damage)", "海の中の敵が鈍化（サメのダメージ-5%）"),
  ocean: c("영역 바다 +45% (상어 간격 +20%)", "+45% sea domain (+20% shark interval)", "領域の海+45%（サメの間隔+20%）"),
  frenzy: c("상어 간격 -40% (상어 피해 -30%)", "-40% shark interval (-30% shark damage)", "サメの間隔-40%（サメのダメージ-30%）"),
  whirl: c("바다 안의 적을 가운데로 끌어당김 · 영역 +10%", "drags foes inside the sea toward you · +10% domain", "海の中の敵を中央へ引き寄せる · 領域+10%"),
  mega: c("거대한 상어 (크기 +60% · 피해 +60%, 간격 +70%) · 낙하가 잘 나옴", "huge sharks (+60% size and damage, +70% interval) · drops come often", "巨大なサメ（大きさ・ダメージ+60%、間隔+70%）· 落下がよく現れる"),
};

/** 영역 바다 무기 설명: 바다 기술 */
export function sharkDesc(st: SeaStyle, lang: Lang): string {
  return SEA[st.sea][lang];
}

export const TL_PASSIVE_NAMES: Record<TlPassive & PassiveId, Names> = {
  tlFin: c("칼 지느러미", "Blade Fin", "刃のヒレ"),
  tlBlood: c("피 냄새", "Scent of Blood", "血の匂い"),
  tlFeast: c("포식", "Feast", "捕食"),
  tlChain: c("연쇄 사냥", "Chain Hunt", "連鎖狩り"),
  tlFreedom: c("해방의 물결", "Wave of Liberty", "解放の波"),
  tlDeep: c("깊은 바다", "Deep Sea", "深い海"),
  tlSchool: c("상어 떼", "Shark School", "サメの群れ"),
  tlJaws: c("큰 턱", "Great Jaws", "大きな顎"),
  tlBreach: c("솟구침", "Breach", "跳び上がり"),
  tlRip: c("쌍둥이 돌진", "Twin Dart", "双子の突進"),
};

export const TL_EFFECTS: Partial<Record<TlPassive & PassiveId, Names>> = {
  tlFin: c("꼬리 공격 범위 +{reach:up}%", "+{reach:up}% tail attack reach", "尾の攻撃範囲+{reach:up}%"),
  tlBlood: c("마무리 물기 피해 {mul}배 (더 센 적도 한 방에)", "{mul}x finishing bite damage (finishes tougher foes)", "とどめの噛みつき{mul}倍（より強い敵も一撃で）"),
  tlFeast: c("마무리 물기 흡혈 {leech}배", "{leech}x finishing bite life steal", "とどめの噛みつきの吸血{leech}倍"),
  tlChain: c("마무리 물기 거리 +{range:up}% · 곧바로 다시 씀", "+{range:up}% finishing bite range · no wait between bites", "とどめの噛みつき距離+{range:up}% · すぐまた使える"),
  tlFreedom: c("받는 피해 -{taken:down}%", "-{taken:down}% damage taken", "被ダメージ-{taken:down}%"),
  tlDeep: c("영역 바다 +{r:up}%", "+{r:up}% sea domain", "領域の海+{r:up}%"),
  tlSchool: c("상어 간격 -{every:down}%", "-{every:down}% shark interval", "サメの間隔-{every:down}%"),
  tlJaws: c("삼키기 범위 +{r:up}% · 피해 {mul}배", "Gulp +{r:up}% size · {mul}x damage", "丸呑みの範囲+{r:up}% · ダメージ{mul}倍"),
  tlBreach: c("낙하 범위 +{r:up}% · 기절 {stun}배", "Drop +{r:up}% size · {stun}x stun", "落下の範囲+{r:up}% · 気絶{stun}倍"),
  tlRip: c("돌진 상어가 반대편에서 한 마리 더 (공격력 {mul:pct}%)", "A second dart shark leaps from the other side ({mul:pct}% damage)", "突進のサメが反対側からもう1頭（{mul:pct}%）"),
};
