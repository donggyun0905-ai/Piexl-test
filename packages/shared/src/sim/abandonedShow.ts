// 버려진 자들 특수기 연출: 곁에서 싸우던 두 아이가 정해진 대로 움직이며 정해진 틱에 공격 (틱마다 진행, 시드 결정성 그대로)
// 1단계 암살(shadow 그림자 질주 · blink 그림자 베기) · 2단계 총의 춤(kata 건 카타 · waltz 탄환 왈츠) · 3단계 방패 일격(meteor 하늘 찍기 · pinball 맞받아치기)
import { ENEMIES } from "../enemyDefs";
import { ABANDONED as A, type TagSpecial, type TagSpecialKind } from "../weaponsAbandoned";
import { bullet, shove } from "./abandonedMoves";
import { kidsOf } from "./abandonedKids";
import type { TagKid, TagShow } from "./abandonedTypes";
import { damageEnemy } from "./combat";
import type { EnemyState, RunState } from "./types";
import { addEffect, dist2, keepInRoom, normalize, roomGrid } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const V = {
  VOLLEYS: 8,
};
export { V as ABANDONED_SHOW_RULES };

const R = A.specialR;
/** 질주·베기 횟수 (alt면 늘어남) */
const passes = (sh: TagShow) => (sh.alt ? 5 : 3);
const cuts = (sh: TagShow) => (sh.alt ? 8 : 6);

function lenOf(kind: TagSpecialKind, alt: boolean): number {
  if (kind === "shadow") return 6 + (alt ? 5 : 3) * 8 + 14;
  if (kind === "blink") return 4 + (alt ? 8 : 6) * 5 + 14;
  if (kind === "kata") return 8 + V.VOLLEYS * 5 + 8;
  if (kind === "waltz") return 50;
  if (kind === "meteor") return alt ? 48 : 28;
  return alt ? 50 : 38;
}

/** (x, y) 반경 r 안 적에게 피해 (+ 기절·밀침) */
function hitCircle(s: RunState, x: number, y: number, r: number, dmg: number, stun = 0, push = 0): void {
  for (const e of [...s.enemies]) {
    if (e.hp <= 0 || (e.x - x) ** 2 + (e.y - y) ** 2 > (r + e.r) ** 2) continue;
    const d = normalize(e.x - x, e.y - y) ?? [0, 1];
    damageEnemy(s, e, dmg, d[0], d[1], false);
    if (stun > 0 || push > 0) shove(s, e, d[0], d[1], push, stun);
  }
}

/** (x0, y0) → (x1, y1) 선 위(굵기 w) 적에게 피해 */
function hitLine(s: RunState, x0: number, y0: number, x1: number, y1: number, w: number, dmg: number): void {
  const len = Math.hypot(x1 - x0, y1 - y0) || 1;
  const fx = (x1 - x0) / len;
  const fy = (y1 - y0) / len;
  for (const e of [...s.enemies]) {
    if (e.hp <= 0) continue;
    const along = (e.x - x0) * fx + (e.y - y0) * fy;
    const off = Math.abs((e.x - x0) * -fy + (e.y - y0) * fx);
    if (along >= -e.r && along <= len + e.r && off <= w + e.r) damageEnemy(s, e, dmg, fx, fy, false);
  }
}

/** 아이를 (x, y) 쪽으로 sp만큼 */
function moveTo(s: RunState, k: TagKid, x: number, y: number, sp: number): void {
  const d = Math.hypot(x - k.x, y - k.y);
  const body = { ...(d <= sp ? { x, y } : { x: k.x + ((x - k.x) / d) * sp, y: k.y + ((y - k.y) / d) * sp }), prevX: k.x, prevY: k.y, r: 4 };
  keepInRoom(body, roomGrid(s));
  k.x = body.x;
  k.y = body.y;
  if (Math.abs(x - k.x) > 0.5) k.face = x > k.x ? 1 : -1;
}

/** 살아 있는 적 (id) */
const alive = (s: RunState, id: number): EnemyState | undefined => s.enemies.find((e) => e.id === id && e.hp > 0);

/** 특수기 시작: 가까운 적(없으면 앞)을 노림 */
export function startShow(s: RunState, spc: TagSpecial, dmg: number): void {
  const p = s.player;
  kidsOf(s);
  const near = s.enemies.filter((e) => e.hp > 0 && !e.svBox && !e.immune && dist2(e, p) < 170 * 170).sort((a, b) => dist2(a, p) - dist2(b, p) || a.id - b.id);
  const e = near[0];
  const tx = e?.x ?? p.x + p.faceX * 40;
  const ty = e?.y ?? p.y + p.faceY * 40;
  const d = normalize(tx - p.x, ty - p.y) ?? [p.faceX, p.faceY];
  const alt = !!spc.alt;
  p.abShow = { kind: spc.kind, alt, t: 0, len: lenOf(spc.kind, alt), dmg, tx, ty, eid: e?.id ?? -1, dx: d[0], dy: d[1], ids: near.slice(0, 4).map((x) => x.id) };
  addEffect(s, { kind: "tagSpecial", x: tx, y: ty, dirX: d[0], dirY: d[1], size: R, maxTicks: 24 });
}

/** 암살 ① 그림자 질주: 투명해져 적을 여러 방향으로 가로지르며 베고, 둘이 나타나 X자로 마무리 */
function shadow(s: RunState, sh: TagShow, kids: TagKid[], t: number): void {
  const n = passes(sh);
  const base = Math.atan2(sh.dy, sh.dx);
  const end = 6 + n * 8;
  kids.forEach((k, i) => {
    k.hide = t < end;
    if (t < 6) return moveTo(s, k, sh.tx - sh.dx * 26 + (i ? 1 : -1) * sh.dy * 14, sh.ty - sh.dy * 26 - (i ? 1 : -1) * sh.dx * 14, 4);
    const pass = Math.floor((t - 6) / 4);
    if (t < end && pass % 2 === i) {
      const a = base + pass * Math.PI * 0.62;
      const [ax, ay, bx, by] = [sh.tx + Math.cos(a) * 30, sh.ty + Math.sin(a) * 30, sh.tx - Math.cos(a) * 30, sh.ty - Math.sin(a) * 30];
      const local = (t - 6) % 4;
      moveTo(s, k, ax + ((bx - ax) * (local + 1)) / 4, ay + ((by - ay) * (local + 1)) / 4, 99);
      if (local === 3) {
        hitLine(s, ax, ay, bx, by, 9, (sh.dmg * 0.6) / (n * 2));
        addEffect(s, { kind: "tagDash", x: ax, y: ay, dirX: 0, dirY: 0, size: 3, toX: bx, toY: by, maxTicks: 10 });
      }
    }
    if (t === end) moveTo(s, k, sh.tx + (i ? 1 : -1) * 14, sh.ty - 2, 99);
    if (t === end + 4) k.swing = 10;
  });
  if (t === end + 4) {
    hitCircle(s, sh.tx, sh.ty, 22, sh.dmg * 0.4);
    addEffect(s, { kind: "tagCut", x: sh.tx, y: sh.ty, dirX: 0, dirY: 0, size: 24, maxTicks: 16 });
  }
}

/** 암살 ② 그림자 베기: 적 뒤로 번갈아 순간이동하며 하나씩 베고, 마지막에 둘이 함께 */
function blink(s: RunState, sh: TagShow, kids: TagKid[], t: number): void {
  const n = cuts(sh);
  const end = 4 + n * 5;
  if (t >= 4 && t < end && (t - 4) % 5 === 0) {
    const c = (t - 4) / 5;
    const k = kids[c % 2]!;
    const p = s.player;
    const list = sh.ids.map((id) => alive(s, id)).filter((e): e is EnemyState => !!e);
    const e = list[c % Math.max(1, list.length)];
    const [x, y] = e ? [e.x, e.y] : [sh.tx, sh.ty];
    const back = normalize(x - p.x, y - p.y) ?? [sh.dx, sh.dy];
    addEffect(s, { kind: "tagDash", x: k.x, y: k.y, dirX: 0, dirY: 0, size: 2, toX: x + back[0] * 12, toY: y + back[1] * 12, maxTicks: 6 });
    k.x = x + back[0] * ((e?.r ?? 4) + 8);
    k.y = y + back[1] * ((e?.r ?? 4) + 8);
    k.face = back[0] > 0 ? -1 : 1;
    k.swing = 6;
    hitCircle(s, x, y, 8, (sh.dmg * 0.7) / n);
    addEffect(s, { kind: "tagCut", x, y, dirX: c % 2, dirY: 0, size: 12, maxTicks: 10 });
  }
  kids.forEach((k, i) => {
    k.hide = t < end && !(t >= 4 && (t - 4) % 5 < 3 && Math.floor((t - 4) / 5) % 2 === i);
    if (t === end) moveTo(s, k, sh.tx + (i ? 1 : -1) * 15, sh.ty, 99);
    if (t === end + 4) k.swing = 10;
  });
  if (t === end + 4) {
    hitCircle(s, sh.tx, sh.ty, 22, sh.dmg * 0.3);
    addEffect(s, { kind: "tagCut", x: sh.tx, y: sh.ty, dirX: 0, dirY: 0, size: 26, maxTicks: 16 });
  }
}

/** 총의 춤 ① 건 카타: 총 쥔 아이가 돌며 나선으로 쏘고(한 발은 늘 적에게), 방패 아이가 곁을 지키다 밀침 · 마지막 관통 저격 */
function kata(s: RunState, sh: TagShow, kids: TagKid[], t: number): void {
  const g = kids.find((k) => k.m === 1) ?? kids[0]!;
  const guard = kids.find((k) => k !== g)!;
  moveTo(s, g, sh.tx - sh.dx * 32, sh.ty - sh.dy * 32, 3);
  moveTo(s, guard, sh.tx - sh.dx * 16 - sh.dy * 10, sh.ty - sh.dy * 16 + sh.dx * 10, 3);
  const end = 8 + V.VOLLEYS * 5;
  if (t >= 8 && t < end && (t - 8) % 5 === 0) {
    const v = (t - 8) / 5;
    const aim = normalize(sh.tx - g.x, sh.ty - g.y) ?? [sh.dx, sh.dy];
    g.face = v % 2 === 0 ? 1 : -1;
    g.swing = 4;
    bullet(s, g.x, g.y - 3, aim[0], aim[1], sh.dmg * 0.06, 0, sh.alt && v % 2 === 1 ? { blast: A.grenadeR, reach: 0.8 } : {});
    for (let i = 0; i < 6; i++) {
      const a = v * 0.45 + (i / 6) * Math.PI * 2;
      bullet(s, g.x, g.y - 3, Math.cos(a), Math.sin(a), sh.dmg * 0.025);
    }
    addEffect(s, { kind: "tagFlash", x: g.x, y: g.y - 3, dirX: aim[0], dirY: aim[1], size: 8, maxTicks: 6 });
  }
  if (t === 24) {
    guard.swing = 8;
    hitCircle(s, guard.x + sh.dx * 10, guard.y + sh.dy * 10, 16, sh.dmg * 0.2, 0, 8);
    addEffect(s, { kind: "tagShove", x: guard.x + sh.dx * 10, y: guard.y + sh.dy * 10, dirX: sh.dx, dirY: sh.dy, size: 12, maxTicks: 10 });
  }
  if (t === end + 2) {
    const aim = normalize(sh.tx - g.x, sh.ty - g.y) ?? [sh.dx, sh.dy];
    bullet(s, g.x, g.y - 3, aim[0], aim[1], sh.dmg * 0.25, 0, { pierce: 99, reach: A.snipeReach });
    addEffect(s, { kind: "tagFlash", x: g.x, y: g.y - 3, dirX: aim[0], dirY: aim[1], size: 16, maxTicks: 10 });
    g.swing = 8;
  }
}

/** 총의 춤 ② 탄환 왈츠: 둘이 적 둘레를 마주 돌며 안쪽으로 쏘다가 한꺼번에 덮침 */
function waltz(s: RunState, sh: TagShow, kids: TagKid[], t: number): void {
  kids.forEach((k, i) => {
    const a = Math.atan2(-sh.dy, -sh.dx) + i * Math.PI + t * 0.14;
    if (t < sh.len - 8) moveTo(s, k, sh.tx + Math.cos(a) * 32, sh.ty + Math.sin(a) * 32, t < 6 ? 5 : 6);
    else moveTo(s, k, sh.tx + (i ? 1 : -1) * 8, sh.ty, 6);
    if (t >= 6 && t < sh.len - 8 && t % 4 === i * 2) {
      const aim = normalize(sh.tx - k.x, sh.ty - k.y) ?? [sh.dx, sh.dy];
      bullet(s, k.x, k.y - 3, aim[0], aim[1], sh.dmg * 0.045, 0, sh.alt ? { pierce: 3 } : {});
      addEffect(s, { kind: "tagFlash", x: k.x, y: k.y - 3, dirX: aim[0], dirY: aim[1], size: 7, maxTicks: 5 });
      k.swing = 4;
      k.face = aim[0] >= 0 ? 1 : -1;
    }
  });
  if (t === sh.len - 4) {
    hitCircle(s, sh.tx, sh.ty, 20, sh.dmg * 0.25);
    addEffect(s, { kind: "tagCut", x: sh.tx, y: sh.ty, dirX: 1, dirY: 0, size: 22, maxTicks: 14 });
  }
}

/** 방패 아이가 (x, y) 위로 뛰어올라 내리찍음: at = 내리찍는 틱, up = 뛰어오른 틱 수 */
function leap(s: RunState, sh: TagShow, k: TagKid, t: number, from: number, at: number, x: number, y: number, dmg: number, h: number): void {
  if (t < from || t > at) return;
  const span = at - from;
  moveTo(s, k, x, y - 1, Math.max(2, Math.hypot(x - k.x, y - k.y) / Math.max(1, at - 2 - t)));
  const u = (t - from) / span;
  k.z = u < 0.55 ? h * (u / 0.55) : u < 0.8 ? h : h * (1 - (u - 0.8) / 0.2);
  if (t !== at) return;
  k.z = 0;
  k.swing = 10;
  hitCircle(s, x, y, R * 1.2, dmg, A.stun * 2, 10);
  addEffect(s, { kind: "tagMeteor", x, y, dirX: 0, dirY: 0, size: R * 1.4, maxTicks: 22 });
}

/** 방패 일격 ① 하늘 찍기: 방패 아이가 높이 뛰어 내리찍음 (총 아이는 엄호 사격) · alt 세 군데 */
function meteor(s: RunState, sh: TagShow, kids: TagKid[], t: number): void {
  const j = kids.find((k) => k.m === 0) ?? kids[0]!;
  const c = kids.find((k) => k !== j)!;
  if (!sh.alt) leap(s, sh, j, t, 0, 20, sh.tx, sh.ty, sh.dmg * 0.75, 44);
  else
    [0, 1, 2].forEach((n) => {
      const e = alive(s, sh.ids[n] ?? -1) ?? alive(s, sh.eid);
      leap(s, sh, j, t, n * 14, 18 + n * 14, e?.x ?? sh.tx, e?.y ?? sh.ty, sh.dmg * 0.32, n === 0 ? 44 : 30);
    });
  moveTo(s, c, sh.tx - sh.dx * 40, sh.ty - sh.dy * 40, 3);
  if (t >= 2 && t <= 18 && t % 4 === 2) {
    const aim = normalize(sh.tx - c.x, sh.ty - c.y) ?? [sh.dx, sh.dy];
    bullet(s, c.x, c.y - 3, aim[0], aim[1], sh.dmg * 0.05);
    addEffect(s, { kind: "tagFlash", x: c.x, y: c.y - 3, dirX: aim[0], dirY: aim[1], size: 7, maxTicks: 5 });
    c.swing = 4;
  }
}

/** 방패 일격 ② 맞받아치기: 밀치고, 뒤에서 기다린 아이가 다시 밀쳐 돌려보낸 뒤, 위에서 찍음 · alt 두 번 왕복 */
function pinball(s: RunState, sh: TagShow, kids: TagKid[], t: number): void {
  const a = kids.find((k) => k.m === 0) ?? kids[0]!;
  const b = kids.find((k) => k !== a)!;
  const e = alive(s, sh.eid);
  const rounds = sh.alt ? 2 : 1;
  const leapAt = rounds * 12 + 14;
  if (t < leapAt - 12) {
    moveTo(s, a, sh.tx - sh.dx * 11, sh.ty - sh.dy * 11, 6);
    moveTo(s, b, sh.tx + sh.dx * 11, sh.ty + sh.dy * 11, t < 6 ? 8 : 6);
  }
  for (let r = 0; r < rounds; r++) {
    for (const [at, k, dir] of [[6 + r * 12, a, 1], [12 + r * 12, b, -1]] as const) {
      if (t !== at) continue;
      k.swing = 8;
      if (e) {
        damageEnemy(s, e, sh.dmg * 0.12, sh.dx * dir, sh.dy * dir, false);
        if (!ENEMIES[e.kind].boss) shove(s, e, sh.dx * dir, sh.dy * dir, 22, 10);
      }
      addEffect(s, { kind: "tagShove", x: sh.tx, y: sh.ty, dirX: sh.dx * dir, dirY: sh.dy * dir, size: 14, maxTicks: 10 });
    }
  }
  leap(s, sh, a, t, leapAt - 12, leapAt, sh.tx, sh.ty, sh.dmg * (sh.alt ? 0.5 : 0.65), 40);
}

const SCRIPTS: Record<TagSpecialKind, (s: RunState, sh: TagShow, kids: TagKid[], t: number) => void> = { shadow, blink, kata, waltz, meteor, pinball };

/** 틱마다: 특수기 연출 진행 (끝나면 아이들은 다시 따로 싸움) */
export function updateShow(s: RunState): void {
  const p = s.player;
  const sh = p.abShow;
  if (!sh) return;
  const e = alive(s, sh.eid);
  if (e) {
    sh.tx = e.x;
    sh.ty = e.y;
  }
  const kids = [...kidsOf(s)].sort((x, y) => x.m - y.m);
  SCRIPTS[sh.kind](s, sh, kids, sh.t);
  if (++sh.t < sh.len) return;
  for (const k of kids) {
    k.hide = false;
    k.z = 0;
    k.act = "back";
    k.t = A.kidBack;
  }
  delete p.abShow;
}
