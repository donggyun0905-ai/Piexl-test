// 뽑기 연출 (화면 전체): 봉투를 뜯음(GachaPack) → 카드가 뒷면으로 깔림 (1번은 큰 카드 1장, 10번은 5장씩 2줄 + 덤 1장)
// → 카드를 누르면 결과 색으로 빛나며 뒤집힘 (한정 스킨 무지개 · 스킨 금빛 · 쿠폰 보라 · 이벤트 코인 흰빛)
import { useEffect, useRef, useState } from "react";
import type { TextKey } from "../i18n";
import { GachaPack } from "./GachaPack";
import { useGachaGlow } from "./gachaGlow";
import { Prize, prizeGlow } from "./GachaPrize";
import type { GachaPrize } from "./wallet";

/** 빛난 뒤 뒤집히기까지 · 모두 뒤집기 카드 사이 간격 */
const GLOW_MS = 420;
const FLIP_GAP_MS = 140;
/** 한 줄 카드 수 */
const ROW = 5;

function Card({ p, i, big, state, onPick, t }: { p: GachaPrize; i: number; big: boolean; state: "back" | "glow" | "front"; onPick: (i: number) => void; t: (k: TextKey) => string }) {
  return (
    <button
      type="button"
      className={`gacha-card ${prizeGlow(p)} ${state}${big ? " big" : ""}`}
      style={{ animationDelay: `${i * 70}ms` }}
      data-card={i}
      onClick={() => onPick(i)}
      disabled={state !== "back"}
    >
      <span className="card-light" />
      <span className="card-inner">
        <span className="card-back">
          <span className="pack-star">✦</span>
        </span>
        <span className="card-front">
          <Prize p={p} t={t} size={big ? 96 : 56} />
        </span>
      </span>
    </button>
  );
}

export function GachaReveal({ prizes, t, onClose }: { prizes: GachaPrize[]; t: (k: TextKey) => string; onClose: () => void }) {
  const [opened, setOpened] = useState(false);
  const [states, setStates] = useState<("back" | "glow" | "front")[]>(() => prizes.map(() => "back"));
  const timers = useRef<number[]>([]);
  const stage = useRef<HTMLDivElement>(null);
  const burst = useGachaGlow(stage);
  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
  const set = (i: number, v: "back" | "glow" | "front") => setStates((s) => s.map((x, k) => (k === i ? v : x)));
  const pick = (i: number, wait = 0) => {
    later(wait, () => {
      set(i, "glow");
      burst(stage.current?.querySelector(`[data-card="${i}"]`) ?? null, prizeGlow(prizes[i]!));
    });
    later(wait + GLOW_MS, () => set(i, "front"));
  };
  const flipAll = () => {
    let n = 0;
    states.forEach((st, i) => {
      if (st === "back") pick(i, FLIP_GAP_MS * n++);
    });
  };
  const big = prizes.length === 1;
  const card = (i: number) => <Card key={i} p={prizes[i]!} i={i} big={big} state={states[i]!} onPick={(k) => pick(k)} t={t} />;
  const main = prizes.slice(0, ROW * 2).map((_, i) => i);
  const bonus = prizes.slice(ROW * 2).map((_, i) => i + ROW * 2);
  const done = states.every((s) => s === "front");

  return (
    <div ref={stage} className="gacha-stage" role="dialog" aria-modal="true">
      {!opened ? (
        <GachaPack fancy={!big} count={prizes.length} t={t} onOpen={() => {
            burst(null, "open");
            setOpened(true);
          }} />
      ) : (
        <div className="gacha-table">
          <div className={`gacha-cards${big ? " single" : ""}`}>{main.map(card)}</div>
          {bonus.length > 0 && (
            <div className="gacha-bonus">
              <span>{t("shopGachaBonus")}</span>
              {bonus.map(card)}
            </div>
          )}
          <p className="gacha-hint">{done ? "" : t("shopFlipHint")}</p>
          <div className="gacha-stage-buttons">
            {!done && !big && (
              <button type="button" onClick={flipAll}>
                {t("shopFlipAll")}
              </button>
            )}
            <button type="button" className="primary" onClick={onClose}>
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
