import { describe, expect, it } from "vitest";
import { createRng } from "../rng";
import { JOKER, JOKER_RULES, type JokerState, type JokerView } from "./joker";
import { playTiles, type Tile } from "./tiles";

let nextId = 0;
const tile = (n: number, c: number): Tile => ({ id: nextId++, n, c });

describe("숫자 타일 바닥 빌리기", () => {
  it("무리(10 네 색)에서 검정 10을 빌려 내 검정 8·9·11과 줄을 만듦", () => {
    const group = [tile(10, 0), tile(10, 1), tile(10, 2), tile(10, 3)];
    const hand = [tile(8, 2), tile(9, 2), tile(11, 2), tile(5, 0)];
    const r = playTiles(hand, [group], [hand[0]!.id, hand[1]!.id, hand[2]!.id], [group[2]!.id], null);
    expect(r).not.toBeNull();
    expect(r!.table).toHaveLength(2);
    expect(r!.table[0]!.map((t) => t.c)).toEqual([0, 1, 3]);
    expect(r!.table[1]!.map((t) => t.n)).toEqual([8, 9, 10, 11]);
    expect(r!.hand).toHaveLength(1);
  });

  it("남은 바닥 묶음이 틀리면 거절 · 줄 가운데를 빼면 두 줄로 나뉨 · 내 타일 없이는 못 함", () => {
    const three = [tile(4, 0), tile(4, 1), tile(4, 2)];
    const hand = [tile(4, 3), tile(5, 3), tile(3, 1)];
    expect(playTiles(hand, [three], [hand[1]!.id, hand[0]!.id], [three[0]!.id], null)).toBeNull();
    const run = [1, 2, 3, 4, 5, 6, 7].map((n) => tile(n, 1));
    const r = playTiles(hand, [run], [hand[0]!.id, hand[1]!.id], [run[3]!.id], null);
    expect(r).toBeNull();
    const fours = [tile(4, 0), tile(4, 2)];
    const r2 = playTiles([...hand, ...fours], [run], [fours[0]!.id, fours[1]!.id], [run[3]!.id], null);
    expect(r2!.table.map((m) => m.length)).toEqual([3, 3, 3]);
    expect(playTiles(hand, [run], [], [run[0]!.id, run[1]!.id, run[2]!.id], null)).toBeNull();
  });
});

describe("조커 게임 짝 맞추기", () => {
  const rng = createRng(3);
  const base = (hands: number[][]): JokerState => ({ hands, turn: 0, loser: -1, last: null, pending: false });

  it("뽑은 카드의 짝이 있으면 보여 주고, 맞는 짝을 눌러야 버려지고 차례가 넘어감", () => {
    let s = base([[5, 7], [5, JOKER], [9]]);
    s = JOKER_RULES.act(s, 0, { pick: 0 }, rng)!;
    const v = JOKER_RULES.view(s, 0) as JokerView;
    expect(v.got).toBe(5);
    expect(v.pending).toBe(true);
    expect(JOKER_RULES.turn(s)).toBe(0);
    expect(JOKER_RULES.act(s, 0, { match: 1 }, rng)).toBeNull();
    expect(JOKER_RULES.act(s, 0, { pick: 0 }, rng)).toBeNull();
    s = JOKER_RULES.act(s, 0, { match: 0 }, rng)!;
    expect(s.hands[0]).toEqual([7]);
    expect(s.turn).toBe(1);
  });

  it("짝이 없으면 바로 손에 들어감 · 시간이 지나면 대신 짝을 버림", () => {
    let s = base([[7], [5, JOKER], [9]]);
    s = JOKER_RULES.act(s, 0, { pick: 0 }, rng)!;
    expect(s.pending).toBe(false);
    expect(s.hands[0]!.sort()).toEqual([5, 7]);
    let p = base([[5, 7], [5, JOKER], [9]]);
    p = JOKER_RULES.act(p, 0, { pick: 0 }, rng)!;
    p = JOKER_RULES.act(p, 0, JOKER_RULES.auto(p, 0, rng), rng)!;
    expect(p.hands[0]).toEqual([7]);
  });
});
