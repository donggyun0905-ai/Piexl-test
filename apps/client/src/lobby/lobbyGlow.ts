// 로비 빛 (PixiJS 층, game/glow/GlowCanvas): 메인 화면 뒤 배경·돌아다니기 로비 위에 겹침
// 로비: 바닥 무대 조명 빛 웅덩이 · 미러볼 반짝임 · 색종이 반짝 · 게임기 화면 빛 · 전시장: 전시물 금빛 · 창빛 속 떠다니는 먼지
import { GlowCanvas } from "../game/glow/glowCanvas";
import { hexColor } from "../game/glow/glowParts";
import { EXHIBIT_SPOTS, HALL_W } from "./hallMap";
import { LOBBY_H, LOBBY_W, MACHINES, TILE, WALL_TOP } from "./lobbyMap";

const COLORS = [0xff5a8a, 0xffd040, 0x5ad0ff, 0x7aff8a, 0xc88aff, 0xff9a3a];

export interface LobbyGlow {
  /** view: 보이는 영역 왼쪽 위(로비 좌표) · scale: 로비 1픽셀의 CSS 크기 · t: 초 */
  frame(view: { x: number; y: number }, scale: number, t: number, hall: boolean): void;
  destroy(): void;
}

export function createLobbyGlow(canvas: HTMLCanvasElement): LobbyGlow {
  const glow = new GlowCanvas(canvas, "glow-layer lobby-glow");
  let n = 0;
  return {
    frame(view, scale, t, hall) {
      const dt = glow.tick();
      if (!glow.ready() || !glow.parts) return;
      const parts = glow.parts;
      n++;
      if (hall) {
        for (const e of EXHIBIT_SPOTS) if (n % 30 === 0) parts.spawn(e.x, e.y, { life: 1.2, s0: e.hw * 0.8, s1: e.hw, color: 0xffd98a, alpha: 0.25 });
        if (n % 6 === 0) parts.spawn(Math.random() * HALL_W, WALL_TOP + Math.random() * 120, { vx: (Math.random() - 0.5) * 4, vy: 3 + Math.random() * 4, life: 3, s0: 1.6, s1: 0.4, color: 0xfff1c8, alpha: 0.7 });
      } else {
        // 바닥 조명 (party.drawFloorLights와 같은 자리): 수명이 짧은 빛을 매 화면 다시 놓아 따라 움직이게
        for (let i = 0; i < 4; i++) {
          const a = t * 0.5 + (i * Math.PI) / 2;
          const x = LOBBY_W / 2 + Math.cos(a) * 90;
          const y = LOBBY_H / 2 + 20 + Math.sin(a * 1.3) * 40;
          parts.steady(x, y, 46, COLORS[(i + Math.floor(t / 2)) % COLORS.length]!, 0.45);
        }
        // 미러볼 반짝임·빛살
        const mx = LOBBY_W / 2;
        const my = WALL_TOP - 3;
        if (n % 4 === 0) parts.spawn(mx + (Math.random() - 0.5) * 6, my + (Math.random() - 0.5) * 6, { life: 0.25, s0: 5, s1: 1, color: 0xffffff });
        if (n % 9 === 0) {
          const a = Math.PI * (0.15 + Math.random() * 0.7);
          parts.spawn(mx, my, { kind: "spark", vx: Math.cos(a) * 160, vy: Math.sin(a) * 160, life: 0.6, s0: 3, s1: 1, color: COLORS[n % COLORS.length]!, alpha: 0.6 });
        }
        // 색종이 하나가 가끔 반짝 (party의 색종이 자리)
        if (n % 5 === 0) {
          const i = Math.floor(Math.random() * 40);
          const y = ((t * (8 + (i % 5) * 3) + i * 37) % (LOBBY_H - WALL_TOP)) + WALL_TOP;
          const x = ((i * 53) % (LOBBY_W - 2 * TILE)) + TILE + Math.sin(t * 2 + i) * 4;
          parts.spawn(x, y, { life: 0.3, s0: 5, s1: 1, color: COLORS[i % COLORS.length]! });
        }
        // 게임기 화면이 은은하게 빛남
        for (const m of MACHINES) parts.steady(m.x, m.y - 10, 26 + Math.sin(t * 3 + m.x) * 3, hexColor(m.color, 0xffffff), 0.3);
      }
      glow.render(dt, scale, view.x, view.y);
    },
    destroy: () => glow.destroy(),
  };
}
