// 스킨 미리 보기: 32×32 그림(거인·오니는 48×48)을 앞으로 걷는 모습으로 (조금씩 움직임)
import { useEffect, useRef } from "react";
import { bigSheet, drawCharacter, skinImage } from "../game/sprites";

export function SkinPreview({ sheet, size = 96 }: { sheet: string; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const n = bigSheet(sheet) ? 48 : 32;
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    if (sheet.includes("_")) skinImage(sheet);
    let step = 0;
    const draw = () => {
      ctx.clearRect(0, 0, n, n);
      ctx.imageSmoothingEnabled = false;
      drawCharacter(ctx, sheet, n / 2, n / 2, n / 2 - 4, { faceX: 0, faceY: 1, moving: true, casting: false, step: step++ });
    };
    draw();
    const id = window.setInterval(draw, 180);
    return () => window.clearInterval(id);
  }, [sheet, n]);
  return <canvas ref={ref} width={n} height={n} className="skin-preview" style={{ width: size, height: size }} aria-hidden="true" />;
}
