import { useEffect, useState } from "react";

export const SERVER_URL: string = import.meta.env.VITE_SERVER_URL ?? "";

export type ServerStatus = "checking" | "online" | "offline";

/** 타이틀에서 서버 연결 상태를 한 번만 확인 (요청 수 = 비용이라 반복하지 않음) */
export function useServerStatus(): ServerStatus {
  const [status, setStatus] = useState<ServerStatus>(SERVER_URL ? "checking" : "offline");
  useEffect(() => {
    if (!SERVER_URL) return;
    const ctrl = new AbortController();
    fetch(`${SERVER_URL}/health`, { signal: ctrl.signal })
      .then((res) => setStatus(res.ok ? "online" : "offline"))
      .catch(() => {
        if (!ctrl.signal.aborted) setStatus("offline");
      });
    return () => ctrl.abort();
  }, []);
  return status;
}
