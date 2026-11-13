// 마젠타(아슈바르): 누르면 지금 단계의 기본 공격 (1 자홍 저주비 · 2 푸시아 만개 · 3 환영 꽃잎 파동 · 4 저주의 꽃가루)
// 기본 공격마다 확률로 지금 단계의 추가 공격 (1 매혹의 시선 · 2 푸시아 환영분신 · 3 자홍 화산파 · 4 저주의 낙인) · 숫자 키 스킬(sim/mzSkills)
// 공용 틱·적응력·제약은 느아르와 같음 (sim/noir.ashTick·nrAdapt) · 저주·매혹·향기 연기(sim/mzHex)
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { srcEach, srcRun } from "./dmgSrc";
import { MZ_BASE as B, MZ_EXTRA as X, MZ_LV as L, MZ_SCENT as W } from "../itemsMagenta";
import { ashTick, type AshKit } from "./noir";
import { nrAim, nrAlive, nrArea, nrNearest, nrRoll } from "./nrKit";
import type { HitOn, MzVolleyKind } from "./nrTypes";
import { ashFxLen, nrVolley } from "./nrVolley";
import { mzEndTick, mzSkill, mzSkillSrc } from "./mzSkills";
import { mzBurst, mzHexAdd, mzHexTick } from "./mzHex";
import type { RunState } from "./types";
import { addEffect } from "./util";

type P = RunState["player"];

export const isMagenta = (p: P) => p.characterId === "magenta";
export { mzSkills } from "./mzSkills";

/** 저주 n겹 (반드시 매혹) */
export const hex = (n = 1, charm = false): HitOn => (charm ? { hex: n, charm } : { hex: n });

/** 같은 피해 n번 */
export const reps = (n: number, d: number) => Array.from({ length: n }, () => d);

/** (x, y)에 설치: 나눠 때리기 + 효과 · 끝 한 방 · 빨아들이는 힘 */
export function mzZone(s: RunState, kind: MzVolleyKind, x: number, y: number, r: number, every: number, dmgs: number[], on: HitOn, fin = 0, pull = 0): void {
  nrVolley(s, { kind, x, y, r, dmg: 0, dmgs, n: dmgs.length, every, fin, pull, on });
  addEffect(s, { kind, x, y, dirX: 0, dirY: 0, size: r, maxTicks: ashFxLen(dmgs.length + (fin > 0 ? 1 : 0), every) });
}

/** 공격 범위 안 마우스 자리 */
export const mzAim = (s: RunState) => nrAim(s, B.aim);

/** 확률로 방 아무 곳에 향기 연기 (가득 차면 오래된 것부터 사라짐) */
export function mzScent(s: RunState, sure = false): void {
  if (!sure && nrRoll(s, "mzScent") >= W.chance) return;
  const x = ROOM_MIN_X + 20 + (ROOM_MAX_X - ROOM_MIN_X - 40) * nrRoll(s, "mzScentX");
  const y = ROOM_MIN_Y + 20 + (ROOM_MAX_Y - ROOM_MIN_Y - 40) * nrRoll(s, "mzScentY");
  const list = (s.player.mzScents ??= []);
  list.push({ x, y, until: s.tick + W.life });
  if (list.length > W.max) list.splice(0, list.length - W.max);
  addEffect(s, { kind: "mzScent", x, y, dirX: 0, dirY: 0, size: W.r, maxTicks: 30 });
}

/** 기본 공격 한 번 (지금 단계) · 다시 누르기까지 틱 */
function attack(s: RunState): number {
  const p = s.player;
  const D = p.stats.damage;
  const st = p.nrBase ?? 1;
  srcRun(s, `k:mzBase${st}`, () => {
    if (st === 3) {
      const R = B.s3;
      nrArea(s, p.x, p.y, R.r, D * L.mid, { at: R.arc, dx: p.faceX, dy: p.faceY }, hex(R.hex));
      addEffect(s, { kind: "mzWave", x: p.x + p.faceX * R.r * 0.45, y: p.y + p.faceY * R.r * 0.45, dirX: p.faceX, dirY: p.faceY, size: R.r * 0.6, maxTicks: 22 });
      return;
    }
    const [x, y] = mzAim(s);
    if (st === 1) mzZone(s, "mzRain", x, y, B.s1.r, B.s1.every, reps(B.s1.hits, D * L.weak), hex());
    else if (st === 2) mzZone(s, "mzBloom", x, y, B.s2.r, B.s2.every, [D * L.weak, D * L.mid], hex());
    else mzZone(s, "mzPollen", x, y, B.s4.r, B.s4.every, reps(B.s4.hits, D * L.weak), hex());
  });
  mzScent(s);
  return [B.s1, B.s2, B.s3, B.s4][st - 1]!.cd;
}

/** 추가 공격 (지금 단계) */
function extra(s: RunState): void {
  const p = s.player;
  const D = p.stats.damage;
  const st = p.nrExtra ?? 1;
  srcRun(s, `k:mzExtra${st}`, () => {
    if (st === 2) return mzZone(s, "mzClone", p.x, p.y, X.clone.r, X.clone.every, reps(X.clone.hits, D * L.weak), hex());
    if (st === 4) {
      // 저주의 낙인: 가장 가까운 적에게 저주를 새기고 잠시 뒤 터짐
      const e = nrNearest(s, p.x, p.y, B.aim, p.faceX, p.faceY);
      if (!e) return;
      mzHexAdd(s, e, X.brand.hex);
      (p.mzBrands ??= []).push({ id: e.id, at: s.tick + X.brand.delay, dmg: D * L.mid });
      addEffect(s, { kind: "mzBrand", x: e.x, y: e.y, dirX: 0, dirY: 0, size: X.brand.r, maxTicks: X.brand.delay + 14 });
      return;
    }
    const [x, y] = mzAim(s);
    if (st === 1) {
      nrArea(s, x, y, X.gaze.r, D * L.weak, undefined, hex(1, true));
      addEffect(s, { kind: "mzGaze", x, y, dirX: 0, dirY: 0, size: X.gaze.r, maxTicks: 26 });
      return;
    }
    nrArea(s, x, y, X.volcano.r, D * L.strong, undefined, hex(X.volcano.hex));
    addEffect(s, { kind: "mzVolcano", x, y, dirX: 0, dirY: 0, size: X.volcano.r, maxTicks: 26 });
  });
}

/** 낙인이 터짐: 그 적 자리 범위 보통 1타 + 낙인 찍힌 적의 저주 터뜨리기 */
function brandTick(s: RunState): void {
  const p = s.player;
  if (!p.mzBrands?.length) return;
  for (const b of srcEach(p.mzBrands)) {
    if (b.at !== s.tick) continue;
    const e = s.enemies.find((f) => f.id === b.id && nrAlive(f));
    if (!e) continue;
    mzBurst(s, e, 1);
    nrArea(s, e.x, e.y, X.brand.r, b.dmg, undefined, hex());
    addEffect(s, { kind: "mzPop", x: e.x, y: e.y, dirX: 0, dirY: 0, size: X.brand.r, style: 1, maxTicks: 20 });
  }
  p.mzBrands = p.mzBrands.filter((b) => b.at > s.tick);
}

/** 틱마다 더: 저주·매혹·연기 · 낙인 */
function more(s: RunState): void {
  mzHexTick(s);
  srcRun(s, "k:mzExtra4", () => brandTick(s));
  srcRun(s, "k:mzSkillUp4", () => mzEndTick(s));
}

const KIT: AshKit = { attack, extra, chance: () => X.chance, skill: mzSkill, skillSrc: mzSkillSrc, more };

/** 틱마다 (욕망의 부채를 들었을 때 player에서) */
export function magentaTick(s: RunState, want: boolean, speed: number): void {
  ashTick(s, want, speed, KIT);
  // 날아가는 영혼 유린 구체를 따라가는 효과
  for (const f of s.effects) {
    if (f.kind !== "mzSoul") continue;
    const v = s.player.nrVolleys?.find((o) => o.kind === "mzSoul");
    if (v) [f.x, f.y] = [v.x, v.y];
  }
}

