// 능력치 보기: 지금 내 수치 (패시브·무기 반영). 설정의 '능력치 보기'를 켰을 때만 화면에 표시
import { artChance, attackSpeedNow, classDamageMul, classMoveMul, critNow, eaterRegen, extraOf, mukinDef, mukinRegen, petGold, petTaken, type PlayerState, riderSpeedMul, type RunState, type WeaponDef, WEAPONS } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";

export interface StatRow {
  label: string;
  value: string;
}

const round = (v: number) => String(Math.round(v * 100) / 100);

/** 지금 걸린 배율이 붙으면 "1.8 (+20%)" (이동 속도·공격 속도·공격력) */
function moveText(base: number, mul: number): string {
  const pct = Math.round((mul - 1) * 100);
  return pct === 0 ? round(base) : `${round(base * mul)} (${pct > 0 ? "+" : ""}${pct}%)`;
}

/** 공통 추가 스탯: 값이 있을 때만 (방어력·재생력·흡혈 등) */
function extraRows(p: PlayerState, t: (k: TextKey) => string): StatRow[] {
  // 캐릭터 기본 + 히든 아이템(신의 파편·아티팩트·주사위)·왕 변신이 더한 몫 (실제 계산과 같은 sim/baseStats.extraOf)
  const ex = extraOf(p);
  const pct = (v: number) => `${Math.round(v * 100)}%`;
  const rows: [TextKey, number, string][] = [
    ["statArmor", ex.defense, round(ex.defense)],
    ["statReduction", ex.reduction, pct(ex.reduction)],
    ["statDodge", ex.dodge, pct(ex.dodge)],
    ["statRegen10", ex.regen, round(ex.regen)],
    ["statLifesteal", ex.lifesteal, pct(ex.lifesteal)],
    ["statSharpness", ex.sharpness, pct(ex.sharpness)],
    ["statStatusPower", ex.statusPower, `+${pct(ex.statusPower)}`],
    ["statGoldGain", ex.goldGain, `+${pct(ex.goldGain)}`],
  ];
  return rows.filter(([, v]) => v > 0).map(([k, , value]) => ({ label: t(k), value }));
}

export function statRows(run: RunState, t: (k: TextKey) => string): StatRow[] {
  const s = run.player.stats;
  const w: WeaponDef = WEAPONS[run.player.weaponId];
  // 지금 걸린 효과까지 (공격 속도 버프 · 라이더 빠르기 피해)
  const speedNow = attackSpeedNow(run.player);
  // 라이더 빠르기 · 이드라 모습 · 학살자 낮은 체력·분노 (실제 평타와 같은 배율)
  const dmgMul = riderSpeedMul(run.player) * classDamageMul(run.player);
  const perSecond = s.damage * dmgMul * (w.shots ?? 1) * speedNow;
  // 병아리(로비 펫) 치명타 확률은 어느 캐릭터에나 더해짐
  const crit = critNow(run);
  return [
    { label: t("statHp"), value: run.sudden ? `${run.player.hp > 0 ? 1 : 0} / 1` : `${Math.ceil(run.player.hp)} / ${round(s.maxHp)}` },
    { label: t("statDamage"), value: moveText(s.damage, dmgMul) },
    { label: t("statAttackSpeed"), value: moveText(s.attackSpeed, speedNow / s.attackSpeed) },
    { label: t("statDps"), value: round(perSecond) },
    { label: t("statRange"), value: round(s.range) },
    // 지금 실제 이동 속도 (라이더 공격 빠르기·단검 · 펑크 신경 가속 · 플라이 등 직업 배율 포함, 늘면 + 표시)
    { label: t("statMoveSpeed"), value: moveText(s.moveSpeed, classMoveMul(run.player, run.tick)) },
    ...(w.kind === "ranged" ? [{ label: t("statProjectileSpeed"), value: round(s.projectileSpeed) }] : []),
    { label: t("statLuck"), value: round(s.luck) },
    // 오니: 재생력 · 추가 공격 범위 · 추가 공격 확률
    ...(w.club
      ? [
          { label: t("statRegen"), value: round(run.player.oRegen ?? 3) },
          { label: t("statReach"), value: `${Math.round((run.player.oReach ?? 1) * 100)}%` },
          { label: t("statExtra"), value: `${Math.round(artChance(run, w.club) * 100)}%` },
        ]
      : []),
    // 묵인: 방어력 · 재생력 · 이터: 재생력 (먹은 적마다)
    ...(run.player.characterId === "mukin" ? [{ label: t("statDefense"), value: round(mukinDef(run.player)) }, { label: t("statRegen10"), value: round(mukinRegen(run.player)) }] : []),
    ...(run.player.characterId === "eater" ? [{ label: t("statRegen10"), value: round(eaterRegen(run.player)) }] : []),
    ...extraRows(run.player, t),
    { label: t("statCritChance"), value: `${Math.round(crit.chance * 100)}%` },
    { label: t("statCritDamage"), value: `${Math.round(crit.mul * 100)}%` },
    // 로비 펫: 받는 피해 · 얻는 돈 · 되살아남
    ...(petTaken(run) < 1 ? [{ label: t("statPetTaken"), value: `-${Math.round((1 - petTaken(run)) * 100)}%` }] : []),
    ...(petGold(run) > 1 ? [{ label: t("statPetGold"), value: `+${Math.round((petGold(run) - 1) * 100)}%` }] : []),
    ...(run.pet === "phoenix" ? [{ label: t("statPetLife"), value: run.petRevived ? "0" : "1" }] : []),
  ];
}
