// 전체 세계 지도 (M 지도 창 · 이동석 창의 '전체 지도 보기'): 세계 지도 그림(public/world/worldMap.webp) 위 지역 자리(worldAtlasArt)
// 마우스를 올리면 그 지역 땅 크기만큼 흰 테두리 · 누르면 그 지역 지도로 (거기서 만진 이동석으로 순간 이동) · 스토리에서 안 열린 곳은 어둡게, 누를 수 없음
import type { TextKey } from "../i18n";
import { ATLAS_ART_H, ATLAS_ART_W, ATLAS_BOX } from "./worldAtlasArt";
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
  const open = fieldOpen(REGIONS[id]!);
  const [x, y, w, h] = ATLAS_BOX[id]!;
  const style = { left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` };
  return (
    <button type="button" className={`wa-land${open ? "" : " locked"}${here ? " here" : ""}`} style={style} disabled={!open} title={open ? name : t("wmLocked")} onClick={onPick}>
      <span className="wa-name">{open ? name : "?"}</span>
      {here && <span className="wa-here">📍</span>}
    </button>
  );
}

export function WorldAtlas({ t, nameOf, here, onPick }: Props) {
  return (
    <div className="wa-view" onClick={(e) => e.stopPropagation()}>
      <div className="wa-map" style={{ aspectRatio: `${ATLAS_ART_W} / ${ATLAS_ART_H}` }}>
        <img className="wa-art" src={`${import.meta.env.BASE_URL}world/worldMap.webp`} alt="" draggable={false} />
        {Object.keys(ATLAS_BOX).map((id) => (
          <Land key={id} id={id} name={nameOf(id)} here={id === here} t={t} onPick={() => onPick(id)} />
        ))}
      </div>
      <p className="wm-hint">{t("wmAtlasHint")}</p>
    </div>
  );
}
