// 결과 창의 한 판 요약: 마지막 장비(아이콘) · 피해 · 돈 · 보스 · 층 도착 · 쓰러진 곳
import type { RoomType } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { enemyName } from "../i18n/enemies";
import { itemName } from "../i18n/items";
import { DOT_COLOR } from "./damageNumbers";
import { formatTime } from "./hudText";
import { ItemIcon } from "./itemIcon";
import type { RunSummaryData } from "./runSummary";

const ROOM_KEY: Record<RoomType, TextKey> = {
  start: "sumRoomStart",
  combat: "sumRoomCombat",
  elite: "sumRoomElite",
  rest: "sumRoomRest",
  treasure: "sumRoomTreasure",
  shop: "sumRoomShop",
  exit: "sumRoomExit",
  golden: "sumRoomGolden",
};
const DOT_KEY = { bleed: "sumBleed", burn: "sumBurn", poison: "sumPoison", curse: "sumCurse" } as const;
const num = (v: number) => Math.round(v).toLocaleString();

export function RunSummary({ d, t, lang }: { d: RunSummaryData; t: (k: TextKey) => string; lang: Lang }) {
  const total = Object.values(d.dealt).reduce((a, b) => a + (b ?? 0), 0);
  const pct = (v = 0) => (total > 0 ? `${Math.round((v / total) * 100)}%` : "0%");
  return (
    <details className="run-summary" open>
      <summary>{t("sumTitle")}</summary>
      <div className="sum-build">
        <span className="sum-weapon" title={itemName("weapon", d.weapon, lang)}>
          <ItemIcon item={{ kind: "weapon", id: d.weapon }} size={32} />
          <b>{itemName("weapon", d.weapon, lang)}</b>
        </span>
        {d.uses.map((u, i) => (
          <span key={`u${i}`} title={itemName("use", u, lang)}>
            <ItemIcon item={{ kind: "use", id: u }} size={24} />
          </span>
        ))}
      </div>
      <div className="sum-passives">
        {d.passives.length === 0 && <small>{t("sumNoPassive")}</small>}
        {d.passives.map(([id, n]) => (
          <span key={id} className="sum-passive" title={itemName("passive", id, lang)}>
            <ItemIcon item={{ kind: "passive", id }} size={24} />
            {n > 1 && <small>×{n}</small>}
          </span>
        ))}
      </div>
      <dl className="sum-stats">
        <dt>{t("sumDealt")}</dt>
        <dd>{num(total)}</dd>
        <dt>{t("sumBest")}</dt>
        <dd>{num(d.best)}</dd>
        {(d.dealt.crit ?? 0) > 0 && (
          <>
            <dt>{t("sumCrit")}</dt>
            <dd className="sum-crit">{pct(d.dealt.crit)}</dd>
          </>
        )}
        {(Object.keys(DOT_KEY) as (keyof typeof DOT_KEY)[]).map((k) =>
          (d.dealt[k] ?? 0) > 0 ? (
            <div key={k} className="sum-row">
              <dt style={{ color: DOT_COLOR[k] }}>{t(DOT_KEY[k])}</dt>
              <dd>{pct(d.dealt[k])}</dd>
            </div>
          ) : null,
        )}
        <dt>{t("sumTaken")}</dt>
        <dd>{num(d.taken)}</dd>
        <dt>{t("sumGold")}</dt>
        <dd>
          {num(d.goldEarned)} / {num(d.goldSpent)}
        </dd>
        <dt>{t("sumBosses")}</dt>
        <dd>
          {d.bossKills} ({d.flawless})
        </dd>
      </dl>
      {d.floors.length > 1 && (
        <div className="sum-floors">
          <small>{t("sumFloors")}</small>
          <div>
            {d.floors.map((f) => (
              <span key={f.floor} className="sum-floor">
                {f.floor}
                {t("floor")} {formatTime(f.tick)} · ♥{Math.ceil(f.hp)}
              </span>
            ))}
          </div>
        </div>
      )}
      {d.death && (
        <p className="sum-death">
          {t("sumDied")}: {d.death.floor}
          {t("floor")} · {t(ROOM_KEY[d.death.room])}
          {d.death.boss && ` (${enemyName(d.death.boss, lang)})`}
        </p>
      )}
    </details>
  );
}
