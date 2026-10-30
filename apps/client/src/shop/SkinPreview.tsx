// 스킨 미리 보기: 32×32 그림(거인·오니는 48×48)을 앞으로 걷는 모습으로 (조금씩 움직임)
import { useEffect, useRef } from "react";
import { bigSheet, drawCharacter, skinImage } from "../game/sprites";

export function SkinPreview({ sheet, size = 96 }: { sheet: string; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const n = bigSheet(sheet) ? 48 : 32;
  // 화면 해상도로 그림 (32칸 캔버스를 늘리면 촘촘한 새 그림이 흐려짐)
  const k = Math.max(1, Math.round((size * (window.devicePixelRatio || 1)) / n));
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    if (sheet.includes("_")) skinImage(sheet);
    let step = 0;
    const draw = () => {
      ctx.setTransform(k, 0, 0, k, 0, 0);
      ctx.clearRect(0, 0, n, n);
      ctx.imageSmoothingEnabled = false;
      drawCharacter(ctx, sheet, n / 2, n / 2, n / 2 - 4, { faceX: 0, faceY: 1, moving: true, casting: false, step: step++ });
    };
    draw();
    const id = window.setInterval(draw, 180);
    return () => window.clearInterval(id);
  }, [sheet, n, k]);
  return <canvas ref={ref} width={n * k} height={n * k} className="skin-preview" style={{ width: size, height: size }} aria-hidden="true" />;
}
