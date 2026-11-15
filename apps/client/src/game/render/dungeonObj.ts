// 던전·광야 물건 그림 (사용자 그림, scripts/art/dungeon_art.py → public/dungeon/obj): 샘·상자·깔개·여신상·출구·계단·발판·단련 기구·대장간·광야 아이템
// 받기 전·그림이 없으면 false → 부른 쪽이 코드 그림
import { imageLoader } from "../lazyImage";
import { DUNGEON_OBJ } from "./dungeonObjList";

const load = imageLoader((name) => (DUNGEON_OBJ.has(name) ? `${import.meta.env.BASE_URL}dungeon/obj/${name}.png` : null));

/** 그림을 발(아래 가운데) 기준, 높이 h(게임 픽셀)로 · w를 주면 너비로 맞춤 */
export function drawDObj(ctx: CanvasRenderingContext2D, name: string, x: number, footY: number, h: number, w?: number): boolean {
  const img = load(name);
  if (!img) return false;
  const ww = w ?? (img.width * h) / img.height;
  const hh = w ? (img.height * w) / img.width : h;
  ctx.drawImage(img, x - ww / 2, footY - hh, ww, hh);
  return true;
}
