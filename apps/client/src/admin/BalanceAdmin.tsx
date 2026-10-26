// 수치 세트 하나(던전 또는 타워 디펜스)의 관리 화면: 묶음 탭 · 수치 표 · 바꾼 기록 · 오른쪽 연습장 · 저장 줄
import { type BalanceValues } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { adminApi, errorText, logout, type BalanceRes, type ServerInfo, type SetKind } from "./adminApi";
import { BalanceEditor } from "./BalanceEditor";
import { HistoryView } from "./HistoryView";
import { GROUP_LABEL, SETS } from "./labels";
import { PracticePreview } from "./PracticePreview";
import { StatusView } from "./StatusView";
import { TdPreview } from "./TdPreview";

interface Props {
  server: ServerInfo;
  kind: SetKind;
  /** 로그인이 끝났을 때 (다시 로그인 화면으로) */
  onLoggedOut: () => void;
}

export function BalanceAdmin({ server, kind, onLoggedOut }: Props) {
  const set = SETS[kind];
  const [saved, setSaved] = useState<BalanceRes | null>(null);
  const [draft, setDraft] = useState<BalanceValues>({});
  const [tab, setTab] = useState<string>(set.groups[0]!.id);
  const [note, setNote] = useState("");
  /** 오른쪽 연습장 */
  const [practice, setPractice] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    let alive = true;
    void adminApi.balance(server, kind).then((res) => {
      if (!alive) return;
      if (res.ok && res.data) {
        setSaved(res.data);
        setDraft(res.data.values);
      } else if (res.error === "login") {
        logout(server);
        onLoggedOut();
      } else setMessage({ ok: false, text: errorText(res.error) });
    });
    return () => {
      alive = false;
    };
  }, [server, kind, onLoggedOut]);

  const changes = saved ? set.balanceDiff(saved.values, draft) : [];

  const save = async (values: BalanceValues, memo: string) => {
    setBusy(true);
    const res = await adminApi.save(server, kind, values, memo);
    setBusy(false);
    if (res.ok && res.data) {
      setSaved(res.data);
      setDraft(res.data.values);
      setNote("");
      setMessage({ ok: true, text: `저장했습니다. 새로 시작하는 판부터 적용됩니다 (지문 ${res.data.hash}).` });
    } else {
      if (res.error === "login") {
        logout(server);
        onLoggedOut();
      }
      setMessage({ ok: false, text: errorText(res.error) });
    }
  };

  const edit = (group: string, id: string, key: string, value: number | undefined) => {
    const next: BalanceValues = JSON.parse(JSON.stringify(draft));
    const row = ((next[group] ??= {})[id] ??= {});
    if (value === undefined) delete row[key];
    else row[key] = value;
    setDraft(set.cleanBalance(next));
  };

  // 저장 안 한 값이 있으면 페이지를 닫을 때 묻기
  useEffect(() => {
    if (changes.length === 0) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [changes.length]);

  if (!saved) return message ? <p className="admin-error">{message.text}</p> : <p className="admin-hint">불러오는 중…</p>;
  const group = set.groups.find((g) => g.id === tab);
  return (
    <>
      {message && <p className={message.ok ? "admin-ok" : "admin-error"}>{message.text}</p>}
      <nav className="admin-tabs">
        {set.groups.map((g) => (
          <button key={g.id} type="button" className={tab === g.id ? "active" : undefined} onClick={() => setTab(g.id)}>
            {GROUP_LABEL[g.id]}
          </button>
        ))}
        {kind === "dungeon" && (
          <button type="button" className={tab === "status" ? "active" : undefined} onClick={() => setTab("status")}>
            상태이상
          </button>
        )}
        <button type="button" className={tab === "history" ? "active" : undefined} onClick={() => setTab("history")}>
          바꾼 기록
        </button>
        <button type="button" className={practice ? "active admin-practice-toggle" : "admin-practice-toggle"} onClick={() => setPractice(!practice)}>
          {practice ? "연습장 닫기" : "연습장 열기"}
        </button>
      </nav>

      <div className={practice ? "admin-body with-practice" : "admin-body"}>
        <div className="admin-main">
          {group && (
            <>
              <p className="admin-hint">
                노란 칸 = 처음 값과 다름 · 테두리 칸 = 아직 저장 안 함 · ↺ = 처음 값으로. 칸에 마우스를 올리면 처음 값·범위가 보입니다.
              </p>
              <BalanceEditor set={set} group={group} draft={draft} saved={saved.values} onChange={(id, key, v) => edit(group.id, id, key, v)} />
            </>
          )}
          {tab === "status" && <StatusView set={set} draft={draft} saved={saved.values} onChange={edit} />}
          {tab === "history" && <HistoryView server={server} kind={kind} current={saved.hash} busy={busy} onApply={(v, n) => void save(v, n)} />}
        </div>
        {practice && (kind === "td" ? <TdPreview draft={draft} /> : <PracticePreview draft={draft} />)}
      </div>

      {changes.length > 0 && (
        <div className="admin-savebar">
          <span>저장 안 한 값 {changes.length}개</span>
          <input value={note} maxLength={80} placeholder="메모 (예: 보스 체력 낮춤)" onChange={(e) => setNote(e.target.value)} />
          <button type="button" disabled={busy} onClick={() => setDraft(saved.values)}>
            취소
          </button>
          <button type="button" className="primary" disabled={busy} onClick={() => void save(draft, note)}>
            {server.label}에 저장
          </button>
        </div>
      )}
    </>
  );
}
