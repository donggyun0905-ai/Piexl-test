// 존 상태 타입 (sim/jaune·jnSkills·jnZap). 적응력·대기·나눠 때리기·돌진은 느아르와 같은 칸(nrTypes)을 씀 · 모두 선택 값

/** 황금 번개 추가 타격 하나: 맞을 적 · 피해 · 틱 */
export interface JnZap {
  id: number;
  dmg: number;
  at: number;
}

/** 날아가는 종언의 황천뢰 구체: 자리 · 방향 · 남은 거리 */
export interface JnBolt {
  x: number;
  y: number;
  dx: number;
  dy: number;
  left: number;
}

export interface JaunePlayerState {
  /** 기다리는 황금 번개 추가 타격 · 날아가는 종언의 구체 */
  jnZaps?: JnZap[];
  jnBolts?: JnBolt[];
}

/** 효과: 황뢰 할퀴기 · 벽력일섬 · 뇌광 연속격 · 황금 번개 주먹 · 지그재그 뇌격 · 황뢰 낙하 · 번개 분신 · 뇌전 구속 · 황금 뇌구 · 혼돈의 낙뢰 · 뇌신의 손아귀 · 천둥의 발자취 · 광란의 천뢰 · 초월 벽력일섬 · 황뢰 천수 · 종언의 황천뢰 · 번개 터짐 · 황금 번개 찌릿 */
export type JauneFx =
  | "jnClaw" | "jnFlash" | "jnRapid" | "jnFist" | "jnZig" | "jnFall" | "jnClone" | "jnBind"
  | "jnOrb" | "jnChaos" | "jnHand" | "jnStep" | "jnFrenzy" | "jnBeam" | "jnThousand" | "jnEnd" | "jnPop" | "jnZap";
