// 의사 그리기: 날아가는 주사기·바늘·알약 · 가스 구름 · 봉합 바늘과 실 · 회복 알약 · 날아가는 가스통·구급 키트 · 구급차 · 붕대에 묶인 적
// (효과는 medicFx)
import { AMB_TICKS, FLY_TICKS, GAS_LIFE, type Device, type RunState } from "@pixel-rogue/shared";
import { glowStroke } from "./pwFxBits";
import { C, type Snap } from "./palette";

const PILL_COLORS = ["#ff6a7a", "#7fd88a", "#ffd060"];

/** 바닥: 가스 구름·회복 알약·봉합 실과 바늘 (적보다 먼저 그림) */
export function drawMedicGround(ctx: CanvasRenderingContext2D, s: RunState, snap: Snap): void {
  const devices = s.devices ?? [];
  for (const d of devices) {
    if ((d.fly ?? 0) > 0) continue;
    if (d.kind === "gas") drawGas(ctx, d, s.tick, snap);
    else if (d.kind === "pill") {
      // 사라지기 2초 전부터 깜빡임
      if ((d.life ?? 0) < 120 && Math.floor(s.tick / 6) % 2 === 0) continue;
      const x = snap(d.x);
      const y = snap(d.y + Math.sin(s.tick * 0.12 + d.id) * 1);
      ctx.fillStyle = C.playerEdge;
      ctx.fillRect(x - 3, y - 2, 7, 4);
      ctx.fillStyle = C.blood;
      ctx.fillRect(x - 2, y - 1, 3, 2);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x + 1, y - 1, 2, 2);
    }
  }
  // 봉합 실: 꽂힌 순서대로 이어짐 (120픽셀 넘으면 끊김), 살짝 처지고 땀 자국
  const needles = devices.filter((d) => d.kind === "needle");
  ctx.strokeStyle = C.bandage;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.85;
  for (let i = 0; i + 1 < needles.length; i++) {
    const a = needles[i]!;
    const b = needles[i + 1]!;
    if ((a.x - b.x) ** 2 + (a.y - b.y) ** 2 > 120 * 120) continue;
    ctx.beginPath();
    ctx.moveTo(snap(a.x), snap(a.y));
    ctx.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 + 4, snap(b.x), snap(b.y));
    glowStroke(ctx);
  }
  ctx.globalAlpha = 1;
  for (const n of needles) {
    // 봉합 직전(0.5초)이면 붉게 깜빡임
    const x = snap(n.x);
    const y = snap(n.y);
    ctx.strokeStyle = n.timer < 30 && Math.floor(s.tick / 4) % 2 === 0 ? C.blood : "#e8ecf4";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 3, y - 4);
    ctx.lineTo(x + 1, y);
    glowStroke(ctx);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 1, y, 1, 1);
  }
}

/** 마취 가스: 일렁이는 여러 겹의 초록 구름 (사라질 때 옅어짐) */
function drawGas(ctx: CanvasRenderingContext2D, d: Device, tick: number, snap: Snap): void {
  const fade = Math.min(1, (d.life ?? 0) / 30, (GAS_LIFE - (d.life ?? 0)) / 10 + 0.3);
  ctx.fillStyle = C.gas;
  for (let i = 0; i < 7; i++) {
    const a = (i * Math.PI * 2) / 7 + tick * 0.01;
    const r = i === 0 ? 0 : 13 + Math.sin(tick * 0.05 + i) * 2;
    ctx.globalAlpha = 0.16 * fade;
    ctx.beginPath();
    ctx.arc(snap(d.x + Math.cos(a) * r), snap(d.y + Math.sin(a) * r), i === 0 ? 16 : 11, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** 공중: 날아가는 탄·가스통·구급 키트, 구급차, 붕대에 묶인 적 (적·플레이어 위에 그림) */
export function drawMedicAir(ctx: CanvasRenderingContext2D, s: RunState, snap: Snap): void {
  for (const e of s.enemies) {
    if ((e.rootTicks ?? 0) <= 0) continue;
    // 붕대 감김: 비스듬한 붕대 두 겹이 몸 둘레를 빙빙 돌며 감김
    const spin = s.tick * 0.25;
    ctx.strokeStyle = C.bandage;
    ctx.lineWidth = 1.5;
    for (const k of [0, Math.PI / 2]) {
      ctx.beginPath();
      ctx.ellipse(snap(e.x), snap(e.y), e.r + 2, (e.r + 2) * 0.35, spin + k, 0, Math.PI * 2);
      glowStroke(ctx);
    }
  }
  for (const d of s.devices ?? []) {
    if (d.kind === "shot") drawShot(ctx, d, snap);
    else if ((d.fly ?? 0) > 0 && (d.kind === "gas" || d.kind === "medkit")) drawThrown(ctx, d, snap);
    else if (d.kind === "ambulance") drawAmbulance(ctx, d, snap);
  }
}

/** 날아가는 탄 (나는 방향으로 돌림): 주사기 · 봉합 바늘(실 꼬리) · 알약(세 가지 색) */
function drawShot(ctx: CanvasRenderingContext2D, d: Device, snap: Snap): void {
  ctx.save();
  ctx.translate(snap(d.x), snap(d.y));
  ctx.rotate(Math.atan2(d.vy ?? 0, d.vx ?? 1));
  if (d.shot === "syringe") {
    ctx.fillStyle = C.playerEdge;
    ctx.fillRect(-6, -2, 9, 4);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-5, -1, 7, 2);
    ctx.fillStyle = C.syringe;
    ctx.fillRect(-2, -1, 4, 2);
    ctx.fillStyle = "#9aa3b8";
    ctx.fillRect(-7, -2, 1, 4);
    ctx.fillRect(3, -0.5, 3, 1);
  } else if (d.shot === "needle") {
    ctx.strokeStyle = C.bandage;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-10, 1);
    ctx.quadraticCurveTo(-6, -1, -3, 0);
    glowStroke(ctx);
    ctx.fillStyle = "#e8ecf4";
    ctx.fillRect(-3, -0.5, 6, 1);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(3, -0.5, 1, 1);
  } else {
    ctx.fillStyle = C.playerEdge;
    ctx.fillRect(-3, -2, 6, 4);
    ctx.fillStyle = PILL_COLORS[d.id % 3]!;
    ctx.fillRect(-2, -1, 2, 2);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, -1, 2, 2);
  }
  ctx.restore();
}

/** 던진 가스통·구급 키트: 포물선 (바닥엔 그림자) */
function drawThrown(ctx: CanvasRenderingContext2D, d: Device, snap: Snap): void {
  const x = snap(d.x);
  const y = snap(d.y);
  const lift = Math.sin(Math.PI * (1 - (d.fly ?? 0) / FLY_TICKS)) * 14;
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fillRect(x - 2, y, 5, 2);
  const top = snap(d.y - lift);
  ctx.fillStyle = C.playerEdge;
  ctx.fillRect(x - 3, top - 3, 7, 6);
  if (d.kind === "gas") {
    ctx.fillStyle = "#9aa3b8";
    ctx.fillRect(x - 2, top - 2, 5, 4);
    ctx.fillStyle = C.gas;
    ctx.fillRect(x - 1, top - 1, 3, 2);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x - 2, top - 2, 5, 4);
    ctx.fillStyle = C.blood;
    ctx.fillRect(x, top - 2, 1, 4);
    ctx.fillRect(x - 2, top - 1, 5, 1);
  }
}

/** 구급차: 흰 차체·붉은 줄·붉은 십자·번갈아 깜빡이는 경광등과 불빛, 뒤로 먼지 (달리는 방향으로 돌림) */
function drawAmbulance(ctx: CanvasRenderingContext2D, d: Device, snap: Snap): void {
  const blink = Math.floor((AMB_TICKS - d.timer) / 4) % 2 === 0;
  ctx.save();
  ctx.translate(snap(d.x), snap(d.y));
  ctx.rotate(Math.atan2(d.vy ?? 0, d.vx ?? 1));
  ctx.fillStyle = "rgba(200, 190, 170, 0.35)";
  for (let i = 1; i <= 3; i++) ctx.fillRect(-9 - i * 4, -3 + ((i * 3) % 5) - 2, 3, 3);
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = blink ? "#ff4040" : "#4a8ae0";
  ctx.beginPath();
  ctx.arc(1, -6, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = C.playerEdge;
  ctx.fillRect(-9, -6, 18, 12);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-8, -5, 16, 10);
  ctx.fillStyle = C.syringe;
  ctx.fillRect(4, -4, 3, 8);
  ctx.fillStyle = C.blood;
  ctx.fillRect(-8, 3, 16, 1);
  ctx.fillRect(-4, -3, 2, 6);
  ctx.fillRect(-6, -1, 6, 2);
  ctx.fillStyle = blink ? "#ff4040" : "#4a8ae0";
  ctx.fillRect(0, -6, 2, 2);
  ctx.restore();
}
