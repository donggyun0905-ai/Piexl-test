// 모바일 터치 조이스틱: 왼쪽 이동 · 오른쪽 조준(두 번 탭 = 대시) · 오른쪽 두 손가락 확대·축소·끌어 보기 · 짧은 탭 = 층 보상·미니맵 고르기
import { panScreen } from "./cameraPan";
import type { ClickTarget } from "./clickTargets";
import { getSettings } from "../settings";
import type { Stick } from "./sticks";

/** 조이스틱 반지름 (CSS 픽셀, 설정의 조이스틱 크기 반영. styles/game.css의 .stick-base 크기와 같게) */
function stickRadius(): number {
  return 44 * getSettings().stickScale;
}
/** 이동 조이스틱이 이만큼(CSS 픽셀) 움직여야 걷기 시작 (손가락 떨림으로 미끄러지지 않게) */
const MOVE_DEADZONE = 6;
/** 손가락이 원 가운데에서 이만큼(CSS 픽셀, 조이스틱 크기에 비례) 넘게 멀어질 때만 원이 따라옴 (그 안에서는 원이 제자리) */
const STICK_LEASH = 80;
const DOUBLE_TAP_MS = 280;
const TAP_MAX_MS = 220;
const TAP_MAX_MOVE = 12;

/** Controls가 넘겨주는 연결 */
export interface TouchHost {
  zone: HTMLElement;
  onTouch: () => void;
  clickTarget: (x: number, y: number) => ClickTarget | null;
  zoom: () => number;
  setZoom: (z: number) => void;
  queueDash: () => void;
  queueClick: (target: ClickTarget) => void;
  /** 조이스틱 다시 그리기 */
  redraw: () => void;
}

export class TouchSticks {
  move: Stick | null = null;
  aim: Stick | null = null;
  /** 두 손가락 확대·축소 + 끌어 보기 (오른쪽 자리) · mx·my: 지난 두 손가락 가운데 */
  pinch: { a: number; b: number; startDist: number; startZoom: number; mx: number; my: number } | null = null;
  private touchPoints = new Map<number, { x: number; y: number }>();
  private lastRightTapEnd = -1e9;

  constructor(private host: TouchHost) {}

  /** 누르고 있던 조이스틱을 놓은 것으로 */
  release(): void {
    this.move = null;
    this.aim = null;
  }

  down(e: PointerEvent): void {
    if (e.pointerType === "mouse") return; // 마우스 버튼은 mousedown에서
    e.preventDefault();
    this.host.onTouch();
    this.touchPoints.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const zone = this.host.zone;
    zone.setPointerCapture(e.pointerId);
    const rect = zone.getBoundingClientRect();
    const left = e.clientX - rect.left < rect.width / 2;
    const stick: Stick = { pointerId: e.pointerId, ox: e.clientX, oy: e.clientY, dx: 0, dy: 0, downAt: e.timeStamp, moved: 0 };
    if (left && !this.move) {
      this.move = stick;
    } else if (!left && this.aim && !this.pinch) {
      // 오른쪽에 두 번째 손가락 → 두 손가락 확대·축소 (그동안 조준·공격은 멈춤)
      const a = this.touchPoints.get(this.aim.pointerId);
      if (a) {
        this.pinch = {
          a: this.aim.pointerId,
          b: e.pointerId,
          startDist: Math.max(1, Math.hypot(a.x - e.clientX, a.y - e.clientY)),
          startZoom: this.host.zoom(),
          mx: (a.x + e.clientX) / 2,
          my: (a.y + e.clientY) / 2,
        };
        this.aim.dx = 0;
        this.aim.dy = 0;
      }
    } else if (!left && !this.aim) {
      // 오른쪽을 두 번 빠르게 탭하면 대시
      if (e.timeStamp - this.lastRightTapEnd < DOUBLE_TAP_MS) {
        this.host.queueDash();
        this.lastRightTapEnd = -1e9;
      }
      this.aim = stick;
    }
    this.host.redraw();
  }

  moveTo(e: PointerEvent): void {
    if (this.touchPoints.has(e.pointerId)) this.touchPoints.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.pinch && (e.pointerId === this.pinch.a || e.pointerId === this.pinch.b)) {
      const a = this.touchPoints.get(this.pinch.a);
      const b = this.touchPoints.get(this.pinch.b);
      if (!a || !b) return;
      this.host.setZoom(this.pinch.startZoom * (Math.hypot(a.x - b.x, a.y - b.y) / this.pinch.startDist));
      // 두 손가락을 같이 움직이면 화면을 끌어 봄 (넓게 보는 대결만)
      const [mx, my] = [(a.x + b.x) / 2, (a.y + b.y) / 2];
      panScreen(mx - this.pinch.mx, my - this.pinch.my);
      [this.pinch.mx, this.pinch.my] = [mx, my];
      return;
    }
    const stick = this.move?.pointerId === e.pointerId ? this.move : this.aim?.pointerId === e.pointerId ? this.aim : null;
    if (!stick) return;
    let dx = e.clientX - stick.ox;
    let dy = e.clientY - stick.oy;
    stick.moved = Math.max(stick.moved, Math.hypot(dx, dy));
    let len = Math.hypot(dx, dy);
    const radius = stickRadius();
    const leash = STICK_LEASH * getSettings().stickScale;
    if (len > leash) {
      // 손가락이 많이 멀어졌을 때만 원이 끌려옴 (조금 넘어간 정도는 제자리, 너무 멀리 가서 되돌리기 힘든 것만 막음)
      stick.ox = e.clientX - (dx / len) * leash;
      stick.oy = e.clientY - (dy / len) * leash;
      dx = e.clientX - stick.ox;
      dy = e.clientY - stick.oy;
      len = leash;
    }
    if (len > radius) {
      dx = (dx / len) * radius;
      dy = (dy / len) * radius;
    }
    stick.dx = dx;
    stick.dy = dy;
    this.host.redraw();
  }

  up(e: PointerEvent): void {
    if (e.pointerType === "mouse") return; // 마우스 버튼 뗌은 window mouseup에서
    this.touchPoints.delete(e.pointerId);
    if (this.pinch && (e.pointerId === this.pinch.a || e.pointerId === this.pinch.b)) {
      this.pinch = null;
      // 두 손가락 중 하나라도 떼면 조준도 끝냄 (남은 손가락으로 갑자기 공격하지 않게)
      this.aim = null;
      this.lastRightTapEnd = -1e9;
      this.host.redraw();
      return;
    }
    const stick = this.move?.pointerId === e.pointerId ? this.move : this.aim?.pointerId === e.pointerId ? this.aim : null;
    // 짧게 탭한 자리가 층 보상·미니맵 방이면 고르기·이동 (대시 두 번 탭으로 세지 않음)
    const tap = stick !== null && e.timeStamp - stick.downAt < TAP_MAX_MS && stick.moved < TAP_MAX_MOVE;
    const target = tap ? this.host.clickTarget(e.clientX, e.clientY) : null;
    if (target) this.host.queueClick(target);
    if (this.move?.pointerId === e.pointerId) this.move = null;
    if (this.aim?.pointerId === e.pointerId) {
      this.lastRightTapEnd = tap && !target ? e.timeStamp : -1e9;
      this.aim = null;
    }
    this.host.redraw();
  }
}

/** 이동 조이스틱 → 이동 값 (−1~1). 가운데 조금은 멈춤, 그 밖은 0부터 고르게 늘어남 */
export function moveVector(s: Stick): { x: number; y: number } {
  const len = Math.hypot(s.dx, s.dy);
  if (len <= MOVE_DEADZONE) return { x: 0, y: 0 };
  const k = Math.min(1, (len - MOVE_DEADZONE) / (stickRadius() - MOVE_DEADZONE)) / len;
  return { x: s.dx * k, y: s.dy * k };
}
