// 로비 꾸밈 물건 그리기 (x, y = 물건 아래 가운데, t = 초 · 움직이는 물건용). 모두 1픽셀 사각형으로 찍음
export type DecorKind =
  | "fountain" | "sofa" | "bench" | "deckchair" | "plant" | "vending"
  | "palm" | "umbrella" | "crab" | "shell" | "towel" | "ball"
  | "xtree" | "snowman" | "gifts" | "candy"
  | "cauldron" | "tomb" | "pumpkin" | "candle"
  | "desk" | "globe" | "books"
  | "yut" | "table" | "pouch" | "kite"
  | "sakura" | "torii" | "stoneLantern" | "bonsai"
  | "dragon" | "vaseBig" | "redLantern" | "vase"
  | "jukebox" | "booth" | "flag" | "burger";

type Ctx = CanvasRenderingContext2D;

export function r(ctx: Ctx, x: number, y: number, w: number, h: number, c: string): void {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

/** 픽셀 타원 (가로줄로 채움) */
export function ell(ctx: Ctx, cx: number, cy: number, rx: number, ry: number, c: string): void {
  ctx.fillStyle = c;
  for (let dy = -ry; dy <= ry; dy++) {
    const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry))));
    ctx.fillRect(Math.round(cx - w), Math.round(cy + dy), w * 2 + 1, 1);
  }
}

const shadow = (ctx: Ctx, x: number, y: number, w: number) => ell(ctx, x, y, w, 2, "rgba(0,0,0,0.3)");

const DRAW: Record<DecorKind, (ctx: Ctx, x: number, y: number, t: number) => void> = {
  fountain: (ctx, x, y, t) => {
    ell(ctx, x, y - 4, 13, 5, "#6a6a8a");
    ell(ctx, x, y - 5, 11, 4, "#3a8ad0");
    r(ctx, x - 1, y - 16, 3, 11, "#8a8aa8");
    for (let i = 0; i < 4; i++) r(ctx, x - 4 + i * 3, y - 18 + ((t * 6 + i * 2) % 6), 1, 1, "#aef0ff");
    r(ctx, x - 3, y - 18, 7, 2, "#6ad0ff");
  },
  sofa: (ctx, x, y) => {
    shadow(ctx, x, y, 12);
    r(ctx, x - 12, y - 10, 24, 6, "#c83a6a");
    r(ctx, x - 12, y - 4, 24, 4, "#a02a52");
    r(ctx, x - 13, y - 9, 3, 9, "#a02a52");
    r(ctx, x + 10, y - 9, 3, 9, "#a02a52");
  },
  bench: (ctx, x, y) => {
    shadow(ctx, x, y, 12);
    r(ctx, x - 12, y - 11, 24, 3, "#8a5a36");
    r(ctx, x - 12, y - 6, 24, 3, "#a86a3a");
    r(ctx, x - 12, y - 3, 24, 1, "#6a4428");
    r(ctx, x - 11, y - 8, 2, 8, "#6a4428");
    r(ctx, x + 9, y - 8, 2, 8, "#6a4428");
  },
  deckchair: (ctx, x, y) => {
    shadow(ctx, x, y, 12);
    for (let i = 0; i < 6; i++) r(ctx, x - 12 + i * 4, y - 10, 4, 7, i % 2 ? "#5ab8ff" : "#ffffff");
    r(ctx, x - 12, y - 3, 24, 1, "#c8a070");
    r(ctx, x - 11, y - 2, 1, 2, "#c8a070");
    r(ctx, x + 10, y - 2, 1, 2, "#c8a070");
  },
  plant: (ctx, x, y) => {
    r(ctx, x - 3, y - 5, 7, 5, "#a86a3a");
    ell(ctx, x, y - 10, 5, 4, "#3aa858");
    r(ctx, x - 2, y - 13, 2, 2, "#5ad078");
  },
  vending: (ctx, x, y, t) => {
    r(ctx, x - 6, y - 20, 12, 20, "#d83a4a");
    r(ctx, x - 4, y - 18, 8, 9, "#2a2a3a");
    for (let i = 0; i < 3; i++) r(ctx, x - 3 + i * 3, y - 16, 2, 3, ["#ffd040", "#5ad0ff", "#7aff7a"][i]!);
    r(ctx, x - 4, y - 6, 8, 2, Math.floor(t * 2) % 2 ? "#fff" : "#888");
  },
  palm: (ctx, x, y, t) => {
    shadow(ctx, x, y, 8);
    for (let i = 0; i < 18; i++) r(ctx, x - 1 + Math.round(Math.sin(i / 5) * 2), y - i, 3, 1, i % 3 ? "#a87a4a" : "#8a5a32");
    const sw = Math.round(Math.sin(t * 1.5));
    for (const d of [-1, 1]) {
      for (let i = 0; i < 9; i++) r(ctx, x + d * i, y - 18 + Math.abs(i - 4) / 2 + sw * d * (i / 9), 2, 2, "#3ab058");
    }
    ell(ctx, x, y - 19, 3, 2, "#2a9048");
  },
  umbrella: (ctx, x, y) => {
    shadow(ctx, x, y, 10);
    r(ctx, x, y - 14, 1, 14, "#f4f4f4");
    for (let i = 0; i < 6; i++) r(ctx, x - 11 + i * 4, y - 16 + Math.abs(i - 2.5), 4, 3, i % 2 ? "#ff5a6a" : "#ffffff");
  },
  crab: (ctx, x, y, t) => {
    const dx = Math.round(Math.sin(t) * 3);
    ell(ctx, x + dx, y - 3, 3, 2, "#e84a3a");
    r(ctx, x + dx - 5, y - 5, 2, 2, "#e84a3a");
    r(ctx, x + dx + 4, y - 5, 2, 2, "#e84a3a");
    r(ctx, x + dx - 1, y - 5, 1, 1, "#000");
    r(ctx, x + dx + 1, y - 5, 1, 1, "#000");
  },
  shell: (ctx, x, y) => {
    ell(ctx, x, y - 2, 3, 2, "#ffc8d0");
    r(ctx, x - 1, y - 4, 1, 3, "#e89aa8");
    r(ctx, x + 1, y - 4, 1, 3, "#e89aa8");
  },
  towel: (ctx, x, y) => {
    for (let i = 0; i < 5; i++) r(ctx, x - 10, y - 8 + i * 2, 20, 2, i % 2 ? "#5ab8ff" : "#ffffff");
  },
  ball: (ctx, x, y, t) => {
    const b = Math.abs(Math.sin(t * 2)) * 3;
    ell(ctx, x, y - 4 - b, 4, 4, "#ffffff");
    r(ctx, x - 4, y - 5 - b, 9, 2, "#ff5a6a");
    r(ctx, x - 1, y - 8 - b, 2, 8, "#3aa8ff");
  },
  xtree: (ctx, x, y, t) => {
    shadow(ctx, x, y, 10);
    r(ctx, x - 2, y - 5, 4, 5, "#6a4a2a");
    for (let i = 0; i < 4; i++) ell(ctx, x, y - 8 - i * 6, 11 - i * 2.5, 4, i % 2 ? "#2a8a4a" : "#3aa858");
    r(ctx, x - 2, y - 33, 4, 4, "#ffd040");
    const cols = ["#ff4a4a", "#ffd040", "#5ad0ff", "#ff8ad0"];
    for (let i = 0; i < 10; i++) r(ctx, x - 9 + ((i * 7) % 18), y - 9 - ((i * 5) % 22), 1, 1, cols[(i + Math.floor(t * 3)) % 4]!);
  },
  snowman: (ctx, x, y) => {
    shadow(ctx, x, y, 7);
    ell(ctx, x, y - 6, 6, 5, "#f8f8ff");
    ell(ctx, x, y - 15, 4, 4, "#f8f8ff");
    r(ctx, x - 1, y - 16, 1, 1, "#222");
    r(ctx, x + 1, y - 16, 1, 1, "#222");
    r(ctx, x, y - 14, 2, 1, "#ff8a1a");
    r(ctx, x - 4, y - 20, 9, 2, "#222");
    r(ctx, x - 2, y - 24, 5, 4, "#222");
    r(ctx, x - 4, y - 11, 9, 2, "#d8283a");
  },
  gifts: (ctx, x, y) => {
    r(ctx, x - 7, y - 7, 7, 7, "#d8283a");
    r(ctx, x - 4, y - 7, 1, 7, "#ffd040");
    r(ctx, x + 1, y - 9, 6, 9, "#3ab86a");
    r(ctx, x + 3, y - 9, 1, 9, "#ffffff");
  },
  candy: (ctx, x, y) => {
    for (let i = 0; i < 12; i++) r(ctx, x, y - i, 2, 1, i % 2 ? "#d8283a" : "#ffffff");
    r(ctx, x + 2, y - 13, 2, 2, "#d8283a");
    r(ctx, x + 4, y - 11, 1, 2, "#ffffff");
  },
  cauldron: (ctx, x, y, t) => {
    shadow(ctx, x, y, 11);
    ell(ctx, x, y - 6, 10, 6, "#2a2a32");
    ell(ctx, x, y - 11, 9, 2, "#7aff4a");
    for (let i = 0; i < 3; i++) ell(ctx, x - 4 + i * 4, y - 15 - ((t * 5 + i * 3) % 8), 1, 1, "#9aff6a");
    r(ctx, x - 6, y - 1, 3, 2, "#ff8a1a");
    r(ctx, x + 3, y - 1, 3, 2, "#ffd040");
  },
  tomb: (ctx, x, y) => {
    shadow(ctx, x, y, 7);
    r(ctx, x - 5, y - 12, 10, 12, "#7a7a8a");
    ell(ctx, x, y - 12, 5, 3, "#7a7a8a");
    r(ctx, x - 3, y - 9, 6, 1, "#4a4a5a");
    r(ctx, x - 3, y - 6, 6, 1, "#4a4a5a");
  },
  pumpkin: (ctx, x, y, t) => {
    ell(ctx, x, y - 4, 6, 4, "#ff8a1a");
    r(ctx, x - 1, y - 9, 2, 2, "#3a8a3a");
    const lit = Math.floor(t * 3) % 2 ? "#fff07a" : "#ffd040";
    r(ctx, x - 3, y - 5, 2, 1, lit);
    r(ctx, x + 2, y - 5, 2, 1, lit);
    r(ctx, x - 2, y - 2, 5, 1, lit);
  },
  candle: (ctx, x, y, t) => {
    r(ctx, x - 1, y - 7, 3, 7, "#f4ecd8");
    r(ctx, x, y - 9 - (Math.floor(t * 6) % 2), 1, 2, "#ffb030");
  },
  desk: (ctx, x, y) => {
    shadow(ctx, x, y, 11);
    r(ctx, x - 11, y - 10, 22, 4, "#a86a3a");
    r(ctx, x - 10, y - 6, 2, 6, "#6a4a2a");
    r(ctx, x + 8, y - 6, 2, 6, "#6a4a2a");
    r(ctx, x - 6, y - 12, 6, 2, "#f4f4f4");
    r(ctx, x + 3, y - 13, 3, 3, "#d8283a");
  },
  globe: (ctx, x, y, t) => {
    r(ctx, x - 1, y - 4, 2, 4, "#6a4a2a");
    ell(ctx, x, y - 9, 5, 5, "#3a8ad0");
    const o = Math.floor(t * 2) % 4;
    r(ctx, x - 3 + o, y - 11, 3, 3, "#3ab058");
  },
  books: (ctx, x, y) => {
    ["#d8283a", "#3a8ad0", "#3ab058", "#ffd040"].forEach((c, i) => r(ctx, x - 6 + i * 3, y - 9 + (i % 2), 3, 9 - (i % 2), c));
  },
  yut: (ctx, x, y) => {
    shadow(ctx, x, y, 12);
    r(ctx, x - 12, y - 8, 24, 8, "#c83a3a");
    r(ctx, x - 11, y - 7, 22, 6, "#f0d8a0");
    for (let i = 0; i < 4; i++) r(ctx, x - 8 + i * 5, y - 6 + (i % 2) * 2, 4, 1, "#8a5a36");
  },
  table: (ctx, x, y) => {
    shadow(ctx, x, y, 12);
    r(ctx, x - 12, y - 7, 24, 3, "#6a3a2a");
    r(ctx, x - 11, y - 4, 2, 4, "#4a2a1a");
    r(ctx, x + 9, y - 4, 2, 4, "#4a2a1a");
    ell(ctx, x - 4, y - 9, 2, 1, "#f4f4f4");
    ell(ctx, x + 4, y - 9, 2, 1, "#ffd040");
  },
  pouch: (ctx, x, y) => {
    ell(ctx, x, y - 4, 4, 4, "#e83a4a");
    r(ctx, x - 2, y - 9, 4, 2, "#ffd040");
    r(ctx, x - 1, y - 4, 2, 2, "#ffd040");
  },
  kite: (ctx, x, y, t) => {
    const b = Math.round(Math.sin(t * 2) * 2);
    r(ctx, x - 5, y - 22 + b, 10, 12, "#f4f4f4");
    r(ctx, x - 5, y - 22 + b, 10, 2, "#3a8ad0");
    ell(ctx, x, y - 16 + b, 2, 2, "#e83a4a");
    for (let i = 0; i < 9; i++) r(ctx, x + Math.round(Math.sin(t + i) * 1), y - 10 + b + i, 1, 1, "#8a8a8a");
  },
  sakura: (ctx, x, y, t) => {
    shadow(ctx, x, y, 10);
    r(ctx, x - 2, y - 12, 4, 12, "#6a4030");
    ell(ctx, x, y - 20, 12, 8, "#ffb0d0");
    ell(ctx, x - 4, y - 22, 6, 4, "#ffc8e0");
    for (let i = 0; i < 4; i++) r(ctx, x - 10 + ((i * 7 + Math.floor(t * 8)) % 20), y - 10 + ((i * 5 + Math.floor(t * 10)) % 12), 1, 1, "#ff8ab8");
  },
  torii: (ctx, x, y) => {
    r(ctx, x - 9, y - 18, 2, 18, "#d83a2a");
    r(ctx, x + 7, y - 18, 2, 18, "#d83a2a");
    r(ctx, x - 12, y - 20, 24, 3, "#d83a2a");
    r(ctx, x - 13, y - 22, 26, 2, "#2a2a2a");
    r(ctx, x - 9, y - 15, 18, 2, "#d83a2a");
  },
  stoneLantern: (ctx, x, y, t) => {
    r(ctx, x - 2, y - 6, 4, 6, "#9a9aa8");
    r(ctx, x - 4, y - 11, 8, 5, "#8a8a98");
    r(ctx, x - 2, y - 10, 4, 3, Math.floor(t * 2) % 2 ? "#ffe080" : "#ffc850");
    r(ctx, x - 5, y - 13, 10, 2, "#7a7a88");
  },
  bonsai: (ctx, x, y) => {
    r(ctx, x - 5, y - 3, 10, 3, "#4a3a5a");
    r(ctx, x - 1, y - 7, 2, 4, "#6a4030");
    ell(ctx, x - 2, y - 9, 4, 2, "#3a8a4a");
    ell(ctx, x + 3, y - 11, 3, 2, "#3a8a4a");
  },
  dragon: (ctx, x, y, t) => {
    shadow(ctx, x, y, 12);
    r(ctx, x - 6, y - 6, 12, 6, "#8a6a2a");
    for (let i = 0; i < 14; i++) r(ctx, x - 9 + i * 1.4, y - 12 - Math.round(Math.sin(i / 2 + t) * 3), 3, 3, "#f0c850");
    r(ctx, x + 9, y - 17, 4, 4, "#f0c850");
    r(ctx, x + 11, y - 16, 1, 1, "#d8283a");
  },
  vaseBig: (ctx, x, y) => {
    shadow(ctx, x, y, 6);
    ell(ctx, x, y - 7, 6, 7, "#f4f4ff");
    r(ctx, x - 2, y - 16, 4, 3, "#f4f4ff");
    r(ctx, x - 5, y - 8, 10, 2, "#3a5ad0");
    r(ctx, x - 3, y - 12, 6, 1, "#3a5ad0");
  },
  redLantern: (ctx, x, y, t) => {
    const s = Math.round(Math.sin(t * 2));
    r(ctx, x, y - 22, 1, 6, "#2a2a2a");
    ell(ctx, x + s, y - 12, 5, 5, "#e83a3a");
    r(ctx, x - 3 + s, y - 17, 7, 1, "#f0c850");
    r(ctx, x - 3 + s, y - 7, 7, 1, "#f0c850");
    r(ctx, x + s, y - 6, 1, 3, "#f0c850");
  },
  vase: (ctx, x, y) => {
    ell(ctx, x, y - 4, 3, 4, "#3a8a6a");
    r(ctx, x - 1, y - 9, 2, 2, "#3a8a6a");
    r(ctx, x - 1, y - 12, 1, 3, "#ff8ab8");
  },
  jukebox: (ctx, x, y, t) => {
    shadow(ctx, x, y, 9);
    r(ctx, x - 8, y - 18, 16, 18, "#c83a3a");
    ell(ctx, x, y - 18, 8, 4, "#ffd040");
    r(ctx, x - 5, y - 14, 10, 6, "#2a2a3a");
    for (let i = 0; i < 4; i++) r(ctx, x - 6 + i * 4, y - 6, 2, 4, ["#5ad0ff", "#ff5ad0", "#ffd040", "#7aff7a"][(i + Math.floor(t * 4)) % 4]!);
  },
  booth: (ctx, x, y) => {
    shadow(ctx, x, y, 12);
    r(ctx, x - 12, y - 12, 24, 5, "#c83a3a");
    r(ctx, x - 12, y - 7, 24, 7, "#a02a2a");
    r(ctx, x - 6, y - 10, 12, 3, "#f4f4f4");
    r(ctx, x - 2, y - 13, 4, 3, "#ffd040");
  },
  flag: (ctx, x, y, t) => {
    r(ctx, x - 6, y - 20, 1, 20, "#c8c8d0");
    const w = Math.round(Math.sin(t * 3));
    for (let i = 0; i < 5; i++) r(ctx, x - 5, y - 20 + i * 2 + (i % 2 ? w : 0), 12, 2, i % 2 ? "#ffffff" : "#d8283a");
    r(ctx, x - 5, y - 20, 5, 5, "#2a4ab0");
  },
  burger: (ctx, x, y) => {
    ell(ctx, x, y - 8, 5, 3, "#e8a040");
    r(ctx, x - 5, y - 6, 11, 1, "#3ab058");
    r(ctx, x - 5, y - 5, 11, 2, "#6a3a1a");
    r(ctx, x - 5, y - 3, 11, 2, "#e8a040");
  },
};

export function drawDecor(ctx: Ctx, kind: DecorKind, x: number, y: number, t: number): void {
  DRAW[kind](ctx, x, y, t);
}
