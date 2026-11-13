// 느아르 나눠 때리기: 여러 대 기술(난무·회전참·절대 단절·압축·소멸·포식·시초의 공허·차원 절멸·결계 붕괴·무한 심연)을 틱마다 한 대씩
// 빨아들이기 · 점점 세짐 · 끝 한 방 · 늦게 오는 한 방(마력 소멸·낙인 창) · 방을 휩쓰는 충격파(흑월 강림·태초의 종언)
import { srcEach } from "./dmgSrc";
import { NR_EXTRA as X } from "../itemsNoir";
import { ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y } from "../constants";
import { nrAlive, nrArea, nrHit, nrLine, nrPull } from "./nrKit";
import type { HitOn } from "./nrTypes";
import type { NrLater, NrVolley } from "./nrTypes";
import type { RunState } from "./types";
import { addEffect } from "./util";

/** 효과 길이: n대(첫 대 0틱 · 간격 every · 처음 지연 delay)의 마지막 한 대 바로 뒤부터 마지막 그림이 잠시 보이고 끝나게 (화면 render/sheetLoop OUTRO 10틱 · docs/FX_FRAMES.md) */
export const ashFxLen = (n: number, every: number, delay = 0) => delay + (n - 1) * every + 12;

/** 나눠 때리는 기술 시작 (첫 대는 이번 틱) */
export function nrVolley(s: RunState, v: Omit<NrVolley, "left" | "next" | "ramp" | "pull" | "fin"> & Partial<Pick<NrVolley, "ramp" | "pull" | "fin">>, delay = 0): void {
  (s.player.nrVolleys ??= []).push({ ramp: 0, pull: 0, fin: 0, ...v, left: v.n, next: s.tick + delay });
}

/** 잠시 뒤 오는 한 방 */
export const nrLater = (s: RunState, l: NrLater) => void (s.player.nrLaters ??= []).push(l);

/** 방을 휩쓰는 충격파 (gap 틱마다 하나씩 n개) */
export function nrWaves(s: RunState, x: number, y: number, n: number, dmg: number, speed: number, gap: number): void {
  for (let i = 0; i < n; i++) (s.player.nrWaves ??= []).push({ x, y, r: 0, speed, dmg, hit: [], at: s.tick + i * gap });
}

/** 범위 한 번 (존: 직선이면 직선 위) */
const zone = (s: RunState, v: NrVolley, dmg: number, on?: HitOn) =>
  v.line ? nrLine(s, v.x, v.y, v.line.dx, v.line.dy, v.line.len, v.line.w, dmg, on) : nrArea(s, v.x, v.y, v.r, dmg, undefined, on);

/** 기술 한 대: 빨아들이며 (몸을 따라가면 지금 자리) 범위를 때림 · 무형의 난무는 1 → 3 → 5타 묶음 사이를 비움 */
function once(s: RunState, v: NrVolley): void {
  const p = s.player;
  if (v.follow) [v.x, v.y] = [p.x, p.y];
  const i = v.n - v.left;
  // 공간 압축·마력 소멸: 빨아들이기만 하고 터질 때(finish) 한 대
  if (v.kind === "squeeze" || v.kind === "drain") return;
  // 무형의 난무: 1·3·5타 묶음 (사이 한 칸은 쉼), 마지막 큰 한방은 finish
  if (v.kind === "flurry" && (i === 1 || i === 5)) return;
  const dmg = v.dmgs ? (v.dmgs[i] ?? 0) : v.dmg + v.ramp * i;
  if (dmg <= 0) return;
  if (v.kind !== "devour") return void zone(s, v, dmg, v.on);
  // 공허 포식: 적마다 때린 피해를 모아 둠
  const sums = (v.sums ??= {});
  for (const e of s.enemies) {
    if (!nrAlive(e) || (e.x - v.x) ** 2 + (e.y - v.y) ** 2 > (v.r + e.r) ** 2) continue;
    sums[e.id] = (sums[e.id] ?? 0) + nrHit(s, e, dmg);
  }
}

/** 기술이 끝날 때: 끝 한 방 · 공허 포식은 때린 만큼 한 번 더 · 마력 소멸은 3초 뒤 한 방 */
function finish(s: RunState, v: NrVolley): void {
  if (v.fin > 0) zone(s, v, v.fin, v.finBurn ? { ...v.on, burn: true } : v.on);
  // 공허 포식: 살아 있는 적에게 그 적이 맞은 만큼 한 번 더
  for (const [id, sum] of Object.entries(v.sums ?? {})) {
    const e = s.enemies.find((x) => x.id === Number(id));
    if (e && sum > 0) nrHit(s, e, sum);
  }
  if (v.kind === "drain") nrLater(s, { kind: "drain", x: v.x, y: v.y, r: v.r, dmg: v.fin * (X.s3.laterMul / X.s3.mul), at: s.tick + X.s3.later });
  if (v.fin > 0 || v.kind === "devour" || v.kind === "squeeze" || v.kind === "drain") addEffect(s, { kind: v.kind.startsWith("rg") ? "rgBurst" : v.kind.startsWith("bu") ? "buPop" : v.kind.startsWith("jn") ? "jnPop" : v.kind.startsWith("mz") ? "mzPop" : "nrBurst", x: v.x, y: v.y, dirX: 0, dirY: 0, size: v.r * 1.15, maxTicks: 18 });
}

/** 늦게 오는 한 방: 낙인 창·장미 낙인은 그 적만 · 장례는 그 적 자리 범위 · 마력 소멸은 그 자리 범위 */
function laterTick(s: RunState): void {
  const p = s.player;
  if (!p.nrLaters?.length) return;
  for (const l of srcEach(p.nrLaters)) {
    if (l.at !== s.tick) continue;
    if (l.kind === "brand" || l.kind === "rgMark") {
      const e = s.enemies.find((x) => x.id === l.id);
      if (!e || !nrAlive(e)) continue;
      delete e.nrBrand;
      delete e.rgMark;
      addEffect(s, { kind: l.kind === "brand" ? "nrSpear" : "rgMarkBoom", x: e.x, y: e.y, dirX: 0, dirY: 0, size: e.r + 30, maxTicks: 22 });
      nrHit(s, e, l.dmg, l.on);
    } else if (l.kind === "rgFuneral") {
      const e = s.enemies.find((x) => x.id === l.id && nrAlive(x));
      const [x, y] = e ? [e.x, e.y] : [l.x, l.y];
      addEffect(s, { kind: "rgBurst", x, y, dirX: 0, dirY: 0, size: l.r * 1.2, style: 1, maxTicks: 24 });
      nrArea(s, x, y, l.r, l.dmg, undefined, l.on);
    } else {
      addEffect(s, { kind: "nrDrain", x: l.x, y: l.y, dirX: 0, dirY: 0, size: l.r, style: 1, maxTicks: 20 });
      nrArea(s, l.x, l.y, l.r, l.dmg);
    }
  }
  p.nrLaters = p.nrLaters.filter((l) => l.at > s.tick);
}

/** 충격파: 반지름이 커지며 테두리에 닿은 적을 한 번씩 (방을 다 덮으면 사라짐) */
function waveTick(s: RunState): void {
  const p = s.player;
  if (!p.nrWaves?.length) return;
  for (const w of srcEach(p.nrWaves)) {
    if (w.at > s.tick) continue;
    if (w.at === s.tick) addEffect(s, { kind: "nrWave", x: w.x, y: w.y, dirX: 0, dirY: 0, size: 900, maxTicks: Math.ceil(900 / w.speed) });
    const was = w.r;
    w.r += w.speed;
    for (const e of s.enemies) {
      if (!nrAlive(e) || w.hit.includes(e.id)) continue;
      const d = Math.sqrt((e.x - w.x) ** 2 + (e.y - w.y) ** 2);
      if (d + e.r < was || d - e.r > w.r) continue;
      w.hit.push(e.id);
      nrHit(s, e, w.dmg);
    }
  }
  p.nrWaves = p.nrWaves.filter((w) => w.r < 900);
}

/** 틱마다: 나눠 때리는 기술 · 늦게 오는 한 방 · 충격파 */
export function nrVolleyTick(s: RunState): void {
  const p = s.player;
  if (p.nrVolleys?.length) {
    for (const v of srcEach(p.nrVolleys)) {
      if (v.follow) [v.x, v.y] = [p.x, p.y];
      // 날아가는 기술 (존 뇌구): 벽 앞에서 멈춤
      if (v.vel) [v.x, v.y] = [Math.max(ROOM_MIN_X, Math.min(ROOM_MAX_X, v.x + v.vel[0])), Math.max(ROOM_MIN_Y, Math.min(ROOM_MAX_Y, v.y + v.vel[1]))];
      nrPull(s, v.x, v.y, v.r, v.pull);
      if (v.next > s.tick) continue;
      once(s, v);
      v.next = s.tick + v.every;
      if (--v.left <= 0) finish(s, v);
    }
    p.nrVolleys = p.nrVolleys.filter((v) => v.left > 0);
  }
  laterTick(s);
  waveTick(s);
}
