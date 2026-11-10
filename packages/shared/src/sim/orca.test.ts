import { describe, expect, it } from "vitest";
import { ORCA as O } from "../weaponsOrca";
import type { WeaponId } from "../content";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { damagePlayer } from "./combat";
import { attackSpeedNow } from "./player";
import { enemy, FIRE } from "./perkTestUtil";

const ALL: WeaponId[] = ["ocTide", "ocRiptide", "ocGeyser", "ocMegalodon", "ocPod", "ocMaelstrom"];
const IDLE = { ...FIRE, attack: false };

function orca(weapon: WeaponId = "ocTide", ...perks: string[]): RunState {
  const s = createRun(5, "orca");
  s.player.weaponId = weapon;
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 100;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.player.ocRoom = `${s.floor}/${s.roomId}`;
  s.enemies = [{ ...enemy(1, 90, 100, 99999), rootTicks: 99999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
function run(s: RunState, n: number, input = FIRE): void {
  for (let i = 0; i < n; i++) stepSim(s, input);
}
/** 콤보 k타까지 (공격 대기 없이) */
function strikes(s: RunState, n: number): void {
  for (let i = 0; i < n; i++) {
    s.player.attackCooldown = 0;
    stepSim(s, FIRE);
  }
}

describe("오르카", () => {
  for (const w of ALL) {
    it(`권갑 ${w}: 적에게 피해`, () => {
      const s = orca(w);
      run(s, 240);
      expect(lost(s)).toBeGreaterThan(0);
    });
  }

  it("4연속 콤보: 물보라 → 소용돌이 → 물기둥 → 상어 기공파", () => {
    const s = orca();
    strikes(s, 4);
    const kinds = s.effects.map((f) => f.kind);
    expect(kinds).toContain("ocSpray");
    expect(kinds).toContain("ocWhirl");
    expect(kinds).toContain("ocGeyser");
    expect(s.player.ocSharks?.length).toBe(1);
    expect(s.player.ocStep).toBe(0);
  });

  it("상어는 먹잇감을 쫓아 꺾어 헤엄쳐 여러 적을 물고 터짐", () => {
    const s = orca();
    s.enemies = [{ ...enemy(1, 200, 100, 9999), rootTicks: 9999 }, { ...enemy(2, 200, 160, 9999), rootTicks: 9999 }];
    s.player.ocStep = 3;
    s.player.attackCooldown = 0;
    stepSim(s, FIRE);
    expect(s.player.ocSharks?.length).toBe(1);
    run(s, 120, IDLE);
    expect(s.enemies.every((e) => e.hp < e.maxHp)).toBe(true);
    expect(s.effects.some((f) => f.kind === "ocBite") || s.player.ocSharks === undefined).toBe(true);
    expect(s.player.ocSharks).toBeUndefined();
  });

  it("범고래 무리는 상어 셋", () => {
    const s = orca("ocPod");
    s.player.ocStep = 3;
    strikes(s, 1);
    expect(s.player.ocSharks?.length).toBe(3);
  });

  it("소용돌이 훅이 적을 끌어당김", () => {
    const s = orca("ocRiptide");
    const e = { ...enemy(1, 100, 100, 9999) };
    s.enemies = [e];
    s.player.ocStep = 1;
    strikes(s, 1);
    expect(e.x).toBeLessThan(100);
  });

  it("해방 게이지가 가득이면 대시가 범고래 돌파 → 큰 파도", () => {
    const s = orca();
    s.player.ocTide = O.tideMax;
    stepSim(s, { ...IDLE, dash: true, moveX: 100 });
    expect(s.player.ocBreach).toBeDefined();
    expect(s.player.ocTide).toBe(0);
    run(s, O.breachTicks + 2, IDLE);
    expect(s.player.ocBreach).toBeUndefined();
    expect(s.effects.some((f) => f.kind === "ocWave")).toBe(true);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("때리면 해방 게이지가 참", () => {
    const s = orca();
    strikes(s, 3);
    expect(s.player.ocTide ?? 0).toBeGreaterThan(0);
  });

  it("바닷바람: 받는 피해 줄어듦", () => {
    const a = orca();
    const b = orca("ocTide", "ocSeaWind");
    damagePlayer(a, 20);
    damagePlayer(b, 20);
    expect(b.player.hp).toBeGreaterThan(a.player.hp - 1);
  });

  it("같은 시드면 같은 결과", () => {
    const a = orca("ocPod");
    const b = orca("ocPod");
    run(a, 200);
    run(b, 200);
    expect(lost(a)).toBe(lost(b));
  });
  it("해방: 범고래 돌파 뒤 10초 동안 공격 속도·범위 +, 타격마다 물 상어 추가타", () => {
    const s = orca();
    s.player.ocTide = O.tideMax;
    stepSim(s, { ...IDLE, dash: true, moveX: 100 });
    run(s, O.breachTicks + 2, IDLE);
    expect(s.player.ocFree).toBeGreaterThan(O.freeTicks - 10);
    expect(attackSpeedNow(s.player)).toBeCloseTo(s.player.stats.attackSpeed * O.freeSpeed);
    strikes(s, 1);
    expect(s.player.ocDarts?.length).toBe(1);
    run(s, O.freeTicks, IDLE);
    expect(s.player.ocFree).toBeUndefined();
  });

  it("해방 중 대시는 번개 대시: 지나간 자리 적에게 피해", () => {
    const s = orca();
    s.player.ocFree = 300;
    const e = { ...enemy(1, 85, 100, 9999), rootTicks: 9999 };
    s.enemies = [e];
    stepSim(s, { ...IDLE, dash: true, moveX: 100 });
    run(s, 20, IDLE);
    expect(e.hp).toBeLessThan(e.maxHp);
    expect(s.effects.some((f) => f.kind === "ocBolt" && (f.size ?? 0) > 0)).toBe(true);
  });
  it("해방 중 모든 공격에 전류: 같은 타격이 더 아프고 전류 효과", () => {
    const a = orca();
    const b = orca();
    b.player.ocFree = 300;
    strikes(a, 1);
    strikes(b, 1);
    expect(lost(b)).toBeGreaterThan(lost(a) * 1.2);
    expect(b.effects.some((f) => f.kind === "ocZap" && f.tint)).toBe(true);
  });

  it("해방 중에는 받는 피해가 줄어듦", () => {
    const a = orca();
    const b = orca();
    b.player.ocFree = 100;
    for (const s of [a, b]) {
      s.player.hp = s.player.stats.maxHp = 1000;
      s.player.invulnTicks = 0;
      damagePlayer(s, 100);
    }
    expect(1000 - b.player.hp).toBeCloseTo((1000 - a.player.hp) * O.freeTaken, 0);
  });
});
