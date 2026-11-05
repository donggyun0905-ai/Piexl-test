// 빛 효과 층 (PixiJS·WebGL): 게임 캔버스(Canvas 2D) 바로 위에 투명 캔버스를 겹쳐 빛나는 효과만 그림
// PixiJS는 처음 쓸 때 따로 불러옴 (첫 화면 로딩은 그대로) · WebGL이 안 되면 효과만 빠지고 게임은 그대로
import type { Application, Sprite } from "pixi.js";
import type { RunState } from "@pixel-rogue/shared";
import { getSettings } from "../../settings";
import { cameraFor } from "../camera";
import { viewW } from "../viewSize";
import { GlowParts, makeVignette } from "./glowParts";
import { GlowWatch, type GlowCues } from "./glowWatch";

export interface GlowLayer {
  /** 한 화면 그리기 (게임 화면을 그린 바로 뒤). stopped: 멈춤 중이면 효과도 멈춤 */
  frame(view: RunState, zoom: number, alpha: number, stopped: boolean): void;
  destroy(): void;
}

/** 설정에서 켜 두었는지 */
const wanted = (): boolean => getSettings().glowFx;

export function createGlowLayer(game: HTMLCanvasElement): GlowLayer {
  let app: Application | null = null;
  let parts: GlowParts | null = null;
  let hurtSp: Sprite | null = null;
  let flashSp: Sprite | null = null;
  let dead = false;
  let loading = false;
  let last = performance.now();
  const watch = new GlowWatch();
  const cues: GlowCues = { hurt: 0, flash: 0 };

  const start = async () => {
    loading = true;
    try {
      const P = await import("pixi.js");
      const a = new P.Application();
      await a.init({ backgroundAlpha: 0, antialias: false, autoStart: false, preference: "webgl", width: 16, height: 16 });
      if (dead) {
        a.destroy(true);
        return;
      }
      const el = a.canvas;
      el.className = "glow-layer";
      game.after(el);
      const layer = new P.Container();
      a.stage.addChild(layer);
      parts = new GlowParts(P, layer);
      hurtSp = new P.Sprite(makeVignette(P));
      hurtSp.tint = 0xff2040;
      flashSp = new P.Sprite(P.Texture.WHITE);
      flashSp.blendMode = "add";
      a.stage.addChild(hurtSp, flashSp);
      app = a;
    } catch {
      // WebGL이 안 되는 기기: 빛 효과 없이 진행
    }
  };

  /** 게임 캔버스와 같은 자리·크기·흔들림으로 맞춤 */
  const fit = (a: Application): { w: number; h: number } => {
    const el = a.canvas;
    const w = game.clientWidth;
    const h = game.clientHeight;
    const res = w > 0 ? game.width / w : 1;
    if (a.renderer.width !== w || a.renderer.height !== h || a.renderer.resolution !== res) a.renderer.resize(w, h, res);
    el.style.left = `${game.offsetLeft}px`;
    el.style.top = `${game.offsetTop}px`;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    el.style.transform = game.style.transform;
    return { w, h };
  };

  return {
    frame(view, zoom, alpha, stopped) {
      const now = performance.now();
      const dt = stopped ? 0 : Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!wanted()) {
        if (app) app.canvas.style.display = "none";
        return;
      }
      if (!app) {
        if (!loading) void start();
        return;
      }
      app.canvas.style.display = "";
      const { w, h } = fit(app);
      if (w <= 0) return;
      if (!stopped) watch.observe(view, parts!, cues);
      const cam = cameraFor(view, zoom, alpha);
      const f = (zoom * w) / viewW();
      parts!.update(dt, f, cam.x, cam.y);
      cues.hurt = Math.max(0, cues.hurt - dt * 2.2);
      cues.flash = Math.max(0, cues.flash - dt * 1.8);
      hurtSp!.width = w;
      hurtSp!.height = h;
      hurtSp!.alpha = cues.hurt * 0.75;
      flashSp!.width = w;
      flashSp!.height = h;
      flashSp!.alpha = cues.flash * cues.flash * 0.6;
      app.render();
    },
    destroy() {
      dead = true;
      if (app) {
        app.canvas.remove();
        app.destroy(true, { children: true, texture: true });
      }
      app = null;
    },
  };
}
