// 패왕전 점령전 위쪽 막대: 우리 편·상대 편 점령도 (100%면 승리) · 지금 구역에 누가 있는지
import { allPlayers, inCapZone, inPlay, PW_ARENAS, type RunState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";

export function PwCapHud({ run, me, t }: { run: RunState; me: number; t: (k: TextKey) => string }) {
  const pv = run.pvp!;
  const a = PW_ARENAS[pv.arena];
  if (!a.zone) return null;
  const mine = pv.seats[me]!.team;
  const prog = pv.cap?.prog ?? {};
  const ours = prog[mine] ?? 0;
  const theirs = prog[mine === 0 ? 1 : 0] ?? 0;
  const inside = new Set(allPlayers(run).flatMap((p, i) => (inPlay(run, i) && inCapZone(a, p.x, p.y) ? [pv.seats[i]!.team] : [])));
  const state = inside.size > 1 ? "pwCapContest" : inside.has(mine) ? "pwCapOurs" : inside.size ? "pwCapTheirs" : "pwCapEmpty";
  return (
    <div className="pw-cap">
      <div className="pw-cap-bar ours">
        <i style={{ width: `${ours}%` }} />
        <b>{Math.floor(ours)}%</b>
      </div>
      <small className={state}>{t(state as TextKey)}</small>
      <div className="pw-cap-bar theirs">
        <i style={{ width: `${theirs}%` }} />
        <b>{Math.floor(theirs)}%</b>
      </div>
    </div>
  );
}
