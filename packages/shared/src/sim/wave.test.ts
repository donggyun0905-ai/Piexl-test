import { describe, expect, it } from "vitest";
import { WV_SKILLS } from "../itemsWave";
import { WAVE as W } from "../weaponsWave";
import type { WeaponId } from "../content";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { damagePlayer } from "./combat";
import { enemy, FIRE } from "./perkTestUtil";
import { WAVE_CASTS } from "./waveTable";

const ALL: WeaponId[] = ["wvBoard", "wvShell", "wvPrism", "wvCrown", "wvRibbon", "wvDream"];

function wave(weapon: WeaponId = "wvBoard", ...perks: string[]): RunState {
  const s = createRun(7, "wave");
  s.player.weaponId = weapon;
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 100;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.player.wvRoom = `${s.floor}/${s.roomId}`;
  s.enemies = [
    { ...enemy(1, 110, 100, 99999), rootTicks: 99999 },
    { ...enemy(2, 130, 112, 99999), rootTicks: 99999 },
    { ...enemy(3, 125, 85, 99999), rootTicks: 99999 },
  ];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
function run(s: RunState, n: number, input = FIRE): void {
  for (let i = 0; i < n; i++) stepSim(s, input);
}
/** 초승달 하나를 쏘고 적에게 닿을 때까지 (기술이 나가면 바로 멈춤) */
function shoot(s: RunState): void {
  const before = s.player.wvLast;
  for (let i = 0; i < 24 && s.player.wvLast === before; i++) stepSim(s, i < 1 ? FIRE : { ...FIRE, attack: false });
}

describe("웨이브", () => {
  for (const w of ALL) {
    it(`도구 ${w}: 초승달이 적에게 피해`, () => {
      const s = wave(w);
      run(s, 240);
      expect(lost(s)).toBeGreaterThan(0);
    });
  }

  it("기술 30개 모두 cast가 있고 이름이 겹치지 않음", () => {
    expect(WV_SKILLS.length).toBe(30);
    for (const k of WV_SKILLS) expect(WAVE_CASTS[k], k).toBeTypeOf("function");
  });

  for (const k of WV_SKILLS) {
    it(`기술 ${k}: 혼자 가지면 그 기술이 나가고 적에게 피해 (멈추지 않음)`, () => {
      const s = wave("wvBoard", k);
      s.player.wvGauge = W.gaugeMax - 1;
      shoot(s);
      expect(s.effects.some((f) => f.kind === "wvCast" && f.from === k)).toBe(true);
      // 초승달 피해를 빼고 기술만 보려고 공격을 멈추고 기다림
      const before = lost(s);
      if (k === "wvArmor") damagePlayer(s, (s.player.shieldPts ?? 0) + 1);
      for (let i = 0; i < 400; i++) {
        s.player.invulnTicks = 9;
        stepSim(s, { ...FIRE, attack: false });
      }
      if (k !== "wvMirror") expect(lost(s), k).toBeGreaterThan(before);
    });
  }

  it("상상력: 초승달이 적을 맞혀야 차고, 기술이 많을수록 빨리 참", () => {
    const one = wave("wvBoard", "wvSpear");
    const many = wave("wvBoard", ...WV_SKILLS.slice(0, 10));
    shoot(one);
    shoot(many);
    expect(one.player.wvGauge!).toBeGreaterThan(0);
    expect(many.player.wvGauge!).toBeGreaterThan(one.player.wvGauge!);
    // 적이 없으면 아무리 쏴도 안 참
    const none = wave("wvBoard", "wvSpear");
    none.enemies = [];
    run(none, 200);
    expect(none.player.wvGauge ?? 0).toBe(0);
  });

  it("전용 아이템마다 작은 능력치", () => {
    const a = wave("wvBoard");
    const b = wave("wvBoard", "wvSpear", "wvArmor");
    expect(b.player.stats.damage).toBeGreaterThan(a.player.stats.damage);
    expect(b.player.stats.maxHp).toBeGreaterThan(a.player.stats.maxHp);
  });

  it("기술은 무작위 (같은 시드는 같은 순서, 여러 가지가 나옴)", () => {
    const seen = (seed: number) => {
      const s = wave("wvShell", ...WV_SKILLS);
      s.seed = seed;
      const out: string[] = [];
      for (let i = 0; i < 400; i++) {
        stepSim(s, FIRE);
        const last = s.player.wvLast;
        if (last && last.t === s.tick - 1) out.push(last.k);
      }
      return out;
    };
    const a = seen(3);
    expect(a).toEqual(seen(3));
    expect(new Set(a).size).toBeGreaterThan(5);
  });

  it("물안개: 적 탄을 지우고 받는 피해 줄어듦", () => {
    const s = wave("wvBoard", "wvMist");
    s.player.wvGauge = W.gaugeMax - 1;
    shoot(s);
    expect(s.player.wvMist).toBeGreaterThan(0);
    const hp = s.player.hp;
    s.player.invulnTicks = 0;
    damagePlayer(s, 20);
    expect(hp - s.player.hp).toBeLessThan(20);
  });

  it("파도 타기: 무적으로 앞으로 내달림", () => {
    const s = wave("wvBoard", "wvSurf");
    s.player.wvGauge = W.gaugeMax - 1;
    shoot(s);
    run(s, 3);
    expect(s.player.x).toBeGreaterThan(70);
    expect(s.player.invulnTicks).toBeGreaterThan(0);
  });

  it("상상의 물감: 다음 기술이 정해져 있고 그대로 나감", () => {
    const s = wave("wvDream", "wvSpear", "wvWhale", "wvLotus");
    run(s, 1, { ...FIRE, attack: false });
    const next = s.player.wvNext;
    s.player.wvGauge = W.gaugeMax - 1;
    shoot(s);
    expect(s.player.wvLast?.k).toBe(next);
  });

  it("방이 바뀌면 빚은 것을 거둠", () => {
    const s = wave("wvBoard", "wvCloud");
    s.player.wvGauge = W.gaugeMax - 1;
    shoot(s);
    expect(s.player.wvBits?.length).toBeGreaterThan(0);
    s.player.wvRoom = "x";
    run(s, 1, { ...FIRE, attack: false });
    expect(s.player.wvBits ?? []).toEqual([]);
  });

  it("모은 물의 기술 5개마다 공격력 +5 · 방어력 +5 (15개면 +15)", () => {
    const a = wave();
    const b = wave("wvBoard", ...WV_SKILLS.slice(0, 15));
    const c = wave("wvBoard", ...WV_SKILLS.slice(0, 4));
    const base = a.player.stats.damage;
    expect(b.player.stats.damage - base).toBeGreaterThanOrEqual(15 * W.setAtk / 5 - 0.01);
    expect(c.player.stats.damage).toBeLessThan(b.player.stats.damage);
    for (const s of [a, b]) {
      s.player.hp = s.player.stats.maxHp = 1000;
      s.player.invulnTicks = 0;
      damagePlayer(s, 100);
    }
    expect(1000 - b.player.hp).toBeLessThan(1000 - a.player.hp);
  });
});
