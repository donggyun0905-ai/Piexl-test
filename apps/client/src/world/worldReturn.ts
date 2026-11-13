// 세계 지도 → 던전(혼자 하기)으로 갔다가 끝나면 메인 화면 대신 지도로 돌아오기 (TitleScreen이 처음 그릴 때 한 번 꺼냄)
let back = false;
export const markWorldReturn = (): void => {
  back = true;
};
export function takeWorldReturn(): boolean {
  const b = back;
  back = false;
  return b;
}
