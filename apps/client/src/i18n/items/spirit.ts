// 정령사(비르디아) 글자 (한·영·일): 대정령 이름·설명 · 작은 정령 이름 · 전용 아이템 이름·효과 (수치는 weaponsSpirit·SPIRIT_PERKS와 맞춤)
import type { GreatSpirit, PassiveId, SmallSpirit, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type SpiritWeapon = "titanCoreSpirit" | "ironHide" | "chronoSpire" | "nightWeaver" | "umbra" | "venomHide" | "idraSpirit" | "briarHeart" | "sylvanGuard" | "abyssRuin";
type SpiritPassive = "spBond" | "spLonger" | "spFury" | "spAwaken" | "spGreatPower" | "spMissile" | "spFarewell" | "spHarmony" | "spRibbon" | "spShield";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const SPIRIT_WEAPON_NAMES: Record<SpiritWeapon & WeaponId, Names> = {
  titanCoreSpirit: c("대정령 티탄코어", "Great Spirit Titancore", "大精霊タイタンコア"),
  ironHide: c("대정령 아이언하이드", "Great Spirit Ironhide", "大精霊アイアンハイド"),
  chronoSpire: c("대정령 크로노스파이어", "Great Spirit Chronospire", "大精霊クロノスパイア"),
  nightWeaver: c("대정령 나이트위버", "Great Spirit Nightweaver", "大精霊ナイトウィーバー"),
  umbra: c("대정령 엄브라", "Great Spirit Umbra", "大精霊アンブラ"),
  venomHide: c("대정령 베놈하이드", "Great Spirit Venomhide", "大精霊ベノムハイド"),
  idraSpirit: c("대정령 이드라", "Great Spirit Idra", "大精霊イドラ"),
  briarHeart: c("대정령 브라이어하트", "Great Spirit Briarheart", "大精霊ブライアハート"),
  sylvanGuard: c("대정령 실반가드", "Great Spirit Sylvanguard", "大精霊シルヴァンガード"),
  abyssRuin: c("대정령 아비스루인", "Great Spirit Abyssruin", "大精霊アビスルイン"),
};

/** 대정령 설명 (무기 설명 뒤에 붙음) · 본인은 매직 미사일만 */
export const GREAT_DESC: Record<GreatSpirit, Names> = {
  titanCore: c("가까운 적 머리 위에 거대한 돌주먹이 나타나 내리찍어 기절", "A giant stone fist appears above the nearest foe and slams down, stunning", "近くの敵の頭上に巨大な岩の拳が現れ、叩きつけて気絶"),
  ironHide: c("강철 짐승이 곁의 적을 밀쳐 냄 · 받는 피해 -25%", "An iron beast knocks away nearby foes · -25% damage taken", "鋼の獣がそばの敵を押しのける・被ダメージ-25%"),
  chronoSpire: c("시간의 탑이 둘레 적을 느리게 · 작은 정령이 30% 빨라짐", "A spire of time slows foes around · small spirits act 30% faster", "時の塔が周りの敵を遅く・小さな精霊が30%速くなる"),
  nightWeaver: c("밤의 실로 가까운 적 넷을 묶음", "Night threads bind the four nearest foes", "夜の糸で近くの敵四体を縛る"),
  umbra: c("가장 강한 적 쪽으로 굵은 그림자 레이저 (줄 위의 적 모두에게 큰 피해)", "A thick shadow laser toward the strongest foe (heavy damage to all in its line)", "一番強い敵の方へ太い影のレーザー（線上の敵すべてに大ダメージ）"),
  venomHide: c("앞쪽에 연막탄처럼 독가스 넷을 부채꼴로 뿌림 (안의 적이 계속 중독)", "Scatters four clouds of poison gas ahead in a fan like smoke bombs (foes inside keep getting poisoned)", "前方に煙幕弾のように毒ガス四つを扇状にまく（中の敵は毒が続く）"),
  idra: c("세계수의 여신이 된 이드라: 체력 5 회복 + 둘레에 꽃이 만개", "Idra, grown into the World Tree goddess: heals 5 HP and blooms around you", "世界樹の女神となったイドラ：体力5回復＋周りに花が満開"),
  briarHeart: c("한 줄로 가시덩굴을 뻗어 묶음", "Stretches a line of thorn vines, binding foes", "一列に茨を伸ばして縛る"),
  sylvanGuard: c("주문을 외며 힘을 모은 뒤 거대한 마법 화살이 적들을 꿰뚫어 큰 피해", "Chants and gathers power, then a giant magic arrow pierces through foes for heavy damage", "呪文を唱えて力を溜め、巨大な魔法の矢が敵を貫いて大ダメージ"),
  abyssRuin: c("무작위 적 셋 머리 위에 알 수 없는 입방체가 나타나 내리찍고 터짐", "Unknowable cubes appear above three random foes, slam down and explode", "ランダムな敵三体の頭上に謎の立方体が現れ、叩きつけて爆発"),
};

export const SMALL_SPIRIT_NAMES: Record<SmallSpirit, Names> = {
  steel: c("강철", "Steel", "鋼鉄"),
  gravity: c("중력", "Gravity", "重力"),
  furnace: c("용광로", "Furnace", "溶鉱炉"),
  vein: c("광맥", "Ore Vein", "鉱脈"),
  shadow: c("그림자", "Shadow", "影"),
  steelThread: c("강철실", "Steel Thread", "鋼糸"),
  miasma: c("독기", "Miasma", "毒気"),
  void: c("허공", "Void", "虚空"),
  worldTree: c("세계수", "World Tree", "世界樹"),
  thornVine: c("가시덩굴", "Thornvine", "茨"),
  spore: c("포자", "Spore", "胞子"),
  earth: c("대지", "Earth", "大地"),
};

export const SPIRIT_PASSIVE_NAMES: Record<SpiritPassive & PassiveId, Names> = {
  spBond: c("계약", "Pact", "契約"),
  spLonger: c("오래 머묾", "Lingering Spirits", "長居"),
  spFury: c("정령의 분노", "Spirit Fury", "精霊の怒り"),
  spAwaken: c("대정령 각성", "Great Awakening", "大精霊覚醒"),
  spGreatPower: c("대정령의 힘", "Great Spirit's Might", "大精霊の力"),
  spMissile: c("쌍 미사일", "Twin Missiles", "ダブルミサイル"),
  spFarewell: c("작별 선물", "Farewell Gift", "別れの贈り物"),
  spHarmony: c("조화", "Harmony", "調和"),
  spRibbon: c("교복 리본", "Uniform Ribbon", "制服のリボン"),
  spShield: c("정령의 가호", "Spirit's Blessing", "精霊の加護"),
};

export const SPIRIT_EFFECTS: Partial<Record<SpiritPassive & PassiveId, Names>> = {
  spBond: c("곁의 작은 정령 +{extra}", "+{extra} small spirit", "そばの小さな精霊+{extra}"),
  spLonger: c("작은 정령이 바뀌는 주기 30초 → {ticks:sec}초", "Small spirits change every {ticks:sec}s instead of 30s", "小さな精霊が入れ替わる間隔30秒 → {ticks:sec}秒"),
  spFury: c("작은 정령 피해 +{mul:up}%", "Small spirit damage +{mul:up}%", "小さな精霊のダメージ+{mul:up}%"),
  spAwaken: c("대정령이 {every:down}% 더 자주 기술을 씀", "Great spirit acts {every:down}% more often", "大精霊が{every:down}%多く技を使う"),
  spGreatPower: c("대정령 피해 +{mul:up}%", "Great spirit damage +{mul:up}%", "大精霊のダメージ+{mul:up}%"),
  spMissile: c("매직 미사일이 두 발", "Magic missiles fire in pairs", "マジックミサイルが二発"),
  spFarewell: c("떠나는 작은 정령이 그 자리에서 터짐 (공격력 {mul}배)", "A departing small spirit bursts where it was ({mul}× damage)", "去る小さな精霊がその場で弾ける（攻撃力{mul}倍）"),
  spHarmony: c("곁의 작은 정령 종류마다 정령 피해 +{per:pct}%", "+{per:pct}% spirit damage per distinct small spirit beside you", "そばの小さな精霊の種類ごとに精霊ダメージ+{per:pct}%"),
  spShield: c("새 정령이 올 때마다 보호막 {shield} (최대 체력의 {max:pct}%까지)", "Gain a {shield} shield whenever a new spirit arrives (up to {max:pct}% max HP)", "新しい精霊が来るたびにシールド{shield}（最大体力の{max:pct}%まで）"),
};
