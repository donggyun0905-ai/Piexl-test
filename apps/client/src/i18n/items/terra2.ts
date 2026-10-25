// 시즌 2 테라코어 오토마타·라이더 글자 (한·영·일): 무기 이름 · 모양 설명(모양에서 만듦) · 전용 아이템 이름·효과 (수치는 weaponsAutomata·weaponsRider·*_PERKS와 맞춤)
import type { Lang } from "../index";
import type { AutoStyle, PassiveId, RideStyle, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type AutoWeapon = "adFinger" | "adSisters" | "adMissile" | "adTwin" | "adPrism" | "adCannon" | "adSweep" | "adBind" | "adSatellite" | "adArsenal";
type RideWeapon = "rdHammer" | "rdPulse" | "rdDagger" | "rdRail" | "rdScatter" | "rdExhaust" | "rdWheel" | "rdLance" | "rdChain" | "rdNitro";
type TerraPassive = "adCore" | "adFocus" | "adWide" | "adCall" | "adFourth" | "adWarhead" | "adSalvo" | "adEcho" | "adShield" | "adSoul" | "rdTurbo" | "rdTank" | "rdShock" | "rdDouble" | "rdSlip" | "rdRam" | "rdDrift" | "rdGear" | "rdRepair" | "rdBurn";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const TERRA2_WEAPON_NAMES: Record<(AutoWeapon | RideWeapon) & WeaponId, Names> = {
  adFinger: c("손끝 레이저", "Fingertip Laser", "指先レーザー"),
  adSisters: c("자매 인형", "Sister Dolls", "姉妹人形"),
  adMissile: c("미사일 포드", "Missile Pod", "ミサイルポッド"),
  adTwin: c("쌍둥이 레이저", "Twin Laser", "ツインレーザー"),
  adPrism: c("프리즘 레이저", "Prism Laser", "プリズムレーザー"),
  adCannon: c("과충전 캐논", "Overcharge Cannon", "過充電キャノン"),
  adSweep: c("부채 레이저", "Fan Laser", "扇レーザー"),
  adBind: c("구속 레이저", "Binding Laser", "拘束レーザー"),
  adSatellite: c("궤도 위성", "Orbital Satellite", "軌道衛星"),
  adArsenal: c("전탄 발사", "Full Arsenal", "全弾発射"),
  rdHammer: c("기계 망치", "Mech Hammer", "機械ハンマー"),
  rdPulse: c("펄스건", "Pulse Gun", "パルスガン"),
  rdDagger: c("암살 단검", "Assassin's Dagger", "暗殺ダガー"),
  rdRail: c("레일건", "Railgun", "レールガン"),
  rdScatter: c("산탄 펄스", "Scatter Pulse", "散弾パルス"),
  rdExhaust: c("화염 배기", "Flame Exhaust", "火炎排気"),
  rdWheel: c("톱날 휠", "Saw Wheel", "ノコギリホイール"),
  rdLance: c("전기 랜스", "Shock Lance", "電撃ランス"),
  rdChain: c("체인 휘두르기", "Chain Whirl", "チェーン回し"),
  rdNitro: c("니트로 부스터", "Nitro Booster", "ニトロブースター"),
};

/** 오토마타 무기 설명: 레이저 몇 줄 + 더하는 것 */
export function autoDesc(st: AutoStyle, lang: Lang): string {
  const parts: Names[] = [st.beams > 1 ? c(`레이저 ${st.beams}갈래`, `${st.beams} laser beams`, `レーザー${st.beams}本`) : c("꿰뚫는 레이저", "piercing laser", "貫通レーザー")];
  if (st.width >= 8) parts.push(c("아주 굵음", "very thick", "とても太い"));
  if (st.dolls) parts.push(c(`자매 인형 ${st.dolls}이 함께 쏨`, `${st.dolls} sister dolls fire with her`, `姉妹人形${st.dolls}体も撃つ`));
  if (st.missiles) parts.push(st.missiles.chance >= 1 ? c(`쏠 때마다 유도 미사일 ${st.missiles.n}발 넘게`, `${st.missiles.n}+ homing missiles every shot`, `撃つたびに誘導ミサイル${st.missiles.n}発以上`) : c(`${Math.round(st.missiles.chance * 100)}% 확률로 등 뒤에서 유도 미사일 ${st.missiles.n}발 넘게`, `${Math.round(st.missiles.chance * 100)}% chance of ${st.missiles.n}+ homing missiles from her back`, `${Math.round(st.missiles.chance * 100)}%で背中から誘導ミサイル${st.missiles.n}発以上`));
  if (st.split) parts.push(c(`맞힌 적에서 ${st.split}갈래로 갈라짐`, `splits to ${st.split} nearby foes`, `当たった敵から${st.split}本に分かれる`));
  if (st.bind) parts.push(c("맞으면 묶임", "binds on hit", "当たると拘束"));
  if (st.sat) parts.push(c(`${st.sat}번째마다 궤도 포격`, `orbital strike every ${st.sat} shots`, `${st.sat}発ごとに軌道砲撃`));
  return parts.map((p) => p[lang]).join(" · ");
}

/** 라이더 무기 설명: 공격 모양 + 빠를수록 셈 */
export function rideDesc(st: RideStyle, lang: Lang): string {
  const shape: Record<RideStyle["move"], Names> = {
    smash: c("앞을 크게 내려쳐 밀어냄", "smashes ahead and knocks back", "前方を叩きつけ押し返す"),
    stab: c("아주 빠른 찌르기", "lightning-fast stabs", "とても速い突き"),
    shot: c("빠른 에너지탄", "fast energy bolts", "速いエネルギー弾"),
    spread: c(`에너지탄 ${st.n ?? 5}발을 부채꼴로`, `${st.n ?? 5} bolts in a fan`, `エネルギー弾${st.n ?? 5}発を扇状に`),
    rail: c("모두 꿰뚫는 한 줄", "a line that pierces everything", "すべて貫く一直線"),
    flame: c("불을 뿜어 불태움 · 달린 자리에 불꽃", "breathes fire and leaves flames where you drive", "炎を噴いて燃やす · 走った跡に炎"),
    wheel: c("꿰뚫고 돌아오는 톱날", "a saw that pierces and returns", "貫いて戻るノコギリ"),
    lance: c("길게 찔러 감전 (잠깐 멈춤)", "long thrust that shocks (brief stun)", "長く突いて感電（少し停止）"),
    spin: c("둘레 한 바퀴", "a full circle around you", "周囲を一周"),
    nitro: c("앞으로 내달려 들이받음", "boosts forward and rams", "前方へ突っ込んで体当たり"),
  };
  return [shape[st.move], c("빠를수록 피해 증가", "faster = more damage", "速いほどダメージ増加")].map((p) => p[lang]).join(" · ");
}

export const TERRA2_PASSIVE_NAMES: Record<TerraPassive & PassiveId, Names> = {
  adCore: c("동력 코어", "Power Core", "動力コア"),
  adFocus: c("초점 렌즈", "Focus Lens", "集光レンズ"),
  adWide: c("확산 렌즈", "Diffusion Lens", "拡散レンズ"),
  adCall: c("자매 부르기", "Call the Sisters", "姉妹呼び"),
  adFourth: c("넷째 자매", "The Fourth Sister", "四番目の姉妹"),
  adWarhead: c("고폭 탄두", "High-Yield Warhead", "高爆弾頭"),
  adSalvo: c("탄약 증설", "Extra Magazines", "弾薬増設"),
  adEcho: c("잔상 회로", "Echo Circuit", "残像回路"),
  adShield: c("방어 필드", "Defense Field", "防御フィールド"),
  adSoul: c("깨어난 자아", "Awakened Self", "目覚めた自我"),
  rdTurbo: c("터보 엔진", "Turbo Engine", "ターボエンジン"),
  rdTank: c("니트로 탱크", "Nitro Tank", "ニトロタンク"),
  rdShock: c("충격파", "Shockwave", "衝撃波"),
  rdDouble: c("더블 펄스", "Double Pulse", "ダブルパルス"),
  rdSlip: c("슬립스트림", "Slipstream", "スリップストリーム"),
  rdRam: c("들이받기", "Ram", "体当たり"),
  rdDrift: c("드리프트", "Drift", "ドリフト"),
  rdGear: c("하이 기어", "High Gear", "ハイギア"),
  rdRepair: c("정비 키트", "Repair Kit", "整備キット"),
  rdBurn: c("불꽃 바퀴", "Flaming Wheels", "炎の車輪"),
};

export const TERRA2_EFFECTS: Partial<Record<TerraPassive & PassiveId, Names>> = {
  adFocus: c("레이저 피해 +{mul:up}%", "Laser damage +{mul:up}%", "レーザーダメージ+{mul:up}%"),
  adWide: c("레이저 굵기 +{add}", "Laser width +{add}", "レーザーの太さ+{add}"),
  adCall: c("어느 무기든 자매 인형 {n}이 곁에서 함께 쏨", "{n} sister doll fights beside you with any weapon", "どの武器でも姉妹人形{n}体がそばで撃つ"),
  adFourth: c("자매 인형 +{n}", "+{n} sister doll", "姉妹人形+{n}"),
  adWarhead: c("미사일 폭발 범위 +{r:up}%", "Missile blast +{r:up}%", "ミサイルの爆発範囲+{r:up}%"),
  adSalvo: c("미사일 확률 +{chance:pct}%, {n}발 더", "Missile chance +{chance:pct}%, {n} more missiles", "ミサイル確率+{chance:pct}%、{n}発追加"),
  adEcho: c("{chance:pct}% 확률로 레이저를 한 번 더", "{chance:pct}% chance to fire the laser again", "{chance:pct}%でレーザーをもう一度"),
  adShield: c("받는 피해 -{taken:down}%", "Damage taken -{taken:down}%", "被ダメージ-{taken:down}%"),
  adSoul: c("적 {every}마리마다 공격력 +1 (최대 +{max})", "+1 damage per {every} foes defeated (up to +{max})", "敵{every}体ごとに攻撃力+1（最大+{max}）"),
  rdTank: c("게이지가 {mul:up}% 빨리 참", "Gauge fills {mul:up}% faster", "ゲージが{mul:up}%早く溜まる"),
  rdShock: c("펄스 범위 +{r:up}%", "Pulse radius +{r:up}%", "パルス範囲+{r:up}%"),
  rdDouble: c("펄스가 0.5초 뒤 한 번 더 ({mul:pct}% 피해)", "Pulse fires again 0.5s later ({mul:pct}% damage)", "パルスが0.5秒後にもう一度（{mul:pct}%ダメージ）"),
  rdSlip: c("달리는 동안 받는 피해 -{taken:down}%", "Damage taken -{taken:down}% while moving", "走行中の被ダメージ-{taken:down}%"),
  rdRam: c("달리며 닿은 적에게 공격력 {mul:pct}% 피해", "Ramming foes while moving deals {mul:pct}% damage", "走りながら触れた敵に攻撃力{mul:pct}%ダメージ"),
  rdDrift: c("대시한 뒤 다음 공격 피해 +{mul:up}%", "After a dash, next attack +{mul:up}% damage", "ダッシュ後の次の攻撃ダメージ+{mul:up}%"),
  rdGear: c("빠를수록 붙는 피해 +{mul:up}%", "Speed damage bonus +{mul:up}%", "速さによるダメージ+{mul:up}%"),
  rdRepair: c("펄스가 터지면 체력 {heal} 회복", "Heal {heal} HP when the pulse fires", "パルス発動で体力{heal}回復"),
  rdBurn: c("달린 자리에 불꽃 자국", "Leaves a trail of flames as you drive", "走った跡に炎"),
};
