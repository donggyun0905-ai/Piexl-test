// 성국 가브리엘 글자 (한·영·일): 불멸의 성벽 방패 & 단조 해머 무기 1 이름 · 전용 아이템 20 이름·효과 (수치는 weaponsGabriel·GABRIEL_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type GbPassive =
  | "gbPlate" | "gbVow" | "gbThorns" | "gbAegis" | "gbIron" | "gbForge" | "gbQuake" | "gbStun" | "gbAfter" | "gbTitan"
  | "gbGrav" | "gbPull" | "gbWeight" | "gbCrush" | "gbOrbit" | "gbBash" | "gbBulwark" | "gbLight" | "gbImmortal" | "gbFaith";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const GB_WEAPON_NAMES: Record<"gbHammer" & WeaponId, Names> = {
  gbHammer: c("불멸의 성벽 방패 & 단조 해머", "Immortal Bastion Shield & Forged Hammer", "不滅の城壁の盾＆鍛造ハンマー"),
};

export const GB_PASSIVE_NAMES: Record<GbPassive & PassiveId, Names> = {
  gbPlate: c("강철 판갑", "Steel Plate", "鋼の板金鎧"),
  gbVow: c("수호자의 맹세", "Guardian's Vow", "守護者の誓い"),
  gbThorns: c("가시 방패", "Thorned Shield", "棘の盾"),
  gbAegis: c("성채의 위엄", "Majesty of the Citadel", "城砦の威厳"),
  gbIron: c("강철 의지", "Iron Will", "鋼の意志"),
  gbForge: c("단조 해머", "Forged Hammerhead", "鍛造の槌頭"),
  gbQuake: c("대지 진동", "Earthquake", "大地の震動"),
  gbStun: c("묵직한 일격", "Heavy Blow", "重い一撃"),
  gbAfter: c("여진", "Aftershock", "余震"),
  gbTitan: c("거인의 손", "Giant's Grip", "巨人の手"),
  gbGrav: c("중력 핵", "Gravity Core", "重力核"),
  gbPull: c("사건의 지평선", "Event Horizon", "事象の地平線"),
  gbWeight: c("무게", "Weight", "重み"),
  gbCrush: c("압괴", "Crush", "圧壊"),
  gbOrbit: c("이중 낙하", "Double Drop", "二重落下"),
  gbBash: c("방패 강타", "Shield Slam", "盾強打"),
  gbBulwark: c("성벽 확장", "Widened Rampart", "城壁拡張"),
  gbLight: c("빛의 망치", "Hammer of Light", "光のハンマー"),
  gbImmortal: c("불멸", "Immortality", "不滅"),
  gbFaith: c("굳은 신앙", "Steadfast Faith", "固い信仰"),
};

export const GB_EFFECTS: Partial<Record<GbPassive & PassiveId, Names>> = {
  gbPlate: c("철옹: 받는 피해 {halve:pct}% (원래 50%)", "Ironclad: take {halve:pct}% damage (was 50%)", "鉄壁：受けるダメージ{halve:pct}%（元50%）"),
  gbVow: c("방에 들어갈 때 최대 체력 {shield:pct}% 보호막", "Gain a shield of {shield:pct}% max HP on entering a room", "部屋に入る時、最大体力{shield:pct}%のシールド"),
  gbThorns: c("맞으면 둘레 적에게 최대 체력 {hpMul:pct}% 피해 · 압박", "When hit, nearby foes take {hpMul:pct}% of your max HP and are Pressed", "被弾すると周りの敵に最大体力{hpMul:pct}%のダメージ · 圧迫"),
  gbAegis: c("보호막이 있는 동안 주는 피해 {mul}배", "Deal {mul}x damage while shielded", "シールドがある間、与えるダメージ{mul}倍"),
  gbIron: c("체력이 {below:pct}% 이하면 받는 피해 {taken}배 더", "At or below {below:pct}% HP, take {taken}x damage on top", "体力{below:pct}%以下で受けるダメージさらに{taken}倍"),
  gbForge: c("기본 망치 피해 {mul}배", "Basic hammer attacks deal {mul}x damage", "通常のハンマー攻撃ダメージ{mul}倍"),
  gbQuake: c("3타 대지 강타 반지름 {r}배", "3rd-hit Earth Slam {r}x radius", "3撃目の大地強打の半径{r}倍"),
  gbStun: c("3타 기절 시간 {mul}배", "3rd-hit stun lasts {mul}x longer", "3撃目の気絶時間{mul}倍"),
  gbAfter: c("3타 뒤 같은 자리에 빛의 망치가 한 번 더 ({mul:pct}%)", "After the 3rd hit, another hammer of light falls on the same spot ({mul:pct}%)", "3撃目の後、同じ場所に光のハンマーがもう一度（{mul:pct}%）"),
  gbTitan: c("1·2타 닿는 거리 {r}배", "1st/2nd hits reach {r}x farther", "1・2撃目の届く距離{r}倍"),
  gbGrav: c("압박된 적이 받는 피해 +{taken:pct}%", "Pressed foes take +{taken:pct}% damage", "圧迫された敵の被ダメージ+{taken:pct}%"),
  gbPull: c("중력 붕괴 반지름 {r}배 · 끌어당김 {pull}배", "Gravity Collapse {r}x radius · {pull}x pull", "重力崩壊の半径{r}倍 · 引き寄せ{pull}倍"),
  gbWeight: c("압박 시간 {mul}배", "Press lasts {mul}x longer", "圧迫時間{mul}倍"),
  gbCrush: c("압박된 적을 쓰러뜨리면 그 자리에 진동 (최대 체력 {hpMul:pct}%)", "Killing a Pressed foe makes the ground quake there ({hpMul:pct}% max HP)", "圧迫された敵を倒すとその場に震動（最大体力{hpMul:pct}%）"),
  gbOrbit: c("중력 붕괴의 빛의 망치가 한 번 더 떨어짐 ({mul:pct}%)", "Gravity Collapse drops a second hammer of light ({mul:pct}%)", "重力崩壊の光のハンマーがもう一度落ちる（{mul:pct}%）"),
  gbBash: c("방패 돌진 거리 {dist}배 · 피해 {mul}배", "Shield Charge {dist}x distance · {mul}x damage", "盾突進の距離{dist}倍 · ダメージ{mul}倍"),
  gbBulwark: c("성벽 보호막 {shield}배 · 진동 반지름 {r}배", "Bulwark shield {shield}x · quake radius {r}x", "城壁のシールド{shield}倍 · 震動の半径{r}倍"),
  gbLight: c("궁극기 빛의 망치 추가타 피해 {mul}배", "Ultimate hammer-of-light follow-ups deal {mul}x damage", "必殺技の光のハンマー追撃ダメージ{mul}倍"),
  gbImmortal: c("불멸의 성벽 {more:sec}초 더 · 성역 보호막 +{shield}", "Immortal Bastion lasts {more:sec}s longer · +{shield} sanctuary shield", "不滅の城壁が{more:sec}秒長い · 聖域シールド+{shield}"),
  gbFaith: c("모든 스킬 대기 -{cd:down}%", "-{cd:down}% all skill cooldowns", "全スキル待機-{cd:down}%"),
};
