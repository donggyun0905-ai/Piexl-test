// 시련의 방 상태 (sim/trial·trialRun·trialRewards)

/** 시련: 1 암흑 속 몬스터 무리 · 2 체력 1로 몬스터 무리 · 3 보스 셋 · 4 끝없는 몬스터(점수) */
export type TrialKind = 1 | 2 | 3 | 4;

export interface TrialPlayerState {
  trial?: {
    /** 비석을 쓴 방 (층 × 1000 + 방) */
    rooms: number[];
    /** 이 판에 시련으로 얻은 점수 합계 (1000점이면 시련의 방이 더 나오지 않음) */
    total?: number;
    /** 거절 벌칙: 이 층 동안 암흑 · 이 층 동안 체력 1 (층 번호) */
    dark?: number;
    hp1?: number;
    /** 보상: 체력 가득 되살아남 남은 수 */
    revive?: number;
    /** 마지막으로 연 보상 상자에서 받은 것 (화면 알림: "rs:능력치" · "ps:능력치" · "pp:패시브" · "pu:사용 아이템" · "rv") */
    got?: { code: string; tick: number };
    /** 고르는 창을 연 보상 상자 (pickup id) */
    open?: number;
    /** 마지막 결과: 거절 벌칙 번호(1~10) 또는 시련 결과 점수 (화면 안내) */
    last?: { penalty?: number; kind?: TrialKind; score?: number; tick: number };
  };
}

export interface TrialRunState {
  /** 진행 중인 시련 */
  trialRun?: {
    kind: TrialKind;
    room: number;
    score: number;
    /** 무리: 남은 물결 · 보스: 남은 보스 · 끝없는: 다음 나오기까지 틱 */
    left: number;
    t: number;
    /** 시작 때 체력 (체력 1 시련·끝없는 시련이 끝나면 되돌림) · 시작 때까지 처치 수 (점수) */
    hp: number;
    kills: number;
    /** 시련 몬스터를 잡은 수 (시련 몬스터는 돈 없는 적이라 처치 수 kills에 안 들어감, combat이 셈) */
    got?: number;
    /** 시작한 틱 (화면 연출) */
    at: number;
  };
}
