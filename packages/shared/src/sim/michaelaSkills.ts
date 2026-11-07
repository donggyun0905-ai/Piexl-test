// 미카엘라 스킬 넷(1 무기 비 · 2 칼날 교대 · 3 일제 폭파 · 4 무한의 무기고) · 방에 들어설 때 무기 비 · 떨어지는 무기 · 연쇄 · 줍기 · 대시 순간 이동 (sim/michaela에서 부름)
import { MICHAELA_PERKS as K } from "../itemsMichaela";
import { MICHAELA as M } from "../weaponsMichaela";
import { MC_WEAPON_ELEM } from "../michaelaWeaponList";
import { ROOM_CX, ROOM_CY } from "../constants";
import { createRng, deriveSeed } from "../rng";
import { addCombo, blinkTo, dropBlade, explode, mcCooldown, mcHit, pickWeapon, plant, swapTo } from "./michaelaKit";
import type { McBlade } from "./mcTypes";
import { alive, inCircle } from "./s2Kit";
import type { RunState } from "./types";
import { addEffect, hasPerk, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "./util";
import { isWall } from "./waveKit";

/** (x,y) 둘레 반지름 r 안 아무 데나 n개 떨어뜨림 (벽은 피함, 시드로 자리) */
function rainAround(s: RunState, tag: string, x: number, y: number, r: number, n: number, delay: number, mul: number): void {
  const rng = createRng(deriveSeed(s.seed, tag, s.tick, s.floor, s.roomId));
  const e = M.rainEdge;
  for (let i = 0, tries = 0; i < n && tries < n * 6; tries++) {
    const a = rng.nextFloat() * Math.PI * 2;
    const d = Math.sqrt(rng.nextFloat()) * r;
    const bx = Math.max(ROOM_MIN_X + e, Math.min(ROOM_MAX_X - e, x + Math.cos(a) * d));
    const by = Math.max(ROOM_MIN_Y + e, Math.min(ROOM_MAX_Y - e, y + Math.sin(a) * d));
    if (isWall(s, bx, by)) continue;
    dropBlade(s, bx, by, delay + i * 3, Math.floor(rng.nextFloat() * MC_WEAPON_ELEM.length), mul);
    i++;
  }
}

/** 방에 들어서면 가운데 포탈에서 무기가 쏟아져 곳곳에 박힘 */
export function roomRain(s: RunState): void {
  const p = s.player;
  const n = M.rainN + (hasPerk(p, "mcHoard") ? K.mcHoard.rain : 0);
  addEffect(s, { kind: "mcPortalFx", x: ROOM_CX, y: ROOM_CY, dirX: 0, dirY: 0, size: 30, maxTicks: 50 });
  rainAround(s, "mcRoom", ROOM_CX, ROOM_CY, Math.max(ROOM_MAX_X - ROOM_MIN_X, ROOM_MAX_Y - ROOM_MIN_Y) * 0.5, n, 20, M.fallMul);
}

/** 가장 가까운 박힌 무기 (r 안 · 방향 (dx,dy)가 있으면 cos 이상인 것 먼저) */
function nearBlade(s: RunState, r: number, dx = 0, dy = 0): McBlade | undefined {
  const p = s.player;
  const list = (p.mcBlades ?? []).filter((b) => Math.hypot(b.x - p.x, b.y - p.y) <= r);
  const d = (b: McBlade) => Math.hypot(b.x - p.x, b.y - p.y);
  const ahead = list.filter((b) => ((b.x - p.x) * dx + (b.y - p.y) * dy) / Math.max(1, d(b)) >= M.dashCos);
  return (ahead.length ? ahead : list).sort((a, b) => d(a) - d(b))[0];
}

/** 스킬 키 (1~4) */
export function mcSkill(s: RunState, i: number): void {
  const p = s.player;
  const cd = (p.mcCd ??= [0, 0, 0, 0]);
  if ((cd[i] ?? 0) > 0) return;
  if (i === 1) {
    // 2 칼날 교대: 가장 가까운 박힌 무기로 (없으면 쓰지 않음)
    const b = nearBlade(s, M.shiftR);
    if (!b) return;
    blinkTo(s, b, M.dashHitR, M.shiftMul, M.dashInv);
    addCombo(p, M.shiftCombo - 1);
  } else if (i === 0) {
    // 1 무기 비: 앞에 무기가 쏟아져 박힘
    const x = p.x + p.faceX * M.stormAt;
    const y = p.y + p.faceY * M.stormAt;
    addEffect(s, { kind: "mcPortalFx", x, y: y - 50, dirX: 0, dirY: 0, size: 24, maxTicks: 40 });
    rainAround(s, "mcStorm", x, y, M.stormR, M.stormN + (hasPerk(p, "mcStorm") ? K.mcStorm.more : 0), M.stormDelay, M.stormMul);
  } else if (i === 2) {
    // 3 일제 폭파: 박힌 무기가 모두 차례로 터지고 사라짐
    const list = p.mcBlades ?? [];
    list.forEach((b, j) => (p.mcChains ??= []).push({ x: b.x, y: b.y, t: 1 + j * M.detGap, v: b.v ?? 0, mul: M.detMul }));
    delete p.mcBlades;
  } else {
    p.mcUlt = M.ultTicks + (hasPerk(p, "mcArsenal") ? K.mcArsenal.more : 0);
    addEffect(s, { kind: "mcUltFx", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 40, maxTicks: 40 });
  }
  cd[i] = mcCooldown(p, i);
}

/** 떨어지는 무기·연쇄·무기고 한 틱 */
export function mcWorld(s: RunState): void {
  const p = s.player;
  for (const f of p.mcFalls ?? []) {
    if (--f.t > 0) continue;
    for (const e of inCircle(s, f.x, f.y, M.fallR)) mcHit(s, e, f.mul, 4, f.v);
    plant(s, f.x, f.y, f.w);
  }
  if (p.mcFalls) p.mcFalls = p.mcFalls.filter((f) => f.t > 0);
  for (const c of p.mcChains ?? []) if (--c.t <= 0) explode(s, c.x, c.y, M.blastR, c.mul, c.v, true);
  if (p.mcChains) p.mcChains = p.mcChains.filter((c) => c.t > 0);
  if (!(p.mcUlt ?? 0)) return;
  p.mcUlt!--;
  const every = Math.max(1, Math.round(M.ultEvery * (hasPerk(p, "mcArsenal") ? K.mcArsenal.every : 1)));
  if (s.tick % every !== 0) return;
  const foes = alive(s);
  const e = foes[Math.floor(s.tick / every) % Math.max(1, foes.length)];
  if (e) dropBlade(s, e.x, e.y, 10, pickWeapon(s, null, "ult"), M.ultMul);
}

/** 몸에 닿은 박힌 무기를 바꿔 듦 · 대시를 시작하면 범위 안의 박힌 무기로 순간 이동 */
export function mcTouch(s: RunState): void {
  const p = s.player;
  const dashing = p.dashTicks > 0;
  if (dashing && !p.mcDash) {
    const r = M.dashR * (hasPerk(p, "mcBlink") ? K.mcBlink.r : 1);
    const b = nearBlade(s, r, p.dashDirX, p.dashDirY);
    if (b) {
      p.dashTicks = 0;
      const v = hasPerk(p, "mcVoid");
      blinkTo(s, b, M.dashHitR, M.dashMul * (v ? K.mcVoid.mul : 1), M.dashInv + (v ? K.mcVoid.inv : 0));
    }
  }
  p.mcDash = dashing;
  const b = (p.mcBlades ?? []).find((o) => Math.hypot(o.x - p.x, o.y - p.y) <= p.r + M.pickR);
  if (b) swapTo(s, b);
}
