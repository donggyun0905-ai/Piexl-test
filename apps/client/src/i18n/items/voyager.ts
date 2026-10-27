// 운명의 여행자(히든) 글자 (한·영·일): 운명의 활 이름·설명 · 전용 아이템 이름·효과 (수치는 weaponsVoyager·VOYAGER_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type VyPassive = "vyTwinDice" | "vyLoadedDie" | "vySandglass" | "vyKeepFate" | "vyString" | "vyQuiver" | "vyLaurel" | "vySeaLegs" | "vyBlessing" | "vyHomeward";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const VY_WEAPON_NAMES: Record<"vyBow" & WeaponId, Names> = {
  vyBow: c("운명의 활", "Bow of Fate", "運命の弓"),
};

export const FATE_DESC = c(
  "누르고 있으면 모았다가 놓으면 쏨 (끝까지 모으면 저절로) · 아주 느리지만 모을수록 강한 한 발 · 모래시계가 뒤집힐 때마다 주사위로 버프·기술·능력이 바뀜",
  "Hold to draw, release to shoot (fires itself at full draw) · very slow, but the longer the draw the stronger the shot · each hourglass flip rolls dice for a new buff, skill and ability",
  "押し続けて引き絞り、離すと発射（最後まで溜めると自動）· とても遅いが溜めるほど強い一発 · 砂時計が返るたびにサイコロでバフ・技・能力が変わる",
);

export const VY_PASSIVE_NAMES: Record<VyPassive & PassiveId, Names> = {
  vyTwinDice: c("두 개의 주사위", "Twin Dice", "二つのサイコロ"),
  vyLoadedDie: c("손때 묻은 주사위", "Worn Lucky Die", "使い込んだサイコロ"),
  vySandglass: c("빠른 모래", "Quick Sand", "速い砂"),
  vyKeepFate: c("운명 붙잡기", "Hold Fast to Fate", "運命をつかむ"),
  vyString: c("질긴 시위", "Tough Bowstring", "丈夫な弦"),
  vyQuiver: c("화살통", "Quiver", "矢筒"),
  vyLaurel: c("월계관", "Laurel Wreath", "月桂冠"),
  vySeaLegs: c("뱃사람의 걸음", "Sea Legs", "船乗りの足取り"),
  vyBlessing: c("여섯 눈의 축복", "Blessing of Sixes", "六の目の祝福"),
  vyHomeward: c("귀향의 별", "Homeward Star", "帰郷の星"),
};

export const VY_EFFECTS: Partial<Record<VyPassive & PassiveId, Names>> = {
  vyTwinDice: c("주사위를 두 개 던져 36칸 중 정확한 칸 · 두 눈의 합만큼 한 발이 셈", "Roll two dice for an exact cell of 36 · the shot grows with the sum", "サイコロ2つで36マスの正確なマス · 二つの目の合計だけ一発が強くなる"),
  vyLoadedDie: c("주사위에 1이 나오지 않음", "Dice never roll a 1", "サイコロで1が出ない"),
  vySandglass: c("모래시계가 {mul:up}% 빨리 참", "The hourglass fills {mul:up}% faster", "砂時計が{mul:up}%早く溜まる"),
  vyKeepFate: c("운명이 바뀌어도 바로 전 능력이 같이 남음", "The previous ability stays when fate changes", "運命が変わっても直前の能力が残る"),
  vyString: c("모으는 시간 -{mul:down}%", "Draw time -{mul:down}%", "溜め時間-{mul:down}%"),
  vyQuiver: c("끝까지 모은 한 발이 하나 더 나감", "A full draw fires one extra arrow", "最後まで溜めた一発がもう一本出る"),
  vySeaLegs: c("이동 속도 +10% · 모으는 동안에도 느려지지 않음", "+10% move speed · no slowdown while drawing", "移動速度+10% · 溜め中も遅くならない"),
  vyBlessing: c("같은 눈(주사위 하나면 6)이 나오면 버프가 {mul}배", "Doubles (6 with one die) make the buff ×{mul}", "ゾロ目（サイコロ1つなら6）でバフが{mul}倍"),
  vyHomeward: c("모래시계가 뒤집힐 때마다 체력 {heal:pct}% 회복 · 보호막 {shield}", "Each hourglass flip heals {heal:pct}% HP and gives a {shield} shield", "砂時計が返るたびに体力{heal:pct}%回復 · シールド{shield}"),
};
