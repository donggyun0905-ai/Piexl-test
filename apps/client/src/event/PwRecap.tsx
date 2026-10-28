// 패왕전 받은 피해 정리 (내가 쓰러져 있는 동안): 받은 피해·준 피해·받은 회복 합 막대 · 때린 사람(지형 포함)마다 막대
// 자세히: 무엇으로 맞았는지(평타·스킬·소환·지속 피해) · 상대마다 준 피해 · 가장 아팠던 한 방 · 간단히: 막대만 (버튼으로 바꾸고 기억)
// 숫자는 판 계산(pvpRecap)이 적어 둔 것 (다시 나오거나 다음 판이면 지워짐)
import { allPlayers, inPlay, type RunState } from "@pixel-rogue/shared";
import { useState } from "react";
import type { TextKey } from "../i18n";
import { loadText, saveText } from "../storage";
import { skillName } from "./pwSkillText";

interface Props {
  run: RunState;
  me: number;
  who: (i: number) => string;
  t: (k: TextKey) => string;
}

const MINI_KEY = "pwRecapMini";
const r = Math.round;

function Bar({ label, n, of, cls, sub }: { label: React.ReactNode; n: number; of: number; cls: string; sub?: string }) {
  return (
    <li className={cls}>
      <div className="pw-recap-head">
        {label}
        <span>{r(n)}</span>
      </div>
      <i className="pw-recap-bar" style={{ width: `${(100 * n) / Math.max(1, of)}%` }} />
      {sub && <small className="pw-recap-src">{sub}</small>}
    </li>
  );
}

export function PwRecap({ run, me, who, t }: Props) {
  const [mini, setMini] = useState(() => loadText(MINI_KEY) === "1");
  const seat = run.pvp!.seats[me];
  const recv = seat?.recv ?? [];
  if (!seat || inPlay(run, me) || (!recv.length && !seat.gave?.length && !seat.healed)) return null;
  const players = allPlayers(run);
  const src = (by: number, k: number) => (k === 0 ? t("pwSkBasic") : k <= 4 ? skillName(players[by]!.characterId, k - 1, t) : t(k === 5 ? "pwRecapSummon" : k === 6 ? "pwRecapDot" : "pwRecapEnv"));
  const name = (i: number) => (i < 0 ? t("pwRecapEnv") : who(i));
  const team = seat.team;
  const cls = (i: number) => (i < 0 ? "env" : run.pvp!.seats[i]!.team === team ? "ours" : "theirs");
  // 때린 사람마다 묶음 (많이 준 사람부터)
  const people = [...new Set(recv.map((x) => x.by))]
    .map((by) => {
      const rows = recv.filter((x) => x.by === by).sort((a, b) => b.dmg - a.dmg);
      return { by, rows, total: rows.reduce((a, x) => a + x.dmg, 0) };
    })
    .sort((a, b) => b.total - a.total);
  const taken = people.reduce((a, p) => a + p.total, 0);
  const gave = [...(seat.gave ?? [])].sort((a, b) => b.dmg - a.dmg);
  const dealt = gave.reduce((a, g) => a + g.dmg, 0);
  const healed = seat.healed ?? 0;
  const top = Math.max(taken, dealt, healed);
  const big = recv.length ? recv.reduce((m, x) => (x.max > m.max ? x : m), recv[0]!) : null;
  const flip = () => {
    setMini(!mini);
    saveText(MINI_KEY, mini ? "0" : "1");
  };
  return (
    <div className={`pw-recap ${mini ? "mini" : ""}`}>
      <h4>
        {t("pwRecapTitle")}
        <button type="button" onClick={flip}>
          {t(mini ? "pwRecapMore" : "pwRecapLess")}
        </button>
      </h4>
      <ul className="pw-recap-sum">
        <Bar cls="taken" label={<b>{t("pwRecap")}</b>} n={taken} of={top} />
        <Bar cls="dealt" label={<b>{t("pwRecapDealt")}</b>} n={dealt} of={top} sub={mini ? undefined : gave.map((g) => `${who(g.to)} ${r(g.dmg)}`).join(" · ")} />
        <Bar cls="healed" label={<b>{t("pwRecapHealed")}</b>} n={healed} of={top} />
      </ul>
      {people.length > 0 && (
        <ul>
          {people.map((p) => (
            <Bar
              key={p.by}
              cls={cls(p.by)}
              label={
                <>
                  <b>{name(p.by)}</b>
                  {p.by >= 0 && <small>{t(players[p.by]!.characterId as TextKey)}</small>}
                </>
              }
              n={p.total}
              of={taken}
              sub={mini ? undefined : p.rows.map((x) => `${src(p.by, x.src)} ${r(x.dmg)}`).join(" · ")}
            />
          ))}
        </ul>
      )}
      {!mini && big && (
        <p className="pw-recap-big">
          {t("pwRecapBig")} <b className={cls(big.by)}>{name(big.by)}</b> · {src(big.by, big.src)} <b>{r(big.max)}</b>
        </p>
      )}
    </div>
  );
}
