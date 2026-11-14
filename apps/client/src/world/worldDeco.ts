// 가구·소품 (장소 표의 장식 deco): 침대·탁자·책장·벽난로·왕좌·기둥·갑옷·술통·화분 · 계산대·모루·화덕·무기 걸이·물약 선반·허수아비(worldDecoShop) — 코드 그림, 사람과 y 순서로 그림
// (x, y) = 칸 가운데 · 그림은 발(아래) 쪽이 칸 아래쪽에 닿게
import { shadow } from "./worldArt";
import { drawSeaDeco, SEA_DECO_R, type SeaDeco } from "./worldDecoSea";
import { drawNorthDeco, NORTH_DECO_R, type NorthDeco } from "./worldDecoNorth";
import { drawDesertDeco, DESERT_DECO_R, type DesertDeco } from "./worldDecoDesert";
import { drawEmpireDeco, EMPIRE_DECO_R, type EmpireDeco } from "./worldDecoEmpire";
import { drawShopDeco, SHOP_DECO_R, type ShopDeco } from "./worldDecoShop";
import { ART_DECO_R, drawArtDeco, type ArtDeco } from "./worldDecoArt";

export type DecoArt = "bed" | "table" | "shelf" | "fireplace" | "throne" | "pillar" | "armor" | "barrel" | "plant" | ShopDeco | EmpireDeco | DesertDeco | NorthDeco | SeaDeco | ArtDeco;

/** 부딪힘 반지름 (픽셀) */
export const DECO_R: Record<DecoArt, number> = { bed: 9, table: 9, shelf: 8, fireplace: 8, throne: 9, pillar: 6, armor: 5, barrel: 5, plant: 4, ...SHOP_DECO_R, ...EMPIRE_DECO_R, ...DESERT_DECO_R, ...NORTH_DECO_R, ...SEA_DECO_R, ...ART_DECO_R };

type Ctx = CanvasRenderingContext2D;
const box = (g: Ctx, c: string, x: number, y: number, w: number, h: number) => {
  g.fillStyle = c;
  g.fillRect(x, y, w, h);
};

export function drawDeco(g: Ctx, art: DecoArt, x: number, y: number, t: number): void {
  const b = y + 7;
  // 그림 파일이 있는 가구·소품은 그림으로 (worldDecoArt)
  if (drawArtDeco(g, art, x, b, t, DECO_R[art])) return;
  switch (art) {
    case "counter":
    case "anvil":
    case "forge":
    case "rack":
    case "potions":
    case "dummy":
    case "gear":
    case "smoke":
      drawShopDeco(g, art, x, b, t);
      break;
    case "fountainGold":
    case "banner":
    case "altar":
      drawEmpireDeco(g, art, x, b, t);
      break;
    case "palm":
    case "palm2":
    case "cactus":
    case "tumbleweed":
    case "column":
    case "stoneHead":
    case "ribcage":
    case "tent":
      drawDesertDeco(g, art, x, b, t);
      break;
    case "watchtower":
    case "barricade":
    case "catapult":
    case "brazier":
    case "skull":
    case "spears":
    case "iceCrystal":
    case "armyTent":
    case "demonGate":
      drawNorthDeco(g, art, x, b, t);
      break;
    case "ship":
    case "boat":
    case "pirateShip":
    case "crane":
    case "cargo":
    case "lighthouse":
    case "mooring":
    case "net":
    case "anchor":
    case "fishStall":
      drawSeaDeco(g, art, x, b, t);
      break;
    case "bed":
      shadow(g, x, b, 10, 3, 0.3);
      box(g, "#5a3a20", x - 9, b - 18, 18, 18);
      box(g, "#f0e8d8", x - 8, b - 17, 16, 5);
      box(g, "#3e6aa8", x - 8, b - 12, 16, 10);
      box(g, "#5a86c4", x - 8, b - 12, 16, 2);
      box(g, "#3e2614", x - 9, b - 2, 18, 2);
      break;
    case "table":
      shadow(g, x, b, 10, 3, 0.3);
      box(g, "#6a4424", x - 8, b - 6, 2, 6);
      box(g, "#6a4424", x + 6, b - 6, 2, 6);
      box(g, "#8e5e34", x - 9, b - 11, 18, 6);
      box(g, "#b07c48", x - 9, b - 11, 18, 1);
      box(g, "#f0e8d8", x - 3, b - 12, 3, 2);
      box(g, "#c84a3a", x + 2, b - 13, 2, 3);
      break;
    case "shelf":
      shadow(g, x, b, 8, 2.5, 0.3);
      box(g, "#4a2e18", x - 8, b - 22, 16, 22);
      for (let r = 0; r < 3; r++) {
        box(g, "#6a4424", x - 7, b - 21 + r * 7, 14, 6);
        for (let i = 0; i < 6; i++) box(g, ["#b8483a", "#3e5e9e", "#4e7a3a", "#d8a838"][(i + r) % 4]!, x - 6 + i * 2, b - 20 + r * 7, 2, 5);
      }
      break;
    case "fireplace": {
      box(g, "#6a6278", x - 9, b - 18, 18, 18);
      box(g, "#8c8498", x - 10, b - 19, 20, 3);
      box(g, "#1a1218", x - 5, b - 12, 10, 11);
      const f = Math.sin(t * 9) > 0 ? 1 : 0;
      box(g, "#ff8a3a", x - 4, b - 7 - f, 8, 6 + f);
      box(g, "#ffd84a", x - 2, b - 5 - f, 4, 4 + f);
      const glow = g.createRadialGradient(x, b - 4, 0, x, b - 4, 22);
      glow.addColorStop(0, `rgba(255,170,80,${0.25 + f * 0.05})`);
      glow.addColorStop(1, "rgba(255,170,80,0)");
      g.fillStyle = glow;
      g.fillRect(x - 22, b - 26, 44, 44);
      break;
    }
    case "throne":
      shadow(g, x, b, 10, 3, 0.35);
      box(g, "#6e6680", x - 10, b - 4, 20, 4);
      box(g, "#8a2e26", x - 7, b - 22, 14, 18);
      box(g, "#d8a838", x - 8, b - 24, 16, 3);
      box(g, "#d8a838", x - 2, b - 27, 4, 3);
      box(g, "#b8483a", x - 5, b - 12, 10, 6);
      box(g, "#d8a838", x - 8, b - 12, 2, 8);
      box(g, "#d8a838", x + 6, b - 12, 2, 8);
      break;
    case "pillar":
      shadow(g, x, b, 7, 2.5, 0.3);
      box(g, "#8c8498", x - 6, b - 4, 12, 4);
      box(g, "#b4acc4", x - 4, b - 26, 8, 22);
      box(g, "#d4cce0", x - 4, b - 26, 2, 22);
      box(g, "#8c8498", x - 6, b - 29, 12, 3);
      break;
    case "armor":
      shadow(g, x, b, 5, 2, 0.3);
      box(g, "#5a3a20", x - 4, b - 2, 8, 2);
      box(g, "#a8b0c0", x - 3, b - 16, 6, 14);
      box(g, "#d0d8e4", x - 3, b - 21, 6, 5);
      box(g, "#1a1424", x - 2, b - 19, 4, 1);
      box(g, "#b8483a", x - 1, b - 24, 2, 3);
      break;
    case "barrel":
      shadow(g, x, b, 6, 2, 0.3);
      box(g, "#7a4e2a", x - 5, b - 11, 10, 11);
      box(g, "#5a5468", x - 5, b - 9, 10, 1);
      box(g, "#5a5468", x - 5, b - 3, 10, 1);
      box(g, "#9a6a3a", x - 4, b - 11, 2, 11);
      break;
    case "plant":
      shadow(g, x, b, 4, 1.5, 0.3);
      box(g, "#a8583a", x - 3, b - 5, 6, 5);
      box(g, "#4e9a46", x - 4, b - 12, 8, 7);
      box(g, "#6eba5a", x - 2, b - 14, 4, 4);
      break;
  }
}
