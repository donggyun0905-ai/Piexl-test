// 제단 결과 작은 창: 증강을 새기면 바친 패시브 둘 · 증강이 새겨진 패시브와 기술 · 바꾸기면 바친 최대 체력 · 무시 벌칙으로 빼앗긴 패시브
// 고른 뒤 10초 동안 (닫기·Esc로 닫음). 값은 loadoutView가 player.altar.last에서 (모양 styles/altar.css)
import { ALTAR, ALTARS, type AltarId, type PassiveId } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import type { Lang, TextKey } from "../../i18n";
import { itemName } from "../../i18n/items";
import { ItemIcon } from "../itemIcon";

export interface AltarResultView {
  tick: number;
  id: AltarId;
  card: number;
  taken: PassiveId[];
  keep?: PassiveId;
  swap?: boolean;
}

export function AltarResult({ res, lang, t }: { res: AltarResultView; lang: Lang; t: (k: TextKey) => string }) {
  const [closed, setClosed] = useState(-1);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.code === "Escape") setClosed(res.tick);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [res.tick]);
  if (closed === res.tick) return null;
  const chip = (id: PassiveId) => (
    <span key={id} className="altar-res-chip">
      <ItemIcon item={{ kind: "passive", id }} size={22} />
      {itemName("passive", id, lang)}
    </span>
  );
  const skills = ALTARS[res.id].skills.map((k) => `${t(`swarmSkill_${k}` as TextKey)} (${t(`swarmSkillDesc_${k}` as TextKey)})`);
  return (
    <div className="altar-result" role="dialog" aria-label={t(`altar_${res.id}` as TextKey)}>
      <header>
        <b>{t(`altar_${res.id}` as TextKey)}</b>
        <button type="button" onClick={() => setClosed(res.tick)}>
          {t("altarResClose")}
        </button>
      </header>
      {res.swap && <p className="lost">{t("altarResHp").replace("{hp}", String(ALTAR.swapHp))}</p>}
      {res.taken.length > 0 && (
        <p className="lost">
          {t(res.card === 1 ? "altarResOffered" : "altarResTaken")}: {res.taken.map(chip)}
        </p>
      )}
      {res.card === 1 && res.keep && (
        <p className="gain">
          ✦ {chip(res.keep)} {t(res.swap ? "altarResSwapped" : "altarResEngraved")}
          <small>{skills.join(" · ")}</small>
        </p>
      )}
    </div>
  );
}
