// 투사체
import { PERKS } from "../perks";
import { s2Hit } from "./s2Hits";
import { renBlock } from "./ren";
import { ENEMIES } from "../content";
import { starHit } from "./ninja";
import { echoHit } from "./chrono";
import { blastAt, damageEnemy, damagePlayer, dotDamage, healPlayer, ignite, removeDead } from "./combat";
import type { EnemyState, ProjectileState, RunState } from "./types";
import { summonShot } from "./summonTypes";
import { blocksShot, type TileGrid } from "./layout";
import { BLOOM_EASE, charmHit } from "./talisman";
import { lure } from "./bossesTwo";
import { netPlayer } from "./bossPrimeval";
import { shatterShot } from "./bossKit";
import { tryParry } from "./bossCage";
import { applyBleed } from "./gunExtras";
import { eachSeat, isAlive, seatNo, useSeat } from "./party";
import { SCRIBE } from "../weaponsScribe";
import { dist2, hasPerk, markCrit, markDot, normalize, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, roomGrid } from "./util";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 갈라지는 촉: 양옆으로 갈라지는 방향 (±45도 고정 값), 갈라진 탄이 날아가는 틱 (피해 비율은 PERKS) */
  SPLIT_DIAG: 0.7071,
  SPLIT_TICKS: 24,
  /** 유도 미사일(seek)이 꺾이는 정도 */
  SEEK_TURN: 0.28,
};
export { R as PROJECTILES_RULES };

/** frozen: 적 탄은 그 자리에 멈춤 (얼음 시계) */
export function updateProjectiles(s: RunState, frozen = false): void {
  const back = seatNo(s);
  const keep: ProjectileState[] = [];
  /** 이번 틱에 새로 생긴 탄 (갈라진 탄) */
  const spawned: ProjectileState[] = [];
  /** 방 안 벽·기둥 (탄을 막음, 구덩이는 넘어감) */
  const g = roomGrid(s);
  for (const pr of s.projectiles) {
    if (frozen && !pr.fromPlayer) {
      keep.push(pr);
      continue;
    }
    if (pr.homing && pr.fromPlayer) steer(s, pr);
    if (pr.easeTo !== undefined) ease(pr, pr.easeTo);
    pr.x += pr.vx;
    pr.y += pr.vy;
    pr.ticksLeft--;
    // 튕김: 벽에 닿으면 반대로
    if ((pr.bounces ?? 0) > 0) bounce(pr, g);
    // 되돌이: 사거리 끝에서 한 번 방향을 뒤집어 되돌아옴 (이미 맞힌 적도 다시 맞힘)
    if (pr.fromPlayer && pr.back && pr.ticksLeft <= 0) {
      pr.vx = -pr.vx;
      pr.vy = -pr.vy;
      pr.ticksLeft = pr.span ?? 0;
      pr.back = false;
      if (pr.hitIds) pr.hitIds = [];
    }
    let gone =
      pr.ticksLeft <= 0 ||
      pr.x < ROOM_MIN_X ||
      pr.x > ROOM_MAX_X ||
      pr.y < ROOM_MIN_Y ||
      pr.y > ROOM_MAX_Y ||
      (g !== null && !pr.ghost && blocksShot(g, pr.x, pr.y));
    // 튕김이 다 끝난 불덩이: 벽에 닿으면 작은 불꽃으로 퍼짐
    if (gone && pr.shatter && pr.ticksLeft > 0) spawned.push(...shatterShot(s, pr, pr.shatter));
    if (!gone && pr.fromPlayer) {
      // 협동: 쏜 사람 자리를 꺼내 놓고 맞힘 (그 사람의 아이템 효과·처치)
      if (pr.shooter !== undefined) useSeat(s, pr.shooter);
      const p = s.player;
      for (const e of s.enemies) {
        const rr = e.r + pr.r;
        if (e.hp > 0 && !pr.hitIds?.includes(e.id) && dist2(e, pr) < rr * rr) {
          const dir = normalize(pr.vx, pr.vy) ?? [0, 0];
          if (pr.charm) charmHit(s, pr, e, dir[0], dir[1], spawned);
          else {
            if (pr.crit) markCrit(s, e);
            const before = e.hp;
            damageEnemy(s, e, pr.damage, dir[0], dir[1], !summonShot(pr));
            // 독버섯 포자: 독 피해로 보이게 (화면 표시만)
            if (pr.spirit === "spore") markDot(s, e, "poison", before - e.hp);
          }
          if (pr.bleed) applyBleed(e);
          if (pr.dot) dotDamage(s, e, pr.dot, pr.damage * 0.3);
          if (pr.mark) starHit(s, pr, e);
          if (pr.spirit === "ink") e.ink = Math.min(SCRIBE.maxInk, (e.ink ?? 0) + 1);
          s2Hit(s, pr, e);
          if (pr.slow && !ENEMIES[e.kind].boss) e.slowTicks = Math.max(e.slowTicks ?? 0, pr.slow);
          if (pr.echo) echoHit(s, e);
          // 헤어볼: 끈적해서 느려지고 불탐
          if (pr.sticky) {
            e.slowTicks = Math.max(e.slowTicks ?? 0, 90);
            ignite(e, pr.damage * 0.5);
          }
          if (hasPerk(p, "igniteTip")) ignite(e, p.stats.damage);
          if (pr.blast) explode(s, pr, e);
          // 관통: 남은 수가 있으면 계속 날아감 (같은 적은 다시 안 맞음)
          if (pr.pierce && pr.hitIds) {
            pr.pierce--;
            pr.hitIds.push(e.id);
            continue;
          }
          if (pr.split) spawnSplits(s, pr, e, spawned);
          gone = true;
          break;
        }
      }
    } else if (!gone && !pr.fake) {
      // 적 탄: 처음 닿은 사람 (협동은 자리 순서대로, 쓰러진 사람은 빼고)
      eachSeat(s, () => {
        const p = s.player;
        const rr = p.r + pr.r;
        if (gone || (s.party && !isAlive(p)) || dist2(p, pr) >= rr * rr || p.dashTicks !== 0) return;
        if (tryParry(s, pr) || renBlock(s, pr)) gone = true;
        else {
          damagePlayer(s, pr.damage);
          // 세이렌 음표: 사라지지 않고 끌려감 · 갓이터 구슬: 사라지지 않음
          if (pr.net) netPlayer(s, pr.id);
          if (pr.lure) lure(s);
          else if (!pr.stay) gone = true;
        }
      });
      // 세이렌·주인이 쓰러지면 음표·구슬도 사라짐
      if (pr.lure && !s.enemies.some((e) => e.kind === "siren" && e.hp > 0)) gone = true;
      if (pr.owner !== undefined && !s.enemies.some((e) => e.id === pr.owner && e.hp > 0)) gone = true;
    }
    if (!gone) keep.push(pr);
  }
  useSeat(s, back);
  s.projectiles = [...keep, ...spawned];
  removeDead(s);
}

/** 튕김: 방 벽 밖으로 나가거나 방 안 벽·기둥에 들어가면 되돌리고 방향을 뒤집음 */
function bounce(pr: ProjectileState, g: TileGrid | null): void {
  let hit = false;
  if (g && blocksShot(g, pr.x, pr.y)) {
    const px = pr.x - pr.vx;
    const py = pr.y - pr.vy;
    // 가로로만 움직였을 때 막히면 가로를, 세로로만 움직였을 때 막히면 세로를 뒤집음
    const xBlocked = blocksShot(g, pr.x, py);
    const yBlocked = blocksShot(g, px, pr.y);
    if (xBlocked || !yBlocked) pr.vx = -pr.vx;
    if (yBlocked || !xBlocked) pr.vy = -pr.vy;
    pr.x = px;
    pr.y = py;
    hit = true;
  }
  if (pr.x < ROOM_MIN_X || pr.x > ROOM_MAX_X) {
    pr.x = pr.x < ROOM_MIN_X ? ROOM_MIN_X : ROOM_MAX_X;
    pr.vx = -pr.vx;
    hit = true;
  }
  if (pr.y < ROOM_MIN_Y || pr.y > ROOM_MAX_Y) {
    pr.y = pr.y < ROOM_MIN_Y ? ROOM_MIN_Y : ROOM_MAX_Y;
    pr.vy = -pr.vy;
    hit = true;
  }
  if (hit) pr.bounces = (pr.bounces ?? 1) - 1;
}

/** 추적 깃털: 가까운 적 쪽으로 속도 방향을 조금 돌림 (속력은 그대로) */
/** 빠르게 나간 탄이 목표 빠르기까지 점점 느려짐 */
function ease(pr: ProjectileState, to: number): void {
  const speed = Math.sqrt(pr.vx * pr.vx + pr.vy * pr.vy);
  const k = speed * BLOOM_EASE > to ? BLOOM_EASE : to / (speed || 1);
  pr.vx *= k;
  pr.vy *= k;
  if (k !== BLOOM_EASE) pr.easeTo = undefined;
}

function steer(s: RunState, pr: ProjectileState): void {
  let best: EnemyState | null = null;
  let bestD = pr.seek ? Infinity : PERKS.seekerFeather.reach * PERKS.seekerFeather.reach;
  for (const e of s.enemies) {
    if (e.hp <= 0 || pr.hitIds?.includes(e.id)) continue;
    const d = dist2(e, pr);
    if (d < bestD) {
      bestD = d;
      best = e;
    }
  }
  if (!best) return;
  const speed = Math.sqrt(pr.vx * pr.vx + pr.vy * pr.vy);
  const to = normalize(best.x - pr.x, best.y - pr.y);
  if (!to || speed === 0) return;
  const turn = pr.seek ? R.SEEK_TURN : PERKS.seekerFeather.turn;
  const dir = normalize(pr.vx + to[0] * speed * turn, pr.vy + to[1] * speed * turn);
  if (!dir) return;
  pr.vx = dir[0] * speed;
  pr.vy = dir[1] * speed;
}

/** 갈라지는 촉: 맞은 자리에서 양옆 대각선으로 작은 탄 두 개 */
function spawnSplits(s: RunState, pr: ProjectileState, hit: EnemyState, out: ProjectileState[]): void {
  for (const k of [1, -1]) {
    const vx = (pr.vx * R.SPLIT_DIAG - pr.vy * R.SPLIT_DIAG * k);
    const vy = (pr.vx * R.SPLIT_DIAG * k + pr.vy * R.SPLIT_DIAG);
    out.push({
      id: s.nextId++,
      fromPlayer: true,
      x: pr.x,
      y: pr.y,
      prevX: pr.x,
      prevY: pr.y,
      r: 2,
      vx,
      vy,
      damage: pr.damage * PERKS.splitHead.damage,
      ticksLeft: R.SPLIT_TICKS,
      hitIds: [hit.id],
      ...(pr.shooter !== undefined ? { shooter: pr.shooter } : {}),
    });
  }
}

/** 마법탄 폭발: 맞은 적 말고 범위 안 적에게 주변 피해 (기본 절반, 밖으로 밀림) */
function explode(s: RunState, pr: ProjectileState, hit: EnemyState): void {
  const p = s.player;
  const radius = pr.blast ?? 0;
  const hits = blastAt(s, pr.x, pr.y, radius, pr.damage * (pr.splash ?? 0.5), {
    exclude: hit,
    still: summonShot(pr),
    push: hasPerk(p, "tempestBreath") ? PERKS.tempestBreath.push : 0,
  });
  if (hasPerk(p, "manaDrain") && hits + 1 >= PERKS.manaDrain.hits) healPlayer(s, PERKS.manaDrain.heal);
  if (hasPerk(p, "echoBolt")) {
    s.pendingBlasts.push({ tick: s.tick + PERKS.echoBolt.ticks, x: pr.x, y: pr.y, radius, damage: pr.damage * PERKS.echoBolt.damage });
  }
}
