// 협동 초대 링크로 왔는데 저장된 닉네임이 없을 때: 닉네임을 정하고 바로 그 방에 들어감
import { NICKNAME_MAX } from "@pixel-rogue/shared";
import { useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { TopBar } from "../menu/TopBar";
import { saveNickname } from "../player";

interface Props {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TextKey) => string;
  onDone: () => void;
  onBack: () => void;
}

export function CoopNameAsk({ lang, setLang, t, onDone, onBack }: Props) {
  const [draft, setDraft] = useState("");

  return (
    <>
      <TopBar lang={lang} setLang={setLang} t={t} />
      <main className="entry-screen">
        <section className="entry-panel">
          <h2>{t("coopNameAskTitle")}</h2>
          <p className="hint">{t("coopNameAskDesc")}</p>
          <form
            className="join-form name-ask"
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.trim()) return;
              saveNickname(draft);
              onDone();
            }}
          >
            <input
              value={draft}
              maxLength={NICKNAME_MAX}
              autoFocus
              autoComplete="nickname"
              placeholder={t("nickname")}
              aria-label={t("nickname")}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button type="submit" className="primary" disabled={!draft.trim()}>
              {t("joinRoom")}
            </button>
          </form>
        </section>
        <button type="button" className="ghost" onClick={onBack}>
          {t("backToMenu")}
        </button>
      </main>
    </>
  );
}
