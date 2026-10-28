// 시즌 2 테라코어 펑크 글자 (한·영·일): 사이버 무기 이름 · 모양 설명(모양에서 만듦) · 몸에 심는 능력(전용 아이템) 이름·효과 (수치는 weaponsPunk·PUNK_PERKS와 맞춤)
import type { Lang } from "../index";
import type { CyberStyle, PassiveId, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type CyberWeapon = "cyKatana" | "cyMonowire" | "cySmartGun" | "cyMantis" | "cyShotgun" | "cyRailPistol" | "cyHack" | "cyGorilla" | "cyEmp" | "cyTwinNeon";
type PunkPassive = "cyOptics" | "cyReflex" | "cyBoost" | "cyCharge" | "cyBerserk" | "cyLeech" | "cySkin" | "cyCloak" | "cyOverclock" | "cyEcho";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const TERRA2C_WEAPON_NAMES: Record<CyberWeapon & WeaponId, Names> = {
  cyKatana: c("열선 카타나", "Thermal Katana", "熱線カタナ"),
  cyMonowire: c("모노와이어", "Monowire", "モノワイヤー"),
  cySmartGun: c("스마트 건", "Smart Gun", "スマートガン"),
  cyMantis: c("맨티스 블레이드", "Mantis Blades", "マンティスブレード"),
  cyShotgun: c("네온 산탄총", "Neon Shotgun", "ネオンショットガン"),
  cyRailPistol: c("관통 권총", "Piercing Pistol", "貫通ピストル"),
  cyHack: c("퀵해킹", "Quickhack", "クイックハック"),
  cyGorilla: c("고릴라 팔", "Gorilla Arms", "ゴリラアーム"),
  cyEmp: c("EMP 수류탄", "EMP Grenade", "EMPグレネード"),
  cyTwinNeon: c("네온 쌍검", "Twin Neon Blades", "ネオン双剣"),
};

/** 펑크 무기 설명: 공격 모양 + 신경 가속 */
export function cyberDesc(st: CyberStyle, lang: Lang): string {
  const n = st.n ?? 0;
  const how: Record<CyberStyle["move"], Names> = {
    slash: c("빠른 네온 베기", "quick neon slashes", "素早いネオン斬り"),
    wire: c("길게 휘둘러 줄 위 모두를 베고 피를 흘리게 함", "a long lash that cuts everything in line and makes them bleed", "長く振るって線上すべてを斬り出血させる"),
    smart: c(`휘어 쫓아가는 총알 ${n}발`, `${n} bullets that curve after foes`, `曲がって追う弾${n}発`),
    mantis: c("양옆을 넓게 베는 팔 칼날", "arm blades that cut wide to both sides", "左右を広く斬る腕の刃"),
    shotgun: c(`산탄 ${n}발 · 밀어냄`, `${n} pellets · knockback`, `散弾${n}発 · 押し返す`),
    pierce: c("모두 꿰뚫는 한 줄", "a line that pierces everything", "すべて貫く一直線"),
    hack: c(`가까운 적 ${n}을 해킹해 감전·멈춤`, `hacks ${n} nearby foes to shock and stun them`, `近くの敵${n}体をハッキングし感電・停止`),
    gorilla: c("앞을 크게 후려쳐 멀리 날림", "a huge swing that sends foes flying", "前方を大きく殴り飛ばす"),
    emp: c("던지면 터져 둘레를 멈춤", "thrown, it bursts and stuns the area", "投げると弾けて周囲を停止"),
    spin: c("둘레를 휘도는 회오리", "a whirl around you", "周囲を巡る旋風"),
  };
  return [how[st.move], c("맞히면 신경 가속 게이지", "hits fill the Neural Accel gauge", "当てると神経加速ゲージ")].map((p) => p[lang]).join(" · ");
}

export const TERRA2C_PASSIVE_NAMES: Record<PunkPassive & PassiveId, Names> = {
  cyOptics: c("크롬 눈", "Chrome Eyes", "クロームアイ"),
  cyReflex: c("반사 신경", "Reflex Booster", "反射神経"),
  cyBoost: c("가속기 증폭", "Accelerator Amp", "加速器増幅"),
  cyCharge: c("빠른 충전", "Quick Charge", "急速充電"),
  cyBerserk: c("광전사 칩", "Berserker Chip", "狂戦士チップ"),
  cyLeech: c("혈액 정화기", "Blood Pump", "血液浄化器"),
  cySkin: c("피하 장갑", "Subdermal Armor", "皮下装甲"),
  cyCloak: c("광학 위장", "Optical Camo", "光学迷彩"),
  cyOverclock: c("오버클럭", "Overclock", "オーバークロック"),
  cyEcho: c("잔상 분신", "Afterimage Clone", "残像分身"),
};

export const TERRA2C_EFFECTS: Partial<Record<PunkPassive & PassiveId, Names>> = {
  cyOptics: c("{chance:pct}% 확률로 치명타 ({mul}배)", "{chance:pct}% chance to crit (×{mul})", "{chance:pct}%でクリティカル（{mul}倍）"),
  cyBoost: c("신경 가속이 {mul:up}% 오래", "Neural Accel lasts {mul:up}% longer", "神経加速が{mul:up}%長く"),
  cyCharge: c("신경 가속 게이지가 {mul:up}% 빨리 참", "Neural Accel gauge fills {mul:up}% faster", "神経加速ゲージが{mul:up}%早く溜まる"),
  cyBerserk: c("신경 가속 중 피해 +{mul:up}%", "+{mul:up}% damage during Neural Accel", "神経加速中のダメージ+{mul:up}%"),
  cyLeech: c("{every}번 맞힐 때마다 체력 {heal} 회복", "Heal {heal} HP every {every} hits", "{every}回当てるごとに体力{heal}回復"),
  cySkin: c("받는 피해 -{taken:down}%", "Damage taken -{taken:down}%", "被ダメージ-{taken:down}%"),
  cyCloak: c("대시한 뒤 {ticks:sec}초 안의 첫 공격이 기습 (피해 ×{mul})", "Your first attack within {ticks:sec}s after a dash is an ambush (×{mul} damage)", "ダッシュ後{ticks:sec}秒以内の最初の攻撃が奇襲（ダメージ×{mul}）"),
  cyEcho: c("신경 가속 중 공격마다 잔상이 한 번 더 ({mul:pct}%)", "During Neural Accel, an afterimage repeats each attack ({mul:pct}%)", "神経加速中、攻撃ごとに残像がもう一度（{mul:pct}%）"),
};
