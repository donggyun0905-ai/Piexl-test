// 인형술사 내 친구~(거대 인형 친구)와 분신
// 인형 친구: 체력·공격력 높고 느림. 내 둘레를 돌아다니다 지키는 거리 안에 적이 들어오면 걸어가 내려침 · 쓰러지면 30초 뒤 내 곁에 다시
// 분신: 피해를 받으면 방 어딘가에 내 분신(체력 고정)이 나타나 적이 모두 분신을 쫓음 (sim/enemies가 puppetDecoy로 목표를 바꿈) · 30초마다
import { PUPPET_PERKS as K } from "../itemsPuppet";
import { createRng, deriveSeed } from "../rng";
import { rot } from "./orbit";
import type { PuppetBody } from "./ppTypes";
import { allyDmg, allyRate, bodyHurt, bodyStep, bringNear, foeNear, ppArea } from "./puppetAllies";
import type { RunState } from "./types";
import { addEffect, hasPerk, keepInRoom, roomGrid } from "./util";

const body = (id: number, x: number, y: number, hp: number, r: number): PuppetBody => ({ id, x, y, prevX: x, prevY: y, hp, maxHp: hp, r, cd: 30, hurt: 30, face: 1, swing: 0 });

/** 인형 친구 한 틱 */
function golemTick(s: RunState, moved: boolean): void {
  const p = s.player;
  const G = K.ppGolem;
  if (!p.ppGolem) {
    if ((p.ppGolemCd ?? 0) > 0) p.ppGolemCd = (p.ppGolemCd ?? 0) - 1;
    else {
      p.ppGolem = body(0, p.x + 16, p.y + 8, G.hp, G.r);
      keepInRoom(p.ppGolem, roomGrid(s));
      addEffect(s, { kind: "ppClone", x: p.ppGolem.x, y: p.ppGolem.y, dirX: 0, dirY: 0, size: 18, style: 1, maxTicks: 30 });
    }
    return;
  }
  const g = p.ppGolem;
  if (moved) bringNear(s, g, 4);
  g.prevX = g.x;
  g.prevY = g.y;
  if (g.cd > 0) g.cd--;
  if (g.swing > 0) g.swing--;
  // 지키는 거리 안(내 둘레) 적을 쫓음
  const e = foeNear(s, p.x, p.y, G.guard);
  if (e && g.swing <= 0) {
    const reach = G.reach + e.r;
    if ((e.x - g.x) ** 2 + (e.y - g.y) ** 2 > reach * reach) bodyStep(s, g, e.x, e.y, G.speed);
    else if (g.cd <= 0) {
      g.cd = allyRate(s, G.rate);
      g.swing = 18;
      g.face = e.x < g.x ? -1 : 1;
      ppArea(s, (g.x + e.x) / 2, (g.y + e.y) / 2, G.reach, allyDmg(s, G.mul), "ppSlam", 0, { push: 6 });
    }
  } else if (!e) {
    // 내 둘레를 천천히 돎
    const v = rot(((s.tick % 600) / 600) * Math.PI * 2);
    const tx = p.x + v[0] * 34;
    const ty = p.y + v[1] * 22;
    if ((tx - g.x) ** 2 + (ty - g.y) ** 2 > 36) bodyStep(s, g, tx, ty, G.speed);
  }
  if (bodyHurt(s, g)) {
    addEffect(s, { kind: "ppCorpsePop", x: g.x, y: g.y, dirX: 0, dirY: 0, size: 24, style: 1, maxTicks: 26 });
    delete p.ppGolem;
    p.ppGolemCd = G.respawn;
  }
}

/** 분신 한 틱 (남은 틱은 cd) */
function cloneTick(s: RunState, moved: boolean): void {
  const p = s.player;
  if ((p.ppCloneCd ?? 0) > 0) p.ppCloneCd = (p.ppCloneCd ?? 0) - 1;
  const c = p.ppClone;
  if (!c) return;
  c.prevX = c.x;
  c.prevY = c.y;
  c.cd--;
  if (moved || c.cd <= 0 || bodyHurt(s, c)) {
    addEffect(s, { kind: "ppClone", x: c.x, y: c.y, dirX: 0, dirY: 0, size: 12, style: 2, maxTicks: 20 });
    delete p.ppClone;
  }
}

/** 맞았을 때: 분신이 방 어딘가에 나타남 */
export function cloneOnHurt(s: RunState): void {
  const p = s.player;
  if (!hasPerk(p, "ppClone") || (p.ppCloneCd ?? 0) > 0 || p.ppClone) return;
  const rng = createRng(deriveSeed(s.seed, "ppClone", s.tick));
  const v = rot(rng.nextFloat() * Math.PI * 2);
  const c = body(1, p.x + v[0] * K.ppClone.dist, p.y + v[1] * K.ppClone.dist, K.ppClone.hp, p.r);
  keepInRoom(c, roomGrid(s));
  c.prevX = c.x;
  c.prevY = c.y;
  c.cd = K.ppClone.ticks;
  c.face = p.faceX < 0 ? -1 : 1;
  p.ppClone = c;
  p.ppCloneCd = K.ppClone.cd;
  addEffect(s, { kind: "ppClone", x: c.x, y: c.y, dirX: 0, dirY: 0, size: 14, maxTicks: 30 });
}

/** 적이 쫓을 자리 (분신이 있으면 분신, 협동은 없음) */
export function puppetDecoy(s: RunState): { x: number; y: number } | null {
  return !s.party && s.player.ppClone ? s.player.ppClone : null;
}

/** 틱마다: 인형 친구 · 분신 */
export function friendsTick(s: RunState, moved: boolean): void {
  const p = s.player;
  if (hasPerk(p, "ppGolem")) golemTick(s, moved);
  else delete p.ppGolem;
  cloneTick(s, moved);
}
