// 캐릭터 일러스트를 화면 가운데 크게 (창 테두리 없이, 가장자리는 투명하게 번짐) · 빈 곳 누르기·Esc로 닫힘
// 쓰는 곳: 캐릭터를 새로 얻은 순간(CharArtWatch)
import type { CharacterId } from "@pixel-rogue/shared";
import { useEffect } from "react";
import type { TextKey } from "../i18n";
import { charArtSrc } from "./charArt";

interface Props {
  t: (k: TextKey) => string;
  c: CharacterId;
  /** 새로 얻었을 때: 위에 '새 캐릭터' 글 */
  fresh?: boolean;
  onClose: () => void;
}

export function CharArtReveal({ t, c, fresh = false, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      onClose();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);
  const src = charArtSrc(c);
  if (!src) return null;
  return (
    <div className="char-art-reveal" role="dialog" aria-modal="true" aria-label={t(c as TextKey)} onClick={onClose}>
      <figure className={fresh ? "fresh" : ""} onClick={(e) => e.stopPropagation()}>
        {fresh && <p className="char-art-new">{t("charArtNew")}</p>}
        <img src={src} alt={t(c as TextKey)} draggable={false} />
        <figcaption>{t(c as TextKey)}</figcaption>
      </figure>
      <small className="char-art-hint">{t("charArtHint")}</small>
    </div>
  );
}
