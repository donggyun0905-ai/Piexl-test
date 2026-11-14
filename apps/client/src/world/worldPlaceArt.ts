// 나라 필드 장소 그림: 던전 입구(어두운 굴·횃불) · 마을 깃발 · 표지판 · 주민(캐릭터 그림) · 문 발판·가게 간판·순간 이동석(worldPlaceSigns) · 가까우면 위에 이름표 (사람과 함께 y 순서로 그림)
import { drawBody } from "../game/render/actors";
import { shadow } from "./worldArt";
import { drawDeco } from "./worldDeco";
import { placeXY, type Place } from "./worldPlaces";
import { drawObj, objOf } from "./worldTex";
import { drawShopIcon, drawTower, drawWarp } from "./worldPlaceSigns";

/** 주민 몸 반지름 (플레이어와 같음) */
const NPC_R = 5;

/** 장소 하나 (t = 초, 횃불 깜박임) */
export function drawPlace(ctx: CanvasRenderingContext2D, p: Place, t: number, color: string): void {
  const [x, y] = placeXY(p).map(Math.round) as [number, number];
  if (p.kind === "deco") {
    if (p.art) drawDeco(ctx, p.art, x, y, t);
    return;
  }
  if (p.kind === "door" || p.kind === "exit") {
    // 문 앞 발판 · 나가는 문은 아래 화살표가 숨 쉬듯
    box(ctx, "#6a3a24", x - 6, y - 3, 12, 6);
    box(ctx, "#a8583a", x - 5, y - 2, 10, 4);
    if (p.icon) drawShopIcon(ctx, p.icon, x, y);
    if (p.kind === "exit") {
      const a = Math.round(Math.sin(t * 4) * 1.5);
      box(ctx, "#ffe9a8", x - 1, y - 2 + a, 2, 3);
      box(ctx, "#ffe9a8", x - 3, y + 1 + a, 6, 1);
      box(ctx, "#ffe9a8", x - 2, y + 2 + a, 4, 1);
    }
    return;
  }
  if (p.gate === "tower") {
    drawTower(ctx, x, y, t);
    return;
  }
  if (p.kind === "warp") {
    drawWarp(ctx, x, y, t);
    return;
  }
  if (p.kind === "npc" && p.who) {
    // 발 = 칸 가운데보다 조금 아래 · 아래를 봄
    shadow(ctx, x, y + 5, 6, 2.2, 0.32);
    drawBody(ctx, p.who, x, y + 4 - NPC_R, NPC_R, { faceX: 0, faceY: 1, moving: false, casting: false, step: 0 }, 0);
  } else if (p.kind === "dungeon") {
    const img = objOf("cave");
    if (!img) drawCave(ctx, x, y, t);
    else {
      shadow(ctx, x, y + 3, 18, 4, 0.35);
      drawObj(ctx, img, x, y + 5);
      // 굴 안 붉은 기운 (그림 위에 숨 쉬듯)
      const g = ctx.createRadialGradient(x, y - 4, 0, x, y - 4, 12);
      g.addColorStop(0, `rgba(255,90,50,${0.18 + Math.sin(t * 2) * 0.06})`);
      g.addColorStop(1, "rgba(255,90,50,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - 12, y - 16, 24, 24);
    }
  }
  else if (p.kind === "town") {
    shadow(ctx, x + 2, y + 2, 6, 2, 0.3);
    box(ctx, "#6e6680", x - 3, y - 1, 7, 3);
    box(ctx, "#a49cb2", x - 3, y - 1, 7, 1);
    box(ctx, "#3a2414", x - 1, y - 24, 3, 24);
    box(ctx, "#7a5230", x, y - 24, 1, 24);
    box(ctx, "#ffd84a", x - 1, y - 26, 3, 2);
    // 펄럭이는 깃발: 세로 줄마다 조금씩 다르게 출렁임
    for (let i = 0; i < 13; i++) {
      const dy = Math.round(Math.sin(t * 4 - i * 0.6) * 1.2 * (i / 12));
      box(ctx, color, x + 2 + i, y - 23 + dy, 1, 8 - Math.floor(i / 6));
      box(ctx, "rgba(0,0,0,0.25)", x + 2 + i, y - 16 + dy - Math.floor(i / 6), 1, 1);
    }
    box(ctx, "#ffffff", x + 6, y - 21 + Math.round(Math.sin(t * 4 - 3) * 0.5), 3, 3);
  } else if (objOf("sign")) {
    shadow(ctx, x, y + 2, 7, 2, 0.3);
    drawObj(ctx, objOf("sign")!, x, y + 3);
  } else {
    shadow(ctx, x, y + 2, 7, 2, 0.3);
    box(ctx, "#3a2414", x - 1, y - 6, 3, 8);
    box(ctx, "#3a2414", x - 8, y - 13, 16, 9);
    box(ctx, "#b07c48", x - 7, y - 12, 14, 7);
    box(ctx, "#cc9a62", x - 7, y - 12, 14, 1);
    box(ctx, "#6e4824", x - 5, y - 10, 10, 1);
    box(ctx, "#6e4824", x - 5, y - 8, 7, 1);
  }
}

const box = (g: CanvasRenderingContext2D, c: string, x: number, y: number, w: number, h: number) => {
  g.fillStyle = c;
  g.fillRect(x, y, w, h);
};

/** 던전 입구: 바위 언덕에 뚫린 굴 · 돌 테두리 · 양옆 횃불(빛 번짐) */
function drawCave(ctx: CanvasRenderingContext2D, x: number, y: number, t: number): void {
  shadow(ctx, x, y + 3, 18, 4, 0.35);
  box(ctx, "#3e342c", x - 17, y - 14, 34, 18);
  box(ctx, "#3e342c", x - 13, y - 20, 26, 6);
  box(ctx, "#7c6a58", x - 16, y - 13, 32, 16);
  box(ctx, "#7c6a58", x - 12, y - 19, 24, 6);
  box(ctx, "#9c8a74", x - 12, y - 19, 14, 2);
  box(ctx, "#9c8a74", x - 16, y - 13, 6, 2);
  box(ctx, "#5e5044", x + 8, y - 12, 7, 14);
  // 굴 (아치) · 돌 테두리 · 안쪽 붉은 기운
  box(ctx, "#b4a48e", x - 9, y - 13, 18, 17);
  box(ctx, "#b4a48e", x - 7, y - 15, 14, 2);
  box(ctx, "#08060c", x - 7, y - 11, 14, 15);
  box(ctx, "#08060c", x - 5, y - 13, 10, 2);
  const pulse = 0.18 + Math.sin(t * 2) * 0.06;
  box(ctx, `rgba(200,60,40,${pulse})`, x - 6, y - 4, 12, 8);
  box(ctx, "#5e5044", x - 8, y - 12, 1, 15);
  for (const sx of [-21, 20]) {
    const f = Math.sin(t * 11 + sx) > 0 ? 1 : 0;
    const g = ctx.createRadialGradient(x + sx + 1, y - 10, 0, x + sx + 1, y - 10, 16);
    g.addColorStop(0, "rgba(255,190,90,0.35)");
    g.addColorStop(1, "rgba(255,190,90,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x + sx - 15, y - 26, 32, 32);
    box(ctx, "#3a2414", x + sx, y - 6, 2, 9);
    box(ctx, f ? "#ffd84a" : "#ff8a3a", x + sx - 1, y - 11 - f, 4, 5);
    box(ctx, "#fff4c0", x + sx, y - 9 - f, 2, 2);
  }
}

/** 가까운 장소 위 이름표 */
export function drawPlaceLabel(ctx: CanvasRenderingContext2D, p: Place, text: string): void {
  const [x, y] = placeXY(p);
  ctx.font = "7px sans-serif";
  const w = Math.ceil(ctx.measureText(text).width) + 6;
  const top = y - (p.kind === "town" ? 34 : p.kind === "npc" ? 30 : p.kind === "door" ? 28 : p.kind === "exit" ? 16 : p.kind === "warp" ? 30 : p.gate === "tower" ? 40 : 24);
  ctx.fillStyle = "rgba(12,10,18,0.8)";
  ctx.fillRect(Math.round(x - w / 2), top, w, 10);
  ctx.fillStyle = "#ffe9a8";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, top + 5.5);
}
