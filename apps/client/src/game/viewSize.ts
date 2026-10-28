// 보이는 게임 영역 크기: 보통은 방 크기(VIEW_WIDTH × VIEW_HEIGHT). 패왕전은 화면 비율에 맞춰 가로를 넓혀 좌우 빈칸 없이 꽉 채움
import { VIEW_HEIGHT, VIEW_WIDTH } from "@pixel-rogue/shared";

let wide = 1;
/** 가로 넓힘 배율 (1 = 보통) */
export function setViewWide(k: number): void {
  wide = k;
}
export const viewW = (): number => VIEW_WIDTH * wide;
export const viewH = (): number => VIEW_HEIGHT;
