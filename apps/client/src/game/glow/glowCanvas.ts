// 빛 층 공용 (PixiJS·WebGL): 아무 화면 요소(캔버스·창) 위에 투명 캔버스를 겹쳐 빛 조각·붉은 테두리·번쩍임을 그림
// 게임 화면(glowLayer)·뽑기·타워 디펜스·로비·명예의 전당·메인 화면이 같이 씀. 겹칠 요소의 부모는 position: relative
// PixiJS는 처음 쓸 때 따로 불러옴 · WebGL이 안 되면 아무것도 그리지 않음 · 설정 '빛 효과'를 끄면 숨김
import type { Application, Sprite } from "pixi.js";
import { getSettings } from "../../settings";
import { GlowParts, makeVignette } from "./glowParts";

export interface GlowCues {
  /** 붉은 테두리 세기 (0~1) */
  hurt: number;
  /** 화면 전체 번쩍임 (0~1) */
  flash: number;
}

/** 설정에서 켜 두었는지 */
export const glowWanted = (): boolean => getSettings().glowFx;

/** 앱 지우기 옵션: true를 넘기면 PixiJS 전역 공용 자원까지 지워, 같이 떠 있는 다른 빛 층(게임 화면 등)이 그리다 오류로 멈춤 */
const KEEP_SHARED = { removeView: true, releaseGlobalResources: false };

export class GlowCanvas {
  /** 준비되면 생김 (그 전에는 null: 효과를 만들지 않고 넘어감) */
  parts: GlowParts | null = null;
  readonly cues: GlowCues = { hurt: 0, flash: 0 };
  private app: Application | null = null;
  private hurtSp: Sprite | null = null;
  private flashSp: Sprite | null = null;
  private dead = false;
  private loading = false;
  private last = performance.now();

  constructor(
    private target: HTMLElement,
    private className = "glow-layer",
  ) {}

  /** 지난 화면부터 흐른 초 (멈춤이면 0, 너무 길면 0.05로) */
  tick(stopped = false): number {
    const now = performance.now();
    const dt = stopped ? 0 : Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    return dt;
  }

  /** 그릴 수 있으면 true (켜져 있고 준비됨). 처음 부르면 PixiJS를 불러오기 시작 */
  ready(): boolean {
    if (!glowWanted()) {
      if (this.app) this.app.canvas.style.display = "none";
      return false;
    }
    if (!this.app) {
      if (!this.loading) void this.start();
      return false;
    }
    this.app.canvas.style.display = "";
    return true;
  }

  private async start(): Promise<void> {
    this.loading = true;
    try {
      const P = await import("pixi.js");
      const a = new P.Application();
      await a.init({ backgroundAlpha: 0, antialias: false, autoStart: false, preference: "webgl", width: 16, height: 16 });
      if (this.dead) {
        a.destroy(KEEP_SHARED);
        return;
      }
      a.canvas.className = this.className;
      this.target.after(a.canvas);
      const layer = new P.Container();
      a.stage.addChild(layer);
      this.parts = new GlowParts(P, layer);
      this.hurtSp = new P.Sprite(makeVignette(P));
      this.hurtSp.tint = 0xff2040;
      this.flashSp = new P.Sprite(P.Texture.WHITE);
      this.flashSp.blendMode = "add";
      a.stage.addChild(this.hurtSp, this.flashSp);
      this.app = a;
    } catch {
      // WebGL이 안 되는 기기: 빛 없이 진행
    }
  }

  /** 겹칠 요소의 화면 크기 (CSS 픽셀) */
  size(): { w: number; h: number } {
    return { w: this.target.clientWidth, h: this.target.clientHeight };
  }

  /** dt초 진행하고 그림. f = 좌표 1의 화면 크기, (cx, cy) = 보이는 영역 왼쪽 위 (화면 좌표로 그리면 f=1, 0, 0) */
  render(dt: number, f: number, cx: number, cy: number): void {
    const a = this.app;
    if (!a || !this.parts) return;
    const t = this.target;
    const { w, h } = this.size();
    if (w <= 0 || h <= 0) return;
    const res = t instanceof HTMLCanvasElement ? t.width / w : Math.min(2, window.devicePixelRatio || 1);
    if (a.renderer.width !== w || a.renderer.height !== h || a.renderer.resolution !== res) a.renderer.resize(w, h, res);
    const el = a.canvas;
    el.style.left = `${t.offsetLeft + t.clientLeft}px`;
    el.style.top = `${t.offsetTop + t.clientTop}px`;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    el.style.transform = t.style.transform;
    this.parts.update(dt, f, cx, cy);
    const c = this.cues;
    c.hurt = Math.max(0, c.hurt - dt * 2.2);
    c.flash = Math.max(0, c.flash - dt * 1.8);
    this.hurtSp!.width = this.flashSp!.width = w;
    this.hurtSp!.height = this.flashSp!.height = h;
    this.hurtSp!.alpha = c.hurt * 0.75;
    this.flashSp!.alpha = c.flash * c.flash * 0.6;
    try {
      a.render();
    } catch {
      // 빛 층 오류로 게임 화면이 멈추지 않게: 이 빛 층만 끔
      this.destroy();
    }
  }

  destroy(): void {
    this.dead = true;
    if (this.app) {
      const vignette = this.hurtSp?.texture;
      this.app.canvas.remove();
      // texture: true면 공용 흰 그림(Texture.WHITE)까지 지워짐 → 이 층이 만든 그림만 따로 지움
      this.app.destroy(KEEP_SHARED, { children: true });
      vignette?.destroy(true);
      this.parts?.destroy();
    }
    this.app = null;
    this.parts = null;
  }
}
