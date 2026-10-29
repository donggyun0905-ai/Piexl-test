// 창작 공간 창: 새 그림판 만들기 (이름 · 가로·세로 16~2048 · 칸 나누기) · 만든 그림 열기·지우기 (pixel/create)
import { useState } from "react";
import { CREATE_MAX, CREATE_SIZES, listCreations, newCreation, removeCreation, type Creation } from "./create";

interface Props {
  onOpen: (c: Creation) => void;
  onClose: () => void;
  /** 목록이 바뀜 (만듦·지움) */
  onList: (list: Creation[]) => void;
}

export function CreatePanel({ onOpen, onClose, onList }: Props) {
  const [name, setName] = useState("");
  const [w, setW] = useState(128);
  const [h, setH] = useState(128);
  const [cols, setCols] = useState(1);
  const [rows, setRows] = useState(1);
  const [list, setList] = useState(listCreations);
  const big = w * h > 1024 * 1024;
  const split = (n: number, d: number) => (n % d === 0 ? "" : " (나누어떨어지지 않아 남는 줄은 안 씀)");
  return (
    <div className="px-create-backdrop" onClick={onClose}>
      <div className="px-create" role="dialog" aria-modal="true" aria-label="창작 공간" onClick={(e) => e.stopPropagation()}>
        <h3>🎨 창작 공간</h3>
        <p className="px-help">크기를 마음대로 정한 빈 그림판에 직접 그립니다. 그림은 이 기기에 자동 저장되고, 'PNG 내려받기'로 파일로 받을 수 있습니다.</p>
        <div className="px-create-form">
          <label>
            이름 <input value={name} maxLength={30} placeholder="새 그림" onChange={(e) => setName(e.target.value)} />
          </label>
          <div className="px-create-sizes">
            {CREATE_SIZES.map((n) => (
              <button key={n} type="button" className={w === n && h === n ? "active" : undefined} onClick={() => (setW(n), setH(n))}>
                {n}
              </button>
            ))}
          </div>
          <label>
            가로 <input type="number" min={1} max={CREATE_MAX} value={w} onChange={(e) => setW(Number(e.target.value))} />
          </label>
          <label>
            세로 <input type="number" min={1} max={CREATE_MAX} value={h} onChange={(e) => setH(Number(e.target.value))} />
          </label>
          <label title="움직임 시트처럼 여러 장으로 나눠 그릴 때 (캐릭터 시트 = 4×4)">
            칸 나누기 <input type="number" min={1} max={64} value={cols} onChange={(e) => setCols(Number(e.target.value))} /> ×{" "}
            <input type="number" min={1} max={64} value={rows} onChange={(e) => setRows(Number(e.target.value))} />
          </label>
          <div className="px-create-sizes">
            <button type="button" onClick={() => (setCols(1), setRows(1))}>
              한 장
            </button>
            <button type="button" onClick={() => (setW(128), setH(128), setCols(4), setRows(4))}>
              캐릭터 시트 32칸
            </button>
            <button type="button" onClick={() => (setW(384), setH(384), setCols(4), setRows(4))}>
              캐릭터 시트 96칸
            </button>
            <button type="button" onClick={() => (setW(16), setH(16), setCols(1), setRows(1))}>
              아이콘 16
            </button>
          </div>
          <p className="px-help">
            한 칸 크기: {Math.floor(w / Math.max(1, cols))}×{Math.floor(h / Math.max(1, rows))}
            {split(w, cols) || split(h, rows)}
            {big && " · 아주 큰 그림은 그리기가 조금 느릴 수 있어요"}
          </p>
          <button
            type="button"
            className="primary"
            onClick={() => {
              const c = newCreation(name, w, h, cols, rows);
              const next = listCreations();
              setList(next);
              onList(next);
              onOpen(c);
            }}
          >
            만들기
          </button>
        </div>
        {list.length > 0 && (
          <>
            <h4>만든 그림 ({list.length})</h4>
            <ul className="px-create-list">
              {list.map((c) => (
                <li key={c.id}>
                  <button type="button" onClick={() => onOpen(c)}>
                    {c.name} <small>
                      {c.w}×{c.h}
                      {c.cols * c.rows > 1 ? ` · ${c.cols}×${c.rows}칸` : ""}
                    </small>
                  </button>
                  <button
                    type="button"
                    className="px-create-del"
                    onClick={() => {
                      if (!confirm(`'${c.name}'을(를) 지울까요? 되돌릴 수 없습니다.`)) return;
                      removeCreation(c.id);
                      const next = listCreations();
                      setList(next);
                      onList(next);
                    }}
                  >
                    지우기
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        <button type="button" className="secondary" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
