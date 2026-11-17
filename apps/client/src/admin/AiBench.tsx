// 관리자 AI 측정 (밸런스용): 봇이 캐릭터마다(히든 제외) 혼자 하기 1~6층 → 최종보스(아스모데우스의 화신체 고정)를 돌고 평가표를 냄
// 브라우저에서만 계산 (서버·기록·순위 없음) · 저장된 서버 수치로 돎 · 결과는 이 브라우저에 남김 · 봇 bench/benchBot · 한 판 bench/benchRun · 평균·점수 bench/benchScore
import { CHARACTER_IDS, type CharacterId } from "@pixel-rogue/shared";
import { useEffect, useMemo, useRef, useState } from "react";
import { benchBalance } from "../balance";
import { TEXT } from "../i18n/text";
import { AdminThumb } from "./AdminThumb";
import { startBench, type BenchRow } from "./bench/benchRun";
import { averageRows, dps, mmss, toTsv, type BenchAvg } from "./bench/benchScore";

const SAVE_KEY = "pixel-rogue:adminBench";
/** 판마다 쓰는 시드 (모든 캐릭터가 같은 지도에서 돎) */
const SEEDS = [10007, 20011, 30013, 40031, 50021];
const name = (c: string) => (TEXT as Record<string, { ko: string } | undefined>)[c]?.ko ?? c;

function loadRows(): BenchRow[] {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY) ?? "[]") as BenchRow[];
  } catch {
    return [];
  }
}

/** 표 칸: 제목 · 값 · 정렬 값 */
const COLS: readonly [string, (r: BenchAvg) => string, (r: BenchAvg) => number][] = [
  ["등급", (r) => `${r.grade} ${r.score}`, (r) => -r.score],
  ["클리어 시간", (r) => (r.cleared ? mmss(r.clearTicks) : `${Math.floor(r.floor)}층에서 멈춤`), (r) => (r.cleared ? r.clearTicks : 1e9 - r.floor)],
  ["쓰러짐", (r) => r.deaths.toFixed(1), (r) => r.deaths],
  ["준 피해", (r) => Math.round(r.dealt).toLocaleString(), (r) => -r.dealt],
  ["초당 피해", (r) => dps(r).toFixed(1), (r) => -dps(r)],
  ["받은 피해", (r) => Math.round(r.taken).toLocaleString(), (r) => r.taken],
  ["회복", (r) => Math.round(r.healed).toLocaleString(), (r) => -r.healed],
  ["넘긴 방", (r) => r.skips.toFixed(1), (r) => r.skips],
  ["보스 잡은 시간", (r) => (r.bossWins ? mmss(r.bossTicks) : r.cleared ? `${Math.round(r.bossPct)}%까지` : "-"), (r) => (r.bossWins ? r.bossTicks : 1e9 - r.bossPct)],
  ["보스 쓰러짐", (r) => (r.cleared ? r.bossDeaths.toFixed(1) : "-"), (r) => (r.cleared ? r.bossDeaths : 1e9)],
  ["보스 받은 피해", (r) => (r.cleared ? Math.round(r.bossTaken).toLocaleString() : "-"), (r) => r.bossTaken],
];

export function AiBench() {
  const [rows, setRows] = useState<BenchRow[]>(loadRows);
  const [picked, setPicked] = useState<Set<CharacterId>>(() => new Set(CHARACTER_IDS));
  const [runs, setRuns] = useState(1);
  /** 돌리는 중: 끝낸 판 수 · 모든 판 수 · 지금 캐릭터 · 남은 시간 어림(분) */
  const [prog, setProg] = useState<{ done: number; all: number; now: string; left: number | null } | null>(null);
  const [sort, setSort] = useState(0);
  const [copied, setCopied] = useState(false);
  const stop = useRef(false);
  useEffect(() => () => void (stop.current = true), []);
  const table = useMemo(() => averageRows(rows).sort((a, b) => COLS[sort]![2](a) - COLS[sort]![2](b)), [rows, sort]);

  const start = async () => {
    const jobs = SEEDS.slice(0, runs).flatMap((seed) => CHARACTER_IDS.filter((c) => picked.has(c)).map((c) => [c, seed] as const));
    if (!jobs.length) return;
    stop.current = false;
    const t0 = Date.now();
    setProg({ done: 0, all: jobs.length, now: name(jobs[0]![0]), left: null });
    // 저장된 서버 수치로 (못 받으면 코드 기본 수치)
    const end = await benchBalance();
    const out: BenchRow[] = rows.filter((r) => !picked.has(r.character));
    for (let i = 0; i < jobs.length && !stop.current; i++) {
      const [c, seed] = jobs[i]!;
      setProg({ done: i, all: jobs.length, now: name(c), left: i > 0 ? Math.round((((Date.now() - t0) / i) * (jobs.length - i)) / 60000) : null });
      const job = startBench(c, seed);
      // 화면이 멈추지 않게 조금씩 돌림
      while (!stop.current && !job.step(40)) await new Promise((r) => setTimeout(r, 0));
      if (stop.current) break;
      out.push(job.row);
      setRows([...out]);
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(out));
      } catch {
        // 저장이 막힌 브라우저면 화면에만
      }
    }
    end();
    setProg(null);
  };

  return (
    <section className="admin-bench">
      <h2>AI 측정 (캐릭터 밸런스)</h2>
      <p className="admin-hint">
        봇이 캐릭터마다 혼자 하기 1~6층을 돌고(쓰러지면 바로 되살아나고 횟수만 셈), 깨면 최종보스 <b>아스모데우스의 화신체</b>와 싸웁니다(여기서도 쓰러지면 되살아남 → 잡을 때까지 걸린 시간). 히든 캐릭터는 빠져 있습니다. 모든 캐릭터가 같은 시드(같은
        지도)에서 돌고, 지금 서버에 저장된 수치를 씁니다. 캐릭터 하나에 2~15초쯤 걸리며(전체 약 10분), 이 탭을 열어 둔 동안만 진행됩니다. 로그는 60분, 보스는 20분 안에 못 끝내면 거기서 멈춥니다. 봇은 사람보다 못하고 모아 쏘기·자세 바꾸기 같은 캐릭터 고유 조작은 잘 못 쓰므로, 숫자는 캐릭터끼리 견주는 데만 쓰세요 (초당 피해가 유난히 낮으면 봇이 그 캐릭터를 못 다루는 것).
      </p>
      <div className="admin-bench-bar">
        <label>
          캐릭터마다{" "}
          <select value={runs} disabled={!!prog} onChange={(e) => setRuns(Number(e.target.value))}>
            {[1, 2, 3, 5].map((n) => (
              <option key={n} value={n}>
                {n}판
              </option>
            ))}
          </select>
        </label>
        {prog ? (
          <button type="button" onClick={() => void (stop.current = true)}>
            멈춤
          </button>
        ) : (
          <button type="button" className="primary" onClick={() => void start()}>
            ▶ 고른 {picked.size}명 측정 시작
          </button>
        )}
        <button type="button" disabled={!table.length} onClick={() => void navigator.clipboard.writeText(toTsv(table, name)).then(() => setCopied(true))}>
          {copied ? "복사됨 (시트에 붙여넣기)" : "표 복사"}
        </button>
        <button type="button" disabled={!!prog || !rows.length} onClick={() => (setRows([]), localStorage.removeItem(SAVE_KEY))}>
          결과 지우기
        </button>
        {prog && (
          <span className="admin-bench-prog">
            {prog.done}/{prog.all} · 지금 {prog.now}
            {prog.left !== null && ` · 약 ${prog.left}분 남음`}
            <progress value={prog.done} max={prog.all} />
          </span>
        )}
      </div>
      <details className="admin-bench-pick">
        <summary>측정할 캐릭터 고르기 ({picked.size}/{CHARACTER_IDS.length})</summary>
        <p>
          <button type="button" disabled={!!prog} onClick={() => setPicked(new Set(CHARACTER_IDS))}>
            모두
          </button>{" "}
          <button type="button" disabled={!!prog} onClick={() => setPicked(new Set())}>
            모두 빼기
          </button>
        </p>
        <div className="admin-bench-chars">
          {CHARACTER_IDS.map((c) => (
            <label key={c}>
              <input
                type="checkbox"
                checked={picked.has(c)}
                disabled={!!prog}
                onChange={() => {
                  const next = new Set(picked);
                  if (!next.delete(c)) next.add(c);
                  setPicked(next);
                }}
              />
              {name(c)}
            </label>
          ))}
        </div>
      </details>
      {table.length === 0 ? (
        <p>아직 측정한 결과가 없습니다.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>캐릭터</th>
              {COLS.map(([title], i) => (
                <th key={title} className={sort === i ? "sorted" : undefined} onClick={() => setSort(i)}>
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((r, i) => (
              <tr key={r.character} className={`grade-${r.grade}`}>
                <td>{i + 1}</td>
                <td>
                  <AdminThumb group="characters" id={r.character} size={28} />
                  {name(r.character)}
                  {r.runs > 1 && <small> ×{r.runs}</small>}
                </td>
                {COLS.map(([title, text]) => (
                  <td key={title}>{text(r)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="admin-hint">
        제목을 누르면 그 칸으로 줄을 세웁니다. 등급은 종합 점수(로그 클리어 시간 35 · 쓰러짐 15 · 보스 잡은 시간 35 · 보스 쓰러짐 15, 가장 빠른 캐릭터 기준)로 S 85 · A 70 · B 55 · C 40 · D. &apos;넘긴 방&apos;은 봇이 막혀서(45초 동안 피해를 못 줌 · 15초 동안 할 일이
        없음) 건너뛴 방 수라, 많으면 그 캐릭터 결과는 덜 믿을 만합니다.
      </p>
    </section>
  );
}
