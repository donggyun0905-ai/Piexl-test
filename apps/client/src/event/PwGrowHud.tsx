// 패왕전 성장 대결 화면 위 정보: 레벨·경험치 막대·돈·상점 버튼(B) · 쟁탈전 진행(포탑·가운데·집 점령) · 증강 고르기 · 상점 창
import { allPlayers, GROW_MENU, isGrow, PW_GROW, towersLeft, type RunState } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import type { Controls } from "../game/controls";
import type { Lang, TextKey } from "../i18n";
import { PwShop } from "./PwShop";

interface Props {
  run: RunState;
  me: number;
  lang: Lang;
  t: (k: TextKey) => string;
  controls: () => Controls | null;
}

/** 내 자리 돈 (보던 자리가 아니면 자리 목록에서) */
const goldOf = (run: RunState, me: number) => ((run.seat ?? 0) === me ? run.gold : ((run.party?.[me] as { gold?: number } | undefined)?.gold ?? 0));

export function PwGrowHud({ run, me, lang, t, controls }: Props) {
  const [shop, setShop] = useState(false);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.code === "KeyB" && !e.repeat) setShop((v) => !v);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  if (!isGrow(run)) return null;
  const p = allPlayers(run)[me]!;
  const lv = p.pwLv ?? 1;
  const need = PW_GROW.xpBase + PW_GROW.xpPer * (lv - 1);
  const pv = run.pvp!;
  const g = pv.grow!;
  const mine = pv.seats[me]!.team;
  const who = g.owner === undefined ? t("pwContestNone") : t(g.owner === mine ? "pwContestOurs" : "pwContestTheirs");
  const pct = (v?: number) => String(Math.floor(v ?? 0));
  return (
    <>
      <div className="pw-grow">
        <b className="pw-grow-lv">{t("pwGrowLv").replace("{n}", String(lv))}</b>
        <span className="pw-grow-xp">
          <i style={{ width: `${Math.min(100, ((p.pwXp ?? 0) / need) * 100)}%` }} />
        </span>
        <b className="pw-grow-gold">🪙 {goldOf(run, me)}</b>
        <button type="button" onClick={() => setShop((v) => !v)}>
          {t("pwShopOpen")}
        </button>
        {pv.mode === "contest" && (
          <small>
            {t("pwContestTowers").replace("{a}", String(towersLeft(run, mine))).replace("{b}", String(towersLeft(run, 1 - mine)))} · {t("pwContestMid").replace("{who}", who)}
            {(g.base[0] || g.base[1]) && ` · ${t("pwContestBase").replace("{a}", pct(g.base[mine])).replace("{b}", pct(g.base[1 - mine]))}`}
          </small>
        )}
      </div>
      {p.pwOffer && (
        <div className="pw-aug" role="dialog" aria-label={t("pwAugPick")}>
          <b>{t("pwAugPick")}</b>
          {p.pwOffer.map((id, k) => (
            <button key={id} type="button" onClick={() => controls()?.queueMenu(GROW_MENU.aug + k)}>
              {t(`pwAug_${id}` as TextKey)}
            </button>
          ))}
        </div>
      )}
      {shop && <PwShop run={run} me={me} lang={lang} t={t} controls={controls} onClose={() => setShop(false)} />}
    </>
  );
}
