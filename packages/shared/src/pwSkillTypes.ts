// 패왕전 스킬 정의 타입 (설계: docs/PW_SKILLS.md · 계산: sim/pwSkill · 캐릭터별 표: pwKits*)
import type { CharacterId } from "./characters";
import type { WeaponId } from "./content";

/** 스킬 모양: 지점(원) · 직선 · 부채꼴 · 자신 둘레·버프 · 돌진 · 순간이동 · 소환 */
export type PwShape = "point" | "line" | "cone" | "self" | "dash" | "blink" | "summon";

/** 맞은 상대에게: 피해(공격력 배율) · 기절·둔화·속박·침묵 틱 · 밀치기(+)·끌어오기(-) 세기 · 출혈·독 틱 */
export interface PwHit {
  dmg: number;
  stun?: number;
  slow?: number;
  root?: number;
  silence?: number;
  push?: number;
  dot?: number;
}

/** 나(아군)에게 거는 효과: 틱 · 공격력·이동·공격 속도 배율 · 받는 피해 배율 · 초당 회복(최대 체력 비율) · 둘레 아군도 */
export interface PwBuff {
  ticks: number;
  dmg?: number;
  move?: number;
  rate?: number;
  taken?: number;
  regen?: number;
  allies?: boolean;
  /** 투명 (상대에게 안 보이고 겨눠지지 않음) */
  hide?: boolean;
}

/** 소환 (맞지 않고 시간이 다하면 사라짐): 마리 수 · 틱 · 공격(PW.skillDmg 배율) · 사거리 · 공격 간격 틱 · 그림 */
export interface PwSummon {
  n: number;
  ticks: number;
  dmg: number;
  range: number;
  every: number;
  look: string;
  /** 움직이지 않음 (포탑·장판) */
  still?: boolean;
}

export interface PwSkillDef {
  /** 아이콘·이펙트 색을 빌려 올 무기 */
  icon: WeaponId;
  shape: PwShape;
  /** 사거리 (게임 픽셀) */
  range: number;
  /** 원 반경 · 줄 폭 · 부채꼴 반경 · 자신 둘레 반경 */
  radius: number;
  /** 부채꼴 반각 (라디안) */
  arc?: number;
  /** 재사용 대기 (초) */
  cd: number;
  /** 지점: 예고 뒤 터지기까지 틱 */
  delay?: number;
  /** 같은 자리에서 여러 번 (화살비·장판): 횟수 · 간격 틱 */
  repeat?: { n: number; every: number };
  hit?: PwHit;
  buff?: PwBuff;
  /** 아군 회복 (최대 체력 비율) */
  heal?: number;
  /** 돌진 속도 (틱당 픽셀) */
  speed?: number;
  /** 순간이동: 겨눈 상대 뒤로 */
  behind?: boolean;
  summon?: PwSummon;
  /** 이펙트 색 · 이펙트 종류 (pw 공용 그림) */
  tint: string;
  fx: PwFxStyle;
}

/** 공용 스킬 그림 모양 (render/pwSkillFx) */
export type PwFxStyle = "burst" | "meteor" | "pillar" | "rain" | "beam" | "wave" | "slash" | "spin" | "dash" | "blink" | "aura" | "field" | "heal" | "net" | "summon";

export interface PwKit {
  /** 평타 배율 (게이지형·평타형은 1.1~1.2, 스킬 피해에는 곱하지 않음) */
  basic: number;
  skills: readonly [PwSkillDef, PwSkillDef, PwSkillDef, PwSkillDef];
}

export type PwKits = Partial<Record<CharacterId, PwKit>>;
