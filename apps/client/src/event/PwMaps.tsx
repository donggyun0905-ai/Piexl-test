// 패왕전 경기장 고르기: 그 대결의 경기장 5개(미리 보기·이름) + 무작위 · 같이 하기 대기실에서도 씀(방장만 누름)
import { PW_MODE, type PwArenaId, type PwMode } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import { ArenaPreview } from "./PwModes";

/** 고른 경기장 (null = 무작위) */
export type PwMapPick = PwArenaId | null;

export const mapName = (id: PwArenaId, t: (k: TextKey) => string) => t(`pwMap_${id}` as TextKey);

export function PwMapList({ mode, pick, t, onPick, disabled = false }: { mode: PwMode; pick?: PwMapPick; t: (k: TextKey) => string; onPick: (m: PwMapPick) => void; disabled?: boolean }) {
  return (
    <div className="pw-map-list">
      {PW_MODE[mode].maps.map((id) => (
        <button key={id} type="button" disabled={disabled} className={`pw-map-card ${pick === id ? "on" : ""}`} onClick={() => onPick(id)}>
          <ArenaPreview id={id} />
          <span>{mapName(id, t)}</span>
        </button>
      ))}
      <button type="button" disabled={disabled} className={`pw-map-card random ${pick === null ? "on" : ""}`} onClick={() => onPick(null)}>
        <span className="pw-map-dice">🎲</span>
        <span>{t("pwMapRandom")}</span>
        <small>{t("pwMapRandomDesc")}</small>
      </button>
    </div>
  );
}

/** 혼자 하기: 대결을 고른 뒤 경기장 고르기 화면 */
export function PwMaps({ mode, t, onPick, onBack }: { mode: PwMode; t: (k: TextKey) => string; onPick: (m: PwMapPick) => void; onBack: () => void }) {
  return (
    <div className="td-maps pw-maps">
      <h2>{t("pwMapPick")}</h2>
      <PwMapList mode={mode} t={t} onPick={onPick} />
      <button type="button" className="ghost" onClick={onBack}>
        {t("back")}
      </button>
    </div>
  );
}
