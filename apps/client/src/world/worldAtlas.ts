// 전체 세계 지도 배치 (M 지도 창 '전체 지도 보기'): 나라·지역 필드마다 왼쪽 위 자리 (단위 = 필드 한 장, 가로 256칸 · 세로 160칸)
// docs/WORLD_MAP.md 4장 나라 배치를 따름 · 지옥은 실베르 악마의 문 너머(위) · 바람골·사이버 도시는 바다 건너 반대편 대륙 · 해저 도시는 탈라시아 앞바다
export const ATLAS: Readonly<Record<string, readonly [number, number]>> = {
  hell: [1, 0],
  silber: [1, 1],
  ascalon: [0, 2],
  terracore: [1, 2],
  virdia: [2, 2],
  desert: [0.5, 3],
  thalassia: [2.2, 3.1],
  seongguk: [0, 4],
  helios: [1.1, 4.4],
  undersea: [3.4, 3.7],
  windtown: [4.7, 1.7],
  cyber: [4.7, 3],
};
/** 전체 크기 (필드 장 수) · 필드 한 장이 차지하는 비율 (사이에 틈) */
export const ATLAS_W = 5.8;
export const ATLAS_H = 5.5;
export const ATLAS_FILL = 0.94;
