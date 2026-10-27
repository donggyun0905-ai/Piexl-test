// 패왕전 위쪽 정보: 모드 · 우리 편·상대 남은 수 (토너먼트는 대기 인원, 대난투는 남은 사람, 데스매치는 레벨) · 내 처치/데스 · 지켜보는 중 안내 · 점수판 버튼(Tab)
import { inPlay, type RunState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import { PW_NAME } from "./PwModes";

export function PwHud({ run, me, t, onBoard }: { run: RunState; me: number; t: (k: TextKey) => string; onBoard: () => void }) {
  const pv = run.pvp!;
  const mine = pv.seats[me]!;
  const n = (k: TextKey, v: number) => t(k).replace("{n}", String(v));
  const live = pv.seats.map((_, i) => inPlay(run, i));
  let line: string;
  if (pv.mode === "gungame") {
    const top = Math.max(...pv.seats.map((x) => x.lv));
    line = `${t("pwLevel").replace("{lv}", String(mine.lv))} · ${t("pwTop").replace("{lv}", String(top))}`;
  } else if (pv.mode === "brawl") line = n("pwAlive", live.filter(Boolean).length);
  else {
    const count = (ours: boolean) => pv.seats.filter((x, i) => live[i] && (x.team === mine.team) === ours).length;
    line = `${n("pwAllies", count(true))} · ${n("pwFoes", count(false))}`;
    if (pv.mode === "tourney") {
      const wait = (ours: boolean) => pv.seats.filter((x, i) => !live[i] && x.deaths === 0 && (x.team === mine.team) === ours).length;
      line += ` · ${t("pwBench").replace("{a}", String(wait(true))).replace("{b}", String(wait(false)))}`;
    }
  }
  return (
    <div className="pw-hud">
      <div className="pw-top">
        <strong>{t(PW_NAME[pv.mode])}</strong> <span>{line}</span>
        <span>
          {" "}
          · {mine.kills}K / {mine.deaths}D
        </span>
      </div>
      {!live[me] && mine.back === undefined && <div className="pw-watch">{t("pwWatching")}</div>}
      <button type="button" className="pw-board-btn" onClick={onBoard}>
        {t("pwBoard")} (Tab)
      </button>
    </div>
  );
}
