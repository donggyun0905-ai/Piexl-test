// 몸 움직임 꾸밈 (화면 전용): 발밑 그림자 · 가만히 있을 때 숨 쉬듯 1칸 오르내림 · 맞은 적이 살짝 부풀었다 돌아옴
type Ctx = CanvasRenderingContext2D;

/** 발밑 그림자 (몸 반지름 r) */
export function footShadow(ctx: Ctx, x: number, y: number, r: number): void {
  ctx.fillStyle = "rgba(0, 0, 0, 0.26)";
  ctx.beginPath();
  ctx.ellipse(x, y + r * 0.95, r * 0.95, Math.max(1.5, r * 0.36), 0, 0, Math.PI * 2);
  ctx.fill();
}

/** 가만히 있으면 발을 기준으로 숨 쉬듯 살짝 눌렸다 펴짐 (on이 아니면 그대로) */
export function breathe(ctx: Ctx, x: number, footY: number, tick: number, on: boolean, draw: () => void): void {
  if (!on || Math.sin(tick / 22) < 0.2) return draw();
  ctx.save();
  ctx.translate(x, footY);
  ctx.scale(1.02, 0.965);
  ctx.translate(-x, -footY);
  draw();
  ctx.restore();
}

/** 맞은 적 크기 배율 (맞은 순간 살짝 커졌다 돌아옴) */
export const hitPop = (hitFlash: number): number => 1 + Math.max(0, hitFlash) * 0.012;
