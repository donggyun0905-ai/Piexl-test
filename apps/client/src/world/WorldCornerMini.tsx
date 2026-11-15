// 왼쪽 아래 구석 미니맵 (나라 필드에서만, Esc 설정에서 끔): 지역 전체를 작게 · 내 자리(흰 점) · 퀘스트 목적지(금빛) · 사냥터(빨강) · 최종보스 입구(보라) · 만진 순간 이동석(하늘) · 누르면 M 지도
import { useEffect, useRef, useState } from "react";
import type { TextKey } from "../i18n";
import { groundsIn } from "./hunt/huntGrounds";
import { WTILE } from "./worldMap";
import { paintMini, useWorldMap } from "./worldMini";
import { REGIONS } from "./worldPlaces";
import { here, warpTouched } from "./worldWarps";

export function WorldCornerMini({ t, regionId, mark, onOpen }: { t: (k: TextKey) => string; regionId: string; mark: string | null; onOpen: () => void }) {
  const region = REGIONS[regionId]!;
  const ref = useRef<HTMLCanvasElement>(null);
  const map = useWorldMap(region.map);
  // 내 자리는 0.25초마다 다시 읽음 (WorldStage가 here에 적음)
  const [, tick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => tick((v) => v + 1), 250);
    return () => window.clearInterval(id);
  }, []);
  useEffect(() => {
    if (map && ref.current) paintMini(ref.current, map, region.mini);
  }, [map, region.mini]);
  if (!map) return null;
  const at = (tx: number, ty: number) => ({ left: `${((tx + 0.5) / map.cols) * 100}%`, top: `${((ty + 0.5) / map.rows) * 100}%` });
  const goal = mark ? region.places.find((p) => p.id === mark) : undefined;
  return (
    <button type="button" className="world-mini" style={{ aspectRatio: `${map.cols} / ${map.rows}` }} title={t("wmTitle")} onClick={onOpen}>
      <canvas ref={ref} />
      {groundsIn(regionId).map((g) => (
        <i key={g.id} className={g.boss ? "boss" : "hunt"} style={at(g.tx, g.ty)} />
      ))}
      {region.places.map((p) =>
        p.gate === "boss" ? <i key={p.id} className="gate" style={at(p.tx, p.ty)} /> : p.kind === "warp" && warpTouched(regionId, p) ? <i key={p.id} className="warp" style={at(p.tx, p.ty)} /> : null,
      )}
      {goal && <i className="goal" style={at(goal.tx, goal.ty)} />}
      {here.r === regionId && <i className="me" style={at(here.x / WTILE - 0.5, here.y / WTILE - 0.5)} />}
    </button>
  );
}
