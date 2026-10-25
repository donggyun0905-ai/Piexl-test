// 숨겨진 힘: 장수 콤보 마지막에 무기 주인의 필살기. 화면에는 legend 효과(dirX = LEGENDS 순번)로 이름이 크게 뜸
import { ENEMIES } from "../enemyDefs";
import type { LegendKind } from "../weaponsGeneral";
import { GENERAL, LEGEND_COLORS } from "../weaponsGeneral";
import { healPlayer } from "./combat";
import { burst, lunge, spearHit, sweep, thrustLine, wave } from "./generalMoves";
import type { RunState } from "./types";
import { addEffect, dist2 } from "./util";

/** 화면 이름 순번용 */
export const LEGENDS: readonly LegendKind[] = ["charge", "frenzy", "dragonCleave", "roar", "hegemon", "benevolence", "unify", "loneHero", "sevenCharge", "craneWing", "lastStand"];

/** 필살기 (dmg = 공격력) */
export function useLegend(s: RunState, kind: LegendKind, dmg: number): void {
  // 이번 필살기로 생긴 효과·검기에 그 필살기 빛깔을 입힘
  const fx0 = s.effects.length;
  const pr0 = s.projectiles.length;
  doLegend(s, kind, dmg);
  const tint = LEGEND_COLORS[kind];
  for (const e of s.effects.slice(fx0)) e.tint = tint;
  for (const pr of s.projectiles.slice(pr0)) pr.tint = tint;
}

function doLegend(s: RunState, kind: LegendKind, dmg: number): void {
  const p = s.player;
  const range = p.stats.range;
  addEffect(s, { kind: "legend", x: p.x, y: p.y, dirX: LEGENDS.indexOf(kind), dirY: 0, size: range, maxTicks: 60 });
  switch (kind) {
    case "charge":
      // 돌격: 크게 돌진 내리꽂기
      lunge(s, dmg * 2.5, range * 1.2);
      return;
    case "frenzy":
      // 광풍난무: 점점 커지는 한 바퀴 베기 여섯 번
      for (let i = 0; i < 6; i++) sweep(s, dmg * 0.9, range * (0.9 + i * 0.12), -1);
      return;
    case "dragonCleave":
      // 청룡참: 거대한 청룡 검기
      sweep(s, dmg * 1.5, range, 0.2);
      s.projectiles.push({ id: s.nextId++, fromPlayer: true, x: p.x, y: p.y, prevX: p.x, prevY: p.y, r: 12, vx: p.faceX * 3.5, vy: p.faceY * 3.5, damage: dmg * 4, ticksLeft: Math.ceil((range * 4) / 3.5), pierce: 99, hitIds: [], spirit: "crescent" });
      return;
    case "roar":
      // 장판교 호령: 둘레 적 모두 피해 + 기절
      for (const e of [...s.enemies]) {
        if (e.hp <= 0 || dist2(e, p) > 100 * 100) continue;
        spearHit(s, e, dmg * 2, 0, 0);
        e.stunTicks = Math.max(e.stunTicks ?? 0, ENEMIES[e.kind].boss ? 20 : 90);
      }
      for (const r of [60, 80, 100]) addEffect(s, { kind: "ring", x: p.x, y: p.y, dirX: 0, dirY: 0, size: r, maxTicks: 18 + r / 5 });
      return;
    case "hegemon":
      // 패도: 크게 한 바퀴 + 일반 적이 겁먹고 도망
      sweep(s, dmg * 3, 70, -1);
      for (const e of s.enemies) if (!ENEMIES[e.kind].boss && dist2(e, p) <= 90 * 90) e.fearTicks = Math.max(e.fearTicks ?? 0, 120);
      return;
    case "benevolence":
      // 인덕: 체력 15% 회복 + 한 바퀴
      healPlayer(s, p.stats.maxHp * 0.15);
      sweep(s, dmg * 2, 60, -1);
      return;
    case "unify":
      // 삼한일통: 세 갈래 검기
      for (const a of [-0.35, 0, 0.35]) wave(s, dmg * 2.2, range * 3, a);
      return;
    case "loneHero": {
      // 일기당천: 가까운 적 여섯을 차례로 벰
      const near = s.enemies
        .filter((e) => e.hp > 0 && dist2(e, p) <= 140 * 140)
        .map((e, i) => ({ e, i, d: dist2(e, p) }))
        .sort((a, b) => a.d - b.d || a.i - b.i)
        .slice(0, 6);
      for (const { e } of near) {
        spearHit(s, e, dmg * 2.5, 0, 0);
        addEffect(s, { kind: "streak", x: p.x, y: p.y, dirX: 0, dirY: 0, size: 3, toX: e.x, toY: e.y, maxTicks: 14 });
      }
      return;
    }
    case "sevenCharge":
      // 칠진칠출: 부채꼴로 일곱 번 찌름
      for (let i = 0; i < 7; i++) thrustLine(s, dmg * 1.2, range * 1.3, GENERAL.width, -0.6 + i * 0.2);
      return;
    case "craneWing":
      // 학익진: 넓게 펼친 창 아홉 자루
      for (let i = 0; i < 9; i++) wave(s, dmg * 1.3, range * 3, -0.9 + i * 0.225, "spearShot");
      return;
    case "lastStand":
      // 황산벌 결사: 체력이 적을수록 강한 큰 폭발
      burst(s, p.x, p.y, 60, dmg * (2 + 3 * (1 - Math.max(0, p.hp) / p.stats.maxHp)));
      return;
  }
}
