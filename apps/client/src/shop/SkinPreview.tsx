// 스킨 미리 보기: 32×32 그림(거인·오니는 48×48)을 앞으로 걷는 모습으로 (조금씩 움직임) · still이면 앞을 보고 선 모습으로 고정 (캐릭터 선택창)
import { useEffect, useRef } from "react";
import { bigSheet, drawCharacter, skinImage } from "../game/sprites";
import { CHARACTER_SHEETS } from "../game/spriteSheets";

export function SkinPreview({ sheet, size = 96, still = false }: { sheet: string; size?: number; still?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  // 칸 크기: 게임에서 크게 그리는 캐릭터(닻·광륜 등이 그림에 든 펜리르·이클립스·토르켄)는 그 크기만큼 칸을 넓혀 잘리거나 더 늘어나 뭉개지지 않게
  const n = Math.max(bigSheet(sheet) ? 48 : 32, CHARACTER_SHEETS[sheet]?.size ?? 0);
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
      const ok = drawCharacter(ctx, sheet, n / 2, n / 2, n / 2 - 4, { faceX: 0, faceY: 1, moving: !still, casting: false, step: still ? 0 : step++ });
      // 고정 모습은 그림을 불러와 한 번 그리면 멈춤
      if (ok && still) window.clearInterval(id);
    };
    const id = window.setInterval(draw, 180);
    draw();
    return () => window.clearInterval(id);
  }, [sheet, n, k, still]);
  return <canvas ref={ref} width={n * k} height={n * k} className="skin-preview" style={{ width: size, height: size }} aria-hidden="true" />;
}
