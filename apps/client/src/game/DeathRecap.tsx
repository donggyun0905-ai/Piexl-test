// 던전에서 쓰러졌을 때 결과 창 안 받은 피해 정리 (sim/hurtLog, 패왕전 정리 PwRecap과 같은 모양): 마지막 한 방 · 이 방에서 무엇에 얼마나 맞았는지 막대
import type { HurtRow } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { enemyName } from "../i18n/enemies";

export interface HurtData {
  rows: HurtRow[];
  last?: { by: string; dmg: number };
}

const r = Math.round;

export function DeathRecap({ d, t, lang }: { d: HurtData; t: (k: TextKey) => string; lang: Lang }) {
  if (!d.rows.length) return null;
  const name = (by: string) => (by === "env" ? t("deathEnv") : by === "?" ? t("deathUnknown") : enemyName(by, lang));
  const rows = [...d.rows].sort((a, b) => b.dmg - a.dmg);
  const total = rows.reduce((a, x) => a + x.dmg, 0);
  return (
    <div className="death-recap">
      <h4>{t("deathRecapTitle")}</h4>
      {d.last && (
        <p className="death-last">
          {t("deathLastHit")} <b>{name(d.last.by)}</b> <span>{r(d.last.dmg)}</span>
        </p>
      )}
      <ul>
        {rows.map((x) => (
          <li key={x.by}>
            <div className="death-row">
              <b>{name(x.by)}</b>
              <span>{r(x.dmg)}</span>
            </div>
            <i className="death-bar" style={{ width: `${(100 * x.dmg) / Math.max(1, total)}%` }} />
            <small>{t("deathRowSub").replace("{n}", String(x.n)).replace("{max}", String(r(x.max)))}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
