// 아이템 아이콘 (임시 그림): 16×16 픽셀을 코드로 그림. 무기는 이름에 맞는 모양을 하나씩, 정식 그림이 생기면 sprites로 교체
import { PASSIVES, type PassiveDef, type UseItemId } from "@pixel-rogue/shared";
import { ICON_SIZE, CHAR_COLOR, W, Pen, type IconItem } from "./pen";
import { PASSIVE_ART, passiveArt } from "./passives";
import { weaponArt } from "./weapons";
import { customImage } from "../customArt";

export { ICON_SIZE, type IconItem } from "./pen";

const USE_COLORS: Record<UseItemId, string> = { potion: "#e0505e", bomb: "#4a4458", ward: "#6ec6e8", moneyBag: "#c89a4a", elixir: "#ff80c0", frost: "#c0f0ff" };

function useArt(g: Pen, id: UseItemId): void {
  const c = USE_COLORS[id];
  if (id === "potion" || id === "elixir") {
    g.rect(5, 7, 6, 7, c).rect(4, 9, 8, 4, c).rect(7, 3, 2, 4, "#c8c8d8").rect(6, 2, 4, 1, W).px(6, 8, "#fff");
    if (id === "elixir") g.px(10, 11, "#fff").px(9, 10, "#fff");
  } else if (id === "bomb") {
    g.disc(8, 9, 4, c).px(6, 7, "#8a8498").px(7, 7, "#8a8498").line(9, 5, 11, 3, W).px(12, 2, "#ffb040").px(13, 1, "#ff6a20");
  } else if (id === "moneyBag") {
    // 끈으로 묶은 자루 + 금화 표시
    g.disc(8, 10, 5, c).rect(6, 4, 4, 2, c).rect(5, 6, 6, 1, "#6a4a20").px(4, 3, "#c89a4a").px(11, 3, "#c89a4a").disc(8, 10, 2, "#ffd84a").px(8, 10, "#fff4c0");
  } else if (id === "ward") {
    for (let y = 3; y <= 13; y++) {
      const half = y < 9 ? 5 : Math.max(0, 5 - (y - 8));
      g.rect(8 - half, y, half * 2, 1, c);
    }
    g.rect(8, 5, 1, 5, "#fff").rect(6, 7, 5, 1, "#fff");
  } else {
    g.line(8, 2, 8, 14, c).line(2, 8, 14, 8, c).line(4, 4, 12, 12, "#9ad8f0").line(12, 4, 4, 12, "#9ad8f0").px(8, 8, "#fff");
  }
}

export function drawIcon(ctx: CanvasRenderingContext2D, item: IconItem): void {
  const g = new Pen(ctx);
  if (item.kind === "weapon") weaponArt(g, item.id);
  else if (item.kind === "use") useArt(g, item.id);
  else {
    const def: PassiveDef = PASSIVES[item.id];
    const art = PASSIVE_ART[item.id];
    if (art && def.exclusive) {
      // 전용 아이템: 캐릭터 색 틀 안에 그림
      g.rect(0, 0, 16, 16, CHAR_COLOR[def.exclusive]).rect(1, 1, 14, 14, "#241e30");
    }
    (art ?? ((pen: Pen) => passiveArt(pen, item.id)))(g);
  }
}

const cache = new Map<string, HTMLCanvasElement>();
/** 도트 편집에서 고친 그림으로 그린 아이콘 */
const custom = new Set<string>();

/** 아이콘 그림 (한 번 그려 두고 다시 씀, 고친 그림이 다 불러와지면 그걸로 바꿈). 캔버스에 drawImage로 찍을 때 사용 */
export function iconCanvas(item: IconItem): HTMLCanvasElement {
  const key = `${item.kind}:${item.id}`;
  const img = customImage(`icon:${key}`);
  let c = cache.get(key);
  if (!c || (img && !custom.has(key))) {
    c = document.createElement("canvas");
    c.width = c.height = ICON_SIZE;
    const ctx = c.getContext("2d");
    if (ctx && img) ctx.drawImage(img, 0, 0, ICON_SIZE, ICON_SIZE);
    else if (ctx) drawIcon(ctx, item);
    if (img) custom.add(key);
    cache.set(key, c);
  }
  return c;
}
