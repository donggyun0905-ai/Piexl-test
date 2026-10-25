// 도트 편집: 그림 고르기 (묶음 → 찾기 → 그림)
import { useState } from "react";
import type { Asset } from "./assets";
import { GROUPS, type GroupId } from "./labels";

export function Picker({ assets, current, onOpen }: { assets: Asset[]; current: Asset; onOpen: (a: Asset) => void }) {
  const [find, setFind] = useState("");
  const list = assets.filter((a) => a.group === current.group && (!find || a.label.includes(find) || a.id.includes(find)));
  const pickGroup = (g: GroupId) => {
    setFind("");
    const first = assets.find((a) => a.group === g);
    if (first) onOpen(first);
  };
  return (
    <div className="px-picker">
      <select value={current.group} onChange={(e) => pickGroup(e.target.value as GroupId)}>
        {GROUPS.map((g) => (
          <option key={g.id} value={g.id}>
            {g.label}
          </option>
        ))}
      </select>
      <input type="search" placeholder="이름으로 찾기" value={find} onChange={(e) => setFind(e.target.value)} />
      <select
        value={list.some((a) => a.id === current.id) ? current.id : ""}
        onChange={(e) => {
          const a = assets.find((x) => x.id === e.target.value);
          if (a) onOpen(a);
        }}
      >
        {!list.some((a) => a.id === current.id) && <option value="">— 고르세요 ({list.length}개) —</option>}
        {list.map((a) => (
          <option key={a.id} value={a.id}>
            {a.label}
          </option>
        ))}
      </select>
    </div>
  );
}
