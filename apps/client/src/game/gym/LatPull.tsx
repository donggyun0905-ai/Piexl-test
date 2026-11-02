// 랫풀다운 미니게임: 긴 게이지 가운데 색칠된 칸 · 왼쪽·오른쪽 끝에서 공이 한 번에 1~2개씩(어느 쪽인지 무작위) 가운데로 굴러옴 → 공이 색칠된 칸 안에 있을 때 아래 동그란 패드(Space·F·클릭)를 누르면 펑! (터지는 효과)
// 칸 밖에서 누르거나 공이 반대쪽 끝까지 가 버리면 실수, 실수 3번이면 끝 · 터뜨릴수록 공이 빨라지고 둘씩 자주 나옴 · 하나에 25점 (1000점까지)
import { createRng } from "@pixel-rogue/shared";
import { useRef, useState } from "react";
import { play } from "../../audio/sound";
import type { TextKey } from "../../i18n";
import { drawArm } from "./gymArm";
import { drawBursts, label, MAX_SCORE, useFrame, useGymBeat, useGymKeys, type Burst } from "./gymKit";

const W = 420;
const H = 220;
const GX0 = 30;
const GX1 = W - 30;
const GY = 110;
const ZONE = 70;

interface Ball {
  x: number;
  dir: 1 | -1;
}

export function LatPull({ onDone, t }: { onDone: (score: number) => void; t: (k: TextKey) => string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  // 공이 나오는 쪽·개수만 정함 (점수 계산과 상관없는 화면 놀이라 시각으로 시드)
  const [rng] = useState(() => ({ current: createRng(Date.now() >>> 0) }));
  const st = useRef({ balls: [] as Ball[], score: 0, miss: 0, pops: 0, spawn: 0.4, bursts: [] as Burst[], over: false, flash: 0 });
  const [, redraw] = useState(0);
  const speed = () => 150 + st.current.pops * 8;
  const inZone = (x: number) => Math.abs(x - W / 2) <= ZONE / 2;

  const end = () => {
    const s = st.current;
    s.over = true;
    play("gymEnd");
    redraw((n) => n + 1);
    setTimeout(() => onDone(s.score), 700);
  };
  const miss = () => {
    const s = st.current;
    s.miss++;
    s.flash = 0.25;
    play("gymMiss");
    if (s.miss >= 3) end();
  };
  const press = () => {
    const s = st.current;
    if (s.over) return;
    const hit = s.balls.filter((b) => inZone(b.x)).sort((a, b) => Math.abs(a.x - W / 2) - Math.abs(b.x - W / 2))[0];
    if (!hit) return miss();
    s.balls = s.balls.filter((b) => b !== hit);
    s.pops++;
    play("gymPop");
    s.score = Math.min(MAX_SCORE, s.score + 25);
    s.bursts.push({ x: hit.x, y: GY, age: 0, color: "#5ad8ff" });
    if (s.score >= MAX_SCORE) end();
  };
  useGymBeat(() => st.current.over, () => 1 + st.current.pops * 0.02);
  useGymKeys((code) => (code === "Space" || code === "KeyF" || code === "Enter") && press());

  useFrame((dt) => {
    const s = st.current;
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    if (!s.over) {
      s.spawn -= dt;
      if (s.spawn <= 0) {
        // 1~2개 (터뜨릴수록 2개가 자주) · 쪽은 무작위, 같은 쪽 둘이면 뒤 공은 조금 뒤에서
        const n = rng.current.nextFloat() < Math.min(0.6, 0.3 + s.pops * 0.012) ? 2 : 1;
        const sides: (1 | -1)[] = [];
        for (let i = 0; i < n; i++) {
          const dir: 1 | -1 = rng.current.nextFloat() < 0.5 ? 1 : -1;
          const behind = sides.filter((d) => d === dir).length * 46;
          sides.push(dir);
          s.balls.push({ x: dir > 0 ? GX0 - behind : GX1 + behind, dir });
        }
        s.spawn = Math.max(0.5, 1.2 - s.pops * 0.03) + (n - 1) * 0.25;
      }
      const moved = s.balls.map((b) => ({ ...b, x: b.x + b.dir * speed() * dt }));
      const out = moved.filter((b) => (b.dir < 0 && b.x < GX0 - 2) || (b.dir > 0 && b.x > GX1 + 2));
      s.balls = moved.filter((b) => !out.includes(b));
      out.forEach(() => miss());
    }
    s.flash = Math.max(0, s.flash - dt);
    ctx.clearRect(0, 0, W, H);
    // 손잡이를 당기는 양팔 (터뜨린 직후 살짝 당김, 1000점에 가까울수록 굵고 핏줄)
    for (const side of [-1, 1]) drawArm(ctx, W / 2 + side * 110, H + 6, W / 2 + side * 90, GY + 18 + (s.bursts.length ? 8 : 0), s.score / MAX_SCORE, true);
    // 게이지 · 색칠된 칸
    ctx.fillStyle = s.flash ? "#5a1a24" : "#22202e";
    ctx.fillRect(GX0, GY - 14, GX1 - GX0, 28);
    ctx.fillStyle = "#3a8a4a";
    ctx.fillRect(W / 2 - ZONE / 2, GY - 14, ZONE, 28);
    ctx.fillStyle = "#7ae88a";
    ctx.fillRect(W / 2 - ZONE / 2, GY - 14, ZONE, 3);
    ctx.strokeStyle = "#8a84a0";
    ctx.lineWidth = 2;
    ctx.strokeRect(GX0, GY - 14, GX1 - GX0, 28);
    // 공
    for (const b of s.balls) {
      if (b.x < GX0 - 12 || b.x > GX1 + 12) continue;
      ctx.fillStyle = inZone(b.x) ? "#fff27a" : "#e8e4f0";
      ctx.beginPath();
      ctx.arc(b.x, GY, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(b.x - 5, GY - 6, 3, 3);
    }
    s.bursts = drawBursts(ctx, s.bursts, dt);
    label(ctx, `${s.score}`, 60, 40, 28, "#ffd84a");
    label(ctx, "✕".repeat(s.miss) + "·".repeat(3 - s.miss), W - 60, 40, 24, "#ff7a7a");
    if (s.over) label(ctx, t("gymEnd"), W / 2, 190, 40, "#ffffff");
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
