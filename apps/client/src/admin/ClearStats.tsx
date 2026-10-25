// 관리자: 캐릭터별 클리어 시간 (유저들이 혼자 하기 6층을 처음 깨는 데 걸린 시간의 평균·가장 빠른 시간·횟수)
// 금기·무작위 시작 장비·무한·영웅의 길·아레나·서든데스 판은 들어가지 않음
import { useEffect, useState } from "react";
import { formatTime } from "../game/hudText";
import { TEXT } from "../i18n/text";
import { adminApi, errorText, type ClearRow, type ServerInfo } from "./adminApi";

export function ClearStats({ server }: { server: ServerInfo }) {
  const [rows, setRows] = useState<ClearRow[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    void adminApi.clears(server).then((res) => (res.ok ? setRows(res.data?.rows ?? []) : setError(errorText(res.error))));
  }, [server]);
  const name = (c: string) => (TEXT as Record<string, { ko: string } | undefined>)[c]?.ko ?? c;
  const avg = (r: ClearRow) => Math.round(r.total / Math.max(1, r.count));
  return (
    <section className="admin-clears">
      <h2>캐릭터별 클리어 시간</h2>
      <p className="admin-hint">유저들이 혼자 하기에서 6층을 처음 깰 때까지 걸린 시간입니다 (금기·무작위 시작 장비·무한·영웅의 길·아레나·서든데스 제외). 평균이 짧을수록 그 캐릭터로 빨리 깹니다.</p>
      {error && <p className="form-error">{error}</p>}
      {rows && rows.length === 0 && <p>아직 모인 기록이 없습니다.</p>}
      {rows && rows.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>캐릭터</th>
              <th>평균</th>
              <th>가장 빠름</th>
              <th>클리어 수</th>
            </tr>
          </thead>
          <tbody>
            {[...rows]
              .sort((a, b) => avg(a) - avg(b))
              .map((r) => (
                <tr key={r.character}>
                  <td>{name(r.character)}</td>
                  <td>
                    <strong>{formatTime(avg(r))}</strong>
                  </td>
                  <td>{formatTime(r.best)}</td>
                  <td>{r.count}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
