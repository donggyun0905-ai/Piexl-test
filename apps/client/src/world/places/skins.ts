// 지역마다 바꿔 끼우는 그림 묶음 (Region.skin, 기본 이름 → 그림 이름, worldTex.setArtSkin)
// worldPlaces와 장소 파일이 같이 씀 (서로 불러오는 순환을 피하려고 따로 둠)

/** 건물 안 기본: 돌 바닥 */
export const INDOOR_SKIN: Readonly<Record<string, string>> = { floor: "stoneFloor" };
/** 성채·궁전 안: 돌벽 */
export const HALL_SKIN: Readonly<Record<string, string>> = { innerWall: "stoneWallIn" };
