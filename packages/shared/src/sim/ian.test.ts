import { describe, expect, it } from "vitest";
import { IAN as I } from "../weaponsIan";
import { IAN_PERKS as K } from "../itemsIan";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { damagePlayer } from "./combat";
import { enemy, FIRE } from "./perkTestUtil";
import { addRec, iaCooldown } from "./ianKit";

const IDLE = { ...FIRE, attack: false };

function ian(...perks: string[]): RunState {
  const s = createRun(5, "ian");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 100;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.player.iaRoom = `${s.floor}/${s.roomId}`;
  s.enemies = [{ ...enemy(1, 100, 100, 99999), rootTicks: 99999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
function run(s: RunState, n: number, input = FIRE): void {
  for (let i = 0; i < n; i++) stepSim(s, input);
}
const key = (s: RunState, n: number) => stepSim(s, { ...IDLE, skill: n });
/** 기본 공격 한 번 (대기 없이) */
function hit(s: RunState): void {
  s.player.attackCooldown = 0;
  stepSim(s, FIRE);
}

describe("이안", () => {
  it("3연격: 찌르기 · 찌르기 → 실 휘감기, 맞을 때마다 기록", () => {
    const s = ian();
    for (let i = 0; i < 3; i++) hit(s);
    expect(s.effects.filter((f) => f.kind === "iaThrust").length).toBe(2);
    expect(s.effects.some((f) => f.kind === "iaWhip")).toBe(true);
    expect(s.enemies[0]!.iaRec).toBe(1 + 1 + I.whipRec);
  });

  it("기록 5면 속박 · 속박된 적은 급소로 더 아픔", () => {
    const s = ian();
    const e = s.enemies[0]!;
    hit(s);
    const plain = lost(s);
    addRec(s, e, I.recMax);
    expect(e.iaBind).toBeGreaterThan(0);
    expect(e.iaRec).toBe(0);
    e.hp = e.maxHp;
    s.player.iaStep = 0;
    hit(s);
    expect(lost(s)).toBeGreaterThan(plain * I.vitalMul);
    expect(s.effects.some((f) => f.kind === "iaVital")).toBe(true);
  });

  it("그림자 걸음 뒤 첫 공격은 급소", () => {
    const s = ian();
    s.enemies[0]!.x = 300;
    key(s, 2);
    expect(s.player.iaAmbush).toBe(true);
    run(s, I.stepTicks + 1, IDLE);
    s.enemies[0]!.x = s.player.x + 30;
    s.enemies[0]!.y = s.player.y;
    hit(s);
    expect(s.player.iaAmbush).toBeUndefined();
    expect(s.effects.some((f) => f.kind === "iaVital")).toBe(true);
  });

  it("인과의 실: 꿰뚫으며 기록 +2 · 실패면 세 갈래", () => {
    const s = ian();
    key(s, 1);
    run(s, 10, IDLE);
    expect(s.enemies[0]!.iaRec).toBe(I.threadRec);
    const t = ian("iaSpool");
    key(t, 1);
    expect(t.player.iaThreads?.length).toBe(3);
  });

  it("기록 집행: 기록만큼 피해 · 기록을 지움", () => {
    const s = ian();
    const e = s.enemies[0]!;
    e.iaRec = 4;
    key(s, 3);
    expect(lost(s)).toBeGreaterThan(0);
    expect(e.iaRec).toBe(0);
    expect(s.effects.some((f) => f.kind === "iaWrit")).toBe(true);
  });

  it("인과율 속박: 모두 묶고, 끝날 때 쌓인 피해가 되돌아옴", () => {
    const s = ian();
    const e = s.enemies[0]!;
    key(s, 4);
    expect(e.iaBind).toBeGreaterThan(0);
    hit(s);
    const debt = e.iaDebt ?? 0;
    expect(debt).toBeGreaterThan(0);
    const before = lost(s);
    run(s, I.lawTicks, IDLE);
    expect(lost(s) - before).toBeGreaterThanOrEqual(Math.floor(debt * 0.9));
    expect(s.effects.some((f) => f.kind === "iaRebound")).toBe(true);
  });

  it("스킬 대기 · 아이템으로 줄어듦", () => {
    const s = ian("iaVerse", "iaAbsolute");
    expect(iaCooldown(s.player, 0)).toBe(Math.round(I.cooldowns[0]! * K.iaVerse.cd));
    expect(iaCooldown(s.player, 3)).toBe(Math.round(K.iaAbsolute.cd * K.iaVerse.cd));
  });

  it("침묵의 서약: 한동안 맞지 않으면 급소, 맞으면 처음부터", () => {
    const s = ian("iaSilence");
    run(s, K.iaSilence.ticks, IDLE);
    s.player.invulnTicks = 0;
    damagePlayer(s, 1, "slime");
    hit(s);
    expect(s.effects.some((f) => f.kind === "iaVital")).toBe(false);
    run(s, K.iaSilence.ticks + 1, IDLE);
    hit(s);
    expect(s.effects.some((f) => f.kind === "iaVital")).toBe(true);
  });

  it("같은 시드면 같은 결과", () => {
    const a = ian("iaQuill");
    const b = ian("iaQuill");
    for (const s of [a, b]) {
      key(s, 1);
      run(s, 120);
    }
    expect(lost(a)).toBe(lost(b));
  });
});
