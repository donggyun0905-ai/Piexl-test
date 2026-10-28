// 기계공학자 그리기: 레이저·번개·플라즈마 부채꼴·위성 포 표시 · 포탑·지뢰·드론 · 보호막·리액터 게이지 · 기절 표시
import { droneSpots, FLY_TICKS, gearPeriod, TURRET_LIFE, REACTOR_BOOST, REACTOR_FULL, REACTOR_OVERHEAT, WEAPONS, type EffectState, type RunState, type WeaponDef } from "@pixel-rogue/shared";
import { C, lerp, type Snap } from "./palette";

/** 레이저 효과면 그리고 true (나머지 효과는 shots에서) */
export function drawLaserFx(ctx: CanvasRenderingContext2D, s: RunState, fx: EffectState, px: number, py: number, snap: Snap): boolean {
  const t = fx.ticks / fx.maxTicks;
  // 플레이어에서 나가는 빔은 지금 플레이어 자리에서 시작
  const x = snap(fx.follow ? px : fx.x);
  const y = snap(fx.follow ? py : fx.y);
  if (fx.kind === "beam") {
    const tx = snap(fx.toX ?? fx.x);
    const ty = snap(fx.toY ?? fx.y);
    const w = fx.width ?? 1;
    ctx.lineCap = "round";
    ctx.strokeStyle = C.beam;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = w * 2 + 1;
    line(ctx, x, y, tx, ty);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = C.beamCore;
    ctx.lineWidth = Math.max(1, w * 0.8);
    line(ctx, x, y, tx, ty);
    // 맞는 자리의 불꽃
    ctx.fillStyle = C.beamCore;
    ctx.fillRect(tx - 1, ty - 1, 3, 3);
    ctx.lineCap = "butt";
    return true;
  }
  if (fx.kind === "bolt") {
    const tx = fx.toX ?? fx.x;
    const ty = fx.toY ?? fx.y;
    // 번개: 가운데 두 점을 옆으로 흔든 꺾은선
    const nx = -(ty - y) * 0.15;
    const ny = (tx - x) * 0.15;
    const k = Math.sin(s.tick * 1.7);
    ctx.strokeStyle = C.bolt;
    ctx.globalAlpha = t;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(lerp(x, tx, 0.33) + nx * k, lerp(y, ty, 0.33) + ny * k);
    ctx.lineTo(lerp(x, tx, 0.66) - nx * k, lerp(y, ty, 0.66) - ny * k);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.globalAlpha = 1;
    return true;
  }
  if (fx.kind === "flame") {
    const a = Math.atan2(fx.dirY, fx.dirX);
    const half = Math.acos(Math.max(-1, Math.min(1, fx.width ?? 0.6)));
    ctx.fillStyle = C.flame;
    ctx.globalAlpha = 0.35 + 0.15 * Math.sin(s.tick * 0.9);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, fx.size, a - half, a + half);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    return true;
  }
  if (fx.kind === "ring") {
    if (fx.follow) {
      // 자기장 장판: 플레이어 둘레의 옅은 원
      ctx.fillStyle = C.bolt;
      ctx.globalAlpha = 0.12;
      ctx.beginPath();
      ctx.arc(x, y, fx.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = C.bolt;
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      // 해머·지뢰 충격파: 퍼지는 주황 원
      ctx.strokeStyle = C.flame;
      ctx.globalAlpha = t;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(1, fx.size * (1.1 - t * 0.5)), 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    return true;
  }
  if (fx.kind === "mark") {
    // 위성 포 낙하 표시: 줄어드는 원 + 십자
    ctx.strokeStyle = C.beam;
    ctx.globalAlpha = 0.9 - 0.5 * t;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, fx.size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, Math.max(1, fx.size * t), 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = C.beam;
    ctx.fillRect(x - 4, y, 9, 1);
    ctx.fillRect(x, y - 4, 1, 9);
    ctx.globalAlpha = 1;
    return true;
  }
  return false;
}

function line(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number): void {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

/** 바닥의 장치(포탑·지뢰)와 기절한 적 표시 (적보다 먼저 그림) */
export function drawDevices(ctx: CanvasRenderingContext2D, s: RunState, snap: Snap): void {
  for (const d of s.devices ?? []) {
    if (d.kind !== "turret" && d.kind !== "mine") continue;
    const x = snap(d.x);
    const y = snap(d.y);
    // 던진 것: 포물선으로 날아감 (바닥엔 그림자)
    const flying = (d.fly ?? 0) > 0;
    const lift = flying ? Math.sin(Math.PI * (1 - (d.fly ?? 0) / FLY_TICKS)) * 14 : 0;
    if (flying) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      ctx.fillRect(x - 2, y, 5, 2);
    }
    const top = snap(d.y - lift);
    if (d.kind === "turret") {
      // 사라지기 1초 전부터 깜빡임
      if (!flying && (d.life ?? TURRET_LIFE) < 60 && Math.floor(s.tick / 5) % 2 === 0) continue;
      ctx.fillStyle = C.playerEdge;
      ctx.fillRect(x - 4, top - 3, 8, 7);
      ctx.fillStyle = C.engineer;
      ctx.fillRect(x - 3, top - 2, 6, 5);
      ctx.fillStyle = "#6a5a4a";
      ctx.fillRect(x - 4, top + 4, 2, 1);
      ctx.fillRect(x + 2, top + 4, 2, 1);
      ctx.fillStyle = flying ? "#8a8498" : C.beam;
      ctx.fillRect(x - 1, top - 1, 2, 2);
    } else {
      // 지뢰: 납작한 원반 + 가시, 준비되면 빨간 불이 깜빡임
      ctx.fillStyle = C.playerEdge;
      ctx.fillRect(x - 3, top - 2, 7, 5);
      ctx.fillRect(x - 2, top - 3, 5, 7);
      ctx.fillStyle = "#5a5468";
      ctx.fillRect(x - 2, top - 1, 5, 3);
      ctx.fillStyle = flying || d.timer > 0 ? "#8a8498" : Math.floor(s.tick / 10) % 2 === 0 ? "#ff4a3a" : "#7a2a24";
      ctx.fillRect(x, top, 1, 1);
    }
  }
  for (const e of s.enemies) {
    if ((e.stunTicks ?? 0) <= 0) continue;
    // 기절: 머리 위에 도는 별 두 개
    const a = s.tick * 0.2;
    ctx.fillStyle = "#ffe070";
    for (const k of [0, Math.PI]) ctx.fillRect(snap(e.x + Math.cos(a + k) * e.r), snap(e.y - e.r - 3 + Math.sin(a + k)), 1, 1);
  }
}

/** 플레이어 둘레: 거울 드론, 보호막 고리, 리액터 게이지 (플레이어 위에 그림) */
export function drawEngineerGear(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (s.over) return;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  const w: WeaponDef = WEAPONS[p.weaponId];
  if (w.gear === "drone") {
    // 드론: 게임 계산과 같은 자리 (빔이 드론에서 나감)
    for (const [dx, dy] of droneSpots({ x, y }, s.tick)) {
      ctx.fillStyle = C.playerEdge;
      ctx.fillRect(snap(dx) - 2, snap(dy) - 2, 4, 4);
      ctx.fillStyle = "#cfe8ff";
      ctx.fillRect(snap(dx) - 1, snap(dy) - 1, 2, 2);
    }
  }
  if (w.gear === "magnet" && (p.gearTicks ?? 0) > 0) {
    // 자력 펄스 모으는 정도: 플레이어 둘레의 차오르는 호
    const f = Math.min(1, (p.gearTicks ?? 0) / gearPeriod(p));
    ctx.strokeStyle = C.bolt;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, p.r + 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * f);
    ctx.stroke();
  }
  if (w.gear === "reactor") {
    // 게이지: 차는 중 주황, 두 배 중 흰색으로 줄어듦, 과열 중 빨간색
    const boost = p.boostTicks ?? 0;
    const hot = p.overheatTicks ?? 0;
    const f = hot > 0 ? hot / REACTOR_OVERHEAT : boost > 0 ? boost / REACTOR_BOOST : (p.heat ?? 0) / REACTOR_FULL;
    ctx.fillStyle = "#000";
    ctx.fillRect(x - 6, y + p.r + 3, 12, 2);
    ctx.fillStyle = hot > 0 ? "#ff4a3a" : boost > 0 ? C.beamCore : C.flame;
    ctx.fillRect(x - 6, y + p.r + 3, Math.max(1, Math.round(12 * f)), 2);
  }
}
