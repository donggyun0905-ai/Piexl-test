import { describe, expect, it } from "vitest";
import { HONRYEONG_PASSIVES, HONRYEONG_PERKS as K } from "../itemsHonryeong";
import { HONRYEONG_WEAPONS, HR_CLOUD, HR_STYLE } from "../weaponsHonryeong";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { addCloud, cloudR, hrLure } from "./hrKit";
import { dragonTicks } from "./hrSpirits";
import { enemy } from "./perkTestUtil";

/** 혼령 (80, 100) 오른쪽을 봄 · 적은 묶어 둠 */
function hr(foes: [number, number, number?][] = [[110, 100]], weapon = "hrPipe", ...perks: string[]): RunState {
  const s = createRun(7, "honryeong");
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
type Chance = "hrWolf" | "hrTiger" | "hrOwl" | "hrDragon" | "hrDecoy" | "hrFear";
/** 확률 효과를 늘 나오게 하고 fn 실행 (끝나면 되돌림) */
function sure(keys: Chance[], fn: () => void): void {
  const old = keys.map((k) => K[k].chance);
  for (const k of keys) K[k].chance = 1;
  try {
    fn();
  } finally {
    keys.forEach((k, i) => (K[k].chance = old[i]!));
  }
}
/** 내 자리에 구름을 놓아 은신 */
const hide = (s: RunState) => (s.player.hrClouds ??= []).push({ x: s.player.x, y: s.player.y, r: 40, age: 0, pic: 0 });

describe("혼령", () => {
  it("무기 10 · 전용 패시브 10 (모두 효과 아이템·능력치)", () => {
    expect(Object.keys(HONRYEONG_WEAPONS).length).toBe(10);
    expect(Object.keys(HR_STYLE).length).toBe(10);
    expect(Object.keys(HONRYEONG_PASSIVES).length).toBe(10);
    for (const d of Object.values(HONRYEONG_PASSIVES)) expect(d.effect && d.mods.length > 0).toBe(true);
    for (const id of Object.keys(HONRYEONG_PASSIVES)) expect(K[id as keyof typeof K]).toBeTruthy();
  });

  it("연기용: 앞 줄 위 적만 맞음 · 공격마다 구름 하나", () => {
    const s = hr([[120, 100], [80, 60], [40, 100]]);
    stepSim(s, hit);
    expect(s.enemies[0]!.hp).toBeLessThan(99999);
    expect(s.enemies[1]!.hp).toBe(99999);
    expect(s.enemies[2]!.hp).toBe(99999);
    expect(s.player.hrClouds!.length).toBe(1);
    expect(s.effects.some((e) => e.kind === "hrBreath")).toBe(true);
  });

  it("구름: 30개까지 · 같은 곳에 겹쳐 생기지 않음 · 10초 뒤 사라짐", () => {
    const s = hr([]);
    for (let i = 0; i < 40; i++) addCloud(s);
    const list = s.player.hrClouds!;
    expect(list.length).toBe(HR_CLOUD.cap);
    let near = Infinity;
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) near = Math.min(near, Math.hypot(list[i]!.x - list[j]!.x, list[i]!.y - list[j]!.y));
    expect(near).toBeGreaterThan(cloudR() * 0.4);
    stepSim(s, { ...EMPTY_INPUT, aimX: 100 });
    idle(s, HR_CLOUD.life);
    expect(s.player.hrClouds!.length).toBe(0);
  });

  it("은신: 구름 안이면 적이 내 자리가 아닌 어긋난 자리를 겨눔", () => {
    const s = hr();
    idle(s, 1);
    expect(s.player.hrHidden).toBe(false);
    expect(hrLure(s, s.enemies[0]!)).toBeNull();
    hide(s);
    idle(s, 1);
    expect(s.player.hrHidden).toBe(true);
    const at = hrLure(s, s.enemies[0]!)!;
    expect(Math.hypot(at.x - s.player.x, at.y - s.player.y)).toBeGreaterThan(20);
  });

  it("무기 속성: 불씨 화상 · 서리 느려짐 · 독초 중독 · 혈연초 출혈 · 몽환 구름 둘", () => {
    const one = (w: string) => {
      const s = hr([[110, 100]], w);
      stepSim(s, hit);
      return s;
    };
    expect(one("hrEmber").enemies[0]!.burnTicks).toBeGreaterThan(0);
    expect(one("hrFrost").enemies[0]!.slowTicks).toBeGreaterThan(0);
    expect(one("hrVenom").enemies[0]!.poisonTicks).toBeGreaterThan(0);
    expect(one("hrBlood").enemies[0]!.bleedTicks).toBeGreaterThan(0);
    expect(one("hrDream").player.hrClouds!.length).toBe(2);
  });

  it("혼-랑·혼-범: 늑대 둘·범 하나가 나와 적을 공격", () => {
    sure(["hrWolf", "hrTiger"], () => {
      const s = hr([[110, 100]], "hrPipe", "hrWolf", "hrTiger");
      stepSim(s, hit);
      const b = s.player.hrBeasts!;
      expect(b.filter((x) => x.kind === 0).length).toBe(2);
      expect(b.filter((x) => x.kind === 1).length).toBe(1);
      expect(b.find((x) => x.kind === 1)!.hp).toBeGreaterThan(b.find((x) => x.kind === 0)!.hp);
      const hp = s.enemies[0]!.hp;
      idle(s, 90);
      expect(s.enemies[0]!.hp).toBeLessThan(hp);
      expect(s.effects.some((e) => e.kind === "hrBite" || e.kind === "hrClaw")).toBe(true);
    });
  });

  it("혼-효: 부엉이는 둘까지 · 범위 안 적에게 날아 낙하 → 그 자리에 앉음", () => {
    sure(["hrOwl"], () => {
      const s = hr([[150, 100]], "hrShort", "hrOwl");
      for (let i = 0; i < 5; i++) {
        stepSim(s, hit);
        idle(s, 20);
      }
      expect(s.player.hrOwls!.length).toBe(K.hrOwl.max);
      const hp = s.enemies[0]!.hp;
      idle(s, 120);
      expect(s.enemies[0]!.hp).toBeLessThan(hp);
      expect(s.player.hrOwls!.some((o) => Math.hypot(o.x - 150, o.y - 100) < 1)).toBe(true);
    });
  });

  it("혼-룡: 방의 모든 적을 60번 따로 때림", () => {
    sure(["hrDragon"], () => {
      const s = hr([[110, 100], [30, 30]], "hrPipe", "hrDragon");
      idle(s, 1);
      s.player.hrCd = 9999;
      s.player.hrDragon = { t: 0, dmg: 1 };
      const far = s.enemies[1]!;
      let hits = 0;
      for (let i = 0; i < dragonTicks() + 5; i++) {
        const hp = far.hp;
        idle(s, 1);
        if (far.hp < hp) hits++;
      }
      expect(hits).toBe(K.hrDragon.hits);
      expect(s.player.hrDragon).toBeUndefined();
    });
  });

  it("혼-영: 분신은 넷까지 · 적이 분신을 쫓음 · 쓰러지면 연기가 터져 피해", () => {
    sure(["hrDecoy"], () => {
      const s = hr([[84, 100]], "hrLong", "hrDecoy");
      stepSim(s, hit);
      expect(s.player.hrDecoys!.length).toBe(1);
      const d = s.player.hrDecoys![0]!;
      expect(hrLure(s, s.enemies[0]!)).toBe(d);
      s.player.hrCd = 9999;
      d.hp = 0;
      const hp = s.enemies[0]!.hp;
      idle(s, 1);
      expect(s.player.hrDecoys!.length).toBe(0);
      expect(s.enemies[0]!.hp).toBeLessThan(hp);
      expect(s.effects.some((e) => e.kind === "hrPop")).toBe(true);
    });
  });

  it("혼령사냥: 은신한 늑대 첫 타격 치명타·출혈 · 범이 커짐 · 부엉이는 멀리 있는 적도 공격", () => {
    sure(["hrWolf", "hrTiger", "hrOwl"], () => {
      const s = hr([[110, 100], [220, 100]], "hrPipe", "hrWolf", "hrTiger", "hrOwl", "hrHunt");
      idle(s, 1);
      hide(s);
      stepSim(s, hit);
      s.player.hrCd = 9999;
      idle(s, 60);
      const tiger = s.player.hrBeasts!.find((b) => b.kind === 1)!;
      expect(tiger.big).toBe(true);
      expect(tiger.r).toBeCloseTo(K.hrTiger.r * K.hrHunt.size);
      expect(s.player.hrBit!.length).toBeGreaterThan(0);
      expect(s.enemies[0]!.bleedTicks).toBeGreaterThan(0);
      // 부엉이: 찾는 거리 밖 적 (혼령사냥이 없으면 가만히 · 있으면 날아가 공격)
      for (const hunt of [false, true]) {
        const o = hr([[80 + K.hrOwl.range + 40, 100]], "hrPipe", "hrOwl", ...(hunt ? ["hrHunt"] : []));
        stepSim(o, hit);
        o.player.hrCd = 9999;
        idle(o, 120);
        expect(o.enemies[0]!.hp < 99999).toBe(hunt);
      }
    });
  });

  it("혼-귀: 구름 안 적이 공포 · 짙은 연기: 구름 안 적 피해 · 깊은 들숨: 은신 중 회복", () => {
    sure(["hrFear"], () => {
      const s = hr([[90, 100]], "hrPipe", "hrFear", "hrThick", "hrBreath");
      s.enemies[0]!.stunTicks = 0;
      idle(s, 1);
      hide(s);
      s.player.hp = 10;
      idle(s, K.hrBreath.every + 1);
      expect(s.enemies[0]!.hp).toBeLessThan(99999);
      expect(s.effects.some((e) => e.kind === "hrFear") || (s.enemies[0]!.fearTicks ?? 0) > 0).toBe(true);
      expect(s.player.hp).toBeGreaterThan(10);
    });
  });

  it("같은 시드·같은 입력이면 같은 결과", () => {
    const run = () => {
      const s = hr([[110, 100]], "hrDream", "hrWolf", "hrTiger", "hrOwl", "hrDragon", "hrDecoy", "hrHunt", "hrFear");
      for (let i = 0; i < 400; i++) stepSim(s, hit);
      return JSON.stringify([s.player.hrClouds, s.player.hrBeasts, s.player.hrOwls, s.enemies[0]!.hp]);
    };
    expect(run()).toBe(run());
  });
});
