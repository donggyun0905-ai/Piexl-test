// 관리자 '티어 플레잉': 티어표(얼굴을 끌어 단계에 놓기 · 아래 '아직 안 놓음'에서 끌어 올리기) → 저장하면 아카이브 티어표가 이 표로
// ▶ 플레이하기: 게임 화면(/?tierplay)에서 캐릭터를 차례로 한 판씩 · 그 기록(클리어 시간·점수·쓰러진 횟수·별점·보스·비고)을 아래 표에서 봄
import { CHARACTER_IDS, type CharacterId } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { TEXT } from "../i18n/text";
import { enemyName } from "../i18n/enemies";
import { TIERS } from "../archive/tierData";
import { clock, defaultTiers, loadRecords, readTiers, STAR_FIELDS, type TierRecord, type TierRow } from "../tierplay/tierPlayData";
import { Stars } from "../tierplay/TierRate";
import { adminApi, type ServerInfo } from "./adminApi";
import { AdminThumb } from "./AdminThumb";

const ko = (k: string) => (TEXT as Record<string, { ko: string } | undefined>)[k]?.ko ?? k;
const TIER_TEXT: Record<string, string> = { god: "tierGod", meal: "tierMeal", mid: "tierMid", meh: "tierMeh", trash: "tierTrash" };

export function TierAdmin({ server }: { server: ServerInfo }) {
  const [rows, setRows] = useState<TierRow[]>(defaultTiers);
  const [records, setRecords] = useState<TierRecord[]>([]);
  const [msg, setMsg] = useState("");
  const [drag, setDrag] = useState<CharacterId | null>(null);

  useEffect(() => {
    void adminApi.tierPublic(server).then((r) => {
      const got = r.ok ? readTiers(r.data?.tiers) : null;
      if (got) setRows(got);
    });
    void loadRecords().then(setRecords);
  }, [server]);

  const placed = new Set(rows.flatMap((r) => r.chars));
  const pool = CHARACTER_IDS.filter((c) => !placed.has(c));

  /** 끌어 놓기: 단계 tier의 before 앞에 (before 없으면 맨 뒤) · tier가 null이면 '아직 안 놓음'으로 */
  const drop = (tier: string | null, before?: CharacterId) => {
    if (!drag || drag === before) return;
    setRows((rs) =>
      rs.map((r) => {
        const chars = r.chars.filter((c) => c !== drag);
        if (r.id !== tier) return { ...r, chars };
        const at = before ? chars.indexOf(before) : -1;
        chars.splice(at < 0 ? chars.length : at, 0, drag);
        return { ...r, chars };
      }),
    );
    setDrag(null);
    setMsg("");
  };

  const save = async () => {
    const res = await adminApi.tierSave(server, rows);
    setMsg(res.ok ? "저장했어요. 아카이브 티어표가 이 표로 바뀝니다 (30초쯤 뒤)." : `저장 실패: ${res.error}`);
  };

  const face = (c: CharacterId) => (
    <span
      key={c}
      className="tier-face"
      draggable
      onDragStart={() => setDrag(c)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.stopPropagation();
        drop(rows.find((r) => r.chars.includes(c))?.id ?? null, c);
      }}
      title={ko(c)}
    >
      <AdminThumb group="characters" id={c} size={40} />
      <small>{ko(c)}</small>
    </span>
  );

  const byChar = new Map(records.map((r) => [r.character, r]));
  return (
    <div className="tier-admin">
      <div className="tier-admin-top">
        <a className="tier-play-btn" href={`${import.meta.env.BASE_URL}?tierplay`} target="_blank" rel="noreferrer">
          ▶ 플레이하기 (캐릭터 차례로 한 판씩)
        </a>
        <button type="button" onClick={() => (setRows(defaultTiers()), setMsg("기본 표로 되돌렸어요 (아직 저장 전)"))}>
          기본 표로
        </button>
        <button type="button" className="primary" onClick={() => void save()}>
          티어표 저장 (아카이브에 반영)
        </button>
        {msg && <span className="tier-msg">{msg}</span>}
      </div>
      {rows.map((r) => (
        <div key={r.id} className="tier-admin-row" onDragOver={(e) => e.preventDefault()} onDrop={() => drop(r.id)}>
          <b style={{ background: TIERS.find((x) => x.id === r.id)?.color }}>{ko(TIER_TEXT[r.id]!)}</b>
          <div className="tier-admin-faces">{r.chars.map(face)}</div>
        </div>
      ))}
      <div className="tier-admin-row pool" onDragOver={(e) => e.preventDefault()} onDrop={() => drop(null)}>
        <b>아직 안 놓음 (끌어서 위로)</b>
        <div className="tier-admin-faces">{pool.map(face)}</div>
      </div>

      <h3>
        플레이 기록 ({records.length} / {CHARACTER_IDS.length})
      </h3>
      <div className="admin-table-wrap">
        <table className="tier-records">
          <thead>
            <tr>
              <th>캐릭터</th>
              <th>클리어 시간</th>
              <th>점수</th>
              <th>쓰러짐</th>
              {STAR_FIELDS.map(([k, label]) => (
                <th key={k}>{label}</th>
              ))}
              <th>라스트 보스 · 깎은 체력</th>
              <th>비고</th>
              <th>보스 비고</th>
            </tr>
          </thead>
          <tbody>
            {CHARACTER_IDS.map((c) => {
              const r = byChar.get(c);
              return (
                <tr key={c} className={r ? "" : "empty"}>
                  <td>{ko(c)}</td>
                  <td>{r ? clock(r.clearTicks) : "-"}</td>
                  <td>{r ? r.score.toLocaleString() : "-"}</td>
                  <td>{r ? r.deaths : "-"}</td>
                  {STAR_FIELDS.map(([k]) => (
                    <td key={k}>{r ? <Stars value={r[k]} /> : "-"}</td>
                  ))}
                  <td>{r ? `${r.boss ? enemyName(r.boss, "ko") : "-"} · ${r.bossCleared ? "클리어" : `${r.bossPct}%`}` : "-"}</td>
                  <td className="note">{r?.note}</td>
                  <td className="note">{r?.bossNote}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
