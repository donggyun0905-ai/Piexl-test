// 시저스 공용 도우미: 피해(각성 배율) · 성흔 → 달빛 각성 · 단죄(목 자르기) · 운명의 실 묶기·끊기
import { SCISSORS_PERKS as K } from "../itemsScissors";
import { SCISSORS as X } from "../weaponsScissors";
import { STIGMA } from "../weaponsDawn";
import { healPlayer } from "./combat";
import { alive, inCircle, isBoss, onSegment, strike, stun } from "./s2Kit";
import { addStigma, awaken, isAwake } from "./stigma";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk } from "./util";

export const isScissors = (p: PlayerState) => p.characterId === "scissors";

/** 공격력 × mul (벼린 날 · 달빛 각성 중 더 셈) */
export const sxDmg = (p: PlayerState, mul: number) => p.stats.damage * mul * (hasPerk(p, "sxEdge") ? K.sxEdge.mul : 1) * (isAwake(p) ? X.awakeMul : 1);

/** 성흔 채움 → 가득 차면 달빛 각성 (둘레 달빛 폭발 · 잠깐 무적) */
export function sxGain(s: RunState, n: number): void {
  const p = s.player;
  if (n <= 0 || !addStigma(p, n * (hasPerk(p, "sxMoon") ? K.sxMoon.gain : 1))) return;
  awaken(p, STIGMA.awakeTicks + (hasPerk(p, "sxFull") ? K.sxFull.more : 0));
  const h = hasPerk(p, "sxHalo");
  const r = X.awakeBurstR * (h ? K.sxHalo.r : 1);
  for (const e of inCircle(s, p.x, p.y, r)) strike(s, e, p.stats.damage * X.awakeBurstMul * (h ? K.sxHalo.mul : 1), 12, "radiance");
  p.invulnTicks = Math.max(p.invulnTicks, X.awakeInv);
  addEffect(s, { kind: "blAwakeFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 40, follow: true });
}

/** 단죄: 보통 적은 이 체력 비율 이하면 목을 자름 */
const execAt = (p: PlayerState) => (hasPerk(p, "sxHead") ? K.sxHead.at : X.execAt);

/** 목을 자른 뒤: 수확 · 공포 · 연쇄 단죄 */
function executed(s: RunState, e: EnemyState, depth: number): void {
  const p = s.player;
  addEffect(s, { kind: "sxExecFx", x: e.x, y: e.y, dirX: p.faceX, dirY: p.faceY, size: e.r, maxTicks: 36 });
  if (hasPerk(p, "sxHarvest")) healPlayer(s, p.stats.maxHp * K.sxHarvest.heal);
  if (hasPerk(p, "sxFear")) for (const f of inCircle(s, e.x, e.y, K.sxFear.r)) stun(f, K.sxFear.stun);
  if (!hasPerk(p, "sxChain") || depth > 0) return;
  for (const f of inCircle(s, e.x, e.y, K.sxChain.r)) cut(s, f, sxDmg(p, K.sxChain.mul), 4, depth + 1);
}

/** 가위로 벰: 체력이 적은 보통 적은 목을 잘라 바로 처치 · 체력이 적은 보스는 더 셈 → 차는 성흔 */
export function cut(s: RunState, e: EnemyState, dmg: number, push = 0, depth = 0): number {
  const p = s.player;
  if (e.hp <= 0) return 0;
  const left = e.hp / Math.max(1, e.maxHp);
  const boss = isBoss(e);
  if (!boss && e.kind !== "dummy" && left <= execAt(p)) {
    // 목 자르기: 남은 체력보다 크게 (방어·피해 감소가 있어도 쓰러지게)
    strike(s, e, dmg + e.hp * 4, push);
    if (e.hp <= 0) executed(s, e, depth);
    return X.gainExec;
  }
  strike(s, e, dmg * (boss && left <= X.bossAt ? (hasPerk(p, "sxGiant") ? K.sxGiant.mul : X.bossMul) : 1), push);
  return e.hp <= 0 ? X.gainExec / 2 : 0;
}

/** 운명의 실을 묶음 (이미 묶였으면 시간만 새로) · 가득이면 가장 오래된 실이 풀림 */
export function tie(s: RunState, e: EnemyState): void {
  const p = s.player;
  if (e.hp <= 0) return;
  const t = X.threadTicks + (hasPerk(p, "sxLong") ? K.sxLong.more : 0);
  const list = (p.sxThreads ??= []);
  const had = list.find((th) => th.id === e.id);
  if (had) {
    had.t = t;
    return;
  }
  const max = X.threadMax + (hasPerk(p, "sxSpool") ? K.sxSpool.add : 0);
  if (list.length >= max) list.sort((a, b) => a.t - b.t || a.id - b.id).shift();
  list.push({ id: e.id, t });
  addEffect(s, { kind: "sxTieFx", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r, maxTicks: 18 });
}

/** 운명의 실 한 틱: 시간이 다 되거나 적이 사라지면 풀림 · 얽매임: 묶인 적 느려짐 */
export function threadsTick(s: RunState): void {
  const p = s.player;
  const list = p.sxThreads;
  if (!list) return;
  const foes = alive(s);
  p.sxThreads = list.filter((th) => --th.t > 0 && foes.some((e) => e.id === th.id));
  if (hasPerk(p, "sxBind")) for (const th of p.sxThreads) {
    const e = foes.find((f) => f.id === th.id);
    if (e && !isBoss(e)) e.slowTicks = Math.max(e.slowTicks ?? 0, K.sxBind.slow);
  }
  if (p.sxThreads.length === 0) delete p.sxThreads;
}

/** 실을 모두 끊음: 묶인 적은 멀어 팽팽할수록 크게 · 실이 지나는 다른 적도 벰 */
export function cutThreads(s: RunState): void {
  const p = s.player;
  const list = p.sxThreads;
  if (!list?.length) return;
  delete p.sxThreads;
  const foes = alive(s);
  const tautMul = X.cutTaut * (hasPerk(p, "sxTaut") ? K.sxTaut.mul : 1);
  const lineMul = X.lineMul * (hasPerk(p, "sxWeave") ? K.sxWeave.mul : 1);
  let n = 0;
  const lined = new Set<number>();
  for (const th of list) {
    const e = foes.find((f) => f.id === th.id);
    if (!e || e.hp <= 0) continue;
    const d = Math.hypot(e.x - p.x, e.y - p.y);
    const taut = Math.max(0, Math.min(1, (d - X.slackAt) / (X.tautAt - X.slackAt)));
    addEffect(s, { kind: "sxCutFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: taut, toX: e.x, toY: e.y, maxTicks: 22 });
    for (const f of onSegment(s, p.x, p.y, e.x, e.y, X.lineW)) {
      if (f.id === e.id || lined.has(f.id) || list.some((o) => o.id === f.id)) continue;
      lined.add(f.id);
      n += cut(s, f, sxDmg(p, lineMul));
    }
    n += cut(s, e, sxDmg(p, X.cutMul + tautMul * taut), 4) + X.gainCut;
  }
  sxGain(s, n);
}
