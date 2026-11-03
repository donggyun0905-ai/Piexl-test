// 다른 서버의 지금 수치를 그대로 가져오기 (예: 시험 서버 → 라이브). 가져오면 저장 안 한 값으로 들어오고, 아래 저장 줄에서 확인 후 저장
import type { BalanceValues } from "@pixel-rogue/shared";
import { useState } from "react";
import { adminApi, errorText, SERVERS, type ServerInfo, type SetKind } from "./adminApi";

interface Props {
  server: ServerInfo;
  kind: SetKind;
  onLoad: (values: BalanceValues, from: string) => void;
}

export function ImportRow({ server, kind, onLoad }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // 지금 서버와 예전 계정의 디벨롭 서버는 빼고
  const others = SERVERS.filter((s) => s.url !== server.url && s.id !== "beta");
  if (others.length === 0) return null;
  const load = async (s: ServerInfo) => {
    setBusy(true);
    setError("");
    const res = await adminApi.publicBalance(s, kind);
    setBusy(false);
    if (res.ok && res.data) onLoad(res.data.values, s.label);
    else setError(errorText(res.error));
  };
  return (
    <p className="admin-hint admin-import">
      다른 서버 수치 그대로 가져오기:{" "}
      {others.map((s) => (
        <button key={s.id} type="button" disabled={busy} onClick={() => void load(s)}>
          {s.label}
        </button>
      ))}
      {error && <span className="admin-error"> {error}</span>}
    </p>
  );
}
