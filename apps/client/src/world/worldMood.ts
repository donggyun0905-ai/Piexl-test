// 지역 분위기 효과 (Region.mood, 매 장면 · 화면 좌표가 아닌 지도 좌표로 그림): 지옥 불씨(가운데 가까울수록 초록, 멀수록 붉음) · 해저 거품·물결 빛 · 사이버펑크 비 · 바람골 꽃잎 · 성국 금빛 · 색 보정
// 입자 자리는 시간·번호로만 정함 (랜덤 없음 → 매 장면 같은 곳에서 이어짐)
import type { View } from "../lobby/walker";

export type Mood = "embers" | "bubbles" | "rain" | "petals" | "holy" | "cellar";

type Ctx = CanvasRenderingContext2D;
/** 정해진 수 0~1 */
const fr = (n: number): number => {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

/** 화면 전체를 덮는 색 (지도 좌표 view에 맞춰) */
const TINT: Record<Mood, string> = {
  embers: "rgba(120,20,10,0.16)",
  bubbles: "rgba(20,70,140,0.18)",
  rain: "rgba(20,10,60,0.26)",
  petals: "rgba(255,240,220,0.04)",
  holy: "rgba(255,230,150,0.06)",
  cellar: "rgba(10,10,30,0.22)",
};

/** 입자 하나: 지도 좌표 x, y와 0~1 진행 */
function each(v: View, n: number, period: number, t: number, fn: (x: number, y: number, k: number, i: number) => void): void {
  for (let i = 0; i < n; i++) {
    const k = (t / period + fr(i)) % 1;
    fn(v.x + fr(i + 0.37) * v.w, v.y + fr(i + 0.71) * v.h, k, i);
  }
}

/** center = 지옥 불씨 색이 초록이 되는 가운데(지도 픽셀), 멀수록 붉음 */
export function drawMood(g: Ctx, mood: Mood, v: View, t: number, center?: readonly [number, number]): void {
  g.fillStyle = TINT[mood];
  g.fillRect(v.x, v.y, v.w, v.h);
  if (mood === "embers") {
    each(v, 70, 4, t, (x, y, k, i) => {
      const px = x + Math.sin(t * 1.3 + i) * 6;
      const py = y + v.h * 0.3 - k * v.h * 0.6;
      const d = center ? Math.min(1, Math.hypot(px - center[0], py - center[1]) / 900) : 1;
      const r = Math.round(90 + 165 * d);
      const gg = Math.round(230 - 150 * d);
      g.fillStyle = `rgba(${r},${gg},40,${0.85 * (1 - k)})`;
      g.fillRect(px, py, i % 3 ? 1 : 2, i % 3 ? 1 : 2);
    });
  } else if (mood === "bubbles" || mood === "cellar") {
    if (mood === "bubbles") {
      // 위에서 비치는 물결 빛 (넓은 밝은 띠가 천천히 흐름)
      for (let i = 0; i < 6; i++) {
        const x = v.x + ((i * 97 + t * 9) % (v.w + 120)) - 60;
        g.fillStyle = "rgba(180,230,255,0.05)";
        g.fillRect(x, v.y, 26 + (i % 3) * 10, v.h);
      }
    }
    each(v, mood === "bubbles" ? 40 : 18, mood === "bubbles" ? 5 : 9, t, (x, y, k, i) => {
      const px = x + Math.sin(t * 2 + i) * 3;
      const py = y + v.h * 0.4 - k * v.h * 0.8;
      g.strokeStyle = mood === "bubbles" ? `rgba(220,245,255,${0.7 * (1 - k)})` : `rgba(200,200,220,${0.35 * (1 - k)})`;
      g.lineWidth = 0.6;
      g.beginPath();
      g.arc(px, py, mood === "bubbles" ? 1 + (i % 3) : 0.6, 0, Math.PI * 2);
      g.stroke();
    });
  } else if (mood === "rain") {
    g.strokeStyle = "rgba(170,200,255,0.35)";
    g.lineWidth = 0.6;
    g.beginPath();
    each(v, 90, 0.7, t, (x, y, k) => {
      const py = v.y + ((y - v.y + k * v.h) % v.h);
      g.moveTo(x, py);
      g.lineTo(x - 2, py + 7);
    });
    g.stroke();
  } else if (mood === "petals" || mood === "holy") {
    each(v, mood === "petals" ? 34 : 26, mood === "petals" ? 7 : 6, t, (x, y, k, i) => {
      if (mood === "petals") {
        // 바람에 날리는 꽃잎 (왼쪽 → 오른쪽)
        const px = v.x + ((x - v.x + k * v.w * 0.8) % v.w);
        const py = y + Math.sin(t * 2 + i) * 6 + k * 20;
        g.fillStyle = i % 2 ? "rgba(255,190,215,0.85)" : "rgba(255,240,245,0.85)";
        g.fillRect(px, py, 2, 1);
      } else {
        // 위로 떠오르는 금빛
        g.fillStyle = `rgba(255,226,140,${0.7 * Math.sin(k * Math.PI)})`;
        g.fillRect(x, y - k * 30, 1, 1);
      }
    });
    if (mood === "petals") {
      // 바람 줄기
      g.strokeStyle = "rgba(255,255,255,0.18)";
      g.lineWidth = 0.6;
      for (let i = 0; i < 4; i++) {
        const k = (t / 3 + i / 4) % 1;
        const y = v.y + fr(i + 3.1) * v.h;
        const x = v.x + k * (v.w + 80) - 40;
        g.beginPath();
        g.moveTo(x, y);
        g.quadraticCurveTo(x + 20, y - 4, x + 40, y);
        g.stroke();
      }
    }
  }
}
