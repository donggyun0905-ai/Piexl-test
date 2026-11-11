// 가브리엘 보호막 기술: 보호막 주기(겹쳐 쌓이지 않음) · 2 중력 붕괴(나에게 끌어모았다가 보호막을 터뜨려 피해) · 3 성벽 미니 망치(몸 둘레를 돎, 보호막이 사라지면 같이 사라짐)
import { GABRIEL_PERKS as K } from "../itemsGabriel";
import { GABRIEL as G } from "../weaponsGabriel";
import { gbHit as gbHit_, press } from "./gabrielKit";
import { rot } from "./orbit";
import { alive, inCircle, isBoss, strike as strike_, stun } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, hasPerk } from "./util";
import { srcFn } from "./dmgSrc";
const gbHit = srcFn("gabrielShield", () => gbHit_), strike = srcFn("gabrielShield", () => strike_);

const TAU = Math.PI * 2;

/** 보호막을 amt로 (이미 더 크면 그대로 · 쌓이지 않음). 궁극기로 받은 몫(gbGrant)은 amt 위쪽만 남겨 천천히 줄어듦 */
export function setShield(s: RunState, amt: number): void {
  const p = s.player;
  const now = p.shieldPts ?? 0;
  p.shieldPts = Math.max(now, amt);
  if (p.gbGrant !== undefined) p.gbGrant = Math.max(0, Math.min(p.gbGrant, p.shieldPts - amt));
}

/** 2 중력 붕괴 시작: 둘레 적을 나에게 끌어모으기 시작 */
export function startWell(s: RunState): void {
  const p = s.player;
  p.gbWell = G.wellTicks;
  addEffect(s, { kind: "gbWell", x: p.x, y: p.y, dirX: 0, dirY: 0, size: wellR(s), maxTicks: 16 });
}

const wellR = (s: RunState) => G.wellR * (hasPerk(s.player, "gbPull") ? K.gbPull.r : 1);

/** 중력 붕괴 한 틱: 끌어모음 (보호막은 그대로) → 끝나면 보호막을 터뜨려 보호막만큼 큰 피해 */
export function wellTick(s: RunState): void {
  const p = s.player;
  if (!p.gbWell) return;
  const pull = G.wellPull * (hasPerk(p, "gbPull") ? K.gbPull.pull : 1);
  for (const e of inCircle(s, p.x, p.y, wellR(s))) {
    press(s, e);
    if (isBoss(e)) continue;
    const dx = p.x - e.x;
    const dy = p.y - e.y;
    const d = Math.hypot(dx, dy) || 1;
    const k = Math.min(pull, Math.max(0, d - p.r - e.r - 2));
    e.x += (dx / d) * k;
    e.y += (dy / d) * k;
  }
  if (--p.gbWell > 0) return;
  delete p.gbWell;
  const sh = p.shieldPts ?? 0;
  const dmg = p.stats.damage * G.wellMul + sh * G.wellShieldMul;
  for (const e of inCircle(s, p.x, p.y, G.wellBurstR)) {
    strike(s, e, dmg, G.wellPush);
    stun(e, G.wellStun);
  }
  p.shieldPts = hasPerk(p, "gbOrbit") ? sh * K.gbOrbit.keep : 0;
  addEffect(s, { kind: "gbBurst", x: p.x, y: p.y, dirX: sh, dirY: 0, size: G.wellBurstR, maxTicks: 30 });
}

/** 미니 망치 i의 자리 (그리기도 같은 계산) */
export function miniAt(p: RunState["player"], tick: number, i: number): [number, number] {
  const [c, sn] = rot((((tick - (p.gbMini ?? tick)) * G.miniSpin) % TAU) + (i * TAU) / G.miniN);
  return [p.x + c * G.miniR, p.y + sn * G.miniR];
}

/** 미니 망치 한 틱: 보호막이 없으면 사라짐 · 닿은 적을 침 (같은 적은 잠깐 뒤 다시) */
export function miniTick(s: RunState): void {
  const p = s.player;
  if (p.gbMini === undefined) return;
  if (!((p.shieldPts ?? 0) > 0)) {
    delete p.gbMini;
    return;
  }
  for (let i = 0; i < G.miniN; i++) {
    const [x, y] = miniAt(p, s.tick, i);
    for (const e of alive(s)) {
      if ((e.gbMiniAt ?? 0) > s.tick || Math.hypot(e.x - x, e.y - y) > G.miniHitR + e.r) continue;
      e.gbMiniAt = s.tick + G.miniEvery;
      gbHit(s, e, G.miniMul, G.miniPush);
      addEffect(s, { kind: "gbMiniHit", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 4, maxTicks: 12 });
    }
  }
}
