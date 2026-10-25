// 렌(비르디아) 글자 (한·영·일): 맨손 이름·설명 · 전용 아이템 이름·효과 (수치는 weaponsRen·REN_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type RenPassive =
  | "renStone" | "renOak" | "renSoil" | "renRootPulse" | "renMoss" | "renAmber" | "renGuardPlus" | "renThorn" | "renWall" | "renReflect"
  | "renQuake" | "renBindLong" | "renLaunchFar" | "renPrisonDmg" | "renBigger" | "renCollapse" | "renRegrow" | "renHeavy" | "renCrushStun" | "renBurstPrison";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const REN_WEAPON_NAMES: Record<"renHands" & WeaponId, Names> = {
  renHands: c("맨손 (토목)", "Bare Hands (Earthwood)", "素手（土木）"),
};

/** 맨손 설명 (무기 설명 뒤에 붙음) */
export const REN_DESC: Names = c(
  "거대한 토목이 엉키며 차례로 타격 → 묶기 → 날려버리기 → 짓뭉개기 → 가두기 (넓고 세지만 느림) · 둘레의 수호 토목이 원거리 탄을 70% 확률로 막음 (몸으로 부딪히는 근접 공격은 못 막고 2배로 받음)",
  "Giant earthwood tangles and strikes in turn: strike → bind → launch → crush → imprison (wide and strong but slow) · guardian earthwood around you blocks ranged shots 70% of the time (body hits aren't blocked and deal double damage)",
  "巨大な土木が絡み合い、順に打撃 → 縛る → 吹き飛ばす → 押し潰す → 閉じ込める（広く強いが遅い）· 周りの守護の土木が遠距離弾を70%の確率で防ぐ（体当たりは防げず2倍のダメージを受ける）",
);

export const REN_PASSIVE_NAMES: Record<RenPassive & PassiveId, Names> = {
  renStone: c("바위 심장", "Stone Heart", "岩の心臓"),
  renOak: c("참나무 팔", "Oaken Arms", "樫の腕"),
  renSoil: c("넓은 땅", "Broad Earth", "広い大地"),
  renRootPulse: c("뿌리 맥박", "Root Pulse", "根の脈動"),
  renMoss: c("이끼 신", "Moss Shoes", "苔の靴"),
  renAmber: c("호박 구슬", "Amber Bead", "琥珀の玉"),
  renGuardPlus: c("수호 토목", "Guardian Earthwood", "守護の土木"),
  renThorn: c("가시 토목", "Thorned Earthwood", "棘の土木"),
  renWall: c("단단한 벽", "Solid Wall", "堅い壁"),
  renReflect: c("되받기", "Throwback", "跳ね返し"),
  renQuake: c("여진", "Aftershock", "余震"),
  renBindLong: c("깊은 뿌리", "Deep Roots", "深い根"),
  renLaunchFar: c("높이 날리기", "High Launch", "高く飛ばす"),
  renPrisonDmg: c("조여드는 감옥", "Tightening Prison", "締まる牢獄"),
  renBigger: c("거대 토목", "Colossal Earthwood", "巨大な土木"),
  renCollapse: c("대지 붕괴", "Earth Collapse", "大地崩壊"),
  renRegrow: c("다시 자람", "Regrowth", "再生"),
  renHeavy: c("거목", "Great Trunk", "巨木"),
  renCrushStun: c("짓눌림", "Pinned Down", "押し潰し"),
  renBurstPrison: c("터지는 감옥", "Bursting Prison", "弾ける牢獄"),
};

export const REN_EFFECTS: Partial<Record<RenPassive & PassiveId, Names>> = {
  renGuardPlus: c("수호 토목 +{guards}", "+{guards} guardian earthwood", "守護の土木+{guards}"),
  renThorn: c("수호 토목이 부딪힌 적에게 주는 피해 {mul}배", "Guardian earthwood deals ×{mul} contact damage", "守護の土木が当たった敵へのダメージ{mul}倍"),
  renWall: c("원거리 탄을 막는 확률 70% → {block:pct}%", "Ranged shot block chance 70% → {block:pct}%", "遠距離弾を防ぐ確率70% → {block:pct}%"),
  renReflect: c("막은 탄이 적에게 되돌아감", "Blocked shots fly back at enemies", "防いだ弾が敵へ跳ね返る"),
  renQuake: c("토목이 떨어진 자리에 {delay:sec}초 뒤 한 번 더 (피해 {mul:pct}%)", "The spot is struck again after {delay:sec}s ({mul:pct}% damage)", "土木が落ちた場所に{delay:sec}秒後もう一度（ダメージ{mul:pct}%）"),
  renBindLong: c("묶기 {mul}배 오래", "Bind lasts ×{mul}", "縛る時間{mul}倍"),
  renLaunchFar: c("날려버리기 {mul}배 멀리, 떨어질 때 피해", "Launch flings ×{mul} as far and deals damage on landing", "吹き飛ばしが{mul}倍遠く、落ちる時にダメージ"),
  renPrisonDmg: c("가둔 적이 갇힌 동안 0.5초마다 공격력 {per:pct}% 피해", "Imprisoned foes take {per:pct}% damage every 0.5s", "閉じ込めた敵が0.5秒ごとに攻撃力{per:pct}%のダメージ"),
  renBigger: c("토목 크기 +{r:up}%", "Earthwood size +{r:up}%", "土木の大きさ+{r:up}%"),
  renCollapse: c("다섯 차례를 다 돌면 사거리 안 모든 적에게 큰 토목", "After all five moves, a great earthwood falls on every foe in range", "五つの手順を終えると射程内の全ての敵に大きな土木"),
  renRegrow: c("탄을 막을 때마다 체력 {heal} 회복", "Heal {heal} HP whenever you block a shot", "弾を防ぐたびに体力{heal}回復"),
  renHeavy: c("보스에게 피해 +{mul:up}%", "Damage to bosses +{mul:up}%", "ボスへのダメージ+{mul:up}%"),
  renCrushStun: c("짓뭉개기에 맞은 적이 {ticks:sec}초 멈춤", "Crushed foes stop for {ticks:sec}s", "押し潰された敵が{ticks:sec}秒止まる"),
  renBurstPrison: c("최대 체력 +5 · 감옥이 풀릴 때 터짐 (공격력 {mul}배)", "Max HP +5 · prisons burst when they end ({mul}× damage)", "最大体力+5・牢獄が解ける時に弾ける（攻撃力{mul}倍）"),
};
