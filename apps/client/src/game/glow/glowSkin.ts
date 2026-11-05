// 스킨 효과 빛: 한정 스킨(범 풍류·여름 파도·승리 등)과 상점 이벤트 효과(타격·대기·걸음)가 만든 조각(limited/tigerFx의 parts)을 보고
// 같은 자리에 빛을 더함 — 섬광·빛 베기·K.O 도장·기둥은 크게, 불꽃·반짝임은 작게. 조각 모양 그리기는 그대로 Canvas 2D
import type { Part, TigerFx } from "../limited/tigerFx";
import type { GlowWatcher } from "./glowLayer";
import { hexColor } from "./glowParts";

/** 한 화면에 새로 빛을 붙이는 조각 최대 수 (조각이 한꺼번에 많이 생겨도 가볍게) */
const MAX_NEW = 40;

export function skinGlow(fx: TigerFx): GlowWatcher {
  const seen = new WeakSet<Part>();
  return (_s, parts, cues) => {
    let n = 0;
    for (const p of fx.parts) {
      if (seen.has(p)) continue;
      seen.add(p);
      if (n >= MAX_NEW || p.ground) continue;
      const c = hexColor(p.color, 0xffd860);
      const sec = p.max / 60;
      switch (p.kind) {
        case "flash":
          parts.spawn(p.x, p.y, { life: Math.max(0.2, sec), s0: p.size * 2.2, s1: p.size * 3.2, color: c, alpha: 0.85 });
          parts.burst(p.x, p.y, 6, 140, c, 0.35, 2);
          break;
        case "slash": {
          // 초승달 따라 빛 + 베는 방향으로 불티
          parts.spawn(p.x, p.y, { life: 0.22, s0: p.size * 1.6, s1: p.size * 2.2, color: c, alpha: 0.6 });
          for (let i = 0; i < 5; i++) {
            const a = p.rot + (Math.random() - 0.5) * 1.6;
            parts.spawn(p.x, p.y, { kind: "spark", vx: Math.cos(a) * 200, vy: Math.sin(a) * 200, life: 0.3, s0: 2.2, s1: 0.5, drag: 4, color: c });
          }
          break;
        }
        case "seal":
          // K.O 도장: 크게 번쩍
          parts.spawn(p.x, p.y, { life: 0.6, s0: p.size * 2, s1: p.size * 4, color: c, alpha: 0.9 });
          parts.spawn(p.x, p.y, { kind: "ring", life: 0.6, s0: p.size, s1: p.size * 6, color: c });
          cues.flash = Math.max(cues.flash, 0.3);
          break;
        case "pillar":
          for (let i = 0; i < 10; i++) parts.spawn(p.x + (Math.random() - 0.5) * p.size, p.y, { kind: "spark", vy: -140 - Math.random() * 120, life: 0.6, s0: 2.4, s1: 0.6, drag: 1, color: c });
          parts.spawn(p.x, p.y, { life: 0.5, s0: p.size * 1.5, s1: p.size * 2.5, color: c, alpha: 0.7 });
          break;
        case "ring":
          parts.spawn(p.x, p.y, { kind: "ring", life: Math.max(0.3, sec), s0: p.size * 0.5, s1: p.size * 2.5, color: c, alpha: 0.8 });
          break;
        case "spark":
        case "glint":
        case "theme":
          parts.spawn(p.x, p.y, { life: Math.min(0.5, Math.max(0.15, sec)), s0: Math.max(4, p.size * 2.5), s1: 1, color: c, alpha: 0.6 });
          break;
        case "claw":
          parts.spawn(p.x, p.y, { life: 0.25, s0: p.size * 2, s1: p.size * 2.6, color: c, alpha: 0.5 });
          break;
        default:
          continue;
      }
      n++;
    }
  };
}
