// 미카엘라 무기 기술 14가지 (무기마다 어떤 기술을 쓰는지는 michaelaWeaponMoves): 베기 · 내려찍기 · 휘두르기 · 회전 베기 · 찌르기 · 돌진 찌르기 · 던지기 · 세 갈래 던지기
// X 베기 · 땅 가르기 · 올려베기 · 회오리 · 칼비 · 꿰뚫는 빛 창. 맞히면 그 무기 속성 효과 (sim/michaelaKit.mcHit) · 수치는 MICHAELA_MOVES (관리자에서 바꿈)
import { MICHAELA_PERKS as K } from "../itemsMichaela";
import { MICHAELA as M, MICHAELA_MOVES as V } from "../weaponsMichaela";
import { MC_MOVE_IDS, type McMove } from "../michaelaWeaponMoves";
import { createRng, deriveSeed } from "../rng";
import { addCombo, dropBlade, hold, kindOf, mcHit, pickWeapon, plant } from "./michaelaKit";
import { inCircle, inCone, onSegment, stun, strike } from "./s2Kit";
import type { EnemyState, RunState } from "./types";
import { addEffect, hasPerk, keepInRoom, roomGrid } from "./util";
import { isWall } from "./waveKit";

/** 기술 효과 하나 (그림: 기술 번호 × 64 + 그림 무기 번호) */
function fx(s: RunState, m: McMove, x: number, y: number, size: number, toX = x, toY = y, ticks = 16): void {
  const p = s.player;
  const style = MC_MOVE_IDS.indexOf(m) * 64 + (p.mcWeapon ?? 0);
  addEffect(s, { kind: "mcMoveFx", x, y, dirX: p.faceX, dirY: p.faceY, size, style, toX, toY, maxTicks: ticks });
}

/** 기술로 한 번 맞힘 (성스러운 화약: 더 셈 · 파편: 출혈) */
function hit(s: RunState, e: EnemyState, mul: number, push = 0): void {
  const p = s.player;
  const m = mul * (hasPerk(p, "mcPowder") ? K.mcPowder.mul : 1);
  mcHit(s, e, m, push, p.mcElem ?? 0);
  if (hasPerk(p, "mcShrapnel") && e.hp > 0) strike(s, e, p.stats.damage * m * K.mcShrapnel.mul, 0, "bleed");
}

/** 넓은 폭심: 기술 범위 배율 */
const wide = (s: RunState) => (hasPerk(s.player, "mcWide") ? K.mcWide.r : 1);
/** 검 기술이면 백은의 검, 창 기술이면 백금의 창 */
const sword = (s: RunState) => (hasPerk(s.player, "mcSword") && (s.player.mcHeld ?? 0) === 0 ? K.mcSword.mul : 1);
const lance = (s: RunState) => (hasPerk(s.player, "mcLance") && (s.player.mcHeld ?? 0) === 1 ? K.mcLance : { len: 1, mul: 1 });

/** 벽 앞까지 거리 (dx,dy 쪽, 8씩) */
function reach(s: RunState, dx: number, dy: number, len: number): number {
  const p = s.player;
  for (let d = 8; d <= len; d += 8) if (isWall(s, p.x + dx * d, p.y + dy * d)) return d - 8;
  return len;
}

/** 던지기: (dx,dy)로 들고 있던 무기를 던짐 → 처음 닿은 적(공허의 투창: 줄 위 모두) · plantIt면 떨어진 자리에 박힘 */
function throwOne(s: RunState, dx: number, dy: number, mul: number, plantIt: boolean): void {
  const p = s.player;
  const jav = hasPerk(p, "mcJavelin");
  const len = reach(s, dx, dy, M.throwLen * (jav ? K.mcJavelin.len : 1) * wide(s));
  const on = onSegment(s, p.x, p.y, p.x + dx * len, p.y + dy * len, M.throwW).sort((a, b) => (a.x - p.x) * dx + (a.y - p.y) * dy - ((b.x - p.x) * dx + (b.y - p.y) * dy) || a.id - b.id);
  const hits = jav ? on : on.slice(0, 1);
  for (const e of hits) hit(s, e, mul * (hasPerk(p, "mcHeavy") ? K.mcHeavy.mul : 1), 6);
  const end = !jav && hits[0] ? (hits[0].x - p.x) * dx + (hits[0].y - p.y) * dy : len;
  const w = p.mcWeapon ?? 0;
  addEffect(s, { kind: "mcThrowFx", x: p.x, y: p.y - 6, dirX: dx, dirY: dy, size: 6, style: w, toX: p.x + dx * end, toY: p.y + dy * end, maxTicks: 10 });
  if (plantIt) plant(s, p.x + dx * end, p.y + dy * end, w);
}

/** 던지기 기술 (세 갈래면 양옆도 · 메아리 투척: 가끔 비껴 한 번 더) → 콤보 · 다른 종류의 새 무기를 꺼냄 */
function throwMove(s: RunState, fan: boolean, mul: number): void {
  const p = s.player;
  const [fx0, fy0] = [p.faceX, p.faceY];
  const turn = (c: number, sn: number): [number, number] => [fx0 * c - fy0 * sn, fx0 * sn + fy0 * c];
  throwOne(s, fx0, fy0, mul * (fan ? V.fanMul : M.throwMul), true);
  if (fan) for (const sn of [V.fanS, -V.fanS]) throwOne(s, ...turn(V.fanC, sn), mul * V.fanMul, false);
  if (hasPerk(p, "mcEcho") && createRng(deriveSeed(s.seed, "mcEcho", s.tick)).nextFloat() < K.mcEcho.chance) throwOne(s, ...turn(K.mcEcho.c, K.mcEcho.s), mul * M.throwMul, false);
  addCombo(p, 1);
  hold(p, pickWeapon(s, 1 - kindOf(p.mcWeapon ?? 0), "draw"));
}

/** 줄 위 적 (내 자리에서 앞으로 len, 폭 w) */
const ahead = (s: RunState, len: number, w: number) => onSegment(s, s.player.x, s.player.y, s.player.x + s.player.faceX * len, s.player.y + s.player.faceY * len, w);

/** 기술 하나 (mul: 그 기술 피해 배율에 곱함) */
export function doMove(s: RunState, m: McMove, mul = 1): void {
  const p = s.player;
  const r = wide(s);
  const { x, y, faceX: dx, faceY: dy } = p;
  if (m === "slash") {
    for (const e of inCone(s, V.slashR * r, V.slashCos)) hit(s, e, V.slashMul * mul * sword(s), 4);
    fx(s, m, x, y - 4, V.slashR * r, x, y, 14);
  } else if (m === "slam") {
    const cx = x + dx * V.slamAt;
    const cy = y + dy * V.slamAt;
    for (const e of inCircle(s, cx, cy, V.slamR * r)) {
      hit(s, e, V.slamMul * mul * sword(s), 4);
      stun(e, V.slamStun);
    }
    fx(s, m, cx, cy, V.slamR * r, x, y, 20);
  } else if (m === "sweep") {
    for (const e of inCone(s, V.sweepR * r, V.sweepCos)) hit(s, e, V.sweepMul * mul * sword(s), V.sweepPush);
    fx(s, m, x, y - 4, V.sweepR * r, x, y, 16);
  } else if (m === "spin") {
    for (const e of inCircle(s, x, y, V.spinR * r)) hit(s, e, V.spinMul * mul, 8);
    fx(s, m, x, y - 4, V.spinR * r, x, y, 16);
  } else if (m === "thrust") {
    const L = lance(s);
    const len = V.thrustLen * r * L.len;
    for (const e of ahead(s, len, V.thrustW)) hit(s, e, V.thrustMul * mul * L.mul, 4);
    fx(s, m, x, y - 4, len, x + dx * len, y - 4 + dy * len, 12);
  } else if (m === "lunge") {
    // 돌진 찌르기: 벽 앞까지 앞으로 나아가며 지나간 줄의 적을 꿰뚫음
    const L = lance(s);
    const d = reach(s, dx, dy, V.lungeDist * r);
    for (const e of ahead(s, d + 20, V.lungeW)) hit(s, e, V.lungeMul * mul * L.mul, 10);
    fx(s, m, x, y - 4, d, x + dx * d, y - 4 + dy * d, 14);
    p.x = p.prevX = x + dx * d;
    p.y = p.prevY = y + dy * d;
    keepInRoom(p, roomGrid(s));
  } else if (m === "throw" || m === "fan") throwMove(s, m === "fan", mul);
  else if (m === "cross") {
    for (const e of inCone(s, V.crossR * r, V.crossCos)) {
      hit(s, e, V.crossMul * mul * sword(s), 0);
      hit(s, e, V.crossMul * mul * sword(s), 6);
    }
    fx(s, m, x, y - 4, V.crossR * r, x, y, 16);
  } else if (m === "quake") {
    const len = reach(s, dx, dy, V.quakeLen * r);
    for (const e of ahead(s, len, V.quakeW)) {
      hit(s, e, V.quakeMul * mul, 4);
      e.slowTicks = Math.max(e.slowTicks ?? 0, V.quakeSlow);
    }
    fx(s, m, x, y, V.quakeW, x + dx * len, y + dy * len, 22);
  } else if (m === "rise") {
    for (const e of inCone(s, V.riseR * r, V.riseCos)) hit(s, e, V.riseMul * mul * sword(s), V.risePush);
    fx(s, m, x, y - 4, V.riseR * r, x, y, 16);
  } else if (m === "whirl") {
    // 회오리: 지금 한 번 + 사이 틱마다 이어 침
    for (const e of inCircle(s, x, y, V.whirlR * r)) hit(s, e, V.whirlMul * mul, 6);
    fx(s, m, x, y - 4, V.whirlR * r, x, y, V.whirlGap * V.whirlN + 8);
    for (let i = 1; i < V.whirlN; i++) (p.mcQueue ??= []).push({ t: i * V.whirlGap, m: "spin", mul: (mul * V.whirlMul) / V.spinMul });
  } else if (m === "skyfall") {
    // 칼비: 앞에 무기가 쏟아져 꽂힘 (박혀 남음)
    const rng = createRng(deriveSeed(s.seed, "mcSky", s.tick));
    const cx = x + dx * V.skyAt;
    const cy = y + dy * V.skyAt;
    fx(s, m, cx, cy, V.skyR * r, x, y, 26);
    for (let i = 0; i < V.skyN; i++) {
      const a = rng.nextFloat() * Math.PI * 2;
      const d = Math.sqrt(rng.nextFloat()) * V.skyR * r;
      const bx = cx + Math.cos(a) * d;
      const by = cy + Math.sin(a) * d;
      if (!isWall(s, bx, by)) dropBlade(s, bx, by, 8 + i * 4, pickWeapon(s, null, "sky", i), V.skyMul * mul);
    }
  } else if (m === "pierce") {
    const len = reach(s, dx, dy, V.pierceLen * r * lance(s).len);
    for (const e of ahead(s, len, V.pierceW)) hit(s, e, V.pierceMul * mul * lance(s).mul, 8);
    fx(s, m, x, y - 6, V.pierceW, x + dx * len, y - 6 + dy * len, 18);
  }
}

/** 곧 나갈 기술 한 틱 (무기에 닿았을 때 둘 · 회오리 이어 치기) */
export function queueTick(s: RunState): void {
  const p = s.player;
  const q = p.mcQueue;
  if (!q?.length) return;
  for (const it of q) it.t--;
  const now = q.filter((it) => it.t < 0);
  p.mcQueue = q.filter((it) => it.t >= 0);
  if (!p.mcQueue.length) delete p.mcQueue;
  for (const it of now) doMove(s, it.m, it.mul);
}
