// 협동 화면 왼쪽 위: 같이 하는 사람 체력 줄(쓰러짐·끊김·연결 지연) · 빠른 신호 버튼
import { allPlayers, isAlive, type RunState } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import type { TextKey } from "../i18n";
import { TdPortrait } from "../td/TdScreen";
import { seatColor, SIGNALS, type CoopExtras } from "./extras";

export interface Member {
  pid: string;
  name: string;
  connected: boolean;
}

interface Props {
  run: RunState;
  members: readonly Member[];
  extras: CoopExtras;
  t: (key: TextKey) => string;
  onSignal: (k: number) => void;
}

export function CoopParty({ run, members, extras, t, onSignal }: Props) {
  // 체력은 게임 상태에서 자주 읽어 옴 (게임 화면은 다시 그리지 않음)
  const [, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame((f) => f + 1), 200);
    return () => clearInterval(id);
  }, []);
  if (!run.party) return null;
  const me = run.seat ?? 0;
  return (
    <div className="coop-party">
      <ul>
        {allPlayers(run).map((p, i) => {
          const m = members[i];
          const ratio = Math.max(0, Math.min(1, p.hp / p.stats.maxHp));
          const ms = m ? extras.rtt.get(m.pid) : undefined;
          const tag = m && !m.connected ? t("coopOffline") : !isAlive(p) ? t("coopDownTag") : ms !== undefined ? `${Math.round(ms)}ms` : "";
          return (
            <li key={i} className={`${i === me ? "me" : ""} ${isAlive(p) ? "" : "down"}`} style={{ borderLeftColor: seatColor(i) }}>
              <TdPortrait id={p.characterId} size={22} />
              <span className="name">{m?.name ?? "?"}</span>
              <span className={`bar${ratio < 0.3 ? " low" : ""}`}>
                <span style={{ width: `${ratio * 100}%` }} />
                <b>{Math.ceil(Math.max(0, p.hp))}</b>
              </span>
              <span className={`tag ${ms !== undefined && ms > 200 ? "slow" : ""}`}>{tag}</span>
            </li>
          );
        })}
      </ul>
      <div className="coop-signals" title={t("coopSignals")}>
        {SIGNALS.map((key, k) => (
          <button key={key} type="button" className="small" onClick={() => onSignal(k)}>
            <kbd>{k + 3}</kbd> {t(key)}
          </button>
        ))}
      </div>
    </div>
  );
}

/** 결과 창: 사람별 처치·받은 피해 */
export function CoopStats({ run, members, t }: { run: RunState; members: readonly Member[]; t: (key: TextKey) => string }) {
  return (
    <table className="coop-stats">
      <thead>
        <tr>
          <th>{t("coopStatsTitle")}</th>
          <th>{t("coopKills")}</th>
          <th>{t("coopHurt")}</th>
        </tr>
      </thead>
      <tbody>
        {allPlayers(run).map((p, i) => (
          <tr key={i}>
            <td>
              <span className="dot" style={{ background: seatColor(i) }} /> {members[i]?.name ?? "?"}
            </td>
            <td>{p.kills ?? 0}</td>
            <td>{Math.round(p.hurt ?? 0)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
