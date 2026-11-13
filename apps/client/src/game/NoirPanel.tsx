// 아슈바르(느아르·루주) 적응력: 장비 줄 위 레벨·흑 막대·악마 계급 · 강화 횟수가 있으면 강화 버튼 4개 (기본공격·추가공격·스킬공격·승격, 확률이 버튼에)
// 스킬공격을 누르면 스킬 4개 버튼 (Esc·뒤로로 닫힘) · 누르면 입력 statPick으로 기록 (1 기본 · 2 추가 · 3 승격 · 4~7 스킬, sim/nrAdapt)
import { useEffect, useState } from "react";
import { NR_UP } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { Controls } from "./controls";

export interface NoirView {
  /** 아슈바르 누구인지 (이름·스킬 글자 키 앞: 느아르 nr · 루주 rg · 블뢰 bu · 존 jn) */
  who: "noir" | "rouge" | "bleu" | "jaune" | "magenta";
  lv: number;
  exp: number;
  need: number;
  pts: number;
  base: number;
  extra: number;
  up: boolean[];
  rank: number;
  /** statPick 1~7 차례의 지금 성공 확률 (못 누르면 null) */
  ch: (number | null)[];
  /** 방금 강화 결과 (잠깐 보임) */
  msg?: "ok" | "fail";
}

const RANKS: TextKey[] = ["nrRank0", "nrRank1", "nrRank2", "nrRank3"];
const pct = (c: number | null) => (c === null ? "" : `${Math.round(c * 100)}%`);

export function NoirPanel({ view, t, controls }: { view: NoirView; t: (key: TextKey) => string; controls: () => Controls | null }) {
  const [open, setSkills] = useState(false);
  // 강화 횟수를 다 쓰면 스킬 고르는 창도 닫힘
  const skills = open && view.pts > 0;
  // 스킬 고르는 창은 Esc로 닫힘
  useEffect(() => {
    if (!skills) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setSkills(false);
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [skills]);
  const pick = (k: number) => controls()?.queueStat(k);
  const btn = (k: number, label: string, sub: string) => {
    const c = view.ch[k - 1] ?? null;
    return (
      <button key={k} type="button" disabled={c === null} onClick={() => pick(k)}>
        {label} <i>{sub}</i> <b>{c === null ? t("nrUpMax") : pct(c)}</b>
      </button>
    );
  };
  const stage = (n: number) => t("nrStage").replace("{n}", String(n));
  const pre = view.who === "rouge" ? "rg" : view.who === "bleu" ? "bu" : view.who === "jaune" ? "jn" : view.who === "magenta" ? "mz" : "nr";
  const rankLocked = view.rank === 2 && view.ch[NR_UP.rank - 1] === null;
  return (
    <div className="novice-bar noir-bar">
      <span className="novice-lv">{t("nrLevel").replace("{n}", String(view.lv))}</span>
      <span className={`noir-rank r${view.rank}`} title={t("nrRankTip")}>
        {t(view.who)} · {t(RANKS[view.rank] ?? "nrRank0")}
      </span>
      <span className="novice-exp noir-exp" aria-label={`${t("nrGauge")} ${view.exp} / ${view.need}`}>
        <span style={{ width: `${Math.min(100, (view.exp / view.need) * 100)}%` }} />
      </span>
      {view.msg && <span className={`noir-msg ${view.msg}`}>{t(view.msg === "ok" ? "nrUpOk" : "nrUpFail")}</span>}
      {view.pts > 0 && (
        <div className="novice-pick noir-pick">
          <small>{t("nrUpTitle").replace("{n}", String(view.pts))}</small>
          {!skills ? (
            <>
              {btn(NR_UP.base, t("nrUpBase"), stage(view.base))}
              {btn(NR_UP.extra, t("nrUpExtra"), stage(view.extra))}
              <button type="button" disabled={view.up.every(Boolean)} onClick={() => setSkills(true)}>
                {t("nrUpSkill")} <i>{view.up.filter(Boolean).length}/4</i>
              </button>
              {rankLocked ? (
                <button type="button" disabled title={t("nrRankTip")}>
                  {t("nrUpRank")} <i>{t("nrUpLock")}</i>
                </button>
              ) : (
                btn(NR_UP.rank, t("nrUpRank"), t(RANKS[Math.min(3, view.rank + 1)]!))
              )}
            </>
          ) : (
            <>
              {[0, 1, 2, 3].map((i) => btn(NR_UP.skill + i, t(`${pre}Skill${i + 1}` as TextKey), `→ ${t(`${pre}SkillUp${i + 1}` as TextKey)}`))}
              <button type="button" onClick={() => setSkills(false)}>
                {t("nrUpBack")}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
