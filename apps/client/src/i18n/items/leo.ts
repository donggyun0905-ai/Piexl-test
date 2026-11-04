// 아스칼론 레오 글자 (한·영·일): 뇌전 발톱 이름·설명 · 전용 아이템 이름·효과 (수치는 weaponsLeo.LEO·LEO_PERKS와 맞춤)
import { LEO, type PassiveId, type WeaponId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

type LePassive = "leMane" | "leSky" | "leRoar" | "lePounce" | "leChain" | "leStorm" | "lePride" | "leFang" | "leArmor" | "leKing";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const LE_WEAPON_NAMES: Record<"leClaw" & WeaponId, Names> = {
  leClaw: c("뇌전 발톱", "Thunder Claws", "雷電の爪"),
};

export const LE_PASSIVE_NAMES: Record<LePassive & PassiveId, Names> = {
  leMane: c("번개 갈기", "Lightning Mane", "稲妻のたてがみ"),
  leSky: c("천뢰 보석", "Sky-Thunder Gem", "天雷の宝石"),
  leRoar: c("우레 포효", "Thunderous Roar", "雷鳴の咆哮"),
  lePounce: c("뇌광 도약", "Lightning Pounce", "雷光の跳躍"),
  leChain: c("연쇄 뇌전", "Chain Thunder", "連鎖雷電"),
  leStorm: c("뇌운", "Thundercloud", "雷雲"),
  lePride: c("사자의 긍지", "Lion's Pride", "獅子の誇り"),
  leFang: c("번개 송곳니", "Lightning Fangs", "稲妻の牙"),
  leArmor: c("황금 갑주", "Golden Barding", "黄金の鎧"),
  leKing: c("백수의 왕", "King of Beasts", "百獣の王"),
};

export const LE_EFFECTS: Partial<Record<LePassive & PassiveId, Names>> = {
  leMane: c("몸 둘레 적에게 {gap:sec}초마다 정전기 (공격력 {mul:pct}%)", "Static jolts nearby foes every {gap:sec}s ({mul:pct}% attack)", "周りの敵に{gap:sec}秒ごとに静電気（攻撃力{mul:pct}%）"),
  leSky: c("보석 낙뢰 간격 -{gap:down}% · 한 번에 {n}갈래", "Gem lightning {gap:down}% more often · {n} bolts at once", "宝石の落雷の間隔-{gap:down}% · 一度に{n}本"),
  leRoar: c("사자후 기절 {stun}배 · 방 안 적 탄을 모두 지움", "Lion's Roar stuns {stun}x longer · clears all enemy shots", "獅子吼の気絶{stun}倍 · 部屋の敵弾をすべて消す"),
  lePounce: c("대시하면 앞쪽 적에게 뛰어들어 내려침 (공격력 {mul:pct}%, 기절)", "Dashing pounces on a foe ahead and smashes down ({mul:pct}% attack, stun)", "ダッシュで前方の敵に飛びかかり叩きつける（攻撃力{mul:pct}%、気絶）"),
  leChain: c("발톱에 맞은 적에서 번개가 가까운 적 {n}에게 튐 (공격력 {mul:pct}%)", "Claw hits arc to {n} nearby foes ({mul:pct}% attack)", "爪が当たった敵から稲妻が近くの敵{n}体へ（攻撃力{mul:pct}%）"),
  leStorm: c("{gap:sec}초마다 방 어딘가의 적에게 낙뢰 (공격력 {mul:pct}%)", "Every {gap:sec}s lightning strikes a foe somewhere in the room ({mul:pct}% attack)", "{gap:sec}秒ごとに部屋のどこかの敵に落雷（攻撃力{mul:pct}%）"),
  lePride: c("둘레 적 하나마다 피해 +{per:pct}% (최대 +{max:pct}%)", "+{per:pct}% damage per nearby foe (max +{max:pct}%)", "周りの敵1体ごとにダメージ+{per:pct}%（最大+{max:pct}%）"),
  leFang: c("번개 물기가 {every}번째 공격마다 · 물기 피해 +{mul:pct}%", "Lightning Bite every {every} attacks · +{mul:pct}% bite damage", "雷の噛みつきが{every}回目ごと · 噛みつきダメージ+{mul:pct}%"),
  leArmor: c("받는 피해 -{taken:down}% · 맞으면 둘레에 방전 (공격력 {mul:pct}%)", "-{taken:down}% damage taken · getting hit discharges around you ({mul:pct}% attack)", "被ダメージ-{taken:down}% · 被弾すると周りに放電（攻撃力{mul:pct}%）"),
  leKing: c("뇌인 최대 {marks}겹 · 사자후에 필요한 전하 -{volt:down}%", "Thunder Marks stack up to {marks} · Lion's Roar needs {volt:down}% less charge", "雷印の最大{marks}重 · 獅子吼に必要な電荷-{volt:down}%"),
};

const pct = (v: number) => Math.round(v * 100);

/** 뇌전 발톱 설명 (수치는 LEO에서) */
export function lionDesc(lang: Lang): string {
  const L = LEO;
  const sec = (t: number) => Math.round((t / 60) * 10) / 10;
  return {
    ko: `앞쪽을 왼발·오른발 번갈아 할큄 · ${L.biteEvery}번째마다 번개 물기(${pct(L.biteMul)}%, 기절) · 맞힌 적에 뇌인(최대 ${L.markMax}겹, 겹마다 발톱 피해 +${pct(L.markMul)}%) · 맞힐 때마다 전하가 차고 가득하면 사자후: 방 안 모든 적에게 낙뢰(${pct(L.roarMul)}% + 뇌인 겹마다 ${pct(L.roarPerMark)}%) · 머리의 보석이 ${sec(L.gemEvery)}초마다 가장 먼 적에게 낙뢰(${pct(L.gemMul)}%)`,
    en: `Alternating left and right claw swipes ahead · every ${L.biteEvery}rd attack a Lightning Bite (${pct(L.biteMul)}%, stun) · hits leave Thunder Marks (up to ${L.markMax}, +${pct(L.markMul)}% claw damage each) · hits build charge; when full, Lion's Roar strikes every foe in the room with lightning (${pct(L.roarMul)}% + ${pct(L.roarPerMark)}% per mark) · the gem on his brow strikes the farthest foe every ${sec(L.gemEvery)}s (${pct(L.gemMul)}%)`,
    ja: `前方を左右の爪で交互に引っかく · ${L.biteEvery}回目ごとに雷の噛みつき（${pct(L.biteMul)}%、気絶）· 当てた敵に雷印（最大${L.markMax}重、重ねるごとに爪ダメージ+${pct(L.markMul)}%）· 当てるたびに電荷が溜まり、満タンで獅子吼：部屋の全ての敵に落雷（${pct(L.roarMul)}%＋雷印1重ごとに${pct(L.roarPerMark)}%）· 額の宝石が${sec(L.gemEvery)}秒ごとに一番遠い敵に落雷（${pct(L.gemMul)}%）`,
  }[lang];
}
