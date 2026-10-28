import { describe, expect, it } from "vitest";
import { TICK_RATE } from "../constants";
import { CHARACTER_IDS, CHARACTERS } from "../content";
import { PASSIVE_IDS, PASSIVES } from "../items";
import { PW, PW_MODE, PW_MODES, PW_TIERS } from "../paewangDefs";
import { PW_ARENAS, type PwArenaId } from "../paewangMaps";
import { distanceField, tileAt, TILE_FLOOR } from "./layout";
import { spotXY } from "./paewangGrid";
import { pwLoadoutOk, pwPassiveChoices, pwStackMax } from "./paewangKit";
import { allPlayers } from "./party";
import { createPvp, pvpResult, pwSeatCount, stepPvp } from "./pvp";
import { EMPTY_INPUT, type RunState } from "./types";
import { roomGrid } from "./util";

/** 나는 가만히 자동 공격 (AI들끼리·나와 싸움). tough: 나는 죽지 않음 */
function play(s: RunState, ticks: number, tough = false): void {
  for (let i = 0; i < ticks && !s.over; i++) {
    if (tough) s.player.hp = s.player.stats.maxHp;
    // 내 상대 그림자 적 중 가장 가까운 쪽으로 걸어감
    const p = s.player;
    const e = s.enemies.reduce<(typeof s.enemies)[number] | null>((a, x) => (x.hp > 0 && (!a || (x.x - p.x) ** 2 + (x.y - p.y) ** 2 < (a.x - p.x) ** 2 + (a.y - p.y) ** 2) ? x : a), null);
    const mx = e ? Math.sign(e.x - p.x) * 60 : 0;
    const my = e ? Math.sign(e.y - p.y) * 60 : 0;
    stepPvp(s, [{ ...EMPTY_INPUT, autoAim: true, attack: true, moveX: mx, moveY: my }]);
  }
}

describe("패왕전", () => {
  it("대결 유형마다 경기장 5개 · 경기장 자리는 모두 바닥이고 서로 걸어서 닿음", () => {
    for (const m of PW_MODES) expect(new Set(PW_MODE[m].maps).size, m).toBe(5);
    for (const id of Object.keys(PW_ARENAS) as PwArenaId[]) {
      const def = PW_ARENAS[id];
      const mode = PW_MODES.find((m) => PW_MODE[m].maps.includes(id)) ?? (id === "practice" ? "trio" : undefined)!;
      expect(mode, id).toBeDefined();
      const s = createPvp(1, mode, [{ characterId: "warden" }], id);
      expect(s.pvp!.arena).toBe(id);
      const g = roomGrid(s)!;
      const spots = [...def.teamA, ...def.teamB, ...def.spots];
      for (const [c, r] of spots) expect(tileAt(g, c, r), `${id} ${c},${r}`).toBe(TILE_FLOOR);
      // 시작 자리는 용암·가시 위가 아님
      const inside = (list: readonly (readonly number[])[] | undefined, c: number, r: number) => (list ?? []).some(([x = 0, y = 0, w = 0, h = 0]) => c >= x && c < x + w && r >= y && r < y + h);
      for (const [c, r] of spots) expect(inside(def.lava, c, r) || inside(def.spikes, c, r), `${id} ${c},${r} 지형`).toBe(false);
      const [x, y] = spotXY(spots[0]!);
      const field = distanceField(g, x, y);
      for (const [c, r] of spots) expect(field[r * def.cols + c], `${id} ${c},${r} 닿음`).toBeGreaterThanOrEqual(0);
    }
  });

  it("모두 진짜 캐릭터 자리 · 처음 보호막(PW.shield) · 장비는 기본 무기(평타)만 · 패시브·사용 아이템 없음", () => {
    expect(PW_TIERS).toHaveLength(PW.gunLevels);
    for (const mode of PW_MODES) {
      const s = createPvp(3, mode, [{ characterId: "drifter" }]);
      expect(s.party!.length, mode).toBe(pwSeatCount(mode));
      for (const p of allPlayers(s)) {
        expect(p.weaponId, mode).toBe(CHARACTERS[p.characterId].startWeapon);
        expect(p.passives, mode).toEqual([]);
        expect(p.useSlots.every((x) => x === null), mode).toBe(true);
        expect(p.shieldPts ?? 0).toBe(PW.shield);
      }
    }
  });

  it("장비 규칙: 고르는 것은 캐릭터 전용 패시브만 · 같은 패시브 3개까지(효과 아이템 1) · 사용 아이템은 서로 달라야", () => {
    const pool = pwPassiveChoices("warden", "greatblade");
    expect(pool.every((id) => (PASSIVES[id] as { exclusive?: string }).exclusive === "warden")).toBe(true);
    // 같은 것을 3개까지 가질 수 있는 전용 패시브가 있는 캐릭터로
    const c = CHARACTER_IDS.find((id) => pwPassiveChoices(id, CHARACTERS[id].startWeapon).some((x) => pwStackMax(x) === 3))!;
    const weapon = CHARACTERS[c].startWeapon;
    const stack = pwPassiveChoices(c, weapon).find((id) => pwStackMax(id) === 3)!;
    const lo = { weapon, passives: [stack, stack, stack], uses: ["potion" as never, "bomb" as never] };
    expect(pwLoadoutOk(c, lo)).toBe(true);
    expect(pwLoadoutOk(c, { ...lo, passives: [stack, stack, stack, stack] })).toBe(false);
    expect(pwLoadoutOk(c, { ...lo, uses: ["potion" as never, "potion" as never] })).toBe(false);
    // 공용 패시브는 고를 수 없음
    const common = PASSIVE_IDS.find((id) => (PASSIVES[id] as { exclusive?: string; special?: boolean }).exclusive === undefined)!;
    expect(pwLoadoutOk(c, { ...lo, passives: [common] })).toBe(false);
  });

  it("일곱 모드 모두 20초 동안 문제없이 · 같은 시드면 같은 결과 · 누군가 맞음", () => {
    for (const mode of PW_MODES) {
      const a = createPvp(7, mode, [{ characterId: "mage" }]);
      const b = createPvp(7, mode, [{ characterId: "mage" }]);
      play(a, TICK_RATE * 20);
      play(b, TICK_RATE * 20);
      const hp = (s: RunState) => allPlayers(s).map((p) => Math.round(p.hp));
      expect(hp(a), mode).toEqual(hp(b));
      expect(a.pvp!.seats.map((x) => x.kills), mode).toEqual(b.pvp!.seats.map((x) => x.kills));
      // 누군가는 피해를 입음 (서로 싸움)
      expect(a.pvp!.seats.some((x) => (x.taken ?? 0) > 0), mode).toBe(true);
    }
  }, 120000);

  it("1대1: 죽지 않으면 결국 이김 (3판 2선승: 두 판) · 보상", () => {
    const s = createPvp(11, "duel", [{ characterId: "warden" }]);
    play(s, TICK_RATE * 600, true);
    expect(s.over && s.won).toBe(true);
    expect(pvpResult(s).reward).toBe(PW_MODE.duel.reward);
    expect(s.pvp!.seats[0]!.kills).toBe(2);
    expect(s.pvp!.wins).toEqual({ 0: 2 });
  }, 60000);

  it("친구와 같이: 사람 둘은 같은 편(3대3) · 1대1이면 서로 맞대결", () => {
    const t = createPvp(2, "trio", [{ characterId: "warden" }, { characterId: "mage" }]);
    expect(t.pvp!.seats.slice(0, 2).map((x) => [x.human, x.team])).toEqual([[true, 0], [true, 0]]);
    const d = createPvp(2, "duel", [{ characterId: "warden" }, { characterId: "mage" }]);
    expect(d.pvp!.seats.map((x) => x.team)).toEqual([0, 1]);
  });
});
