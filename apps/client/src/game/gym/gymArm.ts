// 단련의 방 미니게임의 팔 그림: 점수가 1000에 가까울수록(k 0→1) 팔이 굵어지고 이두가 불룩, 0.35를 넘으면 핏줄이 점점 또렷하게, 끝 무렵엔 붉게 달아오름

/** 팔 하나: (x0,y0) 어깨 쪽 → (x1,y1) 손 쪽 · fist면 끝에 주먹 */
export function drawArm(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, k: number, fist = false): void {
  const len = Math.hypot(x1 - x0, y1 - y0) || 1;
  const ux = (x1 - x0) / len;
  const uy = (y1 - y0) / len;
  const nx = -uy;
  const ny = ux;
  const base = 12 + 18 * k;
  const width = (t: number) => base * (0.8 + (0.25 + 0.55 * k) * Math.sin(Math.PI * Math.min(1, t * 1.25)));
  const N = 14;
  const at = (t: number, side: number) => {
    const w = (width(t) / 2) * side;
    return [x0 + ux * len * t + nx * w, y0 + uy * len * t + ny * w] as const;
  };
  ctx.beginPath();
  for (let i = 0; i <= N; i++) ctx.lineTo(...at(i / N, 1));
  for (let i = N; i >= 0; i--) ctx.lineTo(...at(i / N, -1));
  ctx.closePath();
  const g = ctx.createLinearGradient(...at(0.5, 1), ...at(0.5, -1));
  const heat = Math.max(0, k - 0.7) / 0.3;
  g.addColorStop(0, `rgb(${240}, ${196 - heat * 30}, ${160 - heat * 40})`);
  g.addColorStop(0.55, `rgb(${226}, ${170 - heat * 30}, ${132 - heat * 40})`);
  g.addColorStop(1, `rgb(${178}, ${118 - heat * 20}, ${90 - heat * 30})`);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = "rgba(60, 30, 20, 0.6)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // 이두 위 밝은 빛
  ctx.strokeStyle = "rgba(255, 240, 220, 0.5)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 3; i <= 9; i++) ctx.lineTo(...at(i / N, 0.55));
  ctx.stroke();
  // 핏줄: 팔을 따라 구불구불한 줄 셋 (k가 클수록 진하고 굵게)
  const vein = Math.max(0, (k - 0.35) / 0.65);
  if (vein > 0) {
    ctx.lineCap = "round";
    for (const [off, ph] of [[-0.25, 0], [0.15, 2], [0.32, 4]] as const) {
      ctx.strokeStyle = `rgba(90, 40, 120, ${0.25 + 0.55 * vein})`;
      ctx.lineWidth = 0.8 + 1.2 * vein;
      ctx.beginPath();
      for (let i = 2; i <= N - 1; i++) {
        const t = i / N;
        const w = (width(t) / 2) * (off + 0.12 * Math.sin(t * 18 + ph));
        ctx.lineTo(x0 + ux * len * t + nx * w, y0 + uy * len * t + ny * w);
      }
      ctx.stroke();
    }
    ctx.lineCap = "butt";
  }
  if (fist) {
    ctx.fillStyle = `rgb(232, ${180 - heat * 30}, ${140 - heat * 40})`;
    ctx.beginPath();
    ctx.arc(x1, y1, base * 0.62, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(60, 30, 20, 0.6)";
    ctx.stroke();
  }
}
