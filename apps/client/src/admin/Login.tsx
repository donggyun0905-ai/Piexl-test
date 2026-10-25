// 관리자 로그인: 디스코드 비공개 채널로 코드(8자)를 받아 입력 → 12시간 로그인
import { useState } from "react";
import { adminApi, errorText, type ServerInfo } from "./adminApi";

export function Login({ server, onDone }: { server: ServerInfo; onDone: () => void }) {
  const [pending, setPending] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const request = async () => {
    setBusy(true);
    setError("");
    const res = await adminApi.requestCode(server);
    if (res.ok && res.data) setPending(res.data.pending);
    else setError(errorText(res.error));
    setBusy(false);
  };

  const verify = async () => {
    setBusy(true);
    setError("");
    const res = await adminApi.verify(server, pending, code);
    setBusy(false);
    if (res.ok) onDone();
    else setError(errorText(res.error));
  };

  return (
    <div className="admin-login">
      <h2>{server.label} 로그인</h2>
      <p className="admin-hint">버튼을 누르면 디스코드 비공개 채널로 로그인 코드가 옵니다 (5분 안에 입력).</p>
      <button type="button" className={pending ? undefined : "primary"} disabled={busy} onClick={() => void request()}>
        {pending ? "코드 다시 받기" : "디스코드로 코드 받기"}
      </button>
      {pending && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void verify();
          }}
        >
          <input
            value={code}
            autoFocus
            autoCapitalize="characters"
            autoComplete="one-time-code"
            placeholder="디스코드에서 받은 8자"
            maxLength={12}
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit" className="primary" disabled={busy || code.replace(/[\s-]/g, "").length < 8}>
            로그인
          </button>
        </form>
      )}
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
}
