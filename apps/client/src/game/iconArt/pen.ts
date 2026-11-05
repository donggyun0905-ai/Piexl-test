// 아이콘 그리기 도구: 16×16 붓 · 기본 색 · 자주 쓰는 모양(활·칼·자루 등)
import type { CharacterId, PassiveId, UseItemId, WeaponId } from "@pixel-rogue/shared";

export const ICON_SIZE = 16;
export type IconItem = { kind: "weapon"; id: WeaponId } | { kind: "passive"; id: PassiveId } | { kind: "use"; id: UseItemId };

export const CHAR_COLOR: Record<CharacterId, string> = { warden: "#d86a5a", drifter: "#6cc070", mage: "#a07af0", mystic: "#e8d070", engineer: "#e8a040", elementalist: "#3ad8a0", brawler: "#e85a8a", doctor: "#e8eef4", gunner: "#c8a050", beast: "#e89040", ninja: "#8a5ad8", chronomancer: "#5ac8e8", summoner: "#5ab86a", novice: "#c8b89a", bedouin: "#e8b860", general: "#c84a3a", imugi: "#ffd040", apostle: "#8a1a3a", stargazer: "#9ab8ff", duck: "#ffd84a", abandoned: "#7aa070", titan: "#c87a3a", oni: "#d84a3a", scribe: "#b89aff", idra: "#7ae05a", byeonhui: "#e8a070", fly: "#6ad8e8", elder: "#c8b070", ren: "#a87a4a", spiritist: "#8ab8ff", plague: "#7a8a5a", slayer: "#d8283a", eater: "#ff2030", mukin: "#8a8e9a", samyeol: "#a86ad8", automata: "#8ae8ff", rider: "#2a5ad8", bomber: "#ff6a2a", artifacter: "#4a9aff", punk: "#ff4ad8", collector: "#4a7aff", tracker: "#5a8a4a", forgotten: "#ffe08a", remnant: "#6a5aa8", wanderer: "#c84a4a", silk: "#ff8ad8", pungryu: "#3ac8a0", leo: "#ffd030", onyx: "#b070ff", fenrir: "#7aa8ff", eclipse: "#ff9a30", thorken: "#3ac8e8", levia: "#5ab0ff", tail: "#3ad8d0", madQueen: "#5af0ff", hook: "#4ab8ff", miner: "#5ad8e8", voyager: "#e8b040", zeus: "#8ac8ff", pilgrim: "#7ad0f0", fallenKing: "#3ab8ff", lux: "#ffb040" };
export const S = "#e8ecf4"; // 밝은 쇠
export const D = "#9aa3b8"; // 어두운 쇠
export const W = "#8a6a3a"; // 나무
export const G = "#f2c14e"; // 금
export const K = "#3a3446"; // 어두운 색

/** 그리기 도구 */
export class Pen {
  constructor(readonly ctx: CanvasRenderingContext2D) {}
  px(x: number, y: number, c: string): this {
    if (x >= 0 && y >= 0 && x < ICON_SIZE && y < ICON_SIZE) {
      this.ctx.fillStyle = c;
      this.ctx.fillRect(x, y, 1, 1);
    }
    return this;
  }
  rect(x: number, y: number, w: number, h: number, c: string): this {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.px(x + i, y + j, c);
    return this;
  }
  line(x0: number, y0: number, x1: number, y1: number, c: string): this {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let i = 0; i <= n; i++) this.px(Math.round(x0 + ((x1 - x0) * i) / (n || 1)), Math.round(y0 + ((y1 - y0) * i) / (n || 1)), c);
    return this;
  }
  disc(cx: number, cy: number, r: number, c: string): this {
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r + r * 0.6) this.px(cx + x, cy + y, c);
    return this;
  }
  ring(cx: number, cy: number, r: number, c: string): this {
    for (let y = -r; y <= r; y++)
      for (let x = -r; x <= r; x++) {
        const d = x * x + y * y;
        if (d <= r * r + r * 0.6 && d >= (r - 1) * (r - 1) + (r - 1) * 0.6) this.px(cx + x, cy + y, c);
      }
    return this;
  }
}

/** 활 (왼쪽이 활대, 시위 직선). size: 활 높이의 절반 */
export function bow(g: Pen, x: number, cy: number, half: number, c = W): void {
  for (let i = -half; i <= half; i++) g.px(x + Math.round((half * half - i * i) / (half * 1.6)), cy + i, c);
  g.line(x, cy - half, x, cy + half, "#d8d4c0");
}
/** 화살 (오른쪽으로) */
export function arrow(g: Pen, x0: number, x1: number, y: number, tip = S): void {
  g.line(x0, y, x1, y, "#b89a6a");
  g.px(x1, y, tip).px(x1 - 1, y - 1, tip).px(x1 - 1, y + 1, tip);
  g.px(x0, y - 1, "#c8d0e0").px(x0, y + 1, "#c8d0e0");
}
/** 쇠뇌: 개머리판 + 활 + 화살 */
export function crossbow(g: Pen, c: string, bolt = S): void {
  g.rect(2, 8, 11, 2, W); // 몸통
  g.line(11, 3, 11, 14, c); // 활
  g.px(10, 3, c).px(10, 14, c).px(12, 2, c).px(12, 15, c);
  g.line(11, 3, 7, 8, "#d8d4c0").line(11, 14, 7, 9, "#d8d4c0"); // 시위
  g.line(5, 8, 14, 8, bolt);
  g.px(15, 8, bolt);
}
/** 대각선 지팡이 (오른쪽 위 끝) */
export function staff(g: Pen): void {
  g.line(3, 14, 11, 6, W).line(4, 14, 12, 6, "#6a4e2a");
}
export function sword(g: Pen, len: number, blade: string, wide = false, edge = D): void {
  // 자루 (왼쪽 아래) → 날 (오른쪽 위)
  g.line(2, 14, 4, 12, W);
  g.px(4, 10, G).px(5, 11, G).px(6, 12, G).px(3, 11, G).px(5, 13, G).px(4, 11, G).px(5, 12, G);
  for (let i = 0; i < len; i++) {
    g.px(6 + i, 10 - i, blade);
    if (wide) g.px(7 + i, 10 - i, edge).px(6 + i, 11 - i, blade);
    else g.px(6 + i, 11 - i, edge);
  }
  g.px(6 + len, 10 - len, blade);
}
/** 대각선 막대 (창·도끼·망치 자루) */
export function haft(g: Pen, x0 = 2, y0 = 14, x1 = 12, y1 = 4): void {
  g.line(x0, y0, x1, y1, W);
}
export function star(g: Pen, cx: number, cy: number, c: string, big = false): void {
  g.px(cx, cy, "#fff").px(cx - 1, cy, c).px(cx + 1, cy, c).px(cx, cy - 1, c).px(cx, cy + 1, c);
  if (big) g.px(cx - 2, cy, c).px(cx + 2, cy, c).px(cx, cy - 2, c).px(cx, cy + 2, c);
}
export function orb(g: Pen, cx: number, cy: number, r: number, c: string): void {
  g.disc(cx, cy, r, c).px(cx - 1, cy - 1, "#fff");
}
