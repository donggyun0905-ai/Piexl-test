import { describe, expect, it } from "vitest";
import { BOSS_TIERS, type BossKind } from "../content";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { BOSS_MOON_EATER_RULES as ME } from "./bossMoonEater";
import { BOSS_TWINS_RULES as TW } from "./bossTwins";
import { makeEnemy } from "./util";
import { startCage } from "./bossTwinsKit";
import { startMoonfall } from "./bossMoonKit";

/** 무적 플레이어 앞에 보스 하나 (방이 정리되지 않게) */
function withBoss(kind: BossKind, seed = 4): RunState {
  const run = createRun(seed, "warden");
  run.player.invulnTicks = 99999;
  run.rooms[run.roomId]!.cleared = false;
  const e = makeEnemy(run, kind, run.player.x + 50, run.player.y - 40, 1, 10);
  run.enemies = [e];
  return run;
}

function play(run: RunState, n: number, keep = true) {
  for (let i = 0; i < n; i++) {
    stepSim(run, { ...EMPTY_INPUT, moveX: i % 120 < 60 ? 100 : -100 });
    if (keep) run.player.invulnTicks = 99999;
  }
}

const one = (s: RunState, kind: string) => s.enemies.filter((e) => e.kind === kind && e.hp > 0);

describe("시즌 3 단계별 보스", () => {
  it("단계마다 하나씩 섞여 나옴", () => {
    expect(BOSS_TIERS[0]).toContain("gatekeeper");
    expect(BOSS_TIERS[1]).toContain("twinlu");
    expect(BOSS_TIERS[2]).toContain("mooneater");
  });

  it("지옥문 수문장: 문 셋을 열고 임프가 나옴 · 문을 다 부수면 무릎 꿇고 받는 피해가 늚", () => {
    const s = withBoss("gatekeeper");
    play(s, 200);
    expect(one(s, "hellgate")).toHaveLength(3);
    expect(one(s, "imp").length).toBeGreaterThan(0);
    for (const g of one(s, "hellgate")) g.hp = 0;
    play(s, 3);
    const boss = one(s, "gatekeeper")[0]!;
    expect(boss.gkBroken).toBe(3);
    // 경직이 풀리면 무릎
    play(s, 70);
    expect(boss.phase).toBe("act");
  });

  it("쌍둥이: 루가 레를 데려옴 · 한쪽만 쓰러뜨리면 다시 일어남 · 둘 다 쓰러뜨리면 끝", () => {
    const s = withBoss("twinlu");
    play(s, 5);
    const lu = one(s, "twinlu")[0]!;
    const re = one(s, "twinre")[0]!;
    expect(re.twLink).toBe(lu.id);
    lu.hp = 0;
    play(s, 2);
    expect(lu.twDown).toBeGreaterThan(0);
    play(s, TW.REVIVE + 5);
    expect(lu.twDown).toBe(0);
    expect(lu.hp).toBe(Math.round(lu.maxHp * TW.REVIVE_HP));
    // 둘 다 (짝이 쓰러져 있는 동안 다른 쪽도)
    lu.hp = 0;
    play(s, 2);
    re.hp = 0;
    play(s, 2);
    expect(one(s, "twinlu")).toHaveLength(0);
    expect(one(s, "twinre")).toHaveLength(0);
  });

  it("달을 삼키는 자: 달 조각을 깨면 기둥 · 보름달 월식은 기둥 밖이면 큰 피해", () => {
    const s = withBoss("mooneater");
    play(s, 3);
    const boss = one(s, "mooneater")[0]!;
    expect(boss.meDark).toBe(true);
    const shards = one(s, "moonshard");
    expect(shards).toHaveLength(ME.SHARDS);
    boss.meMoon = 0.6;
    shards[0]!.hp = 0;
    play(s, 2);
    expect(boss.mePillars).toHaveLength(1);
    expect(boss.meMoon).toBeLessThan(0.6);
    // 보름달 → 월식 (기둥 밖 · 무적을 풀고 맞음)
    boss.meMoon = 1;
    boss.phase = "walk";
    s.player.invulnTicks = 0;
    s.player.x = 30;
    s.player.y = 30;
    const hp = s.player.hp;
    for (let i = 0; i < ME.ECLIPSE_WARN + 5 && s.player.hp === hp; i++) stepSim(s, EMPTY_INPUT);
    expect(s.player.hp).toBeLessThan(hp);
  });

  it("지옥문 수문장: 처음 들어가도 기절·무릎 없음 · 문이 늘어나지 않음 · 임프는 문마다 둘씩", () => {
    const s = withBoss("gatekeeper");
    play(s, 2);
    const boss = one(s, "gatekeeper")[0]!;
    expect(boss.stunTicks ?? 0).toBe(0);
    expect(boss.gkBroken).toBe(0);
    play(s, 600);
    expect(one(s, "hellgate")).toHaveLength(3);
    expect(boss.phase).not.toBe("act");
    expect(one(s, "imp").length).toBeGreaterThanOrEqual(6);
  });

  it("쌍둥이 핏줄 감옥 · 달을 삼키는 자 월광 낙하: 대시 무적이어도 맞음", () => {
    for (const k of ["twinlu", "mooneater"] as BossKind[]) {
      const s = withBoss(k);
      play(s, 3);
      const boss = one(s, k)[0]!;
      if (k === "twinlu") {
        const re = one(s, "twinre")[0]!;
        startCage(s, boss, re);
        re.timer = boss.timer;
      } else startMoonfall(boss);
      // 가운데에 가만히 · 대시 무적을 계속 켬
      const hp0 = s.player.hp;
      const [px, py] = [s.player.x, s.player.y];
      for (let i = 0; i < 260; i++) {
        s.player.invulnTicks = 0;
        s.player.dashTicks = 5;
        [s.player.x, s.player.y] = [px, py];
        stepSim(s, EMPTY_INPUT);
      }
      expect(s.player.hp).toBeLessThan(hp0);
    }
  });

  it("달을 삼키는 자: 달 조각을 다 깨도 몇 초 안에 월식이 옴", () => {
    const s = withBoss("mooneater");
    let eclipse = false;
    for (let i = 0; i < 900 && !eclipse; i++) {
      for (const e of s.enemies) if (e.kind === "moonshard") e.hp = 0;
      stepSim(s, EMPTY_INPUT);
      s.player.invulnTicks = 99999;
      eclipse = one(s, "mooneater")[0]?.phase === "act";
    }
    expect(eclipse).toBe(true);
  });

  it("같은 시드면 같은 결과 (세 보스)", () => {
    for (const k of ["gatekeeper", "twinlu", "mooneater"] as BossKind[]) {
      const go = () => {
        const s = withBoss(k, 9);
        play(s, 400);
        return s.enemies.map((e) => [e.kind, Math.round(e.x), Math.round(e.y), e.hp]);
      };
      expect(go()).toEqual(go());
    }
  });
});
