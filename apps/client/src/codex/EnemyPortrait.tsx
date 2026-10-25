// 도감 몬스터 그림: 움직임 칸을 차례로 (그림을 다 불러오기 전에는 빈 칸). 모르는 적은 검은 실루엣
import { useEffect, useRef } from "react";
import { drawEnemySprite, enemyCell } from "../game/sprites";

export function EnemyPortrait({ kind, size, hidden = false }: { kind: string; size: number; hidden?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      ctx.imageSmoothingEnabled = false;
      const cell = enemyCell(kind);
      if (!cell) return;
      drawEnemySprite(ctx, kind, size / 2, size / 2, frame++ >> 1, false, undefined, Math.min(4, (size * 0.9) / cell));
      if (hidden) {
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = "#0e0c14";
        ctx.fillRect(0, 0, size, size);
        ctx.globalCompositeOperation = "source-over";
      }
    };
    draw();
    const id = window.setInterval(draw, 200);
    return () => window.clearInterval(id);
  }, [kind, size, hidden]);
  return <canvas ref={ref} width={size} height={size} className="codex-portrait" aria-hidden="true" />;
}
