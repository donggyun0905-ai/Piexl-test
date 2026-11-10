// 시저스 상태 타입 (sim/scissors). 모두 선택 값 (예전 저장에는 없음)

/** 운명의 실: 묶인 적 id · 남은 틱 */
export interface SxThread {
  id: number;
  t: number;
}

export interface ScissorsPlayerState {
  /** 다음 가위질 (0 열기 · 1 닫기) · 마지막 가위질 뒤 틱 · 마지막 가위질(그림) */
  sxStep?: number;
  sxGap?: number;
  sxLast?: { k: number; t: number };
  /** 운명의 실 (나 → 적) */
  sxThreads?: SxThread[];
  /** 대시 중인지 (대시 시작을 한 번만 봄) · 각성 중 저절로 실을 끊기까지 틱 */
  sxDash?: boolean;
  sxSnip?: number;
  /** 지금 방 ("층/방", 바뀌면 실을 거둠) */
  sxRoom?: string;
}

/** 효과: 열기 (size = 거리, arc = cos) · 닫기 X자 절단 (size = 거리) · 실 끊김 (나 → 적 줄, size = 팽팽함 0~1) · 단죄 목 자르기 · 실 묶임 */
export type ScissorsFx = "sxOpenFx" | "sxCloseFx" | "sxCutFx" | "sxExecFx" | "sxTieFx";
