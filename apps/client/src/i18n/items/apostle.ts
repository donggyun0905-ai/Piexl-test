// 악의 사도 글자 (한·영·일): 무기 이름 · 공격 설명 · 전용 아이템 이름·효과 (수치는 weaponsApostle·APOSTLE_PERKS와 맞춤)
import type { PassiveId, SinKind, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type ApostleWeapon = "invertedCross" | "wrathCross" | "slothCross" | "gluttonyCross" | "envyCross" | "lustCross" | "greedCross" | "prideCross" | "satanMask" | "heresyPeter";
type ApostlePassive = "soulFeast" | "soulMagnet" | "fallenGrail" | "sinWeight" | "longCurse" | "bloodPact" | "blackMass" | "soulBurst" | "apostate" | "malice";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const APOSTLE_WEAPON_NAMES: Record<ApostleWeapon & WeaponId, Names> = {
  invertedCross: c("뒤집힌 십자가 목걸이", "Inverted Cross Pendant", "逆さ十字の首飾り"),
  wrathCross: c("분노에 빠진 베드로 십자가", "Peter's Cross of Wrath", "憤怒に堕ちたペテロ十字"),
  slothCross: c("나태에 물든 베드로 십자가", "Peter's Cross of Sloth", "怠惰に染まったペテロ十字"),
  gluttonyCross: c("탐식에 빠진 베드로 십자가", "Peter's Cross of Gluttony", "暴食に堕ちたペテロ十字"),
  envyCross: c("질투에 빠진 베드로 십자가", "Peter's Cross of Envy", "嫉妬に堕ちたペテロ十字"),
  lustCross: c("색욕에 물든 베드로 십자가", "Peter's Cross of Lust", "色欲に染まったペテロ十字"),
  greedCross: c("탐욕에 빠진 베드로 십자가", "Peter's Cross of Greed", "強欲に堕ちたペテロ十字"),
  prideCross: c("교만에 빠진 베드로 십자가", "Peter's Cross of Pride", "傲慢に堕ちたペテロ十字"),
  satanMask: c("사탄의 가면", "Mask of Satan", "サタンの仮面"),
  heresyPeter: c("역천의 베드로", "Peter the Defiant", "逆天のペテロ"),
};

const FIELD = c("십자가가 적에게 나타나고(피해 없음) 4초 장판", "A cross appears on the foe (no damage), leaving a 4s field", "十字架が敵に現れ（ダメージなし）4秒の床");
const f = (ko: string, en: string, ja: string): Names => c(`${FIELD.ko} · ${ko}`, `${FIELD.en} · ${en}`, `${FIELD.ja} · ${ja}`);

/** 무기 설명 */
export const SIN_DESC: Record<SinKind, Names> = {
  cross: c("하늘에서 커다란 뒤집힌 십자가가 떨어져 적을 짓누름", "A huge inverted cross falls from the sky and crushes foes", "空から大きな逆さ十字が落ちて敵を押し潰す"),
  wrath: f("검붉은 장판이 계속 화상 (장판 위에서는 화상 피해가 2배 빨리)", "the crimson field keeps burning foes (burn ticks twice as fast on the field)", "赤黒い床が火傷を与え続ける（床の上では火傷ダメージが2倍速く）"),
  sloth: f("하늘색 장판이 느리게 하고, 둔화가 쌓이면 깊은 잠 (공격력 400%)", "the sky-blue field slows; stacked slows put foes into a deep sleep (400% damage)", "空色の床が鈍化させ、溜まると深い眠り（攻撃力400%）"),
  gluttony: f("주황 장판이 방어력을 5%씩 깎고(최대 30%) 빠르게 부패 (공격력 12%)", "the orange field lowers defense by 5% (up to 30%) and quickly rots foes (12% damage)", "オレンジの床が防御力を5%ずつ下げ（最大30%）素早く腐敗（攻撃力12%）"),
  envy: f("연두 장판이 독 (장판 위에서는 독 피해가 2배 빨리)", "the lime field poisons foes (poison ticks twice as fast on the field)", "黄緑の床が毒（床の上では毒ダメージが2倍速く）"),
  lust: f("분홍 장판 위 적이 아주 빠르게 피해 (공격력 6%, 혼자여도), 준 피해의 10% 회복", "foes on the pink field take very rapid damage (6% damage, even alone); heal 10% of it", "ピンクの床の上の敵がとても速くダメージを受ける（攻撃力6%、1体でも）、その10%回復"),
  greed: f("황금 장판이 느리게 하고 30% 확률로 묶음 · 황금이 떨어지며 센 피해 (공격력 100%)", "the golden field slows and binds 30% of the time · falling gold deals heavy damage (100%)", "黄金の床が鈍化させ30%の確率で拘束 · 黄金が落ちて遅いが重いダメージ（攻撃力50%）"),
  pride: f("보라 장판이 아주 느리게 하고 1초마다 중력으로 끌어당겨 짓누름 (공격력 160%)", "the purple field slows heavily and every 1s pulls foes in with gravity (160% damage)", "紫の床がとても遅くし1秒ごとに重力で引き寄せて押し潰す（攻撃力160%）"),
  mask: c("근처 적(최대 5) 밑에서 검은 오라가 올라와 죽음 (최대 체력의 10% + 공격력 60%, 보스는 최대 체력의 1/4 기준) · 들고 있으면 먹은 영혼 하나마다 공격력 +0.1, 공격 속도도 같은 비율(+1%)로 오름", "A black aura rises under nearby foes (up to 5): Death (10% of max HP + 60% damage; bosses use 1/4 of max HP) · while held, each soul eaten gives +0.1 damage and the same share (+1%) of attack speed", "近くの敵（最大5）の下から黒いオーラが昇り死（最大体力の10% + 攻撃力60%、ボスは最大体力の1/4基準）· 持っていると食べた魂1つごとに攻撃力+0.1、攻撃速度も同じ割合（+1%）上がる"),
  heresy: c("하늘색 불꽃으로 근접 공격 (내 최대 체력의 10% 더) · 30% 확률로 업화", "Melee strikes with sky-blue flame (+10% of your max HP) · 30% chance of Hellfire", "空色の炎で近接攻撃（自分の最大体力の10%追加）· 30%の確率で業火"),
};

export const APOSTLE_PASSIVE_NAMES: Record<ApostlePassive & PassiveId, Names> = {
  soulFeast: c("영혼 포식", "Soul Feast", "魂の捕食"),
  soulMagnet: c("영혼 끌림", "Soul Pull", "魂の引力"),
  fallenGrail: c("타락한 성배", "Fallen Grail", "堕ちた聖杯"),
  sinWeight: c("죄의 무게", "Weight of Sin", "罪の重さ"),
  longCurse: c("긴 저주", "Lasting Curse", "長い呪い"),
  bloodPact: c("피의 계약", "Blood Pact", "血の契約"),
  blackMass: c("검은 미사", "Black Mass", "黒ミサ"),
  soulBurst: c("영혼 폭발", "Soul Burst", "魂の爆発"),
  apostate: c("배교자", "Apostate", "背教者"),
  malice: c("악의", "Malice", "悪意"),
};

export const APOSTLE_EFFECTS: Partial<Record<ApostlePassive & PassiveId, Names>> = {
  soulFeast: c("영혼 회복량 10% → {heal:pct}%", "Souls heal {heal:pct}% instead of 10%", "魂の回復量10% → {heal:pct}%"),
  soulMagnet: c("영혼을 멀리서도 줍고, 가까운 영혼이 나에게 끌려옴", "Pick up souls from afar; nearby souls drift toward you", "魂を遠くからでも拾い、近くの魂が引き寄せられる"),
  fallenGrail: c("회복약을 먹어도 피해를 받지 않고, 대신 {ticks:sec}초 동안 공격력 +{damage:up}%", "Potions no longer hurt you; instead +{damage:up}% damage for {ticks:sec}s", "回復薬を飲んでもダメージを受けず、代わりに{ticks:sec}秒間攻撃力+{damage:up}%"),
  sinWeight: c("장판·짓누르는 범위 +{area:up}%", "+{area:up}% field and crush area", "床・押し潰す範囲+{area:up}%"),
  longCurse: c("장판 지속 +{ticks:up}%", "+{ticks:up}% field duration", "床の持続+{ticks:up}%"),
  bloodPact: c("영혼을 먹으면 {ticks:sec}초 동안 공격 속도 빨라짐", "Eating a soul speeds up attacks for {ticks:sec}s", "魂を食べると{ticks:sec}秒間攻撃速度が上がる"),
  blackMass: c("적을 쓰러뜨리면 보호막 {shield} (이 아이템으로는 최대 {max})", "Defeating a foe gives a {shield} shield (up to {max} from this item)", "敵を倒すとシールド{shield}（このアイテムでは最大{max}）"),
  soulBurst: c("영혼을 먹을 때 그 자리 둘레 적에게 공격력 {mul:pct}%", "Eating a soul deals {mul:pct}% damage to foes around it", "魂を食べる時その周りの敵に攻撃力{mul:pct}%"),
  malice: c("공격력 +15% · 상태이상(화상·독·부패·죽음·업화) 피해 +{dot:up}%", "+15% damage · +{dot:up}% status damage (burn, poison, rot, death, hellfire)", "攻撃力+15% · 状態異常（火傷・毒・腐敗・死・業火）ダメージ+{dot:up}%"),
};
