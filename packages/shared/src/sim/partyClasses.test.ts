import { describe, expect, it } from "vitest";
import { CHARACTER_IDS, type CharacterId } from "../content";
import { createRng } from "../rng";
import { createParty, stepParty } from "./partyRun";
import { allPlayers, useSeat } from "./party";
import { EMPTY_INPUT, type RunState, type TickInput } from "./types";

/** 정해진 시드로 흔드는 입력 (사람마다 다름) */
function play(s: RunState, ticks: number, salt = 1): void {
  const r = createRng(salt);
  let inputs: TickInput[] = [];
  for (let t = 0; t < ticks && !s.over; t++) {
    if (t % 12 === 0) {
      inputs = allPlayers(s).map(() => ({ ...EMPTY_INPUT, moveX: r.int(-100, 100), moveY: r.int(-100, 40), aimX: r.int(-1000, 1000), aimY: r.int(-1000, 1000), attack: true, dash: r.int(0, 6) === 0, interact: r.int(0, 4) === 0, statPick: r.int(0, 8) }));
    }
    stepParty(s, inputs);
  }
}

const team = (ids: readonly CharacterId[]) => ids.map((characterId) => ({ characterId, unlocks: [] }));
/** 모든 직업을 다섯 명씩 나눠 같이 (장치·회전체·소환수·펫 등이 사람마다 따로 도는지) */
const TEAMS: CharacterId[][] = [];
// 마지막 묶음이 모자라면 처음 캐릭터로 채움 (혼자인 협동은 없음)
for (let i = 0; i < CHARACTER_IDS.length; i += 5) TEAMS.push(Array.from({ length: 5 }, (_, k) => CHARACTER_IDS[(i + k) % CHARACTER_IDS.length]!));

describe("협동: 모든 직업", () => {
  it.each(TEAMS.map((t) => [t.join(","), t] as const))("%s: 같은 입력이면 결과가 같고, JSON으로 옮겨도 이어서 같음", (_name, ids) => {
    const a = createParty(21, team(ids));
    const b = createParty(21, team(ids));
    play(a, 1500);
    play(b, 1500);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    // 손님에게 보낸 상태(JSON)에서 이어서 계산해도 같음
    const c = JSON.parse(JSON.stringify(a)) as RunState;
    play(a, 900, 7);
    play(c, 900, 7);
    expect(JSON.stringify(c)).toBe(JSON.stringify(a));
  });

  it("기계공학자 둘: 장치는 사람마다 따로", () => {
    const s = createParty(4, team(["engineer", "engineer"]));
    play(s, 600);
    useSeat(s, 0);
    const mine = s.devices;
    useSeat(s, 1);
    expect(s.devices).not.toBe(mine);
    useSeat(s, 0);
  });
});
