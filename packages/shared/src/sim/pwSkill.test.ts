import { describe, expect, it } from "vitest";
import { CHARACTER_IDS, CHARACTERS, WEAPONS, type CharacterId } from "../content";
import { PW } from "../paewangDefs";
import { kitOf } from "../pwKits";
import { allPlayers } from "./party";
import { createPvp, stepPvp } from "./pvp";
import { pwHidden } from "./pwSkillHit";
import { EMPTY_INPUT, type RunState, type TickInput } from "./types";

/** 사람 둘의 1대1 · 준비 시간을 건너뛰고 상대를 내 오른쪽 dist에 둠 */
function duel(a: CharacterId, b: CharacterId, dist = 60): RunState {
  const s = createPvp(5, "duel", [{ characterId: a }, { characterId: b }], "small");
  s.tick = PW.ready + 1;
  const [p, q] = allPlayers(s);
  for (const x of [p!, q!]) x.invulnTicks = 0;
  q!.x = q!.prevX = p!.x + dist;
  q!.y = q!.prevY = p!.y;
  return s;
}
/** 오른쪽으로 거리 d를 겨누고 k번 스킬 (fine aim: 0.01 단계) */
const cast = (k: number, d: number): TickInput => ({ ...EMPTY_INPUT, skill: k, aimX: Math.round((d / 12) * 100), aimY: 0 });
const run = (s: RunState, n: number, mine: TickInput = EMPTY_INPUT) => {
  for (let i = 0; i < n; i++) stepPvp(s, [i === 0 ? mine : EMPTY_INPUT, EMPTY_INPUT]);
};

describe("패왕전 스킬", () => {
  it("모든 캐릭터(히든 빼고)에 스킬 넷 · 아이콘은 있는 무기 · 궁극기는 재사용 대기가 김", () => {
    for (const c of CHARACTER_IDS) {
      const kit = kitOf(c);
      expect(kit, c).toBeDefined();
      expect(kit!.skills).toHaveLength(4);
      for (const sk of kit!.skills) expect(WEAPONS[sk.icon], `${c} ${sk.icon}`).toBeDefined();
      expect(kit!.skills[3].cd, c).toBeGreaterThanOrEqual(45);
      expect(CHARACTERS[c]).toBeDefined();
    }
  });

  it("지점 스킬: 예고 뒤 터져 피해 + 기절 · 재사용 대기 동안 다시 못 씀", () => {
    const s = duel("warden", "drifter", 90);
    const foe = allPlayers(s)[1]!;
    const hp = foe.hp;
    run(s, 1, cast(4, 90));
    expect(s.pvp!.casts!.length).toBe(1);
    run(s, 40);
    expect(foe.hp).toBeLessThan(hp);
    expect(s.pvp!.seats[1]!.stun).toBeGreaterThan(0);
    expect(allPlayers(s)[0]!.pwCd![3]).toBeGreaterThan(0);
    run(s, 1, cast(4, 90));
    expect(s.pvp!.casts?.length ?? 0).toBe(0);
  });

  it("침묵이면 스킬을 못 씀 · 끌어오기는 쓴 사람 쪽으로", () => {
    const s = duel("punk", "warden", 100);
    run(s, 1, cast(2, 100));
    run(s, 2);
    expect(s.pvp!.seats[1]!.silence).toBeGreaterThan(0);
    const t = duel("titan", "warden", 120);
    const before = allPlayers(t)[1]!.x;
    run(t, 1, cast(2, 120));
    run(t, 12);
    expect(allPlayers(t)[1]!.x).toBeLessThan(before - 30);
  });

  it("돌진은 앞으로 움직이며 벰 · 순간이동(뒤로)은 상대 등 뒤", () => {
    const s = duel("wanderer", "drifter", 80);
    const me = allPlayers(s)[0]!;
    const x0 = me.x;
    const hp = allPlayers(s)[1]!.hp;
    run(s, 1, cast(1, 120));
    run(s, 20);
    expect(allPlayers(s)[0]!.x).toBeGreaterThan(x0 + 40);
    expect(allPlayers(s)[1]!.hp).toBeLessThan(hp);
    const b = duel("remnant", "warden", 100);
    run(b, 1, cast(2, 100));
    expect(allPlayers(b)[0]!.x).toBeGreaterThan(allPlayers(b)[1]!.x);
  });

  it("소환한 것이 상대를 때리고 시간이 다하면 사라짐 · 투명이면 AI가 노리지 못함", () => {
    const s = duel("gunner", "warden", 70);
    const hp = allPlayers(s)[1]!.hp;
    run(s, 1, cast(3, 70));
    expect(s.pvp!.mins!.length).toBe(1);
    run(s, 120);
    expect(allPlayers(s)[1]!.hp).toBeLessThan(hp);
    run(s, 5 * 60);
    expect(s.pvp!.mins!.length).toBe(0);
    const h = duel("remnant", "warden", 70);
    run(h, 1, cast(4, 10));
    expect(pwHidden(allPlayers(h)[0]!)).toBe(true);
  });

  it("잔영 기본 공격: 노린 상대 등 뒤로 순간이동해 숨었다가 그 상대를 찌름", () => {
    const s = duel("remnant", "warden", 100);
    const foe = allPlayers(s)[1]!;
    const hp = foe.hp;
    run(s, 1, { ...EMPTY_INPUT, attack: true, aimX: 100, aimY: 0 });
    expect(allPlayers(s)[0]!.x).toBeGreaterThan(foe.x);
    expect(pwHidden(allPlayers(s)[0]!)).toBe(true);
    run(s, 20);
    expect(foe.hp).toBeLessThan(hp);
  });
});
