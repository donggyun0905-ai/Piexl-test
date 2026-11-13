// 걸어 다니기 공용 (로비 LobbyStage · 세계 지도 world/WorldStage): WASD·방향키·누른 곳으로 걷기 · F/Space/Enter로 쓰기
// 꾸밈·돌아다니기용이라 게임 계산(시드)과 상관없음

export interface Walker {
  x: number;
  y: number;
  /** 바라보는 방향 */
  fx: number;
  fy: number;
  moving: boolean;
  step: number;
  /** 누른 곳 (없으면 -1) */
  tx: number;
  ty: number;
}

export const createWalker = (x: number, y: number, fy = -1): Walker => ({ x, y, fx: 0, fy, moving: false, step: 0, tx: -1, ty: -1 });

/** 보이는 영역 (월드 좌표) */
export interface View {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** 키·누르기 받기. on()이 false면 무시 · onUse = F/Space/Enter. 돌려준 함수로 해제 */
export function bindWalkInput(canvas: HTMLCanvasElement, me: Walker, view: View, on: () => boolean, onUse: () => void) {
  const keys = new Set<string>();
  const down = (e: KeyboardEvent) => {
    if (!on()) return;
    keys.add(e.code);
    if (e.code === "KeyF" || e.code === "Space" || e.code === "Enter") onUse();
  };
  const up = (e: KeyboardEvent) => keys.delete(e.code);
  const tap = (e: PointerEvent) => {
    if (!on()) return;
    const rc = canvas.getBoundingClientRect();
    const k = rc.width / view.w;
    me.tx = view.x + (e.clientX - rc.left) / k;
    me.ty = view.y + (e.clientY - rc.top) / k;
  };
  window.addEventListener("keydown", down);
  window.addEventListener("keyup", up);
  canvas.addEventListener("pointerdown", tap);
  const dispose = () => {
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup", up);
    canvas.removeEventListener("pointerdown", tap);
  };
  return { keys, dispose };
}

/** 한 프레임 걷기: 가로·세로 따로 막히는지 봐서 벽을 따라 미끄러짐 */
export function stepWalker(me: Walker, keys: ReadonlySet<string>, dt: number, speed: number, stand: (x: number, y: number) => boolean): void {
  let mx = (keys.has("KeyD") || keys.has("ArrowRight") ? 1 : 0) - (keys.has("KeyA") || keys.has("ArrowLeft") ? 1 : 0);
  let my = (keys.has("KeyS") || keys.has("ArrowDown") ? 1 : 0) - (keys.has("KeyW") || keys.has("ArrowUp") ? 1 : 0);
  if (mx || my) me.tx = -1;
  else if (me.tx >= 0) {
    const dx = me.tx - me.x;
    const dy = me.ty - me.y;
    const d = Math.hypot(dx, dy);
    if (d < 2) me.tx = -1;
    else [mx, my] = [dx / d, dy / d];
  }
  const len = Math.hypot(mx, my);
  me.moving = len > 0;
  if (!len) return;
  mx /= len;
  my /= len;
  me.fx = mx;
  me.fy = my;
  me.step = Math.floor(performance.now() / 120);
  const nx = me.x + mx * speed * dt;
  const ny = me.y + my * speed * dt;
  if (stand(nx, me.y)) me.x = nx;
  if (stand(me.x, ny)) me.y = ny;
}

/** 캔버스 크기를 화면 크기·dpr에 맞춤 */
export function fitCanvas(canvas: HTMLCanvasElement): { cw: number; ch: number; dpr: number } {
  const dpr = window.devicePixelRatio || 1;
  const cw = canvas.clientWidth;
  const ch = canvas.clientHeight;
  if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) {
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
  }
  return { cw, ch, dpr };
}

export const clampView = (v: number, max: number) => Math.max(0, Math.min(max, v));
