// 테스트 중에만: 히든 캐릭터 버튼 하나 → 누르면 히든 캐릭터 목록 창 (그림·이름, 골라서 바로 시작). 히든이 늘어나도 버튼은 하나
import { HIDDEN_CHARACTERS, type CharacterId } from "@pixel-rogue/shared";
import { useState } from "react";
import type { TextKey } from "./i18n";
import { SkinPreview } from "./shop/SkinPreview";

interface Props {
  t: (key: TextKey) => string;
  name: Record<CharacterId, TextKey>;
  onPick: (c: CharacterId) => void;
}

export function HiddenCharList({ t, name, onPick }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="secondary hidden-pick" onClick={() => setOpen(true)}>
        ★ {t("hiddenList")} ({HIDDEN_CHARACTERS.length}) <small>{t("hiddenTest")}</small>
      </button>
      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal hidden-list" role="dialog" aria-modal="true" aria-label={t("hiddenList")} onClick={(e) => e.stopPropagation()}>
            <h3>★ {t("hiddenList")}</h3>
            <div className="hidden-list-grid">
              {HIDDEN_CHARACTERS.map((h) => (
                <button key={h} type="button" className={`hidden-list-item character-card ${h}`} onClick={() => onPick(h)}>
                  <SkinPreview sheet={h} size={48} />
                  <span>{t(name[h])}</span>
                </button>
              ))}
            </div>
            <button type="button" className="secondary" onClick={() => setOpen(false)}>
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
