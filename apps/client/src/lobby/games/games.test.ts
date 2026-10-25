import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GAME_IDS } from "../lobbyMap";
import { MiniGame } from "../MiniGame";
import { bjTotal as total, cpuTurn, createRng, findMeld, newBag, validMeld, type Tile } from "@pixel-rogue/shared";

const tile = (n: number, c: number, id = n * 10 + c): Tile => ({ id, n, c });

describe("로비 미니 게임", () => {
  it("8종 모두 처음 화면이 그려짐", () => {
    for (const g of GAME_IDS) {
      const html = renderToString(createElement(MiniGame, { game: g, t: (k: string) => k, onClose: () => {} }));
      expect(html.length, g).toBeGreaterThan(50);
    }
  });

  it("블랙잭 합: A는 넘지 않으면 11", () => {
    expect(total([0, 12])).toBe(21); // A♠ K♠
    expect(total([0, 0, 8])).toBe(21); // A A 9
    expect(total([9, 10, 4])).toBe(25);
  });

  it("숫자 타일: 무리·줄 판정, 컴퓨터는 낼 수 있으면 내고 못 내면 한 장 가져옴", () => {
    expect(validMeld([tile(5, 0), tile(5, 1), tile(5, 2)])).toBe(true);
    expect(validMeld([tile(5, 0), tile(5, 0, 99), tile(5, 2)])).toBe(false);
    expect(validMeld([tile(3, 1), tile(4, 1), tile(5, 1)])).toBe(true);
    expect(validMeld([tile(3, 1), tile(5, 1), tile(6, 1)])).toBe(false);
    expect(findMeld([tile(1, 2), tile(2, 2), tile(3, 2), tile(9, 0)])).toHaveLength(3);
    const bag = newBag(createRng(1));
    const r = cpuTurn([tile(7, 0), tile(7, 1), tile(7, 3), tile(12, 2)], [], bag);
    expect(r.table).toHaveLength(1);
    expect(r.hand).toHaveLength(1);
    const none = cpuTurn([tile(1, 0), tile(9, 2)], [], bag);
    expect(none.hand).toHaveLength(3);
  });
});
