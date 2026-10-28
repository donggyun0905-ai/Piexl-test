// 패왕전 관전: 내가 쓰러져 기다리는 동안 화면을 누르면 살아 있는 다른 사람(AI·사람)을 차례로 따라감 (camera.setWatchSeat)
import { allPlayers, inPlay, type RunState } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { setWatchSeat } from "../game/camera";
import type { TextKey } from "../i18n";
import { seatWho } from "./PwBoard";

interface Props {
  run: RunState;
  me: number;
  names?: readonly string[];
  /** 게임 중에 들어온 관전자 (처음부터 다른 사람을 봄) */
  watching?: boolean;
  t: (k: TextKey) => string;
}

export function PwWatch({ run, me, names, watching = false, t }: Props) {
  const pv = run.pvp!;
  const [pick, setPick] = useState<number>(-1);
  const out = !run.over && (watching || (!inPlay(run, me) && pv.seats[me]!.back === undefined));
  // 우리 편부터 · 살아 있는 사람만
  const mine = watching ? undefined : pv.seats[me]!.team;
  const live = pv.seats.map((_, i) => i).filter((i) => (watching || i !== me) && inPlay(run, i));
  live.sort((a, b) => Number(pv.seats[b]!.team === mine) - Number(pv.seats[a]!.team === mine) || a - b);
  const watch = out ? (live.includes(pick) ? pick : live[0]) : undefined;
  useEffect(() => setWatchSeat(watch), [watch]);
  useEffect(() => () => setWatchSeat(undefined), []);
  if (watch === undefined) return null;
  const next = () => setPick(live[(live.indexOf(watch) + 1) % live.length]!);
  const who = `${seatWho(run, watch, names, t)} · ${t(allPlayers(run)[watch]!.characterId as TextKey)}`;
  return (
    <div className="pw-watch-click" onClick={next}>
      <span>{t("pwWatchWho").replace("{who}", who)}</span>
    </div>
  );
}
