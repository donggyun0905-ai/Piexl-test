// 광야의 새벽 맵 고르기: 맵 5개(+ 관리자가 만든 맵) 미리 보기 · 난이도 3단계(보통·어려움·지옥) · 깬 표시 · 받는 이벤트 코인
import { CUSTOM_SWARM, SWARM, SWARM_LEVELS, SWARM_MAP_IDS, swarmCoins, swarmMapDef, type SwarmMapId } from "@pixel-rogue/shared";
import { useEffect, useRef, useState } from "react";
import type { TextKey } from "../i18n";
import { eventCoins, isCleared } from "./eventCoins";
import { EcoinIcon } from "./EcoinIcon";

interface Props {
  t: (key: TextKey) => string;
  onPick: (map: SwarmMapId, level: number) => void;
  onBack: () => void;
}

/** 미리 보기 한 칸 크기 (px) */
const CELL = 3;
/** 맵마다 바닥 색 */
const GROUND: Partial<Record<SwarmMapId, string>> = { plains: "#4a6a34", ruins: "#5a5650", fort: "#5e5a3e", swamp: "#34503e", volcano: "#4a2e28" };
const STARS: Partial<Record<SwarmMapId, number>> = { plains: 1, ruins: 2, fort: 3, swamp: 4, volcano: 5 };

function MapPreview({ id }: { id: SwarmMapId }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const m = swarmMapDef(id);
    ctx.fillStyle = GROUND[id] ?? GROUND.plains!;
    ctx.fillRect(0, 0, SWARM.cols * CELL, SWARM.rows * CELL);
    const rects = (list: readonly (readonly number[])[], color: string) => {
      ctx.fillStyle = color;
      for (const [c = 0, r = 0, w = 1, h = 1] of list) ctx.fillRect(c * CELL, r * CELL, w * CELL, h * CELL);
    };
    rects(m.mud, "#6a5232");
    rects(m.lava, "#e0602a");
    rects(m.ponds, "#2a5a8a");
    rects(m.walls, "#2a2630");
    rects(m.rocks, "#8a8478");
    rects(
      m.towers.map(([c, r]) => [c - 0.5, r - 0.5, 2, 2]),
      "#ff8a3a",
    );
    ctx.fillStyle = "#fff";
    ctx.fillRect((SWARM.cols / 2 - 0.5) * CELL, (SWARM.rows / 2 - 0.5) * CELL, CELL, CELL);
  }, [id]);
  return <canvas ref={ref} width={SWARM.cols * CELL} height={SWARM.rows * CELL} className="swarm-preview" aria-hidden="true" />;
}

export function SwarmMaps({ t, onPick, onBack }: Props) {
  const [map, setMap] = useState<SwarmMapId>("plains");
  return (
    <div className="td-maps swarm-maps">
      <h2>{t("swarm")}</h2>
      <p className="hint">
        {t("swarmMapHint")} · <EcoinIcon /> {eventCoins()}
      </p>
      <div className="td-map-list">
        {[...SWARM_MAP_IDS, ...[...CUSTOM_SWARM.keys()].map((k) => k as SwarmMapId)].map((id) => (
          <button key={id} type="button" className={`td-map-card${map === id ? " picked" : ""}`} onClick={() => setMap(id)}>
            <MapPreview id={id} />
            <span className="td-map-text">
              <strong>
                {CUSTOM_SWARM.get(id)?.name ?? t(`swarmMap_${id}` as TextKey)} <span className="td-stars">{"★".repeat(STARS[id] ?? 1)}</span>
              </strong>
              <small>{t(CUSTOM_SWARM.has(id) ? "customMapInfo" : (`swarmMapInfo_${id}` as TextKey))}</small>
              <small className="swarm-cleared">{SWARM_LEVELS.map((_, lv) => (isCleared(id, lv) ? "✔" : "·")).join(" ")}</small>
            </span>
          </button>
        ))}
      </div>
      <h3>{t("swarmLevelPick")}</h3>
      <div className="swarm-levels">
        {SWARM_LEVELS.map((_, lv) => {
          const first = !isCleared(map, lv);
          return (
            <button key={lv} type="button" className={`swarm-level lv${lv}`} onClick={() => onPick(map, lv)}>
              <strong>{t(`swarmLevel${lv}` as TextKey)}</strong>
              <small>
                <EcoinIcon /> {swarmCoins(map, lv, first)} {first ? t("swarmFirstClear") : ""}
              </small>
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
