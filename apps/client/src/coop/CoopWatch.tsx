// 협동 관전: 내가 쓰러져 있는 동안(또는 게임 중에 들어온 관전자) 살아 있는 동료의 화면을 그대로 봄
// 카메라·체력·장비 줄·빌드 세트·능력치가 모두 그 사람 것 (camera.setWatchSeat → lockstep.showPredicted가 그 자리를 꺼내 놓음) · 누르면 다음 사람
import { allPlayers, isAlive, type RunState } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { setWatchSeat } from "../game/camera";
import type { TextKey } from "../i18n";

interface Props {
  run: RunState;
  me: number;
  names: readonly string[];
  watching: boolean;
  t: (k: TextKey) => string;
}

export function CoopWatch({ run, me, names, watching, t }: Props) {
  const [pick, setPick] = useState(-1);
  const players = allPlayers(run);
  const out = !run.over && (watching || !isAlive(players[me]!));
  const live = players.map((_, i) => i).filter((i) => (watching || i !== me) && isAlive(players[i]!));
  const watch = out ? (live.includes(pick) ? pick : live[0]) : undefined;
  useEffect(() => setWatchSeat(watch), [watch]);
  useEffect(() => () => setWatchSeat(undefined), []);
  if (watch === undefined) return null;
  const next = () => setPick(live[(live.indexOf(watch) + 1) % live.length]!);
  const who = `${names[watch] ?? "AI"} · ${t(players[watch]!.characterId as TextKey)}`;
  return (
    <div className="pw-watch-click" onClick={next}>
      <span>{t("pwWatchWho").replace("{who}", who)}</span>
    </div>
  );
}
