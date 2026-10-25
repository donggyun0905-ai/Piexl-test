// 도트 편집 도구 줄: 도구 · 굵기 · 좌우 대칭 · 되돌리기 · 격자 · 확대
import type { TextKey } from "../i18n";
import type { Tool } from "./tools";

export const TOOLS: [Tool, TextKey, string, string][] = [
  ["pen", "pxPen", "B", "✏️"],
  ["erase", "pxErase", "E", "🧽"],
  ["line", "pxLine", "L", "╱"],
  ["rect", "pxRect", "R", "▭"],
  ["rectFill", "pxRectFill", "U", "■"],
  ["ellipse", "pxEllipse", "O", "◯"],
  ["fill", "pxFill", "G", "🪣"],
  ["pick", "pxPick", "I", "💧"],
  ["replace", "pxReplace", "H", "⇄"],
];

interface Props {
  t: (k: TextKey) => string;
  tool: Tool;
  setTool: (t: Tool) => void;
  size: number;
  setSize: (n: number) => void;
  mirror: boolean;
  setMirror: (b: boolean) => void;
  grid: boolean;
  setGrid: (b: boolean) => void;
  zoom: number;
  setZoom: (z: number) => void;
  undo: () => void;
  redo: () => void;
}

export function ToolBar({ t, tool, setTool, size, setSize, mirror, setMirror, grid, setGrid, zoom, setZoom, undo, redo }: Props) {
  return (
    <div className="px-tools">
      {TOOLS.map(([id, label, key, icon]) => (
        <button key={id} type="button" className={tool === id ? "active" : undefined} title={`${t(label)} (${key})`} onClick={() => setTool(id)}>
          {icon} {t(label)} <small>{key}</small>
        </button>
      ))}
      <label className="px-size">
        {t("pxBrush")}
        <input type="range" min={1} max={6} value={size} onChange={(e) => setSize(Number(e.target.value))} />
        <b>{size}</b>
      </label>
      <button type="button" className={mirror ? "active" : undefined} onClick={() => setMirror(!mirror)}>
        ⇋ {t("pxMirror")} <small>M</small>
      </button>
      <button type="button" onClick={undo}>
        ↶ {t("pxUndo")}
      </button>
      <button type="button" onClick={redo}>
        ↷ {t("pxRedo")}
      </button>
      <label>
        <input type="checkbox" checked={grid} onChange={(e) => setGrid(e.target.checked)} /> {t("pxGrid")}
      </label>
      <span className="px-zoom">
        {t("pxZoom")}
        <button type="button" onClick={() => setZoom(zoom / 1.25)}>
          −
        </button>
        <b>{Math.round(zoom * 100)}%</b>
        <button type="button" onClick={() => setZoom(zoom * 1.25)}>
          +
        </button>
      </span>
    </div>
  );
}
