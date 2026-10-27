// 시즌 2 라스트 보스 검은 잔영과 거대한 짐승 셋 그리기: 땅속·하늘에 있을 때 숨기기 · 데스웜 솟기 · 전갈 움직이는 표시·몸 돌리기 · 매 경직·날아오르기 · 검은 잔영 말풍선
import { BOSS_ROC_RULES, BOSS_UMBRA_RULES, BOSS_WORM_RULES, wormBody, ENEMIES, UMBRA_BEASTS, UMBRA_WARD, type EnemyState, type RunState } from "@pixel-rogue/shared";
import { drawEnemySprite } from "../sprites";
import { C } from "./palette";

const BEASTS = new Set(["umbra", "sandworm", "scorpion", "roc"]);
const hidden = (e: EnemyState) => e.phase === "walk" || e.phase === "windup";

function tintOf(s: RunState, e: EnemyState): readonly [string, number] | undefined {
  if (e.hitFlash > 0) return [C.hit, 1];
  if (s.freezeTicks > 0 || (e.stunTicks ?? 0) > 0 || (e.kind === "roc" && e.phase === "act")) return [C.frozen, 0.4];
  return undefined;
}

/** 검은 잔영·짐승이면 그리고 true (그 밖의 적은 false) */
export function drawUmbraActor(ctx: CanvasRenderingContext2D, s: RunState, e: EnemyState, x: number, y: number): boolean {
  if (!BEASTS.has(e.kind)) return false;
  const frame = Math.floor(s.tick / 14);
  const tint = tintOf(s, e);
  if (e.kind === "umbra") {
    // 마지막 말을 하고 나면 서서히 사라짐
    const fade = e.step === UMBRA_BEASTS.length && e.phase === "walk" ? Math.max(0, e.timer / BOSS_UMBRA_RULES.VANISH) : 1;
    ctx.globalAlpha = (0.7 + 0.15 * Math.sin(s.tick / 20)) * fade;
    drawEnemySprite(ctx, "umbra", x, y + Math.sin(s.tick / 30) * 2, frame, false);
    ctx.globalAlpha = 1;
    return true;
  }
  if (e.kind === "sandworm") drawWorm(ctx, s, e, x, y, frame, tint);
  else if (e.kind === "scorpion") drawScorpion(ctx, s, e, x, y, frame, tint);
  else drawRoc(ctx, s, e, x, y, frame, tint);
  return true;
}

/** 데스웜: 땅속이면 안 보임 · 솟는 1초 동안 아래부터 드러남 · 그 뒤 긴 몸이 공중으로 날아 다른 땅에 박힘 · 필살기는 머리만 */
function drawWorm(ctx: CanvasRenderingContext2D, s: RunState, e: EnemyState, x: number, y: number, frame: number, tint?: readonly [string, number]): void {
  if (hidden(e)) return;
  if (e.ultAt !== undefined) return wormHead(ctx, x, y, frame, tint, 0);
  const t = e.aux ?? 0;
  const path = e.wormPath;
  if (t >= BOSS_WORM_RULES.RISE && path) return wormFlight(ctx, s, e, path, frame, tint);
  const rise = Math.min(1, t / BOSS_WORM_RULES.RISE);
  const size = e.r * 3.7;
  const base = y + size / 2;
  ctx.fillStyle = "rgba(60, 36, 16, 0.55)";
  ctx.beginPath();
  ctx.ellipse(x, base - 4, e.r * 1.3, e.r * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.rect(x - size, base - size * rise, size * 2, size * rise);
  ctx.clip();
  drawEnemySprite(ctx, "sandworm", x, y + size * (1 - rise), frame, e.dirX < 0, tint);
  ctx.restore();
}

/** 머리(이빨 입)만: 그림 아래쪽 몸통은 잘라 냄 · lift만큼 떠 있음 */
function wormHead(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, tint: readonly [string, number] | undefined, lift: number): void {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x - 60, y - lift - 40, 120, 67);
  ctx.clip();
  drawEnemySprite(ctx, "sandworm", x, y - lift + 18, frame, false, tint);
  ctx.restore();
}

/** 공중을 나는 긴 몸: 꼬리부터 마디를 그리고 머리는 맨 위 (솟은 자리·박힐 자리 사이 가운데가 가장 높음) */
function wormFlight(ctx: CanvasRenderingContext2D, s: RunState, e: EnemyState, path: number[], frame: number, tint?: readonly [string, number]): void {
  const [sx, sy, lx, ly, u] = path as [number, number, number, number, number];
  const len = Math.hypot(lx - sx, ly - sy) || 1;
  const height = (px: number, py: number) => Math.sin((Math.PI * Math.min(len, Math.hypot(px - sx, py - sy))) / len) * 22;
  const body = wormBody(path, 9);
  ctx.fillStyle = "rgba(40, 24, 10, 0.35)";
  for (const [bx, by] of body) ctx.fillRect(Math.round(bx - 8), Math.round(by - 2), 16, 5);
  body.forEach(([bx, by], i) => {
    const h = height(bx, by);
    ctx.fillStyle = i % 2 ? "#9a6a3a" : "#b8844c";
    ctx.beginPath();
    ctx.arc(bx, by - h, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#5a3818";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#e0b880";
    ctx.fillRect(Math.round(bx - 5), Math.round(by - h - 9), 6, 3);
  });
  // 솟은 자리·박힌 자리 모래 구멍
  ctx.fillStyle = "rgba(60, 36, 16, 0.6)";
  for (const [hx, hy] of [[sx, sy], [lx, ly]] as const) {
    ctx.beginPath();
    ctx.ellipse(hx, hy + 6, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (u <= len) wormHead(ctx, e.x, e.y, frame, tint, height(e.x, e.y) + 4 + Math.sin(s.tick / 6));
}

/** 전갈: 모래 밑을 기면 붉은 표시가 따라다님 · 나오면 바라보는 쪽으로 몸을 돌림 */
function drawScorpion(ctx: CanvasRenderingContext2D, s: RunState, e: EnemyState, x: number, y: number, frame: number, tint?: readonly [string, number]): void {
  if (e.phase === "windup") return;
  if (e.phase === "walk") {
    const pulse = 0.5 + 0.3 * Math.sin(s.tick / 6);
    ctx.fillStyle = `rgba(255, 70, 50, ${0.18 * pulse})`;
    ctx.strokeStyle = `rgba(255, 90, 70, ${pulse})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, e.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // 모래가 들썩임
    ctx.fillStyle = "rgba(200, 160, 100, 0.8)";
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + s.tick / 20;
      ctx.fillRect(Math.round(x + Math.cos(a) * e.r * 0.6), Math.round(y + Math.sin(a) * e.r * 0.6), 2, 1);
    }
    return;
  }
  // 필살기(검은 독액) 중: 검보라 기운
  if (e.ultAt !== undefined) {
    ctx.fillStyle = `rgba(40, 10, 60, ${0.35 + 0.15 * Math.sin(s.tick / 7)})`;
    ctx.beginPath();
    ctx.arc(x, y, e.r + 14, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.atan2(e.dirY, e.dirX));
  drawEnemySprite(ctx, "scorpion", 0, 0, e.phase === "charge" ? frame : 0, false, tint);
  ctx.restore();
  // 흰 보호막이 남아 있으면 몸 둘레에 흰 막
  if ((e.ward ?? 0) > 0) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.45 + 0.2 * Math.sin(s.tick / 8)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, e.r + 6, 0, Math.PI * 2);
    ctx.stroke();
  }
}

/** 매: 하늘에 있으면 안 보임 · 경직이면 땅에 떨어져 머리 위로 별 · 날아오르면 커지며 흐려짐 */
function drawRoc(ctx: CanvasRenderingContext2D, s: RunState, e: EnemyState, x: number, y: number, frame: number, tint?: readonly [string, number]): void {
  if (hidden(e)) return;
  if (e.phase === "blink") {
    const f = 1 - Math.max(0, e.timer) / BOSS_ROC_RULES.RISE;
    ctx.globalAlpha = 1 - f;
    drawEnemySprite(ctx, "roc", x, y - f * 30, frame, e.dirX < 0, tint, 1 + f * 0.5);
    ctx.globalAlpha = 1;
    return;
  }
  drawEnemySprite(ctx, "roc", x, y, 1, e.dirX < 0, tint);
  // 어지러운 별
  ctx.fillStyle = "#ffe066";
  for (let i = 0; i < 3; i++) {
    const a = s.tick / 10 + (i * Math.PI * 2) / 3;
    ctx.fillRect(Math.round(x + 18 + Math.cos(a) * 10), Math.round(y - e.r * 0.4 + Math.sin(a) * 4), 2, 2);
  }
}

/** 검은 잔영 대사 (말을 시작하고 약 2.5초): 큰 방이라 잔영이 화면 밖일 수 있어 체력 막대 바로 아래에 화면 고정 */
export function drawUmbraTalk(ctx: CanvasRenderingContext2D, s: RunState, scale: number, line?: (i: number) => string): void {
  if (!line) return;
  const e = s.enemies.find((o) => o.kind === "umbra");
  if (!e || e.say === undefined || e.sayAt === undefined || s.tick - e.sayAt > 160) return;
  const text = line(e.say);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = Math.min(1, (160 - (s.tick - e.sayAt)) / 20);
  ctx.font = `bold ${Math.round(9 * scale)}px sans-serif`;
  ctx.textAlign = "left";
  const face = 16 * scale;
  const w = ctx.measureText(text).width + face + 12 * scale;
  const h = 20 * scale;
  const bx = Math.round((ctx.canvas.width - w) / 2);
  const by = Math.round(ctx.canvas.height * 0.04 + 12 * scale);
  ctx.fillStyle = "rgba(10, 6, 16, 0.85)";
  ctx.fillRect(bx, by, w, h);
  ctx.strokeStyle = "#7a5aa8";
  ctx.lineWidth = Math.max(1, scale / 2);
  ctx.strokeRect(bx + 0.5, by + 0.5, w - 1, h - 1);
  ctx.imageSmoothingEnabled = false;
  drawEnemySprite(ctx, "umbra", bx + 4 * scale + face / 2, by + h / 2, 0, false, undefined, face / 40);
  ctx.fillStyle = "#e8d8ff";
  ctx.fillText(text, bx + face + 8 * scale, by + h / 2 + 3 * scale);
  ctx.globalAlpha = 1;
}

/** 체력 막대: 짐승마다 같은 길이로 띄워 셋 · 붉은 체력 뒤에 흰 보호막 (칸 = 최대 체력 + 흰 보호막) */
export function drawUmbraBar(ctx: CanvasRenderingContext2D, s: RunState, boss: EnemyState, bx: number, by: number, bw: number, bh: number): void {
  const mul = boss.maxHp / ENEMIES.umbra.hp;
  const summoned = (boss.step ?? -1) >= 0;
  const gap = Math.round(bw * 0.05);
  const w = Math.floor((bw - gap * (UMBRA_BEASTS.length - 1)) / UMBRA_BEASTS.length);
  UMBRA_BEASTS.forEach((kind, i) => {
    const x = bx + i * (w + gap);
    const max = ENEMIES[kind].hp * mul;
    const cap = max * (1 + (UMBRA_WARD[kind] ?? 0));
    // 부르기 전에는 가득, 쓰러졌으면 빈 칸
    const b = s.enemies.find((o) => o.kind === kind && o.hp > 0);
    const hp = summoned ? (b?.hp ?? 0) : max;
    const ward = summoned ? (b?.ward ?? 0) : max * (UMBRA_WARD[kind] ?? 0);
    const hw = Math.round((w * hp) / cap);
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(x - 2, by - 2, w + 4, bh + 4);
    ctx.fillStyle = C.bossCore;
    ctx.fillRect(x, by, hw, bh);
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(x + hw, by, Math.round((w * ward) / cap), bh);
  });
}
