// 능력치 보기: 지금 내 수치 (패시브·무기 반영). 설정의 '능력치 보기'를 켰을 때만 화면에 표시
import { artChance, gunCrit, IMUGI, imugiCrit, noviceCrit, WEAPONS, type PlayerState, type RunState, type WeaponDef } from "@pixel-rogue/shared";
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
  return { chance: 0, mul: 1.5 };
}

export function statRows(run: RunState, t: (k: TextKey) => string): StatRow[] {
  const s = run.player.stats;
  const w: WeaponDef = WEAPONS[run.player.weaponId];
  const perSecond = s.damage * (w.shots ?? 1) * s.attackSpeed;
  const crit = critOf(run.player, w);
  return [
    { label: t("statHp"), value: run.sudden ? `${run.player.hp > 0 ? 1 : 0} / 1` : `${Math.ceil(run.player.hp)} / ${round(s.maxHp)}` },
    { label: t("statDamage"), value: round(s.damage) },
    { label: t("statAttackSpeed"), value: round(s.attackSpeed) },
    { label: t("statDps"), value: round(perSecond) },
    { label: t("statRange"), value: round(s.range) },
    { label: t("statMoveSpeed"), value: round(s.moveSpeed) },
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
    { label: t("statCritChance"), value: `${Math.round(crit.chance * 100)}%` },
    { label: t("statCritDamage"), value: `${Math.round(crit.mul * 100)}%` },
  ];
}
