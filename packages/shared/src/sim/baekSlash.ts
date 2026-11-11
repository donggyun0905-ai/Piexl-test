// 백령 유령팔: 벨 때마다 머리 위 유령팔이 에너지 참격을 날림 (기본 베기보다 멀리·크게, 유령팔 크기만큼 커짐)
// 혼령참·삼위령 망령 · 위백도 검무 소용돌이 · 이연참 · 서리 혼은 여기 · (진)대태도·랑·백은 sim/baekSword
import { BAEK_PERKS as K } from "../itemsBaekryeong";
import { createRng, deriveSeed } from "../rng";
import { BAEK_ARM as A } from "../weaponsBaekryeong";
import { armScale, hauntMul, soulFire } from "./baekKit";
import { armSwords } from "./baekSword";
import { rot } from "./orbit";
import { alive, damageEnemyLite } from "./shadowingSpirits";
import type { BaekShot, BaekWhirl } from "./byTypes";
import type { RunState } from "./types";
import { addEffect, hasPerk, reachOf } from "./util";

type P = RunState["player"];

/** 참격 크기 배율 (유령팔 크기 · 사거리 증가 · 넓은 참격) */
export const slashSize = (p: P) => armScale(p) * reachOf(p) * (hasPerk(p, "byWide") ? K.byWide.size : 1);

/** 바라보는 쪽을 a(라디안)만큼 돌린 방향 */
function turn(p: P, a: number): [number, number] {
  const [c, n] = rot(a);
  return [p.faceX * c - p.faceY * n, p.faceX * n + p.faceY * c];
}

function push(p: P, shot: BaekShot): void {
  const list = (p.byShots ??= []);
  if (list.length >= A.max * 4) list.shift();
  list.push(shot);
}

/** 참격 하나 (wait 틱 뒤에 나감) */
function slashOut(p: P, wait: number, wraith: boolean): void {
  const size = slashSize(p);
  const x = p.x + p.faceX * 10;
  const y = p.y + p.faceY * 10;
  push(p, { x, y, dx: p.faceX, dy: p.faceY, r: A.r * size, dmg: p.stats.damage * A.mul * hauntMul(p), kind: 0, age: -wait, life: A.life, speed: A.speed * reachOf(p), hit: [] });
  if (!wraith || !hasPerk(p, "byWraith")) return;
  // 혼령참: 확률로 망령이 참격과 같이 날아감 (삼위령이면 셋, 양옆으로 벌어짐)
  const n = hasPerk(p, "byTrinity") ? K.byTrinity.n : K.byWraith.n;
  for (let i = 0; i < n; i++) {
    const [dx, dy] = turn(p, n === 1 ? 0 : (i - (n - 1) / 2) * K.byTrinity.spread);
    push(p, { x, y, dx, dy, r: K.byWraith.r * Math.max(1, size), dmg: p.stats.damage * K.byWraith.mul * hauntMul(p), kind: 1, age: -wait, life: K.byWraith.life, speed: K.byWraith.speed * reachOf(p), hit: [] });
  }
}

/** 유령팔이 벰 (대태도 베기 때마다, 게이지 3칸부터): 참격 · 이연참 · 대태도 */
export function armSwing(s: RunState): void {
  const p = s.player;
  if (armScale(p) <= 0) return;
  p.byArmAt = s.tick;
  const rng = createRng(deriveSeed(s.seed, "byArm", s.tick, p.attackCount));
  // 혼령참은 참격마다 따로 굴림 (이연참 참격에도)
  const wraith = () => createRng(deriveSeed(s.seed, "byWraith", s.tick, p.attackCount, p.byShots?.length ?? 0)).nextFloat() < K.byWraith.chance;
  slashOut(p, 0, wraith());
  if (hasPerk(p, "byTwin") && rng.nextFloat() < K.byTwin.chance) slashOut(p, K.byTwin.delay, wraith());
  armSwords(s, rng.nextFloat(), rng.nextFloat());
}

/** 틱마다: 참격·망령이 나아가며 닿은 적을 한 번씩 때림 · 소용돌이 */
export function shotsTick(s: RunState): void {
  const p = s.player;
  if (p.byShots?.length) p.byShots = p.byShots.filter((sh) => shotStep(s, sh));
  if (p.byWhirls?.length) p.byWhirls = p.byWhirls.filter((w) => whirlStep(s, w));
}

function shotStep(s: RunState, sh: BaekShot): boolean {
  const p = s.player;
  sh.age++;
  if (sh.age <= 0) {
    // 이연참: 나가기 전에는 몸을 따라감
    sh.x = p.x + sh.dx * 10;
    sh.y = p.y + sh.dy * 10;
    return true;
  }
  sh.x += sh.dx * sh.speed;
  sh.y += sh.dy * sh.speed;
  for (const e of s.enemies) {
    if (!alive(e) || sh.hit.includes(e.id) || (e.x - sh.x) ** 2 + (e.y - sh.y) ** 2 > (sh.r + e.r) ** 2) continue;
    sh.hit.push(e.id);
    damageEnemyLite(s, e, sh.dmg, sh.dx, sh.dy);
    soulFire(p, e);
    if (hasPerk(p, "byFrost")) e.slowTicks = Math.max(e.slowTicks ?? 0, K.byFrost.slow);
    // 위백도: 망령에 닿은 적에게 검무 소용돌이 (추가 피해 3번)
    if (sh.kind === 1 && hasPerk(p, "byWhirl") && !(p.byWhirls ?? []).some((w) => w.id === e.id)) {
      const w: BaekWhirl = { id: e.id, x: e.x, y: e.y, left: K.byWhirl.hits, age: 0, r: K.byWhirl.r * Math.max(1, armScale(p)), dmg: p.stats.damage * K.byWhirl.mul * hauntMul(p) };
      (p.byWhirls ??= []).push(w);
      // 소용돌이 그림은 한 번만: 추가 피해가 다 끝날 때까지 1→4칸을 차례로 재생
      addEffect(s, { kind: "byWhirl", x: e.x, y: e.y, dirX: 0, dirY: 0, size: w.r, maxTicks: K.byWhirl.hits * K.byWhirl.every + 6 });
    }
  }
  return sh.age < sh.life;
}

function whirlStep(s: RunState, w: BaekWhirl): boolean {
  w.age++;
  const t = s.enemies.find((e) => e.id === w.id && alive(e));
  if (t) {
    w.x = t.x;
    w.y = t.y;
  }
  if (w.age % K.byWhirl.every !== 0) return true;
  for (const e of s.enemies) {
    if (!alive(e) || (e.x - w.x) ** 2 + (e.y - w.y) ** 2 > (w.r + e.r) ** 2) continue;
    damageEnemyLite(s, e, w.dmg, 0, 0);
    soulFire(s.player, e);
  }
  w.left--;
  return w.left > 0;
}
