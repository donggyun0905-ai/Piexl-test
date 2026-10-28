// 패왕전 받은 피해 정리 (내가 쓰러져 있는 동안): 때린 사람마다 합 · 무엇으로(평타·스킬·소환·지속 피해) · 가장 아팠던 한 방
// 숫자는 판 계산(pvpRecap)이 적어 둔 것 (다시 나오거나 다음 판이면 지워짐)
import { allPlayers, inPlay, type RunState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import { skillName } from "./pwSkillText";

interface Props {
  run: RunState;
  me: number;
  who: (i: number) => string;
  t: (k: TextKey) => string;
}

export function PwRecap({ run, me, who, t }: Props) {
  const recv = run.pvp!.seats[me]?.recv;
  if (inPlay(run, me) || !recv?.length) return null;
  const players = allPlayers(run);
  const src = (by: number, k: number) => (k === 0 ? t("pwSkBasic") : k <= 4 ? skillName(players[by]!.characterId, k - 1, t) : t(k === 5 ? "pwRecapSummon" : "pwRecapDot"));
  // 때린 사람마다 묶음 (많이 준 사람부터)
  const people = [...new Set(recv.map((r) => r.by))]
    .map((by) => {
      const rows = recv.filter((r) => r.by === by).sort((a, b) => b.dmg - a.dmg);
      return { by, rows, total: rows.reduce((a, r) => a + r.dmg, 0) };
    })
    .sort((a, b) => b.total - a.total);
  const all = people.reduce((a, p) => a + p.total, 0);
  const big = recv.reduce((m, r) => (r.max > m.max ? r : m), recv[0]!);
  const team = run.pvp!.seats[me]!.team;
  const cls = (i: number) => (run.pvp!.seats[i]!.team === team ? "ours" : "theirs");
  return (
    <div className="pw-recap">
      <h4>
        {t("pwRecap")} <b>{Math.round(all)}</b>
      </h4>
      <ul>
        {people.map((p) => (
          <li key={p.by}>
            <div className="pw-recap-head">
              <b className={cls(p.by)}>{who(p.by)}</b>
              <small>{t(players[p.by]!.characterId as TextKey)}</small>
              <span>{Math.round(p.total)}</span>
            </div>
            <i className="pw-recap-bar" style={{ width: `${(100 * p.total) / all}%` }} />
            <small className="pw-recap-src">{p.rows.map((r) => `${src(p.by, r.src)} ${Math.round(r.dmg)}`).join(" · ")}</small>
          </li>
        ))}
      </ul>
      <p className="pw-recap-big">
        {t("pwRecapBig")} <b className={cls(big.by)}>{who(big.by)}</b> · {src(big.by, big.src)} <b>{Math.round(big.max)}</b>
      </p>
    </div>
  );
}
