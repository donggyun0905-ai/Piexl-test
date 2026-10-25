// 도트 편집 그리기 처리: 누름·끌기·뗌 → 붓·지우개(굵기)·모양(미리보기 뒤 확정)·채우기·색 집기·같은 색 바꾸기 · 좌우 대칭
import { useRef, useState } from "react";
import { fill, getPx, setPx, type Grid } from "./sheet";
import { brush, isShape, line, mirrored, shape, type Pt, type Tool } from "./tools";

export type Phase = "down" | "move" | "up";

interface Args {
  data: ImageData | null;
  g: Grid | null;
  sel: [number, number];
  tool: Tool;
  color: string;
  size: number;
  mirror: boolean;
  /** 바꾸기 (record: 되돌리기 기록을 남김) */
  change: (fn: (d: ImageData) => void, record?: boolean) => void;
  onPicked: (c: string) => void;
}

export function useDrawing({ data, g, sel, tool, color, size, mirror, change, onPicked }: Args) {
  const start = useRef<Pt | null>(null);
  const last = useRef<Pt | null>(null);
  const [preview, setPreview] = useState<Pt[]>([]);

  const onStroke = (x: number, y: number, phase: Phase) => {
    if (!data || !g) return;
    const ox = sel[1] * g.cw;
    const oy = sel[0] * g.ch;
    const inCell = ([px, py]: Pt) => px >= 0 && py >= 0 && px < g.cw && py < g.ch;
    const paint = (pts: Pt[], hex: string | null, record: boolean) =>
      change((d) => {
        for (const p of mirror ? mirrored(pts, g.cw) : pts) if (inCell(p)) setPx(d, ox + p[0], oy + p[1], hex);
      }, record);
    if (tool === "pen" || tool === "erase") {
      const hex = tool === "erase" ? null : color;
      if (phase === "down") {
        last.current = [x, y];
        paint(brush(x, y, size), hex, true);
      } else if (phase === "move" && last.current) {
        const pts = line(last.current[0], last.current[1], x, y).flatMap(([px, py]) => brush(px, py, size));
        last.current = [x, y];
        paint(pts, hex, false);
      } else last.current = null;
      return;
    }
    if (isShape(tool)) {
      if (phase === "down") start.current = [x, y];
      if (!start.current) return;
      const pts = shape(tool, start.current, [x, y]);
      if (phase === "up") {
        paint(pts, color, true);
        start.current = null;
        setPreview([]);
      } else setPreview(mirror ? mirrored(pts, g.cw) : pts);
      return;
    }
    if (phase !== "down") return;
    const gx = ox + x;
    const gy = oy + y;
    if (tool === "fill") change((d) => fill(d, g, sel[0], sel[1], gx, gy, color));
    else if (tool === "pick") {
      const p = getPx(data, gx, gy);
      if (p) onPicked(p);
    } else if (tool === "replace") {
      // 칸 안에서 누른 곳과 같은 색을 모두 지금 색으로
      const from = getPx(data, gx, gy);
      change((d) => {
        for (let yy = 0; yy < g.ch; yy++) for (let xx = 0; xx < g.cw; xx++) if (getPx(d, ox + xx, oy + yy) === from) setPx(d, ox + xx, oy + yy, color);
      });
    }
  };
  return { onStroke, preview };
}
