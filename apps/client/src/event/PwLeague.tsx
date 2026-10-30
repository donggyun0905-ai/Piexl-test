// 패왕전 월드 워 리그 화면: 16팀 대진표(LeagueBracket, 왼쪽·오른쪽 8팀씩 → 결승) · 내 다음 경기 칸에서 대결 유형 고르기 → 밴픽 → 준비방 → 대결
// 다른 팀 경기는 관전(AI끼리 진짜 대결)하거나 결과만 보기 · 우승하면 칩 + '승리' 한정 효과 (shop/effects.grantFx) + 우승 화면(LeagueChampion)
import { advanceLeague, createLeague, decideMode, LEAGUE_CHIPS, LEAGUE_MODES, leagueOut, leagueRound, myMatch, pwSeatCount, quickWinner, type CharacterId, type League, type LeagueMatch, type PwLoadout, type PwMode } from "@pixel-rogue/shared";
import { useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { addChips } from "../lobby/chips";
import { grantFx } from "../shop/effects";
import { grantVictorySkins } from "../shop/wallet";
import { PwDraftSolo } from "./PwDraftSolo";
import { PwGame } from "./PwGame";
import { PW_NAME } from "./PwModes";
import { PwPrep } from "./PwPrep";
import { LeagueBracket } from "./LeagueBracket";
import { LeagueChampion } from "./LeagueChampion";
import { TeamEmblem } from "./TeamEmblem";

type Step =
  | { name: "bracket" }
  | { name: "draft"; mode: PwMode }
  | { name: "prep"; mode: PwMode; picks: CharacterId[] }
  | { name: "game"; mode: PwMode; picks: CharacterId[]; loadout: PwLoadout }
  | { name: "watch"; m: LeagueMatch; picks: CharacterId[] };

interface Props {
  lang: Lang;
  t: (k: TextKey) => string;
  onExit: () => void;
}

const ROUND: readonly TextKey[] = ["pwLeagueR16", "pwLeagueQf", "pwLeagueSf", "pwLeagueFinal"];

export function PwLeague({ lang, t, onExit }: Props) {
  // 리그 시드: 리그마다 다르게 (리그 안의 무작위는 이 시드로만)
  const [league, setLeague] = useState<League>(() => createLeague(Math.floor(Math.random() * 0x7fffffff)));
  const [step, setStep] = useState<Step>({ name: "bracket" });
  const [champ, setChamp] = useState<number | undefined>();
  /** 우리 팀 우승 화면 (닫을 수 있음) */
  const [party, setParty] = useState(false);
  const [, redraw] = useState(0);
  const back = () => setStep({ name: "bracket" });
  const team = (i: number) => (i === 0 ? t("pwLeagueMine") : t(`pwLeagueTeam${league.teams[i]!.name}` as TextKey));
  /** 경기 결과 적기 → 라운드가 끝나면 다음으로 · 우승이면 보상 */
  const finish = (m: LeagueMatch, winner: number) => {
    m.winner = winner;
    if (winner === 0) addChips(LEAGUE_CHIPS[leagueRound(league)] ?? 0);
    const c = advanceLeague(league);
    if (c !== undefined) {
      setChamp(c);
      if (c === 0) {
        setParty(true);
        grantFx("league");
        grantVictorySkins();
      }
    }
    setLeague({ ...league });
    redraw((n) => n + 1);
  };
  const mine = myMatch(league);
  if (step.name === "draft") return <PwDraftSolo mode={step.mode} t={t} onBack={back} onDone={(picks) => setStep({ name: "prep", mode: step.mode, picks })} />;
  if (step.name === "prep") return <PwPrep characterId={step.picks[0]!} lang={lang} t={t} onBack={back} onStart={(loadout) => setStep({ name: "game", mode: step.mode, picks: step.picks, loadout })} />;
  if (step.name === "game") {
    const m = mine!;
    return <PwGame mode={step.mode} map={null} characterId={step.picks[0]!} picks={step.picks} loadout={step.loadout} lang={lang} t={t} onExit={back} onEnd={(won) => m.winner === undefined && finish(m, won ? 0 : m.a === 0 ? m.b : m.a)} />;
  }
  if (step.name === "watch") {
    const { m } = step;
    return <PwGame watch mode={m.mode!} map={null} characterId={step.picks[0]!} picks={step.picks} lang={lang} t={t} onExit={back} onEnd={(won) => m.winner === undefined && finish(m, won ? m.a : m.b)} />;
  }
  /** 관전: 두 팀 대표 캐릭터로 AI끼리 */
  const watch = (m: LeagueMatch) => {
    m.mode ??= decideMode(league, m);
    const size = pwSeatCount(m.mode) / 2;
    const picks = [...league.teams[m.a]!.chars.slice(0, size), ...league.teams[m.b]!.chars.slice(0, size)];
    setStep({ name: "watch", m, picks });
  };
  const out = leagueOut(league);
  const nextMine = mine && mine.winner === undefined && champ === undefined ? mine : undefined;
  return (
    <div className="td-maps pw-league">
      <h2>🏆 {t("pwLeague")}</h2>
      <p className="hint">{t("pwLeagueDesc")}</p>
      {champ !== undefined && champ !== 0 && (
        <p className="pw-league-champ">
          <TeamEmblem name={league.teams[champ]!.name} size={28} /> {t("pwLeagueChamp").replace("{team}", team(champ))}
        </p>
      )}
      {out && champ === undefined && <p className="pw-league-champ">{t("pwLeagueOut")}</p>}
      {/* 내 다음 경기: 두 팀 마크 · 대결 유형 고르기 */}
      {nextMine && (
        <div className="pw-league-next">
          <span className="pln-team">
            <TeamEmblem name={nextMine.a === 0 ? "mine" : league.teams[nextMine.a]!.name} size={56} />
            <b>{team(nextMine.a)}</b>
          </span>
          <span className="pln-mid">
            <small>{t(ROUND[leagueRound(league)]!)}</small>
            <em>VS</em>
            <span className="pw-league-pick">
              {t("pwLeaguePick")}
              {LEAGUE_MODES.map((mode) => (
                <button key={mode} type="button" onClick={() => setStep({ name: "draft", mode: (nextMine.mode = decideMode(league, nextMine, mode)) })}>
                  {t(PW_NAME[mode])}
                </button>
              ))}
            </span>
          </span>
          <span className="pln-team">
            <TeamEmblem name={nextMine.b === 0 ? "mine" : league.teams[nextMine.b]!.name} size={56} />
            <b>{team(nextMine.b)}</b>
          </span>
        </div>
      )}
      <LeagueBracket
        league={league}
        t={t}
        team={team}
        canWatch={(m) => m.winner === undefined && champ === undefined && league.rounds[leagueRound(league)]!.includes(m) && (mine?.winner === 0 || out)}
        onWatch={watch}
        onSkip={(m) => finish(m, quickWinner(league, m))}
      />
      <p className="hint">{t("pwLeagueReward")}</p>
      <button type="button" className="ghost" onClick={onExit}>
        {t("back")}
      </button>
      {party && <LeagueChampion t={t} onClose={() => setParty(false)} />}
    </div>
  );
}
