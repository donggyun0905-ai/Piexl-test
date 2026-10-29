// 패왕전 집 상점 (쟁탈전 · 전쟁의 서막, docs/PW_MODES.md '전쟁의 서막 상점표'). 이름·아이콘은 던전 아이템(패시브·히든)과 같은 id
// 효과 수치: hp 체력 · dmg 공격력 · dmgMul 공격력 % · rate 공격 속도 % · range 사거리 · rangeMul 사거리 % · move 이동 속도 · shot 투사체 속도 %
// crit 치명타 확률 · critDmg 치명타 피해 · def 방어력 · regen 재생력 · dashCut 대시 대기 감소 · skillDmg 스킬 피해 % · skillHeal 스킬 치유 % · maxLv 최대 레벨
// fx: 특수 효과 (sim/pwGear가 셈). 중첩은 상대 캐릭터를 때리거나 맞을 때 쌓이고 5초 안에 다시 때리거나 맞으면 유지
import type { UseItemId } from "./items";

export interface PwGearStat {
  hp?: number;
  dmg?: number;
  dmgMul?: number;
  rate?: number;
  range?: number;
  rangeMul?: number;
  move?: number;
  shot?: number;
  crit?: number;
  critDmg?: number;
  def?: number;
  regen?: number;
  dashCut?: number;
  skillDmg?: number;
  skillHeal?: number;
  maxLv?: number;
}

export interface PwGearDef extends PwGearStat {
  cost: number;
  /** 전설 장비 재료 (기본 장비 id → 개수) */
  need?: Readonly<Record<string, number>>;
  /** 금기된 아티팩트 계열 (한 개만) */
  relic?: boolean;
}

/** 사용 아이템 값 */
export const PW_SHOP_USES: Partial<Record<UseItemId, number>> = { potion: 50, elixir: 150, frost: 200, ward: 150, bomb: 100 };

export const PW_BASIC: Record<string, PwGearDef> = {
  sturdyHeart: { cost: 400, hp: 20 },
  whetstone: { cost: 350, dmg: 3 },
  lightGloves: { cost: 400, rate: 0.15 },
  longGrip: { cost: 400, rangeMul: 0.2 },
  windBoots: { cost: 300, move: 0.15 },
  featherTip: { cost: 350, shot: 0.25, range: 10 },
  cloverCharm: { cost: 400, crit: 0.1 },
  furySeal: { cost: 900, dmgMul: 0.25 },
  hunterEye: { cost: 900, range: 15, rate: 0.1 },
  secondWind: { cost: 900, crit: 0.25 },
  regenCharm: { cost: 900, regen: 10, hp: 40 },
  goldPouch: { cost: 900, def: 10, regen: 10 },
  dashCloak: { cost: 900, dashCut: 0.4 },
  goddessBlessing: { cost: 1300, dmg: 10, rate: 0.2 },
  heavyPlate: { cost: 800, hp: 40, move: -0.15 },
};

export const PW_LEGEND: Record<string, PwGearDef> = {
  relicRed: { relic: true, need: { whetstone: 3, furySeal: 1 }, cost: 450, dmg: 10, dmgMul: 0.15 },
  relicBlue: { relic: true, need: { lightGloves: 3, hunterEye: 1 }, cost: 300, rate: 0.25, range: 20 },
  relicSilver: { relic: true, need: { goldPouch: 1, heavyPlate: 1 }, cost: 500, def: 15, regen: 10, move: -0.15 },
  relicGold: { relic: true, need: { cloverCharm: 1, secondWind: 1 }, cost: 900, crit: 0.25, rate: 0.05 },
  relicPrism: { relic: true, need: { secondWind: 1, goddessBlessing: 1 }, cost: 200, critDmg: 0.3, rate: 0.05 },
  relicWhite: { relic: true, need: { sturdyHeart: 2, heavyPlate: 1 }, cost: 600, hp: 80, move: -0.15 },
  relicGreen: { relic: true, need: { regenCharm: 2 }, cost: 600 },
  ifritClaw: { need: { whetstone: 1, windBoots: 1, longGrip: 1, secondWind: 1 }, cost: 250, range: 10, dmg: 3, move: 0.15 },
  sylphQuiver: { need: { longGrip: 1, featherTip: 1, dashCloak: 1 }, cost: 650, rangeMul: 0.1, shot: 0.25, dashCut: 0.4 },
  gnomeHammer: { need: { whetstone: 2, heavyPlate: 1, goldPouch: 1 }, cost: 100, dmg: 10, def: 10, hp: 40, move: -0.15 },
  dryadOrb: { need: { regenCharm: 2 }, cost: 800, hp: 80, regen: 20 },
  aphroditeMirror: { need: { goddessBlessing: 1, heavyPlate: 1 }, cost: 500, dmg: 5, rate: 0.1, hp: 40 },
  godShard: { need: { goddessBlessing: 1, longGrip: 1 }, cost: 900, dmg: 10, rate: 0.1, rangeMul: 0.1, move: 0.15 },
  blizzardLance: { need: { heavyPlate: 1, sturdyHeart: 1, furySeal: 1 }, cost: 500, dmgMul: 0.25, hp: 40, def: 10, move: -0.15 },
  fallenWings: { need: { goddessBlessing: 2 }, cost: 0, dmg: 10, regen: 10 },
  petFlute: { need: { goddessBlessing: 1, featherTip: 1, whetstone: 1 }, cost: 0, dmg: 5, rate: 0.1, hp: 40, move: 0.15, maxLv: 3 },
  falseHero: { need: { goddessBlessing: 1, hunterEye: 1 }, cost: 500, rate: 0.1, range: 10, dmg: 5 },
  aetherBomb: { need: { heavyPlate: 3 }, cost: 300, hp: 160, move: -0.3 },
  forbiddenScroll: { need: { goddessBlessing: 1, dashCloak: 1 }, cost: 400, dashCut: 0.4, dmg: 10, skillDmg: 0.5 },
  dimensionGate: { need: { windBoots: 2, featherTip: 1, whetstone: 1, dashCloak: 1 }, cost: 500, dashCut: 0.4, move: 0.3, skillDmg: 0.3 },
  portalGun: { need: { goddessBlessing: 1, lightGloves: 1, windBoots: 1 }, cost: 400, move: 0.3 },
  fateDice: { need: { goddessBlessing: 1, cloverCharm: 1 }, cost: 600, dmg: 10, rate: 0.2, crit: 0.1 },
  cursedDice: { need: { heavyPlate: 2, cloverCharm: 1 }, cost: 400, hp: 80, move: 0.15 },
  terraform: { need: { goddessBlessing: 1, featherTip: 1 }, cost: 750, shot: 0.25, range: 10, dmg: 3, rate: 0.03 },
  crumblingCrown: { need: { goddessBlessing: 2 }, cost: 200, dmg: 10, rate: 0.1 },
  laurelShip: { need: { cloverCharm: 1, longGrip: 1, dashCloak: 1 }, cost: 300, dashCut: 0.4, rangeMul: 0.2, skillHeal: 1 },
  cupidSpirit: { need: { hunterEye: 1, windBoots: 1, longGrip: 1 }, cost: 700, rate: 0.1, rangeMul: 0.2 },
};

/** 전설 장비 특수 효과 수치 (sim/pwGear) */
export const PW_GEAR_FX = {
  /** 때릴 때 쌓임: 칸마다 · 최대 칸 */
  relicRed: { dmgMul: 0.03, max: 5 },
  relicBlue: { rate: 0.03, max: 10 },
  relicGold: { crit: 0.05, max: 5 },
  relicPrism: { critDmg: 0.06, max: 5 },
  /** 맞을 때 쌓임 */
  relicSilver: { def: 5, regen: 5, max: 4 },
  relicWhite: { hp: 10, max: 5 },
  godShard: { move: 0.15, max: 3 },
  /** 녹색: 이 틱 넘게 안 맞으면 재생력 + · 맞은 뒤 이 틱 동안은 그대로 */
  relicGreen: { calm: 600, regen: 80, keep: 120 },
  /** 이프리트: 치유 감소 · 시간 · 화상 칸(1초마다 공격력 비율) */
  ifritClaw: { cut: 0.4, ticks: 180, burn: 0.12, max: 5 },
  /** 실피드: 확률 · 회오리 시간 · 1초마다 공격력 비율 */
  sylphQuiver: { chance: 0.5, ticks: 180, mul: 0.25 },
  gnomeHammer: { mul: 0.5, r: 30 },
  dryadOrb: { chance: 0.3, heal: 0.03 },
  aphroditeMirror: { chance: 0.3, mul: 2 },
  blizzardLance: { dash: 0.3, dashMul: 0.3, freeze: 0.2, freezeMul: 0.1, stun: 90 },
  fallenWings: { hp: 0.75, cd: 3600 },
  aetherBomb: { store: 0.3, mul: 2, r: 56 },
  portalGun: { calm: 120, add: 0.2, per: 0.002 },
  fateDice: { max: 15, dmg: 3, def: 3, regen: 3, rate: 0.03 },
  cursedDice: { r: 60, cut: 0.5, poison: 0.08 },
  terraform: { cd: 3600 },
  crumblingCrown: { dmg: 0.3, rate: 0.3, move: 0.3 },
  cupidSpirit: { slow: 0.05, max: 9, ticks: 180 },
};

/** 상점 목록 차례 (사용 아이템 → 기본 → 전설). 화면 버튼 번호 = 이 목록의 자리 */
export const PW_SHOP_IDS: readonly string[] = [...Object.keys(PW_SHOP_USES), ...Object.keys(PW_BASIC), ...Object.keys(PW_LEGEND)];

/** 장비 하나의 정의 (기본·전설) */
export const pwGearDef = (id: string): PwGearDef | undefined => PW_BASIC[id] ?? PW_LEGEND[id];
