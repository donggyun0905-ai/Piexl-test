// 가브리엘 스킬 넷(1 방패 돌진 · 2 중력 붕괴 · 3 성벽 · 4 불멸의 성벽) · 떨어지는 빛의 망치 · 궁극기 영역·보호막 (sim/gabriel에서 부름)
import { GABRIEL_PERKS as K } from "../itemsGabriel";
import { GABRIEL as G } from "../weaponsGabriel";
import { dropHammer, gbCooldown, gbHit, press, quake } from "./gabrielKit";
import { inCircle, isBoss, rushTick, startRush, stun } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, hasPerk } from "./util";

/** 궁극기 영역 안 보호막 한도 */
const ultCap = (s: RunState) => G.ultShield + (hasPerk(s.player, "gbImmortal") ? K.gbImmortal.shield : 0);

/** 2 중력 붕괴: 앞 땅에 중력장 → 둘레 적을 가운데로 끌어당기고 압박 → 빛의 망치가 내리꽂힘 */
function well(s: RunState): void {
  const p = s.player;
  const cx = p.x + p.faceX * G.wellAt;
  const cy = p.y + p.faceY * G.wellAt;
  const big = hasPerk(p, "gbPull");
  const r = G.wellR * (big ? K.gbPull.r : 1);
  const pull = G.wellPull * (big ? K.gbPull.pull : 1);
  for (const e of inCircle(s, cx, cy, r)) {
    press(s, e);
    if (isBoss(e)) continue;
    const dx = cx - e.x;
    const dy = cy - e.y;
    const d = Math.hypot(dx, dy) || 1;
    const k = Math.min(pull, d);
    e.x += (dx / d) * k;
    e.y += (dy / d) * k;
  }
  addEffect(s, { kind: "gbWell", x: cx, y: cy, dirX: 0, dirY: 0, size: r, maxTicks: G.wellDelay + 10 });
  const dmg = p.stats.damage * G.wellMul;
  dropHammer(s, cx, cy, G.wellDelay, G.wellHitR, dmg, G.wellStun);
  if (hasPerk(p, "gbOrbit")) dropHammer(s, cx, cy, G.wellDelay + K.gbOrbit.delay, G.wellHitR, dmg * K.gbOrbit.mul, G.wellStun);
}

/** 3 성벽: 보호막 + 둘레 땅을 울려 밀쳐냄 */
function wall(s: RunState): void {
  const p = s.player;
  const big = hasPerk(p, "gbBulwark");
  p.shieldPts = (p.shieldPts ?? 0) + p.stats.maxHp * G.wallShield * (big ? K.gbBulwark.shield : 1);
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
  } else if (i === 1) well(s);
  else if (i === 2) wall(s);
  else ult(s);
}

/** 방패 돌진 한 틱: 부딪힌 적 기절·압박 */
export function bashTick(s: RunState): void {
  if (!s.player.s2Rush) return;
  rushTick(s, (e) => {
    stun(e, G.bashStun);
    press(s, e);
  });
}

/** 떨어지는 빛의 망치: 땅에 닿으면 울림 */
export function dropsTick(s: RunState): void {
  const p = s.player;
  const list = p.gbDrops;
  if (!list) return;
  for (const d of list) if (--d.t === 0) quake(s, d.x, d.y, d.r, d.dmg, d.stun, d.press);
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

/** 궁극기 중 기본 공격마다: 친 자리에 빛의 망치 추가타 (최대 체력 비례) */
export function ultHammer(s: RunState, x: number, y: number): void {
  const p = s.player;
  if (!(p.gbUlt ?? 0)) return;
  const dmg = p.stats.maxHp * G.ultHpMul * (hasPerk(p, "gbLight") ? K.gbLight.mul : 1);
  dropHammer(s, x, y, G.dropTicks, G.ultHitR, dmg);
}
