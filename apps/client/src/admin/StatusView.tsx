// 상태이상 탭: 독·화상·출혈·부식·죽음 등 상태이상에 쓰이는 값만 모든 묶음(캐릭터·무기·규칙·아이템 효과)에서 모아 보여 줌
// 값은 원래 묶음에 그대로 저장 (같은 값을 두 번 넣지 않음). 값 이름에 상태이상 낱말이 들어 있으면 그 상태이상으로 묶음
import type { BalanceSet, BalanceValues } from "@pixel-rogue/shared";
import { useState } from "react";
import { Cell } from "./BalanceEditor";
import { fieldLabel, GROUP_LABEL, rowLabel } from "./labels";

const KINDS: [string, RegExp][] = [
  ["독", /poison|venom|toxic|plague|gas|sting/i],
  ["화상·불", /burn|fire|ignite|flame|hellfire|lava|napalm|ember/i],
  ["출혈", /bleed|blood/i],
  ["부식·용해", /melt|rot|corro|acid|decay/i],
  ["죽음·저주", /death|doom|curse|reap|hex/i],
  ["물·한파·빙결", /tide|wet|water|frost|freeze|chill|ice|cold|snow/i],
  ["감전·폭풍", /shock|storm|lightning|thunder|zap|volt/i],
  ["기절·속박·느림·공포", /stun|root|slow|fear|bind|sluggish|frozen/i],
  ["예리함·방어 깎기", /sharp|apDef|shred|armor/i],
];

interface Props {
  set: BalanceSet;
  draft: BalanceValues;
  saved: BalanceValues;
  onChange: (group: string, id: string, key: string, v: number | undefined) => void;
}

export function StatusView({ set, draft, saved, onChange }: Props) {
  const [kind, setKind] = useState(0);
  const re = KINDS[kind]![1];
  const rows = set.groups.flatMap((g) =>
    g.ids
      .map((id) => ({ g, id, fields: set.balanceFields(g, id).filter((f) => re.test(f.key) || (g.id === "rules" && re.test(id))) }))
      .filter((r) => r.fields.length > 0),
  );
  return (
    <div className="admin-table-wrap">
      <p className="admin-hint">상태이상에 쓰이는 값만 모았습니다. 여기서 바꾸면 원래 묶음(캐릭터·무기·규칙·아이템 효과)의 값이 바뀝니다.</p>
      <div className="admin-filter">
        {KINDS.map(([label], i) => (
          <button key={label} type="button" className={i === kind ? "active" : undefined} onClick={() => setKind(i)}>
            {label}
          </button>
        ))}
        <span className="admin-hint">{rows.length}개</span>
      </div>
      {rows.slice(0, 80).map(({ g, id, fields }) => (
        <section key={`${g.id}/${id}`} className="admin-row">
          <h4>
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
