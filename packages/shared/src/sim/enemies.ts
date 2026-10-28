// 적 행동
import { ENEMIES } from "../content";
import { renMelee } from "./ren";
import { damagePlayer, removeDead } from "./combat";
import { updateBoss } from "./bosses";
import { ultBusy } from "./bossKit";
import { updateTower } from "./bossAngel";
import { updateBlade } from "./bossBlades";
import { updateGhost } from "./bossPrimeval";
import { addHazard, addShape } from "./hazards";
import { updateCritter } from "./critters";
import { updateStalker } from "./stalkers";
import { guardSpot, updateGnat, updateGuardian } from "./minions";
import { domainSlow } from "./talisman";
import type { EnemyState, RunState } from "./types";
import { distanceField, walkToward } from "./layout";
import { eachSeat, nearestSeat, seatNo, useSeat } from "./party";
import { dist2, enemyShot, keepInRoom, normalize, roomGrid } from "./util";
import { furyTick, tabooUp } from "./taboo";
import { timeSlowed } from "./punk";

/** 이 파일의 수치 (관리자 페이지에서 바꿀 수 있음, rulesRegistry) */
const R = {
  /** 성기사 빛기둥: 간격 · 예고 · 반경 · 피해 */
  PALADIN_GAP: 160,
  PALADIN_WARN: 45,
  PALADIN_R: 14,
  PALADIN_DMG: 12,
  /** 둔화된 적의 이동 배율 */
  SLOW_MUL: 0.6,
};
export { R as ENEMIES_RULES };

export function updateEnemies(s: RunState): void {
  /** 보스가 부른 적 (다 돌고 나서 넣음) */
  const spawned: EnemyState[] = [];
  // 모양 있는 방: 플레이어까지 걸어서 가는 거리 지도 (막히면 벽·구덩이를 돌아감). 협동은 쫓는 사람마다
  const g = roomGrid(s);
  const back = seatNo(s);
  const fields = new Map<number, ReturnType<typeof distanceField>>();
  for (const e of s.enemies) {
    if (e.hitFlash > 0) e.hitFlash--;
    if (e.kind === "dummy") {
      // 연습장 허수아비는 밀리거나 끌려가도 제자리 (anchor)
      if (e.anchor) {
        e.x = e.prevX = e.anchor[0];
        e.y = e.prevY = e.anchor[1];
      }
      continue;
    }
    // 협동: 가장 가까운 살아 있는 사람을 쫓음 (그 사람 자리를 꺼내 놓고 계산)
    if (s.party) useSeat(s, nearestSeat(s, e));
    const p = s.player;
    const ti = seatNo(s);
    if (g && !fields.has(ti)) fields.set(ti, distanceField(g, p.x, p.y));
    const field = fields.get(ti) ?? null;
    const def = ENEMIES[e.kind];
    const toP = normalize(p.x - e.x, p.y - e.y) ?? [0, 0];
    const d2 = dist2(e, p);
    /** 다가갈 때 걷는 방향 */
    const go = g && field ? (walkToward(g, field, e, p.x, p.y) ?? [0, 0]) : toP;

    const x0 = e.x;
    const y0 = e.y;
    // 라스트 보스 궁극기는 기절·위압에 멈추지 않음
    // 검은 잔영(지켜보기만 함)도
    if (ultBusy(e) || e.kind === "umbra") e.stunTicks = e.fearTicks = 0;
    // 얼음 부적·유압 해머: 경직된 적은 움직이지도 공격하지도 않음 (몸에 닿으면 피해는 그대로)
    // 느려짐(토룡·교만): 움직임과 공격이 모두 느림 (일반 적은 두 틱에 한 번, 보스는 네 틱에 한 번 쉼)
    if ((e.sluggish ?? 0) > 0) e.sluggish = (e.sluggish ?? 0) - 1;
    if ((e.stunTicks ?? 0) > 0) e.stunTicks = (e.stunTicks ?? 0) - 1;
    else if (((e.sluggish ?? 0) > 0 && s.tick % (def.boss ? 4 : 2) === 0) || timeSlowed(s, !!def.boss)) {
      // 이번 틱은 쉼 (펑크 신경 가속: 시간이 느려져 더 자주 쉼)
    } else if ((e.fearTicks ?? 0) > 0) {
      // 위압: 플레이어 반대쪽으로 도망
      e.fearTicks = (e.fearTicks ?? 0) - 1;
      e.x -= toP[0] * def.speed * 1.2;
      e.y -= toP[1] * def.speed * 1.2;
    } else if (e.kind === "fighter") {
      // 패왕전 AI 캐릭터: 움직임·공격은 sim/paewangAi (기절·둔화·속박은 여기서 줄고 그쪽에서 확인)
    } else if (e.kind === "gnat") updateGnat(s, e, go);
    else if (e.kind === "tower") updateTower(s, e);
    else if (e.kind === "ghost") updateGhost(s, e);
    else if (e.kind === "ruinblade" || e.kind === "chaosblade") updateBlade(s, e, toP);
    else if (e.kind === "guardian") updateGuardian(s, e, toP, e.aux ? guardSpot(s, e, go) : go);
    else if (e.kind === "paladin") {
      // 성기사: 다가오며 이따금 플레이어 자리에 하늘에서 빛기둥을 하나씩 떨굼
      e.x += go[0] * def.speed;
      e.y += go[1] * def.speed;
      if (--e.timer <= 0) {
        e.timer = R.PALADIN_GAP;
        addShape(s, R.PALADIN_WARN, { x: p.x, y: p.y, radius: R.PALADIN_R, damage: R.PALADIN_DMG, fx: "holy" });
      }
    } else if (e.kind === "crawler" || e.kind === "soul") {
      e.x += go[0] * def.speed;
      e.y += go[1] * def.speed;
    } else if (e.kind === "spitter") {
      // 적당한 거리를 유지하며 주기적으로 탄 발사
      const want = 60;
      const dir = d2 > want * want ? 1 : d2 < (want - 15) * (want - 15) ? -1 : 0;
      const m = dir > 0 ? go : toP;
      e.x += m[0] * def.speed * dir;
      e.y += m[1] * def.speed * dir;
      e.timer--;
      if (e.timer <= 0) {
        e.timer = 100;
        enemyShot(s, e.x, e.y, toP[0], toP[1], 1.4, 8).from = "spitter";
      }
    } else if (e.kind === "mortar") {
      // 멀리서 거리를 유지하며, 일정 간격으로 플레이어가 서 있는 자리에 위험 표시를 남김
      const want = 95;
      const dir = d2 > want * want ? 1 : d2 < (want - 20) * (want - 20) ? -1 : 0;
      const m = dir > 0 ? go : toP;
      e.x += m[0] * def.speed * dir;
      e.y += m[1] * def.speed * dir;
      e.timer--;
      if (e.timer <= 0) {
        e.timer = 150;
        addHazard(s, p.x, p.y, 14, "mortar");
      }
    } else if (e.kind === "charger") {
      // charger: 걷기 → 멈춰서 준비 → 돌진
      e.timer--;
      if (e.phase === "walk") {
        e.x += go[0] * def.speed;
        e.y += go[1] * def.speed;
        if (e.timer <= 0) {
          e.phase = "windup";
          e.timer = 30;
          e.dirX = toP[0];
          e.dirY = toP[1];
        }
      } else if (e.phase === "windup") {
        if (e.timer <= 0) {
          e.phase = "charge";
          e.timer = 22;
        }
      } else {
        e.x += e.dirX * 2.6;
        e.y += e.dirY * 2.6;
        if (e.timer <= 0) {
          e.phase = "walk";
          e.timer = 120;
        }
      }
    } else if (!updateCritter(s, e, toP, go) && !updateStalker(s, e, toP, go)) {
      updateBoss(s, e, toP, go, spawned);
    }
    domainSlow(s, e, x0, y0);
    // 금기: 서두르는 발 (움직인 거리 늘림) · 성급한 손 (공격 준비가 빨리 줄어듦)
    if (s.taboo) {
      const haste = tabooUp(s, "haste");
      e.x = x0 + (e.x - x0) * haste;
      e.y = y0 + (e.y - y0) * haste;
      if (e.timer > 1 && furyTick(s)) e.timer--;
    }
    // 둔화(자기장): 이번 틱에 움직인 거리를 줄임 (보스 제외)
    if ((e.slowTicks ?? 0) > 0 && !def.boss) {
      e.x = x0 + (e.x - x0) * R.SLOW_MUL;
      e.y = y0 + (e.y - y0) * R.SLOW_MUL;
    }
    // 속박(붕대 채찍): 움직이지 못함 (공격은 함)
    if ((e.rootTicks ?? 0) > 0) {
      e.rootTicks = (e.rootTicks ?? 0) - 1;
      e.x = x0;
      e.y = y0;
    }
    keepInRoom(e, g);

    // 몸에 닿으면 피해 (붙잡힌 적은 제외, 협동은 닿은 사람 모두)
    eachSeat(
      s,
      () => {
        const q = s.player;
        const rr = e.r + q.r;
        // 용 염옥(필살기) 중에는 몸에 닿아도 피해 없음 (안전한 칸이 몸 쪽에 떠도 갈 수 있게)
        if (e.ultAt !== undefined && e.ultSafe) return;
        // 잔영 그림자: 몸에 닿는 피해 없음 (원거리 공격은 맞음)
        if ((q.rmShade ?? 0) > 0) return;
        if (def.contactDamage > 0 && dist2(e, q) < rr * rr && e.id !== q.grabId && !e.air) damagePlayer(s, renMelee(s, def.contactDamage * tabooUp(s, "fangs")));
      },
      !!s.party,
    );
  }
  useSeat(s, back);

  s.enemies.push(...spawned);

  // 적끼리 겹치지 않게 밀어냄 (순서가 정해져 있어 결과가 항상 같음)
  const list = s.enemies;
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i]!;
      const b = list[j]!;
      // 하늘·땅속에 있는 적은 밀지 않음
      if (a.air || b.air) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const rr = a.r + b.r;
      const d2 = dx * dx + dy * dy;
      if (d2 >= rr * rr) continue;
      const d = Math.sqrt(d2);
      const push = (rr - d) / 2;
      const nx = d === 0 ? 1 : dx / d;
      const ny = d === 0 ? 0 : dy / d;
      a.x -= nx * push;
      a.y -= ny * push;
      b.x += nx * push;
      b.y += ny * push;
      keepInRoom(a, g);
      keepInRoom(b, g);
    }
  }

  removeDead(s);
}
