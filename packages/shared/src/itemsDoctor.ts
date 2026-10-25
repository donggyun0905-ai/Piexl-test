// 의사 전용 패시브 (의사 무기의 모든 공격에 효과, 한 판에 하나씩). 수치는 sim/heal·medicWeapons의 상수
import type { PassiveDef } from "./items";

export const DOCTOR_PASSIVES = {
  /** 공격 회복률 4% → 9% */
  woundSuture: { id: "woundSuture", mods: [], exclusive: "doctor", effect: true },
  /** 보호막 최대치 최대 체력의 35% → 60% */
  healthCare: { id: "healthCare", mods: [], exclusive: "doctor", effect: true },
  /** 보호막이 있는 동안 피해 +20% */
  robust: { id: "robust", mods: [], exclusive: "doctor", effect: true },
  /** 처치하면 체력 3 회복 (초당 회복 상한에 포함) */
  firstAid: { id: "firstAid", mods: [], exclusive: "doctor", effect: true },
  /** 체력이 가득 찬 채로 3초 유지하면 다음 공격 피해 3배 */
  checkup: { id: "checkup", mods: [], exclusive: "doctor", effect: true },
  /** 보호막이 최대일 때 공격 속도 +25% */
  overtreat: { id: "overtreat", mods: [], exclusive: "doctor", effect: true },
  /** 포션·회복 아이템의 회복량 +50% */
  prescription: { id: "prescription", mods: [], exclusive: "doctor", effect: true },
  /** 받는 피해 -15%, 맞은 뒤 1초간 이동 속도 +25% */
  doctorGown: { id: "doctorGown", mods: [], exclusive: "doctor", effect: true },
  /** 근접·장판·폭발 범위 +25%, 투사체 사거리·구급차 너비 +20% */
  surgery: { id: "surgery", mods: [], exclusive: "doctor", effect: true },
  /** 보호막이 막은 피해의 200%를 주변 적에게 돌려줌 (0.3초에 한 번, 그 사이 막은 양은 모아서) */
  antibody: { id: "antibody", mods: [], exclusive: "doctor", effect: true },
} as const satisfies Record<string, PassiveDef>;
