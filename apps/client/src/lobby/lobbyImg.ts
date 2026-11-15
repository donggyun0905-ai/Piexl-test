// 로비 그림 (사용자 그림, scripts/art/lobby_art.py → public/lobby): 오락실 바닥·벽 · 꾸밈 · 게임기 · 펫 · 없거나 받는 중이면 코드 그림
import { imageLoader } from "../game/lazyImage";
import { LOBBY_ART } from "./lobbyArtList";

const load = imageLoader((name) => (LOBBY_ART.has(name) ? `${import.meta.env.BASE_URL}lobby/${name}.png` : null));
export const lobbyImg = (name: string): HTMLImageElement | undefined => load(name);

/** 그림을 발(아래 가운데) 기준, 높이 h(로비 픽셀)로 · flip = 좌우 뒤집기 · 그림이 없으면 false */
export function drawLobbyImg(ctx: CanvasRenderingContext2D, name: string, x: number, y: number, h: number, flip = false): boolean {
  const img = load(name);
  if (!img) return false;
  const w = (img.width * h) / img.height;
  if (!flip) ctx.drawImage(img, x - w / 2, y - h, w, h);
  else {
    ctx.save();
    ctx.translate(x, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(img, -w / 2, y - h, w, h);
    ctx.restore();
  }
  return true;
}
