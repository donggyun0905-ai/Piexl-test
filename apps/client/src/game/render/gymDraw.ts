// 단련의 방 바닥 기구 그림 (drawPickup이 부름): 0 샌드백(매달린 가죽 자루·쇠사슬·받침대) · 1 랫풀다운(높은 틀·위 도르래·가로 막대·추 더미) · 2 벤치 프레스(벤치·받침대·원판 끼운 바벨)
// 아직 안 쓴 방이면 기구 위에 F 빛이 깜박임 · 창을 열면(open) 더 밝게
type Ctx = CanvasRenderingContext2D;

function r(ctx: Ctx, c: string, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
}

export function drawGym(ctx: Ctx, device: number, x: number, y: number, tick: number, open: boolean, ready: boolean): void {
  r(ctx, "rgba(0,0,0,0.4)", x - 14, y + 9, 28, 3);
  if (device === 0) sandbag(ctx, x, y, tick);
  else if (device === 1) latPull(ctx, x, y, tick);
  else bench(ctx, x, y);
  if (!ready) return;
  // 쓸 수 있으면 머리 위 빛 고리 (열면 밝게)
  const a = open ? 0.95 : 0.45 + 0.35 * Math.sin(tick * 0.15);
  ctx.globalAlpha = a;
  ctx.strokeStyle = "#ffd84a";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(x, y + 10, 15, 4, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/** 샌드백: 받침 기둥과 위 팔 · 쇠사슬 · 흔들리는 붉은 가죽 자루(줄무늬·테이프) */
function sandbag(ctx: Ctx, x: number, y: number, tick: number): void {
  r(ctx, "#3a3a48", x + 9, y - 20, 3, 30);
  r(ctx, "#5a5a6a", x + 9, y - 20, 1, 30);
  r(ctx, "#3a3a48", x - 2, y - 21, 14, 3);
  r(ctx, "#2a2a34", x + 6, y + 8, 9, 3);
  const sway = Math.round(Math.sin(tick * 0.08) * 1.5);
  for (let k = 0; k < 4; k++) r(ctx, k % 2 ? "#8a8a9a" : "#c8c8d8", x + sway * (k / 4), y - 18 + k * 2, 1, 2);
  const bx = x - 5 + sway;
  r(ctx, "#5a1414", bx - 1, y - 11, 12, 19);
  r(ctx, "#b8282a", bx, y - 10, 10, 17);
  r(ctx, "#e04a4a", bx + 1, y - 10, 2, 17);
  r(ctx, "#7a1a1a", bx + 8, y - 10, 2, 17);
  r(ctx, "#f0e0c0", bx, y - 7, 10, 1);
  r(ctx, "#f0e0c0", bx, y + 3, 10, 1);
}

/** 랫풀다운: 높은 쇠틀 · 위 도르래와 줄 · 넓은 가로 손잡이 · 오른쪽 추 더미 · 아래 앉는 자리 */
function latPull(ctx: Ctx, x: number, y: number, tick: number): void {
  r(ctx, "#2c2c38", x - 12, y - 22, 3, 32);
  r(ctx, "#2c2c38", x + 9, y - 22, 3, 32);
  r(ctx, "#4a4a5a", x - 12, y - 22, 24, 3);
  r(ctx, "#8a8a9a", x - 1, y - 21, 2, 2);
  const pull = Math.round(2 + Math.sin(tick * 0.1) * 2);
  r(ctx, "#c8c8d8", x, y - 19, 1, 4 + pull);
  r(ctx, "#1a1a22", x - 10, y - 15 + pull, 20, 2);
  r(ctx, "#e0e0f0", x - 10, y - 15 + pull, 20, 1);
  for (let k = 0; k < 5; k++) r(ctx, k % 2 ? "#5a5a6a" : "#7a7a8a", x + 13, y - 6 + k * 3, 5, 2);
  r(ctx, "#6a2a8a", x - 5, y + 2, 10, 3);
  r(ctx, "#8a4aaa", x - 5, y + 2, 10, 1);
}

/** 벤치 프레스: 길쭉한 벤치 · 양쪽 받침 기둥 · 원판(검정·빨강) 끼운 긴 바벨 */
function bench(ctx: Ctx, x: number, y: number): void {
  r(ctx, "#2a2a34", x - 10, y + 2, 2, 7);
  r(ctx, "#2a2a34", x + 8, y + 2, 2, 7);
  r(ctx, "#1a1a22", x - 11, y - 2, 22, 5);
  r(ctx, "#3a3a6a", x - 10, y - 2, 20, 3);
  r(ctx, "#5a5a9a", x - 10, y - 2, 20, 1);
  r(ctx, "#4a4a5a", x - 9, y - 14, 2, 12);
  r(ctx, "#4a4a5a", x + 7, y - 14, 2, 12);
  r(ctx, "#c8c8d8", x - 17, y - 14, 34, 2);
  for (const sx of [-1, 1]) {
    r(ctx, "#1a1a1a", x + sx * 13 - 2, y - 19, 4, 12);
    r(ctx, "#c83a3a", x + sx * 13 - 1, y - 18, 2, 10);
    r(ctx, "#1a1a1a", x + sx * 16 - 1, y - 17, 2, 8);
  }
}
