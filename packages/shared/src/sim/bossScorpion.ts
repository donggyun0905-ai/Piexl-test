// 검은 잔영의 둘째 짐승 거대 전갈: 모래 밑을 기어다님 (자리를 알 수 있게 위험 표시가 따라 움직임)
// 표시가 사라지면 둘 중 하나 — 꼬리 찌르기(맞으면 독) · 땅을 밀며 앞으로만 3초 돌진(몸을 틀지 못함, 부딪히면 집게에 3초 붙잡혀 못 움직이고 피해)
// 찌르기·돌진이 끝나면 잠깐 지쳐 서 있음 (옆으로 대시해 피한 뒤 이때 때리기)
import { dashDodged } from "./remnant";
import { createRng, deriveSeed } from "../rng";
import { half, hitDamage } from "./bossKit";
import { pinchPlayer, poisonPlayer } from "./bossGrip";
import { damagePlayer as damagePlayer_ } from "./combat";
import { ultReady } from "./bossUlts";
import { startScorpionUlt, updateScorpionUlt } from "./beastUlts";
import { addShape, inHazard } from "./hazards";
import type { EnemyState, RunState } from "./types";
import { addEffect, dist2 } from "./util";
import { srcFn } from "./dmgSrc";
const damagePlayer = srcFn("bossScorpion", () => damagePlayer_);

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 모래 밑에서 기는 틱 (절반 아래) */
  UNDER: 150,
  UNDER_HALF: 110,
  /** 되살린 검은 전갈 */
  UNDER_DARK: 120,
  UNDER_DARK_HALF: 90,
  /** 표시가 사라지고 나오기까지 */
  HIDE: 28,
  /** 꼬리 찌르기: 예고 · 길이 · 굵기(반) · 찌른 뒤 서 있는 틱 */
  STING_WARN: 22,
  STING_LEN: 170,
  STING_W: 13,
  STING_STAY: 150,
  /** 돌진: 틱 · 빠르기(플레이어보다 아주 조금 빠름) · 끝나고 지쳐 있는 틱 */
  CHARGE: 180,
  CHARGE_SPEED: 1.45,
  TIRED: 180,
  /** 집게에 붙잡고 있는 틱 (bossGrip과 같게) */
  HOLD: 180,
};
export { R as BOSS_SCORPION_RULES };

/** 모래 밑 (몸이 안 보이고 맞지 않음). walk면 움직이는 표시가 보임 */
export const scorpionHidden = (e: EnemyState) => e.phase === "walk" || e.phase === "windup";

function surface(e: EnemyState, toP: readonly [number, number]): void {
  e.air = false;
  e.immune = false;
  e.dirX = toP[0];
  e.dirY = toP[1];
  e.aux = 0;
}

function burrow(e: EnemyState): void {
  e.phase = "walk";
  e.timer = e.dark ? (half(e) ? R.UNDER_DARK_HALF : R.UNDER_DARK) : half(e) ? R.UNDER_HALF : R.UNDER;
  e.air = true;
  e.immune = true;
}

export function updateScorpion(s: RunState, e: EnemyState, toP: readonly [number, number], speed: number): void {
  const p = s.player;
  if (ultReady(e)) startScorpionUlt(s, e);
  if (e.ultAt !== undefined && updateScorpionUlt(s, e)) return;
  if (scorpionHidden(e)) {
    e.air = true;
    e.immune = true;
  }
  if (e.phase === "walk") {
    e.x += toP[0] * speed;
    e.y += toP[1] * speed;
    if (e.timer > 0) return;
    // 표시가 사라짐: 무엇을 할지 (절반 아래면 무작위)
    e.phase = "windup";
    e.timer = R.HIDE;
    e.step = half(e) ? (createRng(deriveSeed(s.seed, "scorpion", e.count)).nextFloat() < 0.5 ? 1 : 2) : (e.count % 2) + 1;
    e.count++;
    return;
  }
  if (e.phase === "windup") {
    if (e.timer > 0) return;
    surface(e, toP);
    addEffect(s, { kind: "burst", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r * 1.5, maxTicks: 16 });
    if (e.step === 1) {
      e.phase = "swing";
      e.auxX = e.x + toP[0] * R.STING_LEN;
      e.auxY = e.y + toP[1] * R.STING_LEN;
      addShape(s, R.STING_WARN, { x: e.x, y: e.y, radius: 0, damage: 0, toX: e.auxX, toY: e.auxY, width: R.STING_W, fx: "stab" });
    } else {
      e.phase = "charge";
      e.timer = R.CHARGE;
    }
    return;
  }
  e.aux = (e.aux ?? 0) + 1;
  if (e.phase === "swing") {
    // 꼬리가 찌르는 순간: 선 안이면 피해 + 독
    if (e.aux === R.STING_WARN) {
      const line = { x: e.x, y: e.y, toX: e.auxX, toY: e.auxY, width: R.STING_W, radius: 0, damage: 0, tick: 0, start: 0 };
      if (inHazard(line, p.x, p.y, p.r) && !dashDodged(s)) {
        const hp = p.hp;
        damagePlayer(s, hitDamage(s));
        if (p.hp < hp) poisonPlayer(s);
      }
    }
    if (e.aux >= R.STING_WARN + R.STING_STAY) burrow(e);
    return;
  }
  if (e.phase === "charge") {
    // 앞으로만 (몸을 틀지 못함). 벽에 막히면 멈춤 (지난 틱 자리에서 거의 못 움직임)
    const stuck = e.aux > 2 && Math.abs((e.auxX ?? 0) - e.x) + Math.abs((e.auxY ?? 0) - e.y) < 0.3;
    e.auxX = e.x;
    e.auxY = e.y;
    e.x += e.dirX * R.CHARGE_SPEED;
    e.y += e.dirY * R.CHARGE_SPEED;
    const rr = e.r + p.r;
    if (dist2(e, p) < rr * rr && p.invulnTicks <= 0 && (p.pinchTicks ?? 0) <= 0 && !dashDodged(s)) {
      damagePlayer(s, hitDamage(s));
      pinchPlayer(s, e);
      e.phase = "act";
      e.timer = R.HOLD;
      return;
    }
    if (e.aux % 6 === 0) addEffect(s, { kind: "puff", x: e.x - e.dirX * e.r, y: e.y - e.dirY * e.r, dirX: 0, dirY: 0, size: 8, maxTicks: 18 });
    if (e.timer > 0 && !stuck) return;
    e.phase = "act";
    e.timer = R.TIRED;
    return;
  }
  // 지쳐 서 있음 (또는 붙잡고 있음)
  if (e.timer <= 0) burrow(e);
}
