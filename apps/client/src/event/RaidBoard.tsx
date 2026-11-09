// 레이드 결과표 (패왕전 점수판처럼): 사람마다 캐릭터 · 준 피해(루시퍼 · 기둥·검·몬스터) · 가장 큰 한 방 · 받은 피해 · 회복 · 데스 (sim/raidStats)
// 판이 끝나면 결과 창 아래에 · 싸우는 중엔 Tab을 누르는 동안 (event/RaidOverlay)
import { allPlayers, type RunState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";

interface Props {
  run: RunState;
  /** 자리마다 이름 (같이 하기) · 없으면 0번은 나, 나머지 AI */
  names?: readonly string[];
  t: (k: TextKey) => string;
  float?: boolean;
}

export function RaidBoard({ run, names, t, float = false }: Props) {
  const players = allPlayers(run);
  const me = run.seat ?? 0;
  const rows = players.map((p, i) => ({ i, p, st: p.raidStat ?? { dealt: 0, boss: 0, adds: 0, taken: 0, healed: 0, max: 0 } }));
  rows.sort((a, b) => b.st.dealt - a.st.dealt || a.i - b.i);
  const top = (k: "dealt" | "taken" | "healed") => Math.max(1, ...rows.map((r) => r.st[k]));
  const total = Math.max(1, rows.reduce((a, r) => a + r.st.dealt, 0));
  const ai = run.raidBoss?.ai ?? [];
  return (
    <div className={`raid-board ${float ? "float" : ""}`}>
      <h3>{t("raidBoardTitle")}</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th />
            <th>{t("raidBoardDealt")}</th>
            <th>{t("raidBoardBoss")}</th>
            <th>{t("raidBoardAdds")}</th>
            <th>{t("raidBoardMax")}</th>
            <th>{t("raidBoardTaken")}</th>
            <th>{t("raidBoardHealed")}</th>
            <th>💀</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, k) => (
            <tr key={r.i} className={r.i === me ? "me" : ""}>
              <td>{k + 1}</td>
              <td>
                <b>{names?.[r.i] ?? (ai[r.i] ? "AI" : r.i === me ? t("raidBoardMe") : "?")}</b> <small>{t(r.p.characterId)}</small>
              </td>
              <td>
                <Bar v={r.st.dealt} max={top("dealt")} cls="dealt" />
                <small className="pct">{Math.round((r.st.dealt / total) * 100)}%</small>
              </td>
              <td>{num(r.st.boss)}</td>
              <td>{num(r.st.adds)}</td>
              <td>{num(r.st.max)}</td>
              <td>
                <Bar v={r.st.taken} max={top("taken")} cls="taken" />
              </td>
              <td>
                <Bar v={r.st.healed} max={top("healed")} cls="healed" />
              </td>
              <td>{r.p.raidDeaths ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const num = (v: number) => Math.round(v).toLocaleString();

function Bar({ v, max, cls }: { v: number; max: number; cls: string }) {
  return (
    <span className={`raid-bar ${cls}`}>
      <i style={{ width: `${Math.round((v / max) * 100)}%` }} />
      <b>{num(v)}</b>
    </span>
  );
}
