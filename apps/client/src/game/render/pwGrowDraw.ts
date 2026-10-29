// 패왕전 성장 대결 그리기: 집(깃발 둘레 원) · 쟁탈전 가운데 점령지(가진 편 색) · 병사·포탑·보스(던전 몬스터 그림 + 편 고리 + 체력 줄) · 포탑·원거리 병사 공격 빛줄기
import { allPlayers, BASE_R, capCenter, ENEMIES, fogAt, portalOf, PW_ARENAS, PW_GIGA, PW_GROW, PW_UNIT, PW_WAR, spotXY, TILE_SIZE, type EnemyKind, type PwUnit, type RunState } from "@pixel-rogue/shared";
import { drawEnemySprite } from "../sprites";
import { drawTurret } from "./pwGrowTheme";

type Ctx = CanvasRenderingContext2D;
const T = TILE_SIZE;
const HORN: Record<string, string> = { giantRed: "#ff4a3a", giantBlue: "#4a9aff", giantWhite: "#f4f4f8" };
const color = (team: number, mine: number) => (team === 2 ? "#e0c060" : team === mine ? "#5ab0ff" : "#ff5a5a");

export function drawGrowGround(ctx: Ctx, s: RunState): void {
  const pv = s.pvp;
  const g = pv?.grow;
  if (!pv || !g) return;
  const a = PW_ARENAS[pv.arena];
  const mine = pv.seats[s.seat ?? 0]!.team;
  ctx.save();
  // 집: 회복·상점 범위 · 쟁탈전 집 점령지
  (a.homes ?? []).forEach(([c, r], team) => {
    const x = (c + 0.5) * T;
    const y = (r + 0.5) * T;
    ctx.fillStyle = team === mine ? "rgba(90, 176, 255, 0.10)" : "rgba(255, 90, 90, 0.10)";
    ctx.beginPath();
    ctx.arc(x, y, PW_GROW.homeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = color(team, mine);
    ctx.beginPath();
    ctx.arc(x, y, g.bossDown[team] ? BASE_R : PW_GROW.homeR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  });
  // 전쟁의 서막 체크포인트: 가진 편 색 동그라미 · 점령 중이면 바깥 호
  (a.points ?? []).forEach((pt, k) => {
    const [x, y] = spotXY(pt.at);
    const st = g.points?.[k];
    const own = st?.owner ?? -1;
    ctx.fillStyle = own < 0 ? "rgba(220, 220, 230, 0.15)" : own === mine ? "rgba(90, 176, 255, 0.22)" : "rgba(255, 90, 90, 0.22)";
    ctx.strokeStyle = own < 0 ? "#d8d8e8" : color(own, mine);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, PW_WAR.pointR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    for (const [team, v] of Object.entries(st?.prog ?? {})) {
      ctx.strokeStyle = color(Number(team), mine);
      ctx.beginPath();
      ctx.arc(x, y, PW_WAR.pointR + 4, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * v) / 100);
      ctx.stroke();
    }
    ctx.lineWidth = 1;
  });
  // 전쟁의 서막 포털 (우리 집 앞): 초록 소용돌이
  if (pv.mode === "war") {
    const [x, y] = portalOf(s, mine);
    for (let k = 0; k < 3; k++) {
      ctx.strokeStyle = `rgba(106, 240, 160, ${0.9 - k * 0.25})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(x, y, 10 - k * 3, 5 - k * 1.5, (s.tick / 20) * (k % 2 ? -1 : 1), 0, Math.PI * 1.6);
      ctx.stroke();
    }
    ctx.lineWidth = 1;
  }
  // 기간토마키아 제작 중: 망치질하듯 튀는 불꽃 + 금빛 막대
  allPlayers(s).forEach((p) => {
    const cr = p.pwCraft;
    if (!cr) return;
    const k = 1 - Math.max(0, cr.end - s.tick) / PW_GIGA.craftHold;
    const hit = s.tick % 20 < 4;
    ctx.fillStyle = hit ? "#fff0a0" : "#e8b030";
    for (let n = 0; n < (hit ? 6 : 2); n++) {
      const a2 = (n / 6) * Math.PI * 2 + s.tick / 7;
      ctx.fillRect(p.x + Math.cos(a2) * (6 + (s.tick % 20)), p.y - 4 + Math.sin(a2) * 4 - (s.tick % 20) / 3, 2, 2);
    }
    ctx.fillStyle = "#0a0810";
    ctx.fillRect(p.x - 11, p.y + 10, 22, 4);
    ctx.fillStyle = "#f2d040";
    ctx.fillRect(p.x - 10, p.y + 11, Math.round(20 * k), 2);
  });
  // 귀환 중: 발밑에서 오르는 파란 빛 + 남은 막대
  allPlayers(s).forEach((p) => {
    const rc = p.pwRecall;
    if (!rc) return;
    const k = 1 - Math.max(0, rc.end - s.tick) / PW_UNIT.recall;
    ctx.fillStyle = `rgba(110, 190, 255, ${0.25 + 0.15 * Math.sin(s.tick / 5)})`;
    ctx.fillRect(p.x - 8, p.y - 24 * k, 16, 24 * k + 6);
    ctx.fillStyle = "#0a0810";
    ctx.fillRect(p.x - 11, p.y + 10, 22, 4);
    ctx.fillStyle = "#8ac8ff";
    ctx.fillRect(p.x - 10, p.y + 11, Math.round(20 * k), 2);
  });
  // 가운데 점령지
  if (a.zone?.rect) {
    const [c, r, w, h] = a.zone.rect;
    const tint = g.owner === undefined ? "200, 200, 220" : g.owner === mine ? "90, 176, 255" : "255, 90, 90";
    ctx.fillStyle = `rgba(${tint}, 0.12)`;
    ctx.fillRect(c * T, r * T, w * T, h * T);
    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgba(${tint}, 0.8)`;
    ctx.strokeRect(c * T, r * T, w * T, h * T);
    const [cx, cy] = capCenter(a);
    ctx.fillStyle = `rgba(${tint}, 0.9)`;
    ctx.fillRect(cx - 2, cy - 14, 2, 14);
    ctx.fillRect(cx, cy - 14, 8, 5);
  }
  ctx.restore();
}

/** 체력 줄 (포탑·보스는 크게) · 못 때리는 동안 자물쇠 표시 */
function drawBar(ctx: Ctx, u: PwUnit, col: string, tick = 0): void {
  const b = u.body;
  const top = b.y - (u.kind === "tower" ? 32 : b.r + 7);
  const w = u.kind === "tower" ? 30 : Math.max(12, b.r * 2);
  ctx.fillStyle = "#0a0810";
  ctx.fillRect(b.x - w / 2 - 1, top, w + 2, 4);
  ctx.fillStyle = col;
  ctx.fillRect(b.x - w / 2, top + 1, Math.max(1, Math.round((w * b.hp) / b.maxHp)), 2);
  // 정글·거인: 맞은 뒤 3초가 지나면 체력이 차오름 (흰 막대가 다 줄면 회복 시작)
  if (u.team === 2 && u.hurtAt !== undefined) {
    const left = Math.max(0, 1 - (tick - u.hurtAt) / PW_UNIT.calm);
    if (left > 0) {
      ctx.fillStyle = "#f4f4f8";
      ctx.fillRect(b.x - w / 2, top - 2, Math.round(w * left), 1);
    }
  }
  if (b.immune) {
    ctx.fillStyle = "#d8d8e8";
    ctx.fillRect(b.x - 2, top - 6, 5, 4);
    ctx.strokeStyle = "#d8d8e8";
    ctx.strokeRect(b.x - 1.5, top - 9, 4, 4);
  }
}

/** 병사·포탑·보스 (사람 아래에) */
export function drawGrowUnits(ctx: Ctx, s: RunState): void {
  const pv = s.pvp;
  const g = pv?.grow;
  if (!pv || !g) return;
  const mine = pv.seats[s.seat ?? 0]!.team;
  drawGigaGround(ctx, s);
  const myFog = fogAt(pv.arena, s.player.x, s.player.y);
  for (const u of g.units) {
    const b = u.body;
    if (b.hp <= 0) continue;
    // 안개 안은 같은 안개에 있어야 보임
    const f = fogAt(pv.arena, b.x, b.y);
    if (f >= 0 && f !== myFog) continue;
    const col = color(u.team, mine);
    // 공격 빛줄기
    if (u.shot && s.tick - u.shot.at < 8 && u.kind !== "minion") {
      // 포탑 공격: 현대 포탑은 주황 예광탄, 세계수 포탑은 초록 빛줄기
      ctx.strokeStyle = u.kind === "tower" ? (u.team === 0 ? "#ffb040" : "#9af07a") : col;
      ctx.lineWidth = u.kind === "tower" ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y - b.r);
      ctx.lineTo(u.shot.x, u.shot.y);
      ctx.stroke();
      ctx.lineWidth = 1;
    }
    ctx.strokeStyle = col;
    ctx.beginPath();
    ctx.ellipse(b.x, b.y + b.r - 1, b.r + 2, (b.r + 2) / 2, 0, 0, Math.PI * 2);
    ctx.stroke();
    if (u.kind === "tower") {
      drawTurret(ctx, s, u);
      drawBar(ctx, u, col, s.tick);
      continue;
    }
    const def = ENEMIES[u.look as EnemyKind];
    const tint: readonly [string, number] | undefined = b.hitFlash > 0 ? ["#ffffff", 0.7] : b.immune ? ["#8a8aa0", 0.35] : undefined;
    if (!def || !drawEnemySprite(ctx, u.look, Math.round(b.x), Math.round(b.y), Math.floor(s.tick / 12), b.dirX < 0, tint, b.r / def.radius)) {
      ctx.fillStyle = col;
      ctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
    }
    drawBar(ctx, u, col, s.tick);
    // 기간토마키아 뿔 거인: 머리 위 뿔 둘 (붉은 · 푸른 · 흰)
    const horn = HORN[u.kind];
    if (horn) {
      ctx.fillStyle = horn;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(b.x + side * b.r * 0.35, b.y - b.r * 0.9);
        ctx.lineTo(b.x + side * b.r * 0.75, b.y - b.r * 1.7);
        ctx.lineTo(b.x + side * b.r * 0.6, b.y - b.r * 0.8);
        ctx.fill();
      }
    }
  }
}

/** 전쟁의 서막 안개 지역: 내가 들어가 있지 않은 안개는 자욱하게 덮음 (사람·체력 줄 위에) */
export function drawWarFog(ctx: Ctx, s: RunState): void {
  const pv = s.pvp;
  const fogs = pv && PW_ARENAS[pv.arena].fogs;
  if (!fogs) return;
  const mine = fogAt(pv.arena, s.player.x, s.player.y);
  fogs.forEach((rects, k) => {
    ctx.fillStyle = k === mine ? "rgba(120, 110, 150, 0.12)" : "rgba(58, 54, 72, 0.88)";
    for (const [c, r, w, h] of rects) ctx.fillRect(c * T, r * T, w * T, h * T);
    if (k === mine) return;
    // 연기 덩어리 (천천히 흐름)
    ctx.fillStyle = "rgba(150, 140, 170, 0.18)";
    rects.forEach(([c, r, w], j) => {
      if (j % 4) return;
      const x = (c + ((j * 7 + s.tick / 30) % Math.max(1, w))) * T;
      ctx.beginPath();
      ctx.arc(x, r * T, 18, 0, Math.PI * 2);
      ctx.fill();
    });
  });
}

/** 기간토마키아: 닫힌 상자 · 떨어진 배낭 · 임시 출구 */
function drawGigaGround(ctx: Ctx, s: RunState): void {
  const g = s.pvp?.grow;
  if (!g?.loot) return;
  for (const l of g.loot) {
    if (l.chest) {
      ctx.fillStyle = "#6a4422";
      ctx.fillRect(l.x - 6, l.y - 5, 12, 9);
      ctx.fillStyle = "#e0b040";
      ctx.fillRect(l.x - 6, l.y - 2, 12, 2);
      ctx.fillRect(l.x - 1, l.y - 3, 2, 4);
    } else {
      ctx.fillStyle = "#8a6a4a";
      ctx.beginPath();
      ctx.arc(l.x, l.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#c8a070";
      ctx.fillRect(l.x - 2, l.y - 7, 4, 3);
    }
  }
  for (const e of g.exits ?? []) {
    const k = (s.tick % 60) / 60;
    ctx.strokeStyle = "#6af0a0";
    ctx.lineWidth = 2;
    for (const r of [8, 13, 18]) {
      ctx.globalAlpha = 1 - ((r / 18 + k) % 1) * 0.7;
      ctx.beginPath();
      ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;
  }
}
