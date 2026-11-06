// 베아트리스 스킬 넷(1 태양 검날 · 2 일식의 춤 · 3 태양의 낙인 · 4 자애) · 처단 · 심판 · 낙인 검기 (sim/beatrice에서 부름)
import { BEATRICE_PERKS as K } from "../itemsBeatrice";
import { BEATRICE as B } from "../weaponsBeatrice";
import { addBurn, addEvil, btCooldown, btHit } from "./beatriceKit";
import { alive, onSegment, rushTick, startRush } from "./s2Kit";
import type { PlayerState, RunState } from "./types";
import { addEffect, hasPerk } from "./util";

/** 태양 검날이 켜져 있는지 (자애 중에는 늘 켜짐) */
export const solarOn = (p: PlayerState) => (p.btSolar ?? 0) > 0 || (p.btGrace ?? 0) > 0;

/** 스킬 키 (1~4) */
export function btSkill(s: RunState, i: number): void {
  const p = s.player;
  const cd = (p.btCd ??= [0, 0, 0, 0]);
  if ((cd[i] ?? 0) > 0 || p.s2Rush) return;
  cd[i] = btCooldown(p, i);
  if (i === 0) {
    p.btSolar = B.solarTicks + (hasPerk(p, "btNoon") ? K.btNoon.more : 0);
    addEffect(s, { kind: "btSolar", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 26, maxTicks: 30 });
  } else if (i === 1) {
    const far = hasPerk(p, "btTotality") ? K.btTotality.dash : 1;
    startRush(p, { t: B.danceTicks, dx: p.faceX, dy: p.faceY, step: B.danceStep * far, dmg: p.stats.damage * B.danceMul, push: 4, invuln: true, tint: "#ff3a1a", w: p.r + 10 });
    p.btTwin = hasPerk(p, "btTotality") ? K.btTotality.twins : 2;
    p.btTwinGap = 0;
  } else if (i === 2) {
    const w = B.brandW * (hasPerk(p, "btBrand") ? K.btBrand.width : 1);
    (p.btWaves ??= []).push({ x: p.x, y: p.y, dx: p.faceX, dy: p.faceY, left: B.brandRange, w, hit: [] });
    addEffect(s, { kind: "btBrand", x: p.x, y: p.y, dirX: p.faceX, dirY: p.faceY, size: w, maxTicks: 14 });
  } else {
    // 자애: 체력 1 · 10초 동안 줄지 않음 · 화염 계수 한계 400% · 태양 검날 늘 켜짐 → 끝나고 10초 회복 불가
    p.hp = 1;
    p.btGrace = B.graceTicks;
    addEffect(s, { kind: "btGrace", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 40, maxTicks: 50 });
  }
}

/** 일식의 춤 돌진 한 틱 (경로의 적: 물리는 rushTick, 화염은 여기) */
export function danceTick(s: RunState): void {
  const p = s.player;
  if (!p.s2Rush) return;
  addEffect(s, { kind: "btDance", x: p.x, y: p.y, dirX: p.s2Rush.dx, dirY: p.s2Rush.dy, size: 14, maxTicks: 18 });
  rushTick(s, (e) => {
    btHit(s, e, 0, B.danceFire);
    if (solarOn(p)) addBurn(e, p);
  });
}

/** 낙인 검기: 앞으로 날아가며 꿰뚫고, 맞은 적마다 악 +2 */
export function wavesTick(s: RunState): void {
  const p = s.player;
  const list = p.btWaves;
  if (!list) return;
  const evil = hasPerk(p, "btBrand") ? K.btBrand.evil : B.brandEvil;
  for (const w of list) {
    const ax = w.x;
    const ay = w.y;
    w.x += w.dx * B.brandSpeed;
    w.y += w.dy * B.brandSpeed;
    w.left -= B.brandSpeed;
    for (const e of onSegment(s, ax, ay, w.x, w.y, w.w)) {
      if (w.hit.includes(e.id)) continue;
      w.hit.push(e.id);
      btHit(s, e, B.brandMul, B.brandFire, 6);
      addBurn(e, p);
      addEvil(s, e, evil);
    }
  }
  p.btWaves = list.filter((w) => w.left > 0);
  if (p.btWaves.length === 0) delete p.btWaves;
}

/** 처단: 악 10이 찬 적에게 X자 10개가 짧은 간격으로 터짐 */
export function execTick(s: RunState): void {
  const p = s.player;
  const list = p.btExecs;
  if (!list) return;
  for (const x of list) {
    if (--x.gap > 0) continue;
    const e = s.enemies.find((o) => o.id === x.id && o.hp > 0);
    if (!e) {
      x.left = 0;
      continue;
    }
    btHit(s, e, B.execMul * x.mul, B.execFire * x.mul);
    addEffect(s, { kind: "btExec", x: e.x, y: e.y, dirX: x.left, dirY: 0, size: B.execR + e.r, maxTicks: 24, tint: solarOn(p) ? "sun" : "" });
    x.left--;
    x.gap = B.execGap;
  }
  p.btExecs = list.filter((x) => x.left > 0);
  if (p.btExecs.length === 0) delete p.btExecs;
}

/** 심판: 예고 뒤 방 전체를 커다란 X자 태양 검격이 가름 */
export function judgeTick(s: RunState): void {
  const p = s.player;
  if (!p.btJudge || --p.btJudge > 0) return;
  delete p.btJudge;
  for (const e of alive(s)) btHit(s, e, B.judgeMul, B.judgeFire, 0);
  addEffect(s, { kind: "btJudge", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 1, maxTicks: 50 });
}
