// 레이드 보상: 보상 방 상자가 열리면 큰 창 + 뒤집힌 카드 10장 (누르면 한 장씩 뒤집힘, 1~3성 · 아주 드물게 전설)
// 판마다 한 번만 뽑고 바로 가방에 넣음 (창을 닫아도 그대로) · 판이 끝나도 닫을 때까지 떠 있음
import { addAcc, rollCards, type AccItem, type RunState } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import type { TextKey } from "../../i18n";
import { play } from "../../audio/sound";
import { Stars } from "./AccParts";
import { accName, accRnd, iconStyle, loadBag, saveBag, useAccEsc } from "./accStore";

type T = (key: TextKey) => string;
/** 이미 뽑은 판 (같은 판에서 다시 뽑지 않게) */
const rolled = new Set<string>();

/** 판을 지켜보다가 상자가 열리면 카드 창 (RaidSolo·CoopGame에서 늘 그림) */
export function RaidRewardCards({ run, t }: { run: RunState; t: T }) {
  const [cards, setCards] = useState<AccItem[] | null>(null);
  useEffect(() => {
    const id = setInterval(() => {
      const f = run.raidBoss?.fight;
      if (!f || f.opened === undefined || !run.raidBoss) return;
      const key = `${run.seed}:${f.opened}`;
      if (rolled.has(key)) return;
      rolled.add(key);
      const bag = loadBag();
      const got = addAcc(bag, rollCards(accRnd));
      saveBag(bag);
      setCards(got);
    }, 200);
    return () => clearInterval(id);
  }, [run]);
  if (!cards) return null;
  return <AccCards t={t} cards={cards} onClose={() => setCards(null)} />;
}

function AccCards({ t, cards, onClose }: { t: T; cards: AccItem[]; onClose: () => void }) {
  const [open, setOpen] = useState<boolean[]>(() => cards.map(() => false));
  useAccEsc(onClose);
  const flip = (i: number) => {
    if (open[i]) return;
    const c = cards[i]!;
    play(c.legend !== undefined ? "achievement" : c.star >= 3 ? "twinkle" : "pickup");
    setOpen((o) => o.map((x, k) => x || k === i));
  };
  const all = open.every(Boolean);
  return (
    <div className="acc-back cards" role="dialog" aria-label={t("accCardsTitle")}>
      <div className="acc-cards-win">
        <h2>{t("accCardsTitle")}</h2>
        <p>{t(all ? "accCardsDone" : "accCardsHint")}</p>
        <div className="acc-cards">
          {cards.map((c, i) => (
            <button key={c.uid} type="button" className={`acc-card${open[i] ? " open" : ""} s${c.star}${c.legend !== undefined ? " leg" : ""}`} style={{ animationDelay: `${i * 0.06}s` }} onClick={() => flip(i)}>
              <span className="acc-card-in">
                <span className="acc-card-back">
                  <i>
                    <b>✦</b>
                  </i>
                </span>
                <span className="acc-card-face">
                  <i className="acc-card-art" style={iconStyle(c)} />
                  <Stars n={c.star} />
                  <small>{accName(t, c)}</small>
                </span>
              </span>
            </button>
          ))}
        </div>
        <div className="acc-actions">
          {!all && (
            <button type="button" onClick={() => setOpen(cards.map(() => true))}>
              {t("accCardsAll")}
            </button>
          )}
          <button type="button" className="primary" onClick={onClose}>
            {t("accClose")}
          </button>
        </div>
      </div>
    </div>
  );
}
