// 월드 워 리그 대진표 (토너먼트 브래킷): 왼쪽 8팀 16강 → 8강 → 4강 → 가운데 결승 ← 4강 ← 8강 ← 16강 오른쪽 8팀
// 경기 칸: 두 팀(마크·이름) · 이긴 팀 금빛, 진 팀 흐리게 · 대결 유형 · 다른 팀 경기는 관전·결과만 버튼 (내 경기는 위쪽 '다음 경기' 칸에서 고름)
import type { League, LeagueMatch } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import { PW_NAME } from "./PwModes";
import { TeamEmblem } from "./TeamEmblem";

const ROUND: readonly TextKey[] = ["pwLeagueR16", "pwLeagueQf", "pwLeagueSf", "pwLeagueFinal"];
/** 라운드마다 경기 수 (16강 8 · 8강 4 · 4강 2 · 결승 1) */
const COUNT = [8, 4, 2, 1];

interface Props {
  league: League;
  t: (k: TextKey) => string;
  team: (i: number) => string;
  /** 이 경기에서 관전·결과만 버튼을 보일지 */
  canWatch: (m: LeagueMatch) => boolean;
  onWatch: (m: LeagueMatch) => void;
  onSkip: (m: LeagueMatch) => void;
}

export function LeagueBracket({ league, t, team, canWatch, onWatch, onSkip }: Props) {
  const mark = (i: number) => <TeamEmblem name={i === 0 ? "mine" : league.teams[i]!.name} size={26} />;
  const row = (m: LeagueMatch | undefined, side: "a" | "b") => {
    const i = m?.[side];
    if (i === undefined)
      return (
        <div className="lb-team tbd">
          <span className="lb-tbd">?</span>
          <span>—</span>
        </div>
      );
    const st = m!.winner === undefined ? "" : m!.winner === i ? " won" : " lost";
    return (
      <div className={`lb-team${st}${i === 0 ? " mine" : ""}`}>
        {mark(i)}
        <span>{team(i)}</span>
        {m!.winner === i && <b>✓</b>}
      </div>
    );
  };
  const card = (r: number, k: number) => {
    const m = league.rounds[r]?.[k];
    const mine = !!m && (m.a === 0 || m.b === 0);
    return (
      <div key={k} className={`lb-match${mine ? " mine" : ""}${r === 3 ? " final" : ""}`}>
        {row(m, "a")}
        {row(m, "b")}
        {m?.mode && <small className="lb-mode">{t(PW_NAME[m.mode])}</small>}
        {m && !mine && canWatch(m) && (
          <span className="lb-act">
            <button type="button" onClick={() => onWatch(m)} title={t("pwLeagueWatch")}>
              👁 {t("pwLeagueWatch")}
            </button>
            <button type="button" className="ghost" onClick={() => onSkip(m)}>
              {t("pwLeagueSkip")}
            </button>
          </span>
        )}
      </div>
    );
  };
  /** 한쪽 라운드 열: 경기를 둘씩 묶어 ']' 모양 줄로 이음 */
  const column = (r: number, side: "left" | "right") => {
    const half = COUNT[r]! / 2;
    const ks = Array.from({ length: half }, (_, j) => (side === "left" ? j : half + j));
    const pairs = half >= 2 ? Array.from({ length: half / 2 }, (_, j) => ks.slice(j * 2, j * 2 + 2)) : [ks];
    return (
      <div key={`${side}${r}`} className={`lb-col ${side}`}>
        <h4>{t(ROUND[r]!)}</h4>
        <div className="lb-col-body">
          {pairs.map((p, j) => (
            <div key={j} className={`lb-pair${p.length > 1 ? " two" : ""}`}>
              {p.map((k) => card(r, k))}
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className="lb-wrap">
      <div className="lb">
        {[0, 1, 2].map((r) => column(r, "left"))}
        <div className="lb-col center">
          <div className="lb-trophy" aria-hidden="true">
            🏆
          </div>
          <h4>{t(ROUND[3]!)}</h4>
          <div className="lb-col-body">{card(3, 0)}</div>
        </div>
        {[2, 1, 0].map((r) => column(r, "right"))}
      </div>
    </div>
  );
}
