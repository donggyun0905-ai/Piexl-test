// 맵 그리기 판: 칸을 누르고 끌면 고른 칸으로 칠함 (오른쪽 버튼·지우개 = 바닥) · 붓 크기 1~3칸
import type { CustomMap } from "@pixel-rogue/shared";
import { useEffect, useRef } from "react";

/** 칸 글자 → 색 */
export const TILE_COLOR: Record<string, string> = {
  ".": "#3a3448",
  "#": "#6a6070",
  o: "#9a8a78",
  "~": "#1a3a8a",
  w: "#4a9ae0",
  m: "#6a4a2a",
  l: "#e8501a",
  x: "#c8c8d8",
  T: "#ff8a3a",
  p: "#c8a868",
  g: "#ffd040",
};

interface Props {
  map: CustomMap;
  /** 칠할 칸 글자 · 붓 크기 */
  tile: string;
  brush: number;
  onChange: (tiles: string[]) => void;
}

export function MapCanvas({ map, tile, brush, onChange }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const cols = map.tiles[0]!.length;
  const rows = map.tiles.length;
  const cell = Math.max(8, Math.min(40, Math.floor(860 / cols)));
  // 끄는 동안 바뀐 칸을 모아 두었다가 한 번에
  const draft = useRef<string[][] | null>(null);
  /** 지난번 칠한 칸 (빠르게 끌어도 사이 칸을 빠뜨리지 않게 이어서 칠함) */
  const last = useRef<[number, number] | null>(null);

  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const grid = draft.current ?? map.tiles.map((r) => [...r]);
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const ch = grid[r]![c]!;
        ctx.fillStyle = TILE_COLOR[ch] ?? "#000";
        ctx.fillRect(c * cell, r * cell, cell, cell);
        if (ch === "x") {
          ctx.fillStyle = "#6a6a7a";
          ctx.fillRect(c * cell + cell / 3, r * cell + cell / 3, cell / 3, cell / 3);
        }
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.strokeRect(c * cell + 0.5, r * cell + 0.5, cell - 1, cell - 1);
      }
  });

  const paint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = Math.floor((e.clientX - rect.left) / cell);
    const cy = Math.floor((e.clientY - rect.top) / cell);
    const [lx, ly] = last.current ?? [cx, cy];
    last.current = [cx, cy];
    const steps = Math.max(Math.abs(cx - lx), Math.abs(cy - ly), 1);
    for (let i = 1; i <= steps; i++) dab(e, Math.round(lx + ((cx - lx) * i) / steps), Math.round(ly + ((cy - ly) * i) / steps));
  };
  const dab = (e: React.PointerEvent<HTMLCanvasElement>, c0: number, r0: number) => {
    const ch = e.buttons === 2 || e.button === 2 ? "." : tile;
    const grid = (draft.current ??= map.tiles.map((r) => [...r]));
    const half = Math.floor((brush - 1) / 2);
    for (let r = r0 - half; r < r0 - half + brush; r++) for (let c = c0 - half; c < c0 - half + brush; c++) if (r >= 0 && c >= 0 && r < rows && c < cols) grid[r]![c] = ch;
    // 그리기만 다시 (저장은 손을 뗄 때)
    const ctx = e.currentTarget.getContext("2d");
    if (ctx) for (let r = r0 - half; r < r0 - half + brush; r++) for (let c = c0 - half; c < c0 - half + brush; c++) {
      if (r < 0 || c < 0 || r >= rows || c >= cols) continue;
      ctx.fillStyle = TILE_COLOR[ch] ?? "#000";
      ctx.fillRect(c * cell, r * cell, cell, cell);
    }
  };
  const finish = () => {
    if (draft.current) onChange(draft.current.map((r) => r.join("")));
    draft.current = null;
    last.current = null;
  };

  return (
    <canvas
      ref={ref}
      className="admin-map-canvas"
      width={cols * cell}
      height={rows * cell}
      onContextMenu={(e) => e.preventDefault()}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        paint(e);
      }}
      onPointerMove={(e) => e.buttons && paint(e)}
      onPointerUp={finish}
      onPointerCancel={finish}
    />
  );
}
