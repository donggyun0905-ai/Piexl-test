// 미카엘라(성국, 공허의 인도자): 누르고 있으면 3연격 (들고 있는 무기로 둘: 검이면 베기 · 투창이면 찌르기 → 3타 투척: 박혀 폭발)
// 박힌 무기 줍기·대시 순간 이동·연쇄 폭발은 sim/michaelaSkills · 콤보·폭발은 sim/michaelaKit · 스킬 넷은 숫자 키
import { TICK_RATE } from "../constants";
import { MICHAELA_PERKS as K } from "../itemsMichaela";
import { MICHAELA as M } from "../weaponsMichaela";
import { createRng, deriveSeed } from "../rng";
import { addCombo, explode, mcHit, plant } from "./michaelaKit";
import { mcSkill, mcTouch, mcWorld, roomRain } from "./michaelaSkills";
import { inCone, onSegment, roomKey } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, hasPerk } from "./util";
import { isWall } from "./waveKit";

/** 1·2타: 검이면 앞 부채꼴 베기 · 투창이면 앞으로 찌르기 */
function strikeHeld(s: RunState, k: number): void {
  const p = s.player;
  if ((p.mcHeld ?? 0) === 0) {
    const sw = hasPerk(p, "mcSword");
    for (const e of inCone(s, M.swordR, sw ? K.mcSword.cos : M.swordCos)) mcHit(s, e, M.swordMul * (sw ? K.mcSword.mul : 1), M.swordPush);
    addEffect(s, { kind: "mcSlashFx", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: M.swordR, style: k, maxTicks: 14 });
    return;
  }
  const ln = hasPerk(p, "mcLance");
  const len = M.spearLen * (ln ? K.mcLance.len : 1);
  for (const e of onSegment(s, p.x, p.y, p.x + p.faceX * len, p.y + p.faceY * len, M.spearW)) mcHit(s, e, M.spearMul * (ln ? K.mcLance.mul : 1), 3);
  addEffect(s, { kind: "mcThrustFx", x: p.x, y: p.y - 4, dirX: p.faceX, dirY: p.faceY, size: len, style: k, maxTicks: 12 });
}

/** 3타 투척: 들고 있던 무기를 (dx,dy)로 던짐 → 처음 닿은 적(공허의 투창: 줄 위 모두) · 떨어진 자리에 박혀 폭발 · 콤보 · 보관소에서 다른 무기를 꺼냄 */
function throwHeld(s: RunState, dx: number, dy: number): void {
  const p = s.player;
  const jav = hasPerk(p, "mcJavelin");
  let len = M.throwLen * (jav ? K.mcJavelin.len : 1);
  // 벽에 닿으면 거기서 멈춤
  for (let d = 8; d <= len; d += 8) if (isWall(s, p.x + dx * d, p.y + dy * d)) { len = d - 8; break; }
  const on = onSegment(s, p.x, p.y, p.x + dx * len, p.y + dy * len, M.throwW).sort((a, b) => (a.x - p.x) * dx + (a.y - p.y) * dy - ((b.x - p.x) * dx + (b.y - p.y) * dy) || a.id - b.id);
  const hits = jav ? on : on.slice(0, 1);
  const mul = M.throwMul * (hasPerk(p, "mcHeavy") ? K.mcHeavy.mul : 1);
  for (const e of hits) mcHit(s, e, mul, 6);
  const end = !jav && hits[0] ? (hits[0].x - p.x) * dx + (hits[0].y - p.y) * dy : len;
  const x = p.x + dx * end;
  const y = p.y + dy * end;
  const k = p.mcHeld ?? 0;
  addEffect(s, { kind: "mcThrowFx", x: p.x, y: p.y - 6, dirX: dx, dirY: dy, size: 6, style: k, toX: x, toY: y, maxTicks: 10 });
  plant(s, x, y, k);
  explode(s, x, y, M.blastR, M.blastMul);
  addCombo(p, 1);
}

/** 3타: 던지기 (메아리 투척: 가끔 비껴 한 번 더) · 다른 무기를 꺼내 듦 */
function throwAll(s: RunState): void {
  const p = s.player;
  throwHeld(s, p.faceX, p.faceY);
  if (hasPerk(p, "mcEcho") && createRng(deriveSeed(s.seed, "mcEcho", s.tick)).nextFloat() < K.mcEcho.chance) {
    const { c, s: sn } = K.mcEcho;
    throwHeld(s, p.faceX * c - p.faceY * sn, p.faceX * sn + p.faceY * c);
  }
  p.mcHeld = 1 - (p.mcHeld ?? 0);
}

/** 방이 바뀌면 무기를 거두고 새 방에 포탈에서 무기가 쏟아짐 */
function roomCheck(s: RunState): void {
  const p = s.player;
  const key = roomKey(s);
  if (p.mcRoom === key) return;
  p.mcRoom = key;
  for (const k of ["mcBlades", "mcFalls", "mcChains", "mcUlt"] as const) delete p[k];
  roomRain(s);
}

/** 시간 재기: 대기 · 콤보 유지 */
function timers(s: RunState): void {
  const p = s.player;
  const cd = (p.mcCd ??= [0, 0, 0, 0]);
  for (let i = 0; i < cd.length; i++) if (cd[i]! > 0) cd[i]!--;
  if ((p.mcComboT ?? 0) > 0 && --p.mcComboT! <= 0) delete p.mcCombo;
}

/** 틱마다 (무기 보관소를 들었을 때 player에서) */
export function michaelaTick(s: RunState, want: boolean, speed: number): void {
  const p = s.player;
  roomCheck(s);
  timers(s);
  mcWorld(s);
  mcTouch(s);
  if (p.trKey && p.trKey >= 1 && p.trKey <= 4) mcSkill(s, p.trKey - 1);
  // 공격 대기가 끝난 뒤부터 잼 (공격 속도가 느려도 3타까지 이어지게)
  p.mcGap = (p.mcGap ?? 0) + (p.attackCooldown <= 0 ? 1 : 0);
  if (p.mcGap > M.comboGap) p.mcStep = 0;
  if (!want || p.attackCooldown > 0 || p.s2Rush) return;
  const k = p.mcStep ?? 0;
  // 무한의 무기고 중에는 모든 공격이 투척
  if (k === 2 || (p.mcUlt ?? 0) > 0) throwAll(s);
  else strikeHeld(s, k);
  p.mcLast = { k, t: s.tick };
  p.mcStep = (k + 1) % 3;
  p.mcGap = 0;
  p.attackCooldown = Math.max(1, Math.round((TICK_RATE / speed) * (M.stepTime[k] ?? 1)));
  p.attackCount++;
}

/** 연습장 등에서 다시 시작할 때 */
export function resetMichaela(p: RunState["player"]): void {
  for (const k of ["mcStep", "mcGap", "mcLast", "mcCd", "mcHeld", "mcCombo", "mcComboT", "mcBlades", "mcFalls", "mcChains", "mcUlt", "mcDash", "mcRoom"] as const) delete p[k];
}

export { isMichaela, michaelaSkills } from "./michaelaKit";
