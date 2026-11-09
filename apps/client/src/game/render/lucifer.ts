// 레이드 보스 루시퍼 몸·체력 막대 그리기 (sim/lucifer·lucPillars·lucDark, 그림 render/lucArt)
// 몸: 1페이즈 여성형 · 2페이즈 남성형 (기본 공격마다 공격 모션 칸) · 석화의 기둥 · 악마의 불길 · 어둠의 세계 몬스터(빨려 간 사람에게만)
// 체력 막대: 페이즈마다 줄 ×99 (줄마다 색) · 보호막(흰 막대) · 페이즈 이름
import { allPlayers, LUC_GUARD_PCT, LUC_RULES, lucGuarded, lucLines, swordGlow, type EnemyState, type RunState } from "@pixel-rogue/shared";
import { detectLang } from "../../i18n";
import { TEXT } from "../../i18n/text";
import { lucBody, lucFx, lucProp } from "./lucArt";
import { drawChest } from "./raidReward";
import { additive, glow } from "./pwFxBits";
import { hitPop } from "./bodyMotion";

type Ctx = CanvasRenderingContext2D;
/** 크게 (맵이 크니 다 크게 · 기둥·절망의 검은 루시퍼보다 크게, 2026-11-09 사용자 요청): 루시퍼 높이 · 기둥·검 높이 · 불길 너비 */
const BODY_H = 220;
const PILLAR_H = 260;
const FLAME_W = 64;
/** 줄 색 돌림 (보라부터) */
const LINE_COLORS = ["#a040ff", "#c040e0", "#ff40a0", "#ff6040", "#ffb030", "#e0e040", "#60d060", "#30c0c0", "#4080ff", "#6050f0"];
/** 절망의 검 패턴 색 (sim/lucSwords 차례): 붉은 사슬 · 얼음 · 금빛 검 · 불꽃 · 가시 덩굴 · 어둠의 손 */
export const SWORD_COLORS = ["#ff3040", "#40a0ff", "#ffd040", "#ff7020", "#40d060", "#8a30ff"];
const lineColor = (n: number) => LINE_COLORS[(((99 - n) % LINE_COLORS.length) + LINE_COLORS.length) % LINE_COLORS.length]!;

/** 몸 대신 그림 (그렸으면 true · 남의 어둠의 세계 몬스터는 그리지 않음) · 맞으면 흔들리고 부풀며 하얗게 번쩍 (타격감) · 기둥·검·몬스터는 머리 위 체력 줄 */
export function drawLucActor(ctx: Ctx, s: RunState, e: EnemyState, x: number, y: number): boolean {
  if (!LUC_KINDS.has(e.kind)) return false;
  if (e.kind === "lucshade" && e.count !== (s.seat ?? 0)) return true;
  const hf = Math.max(0, e.hitFlash);
  const boss = e.kind === "lucifer";
  const pop = hitPop(boss ? hf * 0.5 : hf * 2);
  const jx = hf > 0 ? (hf % 2 ? 1 : -1) * hf * (boss ? 0.25 : 0.5) : 0;
  ctx.save();
  ctx.translate(x + jx, y);
  ctx.scale(pop, 2 - pop);
  ctx.translate(-x, -y);
  const drawn = drawLucBody(ctx, s, e, x, y);
  // 하얀 번쩍 (같은 그림을 더하기로 한 번 더)
  if (drawn && hf > 0 && e.kind !== "lucifer") {
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = Math.min(1, hf / 6) * 0.55;
    drawLucBody(ctx, s, e, x, y);
  }
  ctx.restore();
  if (drawn && hf >= 5) additive(ctx, () => glow(ctx, x, y - (e.kind === "lucifer" ? 60 : e.kind === "lucflame" ? 10 : 80), e.kind === "lucflame" ? 26 : 70, "#ffffff", 0.35, 0.5));
  if (drawn) drawFoeBar(ctx, s, e, x, y);
  return drawn;
}

const LUC_KINDS = new Set<string>(["lucifer", "lucchest", "lucpillar", "lucsword", "lucflame", "lucshade"]);

/** 기둥·검·몬스터 머리 위 체력 줄 (화면을 줄여 보니 두껍게) · 체력 숫자 */
function drawFoeBar(ctx: Ctx, s: RunState, e: EnemyState, x: number, y: number): void {
  if (e.kind === "lucifer" || e.kind === "lucchest" || e.hp <= 0) return;
  const big = e.kind === "lucpillar" || e.kind === "lucsword";
  const w = big ? 96 : 36;
  const h = big ? 8 : 5;
  const top = big ? y + 18 - PILLAR_H - 14 : y - 40;
  const k = Math.max(0, Math.min(1, e.hp / e.maxHp));
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(x - w / 2 - 2, top - 2, w + 4, h + 4);
  ctx.fillStyle = "#3a1020";
  ctx.fillRect(x - w / 2, top, w, h);
  ctx.fillStyle = e.kind === "lucsword" ? "#c070ff" : big ? "#e0c8ff" : "#ff5a6a";
  ctx.fillRect(x - w / 2, top, Math.max(1, Math.round(w * k)), h);
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.fillRect(x - w / 2, top, Math.round(w * k), 1);
  if (!big) return;
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#000";
  const n = `${Math.ceil(e.hp)} / ${e.maxHp}`;
  ctx.strokeText(n, x, top - 3);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(n, x, top - 3);
  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
  void s;
}

function drawLucBody(ctx: Ctx, s: RunState, e: EnemyState, x: number, y: number): boolean {
  if (e.kind === "lucifer") return drawBoss(ctx, s, e, x, y);
  if (e.kind === "lucchest") {
    drawChest(ctx, s, e, x, y);
    return true;
  }
  if (e.kind === "lucpillar") {
    const bob = Math.sin(s.tick * 0.04 + e.id) * 3;
    additive(ctx, () => glow(ctx, x, y - PILLAR_H * 0.4, 100, "#a050ff", 0.35 + 0.15 * Math.sin(s.tick * 0.07), 0.5));
    if (!lucProp(ctx, "pillar.png", x, y + 18 + bob, PILLAR_H, e.hitFlash > 0 ? 0.7 : 1)) return false;
    return true;
  }
  if (e.kind === "lucsword") {
    // 절망의 검: 빛나는 패턴 색으로 둘레가 밝아짐
    const f = s.raidBoss?.fight;
    const pat = f ? swordGlow(s, f, e.id) : -1;
    const bob = Math.sin(s.tick * 0.05 + e.id) * 4;
    additive(ctx, () => glow(ctx, x, y - PILLAR_H * 0.45, pat >= 0 ? 140 : 90, pat >= 0 ? SWORD_COLORS[pat]! : "#c090ff", pat >= 0 ? 0.6 + 0.3 * Math.sin(s.tick * 0.4) : 0.3, 0.6));
    return lucProp(ctx, "sword.png", x, y + 16 + bob, PILLAR_H, e.hitFlash > 0 ? 0.7 : 1);
  }
  if (e.kind === "lucflame") {
    lucFx(ctx, 1, 4, 2 + (Math.floor(s.tick / 10) % 2), x, y - 14, FLAME_W, e.hitFlash > 0 ? 1 : 0.9);
    return true;
  }
  if (e.kind === "lucshade") {
    ctx.fillStyle = "rgba(20, 0, 30, 0.85)";
    ctx.beginPath();
    ctx.arc(x, y, e.r + 2, 0, Math.PI * 2);
    ctx.fill();
    lucFx(ctx, 1, 4, 1, x, y - 6, 34, 0.8);
    return true;
  }
  return false;
}

function drawBoss(ctx: Ctx, s: RunState, e: EnemyState, x: number, y: number): boolean {
  const f = s.raidBoss?.fight;
  // 낙하 검 동안은 사라짐
  if (f?.p2 === "rain") return true;
  const p2 = f?.phase === 2;
  const pose = f && f.poseEnd > s.tick ? f.pose : 0;
  const bob = Math.sin(s.tick * 0.05) * 4;
  const stunned = (f?.stunEnd ?? 0) > s.tick;
  // 바닥 마법진 · 그림자
  lucFx(ctx, 0, 0, 3, x, y + 30, 150, 0.35 + 0.1 * Math.sin(s.tick * 0.05));
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.beginPath();
  ctx.ellipse(x, y + 36, 60, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  // 2페이즈는 가장 가까운 사람 쪽을 봄
  const flip = p2 && allPlayers(s).some((p) => p.hp > 0) && nearestX(s, e) < e.x;
  if (!lucBody(ctx, p2 ? "p2.png" : "p1.png", pose, x, y + 40 + bob, BODY_H, flip, stunned ? 0.75 : 1)) return false;
  if (e.hitFlash > 0) additive(ctx, () => glow(ctx, x, y - 50, 70, "#ffffff", 0.25, 0.6));
  // 보호막: 흰 빛 + 몸을 감싸는 빛 방울(육각 무늬 테두리) · 기둥·검이 남아 있으면 피해 감소 표시(푸른 고리)
  if ((e.ward ?? 0) > 0) {
    additive(ctx, () => glow(ctx, x, y - 60, 130, "#e8e0ff", 0.3 + 0.1 * Math.sin(s.tick * 0.1), 0.7));
    ctx.strokeStyle = `rgba(230, 220, 255, ${0.55 + 0.25 * Math.sin(s.tick * 0.12)})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(x, y - 60, 92, 118, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([10, 8]);
    ctx.lineDashOffset = -s.tick * 0.6;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(x, y - 60, 100, 126, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  if (lucGuarded(s)) {
    ctx.strokeStyle = `rgba(120, 200, 255, ${0.35 + 0.2 * Math.sin(s.tick * 0.08)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y + 34, 80, 22, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  // 기절: 머리 위 별
  if (stunned) for (let k = 0; k < 3; k++) lucFx(ctx, 0, 2, 0, x + Math.cos(s.tick * 0.08 + k * 2.1) * 30, y - BODY_H * 0.75, 26, 0.9);
  return true;
}

const nearestX = (s: RunState, e: EnemyState) => {
  let best = e.x;
  let bd = Infinity;
  for (const p of allPlayers(s)) {
    const d = (p.x - e.x) ** 2 + (p.y - e.y) ** 2;
    if (p.hp > 0 && d < bd) [bd, best] = [d, p.x];
  }
  return best;
};

function say(key: keyof typeof TEXT): string {
  return TEXT[key][detectLang()];
}

/** 체력 막대 (화면 좌표) · 그렸으면 true */
export function drawLucBar(ctx: Ctx, s: RunState, boss: EnemyState, bx: number, by: number, bw: number, bh: number): boolean {
  if (boss.kind !== "lucifer") return false;
  const f = s.raidBoss?.fight;
  const phase = f?.phase ?? 1;
  const lines = lucLines(boss.hp, phase);
  const line = LUC_RULES.PHASE_HP / LUC_RULES.LINES;
  const base = phase === 1 ? LUC_RULES.PHASE_HP : 0;
  const left = lines <= 0 ? 0 : (boss.hp - base - (lines - 1) * line) / line;
  ctx.fillStyle = "rgba(0,0,0,0.75)";
  ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);
  ctx.fillStyle = lines > 1 ? lineColor(lines - 1) : "#100816";
  ctx.fillRect(bx, by, bw, bh);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  if (lines > 1) ctx.fillRect(bx, by, bw, bh);
  ctx.fillStyle = boss.immune ? "#e8e0f0" : lineColor(lines);
  ctx.fillRect(bx, by, Math.round(bw * Math.max(0, Math.min(1, left))), bh);
  // 보호막 (흰 막대, 10000 기준)
  const ward = Math.min(1, (boss.ward ?? 0) / LUC_RULES.SHIELD);
  if (ward > 0) {
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillRect(bx, by + bh - Math.max(2, Math.round(bh * 0.35)), Math.round(bw * ward), Math.max(2, Math.round(bh * 0.35)));
  }
  const size = Math.max(9, Math.round(bh * 1.8));
  ctx.font = `bold ${size}px monospace`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#000";
  const n = `×${lines}`;
  ctx.strokeText(n, bx + bw + 6, by + bh / 2);
  ctx.fillStyle = lineColor(lines);
  ctx.fillText(n, bx + bw + 6, by + bh / 2);
  const pillars = s.enemies.filter((e) => e.kind === "lucpillar" && e.hp > 0).length;
  const label = `${say(phase === 1 ? "lucPhase1" : "lucPhase2")}${phase === 1 && pillars > 0 ? ` · ${say("lucPillarsLeft").replace("{n}", String(pillars))}` : ""}${ward > 0 ? ` · ${say("lucShield")} ${Math.ceil(boss.ward ?? 0)}` : ""}${lucGuarded(s) ? ` · ${say("lucGuard").replace("{n}", String(LUC_GUARD_PCT()))}` : ""}`;
  ctx.font = `bold ${Math.max(8, Math.round(bh * 1.4))}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.strokeText(label, bx + bw / 2, by + bh + 4);
  ctx.fillStyle = "#e0c8ff";
  ctx.fillText(label, bx + bw / 2, by + bh + 4);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  return true;
}
