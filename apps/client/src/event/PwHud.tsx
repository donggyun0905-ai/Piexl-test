// 패왕전 위쪽 정보 (한 줄): 편 대결 점수(편 처치 수·남은 사람 점) 또는 대난투·데스매치 줄 · 내 처치/데스·준 피해·받은 피해 · 가까운 적 · 목표는 시작 카운트다운 때만 · 지켜보는 중 안내 · 점수판 버튼(Tab) · 처치 알림(PwFeed)
import { allPlayers, inPlay, PW, PW_MODE, pvpTimeLeft, pvpZone, TICK_RATE, type RunState } from "@pixel-rogue/shared";
import { pwNearestFoe } from "../game/render/pwLook";
import type { TextKey } from "../i18n";
import { seatWho } from "./PwBoard";
import { PwCapHud } from "./PwCapHud";
import { PwFeed } from "./PwFeed";
import { PW_NAME } from "./PwModes";

interface Props {
  run: RunState;
  me: number;
  names?: readonly string[];
  t: (k: TextKey) => string;
  onBoard: () => void;
}

const GOAL: Record<string, TextKey> = { tourney: "pwGoalTourney", brawl: "pwGoalBrawl", gungame: "pwGoalGun", capture: "pwGoalCapture", contest: "pwGoalContest", war: "pwGoalWar" };

export function PwHud({ run, me, names, t, onBoard }: Props) {
  const pv = run.pvp!;
  const mine = pv.seats[me]!;
  const n = (k: TextKey, v: number) => t(k).replace("{n}", String(v));
  const live = pv.seats.map((_, i) => inPlay(run, i));
  const ffa = pv.mode === "brawl" || pv.mode === "gungame";
  const bo3 = PW_MODE[pv.mode].rounds > 1;
  let line = "";
  if (pv.mode === "gungame") {
    const top = Math.max(...pv.seats.map((x) => x.lv));
    line = `${t("pwLevel").replace("{lv}", String(mine.lv))} · ${t("pwTop").replace("{lv}", String(top))}`;
  } else if (pv.mode === "brawl") line = n("pwAlive", live.filter(Boolean).length);
  // 편 대결: 우리 편·상대 편 처치 합과 사람마다 점(살아 있음·기다림·쓰러짐)
  const side = (ours: boolean) => {
    const list = pv.seats.map((x, i) => ({ x, i })).filter(({ x }) => (x.team === mine.team) === ours);
    const kills = list.reduce((a, { x }) => a + x.kills, 0);
    const dots = list.map(({ x, i }) => <i key={i} className={live[i] ? "on" : !x.fell || x.back !== undefined ? "wait" : "out"} />);
    return (
      <div className={`pw-side ${ours ? "ours" : "theirs"}`}>
        <small>{t(ours ? "pwOurs" : "pwTheirs")}</small>
        <b>{kills}</b>
        <span className="pw-dots">{dots}</span>
      </div>
    );
  };
  const foe = pwNearestFoe(run, me);
  const who = (i: number) => `${seatWho(run, i, names, t)} · ${t(allPlayers(run)[i]!.characterId as TextKey)}`;
  return (
    <>
      <div className="pw-hud">
        {ffa ? (
          <div className="pw-score ffa">
            <strong>{t(PW_NAME[pv.mode])}</strong>
            <span>{line}</span>
          </div>
        ) : (
          <div className="pw-score">
            {side(true)}
            {/* 3판 2선승: 가운데에 이긴 판 수 */}
            <em className="pw-vs">{bo3 ? `${pv.wins?.[mine.team] ?? 0} : ${Object.entries(pv.wins ?? {}).reduce((a, [k, v]) => (Number(k) === mine.team ? a : a + v), 0)}` : "VS"}</em>
            {side(false)}
          </div>
        )}
        <PwClock run={run} t={t} />
        <div className="pw-sub">
          <span className="pw-kd">
            {mine.kills}K / {mine.deaths}D
          </span>{" "}
          · {t("pwDealt")} <b className="pw-dealt">{Math.round(mine.dealt ?? 0)}</b> · {t("pwTaken")} <b className="pw-taken">{Math.round(mine.taken ?? 0)}</b>
        </div>
        {foe >= 0 && <div className="pw-target">{t("pwTarget").replace("{who}", who(foe))}</div>}
        {!live[me] && mine.back === undefined && <div className="pw-watch">{t("pwWatching")}</div>}
        <button type="button" className="pw-board-btn" onClick={onBoard}>
          {t("pwBoard")} (Tab)
        </button>
      </div>
      <PwCapHud run={run} me={me} t={t} />
      <PwFeed run={run} me={me} who={(i) => seatWho(run, i, names, t)} t={t} />
      <PwCount run={run} me={me} goal={t(GOAL[pv.mode] ?? "pwGoalTeam")} t={t} />
    </>
  );
}

/** 남은 시간 (1분 아래면 붉게 깜빡) · 자기장 단계와 다음 줄어들기까지 초 */
function PwClock({ run, t }: { run: RunState; t: (k: TextKey) => string }) {
  if (run.pvp!.practice) return null;
  const sec = pvpTimeLeft(run);
  const z = pvpZone(run);
  const mm = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
  const start = run.pvp!.readyAt ?? PW.ready;
  const next = z ? 60 - (Math.max(0, Math.floor((run.tick - start) / TICK_RATE)) % 60) : 0;
  return (
    <div className={`pw-clock${sec <= 60 ? " low" : ""}`}>
      ⏱ {mm}
      {z && <small>{t("pwZone").replace("{n}", String(z.phase + 1)).replace("{s}", String(next))}</small>}
    </div>
  );
}

/** 판 준비: 화면 가운데 큰 3 · 2 · 1 → START! · 그 아래 목표 · 3판 2선승은 위에 몇 번째 판과 지난 판 결과 */
function PwCount({ run, me, goal, t }: { run: RunState; me: number; goal: string; t: (k: TextKey) => string }) {
  const pv = run.pvp!;
  const left = (pv.readyAt ?? PW.ready) - run.tick;
  // 판이 막 끝나 정리 전(경기장을 그대로 보여 주는 3초)에도 결과를 띄움
  const waiting = pv.resetAt !== undefined;
  if (left < -TICK_RATE && !waiting) return null;
  const n = Math.ceil(left / TICK_RATE);
  const text = left > 0 ? String(n) : "START!";
  const last = pv.lastRound;
  const mine = pv.seats[me]!.team;
  // 판이 막 끝나 다음 판 준비 전: 이긴 판·진 판
  const result = last && (waiting || left > PW.ready) ? t(last.team < 0 ? "pwRoundDraw" : last.team === mine ? "pwRoundWin" : "pwRoundLose") : "";
  return (
    <>
      {PW_MODE[pv.mode].rounds > 1 && (
        <div className="pw-round">
          {result || t("pwRound").replace("{n}", String(pv.round ?? 1))}
        </div>
      )}
      {!result && (
        <div key={text} className={`pw-count ${left > 0 ? "" : "go"}`}>
          {text}
        </div>
      )}
      {!result && <div className="pw-goal">{goal}</div>}
    </>
  );
}
