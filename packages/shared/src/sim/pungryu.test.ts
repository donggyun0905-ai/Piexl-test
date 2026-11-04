import { describe, expect, it } from "vitest";
import { PUNGRYU_PERKS as K } from "../itemsPungryu";
import { PUNGRYU as U } from "../weaponsPungryu";
import { WEAPONS, type WeaponId } from "../content";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { damagePlayer, envDamage } from "./combat";
import { enemy, FIRE } from "./perkTestUtil";

const ALL: WeaponId[] = ["puHeaven", "puFlood", "puSunMoon", "puStars", "puSeasons", "puHarvest", "puRain", "puFrost", "puGold", "puSword"];

function pung(weapon: WeaponId = "puHeaven", ...perks: string[]): RunState {
  const s = createRun(5, "pungryu");
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
/** 허수아비 초당 피해 (10초 평균) */
function dps(w: WeaponId): number {
  const s = pung(w);
  for (let i = 0; i < 600; i++) {
        stepSim(s, FIRE);
        s.enemies[0]!.x = 90;
        s.enemies[0]!.y = 72;
      }
  return lost(s) / 10;
}

describe("풍류사", () => {
  for (const w of ALL) {
    it(`무기 ${w}: 적에게 피해`, () => {
      const s = pung(w);
      for (let i = 0; i < 180; i++) stepSim(s, FIRE);
      expect(lost(s)).toBeGreaterThan(0);
    });
  }

  it("글자 네 개를 쓰면 구절 완성 (다시 처음부터) · 천자문 책이면 셋", () => {
    const s = pung();
    let verses = 0;
    for (let i = 0; i < 400 && verses < 1; i++) {
      stepSim(s, FIRE);
      verses = s.player.puVerses ?? 0;
    }
    expect(s.player.attackCount).toBe(U.letters);
    expect(s.player.puStep).toBe(0);
    const b = pung("puHeaven", "puBook");
    for (let i = 0; i < 400 && !b.player.puVerses; i++) stepSim(b, FIRE);
    expect(b.player.attackCount).toBe(K.puBook.letters);
  });

  it("2초 동안 쓰지 않으면 구절이 처음부터", () => {
    const s = pung();
    stepSim(s, FIRE);
    expect(s.player.puStep).toBe(1);
    for (let i = 0; i < U.idle + 2; i++) stepSim(s, IDLE);
    expect(s.player.puStep).toBe(0);
  });

  it("천지현황: 구절 마법은 하늘 기둥 → 땅 기둥 차례로", () => {
    const s = pung();
    s.player.puStep = 3;
    s.player.puLast = s.tick;
    stepSim(s, FIRE);
    expect(s.player.puFalls?.length).toBe(2);
  });

  it("밸런스: 무기마다 허수아비 초당 피해 15~60, 가장 약한 무기가 가장 센 무기의 절반 이상", () => {
    const all = ALL.map(dps);
    for (const d of all) {
      expect(d).toBeGreaterThan(15);
      expect(d).toBeLessThan(60);
    }
    expect(Math.min(...all)).toBeGreaterThan(Math.max(...all) / 2);
  });

  it("구름 타기: 지형 피해 절반 · 오색 구름이면 없음", () => {
    const s = pung();
    const hp = s.player.hp;
    envDamage(s, 10);
    expect(hp - s.player.hp).toBeCloseTo(10 * U.cloudEnv, 1);
    const c = pung("puHeaven", "puCloud");
    const hp2 = c.player.hp;
    envDamage(c, 10);
    expect(c.player.hp).toBe(hp2);
  });

  it("둔갑술: 체력이 30% 아래로 떨어질 피해를 층마다 한 번 무시", () => {
    const s = pung("puHeaven", "puDisguise");
    const hp = s.player.hp;
    damagePlayer(s, hp * 0.9);
    expect(s.player.hp).toBe(hp);
    expect(s.player.puDisguised).toBe(s.floor);
    s.player.invulnTicks = 0;
    damagePlayer(s, hp * 0.9);
    expect(s.player.hp).toBeLessThan(hp);
  });

  it("축지법: 대시를 누르면 한 번에 멀리 옮겨 감 · 다음 글자 2배", () => {
    const s = pung("puHeaven", "puShrink");
    s.enemies = [];
    const x = s.player.x;
    stepSim(s, { ...IDLE, dash: true, moveX: 1, moveY: 0 });
    expect(s.player.x - x).toBeGreaterThan(40);
    expect(s.player.puQuick).toBeGreaterThan(0);
  });

  it("분신술: 구절을 완성하면 분신이 나와 글자를 따라 씀", () => {
    const s = pung("puHeaven", "puClone");
    for (let i = 0; i < 400 && !s.player.puVerses; i++) stepSim(s, FIRE);
    expect(s.player.puClones?.length).toBe(1);
    const before = s.projectiles.length;
    s.player.attackCooldown = 0;
    stepSim(s, FIRE);
    expect(s.projectiles.length - before).toBeGreaterThanOrEqual(2);
  });

  it("의적 주머니: 가진 돈이 많을수록 공격력 +", () => {
    const poor = pung("puHeaven", "puThief");
    const rich = pung("puHeaven", "puThief");
    rich.gold = 1000;
    for (let i = 0; i < 120; i++) {
      stepSim(poor, FIRE);
      stepSim(rich, FIRE);
    }
    expect(lost(rich)).toBeGreaterThan(lost(poor));
  });

  it("무기는 모두 풍류사 전용 · 글자탄 공격 방식", () => {
    for (const w of ALL) expect(WEAPONS[w]).toMatchObject({ kind: "script", exclusive: "pungryu" });
  });
});
