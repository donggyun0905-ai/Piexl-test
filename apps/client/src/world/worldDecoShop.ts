// 가게·대장간·훈련장 소품 (장소 표의 장식 deco, worldDeco가 부름): 계산대 · 모루 · 화덕(불 깜박임·빛) · 무기 걸이 · 물약 선반 · 허수아비
// 테라코어: 도는 톱니 기념물 · 굴뚝 연기(부딪히지 않음, 굴뚝 칸에 둠)
// (x, b) = 칸 가운데 x · 아래 끝 y
import { shadow } from "./worldArt";

export type ShopDeco = "counter" | "anvil" | "forge" | "rack" | "potions" | "dummy" | "gear" | "smoke";

/** 부딪힘 반지름 (픽셀) */
export const SHOP_DECO_R: Record<ShopDeco, number> = { counter: 8, anvil: 6, forge: 9, rack: 7, potions: 8, dummy: 5, gear: 14, smoke: -99 };

type Ctx = CanvasRenderingContext2D;
const box = (g: Ctx, c: string, x: number, y: number, w: number, h: number) => {
  g.fillStyle = c;
  g.fillRect(x, y, w, h);
};

export function drawShopDeco(g: Ctx, art: ShopDeco, x: number, b: number, t: number): void {
  switch (art) {
    case "counter":
      shadow(g, x, b, 9, 3, 0.3);
      box(g, "#5a3a20", x - 8, b - 10, 16, 10);
      box(g, "#8e5e34", x - 9, b - 12, 18, 3);
      box(g, "#b07c48", x - 9, b - 12, 18, 1);
      box(g, "#6a4424", x - 6, b - 8, 5, 6);
      box(g, "#6a4424", x + 1, b - 8, 5, 6);
      box(g, "#d8a838", x - 2, b - 14, 4, 2);
      break;
    case "anvil":
      shadow(g, x, b, 7, 2.5, 0.35);
      box(g, "#4a3020", x - 3, b - 5, 6, 5);
      box(g, "#3e3a48", x - 6, b - 9, 12, 4);
      box(g, "#5e5a6e", x - 7, b - 10, 14, 2);
      box(g, "#8c88a0", x - 7, b - 10, 10, 1);
      box(g, "#3e3a48", x + 6, b - 9, 3, 2);
      break;
    case "forge": {
      box(g, "#5a5468", x - 9, b - 16, 18, 16);
      box(g, "#7a7290", x - 10, b - 17, 20, 3);
      box(g, "#3e384a", x - 3, b - 26, 6, 9);
      box(g, "#1a1218", x - 6, b - 11, 12, 8);
      const f = Math.sin(t * 8) > 0 ? 1 : 0;
      box(g, "#ff6a2a", x - 5, b - 7 - f, 10, 4 + f);
      box(g, "#ffd84a", x - 2, b - 6 - f, 4, 3);
      const glow = g.createRadialGradient(x, b - 6, 0, x, b - 6, 26);
      glow.addColorStop(0, `rgba(255,140,60,${0.3 + f * 0.06})`);
      glow.addColorStop(1, "rgba(255,140,60,0)");
      g.fillStyle = glow;
      g.fillRect(x - 26, b - 32, 52, 52);
      break;
    }
    case "rack":
      shadow(g, x, b, 8, 2.5, 0.3);
      box(g, "#5a3a20", x - 8, b - 18, 2, 18);
      box(g, "#5a3a20", x + 6, b - 18, 2, 18);
      box(g, "#6a4424", x - 8, b - 16, 16, 2);
      box(g, "#6a4424", x - 8, b - 6, 16, 2);
      for (const [dx, c] of [[-4, "#c8d0dc"], [0, "#a8b0c0"], [4, "#c8d0dc"]] as const) {
        box(g, c, x + dx, b - 20, 1, 14);
        box(g, "#7a4e2a", x + dx - 1, b - 7, 3, 2);
      }
      break;
    case "potions":
      shadow(g, x, b, 8, 2.5, 0.3);
      box(g, "#4a2e18", x - 8, b - 20, 16, 20);
      for (let r = 0; r < 3; r++) {
        box(g, "#6a4424", x - 7, b - 19 + r * 6, 14, 5);
        for (let i = 0; i < 4; i++) {
          const c = ["#e04848", "#4888e0", "#48c060", "#c860d8"][(i + r) % 4]!;
          box(g, c, x - 6 + i * 3, b - 17 + r * 6, 2, 3);
          box(g, "#f0f0f0", x - 6 + i * 3, b - 18 + r * 6, 2, 1);
        }
      }
      break;
    case "gear": {
      // 받침돌 위 큰 톱니 (천천히 돎) · 가운데 축
      shadow(g, x, b, 14, 4, 0.35);
      box(g, "#6e6680", x - 12, b - 6, 24, 6);
      box(g, "#a49cb2", x - 12, b - 6, 24, 1);
      const cy = b - 24;
      const a0 = t * 0.6;
      for (let i = 0; i < 10; i++) {
        const a = a0 + (i * Math.PI) / 5;
        box(g, "#a8803a", Math.round(x + Math.cos(a) * 15) - 2, Math.round(cy + Math.sin(a) * 15) - 2, 5, 5);
      }
      g.fillStyle = "#c89a48";
      g.beginPath();
      g.arc(x, cy, 13, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#8a6a2a";
      g.beginPath();
      g.arc(x, cy, 6, 0, Math.PI * 2);
      g.fill();
      box(g, "#4a525c", x - 2, cy - 2, 4, 4);
      box(g, "#5a5468", x - 2, cy + 6, 4, b - 6 - cy - 6);
      break;
    }
    case "smoke":
      // 굴뚝 위로 피어오르는 연기 셋 (위로 갈수록 커지고 옅어짐)
      for (let i = 0; i < 3; i++) {
        const k = (t * 0.35 + i / 3) % 1;
        const r = 3 + k * 7;
        g.fillStyle = `rgba(200,200,210,${0.5 * (1 - k)})`;
        g.beginPath();
        g.arc(x + Math.sin(t + i * 2) * 2 + k * 6, b - 40 - k * 34, r, 0, Math.PI * 2);
        g.fill();
      }
      break;
    case "dummy": {
      // 바람에 살짝 흔들리는 짚 허수아비
      const s = Math.round(Math.sin(t * 2 + x) * 0.6);
      shadow(g, x, b, 5, 2, 0.3);
      box(g, "#5a3a20", x - 1, b - 14, 2, 14);
      box(g, "#d8b868", x - 6 + s, b - 13, 12, 2);
      box(g, "#c8a050", x - 3 + s, b - 15, 6, 9);
      box(g, "#d8b868", x - 3 + s, b - 20, 6, 5);
      box(g, "#b8483a", x - 3 + s, b - 12, 6, 1);
      box(g, "#3a2414", x - 1 + s, b - 18, 1, 1);
      box(g, "#3a2414", x + 1 + s, b - 18, 1, 1);
      break;
    }
  }
}
