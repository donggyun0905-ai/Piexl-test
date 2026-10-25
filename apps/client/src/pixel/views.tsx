// 도트 편집 화면 조각: 칸 크게 보기(그리기) · 그림 전체(칸 고르기) · 움직임 미리보기
import { useEffect, useRef, useState } from "react";
import { drawCell, toCanvas, type Grid } from "./sheet";

interface CellProps {
  data: ImageData;
  g: Grid;
  r: number;
  c: number;
  zoom: number;
  grid?: boolean;
  guide?: readonly [number, number];
  /** 그리기 (칸 안 x, y · 누름/끌기/뗌). 칸 밖으로 끌면 가장자리로 맞춤 */
  onStroke?: (x: number, y: number, phase: "down" | "move" | "up") => void;
  /** 모양 도구 미리보기 점과 색 · 좌우 대칭 가운데 선 */
  preview?: readonly (readonly [number, number])[];
  previewColor?: string;
  mirror?: boolean;
  version: number;
}

export function CellView({ data, g, r, c, zoom, grid = false, guide, onStroke, preview, previewColor, mirror, version }: CellProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const down = useRef(false);
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    drawCell(ctx, data, g, r, c, zoom, grid, guide);
    if (preview?.length) {
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = previewColor ?? "#fff";
      for (const [x, y] of preview) ctx.fillRect(x * zoom, y * zoom, zoom, zoom);
      ctx.globalAlpha = 1;
    }
    if (mirror) {
      ctx.strokeStyle = "rgba(120, 200, 255, 0.7)";
      ctx.beginPath();
      ctx.moveTo((g.cw / 2) * zoom + 0.5, 0);
      ctx.lineTo((g.cw / 2) * zoom + 0.5, g.ch * zoom);
      ctx.stroke();
    }
  }, [data, g, r, c, zoom, grid, guide, version, preview, previewColor, mirror]);
  const at = (e: React.PointerEvent, phase: "down" | "move" | "up") => {
    if (!onStroke) return;
    const box = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(g.cw - 1, Math.floor(((e.clientX - box.left) / box.width) * g.cw)));
    const y = Math.max(0, Math.min(g.ch - 1, Math.floor(((e.clientY - box.top) / box.height) * g.ch)));
    onStroke(x, y, phase);
  };
  return (
    <canvas
      ref={ref}
      className={onStroke ? "px-edit" : "px-cell"}
      width={g.cw * zoom}
      height={g.ch * zoom}
      onPointerDown={(e) => {
        down.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        at(e, "down");
      }}
      onPointerMove={(e) => down.current && at(e, "move")}
      onPointerUp={(e) => {
        if (down.current) at(e, "up");
        down.current = false;
      }}
      onPointerCancel={() => (down.current = false)}
    />
  );
}

/** 그림 전체 (눌러서 칸 고르기). 가로 width 픽셀 안에 맞춤 */
export function SheetView({ data, g, width, sel, onPick, version }: { data: ImageData; g: Grid; width: number; sel: [number, number]; onPick: (r: number, c: number) => void; version: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const zoom = Math.max(1, Math.floor(width / Math.max(data.width, data.height)));
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#2a2638";
    ctx.fillRect(0, 0, data.width * zoom, data.height * zoom);
    ctx.drawImage(toCanvas(data), 0, 0, data.width * zoom, data.height * zoom);
    ctx.strokeStyle = "#ffd050";
    ctx.lineWidth = 2;
    ctx.strokeRect(sel[1] * g.cw * zoom + 1, sel[0] * g.ch * zoom + 1, g.cw * zoom - 2, g.ch * zoom - 2);
  }, [data, g, zoom, sel, version]);
  return (
    <canvas
      ref={ref}
      className="px-sheet"
      width={data.width * zoom}
      height={data.height * zoom}
      onClick={(e) => {
        const box = e.currentTarget.getBoundingClientRect();
        const r = Math.min(g.rows - 1, Math.floor(((e.clientY - box.top) / box.height) * (data.height / g.ch)));
        const c = Math.min(g.cols - 1, Math.floor(((e.clientX - box.left) / box.width) * (data.width / g.cw)));
        onPick(r, c);
      }}
    />
  );
}

/** 한 줄 칸들을 차례로 보여 줌 (움직임·효과 장면 확인) */
export function Preview({ data, g, row, version }: { data: ImageData; g: Grid; row: number; version: number }) {
  const [f, setF] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setF((n) => n + 1), 160);
    return () => window.clearInterval(id);
  }, []);
  const c = f % g.cols;
  return <CellView data={data} g={g} r={row} c={c} zoom={Math.max(2, Math.floor(96 / Math.max(g.cw, g.ch)))} version={version} />;
}
