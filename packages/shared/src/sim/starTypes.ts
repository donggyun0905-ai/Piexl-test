// 별지기용 상태 타입. 모두 선택 값 (예전 저장에는 없음)

/** 박힌 별: 자리 · 남은 틱 */
export interface StarNode {
  x: number;
  y: number;
  left: number;
}

export interface StarPlayerState {
  /** 박힌 별 · 별이 있는 방 ("층/방", 방을 옮기면 별이 사라짐) */
  stStars?: StarNode[];
  stWhere?: string;
  /** 이번 판에 박은 별 수 (황도 12궁) · 다음 별자리 터짐이 세짐 · 별의 가호로 생긴 보호막 */
  stPlaced?: number;
  stZodiac?: boolean;
  stWard?: number;
}
