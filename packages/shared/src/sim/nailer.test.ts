import { describe, expect, it } from "vitest";
import { NAILER as N } from "../weaponsNailer";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";

const IDLE = { ...FIRE, attack: false };

function nailer(...perks: string[]): RunState {
  const s = createRun(5, "nailer");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 100;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.player.nlRoom = `${s.floor}/${s.roomId}`;
  s.enemies = [{ ...enemy(1, 140, 100, 99999), rootTicks: 99999 }];
  return s;
}
function run(s: RunState, n: number, input = IDLE): void {
  for (let i = 0; i < n; i++) stepSim(s, input);
}
const key = (s: RunState, n: number) => stepSim(s, { ...IDLE, skill: n });
const foe = (s: RunState) => s.enemies[0]!;

describe("네일러", () => {
  it("1 못 던지기: 세 번 눌러 못 1·1·3개가 박히고 그 뒤 대기", () => {
    const s = nailer();
    key(s, 1);
    run(s, 30);
    expect(foe(s).nlNails).toBe(1);
    expect(s.player.nlCd![0]).toBe(0);
    key(s, 1);
    run(s, 20);
    expect(foe(s).nlNails).toBe(2);
    key(s, 1);
    expect(s.player.nlCd![0]).toBeGreaterThan(0);
    run(s, 40);
    expect(foe(s).nlNails).toBe(5);
    // 대기 중에는 안 나감
    key(s, 1);
    expect(s.player.nlStage).toBeUndefined();
  });

  it("1 못 던지기: 다음 단계를 안 누르면 시간이 지나 대기", () => {
    const s = nailer();
    key(s, 1);
    run(s, N.throwWindow + 2);
    expect(s.player.nlStage).toBeUndefined();
    expect(s.player.nlCd![0]).toBeGreaterThan(0);
  });

  it("2 붉은 실: 돌진해 못 다섯·고정 → 2번 망치 원 → 박은 못 자리로 돌아감", () => {
    const s = nailer();
    key(s, 2);
    run(s, 20);
    expect(foe(s).nlNails).toBe(N.tieNails);
    expect(s.player.nlTie?.ph).toBe(1);
    expect(Math.abs(s.player.x - 140)).toBeLessThan(40);
    const hp = foe(s).hp;
    key(s, 2);
    expect(foe(s).hp).toBeLessThan(hp);
    run(s, 20);
    expect(s.player.nlTie).toBeUndefined();
    expect(Math.abs(s.player.x - 60)).toBeLessThan(2);
    expect(s.player.nlCd![1]).toBeGreaterThan(0);
  });

  it("3 저주의 도화선: 못 수 × 33%를 한 덩어리로 · 못은 0으로", () => {
    const s = nailer();
    foe(s).nlNails = 15;
    key(s, 3);
    expect(foe(s).nlNails).toBeUndefined();
    const hp = foe(s).hp;
    run(s, N.fuseTicks + 1);
    const lost = hp - foe(s).hp;
    expect(lost).toBeGreaterThan(s.player.stats.damage * 15 * N.perNail * 0.8);
  });

  it("4 심판의 못비: 제자리에서 못 30개가 박힘 · 표적이 죽으면 끝", () => {
    const s = nailer();
    key(s, 4);
    run(s, 10, { ...IDLE, moveX: 1 });
    expect(s.player.x).toBe(60);
    run(s, N.ultGap * N.ultVolleys + 30);
    expect(foe(s).nlNails).toBe(N.ultVolleys * 3);
    const t = nailer();
    foe(t).hp = 1;
    key(t, 4);
    run(t, 30);
    expect(t.player.nlUlt).toBeUndefined();
  });

  it("맞힐수록 성흔이 차고 가득 차면 달빛 각성", () => {
    const s = nailer();
    foe(s).x = 80;
    for (let i = 0; i < 60 && !(s.player.sgAwake ?? 0); i++) {
      s.player.attackCooldown = 0;
      foe(s).x = 80;
      stepSim(s, FIRE);
    }
    expect(s.player.sgAwake ?? 0).toBeGreaterThan(0);
  });
});
