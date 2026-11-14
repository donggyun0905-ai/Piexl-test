// 지도 창 (M · 순간 이동석 F): 지역 필드를 한 칸 = 한 점으로 그림 · 내 자리 · 순간 이동석(만진 돌만 눌러서 이동, 안 만진 돌은 흐리게) · 던전·모드 입구·국경 통로 표시
// '전체 지도 보기' → 모든 지역을 펼친 세계 지도(WorldAtlas) → 지역을 누르면 그 지역 지도 (다른 지역의 만진 돌로도 순간 이동)
import { useEffect, useRef, useState } from "react";
import type { TextKey } from "../i18n";
import { useAccEsc } from "../event/acc/accStore";
import { WorldAtlas } from "./WorldAtlas";
import { WTILE } from "./worldMap";
import { paintMini, useWorldMap } from "./worldMini";
import { REGIONS, type Place } from "./worldPlaces";
import { here, warpTouched } from "./worldWarps";

type T = (k: TextKey) => string;
const MARK: Partial<Record<Place["kind"], string>> = { dungeon: "⚔", pass: "🚶", warp: "✨" };
const GATE_MARK = { tower: "🗼", colosseum: "🏟", arena: "👑", swarm: "🏜", td: "🛡" } as const;

interface ViewProps {
  t: T;
  regionId: string;
  /** 건물 안이면 들어온 문 앞 (픽셀) · 아니면 걷는 화면의 지금 자리 */
  me: readonly [number, number] | null;
  onGo: (p: Place, regionId: string) => void;
}

export function WorldMapView({ t, regionId, me, onGo }: ViewProps) {
  const region = REGIONS[regionId]!;
  const ref = useRef<HTMLCanvasElement>(null);
  const map = useWorldMap(region.map);
  useEffect(() => {
    if (map && ref.current) paintMini(ref.current, map, region.mini);
  }, [map, region.mini]);
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
              <button key={p.id} type="button" className={`wm-mark${warp ? " warp" : ""}${ok ? " on" : ""}`} style={pct(p.tx, p.ty)} title={t(p.name)} disabled={!ok} onClick={() => ok && onGo(p, regionId)}>
                {p.gate ? GATE_MARK[p.gate] : MARK[p.kind]}
              </button>
            );
          })}
        {map && pos && <span className="wm-me" style={pct(pos[0] / WTILE - 0.5, pos[1] / WTILE - 0.5)} title={t("wmMe")} />}
      </div>
      <p className="wm-hint">{t("wmHint")}</p>
    </div>
  );
}

interface ModalProps extends ViewProps {
  /** 필드 이름 (나라 이름 · 지역 이름) */
  nameOf: (id: string) => string;
  /** 이동석에서 열었을 때 제목 */
  warp?: boolean;
  onClose: () => void;
}

/** 지도 창 (Esc·M·바깥 누르기로 닫힘) · 처음엔 지금 지역, 전체 지도에서 다른 지역을 고를 수 있음 */
export function WorldMapModal({ nameOf, warp, onClose, ...p }: ModalProps) {
  const [sel, setSel] = useState(p.regionId);
  const [atlas, setAtlas] = useState(false);
  useAccEsc(onClose);
  useEffect(() => {
    const key = (e: KeyboardEvent) => e.code === "KeyM" && !e.repeat && onClose();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal wm-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <header className="wm-head">
          <h3>{atlas ? `🌍 ${p.t("wmWorld")}` : `${warp ? "✨" : "🗺"} ${nameOf(sel)}`}</h3>
          <button type="button" className="secondary" onClick={() => setAtlas(!atlas)}>
            {atlas ? `🗺 ${nameOf(sel)}` : `🌍 ${p.t("wmWorldBtn")}`}
          </button>
        </header>
        {atlas ? (
          <WorldAtlas
            t={p.t}
            nameOf={nameOf}
            here={p.regionId}
            onPick={(id) => {
              setSel(id);
              setAtlas(false);
            }}
          />
        ) : (
          <WorldMapView key={sel} {...p} regionId={sel} me={sel === p.regionId ? p.me : null} />
        )}
        <button type="button" className="ghost" onClick={onClose}>
          {p.t("close")}
        </button>
      </div>
    </div>
  );
}
