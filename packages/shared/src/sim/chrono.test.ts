import { describe, expect, it } from "vitest";
import { CHARACTERS, WEAPONS, type WeaponId } from "../content";
import type { PassiveId } from "../items";
import { CHRONO_RULES, ECHO_DELAY } from "./chrono";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { weaponPool } from "./loot";
import { enemy, FIRE } from "./perkTestUtil";

/** 시간술사로 시작해 무기·아이템을 가진 채, 적 없는 방 (오른쪽을 봄) */
function chrono(weapon: WeaponId = "pocketwatch", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "chronomancer");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.enemies = [];
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 72;
  return s;
}

/** 허수아비 (움직이지 않고 밀려나도 제자리) */
function dummies(s: RunState, ...xy: [number, number][]): void {
  s.enemies = xy.map(([x, y], i) => ({ ...enemy(i + 1, x, y, 99999), kind: "dummy" as const }));
}
function step(s: RunState, n: number, input = FIRE): void {
  const home = s.enemies.map((e) => [e.x, e.y] as const);
  for (let i = 0; i < n; i++) {
    stepSim(s, input);
    s.enemies.forEach((e, k) => ([e.x, e.y] = home[k] ?? [e.x, e.y]));
  }
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);

describe("시간술사", () => {
  it("전용 무기 10개만 얻고, 회중시계로 시작", () => {
    expect(CHARACTERS.chronomancer.startWeapon).toBe("pocketwatch");
    const all = weaponPool(chrono(), true);
    expect(all).toHaveLength(9);
    for (const id of all) expect(WEAPONS[id]).toMatchObject({ exclusive: "chronomancer", kind: "chrono" });
  });

  it("본인 공격 70%, 1초 뒤 그 자리에서 잔상이 120%로 한 번 더 함 (움직여도 처음 자리에서)", () => {
    const s = chrono("clockhands");
    dummies(s, [84, 72]);
    step(s, 1);
    expect(s.player.echoes).toHaveLength(1);
    const first = lost(s);
    // 다른 곳으로 옮겨도 잔상은 처음 자리에서 휘두름
    s.player.x = s.player.prevX = 200;
    step(s, ECHO_DELAY, { ...EMPTY_INPUT });
    expect(lost(s) - first).toBeCloseTo((first * 1.2) / 0.7, 1);
    expect(s.player.echoes).toHaveLength(0);
  });

  it("패러독스: 잔상이 잔상을 한 번 더 남김 · 긴 잔향: 잔상 피해 150%", () => {
    const s = chrono("paradox");
    dummies(s, [84, 72]);
    step(s, 1);
    step(s, ECHO_DELAY, { ...EMPTY_INPUT });
    expect(s.player.echoes).toHaveLength(1);
    expect(s.player.echoes![0]!.depth).toBe(2);
    const t = chrono("clockhands", "longEcho");
    dummies(t, [84, 72]);
    step(t, 1);
    const first = lost(t);
    step(t, ECHO_DELAY, { ...EMPTY_INPUT });
    expect(lost(t) - first).toBeCloseTo((first * 1.5) / 0.7, 1);
  });

  it("스톱워치는 둘레 적을 잠깐 멈추고, 모래시계는 맞은 적을 느리게", () => {
    const s = chrono("stopwatch");
    s.enemies = [enemy(1, 80, 72)];
    step(s, 1);
    expect(s.enemies[0]!.stunTicks).toBeGreaterThan(0);
    const t = chrono("hourglass");
    t.enemies = [enemy(1, 100, 72)];
    step(t, 30);
    expect(t.enemies[0]!.slowTicks).toBeGreaterThan(0);
  });

  it("시한폭탄·예지는 잠시 뒤 터짐", () => {
    for (const w of ["timebomb", "futuresight"] as const) {
      const s = chrono(w);
      dummies(s, [110, 72]);
      step(s, 1);
      step(s, 10, { ...EMPTY_INPUT });
      expect(lost(s), w).toBe(0);
      step(s, 60, { ...EMPTY_INPUT });
      expect(lost(s), w).toBeGreaterThan(0);
    }
  });

  it("무기마다 피해 차이가 크지 않음 (적 1명 · 뭉친 적 3명)", () => {
    const measure = (id: WeaponId, n: number) => {
      const s = chrono(id);
      s.player.x = s.player.prevX = 80;
      dummies(s, ...([[100, 72], [106, 60], [106, 84]] as [number, number][]).slice(0, n));
      step(s, 600);
      return lost(s) / 10;
    };
    const ids = weaponPool(chrono(), true).concat("pocketwatch");
    const one = ids.map((id) => measure(id, 1));
    const three = ids.map((id) => measure(id, 3));
    expect(Math.min(...one)).toBeGreaterThan(Math.max(...one) / 2);
    const both = ids.map((_, i) => one[i]! + three[i]! / 2);
    expect(Math.min(...both)).toBeGreaterThan(Math.max(...both) / 2);
  });
  it("잔상에 맞을 때마다 시계 표식, 5개면 시간 붕괴 (큰 피해 · 표식 0으로)", () => {
    const s = chrono("clockhands");
    dummies(s, [80, 72]);
    let collapsed = false;
    let most = 0;
    for (let i = 0; i < 900 && !collapsed; i++) {
      step(s, 1);
      most = Math.max(most, s.enemies[0]!.clock ?? 0);
      collapsed = s.effects.some((f) => f.kind === "chCollapse");
    }
    expect(most).toBe(CHRONO_RULES.CLOCK_MAX - 1);
    expect(collapsed).toBe(true);
    expect(s.enemies[0]!.clock).toBe(0);
  });
});
