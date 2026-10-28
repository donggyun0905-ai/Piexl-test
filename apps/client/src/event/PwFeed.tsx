// 패왕전 처치 알림: 오른쪽 위 처치 기록(누가 누구를) · 내가 처치하면 가운데 큰 글자(연속 처치는 더 크게) · 내가 쓰러지면 안내(데스매치는 다시 나오기까지 초)
// 점수(처치·데스)가 늘어난 자리를 지난번과 비교해 찾음 (화면 전용)
import { TICK_RATE, type RunState } from "@pixel-rogue/shared";
import { useState } from "react";
import type { TextKey } from "../i18n";

interface Props {
  run: RunState;
  me: number;
  who: (i: number) => string;
  t: (k: TextKey) => string;
}

interface Entry {
  /** 처치한 자리 (함정 등으로 쓰러지면 없음) */
  k?: number;
  v: number;
  at: number;
}

type Seats = NonNullable<RunState["pvp"]>["seats"];

/** 게임 틱으로 잼 (일시정지하면 같이 멈춤) */
const FEED_MS = 6 * TICK_RATE;
const BANNER_MS = 2 * TICK_RATE;
const STREAK_MS = 5 * TICK_RATE;
const STREAK: readonly TextKey[] = ["pwKillBig", "pwKill2", "pwKill3", "pwKill4"];

/** 지난번 점수와 비교해 처치 기록·연속 처치·쓰러짐을 모음 */
function makeTracker(seats: Seats) {
  const st = { kills: seats.map((x) => x.kills), deaths: seats.map((x) => x.deaths), feed: [] as Entry[], killAt: 0, streak: 0, downAt: 0 };
  return {
    st,
    update(list: Seats, me: number, now: number) {
      // 늘어난 처치·데스 짝 맞추기
      const killers: number[] = [];
      list.forEach((x, i) => {
        for (let d = x.kills - (st.kills[i] ?? 0); d > 0; d--) killers.push(i);
      });
      list.forEach((x, i) => {
        for (let d = x.deaths - (st.deaths[i] ?? 0); d > 0; d--) {
          const k = killers.shift();
          st.feed.push(k === undefined ? { v: i, at: now } : { k, v: i, at: now });
          if (i === me) st.downAt = now;
        }
      });
      const gain = list[me]!.kills - (st.kills[me] ?? 0);
      if (gain > 0) {
        st.streak = now - st.killAt < STREAK_MS ? st.streak + gain : gain;
        st.killAt = now;
      }
      st.kills = list.map((x) => x.kills);
      st.deaths = list.map((x) => x.deaths);
      st.feed = st.feed.filter((e) => now - e.at < FEED_MS).slice(-5);
    },
  };
}

export function PwFeed({ run, me, who, t }: Props) {
  const seats = run.pvp!.seats;
  const [tracker] = useState(() => makeTracker(seats));
  const now = run.tick;
  tracker.update(seats, me, now);
  const st = tracker.st;
  const team = seats[me]!.team;
  const cls = (i: number) => (i === me ? "me" : seats[i]!.team === team ? "ours" : "theirs");
  const killShown = st.killAt > 0 && now - st.killAt < BANNER_MS;
  const back = seats[me]!.back;
  const downShown = !killShown && st.downAt > 0 && (now - st.downAt < BANNER_MS * 1.5 || (back !== undefined && back > run.tick));
  const wait = back !== undefined ? Math.ceil((back - run.tick) / TICK_RATE) : 0;
  return (
    <>
      {st.feed.length > 0 && (
        <ul className="pw-feed">
          {st.feed.map((e) => (
            <li key={`${e.at}-${e.v}`}>
              {e.k !== undefined && <b className={cls(e.k)}>{who(e.k)}</b>}
              <span className="pw-x">{e.k !== undefined ? "⚔" : "✕"}</span>
              <b className={cls(e.v)}>{who(e.v)}</b>
            </li>
          ))}
        </ul>
      )}
      {killShown && (
        <div key={st.killAt} className={`pw-banner kill s${Math.min(st.streak, STREAK.length)}`}>
          {t(STREAK[Math.min(st.streak, STREAK.length) - 1]!)}
        </div>
      )}
      {downShown && (
        <div className="pw-banner down">
          {t("pwDown")}
          {wait > 0 && <small>{t("pwBackIn").replace("{n}", String(wait))}</small>}
        </div>
      )}
    </>
  );
}
