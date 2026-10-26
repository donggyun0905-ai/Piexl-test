// 능력치 보기: 지금 내 수치 (패시브·무기 반영). 설정의 '능력치 보기'를 켰을 때만 화면에 표시
import { artChance, classMoveMul, eaterRegen, gunCrit, IMUGI, SAMYEOL, imugiCrit, mukinDef, mukinRegen, noviceCrit, petCrit, petGold, petTaken, WEAPONS, type PlayerState, type RunState, type WeaponDef } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";

export interface StatRow {
  label: string;
  value: string;
}

const round = (v: number) => String(Math.round(v * 100) / 100);

/** 지금 치명타 확률 · 피해 배율 (풋내기 스탯 · 이무기 용 부른 수 · 거너 총, 없으면 0%) */
function critOf(p: PlayerState, w: WeaponDef): { chance: number; mul: number } {
  if (p.characterId === "novice") return noviceCrit(p);
  if (p.characterId === "imugi") return { chance: imugiCrit(p), mul: IMUGI.critMul };
  if (w.kind === "gun") return gunCrit(p);
  if (p.characterId === "samyeol") return { chance: SAMYEOL.critChance, mul: SAMYEOL.critMul };
  return { chance: 0, mul: 1.5 };
}

/** 이동 속도: 직업 배율이 붙으면 "1.8 (+20%)" */
function moveText(base: number, mul: number): string {
  const pct = Math.round((mul - 1) * 100);
  return pct === 0 ? round(base) : `${round(base * mul)} (${pct > 0 ? "+" : ""}${pct}%)`;
}

export function statRows(run: RunState, t: (k: TextKey) => string): StatRow[] {
  const s = run.player.stats;
  const w: WeaponDef = WEAPONS[run.player.weaponId];
  const perSecond = s.damage * (w.shots ?? 1) * s.attackSpeed;
  // 병아리(로비 펫) 치명타 확률은 어느 캐릭터에나 더해짐
  const base = critOf(run.player, w);
  const crit = { chance: base.chance + petCrit(run), mul: base.mul };
  return [
    { label: t("statHp"), value: run.sudden ? `${run.player.hp > 0 ? 1 : 0} / 1` : `${Math.ceil(run.player.hp)} / ${round(s.maxHp)}` },
    { label: t("statDamage"), value: round(s.damage) },
    { label: t("statAttackSpeed"), value: round(s.attackSpeed) },
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
    { label: t("statCritChance"), value: `${Math.round(crit.chance * 100)}%` },
    { label: t("statCritDamage"), value: `${Math.round(crit.mul * 100)}%` },
    // 로비 펫: 받는 피해 · 얻는 돈 · 되살아남
    ...(petTaken(run) < 1 ? [{ label: t("statPetTaken"), value: `-${Math.round((1 - petTaken(run)) * 100)}%` }] : []),
    ...(petGold(run) > 1 ? [{ label: t("statPetGold"), value: `+${Math.round((petGold(run) - 1) * 100)}%` }] : []),
    ...(run.pet === "phoenix" ? [{ label: t("statPetLife"), value: run.petRevived ? "0" : "1" }] : []),
  ];
}
