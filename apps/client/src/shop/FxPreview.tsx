// 이벤트 상점 효과 미리 보기: 작은 캔버스에 그 효과를 움직여 보여 줌 (타격 발톱 · 대기 기운 · 발자국 · 피해 숫자)
import { useEffect, useRef } from "react";
import { drawSkinNumber } from "../game/dmgSkins";
import { drawMap, GOLD, PAW } from "../game/limited/tigerArt";
import { drawTigerNumber } from "../game/limited/tigerNumber";
import { drawTigerSprite } from "../game/limited/tigerSprites";
import type { FxItem } from "./effects";
import { drawThemePreview } from "../game/limited/themeDraw";
import { ThemeFx } from "../game/limited/themeFx";
import { themeOf } from "./fxThemes";

const W = 64;
const H = 48;
/** 확대 배율 (게임 픽셀 → 화면) */
const K = 2;

function frame(ctx: CanvasRenderingContext2D, item: FxItem, tick: number, fx: ThemeFx | null): void {
  ctx.setTransform(K, 0, 0, K, 0, 0);
  ctx.clearRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = false;
  // 테마 세트: 효과 엔진을 그대로 돌려 보여 줌
  if (fx && item.slot !== "dmg") {
    fx.preview(item.slot, tick, W / 2, H / 2 - 4);
    drawThemePreview(ctx, fx, item.slot === "idle" ? { x: W / 2, y: H / 2 + 8 } : undefined);
    return;
  }
  if (item.slot === "dmg") {
    const age = tick % 24;
    const crit = Math.floor(tick / 24) % 2 === 1;
    // 숫자는 작아서 두 배로
    ctx.setTransform(K * 2, 0, 0, K * 2, 0, 0);
    ctx.font = "bold 6px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    if (item.dmg === "tiger") drawTigerNumber(ctx, crit ? "248" : "36", W / 4, H / 4 + 6 - age * 0.15, age, crit);
    else if (item.dmg && item.dmg !== "summer") drawSkinNumber(ctx, item.dmg, crit ? "248" : "36", W / 4, H / 4 + 6 - age * 0.15, age, crit);
    return;
  }
  ctx.save();
  ctx.translate(W / 2, H / 2 + (item.slot === "idle" ? 8 : 0));
  if (item.slot === "hit") drawTigerSprite(ctx, "claw", (tick >> 1) % 4, 2, 1.2);
  else if (item.slot === "idle") drawTigerSprite(ctx, "aura", (tick >> 2) % 4, 0, 0.9, 0.5, 38 / 48);
  else
    for (let i = 0; i < 3; i++) {
      // 발자국 셋이 차례로 찍힘
      if ((tick >> 3) % 4 < i) continue;
      ctx.save();
      ctx.translate(-16 + i * 16, i % 2 ? -4 : 4);
      ctx.rotate(Math.PI / 2 + Math.PI / 2);
      ctx.globalAlpha = 0.85;
      if (!drawTigerSprite(ctx, "paw", 0, 0, 1.5)) drawMap(ctx, PAW, { o: GOLD }, 0, 0, 1.5);
      ctx.restore();
    }
  ctx.restore();
}

export function FxPreview({ item }: { item: FxItem }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let tick = 0;
    const th = themeOf(item.theme);
    const slot = item.slot === "dmg" ? null : item.slot;
    const fx = th && slot ? new ThemeFx({ powerText: "", roar: () => {}, on: { hit: false, idle: false, walk: false, rest: false } }, { [slot]: th }) : null;
    const draw = () => {
      const ctx = ref.current?.getContext("2d");
      if (ctx) frame(ctx, item, tick++, fx);
    };
    draw();
    const id = window.setInterval(draw, 60);
    return () => window.clearInterval(id);
  }, [item]);
  return <canvas ref={ref} width={W * K} height={H * K} className="fx-preview" aria-hidden="true" />;
}
