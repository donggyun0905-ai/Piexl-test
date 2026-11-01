import { describe, expect, it } from "vitest";
import { damagePlayer } from "./combat";
import { FOE_STATUS_RULES as R, foeMoveMul, tickFoeStatus, touchFoe } from "./foeStatus";
import { createRun, EMPTY_INPUT, stepSim } from "./index";

function run() {
  const s = createRun(7, "warden");
  s.player.hp = s.player.stats.maxHp = 500;
  return s;
}

describe("적이 플레이어에게 거는 상태이상", () => {
  it("적 종류마다 맞는 상태이상", () => {
    const pairs = [["landfish", "dbBleed"], ["slime", "dbRot"], ["doppel", "dbCurse"], ["lurker", "dbFear"], ["guardian", "dbStun"], ["paladin", "dbRoot"], ["charger", "dbSlow"]] as const;
    for (const [kind, field] of pairs) {
      const s = run();
      damagePlayer(s, 5, kind);
      expect(s.player[field] ?? 0, kind).toBeGreaterThan(0);
    }
  });

  it("가디언은 돌진 중에 닿을 때만 · 성기사는 몸에 닿아서는 걸지 않음 (빛기둥·휘두르기만)", () => {
    expect(touchFoe({ kind: "guardian", phase: "walk" })).toBeUndefined();
    expect(touchFoe({ kind: "guardian", phase: "charge" })).toBe("guardian");
    expect(touchFoe({ kind: "paladin", phase: "walk" })).toBeUndefined();
    expect(touchFoe({ kind: "slime", phase: "walk" })).toBe("slime");
  });

  it("무적이면(맞지 않으면) 걸리지 않음", () => {
    const s = run();
    s.player.invulnTicks = 10;
    damagePlayer(s, 5, "guardian");
    expect(s.player.dbStun ?? 0).toBe(0);
  });

  it("부식은 받는 피해 증가 · 저주는 끝날 때 터짐 · 출혈은 0.5초마다", () => {
    const a = run();
    damagePlayer(a, 10);
    const plain = 500 - a.player.hp;
    const b = run();
    b.player.dbRot = 100;
    damagePlayer(b, 10);
    expect(500 - b.player.hp).toBeCloseTo(plain * R.ROT_TAKEN);
    const p = run().player;
    p.dbCurse = 2;
    expect(tickFoeStatus(p, 0)).toBe(0);
    expect(tickFoeStatus(p, 0)).toBe(R.CURSE_DMG);
    p.dbBleed = R.BLEED_EVERY + 1;
    expect(tickFoeStatus(p, 0)).toBe(R.BLEED_DMG);
  });

  it("기절·속박은 못 움직임, 느림은 느려짐", () => {
    const s = run();
    s.player.dbRoot = 30;
    expect(foeMoveMul(s.player)).toBe(0);
    s.rooms[s.roomId]!.cleared = true;
    const x = s.player.x;
    stepSim(s, { ...EMPTY_INPUT, moveX: 100 });
    expect(s.player.x).toBe(x);
    s.player.dbRoot = 0;
    s.player.dbSlow = 30;
    expect(foeMoveMul(s.player)).toBe(R.SLOW_MUL);
  });
});
