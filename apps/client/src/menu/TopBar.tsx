// 화면 위쪽 줄: 오른쪽 설정 버튼 (언어 · 소리 · 진동 등). 메인 · 함께 하기 화면에서 같이 씀
import { useState } from "react";
import { LANGS, type Lang, type TextKey } from "../i18n";
import { SettingsPanel } from "../SettingsPanel";
import { Icon } from "./Icon";
import { Modal } from "./Modal";

interface Props {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TextKey) => string;
}

export function TopBar({ lang, setLang, t }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="topbar">
        <button type="button" className="icon-button" aria-label={t("settings")} onClick={() => setOpen(true)}>
          <Icon name="gear" />
          <span className="icon-button-label">{t("settings")}</span>
        </button>
      </header>
      {open && (
        <Modal title={t("settings")} t={t} onClose={() => setOpen(false)}>
          <div className="setting-row">
            <span>{t("language")}</span>
            <div className="lang-options" role="group" aria-label={t("language")}>
              {LANGS.map((l) => (
                <button key={l.id} type="button" className={l.id === lang ? "small selected" : "small"} onClick={() => setLang(l.id)}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <SettingsPanel lang={lang} t={t} />
        </Modal>
      )}
    </>
  );
}
