// 상점 이벤트 탭: 이벤트 코인으로 효과 사기·장착 (타격 · 대기 · 걸음 · 피해 숫자), 산 효과 그림은 도트로 고치기
import { useState } from "react";
import type { TextKey } from "../i18n";
import { eventCoins } from "../event/eventCoins";
import { buyFx, equipFx, equippedFx, FX_ITEMS, FX_SLOTS, ownedFx } from "./effects";
import { FxPreview } from "./FxPreview";
import { EcoinIcon } from "../event/EcoinIcon";

export function EventTab({ t, onChange }: { t: (k: TextKey) => string; onChange: () => void }) {
  const [, redraw] = useState(0);
  const act = (fn: () => void) => {
    fn();
    redraw((n) => n + 1);
    onChange();
  };
  const owned = ownedFx();
  const worn = equippedFx();
  const coins = eventCoins();
  return (
    <div className="shop-skins">
      <p className="shop-note">
        <EcoinIcon /> {t("shopEcoins")} <b>{coins}</b> · {t("shopEcoinHow")}
      </p>
      {FX_SLOTS.map((slot) => (
        <section key={slot}>
          <h3 className="fx-slot">{t(`shopFxSlot_${slot}` as TextKey)}</h3>
          <div className="shop-grid">
            {FX_ITEMS.filter((x) => x.slot === slot).map((x) => {
              const have = owned.includes(x.id);
              const on = worn[slot] === x.id;
              return (
                <div key={x.id} className={`skin-card${on ? " wearing" : ""}`}>
                  <FxPreview item={x} />
                  <strong>{t(`shopFx_${x.id}` as TextKey)}</strong>
                  <small>{t(`shopFxDesc_${x.id}` as TextKey)}</small>
                  {!have ? (
                    <button type="button" className="primary" disabled={coins < x.price} title={coins < x.price ? t("shopNoEcoin") : undefined} onClick={() => act(() => buyFx(x.id))}>
                      <EcoinIcon /> {x.price}
                    </button>
                  ) : on ? (
                    <button type="button" className="secondary" onClick={() => act(() => equipFx(slot, null))}>
                      {t("shopFxOff")}
                    </button>
                  ) : (
                    <button type="button" className="primary" onClick={() => act(() => equipFx(slot, x.id))}>
                      {t("shopFxOn")}
                    </button>
                  )}
                  {have && x.sprites.length > 0 && (
                    <a className="fx-edit" href={`${import.meta.env.BASE_URL}pixel/?fx=1`}>
                      🖌 {t("shopFxEdit")}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
      <p className="shop-note">{t("shopFxNote")}</p>
    </div>
  );
}
