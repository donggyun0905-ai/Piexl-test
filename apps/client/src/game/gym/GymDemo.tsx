// 단련의 방 설명 창의 예시 화면 (GymPanel, '시작하기' 전): 그 기구 미니게임을 저절로 하는 짧은 장면이 되풀이됨
// 샌드백: 화살표 → 고리가 줄 때 같은 방향 키 누름 → 퍽! · 랫풀다운: 공이 색칠된 칸에 들어올 때 패드 → 펑! (가끔 놓쳐 실수 보여 줌) · 벤치 프레스: 패드를 계속 눌러 힘 게이지 유지
// 점수·포인트와 상관없는 화면 놀이 (실제 판에 영향 없음)
import { useRef } from "react";
import type { TextKey } from "../../i18n";
import { drawBursts, label, useFrame, type Burst } from "./gymKit";

const W = 300;
const H = 150;
const ARROWS = ["↑", "→", "↓", "←"];

/** 아래 누르는 키 (눌렸으면 밝게) */
function keyCap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, on: boolean): void {
  ctx.fillStyle = on ? "#ffd84a" : "#2a2238";
  ctx.fillRect(x - 22, y - 13, 44, 26);
  ctx.strokeStyle = on ? "#fff4b0" : "#6a5a88";
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 22, y - 13, 44, 26);
  label(ctx, text, x, y + 6, 15, on ? "#1a1020" : "#d8d0f0");
}

/** 샌드백: 1.4초마다 한 번 (고리가 줄다가 60%에서 누름) */
function sandbag(ctx: CanvasRenderingContext2D, t: number, st: Demo): void {
  const i = Math.floor(t / 1.4);
  const k = (t % 1.4) / 1.4;
  const hit = k > 0.6;
  ctx.fillStyle = "#b8282a";
  ctx.fillRect(W / 2 - 26 + (hit && k < 0.7 ? 3 : 0), 14, 52, 100);
  if (!hit) {
    ctx.strokeStyle = k > 0.45 ? "#ff5a5a" : "#ffd84a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(W / 2, 64, 20 + 34 * (1 - k / 0.6), 0, Math.PI * 2);
    ctx.stroke();
    label(ctx, ARROWS[i % 4]!, W / 2, 76, 34, "#ffffff");
  } else if (st.last !== i) {
    st.last = i;
    st.score += 25;
    st.bursts.push({ x: W / 2, y: 64, age: 0, color: "#ffd84a" });
  }
  keyCap(ctx, ARROWS[i % 4]!, W / 2, H - 18, hit && k < 0.75);
}

/** 랫풀다운: 공 하나가 2초마다 옆에서 굴러옴 · 네 번째는 놓쳐 실수 */
function latPull(ctx: CanvasRenderingContext2D, t: number, st: Demo): void {
  const i = Math.floor(t / 2);
  const k = (t % 2) / 2;
  const fromLeft = i % 2 === 0;
  const miss = i % 4 === 3;
  ctx.fillStyle = "#2a2238";
  ctx.fillRect(20, 50, W - 40, 22);
  ctx.fillStyle = "#3aa86a";
  ctx.fillRect(W / 2 - 30, 50, 60, 22);
  const x = fromLeft ? 30 + k * (W - 60) : W - 30 - k * (W - 60);
  const inZone = Math.abs(x - W / 2) < 26;
  const popped = !miss && k > 0.5;
  if (!popped) {
    ctx.fillStyle = "#f0e0c0";
    ctx.beginPath();
    ctx.arc(x, 61, 8, 0, Math.PI * 2);
    ctx.fill();
  } else if (st.last !== i) {
    st.last = i;
    st.score += 25;
    st.bursts.push({ x: W / 2, y: 61, age: 0, color: "#7ae08a" });
  }
  if (miss && k > 0.9) label(ctx, "✕", W / 2, 40, 18, "#ff7a7a");
  keyCap(ctx, "Space", W / 2, H - 18, !miss && inZone && k <= 0.55);
}

/** 벤치 프레스: 힘 게이지가 빠지면 짧게 연타해 다시 채움 */
function bench(ctx: CanvasRenderingContext2D, t: number): void {
  const k = (t % 1.2) / 1.2;
  const tapping = k > 0.55;
  const power = tapping ? 0.45 + (k - 0.55) * 1.2 : 0.95 - k;
  const y = 70 - power * 30;
  ctx.fillStyle = "#8a8a9a";
  ctx.fillRect(W / 2 - 80, y, 160, 6);
  ctx.fillStyle = "#3a3a48";
  ctx.fillRect(W / 2 - 92, y - 12, 14, 30);
  ctx.fillRect(W / 2 + 78, y - 12, 14, 30);
  ctx.fillStyle = "#2a2238";
  ctx.fillRect(W - 34, 20, 14, 90);
  ctx.fillStyle = power > 0.35 ? "#7ae08a" : "#ff5a5a";
  ctx.fillRect(W - 32, 108 - 86 * power, 10, 86 * power);
  keyCap(ctx, "Space", W / 2, H - 18, tapping && Math.floor(t * 12) % 2 === 0);
}

interface Demo {
  last: number;
  score: number;
  bursts: Burst[];
}

export function GymDemo({ device, t }: { device: number; t: (k: TextKey) => string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const st = useRef<Demo>({ last: -1, score: 0, bursts: [] });
  useFrame((dt, time) => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const s = st.current;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#140f1c";
    ctx.fillRect(0, 0, W, H);
    if (device === 1) latPull(ctx, time, s);
    else if (device === 2) bench(ctx, time);
    else sandbag(ctx, time, s);
    s.bursts = drawBursts(ctx, s.bursts, dt);
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "#9adcff";
    ctx.fillText(`▶ ${t("gymDemo")}`, 8, 16);
    if (device !== 2) label(ctx, `${s.score % 1000}`, W - 30, 22, 14, "#ffd84a");
  });
  return <canvas ref={canvas} className="gym-demo" width={W} height={H} />;
}
