// 크루세이더 공용 도우미: 피해 · 맞힘(성흔) · 성십자가 강림 각성 · 속죄의 무게 · 버팀(받는 피해·이동) · 가시 면류관
// 십자 균열 (마디마다 차례로 솟는 돌판 · 팔 끝 돌기둥) · 곧 터질 것 (여진 · 성묘 · 심판의 십자가 · 작은 십자가) · 가시 후광
import { srcEach, srcOpt, srcRun } from "./dmgSrc";
import { CRUSADER_PERKS as K } from "../itemsCrusader";
import { CRUSADER as C } from "../weaponsCrusader";
import { STIGMA } from "../weaponsDawn";
import type { CrCrack, CrZone } from "./crTypes";
import { inCircle, stun, strike } from "./s2Kit";
import { addStigma, awaken, isAwake } from "./stigma";
import type { EnemyState, PlayerState, RunState } from "./types";
import { addEffect, hasPerk, normalize, reachOf } from "./util";

export const isCrusader = (p: PlayerState) => p.characterId === "crusader";
const perk = (p: PlayerState, id: keyof typeof K) => hasPerk(p, id);

/** 공격력 × mul */
export const crDmg = (p: PlayerState, mul: number) => p.stats.damage * mul;
/** 무게 가득 */
export const weightFull = (p: PlayerState) => (p.crWeight ?? 0) >= C.weightMax;

/** 속죄의 무게 n 채움 (속죄 아이템이면 더) */
export function addWeight(p: PlayerState, n: number): void {
  if (n <= 0) return;
  p.crWeight = Math.min(C.weightMax, (p.crWeight ?? 0) + n * (perk(p, "crPenance") ? K.crPenance.gain : 1));
}

/** 성흔 채움 → 가득 차면 성십자가 강림 (뒤로 거대한 십자가가 떨어짐 · 둘레 기절 · 무게 가득 · 잠깐 무적) */
export function crGain(s: RunState, n: number): void {
  const p = s.player;
  if (n <= 0 || !addStigma(p, n * (perk(p, "crSense") ? K.crSense.gain : 1))) return;
  awaken(p, STIGMA.awakeTicks + (perk(p, "crEndless") ? K.crEndless.more : 0));
  const r = C.awakeR * reachOf(p);
  for (const e of inCircle(s, p.x, p.y, r)) {
    strike(s, e, crDmg(p, C.awakeMul), 14);
    stun(e, C.awakeStun);
  }
  p.crWeight = C.weightMax;
  p.invulnTicks = Math.max(p.invulnTicks, C.awakeInv);
  addEffect(s, { kind: "crAwakeFx", tint: "#ffd36a", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: r, maxTicks: 48 });
}

/** 크루세이더 공격 맞힘: 피해 · 처치면 성흔 */
export function crStrike(s: RunState, e: EnemyState, mul: number, push = 0): void {
  strike(s, e, crDmg(s.player, mul), push);
  if (e.hp <= 0) crGain(s, C.gainKill);
}

/** 맞힌 적 n: 성흔 */
export const crHits = (s: RunState, n: number) => crGain(s, n * C.gainHit);

/** 받는 피해 배율 (classTaken): 버팀 · 강림 */
export function crusaderTaken(p: PlayerState): number {
  if (!isCrusader(p)) return 1;
  const brace = p.crWind ? (perk(p, "crBrace") ? K.crBrace.cut : C.braceCut) : 1;
  return brace * (isAwake(p) ? (perk(p, "crGiant") ? K.crGiant.cut : C.awakeCut) : 1);
}

/** 이동 배율 (classMoveMul): 들어 올리는 동안 느림 */
export const crusaderMoveMul = (p: PlayerState) => (isCrusader(p) && p.crWind ? C.windMove : 1);

/** 맞은 뒤 (afterHurt): 버팀 중이면 가시 면류관 */
export function crusaderHurt(s: RunState): void {
  const p = s.player;
  if (!isCrusader(p) || !p.crWind || !perk(p, "crThorn") || (p.crThornCd ?? 0) > 0) return;
  p.crThornCd = K.crThorn.cool;
  const r = K.crThorn.r * reachOf(p);
  const hit = inCircle(s, p.x, p.y, r);
  srcRun(s, "crThorn", () => hit.forEach((e) => crStrike(s, e, K.crThorn.mul, 6)));
  crHits(s, hit.length);
  addEffect(s, { kind: "crThornFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 18, follow: true });
}

/** 십자 균열 시작 (찍은 자리 · 앞 방향 · 팔마다 마디 수) */
export function addCrack(p: PlayerState, c: Omit<CrCrack, "t" | "hit"> & { hit?: number[] }): void {
  (p.crCracks ??= []).push({ ...c, t: 0, hit: c.hit ?? [] });
}

/** 팔 방향 (앞 · 왼 · 오 · 뒤) */
const ARMS = (dx: number, dy: number): [number, number][] => [[dx, dy], [dy, -dx], [-dy, dx], [-dx, -dy]];

/** 십자 균열 한 틱: 마디 사이 틱마다 팔마다 한 마디씩 돌판이 솟아 그 둘레 적을 한 번 벰 · 마지막 마디에 돌기둥 */
export function cracksTick(s: RunState): void {
  const p = s.player;
  if (!p.crCracks) return;
  const rm = reachOf(p);
  let n = 0;
  for (const c of srcEach(p.crCracks)) {
    c.t++;
    if (c.t % C.segGap) continue;
    const i = c.t / C.segGap;
    ARMS(c.dx, c.dy).forEach(([ax, ay], a) => {
      const m = c.n[a]!;
      if (i > m) return;
      const x = c.x + ax * i * C.segLen * rm;
      const y = c.y + ay * i * C.segLen * rm;
      const end = i === m && c.pillar && a < 3;
      const r = (end ? K.crPillar.r : C.segW) * rm;
      for (const e of inCircle(s, x, y, r)) {
        if (c.hit.includes(e.id)) continue;
        c.hit.push(e.id);
        srcOpt(s, end && "crPillar", () => crStrike(s, e, end ? K.crPillar.mul : c.mul, 3));
        if (end) stun(e, K.crPillar.stun);
        n++;
      }
      addEffect(s, { kind: end ? "crPillarFx" : "crSpikeFx", x, y, dirX: ax, dirY: ay, size: r, maxTicks: end ? 30 : 22 });
    });
  }
  p.crCracks = p.crCracks.filter((c) => c.t < Math.max(...c.n) * C.segGap);
  if (p.crCracks.length === 0) delete p.crCracks;
  crHits(s, n);
}

/** 곧 터질 것 하나 */
export const addZone = (p: PlayerState, z: Omit<CrZone, "max">) => (p.crZones ??= []).push({ ...z, max: z.t });

/** 심판의 십자가 떨어뜨리기 (무거운 심판이면 더 아프고 넓게) */
export function dropJudge(p: PlayerState, x: number, y: number): void {
  const v = perk(p, "crVerdict");
  addZone(p, { k: 2, x, y, t: C.judgeFall, r: C.judgeR * reachOf(p) * (v ? K.crVerdict.r : 1), mul: C.judgeMul * (v ? K.crVerdict.mul : 1) });
}

/** 여진 · 성묘 · 심판의 십자가 · 작은 십자가 한 틱 */
export function zonesTick(s: RunState): void {
  const p = s.player;
  if (!p.crZones) return;
  let n = 0;
  const born: CrZone[] = [];
  for (const z of srcEach(p.crZones)) {
    z.t--;
    if (z.k === 1) {
      if (--z.next! > 0) continue;
      z.next = K.crGrave.every;
      for (const e of inCircle(s, z.x, z.y, z.r)) {
        crStrike(s, e, z.mul);
        n++;
      }
      addEffect(s, { kind: "crGraveFx", x: z.x, y: z.y, dirX: 0, dirY: 0, size: z.r, maxTicks: 20 });
      continue;
    }
    if (z.t > 0) continue;
    const big = z.k === 2;
    for (const e of inCircle(s, z.x, z.y, z.r)) {
      crStrike(s, e, z.mul, big ? C.judgePush : 4);
      if (z.k !== 0) stun(e, big ? C.judgeStun : C.slamStun);
      n++;
    }
    addEffect(s, { kind: z.k === 0 ? "crAfterFx" : "crJudgeFx", x: z.x, y: z.y, dirX: 0, dirY: 0, size: z.r, maxTicks: big ? 40 : 26, ...(big ? {} : { width: 1 }) });
    if (big) crGain(s, C.gainJudge);
    if (big && perk(p, "crGrave")) srcRun(s, "crGrave", () => { born.push({ k: 1, x: z.x, y: z.y, t: K.crGrave.ticks, max: K.crGrave.ticks, r: K.crGrave.r * reachOf(p), mul: K.crGrave.mul, next: K.crGrave.every }); });
  }
  p.crZones = [...p.crZones.filter((z) => z.t > 0), ...born];
  if (p.crZones.length === 0) delete p.crZones;
  crHits(s, n);
}

/** 가시 후광 던지기 (바라보는 쪽) */
export function throwHalo(p: PlayerState): void {
  const h = K.crHalo;
  p.crHalo = { x: p.x, y: p.y - 14, vx: p.faceX * h.speed, vy: p.faceY * h.speed, out: Math.round(h.out * reachOf(p)), hit: [] };
}

/** 가시 후광 한 틱: 나갔다가 몸으로 돌아옴 (가는 길·오는 길에 한 번씩 벰) */
export function haloTick(s: RunState): void {
  const p = s.player;
  const h = p.crHalo;
  if (!h) return;
  if (h.out > 0 && --h.out === 0) h.hit = [];
  if (h.out === 0) {
    const d = normalize(p.x - h.x, p.y - 14 - h.y);
    if (!d || (p.x - h.x) ** 2 + (p.y - 14 - h.y) ** 2 < 100) return void delete p.crHalo;
    h.vx = d[0] * K.crHalo.speed * 1.2;
    h.vy = d[1] * K.crHalo.speed * 1.2;
  }
  h.x += h.vx;
  h.y += h.vy;
  let n = 0;
  for (const e of inCircle(s, h.x, h.y + 10, K.crHalo.r * reachOf(p))) {
    if (h.hit.includes(e.id)) continue;
    h.hit.push(e.id);
    crStrike(s, e, K.crHalo.mul, 2);
    n++;
  }
  crHits(s, n);
}
