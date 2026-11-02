// 경매장 사용자 그림 (render/propArt): 금빛 아치 무대 · 상품 받침(빈 · ??? 천 · 증강 보석) · 손님 의자 뒷모습 · 내 왕좌 · 진행자 4자세 · 값 팻말
// 각 함수는 그림을 그렸으면 true (아직 못 불러왔으면 false → render/auctionDraw의 코드 그림). 빛·글자·번호표 같은 효과는 auctionDraw가 그대로 그림
import { goingStage, mine, ROOM_MIN_Y, type AuctionState, type RunState } from "@pixel-rogue/shared";
import { drawProp, propReady } from "./propArt";

type Ctx = CanvasRenderingContext2D;

/** 무대 (위쪽 벽 바로 아래, 붉은 융단 바닥에 상품 받침이 놓이게) */
export const stageArt = (ctx: Ctx, cx: number): boolean => drawProp(ctx, "stage", 0, cx, ROOM_MIN_Y + 60, { w: 168 });

/** 상품 받침: 0 빈 받침(패시브는 위에 아이콘) · 1 ??? 천 · 2 증강 보석. (x, y) = 상품 자리 */
export const lotArt = (ctx: Ctx, x: number, y: number, frame: number, alpha: number): boolean => drawProp(ctx, "lotStand", frame, x, y + 13, { h: 18, alpha });

/** 손님 의자 뒷모습 (그림자 손님 위에 그려 머리만 보임) */
export const chairArt = (ctx: Ctx, x: number, y: number): boolean => drawProp(ctx, "guestChair", 0, x, y + 9, { h: 18 });

/** 내 왕좌: 빈 의자는 앞모습 · 앉으면 캐릭터를 그린 뒤 등받이를 그 위에 (drawSeatFront, 뒤에서 본 모습이라 머리만 보임) */
export const throneArt = (ctx: Ctx, x: number, y: number, sat: boolean): boolean => (sat ? propReady("throne") : drawProp(ctx, "throne", 0, x, y + 8, { h: 32 }));

/** 앉아 있으면 캐릭터 위에 왕좌 등받이 (render/index가 캐릭터 다음에 부름) */
export function drawSeatFront(ctx: Ctx, s: RunState): void {
  if (s.map.rooms[s.roomId]?.type !== "auction") return;
  const seat = s.rooms[s.roomId]?.pickups.find((pk) => pk.kind === "auction" && pk.itemId === "1" && mine(s, pk));
  if (seat) drawProp(ctx, "throne", 1, Math.round(seat.x), Math.round(seat.y) + 8, { h: 28 });
}

/** 진행자: 0 서 있음 · 2 망치를 듦(둘!) · 3 내리침(셋!) · 값 팻말을 옆에 세움 (팻말 판 가운데를 돌려줌 → 값 글자) */
export function hostArt(ctx: Ctx, s: RunState, a: AuctionState | null, x: number, y: number): { x: number; y: number } | null {
  const active = !!a && a.lot >= 0 && a.lot < a.lots.length;
  const stage = active ? goingStage(a, s.tick) : 0;
  const frame = !active ? 0 : stage >= 3 ? 3 : stage >= 2 ? 2 : 0;
  if (!drawProp(ctx, "auctioneer", frame, x, y + 14, { h: 44 })) return null;
  if (!active) return { x: 0, y: 0 };
  const lift = s.tick - a.t < 12 ? 3 : 0;
  if (!drawProp(ctx, "paddle", 0, x + 24, y - 2 - lift, { h: 28 })) return null;
  return { x: x + 24, y: y - 21 - lift };
}
