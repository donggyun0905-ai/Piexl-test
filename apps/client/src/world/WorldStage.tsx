// 나라 필드 캔버스: 지도 그림을 받아 덩어리로 그리기 · 걷기(로비와 같은 walker) · 카메라가 따라감(지도 끝에서 멈춤) · 장소 앞에서 F
// 마지막 자리는 이 기기에 저장 (다시 들어오면 그 자리)
import { useEffect, useRef } from "react";
import { drawBody } from "../game/render/actors";
import { bindWalkInput, clampView, createWalker, fitCanvas, stepWalker } from "../lobby/walker";
import { loadText, saveText } from "../storage";
import { createChunkCache } from "./worldChunks";
import { canStandWorld, loadWorldMap, WTILE, type WorldMap } from "./worldMap";
import { drawPlace, drawPlaceLabel } from "./worldPlaceArt";
import { nearPlace, placeXY, type Place, type Region } from "./worldPlaces";

/** 걷는 속도 (로비보다 조금 빠름: 필드가 넓어서) */
const SPEED = 80;
const R = 5;
const POS_KEY = "worldPos";

interface Props {
  regionId: string;
  region: Region;
  /** 진영 색 (마을 깃발) */
  color: string;
  /** 장소 이름표 글자 */
  label: (p: Place) => string;
  paused: boolean;
  onNear: (p: Place | null) => void;
  onUse: (p: Place) => void;
  onLoaded?: (ok: boolean) => void;
}

function loadPos(regionId: string): [number, number] | null {
  try {
    const v = JSON.parse(loadText(POS_KEY) ?? "null") as { r: string; x: number; y: number } | null;
    return v && v.r === regionId ? [v.x, v.y] : null;
  } catch {
    return null;
  }
}

export function WorldStage({ regionId, region, color, label, paused, onNear, onUse, onLoaded }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const cb = useRef({ label, paused, onNear, onUse, onLoaded });
  useEffect(() => {
    cb.current = { label, paused, onNear, onUse, onLoaded };
  });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const [sx, sy] = loadPos(regionId) ?? [(region.start.tx + 0.5) * WTILE, (region.start.ty + 0.5) * WTILE];
    const me = createWalker(sx, sy);
    const view = { x: 0, y: 0, w: 320, h: 200 };
    let map: WorldMap | null = null;
    let chunks: ReturnType<typeof createChunkCache> | null = null;
    let near: Place | null = null;
    let alive = true;
    loadWorldMap(`${import.meta.env.BASE_URL}${region.map}`).then(
      (m) => {
        if (!alive) return;
        map = m;
        chunks = createChunkCache(m);
        if (!canStandWorld(m, me.x, me.y, R)) [me.x, me.y] = [(region.start.tx + 0.5) * WTILE, (region.start.ty + 0.5) * WTILE];
        cb.current.onLoaded?.(true);
      },
      () => alive && cb.current.onLoaded?.(false),
    );
    const input = bindWalkInput(canvas, me, view, () => !!map && !cb.current.paused, () => near && cb.current.onUse(near));
    let last = performance.now();
    let raf = 0;
    let saved = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      const { cw, ch, dpr } = fitCanvas(canvas);
      const scale = Math.max(cw / 300, ch / 180);
      view.w = cw / scale;
      view.h = ch / scale;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#0c0a12";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (map && chunks) {
        const m = map;
        if (!cb.current.paused) stepWalker(me, input.keys, dt, SPEED, (x, y) => canStandWorld(m, x, y, R));
        const n = nearPlace(region, me.x, me.y);
        if (n !== near) {
          near = n;
          cb.current.onNear(n);
        }
        const mw = m.cols * WTILE;
        const mh = m.rows * WTILE;
        // 지도가 화면보다 작으면 가운데
        view.x = mw < view.w ? (mw - view.w) / 2 : clampView(me.x - view.w / 2, mw - view.w);
        view.y = mh < view.h ? (mh - view.h) / 2 : clampView(me.y - view.h / 2, mh - view.h);
        ctx.setTransform(scale * dpr, 0, 0, scale * dpr, -Math.round(view.x * scale * dpr), -Math.round(view.y * scale * dpr));
        ctx.imageSmoothingEnabled = false;
        chunks.draw(ctx, view);
        // 장소·나: 아래(발 y)가 큰 것을 나중에
        const items: { y: number; draw: () => void }[] = region.places.map((p) => ({ y: placeXY(p)[1], draw: () => drawPlace(ctx, p, t, color) }));
        items.push({
          y: me.y,
          draw: () => drawBody(ctx, "warden", Math.round(me.x), Math.round(me.y - R), R, { faceX: me.fx, faceY: me.fy, moving: me.moving, casting: false, step: me.step }, me.moving ? Math.floor(t * 8) : 0),
        });
        items.sort((a, b) => a.y - b.y);
        for (const it of items) it.draw();
        if (near) drawPlaceLabel(ctx, near, cb.current.label(near));
        // 2초마다 자리 저장 (움직였을 때만)
        if (now - saved > 2000 && me.moving) {
          saved = now;
          saveText(POS_KEY, JSON.stringify({ r: regionId, x: Math.round(me.x), y: Math.round(me.y) }));
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      input.dispose();
      saveText(POS_KEY, JSON.stringify({ r: regionId, x: Math.round(me.x), y: Math.round(me.y) }));
    };
  }, [regionId, region, color]);

  return <canvas ref={ref} className="lobby-canvas play" />;
}
