// 도트 편집 비교 카드 2장: 같은 묶음의 다른 그림에서 같은 칸을 크게 + 그림 전체 (눌러서 칸 고르기)
import { useEffect, useState } from "react";
import { gridOf, type Asset } from "./assets";
import { CellView, SheetView } from "./views";

function Card({ list, init, sel, onPick }: { list: Asset[]; init: string; sel: [number, number]; onPick: (r: number, c: number) => void }) {
  const [id, setId] = useState(init);
  const [data, setData] = useState<ImageData | null>(null);
  const a = list.find((x) => x.id === id) ?? list[0];
  useEffect(() => {
    let alive = true;
    a?.load().then((d) => alive && setData(d), () => alive && setData(null));
    return () => {
      alive = false;
    };
  }, [a]);
  if (!a) return null;
  const g = data && gridOf(a, data);
  const r = g ? Math.min(sel[0], g.rows - 1) : 0;
  const c = g ? Math.min(sel[1], g.cols - 1) : 0;
  return (
    <div className="px-card">
      <select value={a.id} onChange={(e) => setId(e.target.value)}>
        {list.map((x) => (
          <option key={x.id} value={x.id}>
            {x.label}
          </option>
        ))}
      </select>
      {data && g && (
        <>
          <CellView data={data} g={g} r={r} c={c} zoom={Math.max(3, Math.floor(192 / Math.max(g.cw, g.ch)))} grid version={0} />
          <SheetView data={data} g={g} width={180} sel={[r, c]} onPick={onPick} version={0} />
        </>
      )}
    </div>
  );
}

/** list: 지금 고른 그림과 같은 묶음 */
export function Compare({ title, list, sel, onPick }: { title: string; list: Asset[]; sel: [number, number]; onPick: (r: number, c: number) => void }) {
  const first = list.find((a) => a.id === "drifter") ?? list[0];
  const second = list.find((a) => a.id === "mage") ?? list[1] ?? list[0];
  if (!first || !second) return null;
  return (
    <section className="px-compare">
      <h2>{title}</h2>
      <Card key={`a-${first.id}`} list={list} init={first.id} sel={sel} onPick={onPick} />
      <Card key={`b-${second.id}`} list={list} init={second.id} sel={sel} onPick={onPick} />
    </section>
  );
}
