// 닉네임 줄: 이름 + 수정. 수정을 누르면 그 자리에서 바꾼다 (메인 · 일일 도전 · 함께 하기 입장 화면)
import { uiSfx } from "../audio/uiSounds";
import { NICKNAME_MAX } from "@pixel-rogue/shared";
import { useState } from "react";
import type { TextKey } from "../i18n";
import { loadNickname, saveNickname } from "../player";

interface Props {
  t: (key: TextKey) => string;
  disabled?: boolean;
  /** 바꾼 뒤 알려 줌 (방 안 이름 등) */
  onChange?: (nickname: string) => void;
}

export function NicknameBar({ t, disabled, onChange }: Props) {
  const [nickname, setNickname] = useState(loadNickname);
  /** 입력 중인 값 (null이면 입력 중이 아님) */
  const [draft, setDraft] = useState<string | null>(null);

  if (draft === null) {
    return (
      <div className="nickname-bar">
        <span className="field-label">{t("nickname")}</span>
        <strong className="nickname">{nickname}</strong>
        <button type="button" className="small outline" disabled={disabled} onClick={() => setDraft(nickname)}>
          {t("nicknameEdit")}
        </button>
      </div>
    );
  }

  return (
    <form
      className="nickname-bar editing"
      onSubmit={(e) => {
        e.preventDefault();
        if (!draft.trim()) return;
        const clean = saveNickname(draft);
        setNickname(clean);
        uiSfx("uiSave");
        setDraft(null);
        onChange?.(clean);
      }}
    >
      <span className="field-label">{t("nickname")}</span>
      <input
        value={draft}
        maxLength={NICKNAME_MAX}
        autoFocus
        autoComplete="nickname"
        aria-label={t("nickname")}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && setDraft(null)}
      />
      <button type="submit" className="small primary" data-sfx="none" disabled={!draft.trim()}>
        {t("save")}
      </button>
    </form>
  );
}
