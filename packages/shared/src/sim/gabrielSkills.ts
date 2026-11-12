// 가브리엘 스킬 넷(1 방패 돌진 · 2 중력 붕괴(sim/gabrielShield) · 3 성벽 · 4 불멸의 성벽) · 떨어지는 빛의 망치 · 궁극기 영역·보호막 (sim/gabriel에서 부름)
import { GABRIEL_PERKS as K } from "../itemsGabriel";
import { GABRIEL as G } from "../weaponsGabriel";
import { dropHammer, gbCooldown, gbHit as gbHit_, press, quake as quake_ } from "./gabrielKit";
import { setShield, startWell } from "./gabrielShield";
import { inCircle, inCone, rushTick as rushTick_, startRush, strike as strike_, stun } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, hasPerk } from "./util";
import { srcEach, srcFn } from "./dmgSrc";
const gbHit = srcFn("gabrielSkills", () => gbHit_), rushTick = srcFn("gabrielSkills", () => rushTick_), strike = srcFn("gabrielSkills", () => strike_);

/** 궁극기 영역 안 보호막 한도 */
const ultCap = (s: RunState) => G.ultShield + (hasPerk(s.player, "gbImmortal") ? K.gbImmortal.shield : 0);

/** 3 성벽: 보호막(쌓이지 않음) + 둘레 땅을 울려 밀쳐냄 + 몸 둘레를 도는 미니 망치 */
function wall(s: RunState): void {
  const p = s.player;
  const big = hasPerk(p, "gbBulwark");
  setShield(s, p.stats.maxHp * G.wallShield * (big ? K.gbBulwark.shield : 1));
  p.gbMini = s.tick;
  const r = G.wallR * (big ? K.gbBulwark.r : 1);
  for (const e of inCircle(s, p.x, p.y, r)) {
    gbHit(s, e, G.wallMul, G.wallPush);
    press(s, e);
  }
  addEffect(s, { kind: "gbWall", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 30 });
}

/** 4 불멸의 성벽: 내 자리에 성역 · 거대한 빛의 망치가 내리꽂힘 · 영역 안 보호막 */
function ult(s: RunState): void {
  const p = s.player;
  p.gbUlt = G.ultTicks + (hasPerk(p, "gbImmortal") ? K.gbImmortal.more : 0);
  p.gbZone = { x: p.x, y: p.y, r: G.ultR };
  const add = Math.max(0, ultCap(s) - (p.shieldPts ?? 0));
  p.shieldPts = (p.shieldPts ?? 0) + add;
  p.gbGrant = (p.gbGrant ?? 0) + add;
  dropHammer(s, p.x, p.y, G.dropTicks, G.ultR * G.ultSlamR, p.stats.damage * G.ultSlamMul, G.slamStun);
  addEffect(s, { kind: "gbUlt", x: p.x, y: p.y, dirX: 0, dirY: 0, size: G.ultR, maxTicks: 50 });
}

/** 스킬 키 (1~4) */
export function gbSkill(s: RunState, i: number): void {
  const p = s.player;
  const cd = (p.gbCd ??= [0, 0, 0, 0]);
  if ((cd[i] ?? 0) > 0 || p.s2Rush) return;
  cd[i] = gbCooldown(p, i);
  if (i === 0) {
    const bash = hasPerk(p, "gbBash");
    const dmg = p.stats.damage * G.bashMul * (bash ? K.gbBash.mul : 1);
    startRush(p, { t: G.bashTicks, dx: p.faceX, dy: p.faceY, step: G.bashDist * (bash ? K.gbBash.dist : 1), dmg, push: G.bashPush, invuln: false, tint: "#f2c14e", w: G.bashW });
    addEffect(s, { kind: "gbBash", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: G.bashW, maxTicks: G.bashTicks + 8 });
  } else if (i === 1) startWell(s);
  else if (i === 2) wall(s);
  else ult(s);
}

/** 방패 돌진 한 틱: 부딪힌 적 기절·압박 */
export function bashTick(s: RunState): void {
  if (!s.player.s2Rush) return;
  const r = s.player.s2Rush;
  rushTick(s, (e) => {
    stun(e, G.bashStun);
    press(s, e);
    addEffect(s, { kind: "gbSmite", x: e.x, y: e.y, dirX: r.dx, dirY: r.dy, size: e.r + 10, maxTicks: 22 });
  });
}

/** 떨어지는 빛의 망치: 땅에 닿으면 울림 */
export function dropsTick(s: RunState): void {
  const p = s.player;
  const list = p.gbDrops;
  if (!list) return;
  for (const d of srcEach(list)) if (--d.t === 0) quake_(s, d.x, d.y, d.r, d.dmg, d.stun, d.press);
  p.gbDrops = list.filter((d) => d.t > 0);
  if (p.gbDrops.length === 0) delete p.gbDrops;
}

/** 궁극기: 영역 안에서 보호막이 차오름 · 끝나면 준 보호막이 천천히 줄어듦 */
export function ultTick(s: RunState): void {
  const p = s.player;
  const z = p.gbZone;
  if ((p.gbUlt ?? 0) > 0 && z) {
    p.gbUlt!--;
    if (Math.hypot(p.x - z.x, p.y - z.y) <= z.r) {
      const add = Math.max(0, Math.min(G.ultRegen, ultCap(s) - (p.shieldPts ?? 0)));
      p.shieldPts = (p.shieldPts ?? 0) + add;
      p.gbGrant = (p.gbGrant ?? 0) + add;
    }
    if (p.gbUlt! <= 0) {
      delete p.gbUlt;
      delete p.gbZone;
    }
  } else if ((p.gbGrant ?? 0) > 0) {
    const d = Math.min(p.gbGrant!, G.ultDecay);
    p.gbGrant! -= d;
    p.shieldPts = Math.max(0, (p.shieldPts ?? 0) - d);
  }
  // 맞아서 깎인 만큼은 이미 사라졌으니 남은 보호막보다 많이 줄이지 않게
  if (p.gbGrant !== undefined) {
    p.gbGrant = Math.min(p.gbGrant, p.shieldPts ?? 0);
    if (p.gbGrant <= 0) delete p.gbGrant;
  }
}

/** 궁극기 중 기본 공격마다: 거대한 빛의 망치가 함께 휘둘러져 앞을 넓게 침 (최대 체력 비례 · k: 1타 내려찍기 · 2타 휘두르기 · 3타 대지 강타) */
export function ultHammer(s: RunState, k: number): void {
  const p = s.player;
  if (!(p.gbUlt ?? 0)) return;
  const dmg = p.stats.maxHp * G.ultHpMul * (hasPerk(p, "gbLight") ? K.gbLight.mul : 1);
  for (const e of inCone(s, G.ultSwingR, G.ultSwingCos)) {
    strike(s, e, dmg, G.ultPush);
    press(s, e);
  }
  addEffect(s, { kind: "gbLightSwing", x: p.x, y: p.y - 6, dirX: p.faceX, dirY: p.faceY, size: G.ultSwingR, style: k, maxTicks: 20 });
}
