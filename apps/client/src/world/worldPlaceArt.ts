// 나라 필드 장소 그림: 던전 입구(어두운 굴·횃불) · 마을 깃발 · 표지판 · 가까우면 위에 이름표 (사람과 함께 y 순서로 그림)
import { placeXY, type Place } from "./worldPlaces";

/** 장소 하나 (t = 초, 횃불 깜박임) */
export function drawPlace(ctx: CanvasRenderingContext2D, p: Place, t: number, color: string): void {
  const [x, y] = placeXY(p).map(Math.round) as [number, number];
  if (p.kind === "dungeon") {
    ctx.fillStyle = "#3a3038";
    ctx.fillRect(x - 11, y - 14, 22, 18);
    ctx.fillStyle = "#08060c";
    ctx.fillRect(x - 7, y - 10, 14, 14);
    ctx.fillRect(x - 5, y - 12, 10, 2);
    for (const sx of [-14, 13]) {
      const f = Math.sin(t * 9 + sx) > 0 ? 1 : 0;
      ctx.fillStyle = "#5a3a22";
      ctx.fillRect(x + sx, y - 6, 2, 8);
      ctx.fillStyle = f ? "#ffd84a" : "#ff8a3a";
      ctx.fillRect(x + sx - 1, y - 10 - f, 4, 4);
    }
  } else if (p.kind === "town") {
    ctx.fillStyle = "#4a3018";
    ctx.fillRect(x - 1, y - 22, 2, 24);
    const wave = Math.round(Math.sin(t * 3) * 1.5);
    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y - 22, 12, 7 + wave);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 5, y - 20, 4, 3);
  } else {
    ctx.fillStyle = "#5a3a22";
    ctx.fillRect(x - 1, y - 6, 2, 8);
    ctx.fillStyle = "#a87442";
    ctx.fillRect(x - 7, y - 12, 14, 7);
    ctx.fillStyle = "#6e4824";
    ctx.fillRect(x - 5, y - 10, 10, 1);
    ctx.fillRect(x - 5, y - 8, 7, 1);
  }
}

/** 가까운 장소 위 이름표 */
export function drawPlaceLabel(ctx: CanvasRenderingContext2D, p: Place, text: string): void {
  const [x, y] = placeXY(p);
  ctx.font = "7px sans-serif";
  const w = Math.ceil(ctx.measureText(text).width) + 6;
  const top = y - (p.kind === "town" ? 34 : 24);
  ctx.fillStyle = "rgba(12,10,18,0.8)";
  ctx.fillRect(Math.round(x - w / 2), top, w, 10);
  ctx.fillStyle = "#ffe9a8";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, top + 5.5);
}
