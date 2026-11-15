// 전체 세계 지도 그림(public/world/worldMap.webp, 원본 art/지도/world/worldMap.png) 위 지역 자리: [왼쪽, 위, 너비, 높이] (그림 대비 %)
// 그림을 바꾸면 이 상자도 그림에 맞춰 고침
export const ATLAS_ART_W = 2528;
export const ATLAS_ART_H = 1696;
export const ATLAS_BOX: Readonly<Record<string, readonly [number, number, number, number]>> = {
  hell: [38.3, 0.5, 15, 13],
  silber: [18.5, 6.5, 27.5, 18],
  ascalon: [7.5, 17.5, 15.5, 19.5],
  terracore: [23, 24, 15, 17],
  virdia: [38.5, 20, 18, 19],
  desert: [3, 38, 34, 28],
  thalassia: [63.5, 32.5, 15.5, 17],
  seongguk: [8.5, 59.5, 12.5, 24.5],
  helios: [33.5, 60, 17, 27],
  undersea: [58.5, 56, 19, 23.5],
  cyber: [77, 5, 14, 21],
  windtown: [81, 57, 15.5, 19.5],
};
