// 던전 지형 상태 (sim/terrain): 지금 방의 진흙 · 용암 · 얕은 물 · 가시 함정 · 물 감전
/** [x, y, 너비, 높이] (픽셀) */
export type TerrainRect = [number, number, number, number];

export interface TerrainState {
  /** 이 지형이 놓인 방 */
  room: number;
  mud: TerrainRect[];
  lava: TerrainRect[];
  water: TerrainRect[];
  spikes: TerrainRect[];
  /** 물 감전: 남은 틱 (번개 해파리) · 감전 예고가 끝나는 틱 */
  shock?: number;
  shockAt?: number;
  /** 베놈 독가스 (sim/stalkers): 가운데 · 반경 · 사라지는 틱 */
  gas?: { x: number; y: number; r: number; until: number }[];
}

export interface TerrainRunState {
  /** 지금 방의 지형 (없으면 지형 없음) */
  terrain?: TerrainState;
}
