// 상점 '서고의 감시자' 탭: 한정 캐릭터 전용 뽑기 배너 (빛의 사도) · 1번 · 11번 · 확정까지 남은 수 · 결과 창 (Esc·누르면 닫힘)
import { LIMITED_CHARACTERS } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import type { TextKey } from "../i18n";
import { ARCHIVE10_PRICE, ARCHIVE_DUP, ARCHIVE_MISS, ARCHIVE_ODDS, ARCHIVE_PITY, ARCHIVE_PRICE, archiveGacha, archivePity, ownedLimited, type ArchivePrize } from "./limitedChars";
import { SkinPreview } from "./SkinPreview";
import { coupons } from "./wallet";

function Result({ prizes, t, onClose }: { prizes: ArchivePrize[]; t: (k: TextKey) => string; onClose: () => void }) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);
  const hit = prizes.find((p) => p.kind === "char");
  return (
    <div className="archive-result" role="dialog" onClick={onClose}>
      {hit && hit.kind === "char" ? (
        <div className="archive-hit">
          <div className="archive-rays" aria-hidden="true" />
          <SkinPreview sheet="lux4" size={192} />
          <strong>{t(hit.id as TextKey)}</strong>
          <p>{hit.dup ? t("archiveDup").replace("{n}", String(ARCHIVE_DUP)) : t("archiveGot")}</p>
        </div>
      ) : (
        <div className="archive-miss">
          <p>{t("archiveMissAll").replace("{n}", String(prizes.length * ARCHIVE_MISS))}</p>
        </div>
      )}
      <small>{t("pwLeagueTapClose")}</small>
    </div>
  );
}

export function ArchiveTab({ t, onChange }: { t: (k: TextKey) => string; onChange: () => void }) {
  const [result, setResult] = useState<ArchivePrize[]>([]);
  const pull = (n: number, price: number) => {
    const r = archiveGacha(n, price);
    if (r) setResult(r);
    onChange();
  };
  const owned = ownedLimited();
  return (
    <div className="shop-archive">
      <div className="archive-banner">
        <span className="limited-badge">{t("archiveBadge")}</span>
        <div className="archive-art">
          <SkinPreview sheet="lux4" size={168} />
        </div>
        <div className="archive-text">
          <small>{t("csArchive")}</small>
          <strong>{t("lux")}</strong>
          <p>{t("luxDesc")}</p>
          {LIMITED_CHARACTERS.every((c) => owned.includes(c)) && <b className="archive-owned">✓ {t("archiveOwned")}</b>}
        </div>
      </div>
      <div className="gacha-buttons">
        <button type="button" className="primary big" disabled={coupons() < ARCHIVE_PRICE} onClick={() => pull(1, ARCHIVE_PRICE)}>
          {t("shopGacha1")} · 🎟 {ARCHIVE_PRICE}
        </button>
        <button type="button" className="primary big" disabled={coupons() < ARCHIVE10_PRICE} onClick={() => pull(11, ARCHIVE10_PRICE)}>
          {t("shopGacha10")} · 🎟 {ARCHIVE10_PRICE}
        </button>
      </div>
      <p className="shop-note">
        {t("archiveNote").replace("{p}", String(ARCHIVE_ODDS * 100)).replace("{pity}", String(ARCHIVE_PITY)).replace("{left}", String(ARCHIVE_PITY - archivePity())).replace("{m}", String(ARCHIVE_MISS)).replace("{d}", String(ARCHIVE_DUP))}
      </p>
      {result.length > 0 && <Result prizes={result} t={t} onClose={() => setResult([])} />}
    </div>
  );
}
