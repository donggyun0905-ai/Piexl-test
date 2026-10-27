// 시즌 2 아스칼론 캐릭터 글자 (한·영·일): 무기 이름·설명 · 전용 아이템 이름·효과 (수치는 weapons*·*_PERKS와 맞춤)
import type { PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type TrackerPassive = "trScope" | "trHollow" | "trSilencer" | "trBipod" | "trMark" | "trRicochet" | "trDrum" | "trCharge" | "trCamo" | "trHeadshot";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const ASC_WEAPON_NAMES: Record<"trSniper" & WeaponId, Names> = {
  trSniper: c("추적자의 저격총", "Tracker's Rifle", "追跡者の狙撃銃"),
};

/** 추적자 저격총 설명 */
export const SNIPER_DESC: Names = c(
  "멀리 꿰뚫는 한 발 · 스킬 1 암습 저격(무적, 10초 안에 10발, 한 발 200%) · 2 강력한 한방(벽을 세우고 모아 방을 꿰뚫음, 1000% + 최대 체력 20%) · 3 연발사격(10발 흩뿌림)",
  "one long piercing shot · skill 1 Ambush Snipe (invulnerable, 10 shots within 10s, 200% each) · 2 Power Shot (raise a wall, charge and pierce the whole room for 1000% + 20% max HP) · 3 Rapid Fire (10 scattered shots)",
  "遠くまで貫く一発 · スキル1 暗襲狙撃（無敵、10秒以内に10発、1発200%）· 2 強力な一撃（壁を立てて溜め、部屋を貫く、1000%＋最大体力20%）· 3 連射（10発ばらまく）",
);

export const ASC_PASSIVE_NAMES: Record<TrackerPassive & PassiveId, Names> = {
  trScope: c("고배율 조준경", "High-Power Scope", "高倍率スコープ"),
  trHollow: c("할로 포인트탄", "Hollow Points", "ホローポイント弾"),
  trSilencer: c("소음기", "Suppressor", "サプレッサー"),
  trBipod: c("양각대", "Bipod", "バイポッド"),
  trMark: c("사냥감 표식", "Quarry Mark", "獲物の印"),
  trRicochet: c("도탄", "Ricochet", "跳弾"),
  trDrum: c("확장 탄창", "Extended Mag", "拡張マガジン"),
  trCharge: c("고압 장약", "High-Pressure Charge", "高圧装薬"),
  trCamo: c("위장복", "Ghillie Suit", "ギリースーツ"),
  trHeadshot: c("헤드샷", "Headshot", "ヘッドショット"),
};

export const ASC_EFFECTS: Partial<Record<TrackerPassive & PassiveId, Names>> = {
  trScope: c("사거리 +25% · 암습 저격 조준 원 +{ring:up}%", "Range +25% · Ambush Snipe reticle +{ring:up}%", "射程+25% · 暗襲狙撃の照準円+{ring:up}%"),
  trHollow: c("평소 저격 피해 +{mul:up}%", "Normal shot damage +{mul:up}%", "通常狙撃のダメージ+{mul:up}%"),
  trSilencer: c("암습 저격 대기 시간 -{cd:down}%", "Ambush Snipe cooldown -{cd:down}%", "暗襲狙撃の待ち時間-{cd:down}%"),
  trBipod: c("{still:sec}초 이상 가만히 있으면 피해 +{mul:up}%", "+{mul:up}% damage after standing still {still:sec}s", "{still:sec}秒以上じっとしているとダメージ+{mul:up}%"),
  trMark: c("맞힌 적은 {ticks:sec}초 동안 받는 피해 +{taken:up}%", "Hit foes take +{taken:up}% damage for {ticks:sec}s", "当てた敵は{ticks:sec}秒間被ダメージ+{taken:up}%"),
  trRicochet: c("평소 저격이 맞은 뒤 가까운 적에게 한 번 튕김 ({mul:pct}%)", "Normal shots ricochet once to a nearby foe ({mul:pct}%)", "通常狙撃が当たった後、近くの敵へ一度跳ねる（{mul:pct}%）"),
  trDrum: c("연발사격 10발 → {shots}발", "Rapid Fire 10 → {shots} shots", "連射10発 → {shots}発"),
  trCharge: c("강력한 한방 대기 시간 60초 → {cd:sec}초", "Power Shot cooldown 60s → {cd:sec}s", "強力な一撃の待ち時間60秒 → {cd:sec}秒"),
  trCamo: c("대시한 뒤 {ticks:sec}초 동안 받는 피해 -40%", "Take 40% less damage for {ticks:sec}s after a dash", "ダッシュ後{ticks:sec}秒間、受けるダメージ-40%"),
  trHeadshot: c("{chance:pct}% 확률로 치명타 ({mul}배)", "{chance:pct}% chance to crit (×{mul})", "{chance:pct}%でクリティカル（{mul}倍）"),
};
