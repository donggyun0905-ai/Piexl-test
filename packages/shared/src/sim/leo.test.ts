import { describe, expect, it } from "vitest";
import { LEO_PASSIVES } from "../itemsLeo";
import { WEAPONS } from "../content";
import { LEO as L } from "../weaponsLeo";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { damagePlayer } from "./combat";
import { characterWeapons } from "./loot";
import { enemy, FIRE } from "./perkTestUtil";

function leo(...perks: string[]): RunState {
  const s = createRun(7, "leo");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [{ ...enemy(1, 70, 72, 99999), rootTicks: 99999 }];
  return s;
}
const IDLE = { ...FIRE, attack: false };
/** 적을 제자리에 두고 n틱 */
function hold(s: RunState, n: number, input = FIRE, stop = () => false): void {
  const at = s.enemies.map((e) => [e.x, e.y] as const);
  for (let i = 0; i < n && !stop(); i++) {
    stepSim(s, input);
    s.enemies.forEach((e, k) => ([e.x, e.y] = at[k]!));
  }
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);

describe("레오", () => {
  it("무기는 뇌전 발톱 하나뿐 · 전용 아이템 10", () => {
    expect(characterWeapons("leo")).toEqual(["leClaw"]);
    expect(WEAPONS.leClaw).toMatchObject({ kind: "lion", exclusive: "leo" });
    expect(Object.keys(LEO_PASSIVES)).toHaveLength(10);
  });

  it("발톱으로 맞힌 적에 뇌인이 쌓이고 세 번째마다 번개 물기", () => {
    const s = leo();
    hold(s, 120);
    expect(lost(s)).toBeGreaterThan(0);
    expect(s.enemies[0]!.leMark).toBeGreaterThan(0);
    expect(s.effects.some((f) => f.kind === "leBite") || (s.player.leHits ?? 0) >= L.biteEvery).toBe(true);
  });

  it("전하가 가득하면 사자후: 멀리 있는 적까지 방 안 모든 적에게 낙뢰", () => {
    const s = leo();
    s.enemies.push({ ...enemy(2, 200, 40, 99999), rootTicks: 99999 });
    hold(s, 1200, FIRE, () => !!s.player.leRoars);
    expect(s.player.leRoars).toBeGreaterThanOrEqual(1);
    expect(s.enemies[1]!.hp).toBeLessThan(s.enemies[1]!.maxHp);
  });

  it("보석 낙뢰: 공격하지 않아도 가장 먼 적을 침", () => {
    const s = leo();
    s.enemies = [{ ...enemy(1, 220, 40, 99999), rootTicks: 99999 }];
    for (let i = 0; i < L.gemEvery + 5; i++) stepSim(s, IDLE);
    expect(lost(s)).toBeGreaterThan(0);
    expect(s.enemies[0]!.leMark).toBe(1);
  });

  it("백수의 왕: 뇌인 최대 5겹", () => {
    const s = leo("leKing");
    hold(s, 200);
    expect(s.enemies[0]!.leMark ?? 0).toBeGreaterThan(L.markMax);
  });

  it("뇌광 도약: 대시하면 앞쪽 적 곁으로 뛰어듦", () => {
    const s = leo("lePounce");
    s.enemies = [{ ...enemy(1, 140, 72, 99999), rootTicks: 99999 }];
    stepSim(s, { ...IDLE, dash: true, moveX: 1, moveY: 0 });
    expect(s.player.x).toBeGreaterThan(110);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("뇌운: 몇 초마다 방 어딘가의 적에게 낙뢰", () => {
    const s = leo("leStorm");
    s.enemies = [{ ...enemy(1, 220, 40, 99999), rootTicks: 99999 }];
    s.player.leGem = 99999;
    for (let i = 0; i < 100; i++) stepSim(s, IDLE);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("황금 갑주: 받는 피해가 줄고 둘레에 방전", () => {
    const a = leo();
    const b = leo("leArmor");
    damagePlayer(a, 20);
    damagePlayer(b, 20);
    expect(b.player.hp).toBeGreaterThan(a.player.hp);
    expect(lost(b)).toBeGreaterThan(0);
  });

  it("사자의 긍지·연쇄 뇌전: 둘레 적이 많으면 더 아픔", () => {
    const many = (perk: string) => {
      const s = leo(perk);
      s.enemies = [0, 1, 2, 3].map((i) => ({ ...enemy(i + 1, 66 + i * 4, 64 + i * 6, 99999), rootTicks: 99999 }));
      hold(s, 90);
      return lost(s);
    };
    expect(many("lePride")).toBeGreaterThan(many("leRoar"));
    expect(many("leChain")).toBeGreaterThan(many("leRoar"));
  });

  it("같은 시드면 같은 결과", () => {
    const a = leo("leStorm", "leChain");
    const b = leo("leStorm", "leChain");
    for (let i = 0; i < 300; i++) {
      stepSim(a, FIRE);
      stepSim(b, FIRE);
    }
    expect(lost(a)).toBe(lost(b));
  });
});
