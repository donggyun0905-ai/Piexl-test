// 숫자 타일 바닥: 바닥 타일을 눌러 빌려 오기(골라 두기) · 붙일 수 있는 묶음 끝의 '+'로 붙이기 (혼자·같이 하기 공용)
import { playTiles, type Tile } from "@pixel-rogue/shared";
import { TileView } from "./TileGame";

interface Props {
  table: Tile[][];
  hand: Tile[];
  /** 고른 내 타일 · 빌려 올 바닥 타일 id */
  sel: number[];
  borrow: number[];
  /** 내 차례가 아니면 null */
  onBorrow: ((id: number) => void) | null;
  onAdd: (meld: number) => void;
}

export function TileTable({ table, hand, sel, borrow, onBorrow, onAdd }: Props) {
  return (
    <div className="tile-table">
      {table.map((m, i) => {
        const can = !!onBorrow && sel.length > 0 && !!playTiles(hand, table, sel, borrow, i);
        return (
          <div key={i} className={`meld${can ? " can" : ""}`}>
            {m.map((x) => (
              <TileView key={x.id} tile={x} selected={borrow.includes(x.id)} onClick={onBorrow ? () => onBorrow(x.id) : undefined} />
            ))}
            {can && (
              <button type="button" className="meld-add" onClick={() => onAdd(i)}>
                +
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** 골라 둔 목록에서 하나 넣고 빼기 */
export const toggleId = (id: number) => (v: number[]) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]);
