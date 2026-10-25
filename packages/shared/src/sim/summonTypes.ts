// 소환술사·풋내기용 상태 타입. 모두 선택 값 (예전 저장에는 없음)
import type { StatKey } from "../stats";
import type { SummonKind } from "../weaponsSummon";
import type { ProjectileState } from "./types";

/** 소환수가 쏜 탄인지 (소환수 공격은 적을 밀지 않고 피해만) */
export const summonShot = (pr: ProjectileState) => pr.spirit === "fireball" || pr.spirit === "bone" || pr.spirit === "spore" || pr.spirit === "fairy";

/** 소환수 하나: 자리 · 다음 공격까지 틱 · 남은 틱 · 바라보는 쪽(그리기용) · 독버섯이 서 있는 자리 · 요정이 도는 각도 순번 */
export interface Summoned {
  id: number;
  kind: SummonKind;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  r: number;
  cd: number;
  life: number;
  face: number;
  slot: number;
}

/** 풋내기: 레벨 · 지금 경험치 · 남은 스탯 포인트 · 찍은 스탯 수 · 치명타 굴린 횟수 (시드용) */
export interface NovicePlayerState {
  lv?: number;
  exp?: number;
  points?: number;
  alloc?: Partial<Record<StatKey | "critChance" | "critDamage", number>>;
  critRolls?: number;
}

export interface SummonPlayerState {
  summons?: Summoned[];
  /** 채찍으로 맞힌 적 수 (다 차면 소환) · 채찍질로 소환수가 빨라진 남은 틱 */
  summonCharge?: number;
  lashTicks?: number;
}
