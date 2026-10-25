import { describe, expect, it } from "vitest";
import { bjTotal, type BjState } from "./blackjack";
import { newTable, TableLogic } from "./table";
import type { JokerView } from "./joker";
import type { TilesView } from "./tiles";
import { CARD_QUICK_WAIT_MS, type CardGame } from "./types";

function table(game: CardGame, mode: "quick" | "private" = "private") {
  let clock = 1000;
  const t = new TableLogic(newTable("ABCDEF", game, mode, clock, 7), () => clock);
  return { t, advance: (ms: number) => (clock += ms) };
}

/** 알람이 올 때마다 시간을 그만큼 넘기며 돌림 */
function run(t: TableLogic, advance: (ms: number) => number, steps: number) {
  for (let i = 0; i < steps && t.data.phase === "playing"; i++) {
    const at = t.nextAlarm();
    if (!at) break;
    advance(Math.max(0, at - t.view("x").now));
    t.tick();
  }
}

describe("카드·타일 같이 하기", () => {
  it("방장만 시작, 빈자리는 컴퓨터 · 빠른 시작은 기다리다 저절로", () => {
    const { t } = table("joker");
    expect(t.join("a", "A")).toBeNull();
    expect(t.join("b", "B")).toBeNull();
    t.handle("b", { t: "start" });
    expect(t.data.phase).toBe("lobby");
    t.handle("a", { t: "start" });
    expect(t.data.phase).toBe("playing");
    expect(t.data.seats.map((s) => s.pid)).toEqual(["a", "b", null, null]);
    expect(t.join("c", "C")).toBe("started");
    const q = table("tiles", "quick");
    q.t.join("a", "A");
    q.t.tick();
    expect(q.t.data.phase).toBe("lobby");
    q.advance(CARD_QUICK_WAIT_MS);
    q.t.tick();
    expect(q.t.data.phase).toBe("playing");
  });

  it("조커 게임: 사람이 시간을 넘겨도 대신 뽑아서 끝까지 감 · 조커 가진 사람이 짐", () => {
    const { t, advance } = table("joker");
    t.join("a", "A");
    t.handle("a", { t: "start" });
    run(t, advance, 500);
    expect(t.data.phase).toBe("done");
    const v = t.view("a").game_ as JokerView;
    expect(v.loser).toBeGreaterThanOrEqual(0);
    expect(v.counts.filter((n) => n > 0)).toHaveLength(1);
  });

  it("숫자 타일: 남의 패는 숨기고, 맞지 않는 묶음은 거절, 컴퓨터끼리 끝까지", () => {
    const { t, advance } = table("tiles");
    t.join("a", "A");
    t.handle("a", { t: "start" });
    const v = t.view("a").game_ as TilesView;
    expect(v.hand).toHaveLength(14);
    expect(JSON.stringify(t.view("a"))).not.toContain('"hands"');
    const before = JSON.stringify(t.data.state);
    t.handle("a", { t: "act", a: { meld: [v.hand[0]!.id, v.hand[1]!.id] } });
    expect(JSON.stringify(t.data.state)).toBe(before);
    t.leave("a");
    run(t, advance, 2000);
    expect(t.data.phase).toBe("done");
  });

  it("블랙잭: 걸기 → 차례 → 딜러 → 결과 → 다음 판, 하는 중에도 컴퓨터 자리로 들어옴", () => {
    const { t, advance } = table("blackjack");
    t.join("a", "A");
    t.handle("a", { t: "start" });
    t.handle("a", { t: "act", a: { bet: 50 } });
    run(t, advance, 30);
    const s = t.data.state as BjState;
    expect(s.round).toBeGreaterThanOrEqual(2);
    expect(t.join("b", "B")).toBeNull();
    expect(t.data.seats.filter((x) => x.pid).length).toBe(2);
    expect(bjTotal([0, 12])).toBe(21);
  });
});
