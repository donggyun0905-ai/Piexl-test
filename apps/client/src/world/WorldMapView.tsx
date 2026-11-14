// 나라 지도 창 (M · B 장비창 왼쪽): 지금 나라 필드를 한 칸 = 한 점으로 그림 · 내 자리 · 순간 이동석(만진 돌만 눌러서 이동, 안 만진 돌은 흐리게) · 던전·모드 입구·국경 통로 표시
// 지도 그림은 걷는 화면과 같은 파일 (한 번 받은 것은 다시 받지 않음) · 세계 지도(나라끼리)는 W4
import { useEffect, useRef, useState } from "react";
import type { TextKey } from "../i18n";
import { useAccEsc } from "../event/acc/accStore";
import { loadWorldMap, WTILE, type WorldMap } from "./worldMap";
import type { Place, Region } from "./worldPlaces";
import { here, warpTouched } from "./worldWarps";

type T = (k: TextKey) => string;
/** 땅 종류(WT 번호) → 지도 색 */
const MINI = [
  "#0c0a12", "#5aa04a", "#c8a870", "#3c78c8", "#22448c", "#e0cc92", "#245c2e", "#787088", "#b0a090", "#685848", "#986838", "#e8eef8", "#7cb05a", "#d0b448",
  "#a04a2a", "#b4605a", "#606ca8", "#a87c50", "#38303e", "#a02838", "#8c96a0", "#5a463c", "#a8602e", "#3c8c8c", "#c8b896", "#3a6e44", "#6a4426", "#2a7a4a",
  "#e8e2d4", "#963228", "#c8b478", "#e6b428", "#c86e5a",
  "#e2c478", "#aa8264", "#c88c5a", "#beaa82", "#3cc8be", "#a06e3c",
  "#e2ecf8", "#96d2ec", "#786e68", "#b0b8c4", "#464c5c", "#285046",
];
const cache = new Map<string, Promise<WorldMap>>();

/** 지도 그림 → 작은 캔버스 (한 칸 = 한 픽셀, CSS로 키움) */
function paint(c: HTMLCanvasElement, m: WorldMap): void {
  c.width = m.cols;
  c.height = m.rows;
  const g = c.getContext("2d")!;
  const img = g.createImageData(m.cols, m.rows);
  for (let i = 0; i < m.tiles.length; i++) {
    const h = MINI[m.tiles[i]!] ?? MINI[0]!;
    for (let k = 0; k < 3; k++) img.data[i * 4 + k] = parseInt(h.slice(1 + k * 2, 3 + k * 2), 16);
    img.data[i * 4 + 3] = 255;
  }
  g.putImageData(img, 0, 0);
}

const MARK: Partial<Record<Place["kind"], string>> = { dungeon: "⚔", pass: "🚶", warp: "✨" };

interface Props {
  t: T;
  regionId: string;
  region: Region;
  /** 건물 안이면 들어온 문 앞 (픽셀) · 아니면 걷는 화면의 지금 자리 */
  me: readonly [number, number] | null;
  onGo: (p: Place) => void;
}

export function WorldMapView({ t, regionId, region, me, onGo }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [map, setMap] = useState<WorldMap | null>(null);
  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}${region.map}`;
    if (!cache.has(url)) cache.set(url, loadWorldMap(url));
    let alive = true;
    cache.get(url)!.then((m) => alive && setMap(m), () => undefined);
    return () => {
      alive = false;
    };
  }, [region.map]);
  useEffect(() => {
    if (map && ref.current) paint(ref.current, map);
  }, [map]);
  const pos = me ?? (here.r === regionId ? ([here.x, here.y] as const) : null);
  const pct = (tx: number, ty: number) => (map ? { left: `${((tx + 0.5) / map.cols) * 100}%`, top: `${((ty + 0.5) / map.rows) * 100}%` } : {});
  const marks = region.places.filter((p) => MARK[p.kind] || p.gate);
  return (
    <div className="wm-view" onClick={(e) => e.stopPropagation()}>
      <div className="wm-map" style={map ? { aspectRatio: `${map.cols} / ${map.rows}` } : undefined}>
        <canvas ref={ref} />
        {map &&
          marks.map((p) => {
            const warp = p.kind === "warp";
            const ok = warp && warpTouched(regionId, p);
            return (
              <button key={p.id} type="button" className={`wm-mark${warp ? " warp" : ""}${ok ? " on" : ""}`} style={pct(p.tx, p.ty)} title={t(p.name)} disabled={!ok} onClick={() => ok && onGo(p)}>
                {p.gate === "tower" ? "🗼" : p.gate === "colosseum" ? "🏟" : p.gate === "arena" ? "👑" : p.gate === "swarm" ? "🏜" : p.gate === "td" ? "🛡" : MARK[p.kind]}
              </button>
            );
          })}
        {map && pos && <span className="wm-me" style={pct(pos[0] / WTILE - 0.5, pos[1] / WTILE - 0.5)} title={t("wmMe")} />}
      </div>
      <p className="wm-hint">{t("wmHint")}</p>
    </div>
  );
}

/** M 지도 창 (Esc·M·바깥 누르기로 닫힘) */
export function WorldMapModal({ title, onClose, ...p }: Props & { title: string; onClose: () => void }) {
  useAccEsc(onClose);
  useEffect(() => {
    const key = (e: KeyboardEvent) => e.code === "KeyM" && !e.repeat && onClose();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal wm-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h3>
          🗺 {p.t("wmTitle")} · {title}
        </h3>
        <WorldMapView {...p} />
        <button type="button" className="ghost" onClick={onClose}>
          {p.t("close")}
        </button>
      </div>
    </div>
  );
}
