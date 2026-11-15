// 나라 필드 캔버스: 지도 그림을 받아 덩어리로 그리기 · 걷기(로비와 같은 walker) · 카메라가 따라감(지도 끝에서 멈춤) · 장소 앞에서 F · 사냥터 몬스터(hunt/huntLayer)
// 마지막 자리는 이 기기에 저장 (다시 들어오면 그 자리)
import type { CharacterId } from "@pixel-rogue/shared";
import { useEffect, useRef } from "react";
import { drawBody } from "../game/render/actors";
import { bindWalkInput, clampView, createWalker, fitCanvas, stepWalker } from "../lobby/walker";
import { loadText, saveText } from "../storage";
import { createChunkCache } from "./worldChunks";
import { canStandWorld, loadWorldMap, tileAt, WTILE, type WorldMap } from "./worldMap";
import { shadow } from "./worldArt";
import { drawButterflies, drawCloudShadows, drawVignette, drawWaterFx } from "./worldFx";
import { drawEdgeMark, drawMark, drawPlace, drawPlaceLabel } from "./worldPlaceArt";
import { loadWorldArt, setArtSkin } from "./worldTex";
import { drawMood } from "./worldMood";
import { drawWeather, setLook } from "./worldWeather";
import { ambient, footstep } from "../audio/worldSounds";
import { groundTex } from "./worldGround";
import { skinName } from "./worldTex";
import { here, reviveAt } from "./worldWarps";
import { mobName } from "./hunt/huntNames";
import type { TextKey } from "../i18n";
import { pushTrees, type Drawable } from "./worldTrees";
import { hitsNpc, nearPlace, placeXY, skinOf, type Place, type Region } from "./worldPlaces";
import { createHuntLayer } from "./hunt/huntLayer";
import { createWoodcut } from "./woodcut";
import { setWorldPrefs, worldPrefs, ZOOM_MAX, ZOOM_MIN } from "./worldPrefs";
import { createAutoWalk } from "./worldPath";

/** 걷는 속도 (로비보다 조금 빠름: 필드가 넓어서) · Shift를 누르고 있으면 달리기 배율 */
const SPEED = 80;
const RUN = 1.6;
/** 이름표를 늘 띄울 장소 (장식 빼고) */
const NAMED = new Set(["town", "dungeon", "npc", "door", "exit", "warp", "pass", "sign"]);
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
  /** 화살표로 표시할 장소 id (아지트 안내 · 퀘스트) */
  mark?: string | null;
  /** 사냥터 몬스터를 잡음 (사냥터 id) */
  onKill?: (g: string) => void;
  /** 나무를 하나 벰 (woodcut) */
  onWood?: () => void;
  /** 바뀔 때마다 mark 장소까지 자동 걷기 시작 (worldPath) · 결과 알림 */
  auto?: number;
  onAuto?: (s: "go" | "done" | "stop" | "fail") => void;
  /** 화면 글자 (사냥 HUD·몬스터 이름표) */
  t: (k: TextKey) => string;
}

function loadPos(regionId: string): [number, number] | null {
  try {
    const v = JSON.parse(loadText(POS_KEY) ?? "null") as { r: string; x: number; y: number } | null;
    return v && v.r === regionId ? [v.x, v.y] : null;
  } catch {
    return null;
  }
}

export function WorldStage({ regionId, region, color, who, label, paused, onNear, onUse, onLoaded, spawn, mark, onKill, onWood, auto, onAuto, t: tx }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const cb = useRef({ who, label, paused, onNear, onUse, onLoaded, mark, onKill, onWood, auto, onAuto, tx });
  // 들어온 자리(spawn)는 처음 그릴 때만 씀 (지역이 바뀌면 key로 새로 만듦)
  const spawnAt = useRef(spawn);
  useEffect(() => {
    cb.current = { who, label, paused, onNear, onUse, onLoaded, mark, onKill, onWood, auto, onAuto, tx };
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
        setArtSkin(skinOf(region));
        setLook(regionId, !!region.indoor);
        chunks = createChunkCache(m);
        if (!canStandWorld(m, me.x, me.y, R)) [me.x, me.y] = [(region.start.tx + 0.5) * WTILE, (region.start.ty + 0.5) * WTILE];
        cb.current.onLoaded?.(true);
      },
      () => alive && cb.current.onLoaded?.(false),
    );
    // F: 장소가 가까우면 쓰기, 아니면 (필드에서) 나무 베기
    const wood = region.indoor ? null : createWoodcut();
    const useOrChop = () => {
      if (near) return cb.current.onUse(near);
      if (map && wood?.chop(map, me.x, me.y, me.fx, me.fy, performance.now()) === "got") cb.current.onWood?.();
    };
    const input = bindWalkInput(canvas, me, view, () => !!map && !cb.current.paused, useOrChop, (b, x, y, touch) => hunt?.point(b, x, y, touch) ?? false);
    // 사냥 (J·좌클릭 휘두르기 · K·우클릭 대시)
    const hunt = createHuntLayer(regionId, !region.indoor, me, input.keys, () => cb.current.who, () => !!map && !cb.current.paused, (g) => cb.current.onKill?.(g));
    // 마우스 휠: 확대·축소
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const z = worldPrefs().zoom * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
      setWorldPrefs({ zoom: Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z)) });
    };
    canvas.addEventListener("wheel", wheel, { passive: false });
    // 마우스 자리 (몬스터 이름표) · 지도 좌표
    const mouse = { x: -1e9, y: 0 };
    const hover = (e: PointerEvent) => {
      const rc = canvas.getBoundingClientRect();
      const k = rc.width / view.w;
      [mouse.x, mouse.y] = [view.x + (e.clientX - rc.left) / k, view.y + (e.clientY - rc.top) / k];
    };
    canvas.addEventListener("pointermove", hover);
    // 자동 걷기 · 마지막으로 받은 요청 번호
    const walk = createAutoWalk();
    let autoN = cb.current.auto ?? 0;
    let last = performance.now();
    let raf = 0;
    let saved = 0;
    // 발소리 다음 때 (걸을 때만, 0.32초마다)
    let nextStep = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      const { cw, ch, dpr } = fitCanvas(canvas);
      // 화면에서 빠지는 중(크기 0)이면 그리지 않음 (0으로 나누면 좌표가 NaN)
      if (cw <= 0 || ch <= 0) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const scale = Math.max(cw / 300, ch / 180) * worldPrefs().zoom;
      view.w = cw / scale;
      view.h = ch / scale;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#0c0a12";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (map && chunks) {
        const m = map;
        const stand = (x: number, y: number) => canStandWorld(m, x, y, R) && !hitsNpc(region, x, y, R);
        if ((cb.current.auto ?? 0) !== autoN) {
          autoN = cb.current.auto ?? 0;
          const goal = cb.current.mark ? region.places.find((p) => p.id === cb.current.mark) : undefined;
          cb.current.onAuto?.(walk.start(m, stand, me, goal));
        }
        const arrived = walk.step(me);
        if (arrived) cb.current.onAuto?.(arrived);
        const run = input.keys.has("ShiftLeft") || input.keys.has("ShiftRight") ? RUN : 1;
        if (!cb.current.paused && !hunt?.down()) stepWalker(me, input.keys, dt, SPEED * run, stand);
        // 창이 떠 멈추거나 쓰러지면 걷는 중이 아님 (발소리·걷는 그림이 계속 나던 문제)
        else me.moving = false;
        // 쓰러졌다 일어나면 가장 가까운 만진 순간 이동석 앞 (없으면 처음 자리)
        if (!cb.current.paused && hunt?.step(me, dt, stand)) [me.x, me.y] = reviveAt(region, regionId, me.x, me.y);
        if (me.moving && t >= nextStep) {
          nextStep = t + 0.32 / run;
          const g = groundTex(tileAt(m, Math.floor(me.x / WTILE), Math.floor(me.y / WTILE)));
          footstep(g && skinName(g));
        }
        ambient(regionId, !!region.indoor, t);
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
        if (region.mood !== "embers") drawWaterFx(ctx, m, view, t);
        // 장소·나무·나: 아래(발 y)가 큰 것을 나중에
        // 발판(문)은 늘 아래 · 가구는 아래쪽 끝 기준
        const foot = (p: Place) => (p.kind === "npc" ? 4 : p.kind === "deco" ? 6 : p.kind === "door" || p.kind === "exit" ? -16 : 0);
        // 화면 근처 장소만 (장식이 많은 지도)
        const near2 = (p: Place) => Math.abs(placeXY(p)[0] - (view.x + view.w / 2)) < view.w / 2 + 64 && Math.abs(placeXY(p)[1] - (view.y + view.h / 2)) < view.h / 2 + 96;
        const items: Drawable[] = region.places.filter(near2).map((p) => ({ y: placeXY(p)[1] + foot(p), draw: () => drawPlace(ctx, p, t, color) }));
        const shadows: (() => void)[] = [];
        pushTrees(ctx, m, view, t, items, shadows, wood ? (cx, cy) => wood.stump(cx, cy, now) : undefined, wood ? (cx, cy) => wood.shake(cx, cy, now) : undefined);
        hunt?.push(ctx, t, items, (x, y) => Math.abs(x - (view.x + view.w / 2)) < view.w / 2 + 32 && Math.abs(y - (view.y + view.h / 2)) < view.h / 2 + 32);
        for (const s of shadows) s();
        items.push({
          y: me.y,
          draw: () => shadow(ctx, Math.round(me.x), Math.round(me.y) + 1, 6, 2.2, 0.32),
        });
        if (hunt) items.push({ y: me.y - 0.1, draw: () => hunt.under(ctx, me) });
        items.push({
          y: me.y,
          draw: () => drawBody(ctx, cb.current.who, Math.round(me.x), Math.round(me.y - R), R, { faceX: me.fx, faceY: me.fy, moving: me.moving, casting: false, step: me.step }, me.moving ? Math.floor(t * 8) : 0),
        });
        items.sort((a, b) => a.y - b.y);
        for (const it of items) it.draw();
        const mc = region.moodCenter;
        drawWeather(ctx, view, t);
        if (region.mood) drawMood(ctx, region.mood, view, t, mc && [(mc[0] + 0.5) * WTILE, (mc[1] + 0.5) * WTILE]);
        else {
          drawButterflies(ctx, m, view, t);
          if (!region.indoor) drawCloudShadows(ctx, view, t);
        }
        hunt?.top(ctx, me);
        if (!cb.current.paused) hunt?.tip(ctx, mouse.x, mouse.y, (mb) => `${mobName(mb.g)} · ${cb.current.tx("wkMobInfo").replace("{n}", mb.g.power.toLocaleString())}`);
        wood?.top(ctx, m, me.x, me.y, me.fx, me.fy, now, !near && !cb.current.paused);
        if (worldPrefs().names) for (const p of region.places) if (p !== near && NAMED.has(p.kind) && near2(p)) drawPlaceLabel(ctx, p, cb.current.label(p));
        if (near) drawPlaceLabel(ctx, near, cb.current.label(near));
        const mk = cb.current.mark && region.places.find((p) => p.id === cb.current.mark);
        if (mk) drawMark(ctx, mk, t);
        if (mk) drawEdgeMark(ctx, mk, view, t);
        // 2초마다 자리 저장 (움직였을 때만)
        if (now - saved > 2000 && me.moving) {
          saved = now;
          saveText(POS_KEY, JSON.stringify({ r: regionId, x: Math.round(me.x), y: Math.round(me.y) }));
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        drawVignette(ctx, canvas.width, canvas.height);
        hunt?.hud(ctx, canvas.width, canvas.height, dpr * Math.min(1.6, Math.max(1, cw / 640)), cb.current.tx("wkDashReady"), (k) => cb.current.tx("wkDown").replace("{n}", String(k)));
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      input.dispose();
      hunt?.dispose();
      canvas.removeEventListener("wheel", wheel);
      canvas.removeEventListener("pointermove", hover);
      saveText(POS_KEY, JSON.stringify({ r: regionId, x: Math.round(me.x), y: Math.round(me.y) }));
    };
  }, [regionId, region, color]);

  return <canvas ref={ref} className="lobby-canvas play" />;
}
