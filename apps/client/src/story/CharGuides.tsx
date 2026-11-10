// 스토리 '캐릭터' 탭: 모든 캐릭터(히든 포함)의 얼굴 · 이름 · 자세한 설명 (글은 i18n/guides). 하나를 누르면 펼침
import { ALL_CHARACTER_IDS, HIDDEN_CHARACTERS, type CharacterId } from "@pixel-rogue/shared";
import { useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { charGuide } from "../i18n/guides";
import { TdPortrait } from "../td/TdScreen";
import { RichText } from "../game/RichText";

export function CharGuides({ lang, t }: { lang: Lang; t: (k: TextKey) => string }) {
  const [open, setOpen] = useState<CharacterId | null>(null);
  return (
    <div className="story-cards">
      {ALL_CHARACTER_IDS.map((c) => (
        <section key={c} className={`story-card char-guide${HIDDEN_CHARACTERS.includes(c) ? " hidden-char" : ""}`}>
          <button type="button" className="char-guide-head" aria-expanded={open === c} onClick={() => setOpen(open === c ? null : c)}>
            <TdPortrait id={c} size={40} />
            <strong>{t(c as TextKey)}</strong>
            <span>{open === c ? "▲" : "▼"}</span>
          </button>
          {open === c && (
            <ul>
              {charGuide(c, lang).map((line) => (
                <li key={line}>
                  <RichText text={line} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
