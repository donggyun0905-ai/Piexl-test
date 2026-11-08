import { describe, expect, it } from "vitest";
import { ROOM_COLS, ROOM_ROWS, TILE_SIZE } from "../constants";
import { SILVER_BULLET as B } from "../weaponsSilverBullet";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { bodyFits } from "./layout";
import { enemy, FIRE } from "./perkTestUtil";
import { roomGrid } from "./util";

function sb(x = 140, ...perks: string[]): RunState {
  const s = createRun(5, "silverBullet");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 100;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.enemies = [{ ...enemy(1, x, 100, 99999), rootTicks: 99999 }];
  return s;
}
const foe = (s: RunState) => s.enemies[0]!;
const run = (s: RunState, n: number, input = FIRE) => {
  for (let i = 0; i < n; i++) stepSim(s, input);
};

describe("실버불렛", () => {
  it("한 번 공격에 오른손 → 조금 뒤 왼손으로 은탄 두 발", () => {
    const s = sb();
    stepSim(s, FIRE);
    expect(s.player.sbShots?.filter((b) => b.k === 0).length).toBe(1);
    expect(s.player.sbShots?.some((b) => b.k === 1)).toBe(false);
    run(s, B.offTicks);
    expect(s.player.sbShots?.some((b) => b.k === 1)).toBe(true);
  });

  it("맞힌 은탄마다 마크가 박히고 모든 공격에 달빛이 걸림", () => {
    const s = sb();
    const hp = foe(s).hp;
    run(s, 40);
    expect(foe(s).hp).toBeLessThan(hp);
    expect(foe(s).sbMarks ?? 0).toBeGreaterThan(0);
    expect(foe(s).moon ?? 0).toBeGreaterThan(0);
  });

  it("마크가 30이면 연사 (두 발씩 몰아 쏨 · 성흔 안 참)", () => {
    const s = sb();
    foe(s).sbMarks = B.markNeed;
    stepSim(s, FIRE);
    expect(s.player.sbBarrage).toBeDefined();
    expect(foe(s).sbMarks).toBe(0);
    const g = s.player.sgGauge ?? 0;
    run(s, 30);
    expect(s.player.sbShots?.some((b) => b.k === 3)).toBe(true);
    expect(s.player.sgGauge ?? 0).toBe(g);
  });

  it("몇 번마다 성수 폭탄을 던져 둘레를 정화", () => {
    const s = sb(120);
    s.player.sbCount = B.bombEvery - 1;
    stepSim(s, FIRE);
    expect(s.player.sbBombs?.length).toBe(1);
    run(s, B.bombFly + 1);
    expect(s.effects.some((e) => e.kind === "sbBombFx")).toBe(true);
  });

  it("성흔이 가득 차면 달빛 각성 · 몸이 고정되고 은빛 활 일제 사격 (가운데·양끝 유도)", () => {
    const s = sb();
    s.player.sgGauge = 99.5;
    run(s, 30);
    expect(s.player.sgAwake ?? 0).toBeGreaterThan(0);
    expect(s.player.sbUlt ?? 0).toBeGreaterThan(0);
    expect(s.effects.some((e) => e.kind === "sbBowFx")).toBe(true);
    const x = s.player.x;
    run(s, 10, { ...FIRE, moveX: 1 });
    expect(s.player.x).toBe(x);
    expect(s.player.sbShots?.some((b) => b.k === 5 && b.turn !== undefined)).toBe(true);
    expect(s.player.sbShots?.some((b) => b.k === 4)).toBe(true);
  });

  it("대시하면 가까운 적에게 은탄 두 발 · 장애물을 넘어감", () => {
    const s = sb();
    s.map.rooms[s.roomId]!.shape = { id: -1, flip: false, rows: [".............", ".............", ".............", "......#......", ".............", ".............", "............."] };
    const g = roomGrid(s)!;
    let wx = 0;
    let wy = 0;
    for (let i = 0; i < g.length && !wx; i++) {
      const [c, r] = [i % ROOM_COLS, Math.floor(i / ROOM_COLS)];
      if (g[i] === 1 && c > 0 && c < ROOM_COLS - 1 && r > 0 && r < ROOM_ROWS - 1) [wx, wy] = [c * TILE_SIZE + 8, r * TILE_SIZE + 8];
    }
    expect(wx).toBeGreaterThan(0);
    s.player.x = s.player.prevX = wx - 30;
    s.player.y = s.player.prevY = wy;
    stepSim(s, { ...FIRE, attack: false, dash: true, moveX: 1 });
    expect(s.player.sbShots?.filter((b) => b.k === 2).length).toBe(2);
    run(s, 30, { ...FIRE, attack: false, moveX: 0 });
    expect(s.player.x).toBeGreaterThan(wx);
    expect(bodyFits(g, s.player.x, s.player.y, s.player.r)).toBe(true);
  });
});
