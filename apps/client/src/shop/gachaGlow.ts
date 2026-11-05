// 뽑기 빛 (PixiJS 층, game/glow/GlowCanvas): 뽑기 화면 전체 위에 겹쳐, 카드가 빛날 때 등급 색으로 터짐
// 한정(무지개): 빛기둥·고리 여러 겹·화면 번쩍 · 그 밖: 보라·초록 빛과 불티 · 봉투를 뜯을 때 흰 빛
import { useEffect, useRef } from "react";
import { GlowCanvas } from "../game/glow/glowCanvas";
import type { PrizeGlow } from "./GachaPrize";

const RAINBOW = [0xff5a8a, 0xffd040, 0x7aff8a, 0x5ad0ff, 0xc88aff];
const COLOR: Record<string, number> = { purple: 0xc88aff, green: 0x7aff8a };

export type GachaBurst = (el: Element | null, kind: PrizeGlow | "open") => void;

/** 뽑기 화면(stage)에 빛 층을 붙이고, 터뜨리는 함수를 돌려줌 */
export function useGachaGlow(stage: React.RefObject<HTMLElement | null>): GachaBurst {
  const glow = useRef<GlowCanvas | null>(null);
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const g = new GlowCanvas(el, "glow-layer gacha-glow");
    glow.current = g;
    let raf = 0;
    const loop = () => {
      const dt = g.tick();
      if (g.ready()) g.render(dt, 1, 0, 0);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      g.destroy();
      glow.current = null;
    };
  }, [stage]);

  return (target, kind) => {
    const g = glow.current;
    const parts = g?.parts;
    const st = stage.current;
    if (!g || !parts || !st) return;
    const s = st.getBoundingClientRect();
    const r = (target ?? st).getBoundingClientRect();
    const x = r.left - s.left + r.width / 2;
    const y = r.top - s.top + r.height / 2;
    const size = Math.max(40, Math.min(r.width, r.height));
    if (kind === "open") {
      parts.spawn(x, y, { life: 0.6, s0: size, s1: size * 3, color: 0xffffff, alpha: 0.8 });
      parts.burst(x, y, 30, 500, 0xfff1c1, 0.7, 4);
      return;
    }
    if (kind === "rainbow") {
      g.cues.flash = 0.8;
      RAINBOW.forEach((c, i) => parts.spawn(x, y, { kind: "ring", life: 0.6 + i * 0.15, s0: size * 0.3, s1: size * (2.5 + i * 0.6), color: c }));
      for (let i = 0; i < 40; i++) parts.spawn(x + (Math.random() - 0.5) * r.width, y + r.height / 2, { kind: "spark", vy: -300 - Math.random() * 500, life: 0.9, s0: 5, s1: 1, drag: 1, color: RAINBOW[i % RAINBOW.length]! });
      RAINBOW.forEach((c) => parts.burst(x, y, 12, 520, c, 0.9, 4));
      parts.spawn(x, y, { life: 1, s0: size * 1.2, s1: size * 2.4, color: 0xffffff, alpha: 0.9 });
      return;
    }
    const c = COLOR[kind] ?? 0xfff1c1;
    parts.spawn(x, y, { life: 0.5, s0: size * 0.8, s1: size * 1.8, color: c, alpha: 0.8 });
    parts.spawn(x, y, { kind: "ring", life: 0.5, s0: size * 0.3, s1: size * 2, color: c });
    parts.burst(x, y, 16, 340, c, 0.6, 3.2);
  };
}
