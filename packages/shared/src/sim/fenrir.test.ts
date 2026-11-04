import { describe, expect, it } from "vitest";
import { FENRIR_PASSIVES, FENRIR_PERKS as K } from "../itemsFenrir";
import { CHARACTERS } from "../characters";
import { WEAPONS } from "../content";
import { FENRIR as F } from "../weaponsFenrir";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { damagePlayer } from "./combat";
import { extraOf } from "./baseStats";
import { checkDeath } from "./run";
import { characterWeapons } from "./loot";
import { enemy, FIRE } from "./perkTestUtil";

function fenrir(...perks: string[]): RunState {
  const s = createRun(7, "fenrir");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [{ ...enemy(1, 72, 72, 99999), rootTicks: 99999 }];
  return s;
}
/** 적을 제자리에 두고 n틱 (stop: 그만할 때) */
function hold(s: RunState, n: number, stop = () => false): void {
  const at = s.enemies.map((e) => [e.x, e.y] as const);
  for (let i = 0; i < n && !stop(); i++) {
    stepSim(s, FIRE);
    s.enemies.forEach((e, k) => ([e.x, e.y] = at[k]!));
  }
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
const kinds = (s: RunState) => new Set(s.effects.map((f) => f.kind));

describe("펜리르", () => {
  it("무기는 선왕의 대검 하나 · 전용 아이템 10 · 체력 45 · 회피·예리함 기본", () => {
    expect(characterWeapons("fenrir")).toEqual(["fnKingBlade"]);
    expect(WEAPONS.fnKingBlade).toMatchObject({ kind: "fang", exclusive: "fenrir" });
    expect(Object.keys(FENRIR_PASSIVES)).toHaveLength(10);
    expect(CHARACTERS.fenrir).toMatchObject({ maxHp: 45, dodge: 0.25, sharpness: 0.25 });
  });

  it("누를 때마다 한 기술: 한 번 누르면 물어 베기만 · 다시 누르면 다음 기술 · 다섯 번이면 천랑 낙인까지", () => {
    const one = fenrir();
    for (let i = 0; i < 90; i++) stepSim(one, { ...FIRE, attack: i < 3 });
    expect(one.player.fnFalls ?? 0).toBe(0);
    expect(one.effects.some((f) => f.kind === "fnWaveGo")).toBe(false);
    const s = fenrir();
    const seen = new Set<string>();
    for (let i = 0; i < 400 && !s.player.fnFalls; i++) {
      stepSim(s, { ...FIRE, attack: i % 40 < 3 });
      for (const k of kinds(s)) seen.add(k);
    }
    expect(s.player.attackCount).toBe(1);
    expect(s.player.fnFalls).toBe(1);
    for (const k of ["fnBite", "fnWaveGo", "fnScar", "fnRing", "fnCut", "fnJump", "fnLand"]) expect(seen.has(k)).toBe(true);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("천랑 낙인: 뛰어오른 동안 무적 · 내려찍으면 사방으로 검기", () => {
    const s = fenrir();
    hold(s, 200, () => (s.player.fnAir ?? 0) > 2);
    expect(s.player.fnAir).toBeGreaterThan(0);
    const hp = s.player.hp;
    damagePlayer(s, 10);
    expect(s.player.hp).toBe(hp);
    hold(s, 40, () => !!s.player.fnFalls);
    expect(s.player.fnWaves?.filter((w) => !w.big).length).toBe(F.starN);
  });

  it("천랑성: 착지 검기 12갈래", () => {
    const s = fenrir("fnStar");
    hold(s, 200, () => !!s.player.fnFalls);
    expect(s.player.fnWaves?.filter((w) => !w.big).length).toBe(K.fnStar.n);
  });

  it("지면 검기는 멀리 있는 적도 뚫고 지나감", () => {
    const s = fenrir();
    s.enemies.push({ ...enemy(2, 160, 72, 99999), rootTicks: 99999 });
    hold(s, 80);
    expect(s.enemies[1]!.hp).toBeLessThan(s.enemies[1]!.maxHp);
  });

  it("벼린 송곳니·노장의 투혼: 예리함 + · 체력이 적으면 회피 +", () => {
    const s = fenrir("fnFang", "fnVeteran");
    expect(extraOf(s.player).sharpness).toBeCloseTo(0.25 + K.fnFang.sharp);
    expect(extraOf(s.player).dodge).toBeCloseTo(0.25);
    s.player.hp = 5;
    expect(extraOf(s.player).dodge).toBeCloseTo(0.25 + K.fnVeteran.dodge);
  });

  it("선왕의 광륜: 층마다 한 번 체력 1로 버팀", () => {
    const s = fenrir("fnHalo");
    s.player.hp = 0;
    expect(checkDeath(s)).toBe(false);
    expect(s.player.hp).toBe(1);
    s.player.hp = 0;
    expect(checkDeath(s)).toBe(true);
  });

  it("같은 시드면 같은 결과", () => {
    const a = fenrir("fnMoon", "fnRift", "fnHowl");
    const b = fenrir("fnMoon", "fnRift", "fnHowl");
    hold(a, 400);
    hold(b, 400);
    expect(lost(a)).toBe(lost(b));
    expect(lost(a)).toBeGreaterThan(0);
  });
});
