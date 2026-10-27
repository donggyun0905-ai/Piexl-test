import { describe, expect, it } from "vitest";
import { TICK_RATE } from "../constants";
import { PW, PW_MODE, PW_MODES, PW_TIERS, type PwMode } from "../paewangDefs";
import { PW_ARENAS, type PwArenaId } from "../paewangMaps";
import { distanceField, tileAt, TILE_FLOOR } from "./layout";
import { createPaewang, paewangResult, stepPaewang } from "./paewang";
import { spotXY } from "./paewangGrid";
import { pwLoadoutOk, pwPassiveChoices } from "./paewangKit";
import { EMPTY_INPUT, type RunState } from "./types";
import { roomGrid } from "./util";

/** 자동 조준으로 계속 공격하며 가장 가까운 AI 쪽으로 걸음 */
function play(s: RunState, ticks: number, tough = false): void {
  for (let i = 0; i < ticks && !s.over; i++) {
    if (tough) s.player.hp = s.player.stats.maxHp;
    const e = s.enemies.find((o) => o.pw && o.hp > 0);
    const dx = e ? Math.sign(e.x - s.player.x) * 40 : 0;
    const dy = e ? Math.sign(e.y - s.player.y) * 40 : 0;
    stepPaewang(s, { ...EMPTY_INPUT, autoAim: true, attack: true, moveX: dx, moveY: dy });
  }
}

describe("패왕전", () => {
  it("경기장 자리는 모두 바닥이고 서로 걸어서 닿음", () => {
    for (const id of Object.keys(PW_ARENAS) as PwArenaId[]) {
      const def = PW_ARENAS[id];
      const s = createPaewang(1, id === "field" ? "brawl" : id === "manor" ? "gungame" : id === "forest" ? "squad" : id === "wide" ? "trio" : "duel", "warden");
      const g = roomGrid(s)!;
      const spots = [...def.teamA, ...def.teamB, ...def.spots];
      for (const [c, r] of spots) expect(tileAt(g, c, r), `${id} ${c},${r}`).toBe(TILE_FLOOR);
      const [x, y] = spotXY(spots[0]!);
      const field = distanceField(g, x, y);
      for (const [c, r] of spots) expect(field[r * def.cols + c], `${id} ${c},${r} 닿음`).toBeGreaterThanOrEqual(0);
    }
  });

  it("모드마다 인원 · 데스매치 21레벨 표", () => {
    expect(PW_TIERS).toHaveLength(PW.gunLevels);
    for (const mode of PW_MODES) {
      const s = createPaewang(3, mode, "drifter", { weapon: "crossbow", passives: [], uses: [] });
      const def = PW_MODE[mode];
      const foes = s.enemies.filter((e) => e.pw).length;
      expect(foes, mode).toBe(mode === "tourney" ? 1 : def.foes);
      expect(s.pw!.allies.length, mode).toBe(mode === "tourney" ? 0 : def.allies);
    }
  });

  it("준비방 장비: 패시브 10개(겹치기 가능)·사용 아이템 2개 · 규칙에 안 맞으면 받지 않음", () => {
    const pool = pwPassiveChoices("warden", "greatblade");
    const stack = pool.find((id) => pwLoadoutOk("warden", { weapon: "greatblade", passives: [id, id], uses: [] }))!;
    const lo = { weapon: "greatblade" as const, passives: Array(10).fill(stack), uses: ["potion" as never] };
    expect(pwLoadoutOk("warden", lo)).toBe(true);
    expect(pwLoadoutOk("warden", { ...lo, passives: Array(11).fill(stack) })).toBe(false);
    expect(pwLoadoutOk("warden", { ...lo, weapon: "crossbow" })).toBe(false);
  });

  it("여섯 모드 모두 1분 동안 문제없이 · 같은 시드면 같은 결과", () => {
    for (const mode of PW_MODES) {
      const a = createPaewang(7, mode, "mage");
      const b = createPaewang(7, mode, "mage");
      play(a, TICK_RATE * 30);
      play(b, TICK_RATE * 30);
      expect(paewangResult(a), mode).toEqual(paewangResult(b));
      expect(a.tick, mode).toBe(b.tick);
    }
  }, 30000);

  it("1대1·토너먼트는 죽지 않으면 이김 · 대난투는 AI끼리도 싸움", () => {
    for (const mode of ["duel", "tourney"] as PwMode[]) {
      const s = createPaewang(11, mode, "warden");
      play(s, TICK_RATE * 300, true);
      expect(s.over && s.won, mode).toBe(true);
      expect(paewangResult(s).reward).toBe(PW_MODE[mode].reward);
    }
    const s = createPaewang(5, "brawl", "warden");
    const n = s.enemies.length;
    play(s, TICK_RATE * 90, true);
    expect(s.enemies.filter((e) => e.pw).length).toBeLessThan(n);
  }, 30000);

  it("데스매치: 처치하면 다음 레벨 캐릭터로 바뀌고 AI도 레벨이 오름", () => {
    const s = createPaewang(9, "gungame", "warden");
    expect(s.player.characterId).toBe(PW_TIERS[0]);
    play(s, TICK_RATE * 240, true);
    expect(s.pw!.lv).toBeGreaterThan(1);
    expect(s.player.characterId).toBe(PW_TIERS[Math.min(20, s.pw!.lv - 1)]);
  }, 30000);

  it("팀 대결에서 내가 쓰러지면 내 편을 지켜봄", () => {
    const s = createPaewang(4, "trio", "mage");
    s.player.hp = 0;
    stepPaewang(s, EMPTY_INPUT);
    expect(s.pw!.down || s.over).toBe(true);
    if (!s.over) {
      play(s, TICK_RATE * 5);
      expect(s.player.hp).toBe(0);
    }
  });
});
