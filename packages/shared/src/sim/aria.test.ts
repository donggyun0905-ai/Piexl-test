import { describe, expect, it } from "vitest";
import { ARIA_PASSIVES, ARIA_PERKS as K } from "../itemsAria";
import { AR_FINALE, AR_NOTE, AR_STYLE, ARIA_WEAPONS } from "../weaponsAria";
import { allInstruments, checkBurst } from "./arBurst";
import { arTaken } from "./arLull";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { enemy } from "./perkTestUtil";

/** 아리아 (80, 100) 오른쪽을 봄 · 적은 묶어 둠 */
function ar(foes: [number, number, number?][] = [[140, 100]], weapon = "arBaton", ...perks: string[]): RunState {
  const s = createRun(7, "aria");
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
/** 음표 8종을 방에 하나씩 (적에게 닿지 않는 곳) */
function eight(s: RunState): void {
  s.player.arNotes = [...Array(8).keys()].map((k) => ({ bx: 60 + k * 10, by: 40, dx: 1, dy: 0, spd: 0, bob: 0, age: 0, kind: k, r: 8, dmg: 1, hit: [], bounce: 0, x: 60 + k * 10, y: 40, prevX: 0, prevY: 0 }));
}
type Chance = "arPiano" | "arHarp" | "arHorn" | "arClarinet";
function sure(keys: Chance[], fn: () => void): void {
  const old = keys.map((k) => K[k].chance);
  for (const k of keys) K[k].chance = 1;
  try {
    fn();
  } finally {
    keys.forEach((k, i) => (K[k].chance = old[i]!));
  }
}

describe("아리아", () => {
  it("무기 10 · 전용 패시브 10 (모두 효과 아이템·능력치·수치)", () => {
    expect(Object.keys(ARIA_WEAPONS).length).toBe(10);
    expect(Object.keys(AR_STYLE).length).toBe(10);
    expect(Object.keys(ARIA_PASSIVES).length).toBe(10);
    for (const d of Object.values(ARIA_PASSIVES)) expect(d.effect && d.mods.length > 0).toBe(true);
    for (const id of Object.keys(ARIA_PASSIVES)) expect(K[id as keyof typeof K]).toBeTruthy();
  });

  it("음표: 느리게 둥실거리며 나아가 적을 뚫고 지나감(적마다 한 번) · 방 끝에서 사라짐", () => {
    const s = ar([[110, 100], [150, 100]]);
    stepSim(s, hit);
    expect(s.player.arNotes!.length).toBe(1);
    const n = s.player.arNotes![0]!;
    const ys = new Set<number>();
    for (let i = 0; i < 80; i++) {
      idle(s, 1);
      ys.add(Math.round(n.y));
    }
    expect(ys.size).toBeGreaterThan(3);
    expect(s.enemies[0]!.hp).toBeLessThan(99999);
    expect(s.enemies[1]!.hp).toBeLessThan(99999);
    const once = 99999 - s.enemies[0]!.hp;
    idle(s, 60);
    expect(99999 - s.enemies[0]!.hp).toBe(once);
    idle(s, AR_NOTE.life);
    expect(s.player.arNotes!.length).toBe(0);
  });

  it("서로 다른 음표 8개가 모이면 모두 다른 색으로 크게 터짐", () => {
    const s = ar([[90, 40]]);
    eight(s);
    checkBurst(s);
    expect(s.player.arNotes!.length).toBe(0);
    const fx = s.effects.filter((e) => e.kind === "arBurst");
    expect(new Set(fx.map((e) => e.style)).size).toBe(8);
    expect(s.enemies[0]!.hp).toBeLessThan(99999);
    expect(s.player.dmgBy?.["f:arBurst"]).toBeGreaterThan(0);
  });

  it("같은 종류만 많으면 터지지 않음 · 공격하다 보면 8종이 모여 터짐", () => {
    const s = ar([]);
    eight(s);
    s.player.arNotes![7]!.kind = 0;
    checkBurst(s);
    expect(s.player.arNotes!.length).toBe(8);
    const t = ar([]);
    for (let i = 0; i < 400 && !t.player.arBursts; i++) stepSim(t, hit);
    expect(t.player.arBursts).toBeGreaterThan(0);
  });

  it("무기마다 다름: 트럼펫 셋 · 화음 하나 더(다른 종류)", () => {
    const s = ar([], "arTrumpet");
    stepSim(s, hit);
    expect(s.player.arNotes!.length).toBe(3);
    const c = ar([], "arBaton", "arChord");
    stepSim(c, hit);
    const k = c.player.arNotes!.map((n) => n.kind);
    expect(k.length).toBe(2);
    expect(k[0]).not.toBe(k[1]);
  });

  it("돌림노래: 방 끝에서 한 번 튕겨 돌아옴", () => {
    const s = ar([], "arBaton", "arCanon");
    s.player.x = 300;
    stepSim(s, hit);
    let back = false;
    for (let i = 0; i < 600 && s.player.arNotes!.length; i++) {
      idle(s, 1);
      if (s.player.arNotes![0] && s.player.arNotes![0].dx < 0) back = true;
    }
    expect(back).toBe(true);
  });

  it("악기 넷: 공격마다 확률로 방에 놓임 · 피아노·하프 하나, 호른·클라리넷 둘까지 · 악기 음표는 그 패시브 이름으로", () => {
    const s = ar([[200, 100]], "arBaton", "arPiano", "arHarp", "arHorn", "arClarinet");
    sure(["arPiano", "arHarp", "arHorn", "arClarinet"], () => {
      for (let i = 0; i < 10; i++) {
        stepSim(s, hit);
        idle(s, 30);
      }
    });
    const n = [0, 1, 2, 3].map((k) => s.player.arInst!.filter((i) => i.kind === k).length);
    expect(n).toEqual([1, 1, 2, 2]);
    expect(allInstruments(s)).toBe(true);
    idle(s, 200);
    for (const id of ["arPiano", "arHarp", "arHorn"]) expect(s.player.dmgBy?.[id]).toBeGreaterThan(0);
  });

  it("클라리넷: 적을 따라가 둘레 적이 받는 피해가 늘어남", () => {
    const s = ar([[200, 100]], "arBaton", "arClarinet");
    sure(["arClarinet"], () => stepSim(s, hit));
    idle(s, 200);
    expect(arTaken(s, s.enemies[0]!)).toBe(K.arClarinet.taken);
  });

  it("악보 완성: 악기 넷이 있을 때 여덟 음표가 터지면 10초 동안 방 전체에 폭죽", () => {
    const s = ar([[150, 120], [250, 60]], "arBaton", "arPiano", "arHarp", "arHorn", "arClarinet");
    idle(s, 1);
    s.player.arInst = [0, 1, 2, 3].map((kind) => ({ kind, x: 40, y: 40, prevX: 40, prevY: 40, left: 9999, cd: 9999, face: 1 }));
    eight(s);
    idle(s, 1);
    expect(s.player.arFinale).toBeGreaterThan(0);
    idle(s, AR_FINALE.ticks);
    expect(s.player.arFinale).toBeUndefined();
    const booms = s.effects.filter((e) => e.kind === "arBoom");
    expect(new Set(booms.map((e) => e.style)).size).toBeGreaterThan(4);
    expect(s.player.dmgBy?.["f:arFinale"]).toBeGreaterThan(0);
  });

  it("악기가 모자라면 악보 완성 없음 · 앙코르는 같은 자리에서 한 번 더", () => {
    const s = ar([[90, 40]], "arBaton", "arEncore");
    idle(s, 1);
    eight(s);
    idle(s, 1);
    expect(s.player.arFinale).toBeUndefined();
    idle(s, K.arEncore.delay + 2);
    expect(s.player.dmgBy?.arEncore).toBeGreaterThan(0);
  });

  it("영혼의 바이올린: 가까운 적을 활로 벰 (바이올린 이름으로)", () => {
    const s = ar([[90, 90]], "arBaton", "arViolin");
    idle(s, 120);
    expect(s.player.dmgBy?.arViolin).toBeGreaterThan(0);
  });

  it("방을 옮기면 음표·악기가 사라짐 · 같은 시드는 같은 결과", () => {
    const run = () => {
      const s = ar([[200, 100], [220, 140]], "arTrumpet", "arPiano", "arChord");
      for (let i = 0; i < 300; i++) stepSim(s, hit);
      return [s.enemies.map((e) => e.hp), s.player.arNotes!.map((n) => n.kind)];
    };
    expect(run()).toEqual(run());
    const s = ar();
    stepSim(s, hit);
    s.roomId++;
    idle(s, 1);
    expect(s.player.arNotes!.length).toBe(0);
  });
});
