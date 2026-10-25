// 거인 글자 (한·영·일): 무기 이름 · 평소 공격·강타 설명 · 전용 아이템 이름·효과 (수치는 weaponsTitan·TITAN_PERKS와 맞춤)
import type { PassiveId, SmashKind, TitanStyle, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type TitanWeapon = "ironArm" | "pistonFist" | "wreckingBall" | "drillArm" | "anvilHammer" | "rivetGun" | "magnetArm" | "bulwarkArm" | "steamVent" | "titanCore";
type TitanPassive = "armorPlate" | "bigCapacitor" | "overdriveCircuit" | "hydraulicJoint" | "scrapRepair" | "aftershock" | "counterCoil" | "chargeKnuckle" | "gyroStabilizer" | "titanHull";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const TITAN_WEAPON_NAMES: Record<TitanWeapon & WeaponId, Names> = {
  ironArm: c("강철 의수", "Steel Prosthetic", "鋼鉄の義手"),
  pistonFist: c("피스톤 주먹", "Piston Fist", "ピストン拳"),
  wreckingBall: c("철거용 쇠공", "Wrecking Ball", "解体用鉄球"),
  drillArm: c("드릴 팔", "Drill Arm", "ドリルアーム"),
  anvilHammer: c("모루 망치", "Anvil Hammer", "金床ハンマー"),
  rivetGun: c("리벳 연사기", "Rivet Repeater", "リベット連射機"),
  magnetArm: c("자석 팔", "Magnet Arm", "磁石アーム"),
  bulwarkArm: c("방벽 팔", "Bulwark Arm", "防壁アーム"),
  steamVent: c("증기 배출구", "Steam Vent", "蒸気排出口"),
  titanCore: c("거인의 심장", "Titan Core", "巨人の心臓"),
};

/** 평소 공격 */
export const TITAN_STYLE_DESC: Record<TitanStyle, Names> = {
  heavy: c("아주 느리지만 늘 범위로 내려침", "Very slow, but always hits an area", "とても遅いが必ず範囲で叩きつける"),
  jab: c("빠르지만 아주 약한 연타", "Fast but very weak jabs", "速いがとても弱い連打"),
  rivet: c("빠르지만 아주 약한 리벳을 쏨", "Fires fast but very weak rivets", "速いがとても弱いリベットを撃つ"),
};

const ENERGY = c("맞은 피해가 기계팔 에너지로 쌓이고, 다 차면 다음 공격이 강타", "Damage taken charges the mech arm; when full, the next attack is a Smash", "受けたダメージが機械腕のエネルギーに溜まり、満タンで次の攻撃が強打");

/** 강타 */
export const SMASH_DESC: Record<SmashKind, Names> = {
  quake: c("강타: 둘레를 크게 내려쳐 지진 (기절)", "Smash: a huge ground quake around you (stun)", "強打：周りを大きく叩いて地震（気絶）"),
  piston: c("강타: 앞으로 아주 길게 뻗는 주먹", "Smash: a punch that extends very far ahead", "強打：前へとても長く伸びる拳"),
  ball: c("강타: 쇠공을 휘둘러 둘레를 크게 밀침", "Smash: swing the ball around, knocking foes far away", "強打：鉄球を振り回し周りを大きく押し飛ばす"),
  drill: c("강타: 커다란 드릴과 함께 앞으로 크게 돌진하며 여러 번 깎음 (돌진 중 무적)", "Smash: charges far ahead with a giant drill, grinding many times (invulnerable while charging)", "強打：巨大なドリルと一緒に前へ大きく突進し何度も削る（突進中は無敵）"),
  anvil: c("강타: 둘레 모든 적을 오래 기절", "Smash: stuns every foe around you for a long time", "強打：周りのすべての敵を長く気絶"),
  rivets: c("강타: 사방으로 리벳 폭풍 (관통)", "Smash: a storm of rivets in all directions (pierce)", "強打：四方へリベットの嵐（貫通）"),
  magnet: c("강타: 멀리 있는 적까지 끌어와 터뜨림", "Smash: pulls in foes from afar and blasts them", "強打：遠くの敵まで引き寄せて爆発"),
  bulwark: c("강타: 앞으로 충격파 셋 · 평소 공격 중에는 받는 피해 감소", "Smash: three shockwaves ahead · take less damage while attacking", "強打：前へ衝撃波3つ · 通常攻撃中は受けるダメージ減少"),
  steam: c("강타: 둘레에 3초 동안 뜨거운 증기", "Smash: scalding steam around you for 3s", "強打：周りに3秒間熱い蒸気"),
  overload: c("강타: 점점 커지는 지진 셋 · 에너지가 1.5배로 참", "Smash: three growing quakes · energy charges 1.5x", "強打：だんだん大きくなる地震3つ · エネルギーが1.5倍溜まる"),
};

/** 무기 설명 */
export function titanDesc(style: TitanStyle, smash: SmashKind, lang: "ko" | "en" | "ja"): string {
  return `${TITAN_STYLE_DESC[style][lang]} · ${ENERGY[lang]} · ${SMASH_DESC[smash][lang]}`;
}

export const TITAN_PASSIVE_NAMES: Record<TitanPassive & PassiveId, Names> = {
  armorPlate: c("강화 장갑판", "Armor Plating", "強化装甲板"),
  bigCapacitor: c("대용량 축전지", "Big Capacitor", "大容量蓄電池"),
  overdriveCircuit: c("과부하 회로", "Overdrive Circuit", "過負荷回路"),
  hydraulicJoint: c("유압 관절", "Hydraulic Joint", "油圧関節"),
  scrapRepair: c("고철 수리", "Scrap Repair", "鉄くず修理"),
  aftershock: c("여진", "Aftershock", "余震"),
  counterCoil: c("반격 코일", "Counter Coil", "反撃コイル"),
  chargeKnuckle: c("충전 너클", "Charge Knuckle", "充電ナックル"),
  gyroStabilizer: c("자이로 안정기", "Gyro Stabilizer", "ジャイロ安定器"),
  titanHull: c("무쇠 선체", "Iron Hull", "鉄の船体"),
};

export const TITAN_EFFECTS: Partial<Record<TitanPassive & PassiveId, Names>> = {
  armorPlate: c("받는 피해 -{taken:down}%", "-{taken:down}% damage taken", "受けるダメージ-{taken:down}%"),
  bigCapacitor: c("강타에 필요한 에너지 -{need:down}%", "-{need:down}% energy needed for a Smash", "強打に必要なエネルギー-{need:down}%"),
  overdriveCircuit: c("강타 피해 +{damage:up}%", "+{damage:up}% Smash damage", "強打ダメージ+{damage:up}%"),
  hydraulicJoint: c("느린 범위 공격의 범위 +{area:up}%", "+{area:up}% area for slow area attacks", "遅い範囲攻撃の範囲+{area:up}%"),
  scrapRepair: c("강타를 쓰면 최대 체력의 {heal:pct}% 회복", "Smashing heals {heal:pct}% of max HP", "強打で最大体力の{heal:pct}%回復"),
  aftershock: c("느린 범위 공격이 맞은 적을 {stun:sec}초 기절", "Slow area attacks stun foes for {stun:sec}s", "遅い範囲攻撃が当たった敵を{stun:sec}秒気絶"),
  counterCoil: c("맞으면 둘레 적에게 공격력 {mul:pct}% ({cd:sec}초에 한 번)", "When hit, deal {mul:pct}% damage around you (once per {cd:sec}s)", "被弾時、周りの敵に攻撃力{mul:pct}%（{cd:sec}秒に1回）"),
  chargeKnuckle: c("빠른 공격(연타·리벳)이 맞힐 때마다 에너지 +{energy}", "Fast attacks (jabs, rivets) add +{energy} energy per hit", "速い攻撃（連打・リベット）が当たるたびエネルギー+{energy}"),
  gyroStabilizer: c("강타 뒤 {ticks:sec}초 동안 받는 피해 -{taken:down}%", "-{taken:down}% damage taken for {ticks:sec}s after a Smash", "強打の後{ticks:sec}秒間受けるダメージ-{taken:down}%"),
};
