// 패왕전 성장 대결 화면 위 정보: 레벨·경험치 막대·돈·상점 버튼(B) · 쟁탈전 진행(포탑·가운데·집 점령) · 증강 고르기 · 상점 창
import { allPlayers, GROW_MENU, isGrow, nearPortal, PW_ARENAS, PW_GROW, towersLeft, type RunState } from "@pixel-rogue/shared";
import { useEffect, useRef, useState } from "react";
import type { Controls } from "../game/controls";
import type { Lang, TextKey } from "../i18n";
import { PwAugPick } from "./PwAugPick";
import { PwMapView } from "./PwMapView";
import { gearItem, gearLines, gearName } from "./pwGearView";
import { ItemIcon } from "../game/itemIcon";
import { PwShop } from "./PwShop";
import { PwWarNews } from "./PwWarNews";

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
  const [map, setMap] = useState(false);
  const open = useRef({ shop: false, map: false, grow: false, portal: false });
  const grow = isGrow(run) && !!PW_ARENAS[run.pvp!.arena].homes;
  const portal = grow && nearPortal(run, me);
  useEffect(() => {
    open.current = { shop, map, grow, portal };
  }, [shop, map, grow, portal]);
  useEffect(() => {
    // B 상점 · R 귀환 · F 포털 앞이면 큰 지도 · Esc: 열린 창만 닫음 (나가기 확인 창이 뜨지 않게, 먼저 받음)
    const key = (e: KeyboardEvent) => {
      const o = open.current;
      if (!o.grow || e.repeat) return;
      if (e.code === "KeyB") setShop((v) => !v);
      if (e.code === "KeyR") {
        e.stopImmediatePropagation();
        controls()?.queueMenu(GROW_MENU.recall);
      }
      if (e.code === "KeyF" && o.portal) setMap(true);
      if (e.code === "Escape" && (o.shop || o.map)) {
        e.stopImmediatePropagation();
        e.preventDefault();
        setShop(false);
        setMap(false);
      }
    };
    window.addEventListener("keydown", key, true);
    return () => window.removeEventListener("keydown", key, true);
  }, [controls]);
  if (!isGrow(run)) return null;
  const p = allPlayers(run)[me]!;
  const lv = p.pwLv ?? 1;
  const need = PW_GROW.xpBase + PW_GROW.xpPer * (lv - 1);
  const pv = run.pvp!;
  const g = pv.grow!;
  const mine = pv.seats[me]!.team;
  const who = g.owner === undefined ? t("pwContestNone") : t(g.owner === mine ? "pwContestOurs" : "pwContestTheirs");
  const pct = (v?: number) => String(Math.floor(v ?? 0));
  const owned = (team: number) => (g.points ?? []).filter((x) => x.owner === team).length;
  return (
    <>
      <div className="pw-grow">
        <b className="pw-grow-lv">{t("pwGrowLv").replace("{n}", String(lv))}</b>
        <span className="pw-grow-xp">
          <i style={{ width: `${Math.min(100, ((p.pwXp ?? 0) / need) * 100)}%` }} />
        </span>
        <b className="pw-grow-gold">🪙 {goldOf(run, me)}</b>
        {PW_ARENAS[pv.arena].homes && (
          <button type="button" onClick={() => setShop((v) => !v)}>
            {t("pwShopOpen")}
          </button>
        )}
        {pv.mode === "contest" && (
          <small>
            {t("pwContestTowers").replace("{a}", String(towersLeft(run, mine))).replace("{b}", String(towersLeft(run, 1 - mine)))} · {t("pwContestMid").replace("{who}", who)}
            {!!(g.base[0] || g.base[1]) && ` · ${t("pwContestBase").replace("{a}", pct(g.base[mine])).replace("{b}", pct(g.base[1 - mine]))}`}
          </small>
        )}
        {pv.mode === "war" && (
          <small>
            {t("pwContestTowers").replace("{a}", String(towersLeft(run, mine))).replace("{b}", String(towersLeft(run, 1 - mine)))} ·{" "}
            {t("pwWarPoints").replace("{a}", String(owned(mine))).replace("{b}", String(owned(1 - mine)))}
            {!!(g.base[0] || g.base[1]) && ` · ${t("pwContestBase").replace("{a}", pct(g.base[mine])).replace("{b}", pct(g.base[1 - mine]))}`}
          </small>
        )}
        {pv.mode === "war" && <PwWarNews run={run} me={me} p={p} t={t} />}
        {p.pwRecall && <b className="pw-recall">⟲ {t("pwRecalling").replace("{n}", String(Math.ceil((p.pwRecall.end - run.tick) / 60)))}</b>}
      </div>
      {grow && <PwMapView run={run} me={me} cell={2} t={t} />}
      {/* 장비 창: 산 장비 6칸 (마우스를 올리면 능력치) */}
      <div className={`pw-gearbar${grow ? "" : " hide"}`} aria-label={t("pwShopMine")}>
        {Array.from({ length: PW_GROW.slots }, (_, k) => {
          const id = p.pwGear?.[k];
          return (
            <span key={k} title={id ? `${gearName(id, lang)}\n${gearLines(id, t).join("\n")}` : ""}>
              {id && <ItemIcon item={gearItem(id, lang)} size={28} />}
            </span>
          );
        })}
      </div>
      {/* 전쟁의 서막 포털: 큰 지도에서 우리 체크포인트를 눌러 순간이동 */}
      {map && (
        <div className="pw-bigmap" role="dialog" aria-label={t("pwPortal")}>
          <b>{t("pwPortalPick")}</b>
          <PwMapView run={run} me={me} cell={6} t={t} className="pw-bigmap-canvas" onPoint={(k) => (controls()?.queueMenu(GROW_MENU.tp + k), setMap(false))} />
          <button type="button" className="ghost" onClick={() => setMap(false)}>
            {t("pwShopClose")}
          </button>
        </div>
      )}
      {p.pwOffer && <PwAugPick offer={p.pwOffer} t={t} controls={controls} />}
      {shop && <PwShop run={run} me={me} lang={lang} t={t} controls={controls} onClose={() => setShop(false)} />}
    </>
  );
}
