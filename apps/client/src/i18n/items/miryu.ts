// 탈라시아 미류 글자 (한·영·일): 대태도 무기 10 이름·설명 · 전용 아이템 10 이름·효과 (수치는 weaponsMiryu·MIRYU_PERKS와 맞춤)
import type { MiryuKind, MiryuStyle, PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

type MrWeapon = "mrSeiran" | "mrMoon" | "mrTorrent" | "mrVortex" | "mrMirror" | "mrWillow" | "mrCrest" | "mrFrost" | "mrAbyss" | "mrFormless";
type MrPassive = "mrRipple" | "mrSurf" | "mrCourse" | "mrParry" | "mrReturn" | "mrHorn" | "mrCascade" | "mrScale" | "mrBreath" | "mrSky";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const MR_WEAPON_NAMES: Record<MrWeapon & WeaponId, Names> = {
  mrSeiran: c("대태도 청람", "Odachi Seiran", "大太刀・青嵐"),
  mrMoon: c("대태도 수월", "Odachi Suigetsu", "大太刀・水月"),
  mrTorrent: c("대태도 격류", "Odachi Torrent", "大太刀・激流"),
  mrVortex: c("대태도 와류", "Odachi Vortex", "大太刀・渦流"),
  mrMirror: c("대태도 명경", "Odachi Clear Mirror", "大太刀・明鏡"),
  mrWillow: c("대태도 유엽", "Odachi Willow Leaf", "大太刀・柳葉"),
  mrCrest: c("대태도 물마루", "Odachi Wave Crest", "大太刀・波頭"),
  mrFrost: c("대태도 빙류", "Odachi Ice Stream", "大太刀・氷流"),
  mrAbyss: c("대태도 심연", "Odachi Abyss", "大太刀・深淵"),
  mrFormless: c("대태도 무형", "Odachi Formless", "大太刀・無形"),
};

/** 대태도마다 특징 */
const KIND: Record<MiryuKind, Names> = {
  seiran: c("고른 성능의 기본 대태도", "the basic, well-rounded odachi", "バランスのよい基本の大太刀"),
  moon: c("물길이 1.6배 오래 남고 30% 넓음", "currents last 1.6x longer and are 30% wider", "水路が1.6倍長く残り、30%広い"),
  torrent: c("빠르게 벰 · 물길이 1.5배 세게 실어 나르고 두 배 자주 벰", "fast cuts · currents carry 1.5x harder and cut twice as often", "素早く斬る · 水路が1.5倍強く運び、2倍の頻度で斬る"),
  vortex: c("셋째 타가 한 바퀴 회오리 베기 · 둥근 물길이 적을 안으로 빨아들임", "the 3rd cut becomes a full whirl · its ring current sucks foes inward", "3撃目が一回転の渦斬り · 輪の水路が敵を内へ吸い込む"),
  mirror: c("흘리기 시간 1.8배 · 물방울 10개까지 · 되돌린 물칼날 1.4배, 적을 쫓아감", "1.8x parry window · holds up to 10 drops · returned water blades deal 1.4x and home in", "受け流し時間1.8倍 · 水滴10個まで · 返す水刃1.4倍、敵を追う"),
  willow: c("휘는 칼날이 1.5배 멀리 · 적 셋을 이어 벰", "the bending edge reaches 1.5x farther and chains through 3 foes", "しなる刃が1.5倍遠く · 敵3体を続けて斬る"),
  crest: c("해룡 일섬이 1.6배 길게 뻗음", "the Dragon Flash reaches 1.6x farther", "海竜一閃が1.6倍長く伸びる"),
  frost: c("물길에 닿은 적이 느려지고, 물길이 사라질 때 얼음으로 깨져 벰", "currents slow foes and shatter into ice when they fade", "水路に触れた敵が遅くなり、水路が消える時に氷となって砕け斬る"),
  abyss: c("느리지만 무겁고 15% 길게 벰 · 해류 게이지 1.4배", "slow but heavy, cuts 15% farther · 1.4x Current gauge", "遅いが重く15%長く斬る · 海流ゲージ1.4倍"),
  formless: c("벨 때마다 방금 걸어온 길도 물길이 됨", "every cut also turns the path you just walked into a current", "斬るたびに今歩いてきた道も水路になる"),
};

/** 대태도 무기 설명: 종류 특징 */
export function flowDesc(st: MiryuStyle, lang: Lang): string {
  return KIND[st.miryu][lang];
}

export const MR_PASSIVE_NAMES: Record<MrPassive & PassiveId, Names> = {
  mrRipple: c("잔물결", "Ripples", "さざ波"),
  mrSurf: c("물길 타기", "Current Riding", "水路乗り"),
  mrCourse: c("물줄기 걸음", "Stream Step", "水筋の歩み"),
  mrParry: c("흘려 넘기기", "Flowing Parry", "受け流し"),
  mrReturn: c("회류", "Returning Current", "回流"),
  mrHorn: c("해룡의 뿔", "Sea Dragon Horn", "海竜の角"),
  mrCascade: c("폭포", "Cascade", "滝"),
  mrScale: c("해룡 비늘", "Sea Dragon Scale", "海竜の鱗"),
  mrBreath: c("용의 숨결", "Dragon's Breath", "竜の息吹"),
  mrSky: c("천류", "Heavenly Current", "天流"),
};

export const MR_EFFECTS: Partial<Record<MrPassive & PassiveId, Names>> = {
  mrRipple: c("물길이 {life}배 오래 남고 {more}개 더 남음", "Currents last {life}x longer · +{more} max currents", "水路が{life}倍長く残り、+{more}本多く残る"),
  mrSurf: c("내 물길 위에서 이동 {move}배 · 공격 속도 {speed}배", "On your currents: {move}x move · {speed}x attack speed", "自分の水路の上で移動{move}倍 · 攻撃速度{speed}倍"),
  mrCourse: c("대시한 길이 물길이 됨 · 대시로 탄을 흘리는 거리 {catch}배", "Your dash path becomes a current · {catch}x dash parry radius", "ダッシュした道が水路になる · ダッシュで弾を受け流す距離{catch}倍"),
  mrParry: c("탄을 흘리는 거리 {reach}배 · 흘릴 때마다 최대 체력의 {heal:pct}% 회복", "{reach}x parry reach · each parried shot heals {heal:pct}% max HP", "弾を受け流す距離{reach}倍 · 受け流すたびに最大体力の{heal:pct}%回復"),
  mrReturn: c("탄 하나에 물방울 {per}개 · 되돌린 물칼날이 적을 쫓아감", "{per} drops per parried shot · returned water blades home in", "弾1発につき水滴{per}個 · 返す水刃が敵を追う"),
  mrHorn: c("휘는 칼날 +{more} · 피해 {mul}배", "+{more} bending edge · {mul}x damage", "しなる刃+{more} · ダメージ{mul}倍"),
  mrCascade: c("물길이 사라질 때 무너져 내리며 벰 (공격력 {mul:pct}%)", "Fading currents crash down and cut ({mul:pct}% ATK)", "水路が消える時に崩れ落ちて斬る（攻撃力{mul:pct}%）"),
  mrScale: c("해류 게이지가 {at:pct}% 넘게 차 있으면 받는 피해 -{taken:down}%", "-{taken:down}% damage taken while the Current gauge is over {at:pct}%", "海流ゲージが{at:pct}%以上で被ダメージ-{taken:down}%"),
  mrBreath: c("해류 게이지가 {gain}배 빨리 참", "The Current gauge fills {gain}x faster", "海流ゲージが{gain}倍速くたまる"),
  mrSky: c("해룡이 {size}배 크고 {mul}배 세며 폭포 {fall}배 넓음", "The sea dragon is {size}x bigger, deals {mul}x and its waterfall is {fall}x wider", "海竜が{size}倍大きく{mul}倍強く、滝が{fall}倍広い"),
};
