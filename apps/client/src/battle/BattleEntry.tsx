// 함께 하기 입장 화면: 닉네임 → 빠른 매칭 | 친구와 하기 (방 만들기 · 코드로 들어가기)
import { useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { NicknameBar } from "../menu/NicknameBar";
import { TopBar } from "../menu/TopBar";

interface Props {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TextKey) => string;
  busy: boolean;
  error: string;
  /** 없으면 빠른 매칭 칸을 숨김 */
  onQuick?: () => void;
  /** 빠른 매칭 설명 글 */
  quickDesc?: TextKey;
  /** 아래 설명 글 */
  note?: TextKey;
  onCreate: () => void;
  onJoin: (code: string) => void;
  onBack: () => void;
}

export function BattleEntry({ lang, setLang, t, busy, error, onQuick, quickDesc = "quickMatchDesc", note = "battleNote", onCreate, onJoin, onBack }: Props) {
  const [code, setCode] = useState("");
  const locked = busy;

  return (
    <>
      <TopBar lang={lang} setLang={setLang} t={t} />
      <main className="entry-screen">
        <NicknameBar t={t} disabled={busy} />

        <div className="entry-columns">
          {/* 혼자 온 사람이 가장 많이 쓰는 빠른 매칭을 먼저 */}
          {onQuick && (
          <section className="entry-panel quick">
            <h2>{t("quickMatch")}</h2>
            <p className="hint">{t(quickDesc)}</p>
            <button type="button" className="primary big" disabled={locked} onClick={onQuick}>
              {t("quickMatch")}
            </button>
          </section>
          )}

          <section className="entry-panel">
            <h2>{t("friendsTitle")}</h2>
            <p className="hint">{t("friendsDesc")}</p>
            <button type="button" className="outline" disabled={locked} onClick={onCreate}>
              {t("createRoom")}
            </button>
            <div className="entry-divider">
              <span>{t("joinTitle")}</span>
            </div>
            <form
              className="join-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (code.length === 6) onJoin(code);
              }}
            >
              <input
                className="code-input"
                value={code}
                placeholder={t("codePlaceholder")}
                aria-label={t("roomCode")}
                maxLength={6}
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
              />
              <button type="submit" className="primary" disabled={locked || code.length !== 6}>
                {t("joinRoom")}
              </button>
            </form>
          </section>
        </div>

        <p className="hint entry-note">{t(note)}</p>
        <p className="status-line" aria-live="polite">
          {busy ? t("connecting") : error ? <span className="form-error">{error}</span> : null}
        </p>

        <button type="button" className="ghost" onClick={onBack}>
          {t("backToMenu")}
        </button>
      </main>
    </>
  );
}
