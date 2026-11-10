import { describe, expect, it } from "vitest";
import { PUPPET_HAND as H } from "../weaponsPuppet";
import { PUPPET_PASSIVES, PUPPET_PERKS as K } from "../itemsPuppet";
import { createRun, EMPTY_INPUT, stepSim, type RunState, type TickInput } from "./index";
import { recalcStats } from "./items";
import { classTaken } from "./classTaken";
import { setActingFoe } from "./moonlight";
import { puppetKill } from "./puppetCorpse";
import { puppetDecoy } from "./puppetFriends";
import { enemy } from "./perkTestUtil";

/** 인형술사 (80, 100) · 적은 묶어 둠 */
function pp(foes: [number, number, number?][] = [[140, 100]], ...perks: string[]): RunState {
  const s = createRun(7, "puppeteer");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 80;
  s.player.y = s.player.prevY = 100;
  s.enemies = foes.map(([x, y, hp], i) => ({ ...enemy(i + 1, x, y, hp ?? 99999), rootTicks: 99999, stunTicks: 99999 }));
  return s;
}
/** 손을 (x, y)에 두고 누름 */
const at = (s: RunState, x: number, y: number, attack = true): TickInput => ({ ...EMPTY_INPUT, attack, aimX: Math.round(((x - s.player.x) / 12) * 100), aimY: Math.round(((y - s.player.y) / 12) * 100) });
const hold = (s: RunState, x: number, y: number, n: number) => {
  for (let i = 0; i < n; i++) stepSim(s, at(s, x, y));
};
const tap = (s: RunState, x: number, y: number) => {
  hold(s, x, y, 2);
  stepSim(s, at(s, x, y, false));
};
const idle = (s: RunState, n: number) => {
  for (let i = 0; i < n; i++) stepSim(s, { ...EMPTY_INPUT, aimX: 100 });
};

describe("인형술사", () => {
  it("전용 패시브 20개 (모두 효과 아이템)", () => {
    expect(Object.keys(PUPPET_PASSIVES).length).toBe(20);
    expect(Object.values(PUPPET_PASSIVES).every((v) => v.exclusive === "puppeteer" && v.effect)).toBe(true);
  });

  it("마우스 자리가 손 (닿는 거리까지)", () => {
    const s = pp([]);
    stepSim(s, at(s, 120, 100, false));
    expect(Math.round(s.player.ppHx!)).toBe(120);
    stepSim(s, at(s, 900, 100, false));
    expect(Math.round(s.player.ppHx! - s.player.x)).toBe(H.reach);
  });

  it("짧게 클릭 = 손 아래로 실을 내리쳐 피해 · 꾹 누르면 내리치지 않음", () => {
    const s = pp([[140, 100]]);
    const hp = s.enemies[0]!.hp;
    tap(s, 140, 100);
    expect(s.enemies[0]!.hp).toBeLessThan(hp);
    const after = s.enemies[0]!.hp;
    hold(s, 140, 100, 30);
    stepSim(s, at(s, 140, 100, false));
    expect(s.enemies[0]!.hp).toBe(after);
  });

  it("꾹 누르면 조종 게이지가 차고 가득 차면 나무 왕관 아군 (적 목록에서 빠짐)", () => {
    const s = pp([[140, 100, 40]]);
    hold(s, 140, 100, 20);
    expect(s.enemies[0]!.ppCharm!).toBeGreaterThan(0);
    hold(s, 140, 100, 400);
    expect(s.enemies.length).toBe(0);
    expect(s.player.ppAllies?.length).toBe(1);
    expect(s.player.ppCrowned).toBe(1);
  });

  it("손이 떠나면 게이지가 조금씩 줄어듦 · 피해를 받으면 0으로", () => {
    const s = pp([[140, 100, 40]]);
    hold(s, 140, 100, 60);
    const g = s.enemies[0]!.ppCharm!;
    hold(s, 80, 40, 20);
    expect(s.enemies[0]!.ppCharm!).toBeLessThan(g);
    expect(s.enemies[0]!.ppCharm!).toBeGreaterThan(0);
    hold(s, 140, 100, 30);
    s.enemies[0]!.hp -= 1;
    hold(s, 140, 100, 1);
    expect(s.enemies[0]!.ppCharm!).toBeLessThan(0.05);
  });

  it("조종 중인 적이 나를 때리면 게이지 0", () => {
    const s = pp([[140, 100, 40]]);
    hold(s, 140, 100, 60);
    const e = s.enemies[0]!;
    setActingFoe(e);
    classTaken(s, 5);
    setActingFoe(null);
    expect(e.ppCharm).toBe(0);
  });

  it("보스는 조종되지 않음 · 왕관은 최대 3 (네 번째 왕관이면 4)", () => {
    const s = pp([[140, 100, 40]]);
    s.enemies[0]!.kind = "hulk";
    hold(s, 140, 100, 400);
    expect(s.enemies.length).toBe(1);
    expect(s.enemies[0]!.ppCharm ?? 0).toBe(0);
    const t = pp([[140, 100, 40], [140, 60, 40], [100, 140, 40], [60, 60, 40], [40, 120, 40]], "ppCrown");
    for (const [x, y] of [[140, 100], [140, 60], [100, 140], [60, 60], [40, 120]] as const) {
      // 왕관을 씌우면 바로 멈추고, 아군이 남은 적을 때리지 않게 (맞으면 게이지가 0이 됨)
      const n = t.player.ppAllies?.length ?? 0;
      for (let i = 0; i < 400 && (t.player.ppAllies?.length ?? 0) === n; i++) stepSim(t, at(t, x, y));
      stepSim(t, at(t, x, y, false));
      for (const al of t.player.ppAllies ?? []) al.cd = 1e9;
    }
    expect(t.player.ppAllies?.length).toBe(4);
  });

  it("왕관 쓴 아군이 적을 때림", () => {
    const s = pp([[140, 100, 40], [170, 100]]);
    hold(s, 140, 100, 400);
    const foe = s.enemies[0]!;
    const hp = foe.hp;
    idle(s, 200);
    expect(foe.hp).toBeLessThan(hp);
  });

  it("미니 인형: 때리면 확률로 내 쪽에서 나와 적에게 달려가 터짐", () => {
    const s = pp([[140, 100]], "ppDollRibbon", "ppDollSpiral", "ppDollJester", "ppDollHat", "ppDollPrincess", "ppDollDancer", "ppDollHood", "ppDollCat");
    let seen = false;
    for (let i = 0; i < 20 && !seen; i++) {
      tap(s, 140, 100);
      idle(s, H.strikeCd);
      seen = (s.player.ppDolls?.length ?? 0) > 0 || s.effects.some((f) => f.kind === "ppDollPop");
    }
    expect(seen).toBe(true);
  });

  it("검은 실: 30개 묶이면 검게 터지고 처음부터 (보스에게도)", () => {
    const s = pp([[140, 100]], "ppBlack");
    s.enemies[0]!.kind = "hulk";
    for (let i = 0; i < K.ppBlack.burst - 1; i++) {
      tap(s, 140, 100);
      idle(s, H.strikeCd);
    }
    expect(s.enemies[0]!.ppThreads).toBe(K.ppBlack.burst - 1);
    expect(s.enemies[0]!.sluggish ?? 0).toBeGreaterThan(0);
    tap(s, 140, 100);
    expect(s.enemies[0]!.ppThreads).toBe(0);
  });

  it("시체 폭발: 처치하면 확률로 앉은 인형이 놓이고 잠시 뒤 터짐", () => {
    const s = pp([[140, 100]], "ppCorpse");
    idle(s, 1);
    for (let i = 0; i < 40; i++) puppetKill(s, { ...enemy(100 + i, 140, 100), hp: 0 });
    expect(s.player.ppSpots?.filter((o) => o.kind === 0).length).toBeGreaterThan(0);
    const hp = s.enemies[0]!.hp;
    idle(s, K.ppCorpse.delay + 2);
    expect(s.enemies[0]!.hp).toBeLessThan(hp);
  });

  it("내 친구~: 거대 인형 친구가 나와 다가온 적을 때림 · 쓰러지면 30초 뒤 다시", () => {
    const s = pp([[110, 100]], "ppGolem");
    idle(s, 2);
    expect(s.player.ppGolem).toBeDefined();
    const hp = s.enemies[0]!.hp;
    idle(s, 300);
    expect(s.enemies[0]!.hp).toBeLessThan(hp);
    s.player.ppGolem!.hp = 0;
    s.player.ppGolem!.hurt = 0;
    s.enemies[0]!.x = s.player.ppGolem!.x;
    s.enemies[0]!.y = s.player.ppGolem!.y;
    idle(s, 1);
    expect(s.player.ppGolem).toBeUndefined();
    expect(s.player.ppGolemCd).toBe(K.ppGolem.respawn);
  });

  it("분신: 맞으면 분신이 나타나 적이 분신을 쫓음 · 30초마다", () => {
    const s = pp([], "ppClone");
    idle(s, 1);
    classTaken(s, 5);
    expect(puppetDecoy(s)).not.toBeNull();
    expect(s.player.ppCloneCd).toBe(K.ppClone.cd);
    const c = s.player.ppClone!;
    s.enemies = [{ ...enemy(9, c.x + 40, c.y), r: 5 }];
    const d0 = Math.hypot(s.enemies[0]!.x - c.x, s.enemies[0]!.y - c.y);
    idle(s, 30);
    expect(Math.hypot(s.enemies[0]!.x - c.x, s.enemies[0]!.y - c.y)).toBeLessThan(d0);
  });

  it("같은 입력이면 같은 결과 (시드 결정성)", () => {
    const go = () => {
      const s = pp([[140, 100, 40], [150, 120]], "ppDollJester", "ppDollDancer", "ppChain", "ppWeb", "ppGolem");
      for (let i = 0; i < 6; i++) {
        tap(s, 150, 120);
        idle(s, 12);
      }
      hold(s, 140, 100, 200);
      return JSON.stringify([s.enemies.map((e) => e.hp), s.player.ppDolls, s.player.ppAllies?.length]);
    };
    expect(go()).toBe(go());
  });
});
