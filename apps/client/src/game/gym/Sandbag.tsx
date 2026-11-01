// 샌드백 미니게임: 가운데 화살표(↑↓←→, 바로 앞 두 번과 다른 방향)가 뜨고 바깥 고리가 줄어드는 동안 같은 방향 키(화살표·WASD 또는 화면 버튼)를 누르면 퍽! (터지는 효과)
// 시간 제한은 없고 맞힐수록 고리가 빨리 줄어듦 · 틀리거나 늦으면 실수, 실수 3번이면 끝 · 한 번에 25점 (1000점까지)
import { createRng } from "@pixel-rogue/shared";
import { useRef, useState } from "react";
import { play } from "../../audio/sound";
import type { TextKey } from "../../i18n";
import { drawBursts, label, MAX_SCORE, useFrame, useGymKeys, type Burst } from "./gymKit";

const DIRS = ["up", "down", "left", "right"] as const;
type Dir = (typeof DIRS)[number];
const KEYS: Record<string, Dir> = { ArrowUp: "up", KeyW: "up", ArrowDown: "down", KeyS: "down", ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right" };
const ARROW: Record<Dir, string> = { up: "↑", down: "↓", left: "←", right: "→" };
const W = 420;
const H = 260;

export function Sandbag({ onDone, t }: { onDone: (score: number) => void; t: (k: TextKey) => string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const st = useRef({ dir: "up" as Dir, prev: "up" as Dir, left: 1.1, full: 1.1, score: 0, miss: 0, hits: 0, bursts: [] as Burst[], shake: 0, over: false });
  const [, redraw] = useState(0);
  // 방향만 정함 (점수 계산과 상관없는 화면 놀이라 시각으로 시드)
  const [rng] = useState(() => createRng(Date.now() >>> 0));

  const next = () => {
    const s = st.current;
    // 바로 앞·그 앞과 다른 방향만 (같은 것 반복·두 개 번갈아 반복이 안 나오게)
    const pick = DIRS.filter((d) => d !== s.dir && d !== s.prev);
    s.prev = s.dir;
    s.dir = pick[Math.floor(rng.nextFloat() * pick.length)]!;
    s.full = Math.max(0.3, 1.1 - s.hits * 0.032);
    s.left = s.full;
  };
  const miss = () => {
    const s = st.current;
    s.miss++;
    s.shake = 0.25;
    play("gymMiss");
    if (s.miss >= 3) {
      play("gymEnd");
      s.over = true;
      redraw((n) => n + 1);
      setTimeout(() => onDone(s.score), 700);
    } else next();
  };
  const press = (d: Dir) => {
    const s = st.current;
    if (s.over) return;
    if (d !== s.dir) return miss();
    s.hits++;
    play("gymPunch");
    s.score = Math.min(MAX_SCORE, s.score + 25);
    s.bursts.push({ x: W / 2, y: H / 2, age: 0, color: "#ffb03a" });
    s.shake = 0.12;
    if (s.score >= MAX_SCORE) {
      play("gymEnd");
      s.over = true;
      setTimeout(() => onDone(s.score), 700);
      return;
    }
    next();
  };
  useGymKeys((code) => KEYS[code] && press(KEYS[code]));

  useFrame((dt) => {
    const s = st.current;
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    if (!s.over) {
      s.left -= dt;
      if (s.left <= 0) miss();
    }
    s.shake = Math.max(0, s.shake - dt);
    const sx = s.shake ? (Math.random() - 0.5) * 8 : 0;
    ctx.clearRect(0, 0, W, H);
    // 샌드백 (흔들림)
    ctx.fillStyle = "#3a1414";
    ctx.fillRect(W / 2 - 46 + sx, 20, 92, 210);
    ctx.fillStyle = "#b8282a";
    ctx.fillRect(W / 2 - 42 + sx, 24, 84, 202);
    ctx.fillStyle = "#f0e0c0";
    ctx.fillRect(W / 2 - 42 + sx, 60, 84, 6);
    ctx.fillRect(W / 2 - 42 + sx, 190, 84, 6);
    // 줄어드는 고리 · 가운데 화살표
    if (!s.over) {
      const k = s.left / s.full;
      ctx.strokeStyle = k < 0.35 ? "#ff5a5a" : "#ffd84a";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, 34 + 60 * k, 0, Math.PI * 2);
      ctx.stroke();
      label(ctx, ARROW[s.dir], W / 2, H / 2 + 22, 64, "#ffffff");
    }
    s.bursts = drawBursts(ctx, s.bursts, dt);
    label(ctx, `${s.score}`, 60, 40, 28, "#ffd84a");
    label(ctx, "✕".repeat(s.miss) + "·".repeat(3 - s.miss), W - 60, 40, 24, "#ff7a7a");
    if (s.over) label(ctx, t("gymEnd"), W / 2, H / 2 + 14, 48, "#ffffff");
  });

  return (
    <div className="gym-game">
      <canvas ref={canvas} width={W} height={H} />
      <div className="gym-pads arrows">
        {DIRS.map((d) => (
          <button key={d} type="button" onPointerDown={() => press(d)}>
            {ARROW[d]}
          </button>
        ))}
      </div>
    </div>
  );
}
