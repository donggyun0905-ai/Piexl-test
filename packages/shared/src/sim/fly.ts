// 플라이(비르디아): 잠자리 날개로 공중을 가르는 급습. 공격하면 겨눈 쪽으로 날아가며(그동안 무적) 지나간 적을 베고, 끝에서 앞쪽을 할큄
// 공격할 때 20% 확률로 하늘 습격: 날아올라 사라졌다가(무적) 방 끝에서 끝까지 10번 내리긋고 내려옴 (한 번에 공격력 30%)
// 발톱마다 더하는 것: 두 번 · 바람 칼날 · 독 · 연쇄 번개 · 서리 · 흡혈 · 신기루 · 그림자 분신 · 날개 칼날. 수치는 weaponsFly.FLY, 아이템은 itemsFly
import { TICK_RATE } from "../constants";
import { FLY_PERKS as K } from "../itemsFly";
import { FLY as F, type TalonStyle } from "../weaponsFly";
import { healPlayer } from "./combat";
import { raidTick, startRaid } from "./morphEvo";
import { createRng, deriveSeed } from "../rng";
import { alive, fan, inCone, onSegment, poison, rushTick, shoot, startRush, stun, strike } from "./s2Kit";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, dist2, hasPerk, normalize, weaponOf } from "./util";

const styleOf = (p: PlayerState): TalonStyle => weaponOf(p).talon ?? "glass";

/** 사냥꾼: 약해진 적에게 더 */
const huntMul = (p: PlayerState, e: EnemyState) => (hasPerk(p, "flyHunt") && e.hp <= e.maxHp * K.flyHunt.below ? K.flyHunt.mul : 1);

/** 급습 중 맞힌 적마다 (발톱 효과) */
function onSwoopHit(s: RunState, e: EnemyState, dmg: number): void {
  const p = s.player;
  const style = styleOf(p);
  const extra = huntMul(p, e) - 1;
  if (extra > 0) strike(s, e, dmg * extra);
  if (style === "twin") strike(s, e, dmg);
  else if (style === "venom") poison(e, dmg * F.venom, F.venomTicks);
  else if (style === "frost") {
    if (e.kind !== "dummy") e.slowTicks = Math.max(e.slowTicks ?? 0, F.frostSlow);
    stun(e, F.frostStun);
  } else if (style === "blood") healPlayer(s, dmg * F.leech);
  if (hasPerk(p, "flyFrenzy") && e.hp <= 0) p.fFrenzy = true;
}

/** 급습이 끝날 때: 앞쪽 할퀴기 + 발톱마다 마무리 */
function finish(s: RunState, dmg: number, from: { x: number; y: number }): void {
  const p = s.player;
  const style = styleOf(p);
  const rake = dmg * F.rakeMul * (hasPerk(p, "flyKeen") ? K.flyKeen.mul : 1);
  for (const e of inCone(s, F.rakeR, F.rakeArc)) strike(s, e, rake * huntMul(p, e));
  addEffect(s, { kind: "flyRake", x: p.x + p.faceX * 10, y: p.y + p.faceY * 10, dirX: p.faceX, dirY: p.faceY, size: 14, maxTicks: 12 });
  if (style === "wind") fan(s, F.windBlades, 0.3, { damage: dmg * F.bladeMul, spirit: "windBlade", r: 3, pierce: 2, range: F.bladeRange });
  else if (style === "queen") for (const a of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) shoot(s, a, { damage: dmg * F.wingMul, spirit: "wingBlade", r: 3, pierce: 3, range: F.bladeRange, speed: 3.2 });
  else if (style === "thunder") {
    let at = { x: p.x, y: p.y - 4 };
    for (const e of alive(s).sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id).slice(0, F.bolts)) {
      strike(s, e, dmg * F.boltMul);
      addEffect(s, { kind: "bolt", x: at.x, y: at.y, dirX: 0, dirY: 0, size: 2, maxTicks: 10, toX: e.x, toY: e.y, width: 2 });
      at = e;
    }
  } else if (style === "shadow") {
    // 그림자 분신이 잠시 뒤 같은 길을 되짚어 날며 다시 벰
    p.fShade = { tick: s.tick + F.shadeDelay, x: from.x, y: from.y, tx: p.x, ty: p.y, dmg: dmg * F.shadeMul };
  } else if (style === "mirage") {
    // 지나간 자리 세 곳이 잠시 뒤 한 번 더 터짐
    for (const t of [0, 0.5, 1]) s.pendingBlasts.push({ tick: s.tick + F.mirageDelay, x: from.x + (p.x - from.x) * t, y: from.y + (p.y - from.y) * t, radius: F.mirageR, damage: dmg * F.mirageMul });
  }
  if (hasPerk(p, "flyEvade")) p.invulnTicks = Math.max(p.invulnTicks, K.flyEvade.ticks);
}

/** 급습 시작 */
function swoop(s: RunState): void {
  const p = s.player;
  p.fCount = (p.fCount ?? 0) + 1;
  let dmg = p.stats.damage;
  if (p.fFrenzy) {
    dmg *= K.flyFrenzy.mul;
    delete p.fFrenzy;
  }
  // 하늘 습격 (20%)
  if (createRng(deriveSeed(s.seed, "flyRaid", s.tick, p.fCount)).nextFloat() < F.raidChance) {
    startRaid(s, dmg, F.raidPasses, F.raidMul, F.raidGap);
    return;
  }
  // 겹눈: 가장 가까운 적 쪽으로
  let dir: readonly [number, number] = [p.faceX, p.faceY];
  if (hasPerk(p, "flyDragonEye")) {
    const e = alive(s).sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id)[0];
    const d = e && normalize(e.x - p.x, e.y - p.y);
    if (d) dir = d;
  }
  const reach = p.stats.range * (hasPerk(p, "flyLonger") ? K.flyLonger.reach : 1) * (hasPerk(p, "flyDragonEye") ? K.flyDragonEye.reach : 1) * F.reachMul;
  const shade = styleOf(p) === "shadow";
  startRush(p, { t: F.swoopTicks, dx: dir[0], dy: dir[1], step: reach / F.swoopTicks, dmg, push: hasPerk(p, "flyGust") ? K.flyGust.push : 3, invuln: true, tint: shade ? "#6a4aa8" : "#a8f0ff" });
  p.fStart = { x: p.x, y: p.y };
  if (hasPerk(p, "flyAfterburn")) {
    p.fBoost = K.flyAfterburn.ticks;
    p.fStack = Math.min(K.flyAfterburn.max, (p.fStack ?? 0) + 1);
  }
  if (hasPerk(p, "flyRecharge") && p.fCount % K.flyRecharge.every === 0) p.attackCooldown = 0;
}

/** 가속으로 오른 이동 속도 배율 (player 이동) */
export function flyMoveMul(p: PlayerState): number {
  return (p.fBoost ?? 0) > 0 ? 1 + K.flyAfterburn.speed * (p.fStack ?? 0) : 1;
}

/** 틱마다 (발톱을 들었을 때 player에서) */
export function flyTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  if ((p.fBoost ?? 0) > 0) {
    p.fBoost = (p.fBoost ?? 0) - 1;
    if (p.fBoost <= 0) delete p.fStack;
  }
  if (p.mRaid) {
    raidTick(s);
    return;
  }
  const sh = p.fShade;
  if (sh && s.tick >= sh.tick) {
    for (const e of onSegment(s, sh.x, sh.y, sh.tx, sh.ty, 10)) strike(s, e, sh.dmg * huntMul(p, e));
    addEffect(s, { kind: "streak", x: sh.tx, y: sh.ty, dirX: 0, dirY: 0, size: 7, toX: sh.x, toY: sh.y, maxTicks: 14, tint: "#6a4aa8" });
    delete p.fShade;
  }
  const r = p.s2Rush;
  if (r) {
    const dmg = r.dmg;
    if (rushTick(s, (e) => onSwoopHit(s, e, dmg))) {
      finish(s, dmg, p.fStart ?? p);
      delete p.fStart;
    }
    return;
  }
  if (!want || p.attackCooldown > 0) return;
  p.attackCooldown = Math.max(1, Math.round(TICK_RATE / speed));
  p.attackCount++;
  swoop(s);
}

/** 연습장 등에서 다시 시작할 때 */
export function resetFly(p: PlayerState): void {
  for (const k of ["fCount", "fBoost", "fStack", "fFrenzy", "fStart", "fShade", "mRaid"] as const) delete p[k];
}
