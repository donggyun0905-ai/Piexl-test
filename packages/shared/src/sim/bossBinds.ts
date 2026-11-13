// 라스트 보스가 플레이어 조작에 거는 특이한 패턴
// 봉인의 사슬(갓이터): 4초 안에 보이는 방향키(W·A·S·D) 6개를 순서대로 눌러야 끊어짐, 틀리거나 시간이 다 되면 큰 피해 · 거울(태초의 빛): 5초 동안 이동 방향이 반대로
import { createRng, deriveSeed } from "../rng";
import { hitDamage } from "./bossKit";
import { parryInput } from "./bossCage";
import { gripInput } from "./bossGrip";
import { bcInput } from "./bcPossess";
import { dirOf } from "./bossPrimeval";
import { damagePlayer as damagePlayer_ } from "./combat";
import type { RunState, TickInput } from "./types";
import { addEffect } from "./util";
import { srcFn } from "./dmgSrc";
const damagePlayer = srcFn("bossBinds", () => damagePlayer_);

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  CHAIN_TICKS: 240,
  CHAIN_MUL: 2.5,
  /** 거울: 반대로 움직이는 틱 */
  MIRROR_TICKS: 300,
};
export { R as BOSS_BINDS_RULES };

/** 사슬: 눌러야 하는 방향 수 · 시간 · 못 끊으면 피해 배율 */
export const CHAIN_KEYS = 6;

/** 사슬에 묶음: 방향 6개 (0 위 W · 1 오른쪽 D · 2 아래 S · 3 왼쪽 A) */
export function chainPlayer(s: RunState): void {
  const p = s.player;
  const rng = createRng(deriveSeed(s.seed, "chain", s.tick));
  p.chains = Array.from({ length: CHAIN_KEYS }, () => rng.int(0, 3));
  p.chainTicks = R.CHAIN_TICKS;
  p.chainLast = -1;
}

export function mirrorPlayer(s: RunState): void {
  s.player.mirrorTicks = R.MIRROR_TICKS;
}

/** 사슬이 풀리지 못함: 큰 피해 */
function chainFail(s: RunState): void {
  const p = s.player;
  p.chains = [];
  p.chainTicks = 0;
  p.invulnTicks = 0;
  damagePlayer(s, hitDamage(s) * R.CHAIN_MUL);
}

/** 틱마다 (플레이어가 움직이기 전): 갓이터 구역 어둠이 옅어짐 · 사슬에 묶여 있으면 이동·대시 대신 방향 누르기를 셈(새로 누른 방향만) · 거울이면 이동 방향을 뒤집음 */
export function bindInput(s: RunState, input: TickInput): TickInput {
  const p = s.player;
  let out = bcInput(s, gripInput(s, parryInput(s, input)));
  if ((p.blindTicks ?? 0) > 0) p.blindTicks = (p.blindTicks ?? 0) - 1;
  if ((p.mirrorTicks ?? 0) > 0) {
    p.mirrorTicks = (p.mirrorTicks ?? 0) - 1;
    out = { ...out, moveX: -out.moveX, moveY: -out.moveY };
  }
  const seq = p.chains;
  if ((p.chainTicks ?? 0) <= 0 || !seq || seq.length === 0) return out;
  p.chainTicks = (p.chainTicks ?? 0) - 1;
  const d = dirOf(input.moveX / 100, input.moveY / 100);
  if (d >= 0 && d !== p.chainLast) {
    if (d !== seq[0]) chainFail(s);
    else if (seq.shift() !== undefined && seq.length === 0) {
      p.chainTicks = 0;
      addEffect(s, { kind: "burst", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 12, maxTicks: 14 });
    }
  }
  p.chainLast = d;
  if ((p.chainTicks ?? 0) === 0 && (p.chains?.length ?? 0) > 0) chainFail(s);
  return { ...out, moveX: 0, moveY: 0, dash: false };
}
