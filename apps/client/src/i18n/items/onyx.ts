// 아스칼론 오닉스 글자 (한·영·일): 칠보 광륜 이름·설명 · 전용 아이템 이름·효과 (수치는 weaponsOnyx.ONYX·ONYX_GEMS·ONYX_PERKS와 맞춤)
import { ONYX, ONYX_GEMS, type PassiveId, type WeaponId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

type OxPassive = "oxPolish" | "oxCrown" | "oxWings" | "oxLanding" | "oxResonance" | "oxBulwark" | "oxPrism" | "oxShard" | "oxQuick" | "oxTrail";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const OX_WEAPON_NAMES: Record<"oxHalo" & WeaponId, Names> = {
  oxHalo: c("칠보 광륜", "Seven-Gem Halo", "七宝の光輪"),
};

export const OX_PASSIVE_NAMES: Record<OxPassive & PassiveId, Names> = {
  oxPolish: c("연마된 보석", "Polished Gems", "磨かれた宝石"),
  oxCrown: c("보석 왕관", "Gem Crown", "宝石の冠"),
  oxWings: c("비상의 날개", "Soaring Wings", "飛翔の翼"),
  oxLanding: c("낙하 충격", "Meteor Landing", "落下の衝撃"),
  oxResonance: c("공명석", "Resonance Stone", "共鳴石"),
  oxBulwark: c("광물 갑피", "Mineral Hide", "鉱物の甲殻"),
  oxPrism: c("프리즘 광륜", "Prism Halo", "プリズムの光輪"),
  oxShard: c("수정 반격", "Crystal Riposte", "水晶の反撃"),
  oxQuick: c("빠른 집광", "Quick Focus", "素早い集光"),
  oxTrail: c("보석 꼬리", "Gem Trail", "宝石の尾"),
};

export const OX_EFFECTS: Partial<Record<OxPassive & PassiveId, Names>> = {
  oxPolish: c("모든 보석의 반응 확률 +{add:pct}%p", "Every gem's trigger chance +{add:pct}%p", "すべての宝石の反応確率+{add:pct}%p"),
  oxCrown: c("보석 공격 피해 +{mul:up}%", "+{mul:up}% gem damage", "宝石攻撃のダメージ+{mul:up}%"),
  oxWings: c("비행 속도 +{speed:up}% · 비행 중 보석 반응 간격 -{pulse:down}%", "+{speed:up}% flight speed · gems react {pulse:down}% more often in flight", "飛行速度+{speed:up}% · 飛行中の宝石の反応間隔-{pulse:down}%"),
  oxLanding: c("비행을 끄고 내려앉으면 둘레에 충격파 (공격력 {mul:pct}%, 기절)", "Landing from flight sends out a shockwave ({mul:pct}% attack, stun)", "飛行を切って着地すると周りに衝撃波（攻撃力{mul:pct}%、気絶）"),
  oxResonance: c("보석 {need}개만 함께 반응해도 칠보 공명", "Seven-Gem Resonance triggers with just {need} gems", "宝石{need}個が同時に反応するだけで七宝共鳴"),
  oxBulwark: c("땅에 서 있을 때 받는 피해 -{taken:down}%", "-{taken:down}% damage taken while grounded", "地上にいる間の被ダメージ-{taken:down}%"),
  oxPrism: c("광륜 공격마다 보석 하나가 같이 반응", "Each Halo attack also triggers one gem", "光輪の攻撃ごとに宝石がひとつ一緒に反応"),
  oxShard: c("맞으면 보석들이 {chance:pct}% 확률로 반응 ({gap:sec}초마다)", "When hit, gems react at {chance:pct}% of their chance (every {gap:sec}s)", "被弾すると宝石が{chance:pct}%の確率で反応（{gap:sec}秒ごと）"),
  oxQuick: c("광륜을 쏠 때 묶이는 시간 -{cast:down}%", "-{cast:down}% time rooted while casting the Halo", "光輪を撃つ時の硬直-{cast:down}%"),
  oxTrail: c("날아가는 동안 몸 둘레 적에게 {gap:sec}초마다 보석 가루 (공격력 {mul:pct}%)", "In flight, gem dust hits nearby foes every {gap:sec}s ({mul:pct}% attack)", "飛行中、周りの敵に{gap:sec}秒ごとに宝石の粉（攻撃力{mul:pct}%）"),
};

const pct = (v: number) => Math.round(v * 100);

/** 칠보 광륜 설명 (수치는 ONYX·ONYX_GEMS에서) */
export function gemDesc(lang: Lang): string {
  const O = ONYX;
  const g = ONYX_GEMS;
  const sec = (t: number) => Math.round((t / 60) * 10) / 10;
  const ch = [g.ruby, g.amber, g.topaz, g.jade, g.sapphire, g.aqua, g.amethyst].map((x) => pct(x.chance));
  return {
    ko: `가운데 자수정에서 방 안 모든 적에게 빛줄기 (쏘는 동안 몸이 묶임) · 대시: 한 번 누르면 하늘을 나는 비행(이동 ${pct(O.flySpeed)}%, 손을 떼도 계속 날아감, 무적 아님) · 다시 누르면 내려앉음 · 날아오를 때·내려앉을 때·비행 중 ${sec(O.pulse)}초마다 보석 7개가 저마다 확률로 반응: 홍옥 불기둥 ${ch[0]}% · 호박 운석 ${ch[1]}% · 황옥 연쇄 번개 ${ch[2]}% · 비취 덩굴 가시(회복) ${ch[3]}% · 청옥 방 전체 서리 ${ch[4]}% · 남옥 꿰뚫는 빛줄기 ${ch[5]}% · 자수정 공허 붕괴 ${ch[6]}% · 일곱 개가 한 번에 반응하면 칠보 공명(방 전체 ${pct(O.resonMul)}% + 기절) · 맞아도 무적이 거의 없음`,
    en: `The amethyst at his core beams every foe in the room (rooted while casting) · Dash: press once to take flight (${pct(O.flySpeed)}% speed, keeps flying even when you let go, not invincible) · press again to land · on takeoff, on landing and every ${sec(O.pulse)}s in flight, each of the 7 gems rolls its own chance: Ruby fire pillar ${ch[0]}% · Amber meteors ${ch[1]}% · Topaz chain lightning ${ch[2]}% · Jade thorn vines (heal) ${ch[3]}% · Sapphire room-wide frost ${ch[4]}% · Aquamarine piercing beam ${ch[5]}% · Amethyst void collapse ${ch[6]}% · all seven at once trigger Seven-Gem Resonance (${pct(O.resonMul)}% to the whole room + stun) · almost no invincibility after being hit`,
    ja: `中心のアメジストから部屋の全ての敵に光線（撃つ間は動けない）· ダッシュ：一度押すと空を飛ぶ飛行（移動${pct(O.flySpeed)}%、手を離しても飛び続ける、無敵ではない）· もう一度押すと着地 · 飛び立つ時・着地する時・飛行中${sec(O.pulse)}秒ごとに7つの宝石がそれぞれの確率で反応：ルビーの火柱${ch[0]}% · 琥珀の隕石${ch[1]}% · トパーズの連鎖雷${ch[2]}% · 翡翠の茨（回復）${ch[3]}% · サファイアの部屋全体の霜${ch[4]}% · アクアマリンの貫く光線${ch[5]}% · アメジストの虚無崩壊${ch[6]}% · 7つ同時に反応すると七宝共鳴（部屋全体${pct(O.resonMul)}%＋気絶）· 被弾後の無敵がほとんどない`,
  }[lang];
}
