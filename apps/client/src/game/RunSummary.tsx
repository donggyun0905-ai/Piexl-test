// 결과 창의 한 판 요약: 마지막 장비(아이콘) · 피해 · 돈 · 보스 · 층 도착 · 쓰러진 곳
import type { RoomType } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { enemyName } from "../i18n/enemies";
import { itemName } from "../i18n/items";
import { DOT_COLOR, type NumKind } from "./damageNumbers";
import { formatTime } from "./hudText";
import { ItemIcon } from "./itemIcon";
import type { RunSummaryData } from "./runSummary";
import { DamageBars, SourceBars } from "./SourcePanel";

const ROOM_KEY: Record<RoomType, TextKey> = {
  start: "sumRoomStart",
  combat: "sumRoomCombat",
  elite: "sumRoomElite",
  rest: "sumRoomRest",
  gym: "sumRoomGym",
  forge: "sumRoomForge",
  trial: "sumRoomTrial",
  altar: "sumRoomAltar",
  devil: "sumRoomDevil",
  gamble: "sumRoomGamble",
  auction: "sumRoomAuction",
  hidden: "sumRoomHidden",
  treasure: "sumRoomTreasure",
  shop: "sumRoomShop",
  exit: "sumRoomExit",
  golden: "sumRoomGolden",
};
/** 피해 상세 줄: 종류마다 글자 · 막대 색 (보통 공격 · 치명타 · 상태이상 전부) */
export const DOT_TEXT: Record<NumKind, TextKey> = { hit: "sumHit", crit: "sumCrit", bleed: "sumBleed", burn: "sumBurn", poison: "sumPoison", curse: "sumCurse", storm: "sumDotStorm", rot: "sumDotRot", death: "sumDotDeath", hellfire: "sumDotHellfire", shock: "sumDotShock", frost: "sumDotFrost", tide: "sumDotTide", gold: "sumDotGold", radiance: "sumDotRadiance", voidbolt: "sumDotVoid", moon: "sumDotMoon", blueflame: "sumDotBlueflame" };
const KIND_COLOR: Record<NumKind, string> = { ...DOT_COLOR, hit: "#e8e4f0", crit: "#ffd060", death: "#8a7a9a" };
const num = (v: number) => Math.round(v).toLocaleString();

export function RunSummary({ d, t, lang }: { d: RunSummaryData; t: (k: TextKey) => string; lang: Lang }) {
  const total = Object.values(d.dealt).reduce((a, b) => a + (b ?? 0), 0);
  const rows = (Object.entries(d.dealt) as [NumKind, number][]).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
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
      <DamageBars title={t("sumDetail")} rows={rows.map(([k, v]) => ({ key: k, name: t(DOT_TEXT[k]), color: KIND_COLOR[k], v }))} />
      <SourceBars rows={d.sources ?? []} weapon={d.weapon} lang={lang} t={t} title={t("sumSources")} note={t("sumSourcesNote")} max={14} />
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
