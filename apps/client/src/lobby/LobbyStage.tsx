// 로비 캔버스: 메인 화면 뒤 배경(천천히 훑어봄) · 직접 돌아다니기(파수꾼, WASD·방향키·누른 곳으로 걷기, 게임기 앞에서 F)
// 위 벽 가운데 문으로 들어가면 전시장(hallMap·hallArt), 전시장 아래 문으로 나오면 로비
import { useEffect, useRef } from "react";
import { createLobbyGlow } from "./lobbyGlow";
import { drawBody } from "../game/render/actors";
import { lobbyTheme } from "../shop/wallet";
import { drawLobby } from "./lobbyArt";
import { canStand, LOBBY_H, LOBBY_W, nearMachine, START, WALL_TOP, type GameId } from "./lobbyMap";
import { loadExhibits, type ExhibitId } from "./exhibits";
import { drawHall } from "./hallArt";
import { canStandHall, HALL_DOOR, HALL_H, HALL_START, HALL_W, LOBBY_BACK, LOBBY_DOOR, nearExhibit, type HallSpot } from "./hallMap";
import type { LobbyTheme } from "./lobbyThemes";

const SPEED = 64;
const R = 5;

interface Props {
  play: boolean;
  /** 게임기 앞에서 F (또는 버튼) */
  onGame?: (g: GameId) => void;
  /** 가까운 게임기가 바뀔 때 (화면 버튼용) */
  onNear?: (g: GameId | null) => void;
  /** 미니 게임 창이 떠 있으면 멈춤 */
  paused?: boolean;
  /** 전시장에 들어가고 나올 때 · 가까운 전시물이 바뀔 때 · 전시물 이름표 글자 */
  onRoom?: (hall: boolean) => void;
  onExhibit?: (id: HallSpot | null) => void;
  /** 전시물·기록집 앞에서 F → 기록 창 */
  onRead?: () => void;
  names?: Partial<Record<ExhibitId, string>>;
}

export function LobbyStage({ play, onGame, onNear, paused, onRoom, onExhibit, onRead, names }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const cb = useRef({ onGame, onNear, paused, onRoom, onExhibit, onRead, names });
  useEffect(() => {
    cb.current = { onGame, onNear, paused, onRoom, onExhibit, onRead, names };
  });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const glow = createLobbyGlow(canvas);
    const me = { x: START.x, y: START.y, fx: 0, fy: -1, moving: false, step: 0, tx: -1, ty: -1 };
    const keys = new Set<string>();
    let near: GameId | null = null;
    /** 지금 전시장 안인지 · 놓인 전시물 · 가까운 전시물 */
    let hall = false;
    let shown: ExhibitId[] = [];
    let nearEx: HallSpot | null = null;
    const stand = (x: number, y: number) => (hall ? canStandHall(x, y, R, shown) : canStand(x, y, R));
    const go = (toHall: boolean) => {
      hall = toHall;
      shown = toHall ? (Object.keys(loadExhibits()) as ExhibitId[]) : [];
      [me.x, me.y] = toHall ? [HALL_START.x, HALL_START.y] : [LOBBY_BACK.x, LOBBY_BACK.y];
      me.tx = -1;
      me.fy = toHall ? -1 : 1;
      cb.current.onRoom?.(toHall);
    };
    let last = performance.now();
    let raf = 0;
    const theme = lobbyTheme() as LobbyTheme;

    const down = (e: KeyboardEvent) => {
      if (!play || cb.current.paused) return;
      keys.add(e.code);
      if (e.code === "KeyF" || e.code === "Space" || e.code === "Enter") {
        if (near) cb.current.onGame?.(near);
        else if (nearEx) cb.current.onRead?.();
      }
    };
    const up = (e: KeyboardEvent) => keys.delete(e.code);
    const tap = (e: PointerEvent) => {
      if (!play || cb.current.paused) return;
      const rc = canvas.getBoundingClientRect();
      const k = rc.width / view.w;
      me.tx = view.x + (e.clientX - rc.left) / k;
      me.ty = view.y + (e.clientY - rc.top) / k;
    };
    const view = { x: 0, y: 0, w: LOBBY_W, h: LOBBY_H };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    canvas.addEventListener("pointerdown", tap);

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      const dpr = window.devicePixelRatio || 1;
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) {
        canvas.width = Math.round(cw * dpr);
        canvas.height = Math.round(ch * dpr);
      }
      // 보는 크기: 배경은 방의 70% 정도를 꽉 채워 천천히 훑고, 돌아다닐 때는 15×9칸쯤이 보이게
      const scale = play ? Math.max(cw / 260, ch / 160) : Math.max(cw / (LOBBY_W * 0.7), ch / (LOBBY_H * 0.7));
      view.w = cw / scale;
      view.h = ch / scale;
      if (play) {
        if (!cb.current.paused) move(dt);
        // 로비 위 문 ↔ 전시장 아래 문
        if (!hall && me.y <= WALL_TOP + 4 + R + 1 && Math.abs(me.x - LOBBY_DOOR.x) < LOBBY_DOOR.w / 2) go(true);
        else if (hall && me.y >= HALL_H - 4 - R - 1 && Math.abs(me.x - HALL_DOOR.x) < HALL_DOOR.w / 2) go(false);
        const [rw, rh] = hall ? [HALL_W, HALL_H] : [LOBBY_W, LOBBY_H];
        view.x = clamp(me.x - view.w / 2, rw - view.w);
        view.y = clamp(me.y - view.h / 2, rh - view.h);
        const ex = hall ? nearExhibit(me.x, me.y, shown) : null;
        if (ex !== nearEx) {
          nearEx = ex;
          cb.current.onExhibit?.(ex);
        }
        const n = hall ? null : (nearMachine(me.x, me.y)?.game ?? null);
        if (n !== near) {
          near = n;
          cb.current.onNear?.(n);
        }
      } else {
        view.x = ((Math.sin(t * 0.06) + 1) / 2) * Math.max(0, LOBBY_W - view.w);
        view.y = ((Math.sin(t * 0.045 + 1) + 1) / 2) * Math.max(0, LOBBY_H - view.h);
      }
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, -view.x * scale * dpr, -view.y * scale * dpr);
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#0c0a12";
      ctx.fillRect(view.x, view.y, view.w, view.h);
      const people = play
        ? [{ y: me.y, draw: () => drawBody(ctx, "warden", Math.round(me.x), Math.round(me.y - R), R, { faceX: me.fx, faceY: me.fy, moving: me.moving, casting: false, step: me.step }, me.moving ? Math.floor(t * 8) : 0) }]
        : [];
      if (hall) drawHall(ctx, t, shown, cb.current.names ?? {}, people);
      else drawLobby(ctx, theme, t, play ? near : null, people);
      glow.frame(view, scale, t, hall);
      raf = requestAnimationFrame(frame);
    };

    const move = (dt: number) => {
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
      const nx = me.x + mx * SPEED * dt;
      const ny = me.y + my * SPEED * dt;
      if (stand(nx, me.y)) me.x = nx;
      if (stand(me.x, ny)) me.y = ny;
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      glow.destroy();
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      canvas.removeEventListener("pointerdown", tap);
    };
  }, [play]);

  return <canvas ref={ref} className={play ? "lobby-canvas play" : "lobby-canvas"} aria-hidden={!play} />;
}

const clamp = (v: number, max: number) => Math.max(0, Math.min(max, v));
