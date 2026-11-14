// 전체 세계 지도 (M 지도 창 · 이동석 창의 '전체 지도 보기'): 나라·지역 필드를 자리(worldAtlas)대로 작은 지도로 펼침
// 마우스를 올리면 그 지역 땅 크기만큼 흰 테두리 · 누르면 그 지역 지도로 (거기서 만진 이동석으로 순간 이동) · 스토리에서 안 열린 곳은 어둡게, 누를 수 없음
import { useEffect, useRef } from "react";
import type { TextKey } from "../i18n";
import { ATLAS, ATLAS_FILL, ATLAS_H, ATLAS_W } from "./worldAtlas";
import { paintMini, useWorldMap } from "./worldMini";
import { fieldOpen, REGIONS } from "./worldPlaces";

interface Props {
  t: (k: TextKey) => string;
  /** 필드 이름 (나라 이름 · 지역 이름) */
  nameOf: (id: string) => string;
  /** 지금 있는 필드 */
  here: string;
  onPick: (id: string) => void;
}

function Land({ id, name, here, onPick, t }: { id: string; name: string; here: boolean; onPick: () => void; t: Props["t"] }) {
  const r = REGIONS[id]!;
  const ref = useRef<HTMLCanvasElement>(null);
  const map = useWorldMap(r.map);
  useEffect(() => {
    if (map && ref.current) paintMini(ref.current, map, r.mini);
  }, [map, r.mini]);
  const open = fieldOpen(r);
  const [x, y] = ATLAS[id]!;
  const style = { left: `${(x / ATLAS_W) * 100}%`, top: `${(y / ATLAS_H) * 100}%`, width: `${(ATLAS_FILL / ATLAS_W) * 100}%`, height: `${(ATLAS_FILL / ATLAS_H) * 100}%` };
  return (
    <button type="button" className={`wa-land${open ? "" : " locked"}${here ? " here" : ""}`} style={style} disabled={!open} title={open ? name : t("wmLocked")} onClick={onPick}>
      <canvas ref={ref} />
      <span className="wa-name">{open ? name : "?"}</span>
      {here && <span className="wa-here">📍</span>}
    </button>
  );
}

export function WorldAtlas({ t, nameOf, here, onPick }: Props) {
  return (
    <div className="wa-view" onClick={(e) => e.stopPropagation()}>
      <div className="wa-map" style={{ aspectRatio: `${ATLAS_W * 256} / ${ATLAS_H * 160}` }}>
        {Object.keys(ATLAS).map((id) => (
          <Land key={id} id={id} name={nameOf(id)} here={id === here} t={t} onPick={() => onPick(id)} />
        ))}
      </div>
      <p className="wm-hint">{t("wmAtlasHint")}</p>
    </div>
  );
}
