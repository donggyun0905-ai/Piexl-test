// 의사 전용. 기계공학자처럼 누르고 있는 동안 틱 피해 (공격 속도 2 = 0.15초마다), 초당 피해는 공격력 × 공격 속도.
// 무기마다 공격 방식이 다름 (medic, sim/medicWeapons): 주사기 · 메스 · 수혈 튜브 · 제세동기 · 봉합 바늘 · 마취 가스 · 링거 폴대 · 알약 산탄 · 구급 키트 · 붕대 채찍 · 구급차
import type { WeaponDef } from "./content";

/** 의사 무기 (kind "medic", 틱 피해는 laser와 같은 방식)의 공격 방식 (sim/medicWeapons) */
export type MedicGear = "syringe" | "scalpel" | "transfusion" | "defib" | "suture" | "gas" | "ivpole" | "pills" | "medkit" | "whip" | "ambulance";

export const DOCTOR_WEAPONS = {
  syringe: { id: "syringe", kind: "medic", damageMul: 1.52, attackSpeed: 2, range: 90, projectileSpeed: 0, medic: "syringe", exclusive: "doctor" },
  scalpel: { id: "scalpel", kind: "medic", damageMul: 1.6, attackSpeed: 2, range: 40, projectileSpeed: 0, arcCos: 0.5, medic: "scalpel", exclusive: "doctor" },
  transfusion: { id: "transfusion", kind: "medic", damageMul: 1.12, attackSpeed: 2, range: 90, projectileSpeed: 0, medic: "transfusion", exclusive: "doctor" },
  defibrillator: { id: "defibrillator", kind: "medic", damageMul: 1.28, attackSpeed: 2, range: 40, projectileSpeed: 0, arcCos: 0.3, medic: "defib", exclusive: "doctor" },
  sutureneedle: { id: "sutureneedle", kind: "medic", damageMul: 1.28, attackSpeed: 2, range: 90, projectileSpeed: 0, medic: "suture", exclusive: "doctor" },
  gascanister: { id: "gascanister", kind: "medic", damageMul: 1.28, attackSpeed: 2, range: 90, projectileSpeed: 0, medic: "gas", exclusive: "doctor" },
  ivpole: { id: "ivpole", kind: "medic", damageMul: 1.36, attackSpeed: 2, range: 48, projectileSpeed: 0, arcCos: -1, medic: "ivpole", exclusive: "doctor" },
  pillshot: { id: "pillshot", kind: "medic", damageMul: 1.44, attackSpeed: 2, range: 60, projectileSpeed: 0, shots: 7, medic: "pills", exclusive: "doctor" },
  medkitbomb: { id: "medkitbomb", kind: "medic", damageMul: 1.36, attackSpeed: 2, range: 90, projectileSpeed: 0, medic: "medkit", exclusive: "doctor" },
  bandagewhip: { id: "bandagewhip", kind: "medic", damageMul: 1.36, attackSpeed: 2, range: 80, projectileSpeed: 0, medic: "whip", exclusive: "doctor" },
  ambulance: { id: "ambulance", kind: "medic", damageMul: 1.44, attackSpeed: 2, range: 240, projectileSpeed: 0, medic: "ambulance", exclusive: "doctor" },
} as const satisfies Record<string, WeaponDef>;
