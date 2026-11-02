// 벤치 프레스 미니게임: 무거운 바벨을 든 두 팔 · 아래 동그란 패드(Space·F·클릭)를 계속 눌러 힘 게이지를 유지 → 바벨이 버팀
// 시간이 지날수록 힘이 빨리 빠져 더 많이 눌러야 함 · 힘이 다 빠지면 바벨을 안전바에 내려놓고 끝 · 버틴 1초마다 25점 (40초 = 1000점)
import { useRef, useState } from "react";
import { play } from "../../audio/sound";
import type { TextKey } from "../../i18n";
import { drawArm } from "./gymArm";
import { drawBursts, label, MAX_SCORE, useFrame, useGymBeat, useGymKeys, type Burst } from "./gymKit";

const W = 420;
const H = 260;
/** 누를 때마다 차는 힘 · 처음 빠지는 힘(초당) · 1초마다 더 빨리 빠지는 몫 */
const PUSH = 6;
const DRAIN = 20;
const DRAIN_UP = 1.7;

export function BenchPress({ onDone, t }: { onDone: (score: number) => void; t: (k: TextKey) => string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const st = useRef({ force: 60, time: 0, over: false, drop: 0, bursts: [] as Burst[] });
  const [, redraw] = useState(0);
  const score = () => Math.min(MAX_SCORE, Math.floor(st.current.time * 25));

  const press = () => {
    const s = st.current;
    if (s.over) return;
    const was = s.force;
    s.force = Math.min(100, s.force + PUSH);
    play("gymPush");
    if (s.force >= 100 && was < 100) {
      s.bursts.push({ x: W / 2, y: 70, age: 0, color: "#ffd84a" });
      play("gymFull");
    }
  };
  useGymBeat(() => st.current.over);
  useGymKeys((code) => (code === "Space" || code === "KeyF" || code === "Enter") && press());

  useFrame((dt) => {
    const s = st.current;
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    if (!s.over) {
      s.time += dt;
      s.force -= (DRAIN + DRAIN_UP * s.time) * dt;
      if (s.force <= 0 || score() >= MAX_SCORE) {
        s.force = Math.max(0, s.force);
        s.over = true;
        play(score() >= MAX_SCORE ? "gymEnd" : "gymMiss");
        setTimeout(() => play("gymRack"), 600);
        redraw((n) => n + 1);
        setTimeout(() => onDone(score()), 1100);
      }
    } else s.drop = Math.min(1, s.drop + dt * 1.5);
    ctx.clearRect(0, 0, W, H);
    // 안전바 · 벤치
    ctx.fillStyle = "#5a5a6a";
    ctx.fillRect(70, 150, 10, 90);
    ctx.fillRect(W - 80, 150, 10, 90);
    ctx.fillStyle = "#c8c8d8";
    ctx.fillRect(60, 150, 30, 6);
    ctx.fillRect(W - 90, 150, 30, 6);
    ctx.fillStyle = "#3a3a6a";
    ctx.fillRect(110, 210, W - 220, 24);
    // 바벨 높이: 힘이 많을수록 위 · 끝나면 안전바(150)로 내려감
    const up = 60 + (1 - s.force / 100) * 70;
    const by = s.over ? up + (144 - up) * s.drop : up;
    // 팔 (바벨까지, 1000점에 가까울수록 굵고 핏줄)
    for (const x of [158, W - 158]) drawArm(ctx, x, 206, x, by + 6, score() / MAX_SCORE);
    // 바벨 · 원판 (힘이 적으면 흔들림)
    const wob = !s.over && s.force < 30 ? Math.sin(s.time * 40) * 2 : 0;
    ctx.fillStyle = "#d8d8e8";
    ctx.fillRect(40, by + wob, W - 80, 8);
    for (const x of [44, W - 70]) {
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(x, by - 26 + wob, 26, 60);
      ctx.fillStyle = "#c83a3a";
      ctx.fillRect(x + 4, by - 22 + wob, 18, 52);
    }
    // 힘 게이지
    ctx.fillStyle = "#22202e";
    ctx.fillRect(W / 2 - 100, 24, 200, 14);
    ctx.fillStyle = s.force < 30 ? "#ff5a5a" : s.force < 60 ? "#ffd84a" : "#7ae88a";
    ctx.fillRect(W / 2 - 100, 24, 2 * s.force, 14);
    s.bursts = drawBursts(ctx, s.bursts, dt);
    label(ctx, `${score()}`, 50, 40, 26, "#ffd84a");
    if (s.over) label(ctx, t("gymRack"), W / 2, 120, 30, "#ffffff");
  });

  return (
    <div className="gym-game">
      <canvas ref={canvas} width={W} height={H} />
      <div className="gym-pads">
        <button type="button" className="gym-pad" onPointerDown={press} aria-label={t("gymPad")}>
          ●
        </button>
      </div>
    </div>
  );
}
