// 패왕전 위쪽 정보 (한 줄): 편 대결 점수(편 처치 수·남은 사람 점) 또는 대난투·데스매치 줄 · 내 처치/데스·준 피해·받은 피해 · 가까운 적 · 목표는 시작 카운트다운 때만 · 지켜보는 중 안내 · 점수판 버튼(Tab) · 처치 알림(PwFeed)
import { allPlayers, inPlay, PW, TICK_RATE, type RunState } from "@pixel-rogue/shared";
import { pwNearestFoe } from "../game/render/pwLook";
import type { TextKey } from "../i18n";
import { seatWho } from "./PwBoard";
import { PwFeed } from "./PwFeed";
import { PW_NAME } from "./PwModes";

interface Props {
  run: RunState;
  me: number;
  names?: readonly string[];
  t: (k: TextKey) => string;
  onBoard: () => void;
}

const GOAL: Record<string, TextKey> = { tourney: "pwGoalTourney", brawl: "pwGoalBrawl", gungame: "pwGoalGun" };

export function PwHud({ run, me, names, t, onBoard }: Props) {
  const pv = run.pvp!;
  const mine = pv.seats[me]!;
  const n = (k: TextKey, v: number) => t(k).replace("{n}", String(v));
  const live = pv.seats.map((_, i) => inPlay(run, i));
  const ffa = pv.mode === "brawl" || pv.mode === "gungame";
  let line = "";
  if (pv.mode === "gungame") {
    const top = Math.max(...pv.seats.map((x) => x.lv));
    line = `${t("pwLevel").replace("{lv}", String(mine.lv))} · ${t("pwTop").replace("{lv}", String(top))}`;
  } else if (pv.mode === "brawl") line = n("pwAlive", live.filter(Boolean).length);
  // 편 대결: 우리 편·상대 편 처치 합과 사람마다 점(살아 있음·기다림·쓰러짐)
  const side = (ours: boolean) => {
    const list = pv.seats.map((x, i) => ({ x, i })).filter(({ x }) => (x.team === mine.team) === ours);
    const kills = list.reduce((a, { x }) => a + x.kills, 0);
    const dots = list.map(({ x, i }) => <i key={i} className={live[i] ? "on" : x.deaths === 0 || x.back !== undefined ? "wait" : "out"} />);
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
            <em className="pw-vs">VS</em>
            {side(false)}
          </div>
        )}
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
      <PwFeed run={run} me={me} who={(i) => seatWho(run, i, names, t)} t={t} />
      <PwCount tick={run.tick} goal={t(GOAL[pv.mode] ?? "pwGoalTeam")} />
    </>
  );
}

/** 시작 준비: 화면 가운데 큰 3 · 2 · 1 → START! · 그 아래 이번 대결 목표 */
function PwCount({ tick, goal }: { tick: number; goal: string }) {
  const left = PW.ready - tick;
  if (left < -TICK_RATE) return null;
  const n = Math.ceil(left / TICK_RATE);
  const text = left > 0 ? String(n) : "START!";
  return (
    <>
      <div key={text} className={`pw-count ${left > 0 ? "" : "go"}`}>
        {text}
      </div>
      <div className="pw-goal">{goal}</div>
    </>
  );
}
