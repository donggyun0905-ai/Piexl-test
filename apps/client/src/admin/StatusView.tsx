// 상태이상 탭 (정리본): 위쪽 '한눈에 보기' 표(16종 + 피해 없는 상태이상: 아이콘·피해 숫자 색·성격·동작·거는 캐릭터·값 수) ·
// 하나를 고르면 설명 카드 + 그 상태이상에 쓰이는 값을 모든 묶음(무기·규칙·아이템 효과·적·보스)에서 모아 바로 고침
// 값은 원래 묶음에 그대로 저장 (같은 값을 두 번 넣지 않음). 데이터는 statusInfo (문서 docs/STATUS.md)
import type { BalanceSet, BalanceValues, DotKind } from "@pixel-rogue/shared";
import { useEffect, useRef, useState } from "react";
import { DOT_COLOR } from "../game/damageNumbers";
import { drawDotIcon } from "../game/dotIcons";
import { AdminThumb } from "./AdminThumb";
import { Cell } from "./BalanceEditor";
import { fieldLabel, GROUP_LABEL, rowLabel } from "./labels";
import { isStatusValue, STATUS_INFO, type StatusInfo } from "./statusInfo";

interface Props {
  set: BalanceSet;
  draft: BalanceValues;
  saved: BalanceValues;
  onChange: (group: string, id: string, key: string, v: number | undefined) => void;
}

/** 캐릭터 기본 스탯(돈 획득·예리함 0 등)은 상태이상 값이 아니라 뺌 */
const SKIP_GROUPS = new Set(["characters"]);

/** 상태이상 아이콘 (게임 피해 숫자 옆과 같은 그림) */
function DotIcon({ kind, big = false }: { kind: DotKind; big?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 10, 10);
    drawDotIcon(ctx, kind, 1, 1);
  }, [kind]);
  return <canvas ref={ref} width={10} height={10} className={big ? "admin-dot-icon big" : "admin-dot-icon"} aria-hidden="true" />;
}

function rowsOf(set: BalanceSet, info: StatusInfo) {
  return set.groups
    .filter((g) => !SKIP_GROUPS.has(g.id))
    .flatMap((g) => g.ids.map((id) => ({ g, id, fields: set.balanceFields(g, id).filter((f) => isStatusValue(info, g.id, id, f.key)) })).filter((r) => r.fields.length > 0));
}

const Users = ({ info }: { info: StatusInfo }) => (
  <span className="admin-status-users">
    {info.users.map((c) => (
      <span key={c} title={c}>
        <AdminThumb group="characters" id={c} size={24} />
      </span>
    ))}
  </span>
);

/** 게임 피해 숫자 색 견본 */
const Sample = ({ kind }: { kind: DotKind }) => <b className="admin-dot-sample" style={{ color: DOT_COLOR[kind] }}>123</b>;

export function StatusView({ set, draft, saved, onChange }: Props) {
  /** -1 = 한눈에 보기 */
  const [pick, setPick] = useState(-1);
  const info = STATUS_INFO[pick];
  const rows = info ? rowsOf(set, info) : [];
  return (
    <div className="admin-table-wrap">
      <p className="admin-hint">상태이상 16종과 피해 없는 상태이상을 정리했습니다. 하나를 누르면 그 상태이상에 쓰이는 값을 모두 고칠 수 있고, 원래 묶음(무기·규칙·아이템 효과)의 값이 바뀝니다.</p>
      <div className="admin-filter">
        <button type="button" className={pick < 0 ? "active" : undefined} onClick={() => setPick(-1)}>
          한눈에 보기
        </button>
        {STATUS_INFO.map((x, i) => (
          <button key={x.label} type="button" className={i === pick ? "active" : undefined} onClick={() => setPick(i)}>
            {x.kind && <DotIcon kind={x.kind} />}
            {x.label}
          </button>
        ))}
      </div>
      {!info && (
        <table className="admin-table admin-status-table">
          <thead>
            <tr>
              <th>상태이상</th>
              <th>피해 숫자</th>
              <th>성격</th>
              <th>동작</th>
              <th>거는 캐릭터 · 그 밖</th>
              <th>값</th>
            </tr>
          </thead>
          <tbody>
            {STATUS_INFO.map((x, i) => (
              <tr key={x.label} className="admin-status-line" onClick={() => setPick(i)}>
                <th>
                  {x.kind && <DotIcon kind={x.kind} big />}
                  {x.label}
                </th>
                <td>{x.kind ? <Sample kind={x.kind} /> : "—"}</td>
                <td>{x.type}</td>
                <td>{x.desc}</td>
                <td>
                  <Users info={x} />
                  {x.more && <small>{x.more}</small>}
                </td>
                <td>{rowsOf(set, x).reduce((n, r) => n + r.fields.length, 0)}개</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {info && (
        <section className="admin-row admin-status-card">
          <h4>
            {info.kind && <DotIcon kind={info.kind} big />}
            {info.label} <small>{info.type}</small> {info.kind && <Sample kind={info.kind} />}
          </h4>
          <p className="admin-desc">{info.desc}</p>
          <Users info={info} />
          {info.more && <p className="admin-desc">그 밖: {info.more}</p>}
          <p className="admin-hint">공용 규칙(규칙·기술 수치 탭의 STATUS_RULES): 화상·독 피해 간격 0.5초 · 점화 2초</p>
        </section>
      )}
      {rows.slice(0, 80).map(({ g, id, fields }) => (
        <section key={`${g.id}/${id}`} className="admin-row">
          <h4>
            <AdminThumb group={g.id} id={id} size={32} />
            {GROUP_LABEL[g.id]} · {rowLabel(g.id, id)} <small>{id}</small>
          </h4>
          <div className="admin-grid">
            {fields.map((f) => (
              <Cell
                key={`${f.key}:${draft[g.id]?.[id]?.[f.key] ?? ""}`}
                grid
                label={fieldLabel(f.key, g.id)}
                field={f}
                base={set.balanceDefault(g.id, id, f.key)!}
                value={draft[g.id]?.[id]?.[f.key]}
                saved={saved[g.id]?.[id]?.[f.key]}
                onChange={(v) => onChange(g.id, id, f.key, v)}
              />
            ))}
          </div>
        </section>
      ))}
      {rows.length > 80 && <p className="admin-hint">처음 80개만 보입니다.</p>}
    </div>
  );
}
