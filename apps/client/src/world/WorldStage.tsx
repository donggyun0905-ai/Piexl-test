// 나라 필드 캔버스: 지도 그림을 받아 덩어리로 그리기 · 걷기(로비와 같은 walker) · 카메라가 따라감(지도 끝에서 멈춤) · 장소 앞에서 F
// 마지막 자리는 이 기기에 저장 (다시 들어오면 그 자리)
import type { CharacterId } from "@pixel-rogue/shared";
import { useEffect, useRef } from "react";
import { drawBody } from "../game/render/actors";
import { bindWalkInput, clampView, createWalker, fitCanvas, stepWalker } from "../lobby/walker";
import { loadText, saveText } from "../storage";
import { createChunkCache } from "./worldChunks";
import { canStandWorld, loadWorldMap, WTILE, type WorldMap } from "./worldMap";
import { shadow } from "./worldArt";
import { drawButterflies, drawCloudShadows, drawVignette, drawWaterFx } from "./worldFx";
import { drawPlace, drawPlaceLabel } from "./worldPlaceArt";
import { loadWorldArt } from "./worldTex";
import { here } from "./worldWarps";
import { pushTrees, type Drawable } from "./worldTrees";
import { hitsNpc, nearPlace, placeXY, type Place, type Region } from "./worldPlaces";

/** 걷는 속도 (로비보다 조금 빠름: 필드가 넓어서) */
const SPEED = 80;
const R = 5;
const POS_KEY = "worldPos";

interface Props {
  regionId: string;
  region: Region;
  /** 진영 색 (마을 깃발) */
  color: string;
  /** 걸어 다니는 내 캐릭터 */
  who: CharacterId;
  /** 장소 이름표 글자 */
  label: (p: Place) => string;
  paused: boolean;
  onNear: (p: Place | null) => void;
  onUse: (p: Place) => void;
  onLoaded?: (ok: boolean) => void;
  /** 문으로 들어오고 나갈 때 설 자리 (픽셀, 없으면 저장된 자리 → 처음 자리) */
  spawn?: readonly [number, number] | null;
}

function loadPos(regionId: string): [number, number] | null {
  try {
    const v = JSON.parse(loadText(POS_KEY) ?? "null") as { r: string; x: number; y: number } | null;
    return v && v.r === regionId ? [v.x, v.y] : null;
  } catch {
    return null;
  }
}

export function WorldStage({ regionId, region, color, who, label, paused, onNear, onUse, onLoaded, spawn }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const cb = useRef({ who, label, paused, onNear, onUse, onLoaded });
  // 들어온 자리(spawn)는 처음 그릴 때만 씀 (지역이 바뀌면 key로 새로 만듦)
  const spawnAt = useRef(spawn);
  useEffect(() => {
    cb.current = { who, label, paused, onNear, onUse, onLoaded };
  });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const [sx, sy] = spawnAt.current ?? loadPos(regionId) ?? [(region.start.tx + 0.5) * WTILE, (region.start.ty + 0.5) * WTILE];
    const me = createWalker(sx, sy);
    const view = { x: 0, y: 0, w: 320, h: 200 };
    let map: WorldMap | null = null;
    let chunks: ReturnType<typeof createChunkCache> | null = null;
    let near: Place | null = null;
    let alive = true;
    const base = import.meta.env.BASE_URL;
    // 지도 그림 + 땅 결·물건 그림(B안, 없으면 코드 그림)을 같이 받은 뒤 덩어리 만들기
    Promise.all([loadWorldMap(`${base}${region.map}`), loadWorldArt(base)]).then(
      ([m]) => {
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
        if (!cb.current.paused) stepWalker(me, input.keys, dt, SPEED, (x, y) => canStandWorld(m, x, y, R) && !hitsNpc(region, x, y, R));
        [here.r, here.x, here.y] = [regionId, me.x, me.y];
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
        drawWaterFx(ctx, m, view, t);
        // 장소·나무·나: 아래(발 y)가 큰 것을 나중에
        // 발판(문)은 늘 아래 · 가구는 아래쪽 끝 기준
        const foot = (p: Place) => (p.kind === "npc" ? 4 : p.kind === "deco" ? 6 : p.kind === "door" || p.kind === "exit" ? -16 : 0);
        // 화면 근처 장소만 (장식이 많은 지도)
        const near2 = (p: Place) => Math.abs(placeXY(p)[0] - (view.x + view.w / 2)) < view.w / 2 + 64 && Math.abs(placeXY(p)[1] - (view.y + view.h / 2)) < view.h / 2 + 96;
        const items: Drawable[] = region.places.filter(near2).map((p) => ({ y: placeXY(p)[1] + foot(p), draw: () => drawPlace(ctx, p, t, color) }));
        pushTrees(ctx, m, view, t, items);
        items.push({
          y: me.y,
          draw: () => shadow(ctx, Math.round(me.x), Math.round(me.y) + 1, 6, 2.2, 0.32),
        });
        items.push({
          y: me.y,
          draw: () => drawBody(ctx, cb.current.who, Math.round(me.x), Math.round(me.y - R), R, { faceX: me.fx, faceY: me.fy, moving: me.moving, casting: false, step: me.step }, me.moving ? Math.floor(t * 8) : 0),
        });
        items.sort((a, b) => a.y - b.y);
        for (const it of items) it.draw();
        drawButterflies(ctx, m, view, t);
        if (!region.indoor) drawCloudShadows(ctx, view, t);
        if (near) drawPlaceLabel(ctx, near, cb.current.label(near));
        // 2초마다 자리 저장 (움직였을 때만)
        if (now - saved > 2000 && me.moving) {
          saved = now;
          saveText(POS_KEY, JSON.stringify({ r: regionId, x: Math.round(me.x), y: Math.round(me.y) }));
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        drawVignette(ctx, canvas.width, canvas.height);
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
