// 화면 끌어 보기 (넓게 보는 대결: 쟁탈전·전쟁의 서막·기간토마키아, camera zoomFor)
// PC: 휠 버튼 누른 채 끌기 · 휠 버튼 한 번 누르기 = 내 캐릭터로 / 모바일: 오른쪽 두 손가락 끌기 (touchSticks) · 화면 버튼 '내 캐릭터로' (GameHud PanHint)
import { useSyncExternalStore } from "react";

let on = false;
let off = { x: 0, y: 0 };
/** 화면 1px = 게임 몇 px의 거꾸로 (playerScreenPos의 scale) */
let scale = () => 1;
const subs = new Set<() => void>();
const panned = () => off.x !== 0 || off.y !== 0;
const tell = () => subs.forEach((f) => f());

/** 내 캐릭터에서 화면 가운데까지 떨어진 거리 (게임 좌표) */
export const panOffset = (): { x: number; y: number } => off;

/** 화면 px만큼 끌기 (잡고 끄는 쪽으로 땅이 따라옴) */
export function panScreen(dx: number, dy: number): void {
  if (!on) return;
  const was = panned();
  const k = scale() || 1;
  off = { x: off.x - dx / k, y: off.y - dy / k };
  if (was !== panned()) tell();
}

/** 내 캐릭터로 돌아옴 */
export function resetPan(): void {
  if (!panned()) return;
  off = { x: 0, y: 0 };
  tell();
}

/** 방 끝에 닿으면 더 끌리지 않게 (camera가 맞춘 값) */
export function fitPan(x: number, y: number): void {
  off = { x, y };
}

/** 판 시작: 끌어 보기 켜기 + PC 휠 버튼 끌기 → 떼는 함수 */
export function bindPan(zone: HTMLElement, enabled: boolean, screenScale: () => number): () => void {
  on = enabled;
  scale = screenScale;
  off = { x: 0, y: 0 };
  tell();
  let drag: { x: number; y: number; moved: number } | null = null;
  const down = (e: MouseEvent) => void (e.button === 1 && on && (drag = { x: e.clientX, y: e.clientY, moved: 0 }));
  const move = (e: MouseEvent) => {
    if (!drag) return;
    drag.moved += Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y);
    panScreen(e.clientX - drag.x, e.clientY - drag.y);
    [drag.x, drag.y] = [e.clientX, e.clientY];
  };
  const up = (e: MouseEvent) => {
    if (e.button !== 1 || !drag) return;
    if (drag.moved < 4) resetPan();
    drag = null;
  };
  zone.addEventListener("mousedown", down);
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", up);
  return () => {
    on = false;
    zone.removeEventListener("mousedown", down);
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", up);
  };
}

/** 화면 버튼용: [끌어 보기가 켜졌는지, 옮겨져 있는지] */
export function usePan(): [boolean, boolean] {
  const subscribe = (f: () => void) => {
    subs.add(f);
    return () => void subs.delete(f);
  };
  const snap = useSyncExternalStore(subscribe, () => (on ? 1 : 0) + (panned() ? 2 : 0));
  return [(snap & 1) > 0, (snap & 2) > 0];
}
