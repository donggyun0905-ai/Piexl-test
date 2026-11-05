// 토르켄 닻 휘두르기 그림: 커다란 금빛 닻이 몸을 중심으로 부채꼴을 그리며 휙 돌아감 (잔상 셋 + 뒤따르는 물살)
import { additive, crescent, easeOut, glow, type Ctx } from "./pwFxBits";

const GOLD = "#ffc84a";
const GOLD_HI = "#fff0a0";
const EDGE = "#5a3a12";
const CYAN = "#6ae8ff";

/** 닻 하나 (손잡이 자리 x·y에서 ang 쪽으로 길이 len) · 위에서 본 모양: 고리 · 가로대 · 자루 · 두 팔 · 갈고리 끝 */
export function anchorShape(ctx: Ctx, x: number, y: number, ang: number, len: number, a: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  ctx.globalAlpha *= a;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const head = len;
  const arm = len * 0.34;
  const path = () => {
    ctx.beginPath();
    // 자루
    ctx.moveTo(len * 0.12, 0);
    ctx.lineTo(head, 0);
    // 가로대 (손잡이 가까이)
    ctx.moveTo(len * 0.26, -len * 0.13);
    ctx.lineTo(len * 0.26, len * 0.13);
    // 두 팔: 끝에서 손 쪽으로 휜 반달
    ctx.moveTo(head - arm * 0.55, -arm);
    ctx.quadraticCurveTo(head + arm * 0.35, 0, head - arm * 0.55, arm);
  };
  // 테두리 → 금빛 → 밝은 심
  for (const [c, w] of [[EDGE, 7], [GOLD, 4.5], [GOLD_HI, 1.6]] as const) {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    path();
    ctx.stroke();
  }
  // 갈고리 끝(삼각 날)
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(head - arm * 0.55, s * arm);
    ctx.lineTo(head - arm * 0.15, s * (arm + 4));
    ctx.lineTo(head - arm * 1.05, s * (arm - 1));
    ctx.closePath();
    ctx.fillStyle = GOLD;
    ctx.strokeStyle = EDGE;
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
  }
  // 손잡이 고리
  ctx.strokeStyle = EDGE;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(len * 0.07, 0, 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.restore();
}

/** 닻 휘두르기 효과 (x·y = 몸, face = 바라보는 각, side = 휘두르는 쪽 1/-1, f = 0~1 진행, reach = 닿는 거리) */
export function drawAnchorSwing(ctx: Ctx, x: number, y: number, face: number, side: number, f: number, reach: number): void {
  const half = 1.75;
  const k = easeOut(Math.min(1, f / 0.55));
  const fade = f < 0.55 ? 1 : 1 - (f - 0.55) / 0.45;
  const at = (u: number) => face - side * half + side * half * 2 * u;
  // 지나온 길: 물살 초승달 (휘두른 만큼만)
  additive(ctx, () => {
    const mid = (at(0) + at(k)) / 2;
    const span = Math.abs(at(k) - at(0)) / 2;
    if (span > 0.05) {
      crescent(ctx, x, y, reach * 1.05, mid, span, 8, CYAN, 0.7 * fade);
      crescent(ctx, x, y, reach * 0.85, mid, span, 4, GOLD, 0.45 * fade);
    }
  });
  // 잔상 셋 (뒤로 갈수록 흐림)
  for (let i = 3; i >= 1; i--) anchorShape(ctx, x, y, at(Math.max(0, k - i * 0.09)), reach, 0.18 * (4 - i) * fade);
  // 닻 본체 + 끝 빛
  anchorShape(ctx, x, y, at(k), reach, fade);
  const tip = at(k);
  additive(ctx, () => glow(ctx, x + Math.cos(tip) * reach, y + Math.sin(tip) * reach, 14, GOLD_HI, 0.7 * fade, 0.8));
}
