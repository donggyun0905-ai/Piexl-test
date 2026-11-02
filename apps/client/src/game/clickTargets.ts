// 마우스·탭으로 누를 수 있는 것: 바닥 아이템(설명·층 보상 고르기)
import { mine, rewardChoices, type Pickup, type RunState } from "@pixel-rogue/shared";
import { viewH, viewW } from "./viewSize";
import { cameraFor } from "./camera";

/** 아이템을 가리켰다고 보는 거리 (게임 픽셀) */
const PICK_RADIUS = 9;

export interface ClickTarget {
  /** 층 보상 번호 (1~3), 0 = 아님 */
  pickChoice: number;
}

/** 화면 좌표 → 게임 좌표 (캔버스 밖이면 null) */
export function worldAt(run: RunState, canvas: HTMLCanvasElement, zoom: number, x: number, y: number): { x: number; y: number } | null {
  const rect = canvas.getBoundingClientRect();
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return null;
  const cam = cameraFor(run, zoom);
  return { x: cam.x + ((x - rect.left) / rect.width) * (viewW() / zoom), y: cam.y + ((y - rect.top) / rect.height) * (viewH() / zoom) };
}

/** 화면 좌표 아래의 바닥 아이템 (돈 제외) */
export function pickupAt(run: RunState, canvas: HTMLCanvasElement, zoom: number, x: number, y: number): Pickup | null {
  const w = worldAt(run, canvas, zoom, x, y);
  if (!w) return null;
  const { x: wx, y: wy } = w;
  let best: Pickup | null = null;
  let bestD = PICK_RADIUS * PICK_RADIUS;
  for (const pk of run.rooms[run.roomId]?.pickups ?? []) {
    if (pk.kind === "coin" || !mine(run, pk)) continue;
    const d = (pk.x - wx) ** 2 + (pk.y - wy) ** 2;
    if (d <= bestD) {
      bestD = d;
      best = pk;
    }
  }
  return best;
}

/** 바닥 아이템의 화면 좌표 (위쪽 끝, 설명 상자를 붙일 자리) */
export function pickupScreenPos(run: RunState, canvas: HTMLCanvasElement, zoom: number, pk: { x: number; y: number }): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const cam = cameraFor(run, zoom);
  return {
    x: rect.left + (((pk.x - cam.x) * zoom) / viewW()) * rect.width,
    y: rect.top + (((pk.y - cam.y) * zoom) / viewH()) * rect.height - 8 * zoom * (rect.height / viewH()),
  };
}

/** 누른 자리가 층 보상이면 그 입력, 아니면 null */
export function clickTargetAt(run: RunState, canvas: HTMLCanvasElement, zoom: number, x: number, y: number): ClickTarget | null {
  if (run.over) return null;
  const pk = pickupAt(run, canvas, zoom, x, y);
  if (pk) {
    const i = rewardChoices(run).indexOf(pk);
    if (i >= 0) return { pickChoice: i + 1 };
  }
  return null;
}
