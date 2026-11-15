// 지도에서 Esc: 설정 창 (본편과 같은 SettingsPanel + 지도 설정: 이름표·미니맵·확대) · 계속하기 · 메인으로 (Esc·바깥 누르면 닫힘)
import { useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { Modal } from "../menu/Modal";
import { SettingsPanel } from "../SettingsPanel";
import { setWorldPrefs, worldPrefs, ZOOM_MAX, ZOOM_MIN, type WorldPrefs } from "./worldPrefs";

export function WorldMenu({ t, lang, onClose, onExit }: { t: (k: TextKey) => string; lang: Lang; onClose: () => void; onExit: () => void }) {
  const [p, setP] = useState(worldPrefs);
  const set = (v: Partial<WorldPrefs>) => (setWorldPrefs(v), setP(worldPrefs()));
  const check = (k: "names" | "mini", label: TextKey) => (
    <label className="setting-row">
      <span>{t(label)}</span>
      <input type="checkbox" checked={p[k]} onChange={(e) => set({ [k]: e.target.checked })} />
    </label>
  );
  return (
    <Modal title={t("settings")} t={t} onClose={onClose}>
      {check("names", "wkNames")}
      {check("mini", "wkMini")}
      <label className="setting-row">
        <span>{t("wkZoom")}</span>
        <input type="range" min={ZOOM_MIN * 100} max={ZOOM_MAX * 100} step={10} value={Math.round(p.zoom * 100)} onChange={(e) => set({ zoom: Number(e.target.value) / 100 })} />
        <small>{Math.round(p.zoom * 100)}%</small>
      </label>
      <SettingsPanel lang={lang} t={t} />
      <div className="modal-actions">
        <button type="button" className="primary" onClick={onClose}>
          {t("resume")}
        </button>
        <button type="button" className="secondary" onClick={onExit}>
          {t("lobbyExit")}
        </button>
      </div>
    </Modal>
  );
}
