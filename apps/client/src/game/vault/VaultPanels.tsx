// 비밀의 방 창: 도박꾼 야바위(시작 · 왼쪽/가운데/오른쪽 고르기 · 결과) · 경매(상품 줄 · 지금 값·앞선 사람·하나둘셋 · 입찰/포기 · 증강 붙일 패시브)
// 누른 것은 입력 menu → sim/gamble·auction (기록·다시 돌리기에서도 같은 결과). 모양은 styles/vault.css
import { AUCTION, AUCTION_OP, GAMBLE, GAMBLE_OP, goingStage, lotHidden, menuCode, nextBid, type AuctionState, type PassiveId } from "@pixel-rogue/shared";
import { lotDesc, lotItem, lotName } from "./auctionText";
import type { Lang, TextKey } from "../../i18n";
import { itemDesc, itemName } from "../../i18n/items";
import { ItemIcon, type IconItem } from "../itemIcon";

interface GambleProps {
  gamble: { phase: number; win?: boolean };
  t: (key: TextKey) => string;
  send: (code: number) => void;
}

export function GamblePanel({ gamble, t, send }: GambleProps) {
  return (
    <div className="station-window vault-gamble" role="dialog" aria-label={t("gambleTitle")}>
      <header className="station-head">
        <b>{t("gambleTitle")}</b>
        <small>{t("stationClose")}</small>
      </header>
      {gamble.phase === 0 && (
        <div className="vault-body">
          <p>{t("gambleRule").replace("{n}", String(GAMBLE.passives)).replace("{g}", String(GAMBLE.gold))}</p>
          <button type="button" className="vault-go" onClick={() => send(menuCode(GAMBLE_OP, 0))}>
            {t("gambleStart")}
          </button>
        </div>
      )}
      {gamble.phase === 1 && (
        <div className="vault-body">
          <p>{t("gamblePick")}</p>
          <div className="vault-cups">
            {(["gambleLeft", "gambleMid", "gambleRight"] as const).map((k, i) => (
              <button key={k} type="button" className="vault-cup" onClick={() => send(menuCode(GAMBLE_OP, i + 1))}>
                <span aria-hidden="true">▣</span>
                {t(k)}
              </button>
            ))}
          </div>
        </div>
      )}
      {gamble.phase === 2 && <p className={`vault-result ${gamble.win ? "win" : "lose"}`}>{t(gamble.win ? "gambleWin" : "gambleLose")}</p>}
    </div>
  );
}

interface AuctionProps {
  view: { a: AuctionState; tick: number; passives: PassiveId[] };
  gold: number;
  lang: Lang;
  t: (key: TextKey) => string;
  send: (code: number) => void;
}

export function AuctionPanel({ view, gold, lang, t, send }: AuctionProps) {
  const { a, tick } = view;
  const lot = a.lot >= 0 ? a.lots[a.lot] : undefined;
  const name = (i: number) => lotName(a, i, lang, t);
  const desc = (i: number) => lotDesc(a, i, lang, t);
  const stage = lot ? goingStage(a, tick) : 0;
  const can = !!lot && a.lead !== 1 && tick >= a.t && gold >= nextBid(a) && a.graft === undefined;
  return (
    <div className="station-window vault-auction" role="dialog" aria-label={t("auctionTitle")}>
      <header className="station-head">
        <b>{t("auctionTitle")}</b>
        <span className="station-gold">
          {t("stationGold")} <strong>{gold}G</strong>
        </span>
        <small>{t("stationClose")}</small>
      </header>
      <div className="auction-lots">
        {a.lots.map((l, i) => {
          const item = lotItem(a, i);
          return (
            <span key={i} className={`auction-lot${i === a.lot ? " now" : ""}${l.won ? ` won${l.won}` : ""}`} title={`${name(i)} — ${desc(i)}`}>
              {item ? <ItemIcon item={item} size={28} /> : <i>{lotHidden(a, i) ? "?" : "◆"}</i>}
              {l.won && <small>{l.won === 1 ? `${t("auctionMine")} ${l.price}G` : `${t("auctionTheirs")} ${l.price}G`}</small>}
            </span>
          );
        })}
      </div>
      {a.graft !== undefined ? (
        <div className="vault-body">
          <p>{t("auctionGraft").replace("{skill}", t(`swarmSkill_${a.lots[a.graft]!.id}` as TextKey))}</p>
          <div className="auction-graft">
            {view.passives.map((id, i) => (
              <button key={`${id}${i}`} type="button" title={itemDesc("passive", id, lang, t)} onClick={() => send(menuCode(AUCTION_OP, 10 + i))}>
                <ItemIcon item={{ kind: "passive", id } as IconItem} size={28} />
                <small>{itemName("passive", id, lang)}</small>
              </button>
            ))}
          </div>
        </div>
      ) : a.lot < 0 ? (
        <div className="vault-body">
          <p>{t("auctionRule").replace("{n}", String(AUCTION.lots)).replace("{h}", String(AUCTION.hidden + 1))}</p>
          <button type="button" className="vault-go" onClick={() => send(menuCode(AUCTION_OP, 0))}>
            {t("auctionStart")}
          </button>
        </div>
      ) : !lot ? (
        <p className="vault-result win">{t("auctionEnd")}</p>
      ) : (
        <div className="vault-body">
          <p className="auction-now">
            <b>{name(a.lot)}</b>
            <small>{desc(a.lot)}</small>
          </p>
          <p className={`auction-price lead${a.lead}`}>
            <strong>{a.price}G</strong> · {t(a.lead === 1 ? "auctionLeadMe" : a.lead === 2 ? "auctionLeadThem" : "auctionLeadNone")}
            {stage > 0 && <em> {t(`auctionGoing${stage}` as TextKey)}</em>}
          </p>
          <div className="auction-buttons">
            <button type="button" className="vault-go" disabled={!can} onClick={() => send(menuCode(AUCTION_OP, 1))}>
              {t("auctionBid").replace("{price}", String(nextBid(a)))}
            </button>
            <button type="button" disabled={a.lead === 1} onClick={() => send(menuCode(AUCTION_OP, 2))}>
              {t("auctionPass")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
