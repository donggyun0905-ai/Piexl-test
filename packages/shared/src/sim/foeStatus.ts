// 로그 적이 플레이어에게 거는 상태이상 (때린 적 종류로, 맞았을 때만): 폭발풍뎅이 화상 · 땅 물고기 출혈 · 슬라임 부식 · 도플갱어 저주 · 그림자 공포 · 가디언 기절 · 성기사 속박 · 돌진 멧돼지 느림
// 베놈 독가스의 독·치유감소는 sim/terrain (p.poison·p.corrode). 남은 틱은 PlayerState의 db* 값 (화면 버프 창·머리 위 글자). 패왕전은 걸지 않음
import type { EnemyKind } from "../content";
import { statusImmune } from "./remnant";
import type { PlayerState, RunState } from "./types";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 출혈: 지속 틱 (3초) · 0.5초마다 피해 (+층 수 절반) */
  BLEED_TICKS: 180,
  BLEED_DMG: 2,
  /** 부식: 지속 틱 (4초) · 받는 피해 배율 */
  ROT_TICKS: 240,
  ROT_TAKEN: 1.2,
  /** 저주: 지속 틱 (4초) · 끝날 때 한꺼번에 터지는 피해 (+층 수) */
  CURSE_TICKS: 240,
  CURSE_DMG: 6,
  /** 공포: 공격하지 못하는 틱 (1초) */
  FEAR_TICKS: 60,
  /** 기절: 움직이지도·대시도·공격도 못 하는 틱 (0.5초) */
  STUN_TICKS: 30,
  /** 속박: 움직이지도·대시도 못 하는 틱 (1초, 공격은 함) */
  ROOT_TICKS: 60,
  /** 느림: 지속 틱 (2초) · 이동 속도 배율 */
  SLOW_TICKS: 120,
  SLOW_MUL: 0.6,
  /** 화상(폭발풍뎅이): 지속 틱 (4초) · 0.5초마다 피해 (+층 수 절반) */
  BURN_TICKS: 240,
  BURN_DMG: 3,
  /** 출혈·화상 피해 간격 (0.5초) */
  BLEED_EVERY: 30,
};
export { R as FOE_STATUS_RULES };

/** 플레이어가 받는 상태이상 남은 틱 (독·치유감소는 BossPlayerState의 poison·corrode) */
export interface FoeStatusPlayerState {
  dbBleed?: number;
  dbRot?: number;
  dbCurse?: number;
  dbFear?: number;
  dbStun?: number;
  dbRoot?: number;
  dbSlow?: number;
  dbBurn?: number;
}

type Field = keyof FoeStatusPlayerState;
const BY_FOE: Partial<Record<EnemyKind, [Field, keyof typeof R]>> = {
  landfish: ["dbBleed", "BLEED_TICKS"],
  slime: ["dbRot", "ROT_TICKS"],
  doppel: ["dbCurse", "CURSE_TICKS"],
  lurker: ["dbFear", "FEAR_TICKS"],
  guardian: ["dbStun", "STUN_TICKS"],
  paladin: ["dbRoot", "ROOT_TICKS"],
  charger: ["dbSlow", "SLOW_TICKS"],
  bombbug: ["dbBurn", "BURN_TICKS"],
  highorc: ["dbBleed", "BLEED_TICKS"],
};

/** 몸에 닿았을 때 상태이상을 거는 적 (가디언은 돌진 중일 때만 기절 · 성기사는 빛기둥만 속박, 몸에 닿으면 없음) */
export const touchFoe = (e: { kind: EnemyKind; phase: string }): EnemyKind | undefined =>
  e.kind === "paladin" || (e.kind === "guardian" && e.phase !== "charge") ? undefined : e.kind;

/** 맞은 뒤 (combat.damagePlayer 끝): 때린 적에 맞는 상태이상 (저주는 걸려 있으면 시간을 늘리지 않음 → 꼭 터짐) */
export function afflict(s: RunState, from: EnemyKind | undefined): void {
  const p = s.player;
  const row = from && BY_FOE[from];
  if (!row || s.pvp || statusImmune(p) || p.hp <= 0) return;
  const [field, ticks] = row;
  if (field === "dbCurse" && (p.dbCurse ?? 0) > 0) return;
  p[field] = Math.max(p[field] ?? 0, R[ticks]);
}

/** 틱마다 (자리마다, terrain에서): 시간 줄이기 → 이번 틱에 받을 피해 (출혈 0.5초마다 · 저주가 끝나는 틱) */
export function tickFoeStatus(p: PlayerState, depth: number): number {
  let dmg = 0;
  for (const f of ["dbBleed", "dbRot", "dbCurse", "dbFear", "dbStun", "dbRoot", "dbSlow", "dbBurn"] as const) {
    const v = p[f] ?? 0;
    if (v <= 0) continue;
    p[f] = v - 1;
    if (f === "dbBleed" && (v - 1) % R.BLEED_EVERY === 0) dmg += R.BLEED_DMG + Math.floor(depth / 2);
    if (f === "dbBurn" && (v - 1) % R.BLEED_EVERY === 0) dmg += R.BURN_DMG + Math.floor(depth / 2);
    if (f === "dbCurse" && v === 1) dmg += R.CURSE_DMG + depth;
  }
  return dmg;
}

/** 이동 배율: 기절·속박이면 0, 느림이면 줄어듦 */
export const foeMoveMul = (p: PlayerState): number => ((p.dbStun ?? 0) > 0 || (p.dbRoot ?? 0) > 0 ? 0 : (p.dbSlow ?? 0) > 0 ? R.SLOW_MUL : 1);
/** 대시 못 함 (기절·속박) */
export const foeHeld = (p: PlayerState): boolean => (p.dbStun ?? 0) > 0 || (p.dbRoot ?? 0) > 0;
/** 공격 못 함 (기절·공포 · 테라코어 과부하) */
export const foeNoAttack = (p: PlayerState): boolean => (p.dbStun ?? 0) > 0 || (p.dbFear ?? 0) > 0;
/** 받는 피해 배율 (부식) */
export const foeTakenMul = (p: PlayerState): number => ((p.dbRot ?? 0) > 0 ? R.ROT_TAKEN : 1);
