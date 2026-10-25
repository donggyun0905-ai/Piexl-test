// 타워 디펜스 맵 고르기: 맵 7개 미리 보기 · 난이도 · 내 최고 기록
import { TD_MAPS, type CharacterId, type TdMapId } from "@pixel-rogue/shared";
import { useEffect, useRef } from "react";
import type { TextKey } from "../i18n";
import { drawBody } from "../game/render/actors";
import { mapCanvas, MAP_H, MAP_W } from "./tdArt";
import { loadTdBest } from "./tdRecords";

interface Props {
  t: (key: TextKey) => string;
  onPick: (mapId: TdMapId) => void;
  onBack: () => void;
}

/** 맵마다 난이도 별 수 (맵 순서) */
const STARS = [1, 2, 2, 3, 3, 4, 5];

function MapPreview({ mapId }: { mapId: TdMapId }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(mapCanvas(mapId), 0, 0);
  }, [mapId]);
  return <canvas ref={ref} width={MAP_W} height={MAP_H} className="td-preview" aria-hidden="true" />;
}

/** 캐릭터 얼굴 칸 (작은 캔버스에 2배로) */
export function TdPortrait({ id, size = 32 }: { id: CharacterId; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 32, 32);
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    ctx.imageSmoothingEnabled = false;
    drawBody(ctx, id, 8, id === "titan" || id === "oni" ? 36 : 9, 5, { faceX: 0, faceY: 1, moving: false, casting: false, step: 0 }, 0);
  }, [id]);
  return <canvas ref={ref} width={32} height={32} className="td-portrait" style={{ width: size, height: size }} aria-hidden="true" />;
}

export function TdScreen({ t, onPick, onBack }: Props) {
  const best = loadTdBest();
  return (
    <div className="td-maps">
      <h2>{t("tdRun")}</h2>
      <p className="hint">{t("tdHowTo")}</p>
      <h3>{t("tdChooseMap")}</h3>
      <div className="td-map-list">
        {TD_MAPS.map((m, i) => {
          const b = best[m.id];
          return (
            <button key={m.id} type="button" className={`td-map-card ${m.id}`} onClick={() => onPick(m.id)}>
              <MapPreview mapId={m.id} />
              <span className="td-map-text">
                <strong>
                  {t(`tdMap_${m.id}` as TextKey)} <span className="td-stars">{"★".repeat(STARS[i] ?? 1)}</span>
                </strong>
                <small>{t(`tdMapInfo_${m.id}` as TextKey)}</small>
                <small className={b?.won ? "td-best won" : "td-best"}>
                  {b ? (b.won ? t("tdClearedBest").replace("{n}", String(b.lives)) : t("tdBest").replace("{n}", String(b.round))) : t("tdNoRecord")}
                </small>
              </span>
            </button>
          );
        })}
      </div>
      <button type="button" className="secondary" onClick={onBack}>
        {t("back")}
      </button>
    </div>
  );
}
