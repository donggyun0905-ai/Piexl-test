// 테스트 중 스위치 하나: true면 모든 스킨(한정·나만의 스킨 포함)을 가진 상태 · 도전과제 캐릭터 전부 열림 · 도감 전부 보임 · 로비 펫 전부 가짐.
// 라이브(main) 빌드는 VITE_TEST_OPEN=false로 꺼짐 (.github/workflows/deploy.yml, docs/LAUNCH.md) · 그 밖(시험 서버·내 컴퓨터)은 켜짐
export const TEST_OPEN: boolean = import.meta.env.VITE_TEST_OPEN !== "false";
