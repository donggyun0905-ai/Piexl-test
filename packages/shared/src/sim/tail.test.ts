import { describe, expect, it } from "vitest";
import { TAIL as T } from "../weaponsTail";
import type { WeaponId } from "../content";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { damagePlayer } from "./combat";
import { biteDmg, seaR } from "./tailKit";
import { enemy, FIRE } from "./perkTestUtil";

const ALL: WeaponId[] = ["tlTide", "tlHammer", "tlMako", "tlGreat", "tlStorm", "tlFrost", "tlOcean", "tlFrenzy", "tlWhirl", "tlMega"];

function tail(weapon: WeaponId = "tlTide", ...perks: string[]): RunState {
  const s = createRun(5, "tail");
  s.player.weaponId = weapon;
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [{ ...enemy(1, 90, 72, 99999), rootTicks: 99999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
const IDLE = { ...FIRE, attack: false };
function run(s: RunState, n: number, input = FIRE): void {
  for (let i = 0; i < n; i++) stepSim(s, input);
}
function press(s: RunState): void {
  s.player.attackCooldown = 0;
  stepSim(s, FIRE);
}

describe("테일", () => {
  for (const w of ALL) {
    it(`바다 ${w}: 적에게 피해`, () => {
      const s = tail(w);
      run(s, 240);
      expect(lost(s)).toBeGreaterThan(0);
    });
  }

  it("꼬리 3연타: 위→아래 · 아래→위 · 내려치기", () => {
    const s = tail();
    press(s);
    expect(s.effects.some((e) => e.kind === "tlDown")).toBe(true);
    press(s);
    expect(s.effects.some((e) => e.kind === "tlUp")).toBe(true);
    press(s);
    expect(s.effects.some((e) => e.kind === "tlSmash")).toBe(true);
    expect(s.player.tlStep).toBe(0);
  });

  it("영역 바다 안에 적이 있으면 누르지 않아도 상어가 공격", () => {
    const s = tail();
    let sharks = 0;
    for (let i = 0; i < 200; i++) {
      stepSim(s, IDLE);
      sharks = Math.max(sharks, s.player.tlSharks?.length ?? 0);
    }
    expect(lost(s)).toBeGreaterThan(0);
    expect(sharks).toBeGreaterThan(0);
  });

  it("바다 밖의 적은 상어가 건드리지 않음", () => {
    const s = tail();
    s.enemies = [{ ...enemy(1, 50 + seaR(s.player) + 40, 72, 99999), rootTicks: 99999 }];
    run(s, 200, IDLE);
    expect(lost(s)).toBe(0);
  });

  it("상어 세 가지가 모두 나옴 (삼키기 · 돌진 · 낙하)", () => {
    const s = tail("tlTide", "tlSchool");
    const seen = new Set<number>();
    for (let i = 0; i < 1500; i++) {
      stepSim(s, IDLE);
      s.enemies[0]!.x = 90;
      s.enemies[0]!.y = 72;
      for (const w of s.player.tlSharks ?? []) seen.add(w.k);
    }
    expect([...seen].sort()).toEqual([0, 1, 2]);
  });

  it("한 방에 쓰러뜨릴 적이면 물 상어가 되어 돌진해 씹어먹고 체력 회복", () => {
    const s = tail();
    s.player.hp = 50;
    s.enemies = [{ ...enemy(1, 150, 72, Math.floor(biteDmg(s.player) - 1)), rootTicks: 99999 }];
    press(s);
    expect(s.player.tlBite).toBeTruthy();
    run(s, 12, IDLE);
    expect(s.enemies.every((e) => e.hp <= 0) || s.enemies.length === 0).toBe(true);
    expect(s.player.x).toBeGreaterThan(110);
    expect(s.player.hp).toBeGreaterThan(50);
    expect(s.effects.some((e) => e.kind === "tlChomp")).toBe(true);
  });

  it("한 방에 못 쓰러뜨리면 그냥 꼬리 공격", () => {
    const s = tail();
    press(s);
    expect(s.player.tlBite).toBeFalsy();
  });

  it("같은 시드·입력이면 결과가 같음 (결정성)", () => {
    const a = tail("tlStorm", "tlRip", "tlJaws", "tlBreach");
    const b = tail("tlStorm", "tlRip", "tlJaws", "tlBreach");
    a.enemies.push(enemy(2, 70, 100, 99999));
    b.enemies.push(enemy(2, 70, 100, 99999));
    run(a, 400);
    run(b, 400);
    expect(lost(a)).toBe(lost(b));
  });

  it("해방의 물결: 받는 피해 줄어듦", () => {
    const a = tail("tlTide", "tlFreedom");
    const b = tail("tlTide");
    a.player.invulnTicks = b.player.invulnTicks = 0;
    const ha = a.player.hp;
    const hb = b.player.hp;
    damagePlayer(a, 20);
    damagePlayer(b, 20);
    expect(ha - a.player.hp).toBeLessThan(hb - b.player.hp);
  });

  it("허수아비 초당 피해가 지나치지 않음 (바다마다 10~70)", () => {
    for (const w of ALL) {
      const s = tail(w);
      for (let i = 0; i < 600; i++) {
        stepSim(s, FIRE);
        s.player.x = s.player.prevX = 50;
        s.enemies[0]!.x = 90;
        s.enemies[0]!.y = 72;
      }
      const dps = lost(s) / 10;
      expect(dps, w).toBeGreaterThan(10);
      expect(dps, w).toBeLessThan(70);
    }
  });

  it("마무리 물기 수치가 남아 있음", () => {
    expect(T.biteMul).toBeGreaterThan(1);
  });
});
