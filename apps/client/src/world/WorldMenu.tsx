// 지도에서 Esc: 설정 창 (소리·진동·화면 등 본편과 같은 SettingsPanel) · 계속하기 · 메인으로 (Esc·바깥 누르면 닫힘)
import type { Lang, TextKey } from "../i18n";
import { Modal } from "../menu/Modal";
import { SettingsPanel } from "../SettingsPanel";

export function WorldMenu({ t, lang, onClose, onExit }: { t: (k: TextKey) => string; lang: Lang; onClose: () => void; onExit: () => void }) {
  return (
    <Modal title={t("settings")} t={t} onClose={onClose}>
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
