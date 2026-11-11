import { describe, expect, it } from "vitest";
import { BINGSEOL_PASSIVES, BINGSEOL_PERKS as K } from "../itemsBingseol";
import { BINGSEOL_WEAPONS, BS_FIELD, BS_STYLE } from "../weaponsBingseol";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { extraOf } from "./baseStats";
import { addDust, fieldR } from "./bsKit";
import { wallSpots } from "./bsArms";
import { enemy } from "./perkTestUtil";

/** 빙설 (80, 100) 오른쪽을 봄 · 적은 묶어 둠 */
function bs(foes: [number, number, number?][] = [[110, 100]], weapon = "bsBlade", ...perks: string[]): RunState {
  const s = createRun(7, "bingseol");
  s.player.weaponId = weapon as never;
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 80;
  s.player.y = s.player.prevY = 100;
  s.enemies = foes.map(([x, y, hp], i) => ({ ...enemy(i + 1, x, y, hp ?? 99999), rootTicks: 99999, stunTicks: 99999 }));
  return s;
}
const hit = { ...EMPTY_INPUT, attack: true, aimX: 100, aimY: 0 };
const idle = (s: RunState, n: number) => {
  for (let i = 0; i < n; i++) stepSim(s, { ...EMPTY_INPUT, aimX: 100 });
};
/** 확률 효과를 늘 나오게 하고 fn 실행 (끝나면 되돌림) */
function sure(keys: ("bsUlt" | "bsBow" | "bsLance" | "bsSpike")[], fn: () => void): void {
  const old = keys.map((k) => K[k].chance);
  for (const k of keys) K[k].chance = 1;
  try {
    fn();
  } finally {
    keys.forEach((k, i) => (K[k].chance = old[i]!));
  }
}

describe("빙설", () => {
  it("무기 10 · 전용 패시브 10 (모두 효과 아이템)", () => {
    expect(Object.keys(BINGSEOL_WEAPONS).length).toBe(10);
    expect(Object.keys(BS_STYLE).length).toBe(10);
    expect(Object.keys(BINGSEOL_PASSIVES).length).toBe(10);
    expect(Object.values(BINGSEOL_PASSIVES).every((v) => v.exclusive === "bingseol" && v.effect)).toBe(true);
  });

  it("얼음칼: 앞 부채꼴만 벰 · 다시 베기까지 기다림", () => {
    const s = bs([[80 + BS_STYLE.bsBlade.reach - 4, 100], [60, 100]]);
    stepSim(s, hit);
    const [a, b] = s.enemies;
    expect(a!.hp).toBeLessThan(99999);
    expect(b!.hp).toBe(99999);
    const after = a!.hp;
    stepSim(s, hit);
    expect(a!.hp).toBe(after);
  });

  it("얼음 낫은 비스듬히 뒤 · 빙륜은 바로 뒤 적도 벰", () => {
    for (const [w, x, y] of [["bsScythe", 72, 80], ["bsRing", 64, 100]] as const) {
      const s = bs([[x, y]], w);
      stepSim(s, hit);
      expect(s.enemies[0]!.hp, w).toBeLessThan(99999);
    }
  });

  it("빙인 투척: 칼날이 날아가 관통 · 눈꽃 부채는 셋", () => {
    const s = bs([[120, 100], [140, 100], [160, 100]], "bsShard");
    stepSim(s, hit);
    idle(s, 30);
    expect(s.enemies.every((e) => e.hp < 99999)).toBe(true);
    const f = bs([], "bsFan");
    stepSim(f, hit);
    expect(f.player.bsShots?.filter((x) => x.kind === 0).length).toBe(3);
  });

  it("얼음 영역: 안의 적은 느려짐 · 밖은 그대로 · 눈보라 확장이면 넓어짐", () => {
    const s = bs([[100, 100], [200, 100]]);
    idle(s, 1);
    expect(s.enemies[0]!.sluggish ?? 0).toBeGreaterThan(0);
    expect(s.enemies[1]!.sluggish ?? 0).toBe(0);
    const base = fieldR(s.player);
    expect(base).toBeCloseTo(BS_FIELD.r);
    const t = bs([], "bsBlade", "bsStorm");
    expect(fieldR(t.player)).toBeGreaterThan(base);
  });

  it("얼음가루: 공격마다 3~5개 · 30개까지 · 닿으면 고정 피해 2", () => {
    const s = bs([], "bsBlade", "bsDust");
    stepSim(s, hit);
    const n = s.player.bsDust!.length;
    expect(n).toBeGreaterThanOrEqual(K.bsDust.min);
    expect(n).toBeLessThanOrEqual(K.bsDust.max);
    for (let i = 0; i < 20; i++) {
      s.player.bsCd = 0;
      stepSim(s, hit);
    }
    expect(s.player.bsDust!.length).toBeLessThanOrEqual(K.bsDust.cap);
    const d = s.player.bsDust![0]!;
    s.enemies = [{ ...enemy(9, d.x, d.y, 100), rootTicks: 999, stunTicks: 999 }];
    s.player.bsDust = [d];
    idle(s, 1);
    expect(100 - s.enemies[0]!.hp).toBeCloseTo(K.bsDust.dmg, 0);
    expect(s.player.bsDust!.length).toBe(0);
  });

  it("얼음가루(속): 5개가 모여 유도 얼음 · 3번 뒤 쉼 / (강): 10개가 모여 급속 얼음", () => {
    const s = bs([[200, 100]], "bsBlade", "bsHoming");
    idle(s, 1); // 첫 틱에 방이 정해지며 비워짐
    for (let i = 0; i < 3; i++) {
      addDust(s.player, 5, { nextFloat: () => 0.5 } as never);
      idle(s, 1);
    }
    expect(s.player.bsShots!.filter((x) => x.kind === 3).length).toBe(3);
    expect(s.player.bsRest5).toBeGreaterThan(0);
    const r = bs([[200, 100]], "bsBlade", "bsRapid");
    idle(r, 1);
    addDust(r.player, 10, { nextFloat: () => 0.5 } as never);
    idle(r, 1);
    const sh = r.player.bsShots!.find((x) => x.kind === 4)!;
    expect(sh.pierce).toBeGreaterThan(100);
    expect(r.player.bsDust!.length).toBe(0);
  });

  it("빙설무장-창: 4~7개가 차례로 생겨 날아감 · 빙설무장-활: 둘까지 좌우", () => {
    sure(["bsLance", "bsBow"], () => {
      const s = bs([[200, 100]], "bsBlade", "bsLance", "bsBow");
      for (let i = 0; i < 3; i++) {
        s.player.bsCd = 0;
        stepSim(s, hit);
      }
      const spears = s.player.bsShots!.filter((x) => x.kind === 1);
      expect(spears.length).toBeGreaterThanOrEqual(K.bsLance.min);
      expect(new Set(spears.map((x) => x.at)).size).toBeGreaterThan(1);
      const bows = s.player.bsBows!;
      expect(bows.length).toBe(2);
      expect(bows[0]!.side).toBe(-bows[1]!.side);
      idle(s, 60);
      expect(s.enemies[0]!.hp).toBeLessThan(99999);
    });
  });

  it("빙격: 앞에 솟아 구속 (보스가 아니면 경직)", () => {
    sure(["bsSpike"], () => {
      const s = bs([[80 + K.bsSpike.dist, 100]], "bsBlade", "bsSpike");
      s.enemies[0]!.stunTicks = 0;
      stepSim(s, hit);
      expect(s.enemies[0]!.stunTicks).toBeGreaterThan(30);
      expect(s.effects.some((f) => f.kind === "bsSpike")).toBe(true);
    });
  });

  it("영역강화: 방어력 +10 · 결정 5개가 적 탄을 막음", () => {
    const s = bs([], "bsBlade", "bsWall");
    expect(extraOf(s.player).defense - extraOf(bs().player).defense).toBe(K.bsWall.defense);
    const [x, y] = wallSpots(s.player)[0]!;
    s.projectiles.push({ id: 999, x, y, r: 3, vx: 0, vy: 0, damage: 5, ticksLeft: 60, fromPlayer: false } as never);
    idle(s, 1);
    expect(s.projectiles.find((p) => p.id === 999)?.ticksLeft ?? 0).toBe(0);
  });

  it("궁극기 빙설창: 3초 기를 모은 뒤 날아가 적마다 멈춰 60번 · 슬로우 동안 적이 쉼 · 맵 끝에서 사라짐", () => {
    sure(["bsUlt"], () => {
      const s = bs([[140, 100], [200, 100]], "bsBlade", "bsUlt");
      s.player.weaponId = "bsShard" as never; // 칼날이 앞 적을 먼저 맞히지 않게 바로 던지기만
      stepSim(s, { ...hit });
      expect(s.player.bsUlt).toBeTruthy();
      const hp0 = s.enemies.map((e) => e.hp);
      idle(s, K.bsUlt.charge - 2);
      expect(s.player.bsUlt!.pause).toBe(0);
      let paused = false;
      for (let i = 0; i < 400 && s.player.bsUlt; i++) {
        idle(s, 1);
        if ((s.player.bsUlt?.pause ?? 0) > 0) paused = true;
      }
      expect(paused).toBe(true);
      expect(s.player.bsUlt).toBeUndefined();
      expect(s.enemies.every((e, i) => e.hp < hp0[i]!)).toBe(true);
    });
  });

  it("같은 시드면 같은 결과", () => {
    const run = () => {
      const s = bs([[110, 100], [130, 90]], "bsBlade", "bsDust", "bsLance", "bsSpike", "bsHoming");
      for (let i = 0; i < 120; i++) stepSim(s, hit);
      return s.enemies.map((e) => e.hp);
    };
    expect(run()).toEqual(run());
  });
});
