// 혼령 소환수 (몸이 있는 것): 혼-랑 늑대(체력 낮음·공격력 높음) · 혼-범(체력·공격력 높음) · 혼-영 분신(방 어딘가에 가만히 서서 적을 끌어들임, 쓰러지면 연기가 터짐)
// 늑대·범은 내 둘레를 따라다니다 보는 거리 안 적에게 달려가 공격 · 적 몸에 닿으면 피해를 받음 (은신 중이면 안 받음) · 방을 옮기면 같이 옴
// 혼령사냥(내가 은신 중): 늑대 첫 타격 확정 치명타·출혈 · 범 1.5배 커지고 공격력·체력 늘어남
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { HONRYEONG_PERKS as K } from "../itemsHonryeong";
import { applyBleed } from "./gunExtras";
import { hasHr, hrArea as hrArea_, hrHit as hrHit_, hrRng, hrRoll, huntOn, petHp, petMul } from "./hrKit";
import type { HrBeast, HrDecoy } from "./hrTypes";
import { bodyHurt, bodyStep, bringNear, foeNear } from "./puppetAllies";
import type { RunState } from "./types";
import { addEffect, keepInRoom, markCrit, normalize, roomGrid } from "./util";
import { srcFn, srcCb } from "./dmgSrc";
const hrArea = srcFn("hrBeasts", () => hrArea_), hrHit = srcFn("hrBeasts", () => hrHit_);

type P = RunState["player"];

const nextId = (p: P) => (p.hrNext = (p.hrNext ?? 0) + 1);
const chance = (p: P, c: number) => c * (hasHr(p, "hrPact") ? K.hrPact.chance : 1);

function spawnBeast(s: RunState, kind: number, i: number): void {
  const p = s.player;
  const D = kind ? K.hrTiger : K.hrWolf;
  const hp = Math.round(D.hp * petHp(p));
  const b: HrBeast = { id: nextId(p), kind, x: p.x + (i ? 12 : -12), y: p.y + 8, prevX: p.x, prevY: p.y, hp, maxHp: hp, r: D.r, cd: 10, hurt: 20, face: p.faceX < 0 ? -1 : 1, swing: 0, left: D.life };
  keepInRoom(b, roomGrid(s));
  b.prevX = b.x;
  b.prevY = b.y;
  (p.hrBeasts ??= []).push(b);
  addEffect(s, { kind: "hrPuff", x: b.x, y: b.y, dirX: 0, dirY: 0, size: D.r * 2.5, style: 1, maxTicks: 20 });
}

/** 공격할 때: 확률로 늑대 둘 · 범 하나 · 분신 하나 */
export function summonOnAttack(s: RunState): void {
  const p = s.player;
  const count = (kind: number) => (p.hrBeasts ?? []).filter((b) => b.kind === kind).length;
  if (hasHr(p, "hrWolf") && count(0) < K.hrWolf.max && hrRoll(s, "hrWolf") < chance(p, K.hrWolf.chance)) {
    for (let i = 0; i < K.hrWolf.n && count(0) < K.hrWolf.max; i++) spawnBeast(s, 0, i);
  }
  if (hasHr(p, "hrTiger") && count(1) < K.hrTiger.max && hrRoll(s, "hrTiger") < chance(p, K.hrTiger.chance)) spawnBeast(s, 1, 0);
  if (hasHr(p, "hrDecoy") && (p.hrDecoys?.length ?? 0) < K.hrDecoy.max && hrRoll(s, "hrDecoy") < chance(p, K.hrDecoy.chance)) {
    const hp = Math.round(K.hrDecoy.hp * petHp(p));
    const rng = hrRng(s, "hrDecoyAt");
    const x = ROOM_MIN_X + 12 + rng.nextFloat() * Math.max(1, ROOM_MAX_X - ROOM_MIN_X - 24);
    const y = ROOM_MIN_Y + 12 + rng.nextFloat() * Math.max(1, ROOM_MAX_Y - ROOM_MIN_Y - 24);
    const d: HrDecoy = { id: nextId(p), x, y, prevX: x, prevY: y, hp, maxHp: hp, r: p.r, cd: 0, hurt: 20, face: p.faceX < 0 ? -1 : 1, swing: 0, left: K.hrDecoy.life };
    keepInRoom(d, roomGrid(s));
    d.prevX = d.x;
    d.prevY = d.y;
    (p.hrDecoys ??= []).push(d);
    addEffect(s, { kind: "hrPuff", x: d.x, y: d.y, dirX: 0, dirY: 0, size: 16, style: 1, maxTicks: 20 });
  }
}

/** 범: 혼령사냥으로 은신 중이면 커짐 (몸·체력) · 풀리면 돌아옴 */
function tigerSize(p: P, b: HrBeast): void {
  const big = huntOn(p);
  if (big === !!b.big) return;
  b.big = big;
  const k = big ? K.hrHunt.hp : 1 / K.hrHunt.hp;
  b.maxHp = Math.round(b.maxHp * k);
  b.hp = big ? Math.round(b.hp * k) : Math.min(b.hp, b.maxHp);
  b.r = K.hrTiger.r * (big ? K.hrHunt.size : 1);
}

function beastTick(s: RunState, b: HrBeast, i: number): boolean {
  const p = s.player;
  const tiger = b.kind === 1;
  const D = tiger ? K.hrTiger : K.hrWolf;
  const hunt = huntOn(p);
  if (tiger) tigerSize(p, b);
  b.prevX = b.x;
  b.prevY = b.y;
  if (b.cd > 0) b.cd--;
  if (b.swing > 0) b.swing--;
  const e = foeNear(s, b.x, b.y, D.sight);
  if (e) {
    const reach = b.r + e.r + 3;
    if ((e.x - b.x) ** 2 + (e.y - b.y) ** 2 > reach * reach) bodyStep(s, b, e.x, e.y, D.speed);
    else if (b.cd <= 0) {
      b.cd = D.rate;
      b.swing = 14;
      b.face = e.x < b.x ? -1 : 1;
      const dmg = p.stats.damage * D.mul * petMul(p);
      if (tiger) hrArea(s, e.x, e.y, K.hrTiger.reach * (b.big ? K.hrHunt.size : 1), dmg * (b.big ? K.hrHunt.mul : 1), "hrClaw", b.big ? 1 : 0);
      else {
        // 은신한 늑대: 그 적을 처음 물 때 확정 치명타 + 출혈
        const first = hunt && !(p.hrBit ??= []).includes(e.id);
        const d = normalize(e.x - b.x, e.y - b.y) ?? [0, 0];
        hrHit(s, e, dmg * (first ? K.hrHunt.crit : 1), d[0], d[1]);
        if (first) {
          p.hrBit!.push(e.id);
          markCrit(s, e);
          if (e.hp > 0) applyBleed(e);
        }
        addEffect(s, { kind: "hrBite", x: e.x, y: e.y, dirX: d[0], dirY: d[1], size: 12, style: first ? 1 : 0, maxTicks: 14 });
      }
    }
  } else {
    // 적이 없으면 내 곁으로 (늑대는 왼쪽·오른쪽, 범은 뒤)
    const tx = p.x + ((i % 3) - 1) * 16;
    const ty = p.y + 12 + (tiger ? 8 : 0);
    if ((tx - b.x) ** 2 + (ty - b.y) ** 2 > 64) bodyStep(s, b, tx, ty, D.speed);
  }
  const dead = --b.left <= 0 || (!hunt && bodyHurt(s, b));
  if (dead) addEffect(s, { kind: "hrPuff", x: b.x, y: b.y, dirX: 0, dirY: 0, size: b.r * 2.5, style: 2, maxTicks: 20 });
  return !dead;
}

/** 틱마다: 늑대·범 · 분신 (moved = 방을 옮김) */
export function beastsTick(s: RunState, moved: boolean): void {
  const p = s.player;
  if (p.hrBeasts?.length) {
    if (moved) p.hrBeasts.forEach((b, i) => bringNear(s, b, i));
    p.hrBeasts = p.hrBeasts.filter(srcCb((b, i) => beastTick(s, b, i)));
  }
  if (!p.hrDecoys?.length) return;
  p.hrDecoys = p.hrDecoys.filter(srcCb((d) => {
    if (--d.left > 0 && !bodyHurt(s, d)) return true;
    // 쓰러지면(또는 시간이 다하면) 연기가 터짐
    hrArea(s, d.x, d.y, K.hrDecoy.r, p.stats.damage * K.hrDecoy.mul * petMul(p), "hrPop");
    return false;
  }));
}
