// 탈라시아 매드퀸 글자 (한·영·일): 함대 무기 4 이름·기술 설명 · 전용 아이템 10 이름·효과 (수치는 weaponsMadQueen·MADQUEEN_PERKS와 맞춤)
import type { FleetColor, FleetStyle, PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Lang } from "../index";
import type { Names } from "./names";

type MqWeapon = "mqTide" | "mqCrimson" | "mqBeacon" | "mqCoral";
type MqPassive = "mqTwin" | "mqBroadside" | "mqFlagship" | "mqWarhead" | "mqRig" | "mqOverclock" | "mqSquadron" | "mqPrism" | "mqBarrage" | "mqFreedom";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const MQ_WEAPON_NAMES: Record<MqWeapon & WeaponId, Names> = {
  mqTide: c("해방의 파도포", "Tide Liberator", "解放の波動砲"),
  mqCrimson: c("적조 섬멸포", "Red Tide Annihilator", "赤潮殲滅砲"),
  mqBeacon: c("등대 번개포", "Lighthouse Thunder", "灯台の雷砲"),
  mqCoral: c("산호 폭풍포", "Coral Tempest", "珊瑚の嵐砲"),
};

/** 함대 빛깔마다 기술 */
const FLEET: Record<FleetColor, Names> = {
  0: c("하늘빛 함대: 빠르게 쏘고 폭발 범위 +20%", "Sky fleet: fires fast · +20% blast size", "空色の艦隊：速射 · 爆発範囲+20%"),
  1: c("붉은 함대: 폭발 범위 +25% · 맞은 적이 불탐 (느리게 쏨)", "Crimson fleet: +25% blast size · sets foes ablaze (fires slower)", "紅の艦隊：爆発範囲+25% · 敵が燃える（発射が遅い）"),
  2: c("노란 함대: 폭발에서 가까운 적에게 번개가 튐 · 터렛이 20% 빨리 쏨", "Golden fleet: lightning jumps from each blast to a nearby foe · turrets fire 20% faster", "黄金の艦隊：爆発から近くの敵へ雷が跳ぶ · タレットが20%速く撃つ"),
  3: c("초록 함대: 맞은 적이 중독 · 터렛·날개가 7%p 더 잘 나옴", "Emerald fleet: poisons foes · turrets and wings +7%p more likely", "翠の艦隊：敵が毒に · タレット・翼が7%p出やすい"),
};

/** 함대 무기 설명: 빛깔 기술 */
export function fleetDesc(st: FleetStyle, lang: Lang): string {
  return FLEET[st.color][lang];
}

export const MQ_PASSIVE_NAMES: Record<MqPassive & PassiveId, Names> = {
  mqTwin: c("쌍열 포신", "Twin Barrel", "双連砲身"),
  mqBroadside: c("현측 포열", "Broadside Battery", "舷側砲列"),
  mqFlagship: c("기함의 위엄", "Flagship's Majesty", "旗艦の威厳"),
  mqWarhead: c("고폭 탄두", "High-Yield Warhead", "高爆弾頭"),
  mqRig: c("신속 설치", "Rapid Deploy", "迅速設置"),
  mqOverclock: c("과충전 포탑", "Overclocked Turret", "過充電砲台"),
  mqSquadron: c("날개 편대", "Wing Squadron", "翼の編隊"),
  mqPrism: c("프리즘 렌즈", "Prism Lens", "プリズムレンズ"),
  mqBarrage: c("해방의 포격", "Liberation Barrage", "解放の砲撃"),
  mqFreedom: c("자유의 바다", "Sea of Freedom", "自由の海"),
};

export const MQ_EFFECTS: Partial<Record<MqPassive & PassiveId, Names>> = {
  mqTwin: c("머리 위 대포 +1문", "+1 cannon above your head", "頭上の大砲+1門"),
  mqBroadside: c("머리 위 대포 +1문", "+1 cannon above your head", "頭上の大砲+1門"),
  mqFlagship: c("머리 위 대포 +1문 (대포 아이템 셋 = 대포 4문)", "+1 cannon above your head (all three cannon items = 4 cannons)", "頭上の大砲+1門（大砲アイテム3つで4門）"),
  mqWarhead: c("모든 폭발 범위 +{boom:up}%", "+{boom:up}% size for every blast", "すべての爆発範囲+{boom:up}%"),
  mqRig: c("터렛이 나올 확률 +{chance:pct}%p", "+{chance:pct}%p turret chance", "タレットの出現確率+{chance:pct}%p"),
  mqOverclock: c("터렛 사거리 +{range:up}% · 쏘는 간격 -{every:down}%", "+{range:up}% turret range · -{every:down}% fire interval", "タレットの射程+{range:up}% · 発射間隔-{every:down}%"),
  mqSquadron: c("날개 무기가 나올 확률 +{chance:pct}%p", "+{chance:pct}%p wing weapon chance", "翼の武器の出現確率+{chance:pct}%p"),
  mqPrism: c("날개 레이저 피해 {mul}배 · 굵기 {width}배", "{mul}x wing laser damage · {width}x width", "翼のレーザーのダメージ{mul}倍 · 太さ{width}倍"),
  mqBarrage: c("전탄 일제사격 포탄 수 {shots}배 · 피해 {mul}배", "{shots}x All-Guns Salvo shells · {mul}x damage", "全弾一斉射撃の砲弾数{shots}倍 · ダメージ{mul}倍"),
  mqFreedom: c("받는 피해 -{taken:down}%", "-{taken:down}% damage taken", "被ダメージ-{taken:down}%"),
};
