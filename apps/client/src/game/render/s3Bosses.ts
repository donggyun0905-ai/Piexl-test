// 시즌 3 단계별 보스 그리기 (sim/bossGatekeeper·bossTwins·bossMoonEater, 그림 scripts/art/s3_bosses):
// 몸(문·임프·달 조각·쓰러진 쌍둥이·문 속 수문장) · 바닥(부서진 문·달빛 기둥·핏줄·피 구슬) · 어둠과 월식 · 그림자 손 · 체력 막대(쌍둥이 둘·천장의 달)
import { BOSS_MOON_EATER_RULES as ME, BOSS_TWINS_RULES as TW, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, type EffectState, type EnemyState, type RunState } from "@pixel-rogue/shared";
import { drawEnemySprite } from "../enemySprites";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
const at = (e: EnemyState, a: number, snap: Snap): [number, number] => [snap(lerp(e.prevX, e.x, a)), snap(lerp(e.prevY, e.y, a))];
const bossOf = (s: RunState, kind: string) => s.enemies.find((e) => e.kind === kind && e.hp > 0);

/** 몸 대신 그림 (그렸으면 true): 지옥문 · 임프 · 달 조각 · 쓰러진 쌍둥이 · 문 속에 들어간 수문장 */
export function drawS3Actor(ctx: Ctx, s: RunState, e: EnemyState, x: number, y: number): boolean {
  if (e.kind === "hellgate") {
    const pulse = 0.5 + 0.5 * Math.sin(s.tick * 0.08 + e.id);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = `rgba(255, 40, 30, ${0.12 + 0.12 * pulse})`;
    ctx.beginPath();
    ctx.ellipse(x, y + 2, 16, 8, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
    drawEnemySprite(ctx, "hellgate", x, y - 8, 1, false, e.hitFlash > 0 ? ["#ffffff", 0.8] : undefined);
    return true;
  }
  if (e.kind === "imp") {
    const f = (e.fire ? 2 : 0) + (Math.floor(s.tick / 10) % 2);
    const blink = e.phase === "windup" && Math.floor(s.tick / 3) % 2 === 0;
    drawEnemySprite(ctx, "imp", x, y - 4, f, e.dirX < 0 || x > s.player.x, e.hitFlash > 0 || blink ? ["#ffffff", 0.8] : undefined);
    return true;
  }
  if (e.kind === "moonshard") {
    const bob = Math.sin(s.tick * 0.06 + e.id) * 1.5;
    drawEnemySprite(ctx, "moonaltar", x, y - 10 + bob, 0, false, e.hitFlash > 0 ? ["#ffffff", 0.8] : undefined, 0.6);
    return true;
  }
  // 문 속의 수문장: 안 보임 (나올 문에 예고 원)
  if (e.kind === "gatekeeper" && e.phase === "blink" && e.immune) return true;
  if ((e.kind === "twinlu" || e.kind === "twinre") && (e.twDown ?? 0) > 0) {
    // 쓰러진 쌍둥이: 흐리게 누운 몸 + 다시 일어나기까지 붉은 시계
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 2);
    drawEnemySprite(ctx, e.kind, 0, 0, 0, false, ["#300008", 0.4]);
    ctx.restore();
    const k = (e.twDown ?? 0) / (s.party && s.party.length > 1 ? TW.REVIVE_PARTY : TW.REVIVE);
    ctx.strokeStyle = "rgba(0,0,0,0.6)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y - 16, 5, 0, TAU);
    ctx.stroke();
    ctx.strokeStyle = "#ff3a4a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y - 16, 5, -Math.PI / 2, -Math.PI / 2 + TAU * k);
    ctx.stroke();
    return true;
  }
  return false;
}

/** 꿈틀거리는 붉은 핏줄 */
function vein(ctx: Ctx, ax: number, ay: number, bx: number, by: number, t: number): void {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const n = Math.max(4, Math.round(len / 8));
  for (const [w, c] of [
    [4, "rgba(120, 0, 16, 0.55)"],
    [2, "#e0203a"],
    [1, "#ff9aa4"],
  ] as const) {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const k = i / n;
      const wob = Math.sin(k * 9 + t * 0.15) * 1.6 * Math.sin(k * Math.PI);
      const px = ax + dx * k + nx * wob;
      const py = ay + dy * k + ny * wob;
      if (i) ctx.lineTo(px, py);
      else ctx.moveTo(px, py);
    }
    ctx.stroke();
  }
}

/** 바닥 (적보다 먼저): 부서진 지옥문 · 달빛 기둥 · 쌍둥이 핏줄과 피 구슬 */
export function drawS3Ground(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const gk = s.enemies.find((e) => e.kind === "gatekeeper");
  for (const g of gk?.gkGates ?? []) if (!s.enemies.some((x) => x.id === g.id && x.hp > 0)) drawEnemySprite(ctx, "hellgate", snap(g.x), snap(g.y) - 8, 2, false);
  const me = s.enemies.find((e) => e.kind === "mooneater");
  for (const c of me?.mePillars ?? []) {
    const fade = Math.min(1, c.t / 30);
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = "rgba(150, 170, 255, 0.18)";
    ctx.beginPath();
    ctx.ellipse(snap(c.x), snap(c.y), ME.PILLAR_R, ME.PILLAR_R * 0.55, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "rgba(200, 215, 255, 0.7)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
    drawEnemySprite(ctx, "moonaltar", snap(c.x), snap(c.y) - 18, 1, false);
    ctx.restore();
  }
  const lu = s.enemies.find((e) => e.kind === "twinlu" && e.hp > 0);
  const re = lu && s.enemies.find((e) => e.id === lu.twLink && e.hp > 0);
  if (lu && re && !(lu.twDown ?? 0) && !(re.twDown ?? 0)) {
    const [ax, ay] = at(lu, a, snap);
    const [bx, by] = at(re, a, snap);
    vein(ctx, ax, ay - 4, bx, by - 4, s.tick);
    // 체력 합 절반 아래: 방 가운데 고정점에서 레로
    if ((lu.hp + re.hp) * 2 < lu.maxHp + re.maxHp) {
      const mx = snap((ROOM_MIN_X + ROOM_MAX_X) / 2);
      const my = snap((ROOM_MIN_Y + ROOM_MAX_Y) / 2);
      vein(ctx, mx, my, bx, by - 4, s.tick + 20);
      ctx.fillStyle = "#e0203a";
      ctx.beginPath();
      ctx.arc(mx, my, 3, 0, TAU);
      ctx.fill();
    }
  }
  for (const o of re?.twOrbs ?? []) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = "rgba(255, 40, 60, 0.35)";
    ctx.beginPath();
    ctx.arc(snap(o.x), snap(o.y), 6, 0, TAU);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#c0102a";
    ctx.beginPath();
    ctx.arc(snap(o.x), snap(o.y), 3, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#ffb0b8";
    ctx.fillRect(snap(o.x) - 1, snap(o.y) - 2, 1, 1);
  }
}

/** 그림자 손 (위험 표시가 터질 때): 솟기 → 다 솟음 → 흩어짐 */
export function drawS3Fx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (fx.kind !== "shadowHand") return false;
  const t = fx.ticks / fx.maxTicks;
  drawEnemySprite(ctx, "shadowhand", snap(fx.x), snap(fx.y) - 12, t < 0.3 ? 0 : t < 0.7 ? 1 : 2, false, undefined, 0.9);
  return true;
}

let dark: HTMLCanvasElement | null = null;
/** 어둠 (달을 삼키는 자 방): 사람·기둥·조각 둘레만 밝음 · 월식 예고 중엔 붉게 */
export function drawS3Dark(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const me = bossOf(s, "mooneater");
  if (!me?.meDark) return;
  const cv = ctx.canvas;
  dark ??= document.createElement("canvas");
  if (dark.width !== cv.width || dark.height !== cv.height) [dark.width, dark.height] = [cv.width, cv.height];
  const d = dark.getContext("2d")!;
  d.setTransform(1, 0, 0, 1, 0, 0);
  d.clearRect(0, 0, dark.width, dark.height);
  d.setTransform(ctx.getTransform());
  const eclipse = me.phase === "act";
  d.fillStyle = eclipse ? "rgba(40, 0, 6, 0.82)" : "rgba(4, 2, 12, 0.78)";
  d.fillRect(-2000, -2000, 6000, 6000);
  d.globalCompositeOperation = "destination-out";
  const hole = (x: number, y: number, r: number) => {
    const g = d.createRadialGradient(x, y, r * 0.35, x, y, r);
    g.addColorStop(0, "rgba(0,0,0,1)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    d.fillStyle = g;
    d.fillRect(x - r, y - r, r * 2, r * 2);
  };
  const people = s.party ? s.party.map((seat, i) => (i === (s.seat ?? 0) ? s.player : seat.player)) : [s.player];
  for (const p of people) if (p.hp > 0) hole(snap(lerp(p.prevX, p.x, a)), snap(lerp(p.prevY, p.y, a)), 48);
  for (const c of me.mePillars ?? []) hole(snap(c.x), snap(c.y), ME.PILLAR_R * 1.8);
  for (const e of s.enemies) if (e.kind === "moonshard" && e.hp > 0) hole(snap(e.x), snap(e.y), 18);
  d.globalCompositeOperation = "source-over";
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(dark, 0, 0);
  ctx.restore();
  // 보스 가슴의 달 (어둠 속에서도 보임)
  const [bx, by] = at(me, a, snap);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = `rgba(190, 170, 255, ${0.25 + 0.2 * Math.sin(s.tick * 0.1)})`;
  ctx.beginPath();
  ctx.arc(bx, by - me.r, 5, 0, TAU);
  ctx.fill();
  ctx.restore();
}

/** 체력 막대 자리 (화면 좌표): 쌍둥이는 둘로 나눔 · 달을 삼키는 자는 아래에 천장의 달. 다 그렸으면 true */
export function drawS3Bar(ctx: Ctx, s: RunState, boss: EnemyState, bx: number, by: number, bw: number, bh: number): boolean {
  if (boss.kind === "mooneater") {
    const moon = boss.meMoon ?? 0;
    const f = boss.phase === "act" ? 4 : Math.min(3, Math.floor(moon * 4));
    const size = Math.max(28, Math.round(bh * 7));
    drawEnemySprite(ctx, "moonphase", bx + bw / 2, by + bh + size / 2 + 2, f, false, undefined, size / 40);
    return false;
  }
  if (boss.kind !== "twinlu" && boss.kind !== "twinre") return false;
  const lu = boss.kind === "twinlu" ? boss : s.enemies.find((e) => e.id === boss.twLink);
  const re = lu && s.enemies.find((e) => e.id === lu.twLink);
  const half = Math.floor((bw - 6) / 2);
  [lu, re].forEach((t, i) => {
    const x = bx + i * (half + 6);
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(x - 2, by - 2, half + 4, bh + 4);
    if (!t) return;
    const down = (t.twDown ?? 0) > 0;
    ctx.fillStyle = down ? "#5a2030" : i ? "#9a1830" : "#f0e6e0";
    ctx.fillRect(x, by, Math.round((half * Math.max(0, down ? 1 - (t.twDown ?? 0) / TW.REVIVE : t.hp / t.maxHp)) * (down ? TW.REVIVE_HP : 1)), bh);
  });
  return true;
}

