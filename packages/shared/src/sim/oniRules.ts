// 오니 규칙 도우미: 능력치 바꾸기(공격력 → 최대 체력 · 공격 속도 → 재생력 · 사거리 → 추가 공격 효과 범위) · 신인족 배율 · 받는 피해 · 무기 조건 · 금봉 제한
import type { WeaponId } from "../content";
import type { StatMod } from "../stats";
import { ONI, ONI_WEAPONS } from "../weaponsOni";
import type { PlayerState } from "./types";

/** 오니 무기 기본 사거리 (사거리 아이템은 이 값 대비로 효과 범위가 늘어남) */
const BASE_RANGE = ONI_WEAPONS.thunderClub.range;

/** 아이템 등의 능력치 변화를 오니 규칙으로 바꾸고 신인족 배율을 더함 (재생력·효과 범위도 여기서 정함). 오니가 아니면 그대로 */
export function oniConvert(p: PlayerState, mods: readonly StatMod[]): StatMod[] {
  if (p.characterId !== "oni") return [...mods];
  const out: StatMod[] = [];
  let regen = ONI.regenBase;
  let reach = 1;
  for (const m of mods) {
    if (m.stat === "damage") {
      if (m.add !== undefined) out.push({ stat: "maxHp", add: m.add * ONI.hpPerDamage });
      if (m.mul !== undefined) out.push({ stat: "maxHp", mul: m.mul });
    } else if (m.stat === "attackSpeed") {
      if (m.mul !== undefined) regen += (m.mul - 1) * ONI.regenPerSpeed;
      if (m.add !== undefined) regen += m.add * ONI.regenPerSpeed;
    } else if (m.stat === "range") {
      if (m.mul !== undefined) reach *= m.mul;
      if (m.add !== undefined) reach *= 1 + m.add / BASE_RANGE;
    } else out.push(m);
  }
  p.oRegen = Math.max(0, regen);
  p.oReach = Math.max(0.5, reach);
  if ((p.oGod ?? 0) > 0) out.push({ stat: "damage", mul: ONI.godDamage }, { stat: "maxHp", mul: ONI.godHp });
  return out;
}

/** 받는 피해 배율 (오니는 30% 더 받음) */
export const oniTaken = (p: PlayerState) => (p.characterId === "oni" ? ONI.taken : 1);

/** 오니는 사용 아이템(회복약·방패·폭탄 등)을 줍거나 살 수 없음 (패시브는 됨) */
export const noUseItems = (p: PlayerState) => p.characterId === "oni";

/** 금봉을 들었으면: 상점 못 씀 · 다른 무기 못 잡음 · 여신의 선물 보너스 */
export const goldLocked = (p: PlayerState) => p.characterId === "oni" && p.weaponId === "goldClub";

/** 명계의 흑뢰봉(최대 체력 400 이상)·극한의 청전(재생력 60 이상)은 한 번 되살아난 뒤에만 나옴 */
export function oniWeaponOk(p: PlayerState, id: WeaponId): boolean {
  if (id === "blackThunder") return !!p.revived && p.stats.maxHp >= ONI.black.needHp;
  if (id === "azureThunder") return !!p.revived && (p.oRegen ?? ONI.regenBase) >= ONI.azure.needRegen;
  return true;
}
