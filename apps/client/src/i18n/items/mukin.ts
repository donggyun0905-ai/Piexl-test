// 묵인(헬리오스) 글자 (한·영·일): 돌진 무기 이름 · 돌진 설명(모양에서 만듦) · 전용 아이템 이름·효과 (수치는 weaponsMukin·MUKIN_PERKS와 맞춤)
import type { Lang } from "../index";
import type { PassiveId, RamStyle, WeaponId } from "@pixel-rogue/shared";
import type { Names } from "./names";

type MukinWeapon = "ironHorn" | "shieldBash" | "quakeRam" | "longRam" | "twinRam" | "chainRam" | "wallRam" | "spikeRam" | "fortressRam" | "meteorRam";
type MukinPassive = "mkPlate" | "mkBulk" | "mkSpikes" | "mkRegen" | "mkMomentum" | "mkShock" | "mkMeditate" | "mkPotion" | "mkTrample" | "mkIron";
const c = (ko: string, en: string, ja: string): Names => ({ ko, en, ja });

export const MUKIN_WEAPON_NAMES: Record<MukinWeapon & WeaponId, Names> = {
  ironHorn: c("쇠뿔", "Iron Horn", "鉄の角"),
  shieldBash: c("방패 밀치기", "Shield Bash", "盾押し"),
  quakeRam: c("지진 돌진", "Quake Charge", "地震突進"),
  longRam: c("먼 돌진", "Long Charge", "遠突進"),
  twinRam: c("왕복 돌진", "Return Charge", "往復突進"),
  chainRam: c("연쇄 돌진", "Chain Charge", "連鎖突進"),
  wallRam: c("성벽 밀기", "Rampart Push", "城壁押し"),
  spikeRam: c("땅울림 돌진", "Rumble Charge", "地鳴り突進"),
  fortressRam: c("요새 돌진", "Fortress Charge", "要塞突進"),
  meteorRam: c("운석 돌진", "Meteor Charge", "隕石突進"),
};

/** 돌진 설명: 피해는 방어력의 300% + 모양마다 더하는 것 */
export function ramDesc(r: RamStyle, lang: Lang): string {
  const parts: Names[] = [c("겨눈 쪽으로 몸으로 들이받음 (피해 = 방어력 300% + 공격력)", "Body-slams toward your aim (damage = 300% Defense + Damage)", "狙った方へ体当たり（ダメージ = 防御力300% + 攻撃力）")];
  if (r.stun) parts.push(c(`맞은 적 ${r.stun / 60}초 기절`, `stuns for ${r.stun / 60}s`, `当たった敵を${r.stun / 60}秒気絶`));
  if (r.blast) parts.push(c("끝에서 충격파", "shockwave at the end", "終点で衝撃波"));
  if (r.back) parts.push(c("갔다가 그대로 돌아옴", "charges back the same way", "行ってそのまま戻る"));
  if (r.chain) parts.push(c(`이어서 가까운 적에게 ${r.chain}번 더`, `then ${r.chain} more charges at nearby foes`, `続けて近くの敵へ${r.chain}回`));
  if (r.trail) parts.push(c("지나간 길에 충격파 셋", "three shockwaves along the path", "通った道に衝撃波3つ"));
  if (r.guard) parts.push(c(`돌진 뒤 2초 방어력 +${r.guard}`, `+${r.guard} Defense for 2s after`, `突進後2秒防御力+${r.guard}`));
  if (r.push >= 20) parts.push(c("적을 멀리 밀어냄", "pushes foes far away", "敵を遠くへ押し出す"));
  return parts.map((p) => p[lang]).join(" · ");
}

export const MUKIN_PASSIVE_NAMES: Record<MukinPassive & PassiveId, Names> = {
  mkPlate: c("철판", "Iron Plate", "鉄板"),
  mkBulk: c("거대한 몸", "Colossal Frame", "巨大な体"),
  mkSpikes: c("가시 갑옷", "Spiked Armor", "棘の鎧"),
  mkRegen: c("바위 심장", "Stone Heart", "岩の心臓"),
  mkMomentum: c("가속", "Momentum", "加速"),
  mkShock: c("충격", "Concussion", "衝撃"),
  mkMeditate: c("묵상", "Silent Meditation", "黙想"),
  mkPotion: c("약초 주머니", "Herb Pouch", "薬草袋"),
  mkTrample: c("짓밟기", "Trample", "踏みつけ"),
  mkIron: c("무쇠 의지", "Iron Will", "鉄の意志"),
};

export const MUKIN_EFFECTS: Partial<Record<MukinPassive & PassiveId, Names>> = {
  mkPlate: c("방어력 +{def}", "Defense +{def}", "防御力+{def}"),
  mkSpikes: c("맞으면 둘레 적에게 방어력만큼 피해", "When hit, deal your Defense as damage to nearby foes", "被弾すると周りの敵に防御力分のダメージ"),
  mkRegen: c("재생력 +{regen}", "Regen +{regen}", "再生力+{regen}"),
  mkMomentum: c("돌진 거리 +{mul:up}%", "Charge distance +{mul:up}%", "突進距離+{mul:up}%"),
  mkShock: c("돌진에 맞은 적이 {ticks:sec}초 기절", "Charges stun foes for {ticks:sec}s", "突進で当たった敵が{ticks:sec}秒気絶"),
  mkMeditate: c("가만히 서 있으면 방어력 +{def}", "Defense +{def} while standing still", "立ち止まると防御力+{def}"),
  mkPotion: c("회복약이 {mul:up}% 더 차오름", "Potions restore {mul:up}% more", "回復薬が{mul:up}%多く回復"),
  mkTrample: c("돌진이 끝나면 둘레에 충격파", "A shockwave around you when a charge ends", "突進が終わると周りに衝撃波"),
  mkIron: c("돌진 피해가 방어력의 {mul:pct}%", "Charge damage becomes {mul:pct}% of Defense", "突進ダメージが防御力の{mul:pct}%"),
};
