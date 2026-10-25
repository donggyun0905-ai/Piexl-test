// 바닥 무기와 지금 든 무기 비교 (내 패시브까지 반영한 실제 수치)
import { baseStats, computeStats, WEAPONS, type RunState, type WeaponDef, type WeaponId } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { itemName } from "../i18n/items";

export interface CompareRow {
  label: string;
  /** 바닥 무기의 값 */
  value: string;
  /** 지금 무기와의 차이 (부호 포함 글자) · 같으면 빈 글자 */
  delta: string;
  /** 1 = 좋아짐, -1 = 나빠짐, 0 = 같음 */
  better: -1 | 0 | 1;
}

export interface WeaponCompare {
  /** 비교 대상(지금 든 무기) 이름 */
  currentName: string;
  rows: CompareRow[];
}

const round = (v: number) => Math.round(v * 10) / 10;

/** 무기 하나의 실제 수치: 공격력(한 발)·공격 속도·사거리·초당 피해 */
function statsOf(run: RunState, weaponId: WeaponId) {
  const p = run.player;
  const s = computeStats(baseStats(p.characterId, weaponId), p.mods);
  const w: WeaponDef = WEAPONS[weaponId];
  return { damage: s.damage, attackSpeed: s.attackSpeed, range: s.range, dps: s.damage * (w.shots ?? 1) * s.attackSpeed };
}

export function compareWeapon(run: RunState, weaponId: WeaponId, lang: Lang, t: (k: TextKey) => string): WeaponCompare | null {
  const current = run.player.weaponId;
  if (weaponId === current) return null;
  const a = statsOf(run, weaponId);
  const b = statsOf(run, current);
  const row = (label: string, x: number, y: number): CompareRow => {
    const d = round(x - y);
    return { label, value: String(round(x)), delta: d === 0 ? "" : `${d > 0 ? "+" : ""}${d}`, better: d > 0 ? 1 : d < 0 ? -1 : 0 };
  };
  return {
    currentName: itemName("weapon", current, lang),
    rows: [
      row(t("statDps"), a.dps, b.dps),
      row(t("statDamage"), a.damage, b.damage),
      row(t("statAttackSpeed"), a.attackSpeed, b.attackSpeed),
      row(t("statRange"), a.range, b.range),
    ],
  };
}
