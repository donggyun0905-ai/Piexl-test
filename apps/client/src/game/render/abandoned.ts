// 버려진 자들 그리기: 곁에서 싸우는 두 아이 · 교대·특수기 효과(연출 효과는 abandonedFx) · 왼쪽 위 조합 표(아이 그림 칸·탭·특수기 이름, 틀리면 ✕)
import { TAG_SETS, WEAPONS, type EffectState, type RunState, type TagSpecialKind, type WeaponDef } from "@pixel-rogue/shared";
import { additive, glow, shock } from "./pwFxBits";
import { sheetFor } from "../sprites";
import { drawBody } from "./actors";
import { hudScale } from "./imugiAura";
import { drawTagShowFx } from "./abandonedFx";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
/** 아이마다 색 (P1 초록 · P2 빨강 · P3 파랑) */
export const MEMBER_COLORS = ["#4ac86a", "#e8484a", "#4a8aff"] as const;

/** 곁에서 싸우는 두 아이 (발밑 그림자 · 뛰어오르면 높이 · 암살 특수기 중에는 검은 그림자로 흐릿하게) */
export function drawTagKids(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  for (const k of p.abKids ?? []) {
    const x = snap(lerp(k.prevX, k.x, alpha));
    const y = snap(lerp(k.prevY, k.y, alpha));
    const z = k.z ?? 0;
    const moving = Math.abs(k.x - k.prevX) + Math.abs(k.y - k.prevY) > 0.15;
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(x, y + 5, Math.max(2, 5 - z / 12), 2, 0, 0, Math.PI * 2);
    ctx.fill();
    const pose = { faceX: k.face, faceY: 0, moving, casting: k.swing > 0, step: Math.floor(s.tick / 7) };
    if (k.hide) {
      // 투명: 잔상 두 개 + 아주 흐린 몸 (어둠 빛깔)
      ctx.globalAlpha = 0.18;
      ctx.filter = "brightness(0.25) saturate(0)";
      drawBody(ctx, "abandoned", x - k.face * 3, y - z, p.r, pose, 0, sheetFor("abandoned", 1, k.m));
      ctx.globalAlpha = 0.32;
      drawBody(ctx, "abandoned", x, y - z, p.r, pose, 0, sheetFor("abandoned", 1, k.m));
      ctx.filter = "none";
      ctx.globalAlpha = 1;
      continue;
    }
    drawBody(ctx, "abandoned", x, y - z, p.r, pose, 0, sheetFor("abandoned", 1, k.m));
    // 발밑 아이 색 점 (누가 누구인지)
    ctx.fillStyle = MEMBER_COLORS[k.m]!;
    ctx.fillRect(x - 1, y + 6, 3, 1);
  }
}

/** 교대(들어온 아이 색 고리) · 특수기(세 색 고리 + 빛살)면 그리고 true */
export function drawTagFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (drawTagShowFx(ctx, fx, snap)) return true;
  const t = fx.ticks / fx.maxTicks;
  if (fx.kind === "tagSwap") {
    // 교대: 들어온 아이 색 빛 기둥 + 퍼지는 고리
    const c = MEMBER_COLORS[fx.dirX] ?? "#ffffff";
    additive(ctx, () => {
      glow(ctx, snap(fx.x), snap(fx.y), fx.size * 1.2, c, t, 1.2);
      shock(ctx, snap(fx.x), snap(fx.y), fx.size * (1.6 - t), c, t, 4);
    });
    return true;
  }
  if (fx.kind === "tagSpecial") {
    const x = snap(fx.x);
    const y = snap(fx.y);
    // 세 아이의 색 충격파 세 겹
    additive(ctx, () => {
      glow(ctx, x, y, fx.size, "#ffffff", t * 0.5, 1);
      MEMBER_COLORS.forEach((c, i) => shock(ctx, x, y, fx.size * (0.6 + i * 0.25) * (1.3 - t * 0.5), c, t * 0.9, 5));
    });
    ctx.globalAlpha = t;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + fx.ticks * 0.05;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * 6, y + Math.sin(a) * 6);
      ctx.lineTo(x + Math.cos(a) * fx.size * 1.2, y + Math.sin(a) * fx.size * 1.2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    return true;
  }
  return false;
}

/** 아이마다 무기 그림 (6×6): 방패 · 총 · 검 */
const KID_ICONS = [
  [".xxxx.", "xxxxxx", "xx..xx", "xxxxxx", ".xxxx.", "..xx.."],
  ["......", "xxxxx.", "xxxxxx", "..xx..", "..x...", "......"],
  ["....xx", "...xx.", "..xx..", "xxx...", ".x....", "x.x..."],
] as const;

function kidIcon(ctx: Ctx, m: number, x: number, y: number, color: string): void {
  ctx.fillStyle = color;
  KID_ICONS[m]!.forEach((row, r) => [...row].forEach((ch, c) => ch === "x" && ctx.fillRect(x + c, y + r, 1, 1)));
}

/**
 * 왼쪽 위 조합 표 (그림으로): 단계마다 한 줄 — [단계 번호] 아이 그림 칸(맞춘 칸은 그 아이 색으로 채움) ⇄ 탭 … ★ 특수기 이름.
 * 지금 단계는 테두리로 크게, 다음에 눌러야 할 칸(공격·탭)은 깜빡임. 틀리면 1단계 별 자리에 ✕
 * scale = 게임 1픽셀의 화면 픽셀 · special: 특수기 이름 (화면 언어)
 */
export function drawTagHud(ctx: Ctx, s: RunState, scale: number, special?: (kind: TagSpecialKind) => string): void {
  const p = s.player;
  const w: WeaponDef = WEAPONS[p.weaponId];
  if (p.characterId !== "abandoned" || !w.tag || s.over) return;
  const set = TAG_SETS[w.tag];
  if (!set) return;
  // 다른 왼쪽 위 글자보다 크게 (그림 칸이 잘 보이게)
  const k = hudScale(scale) * 1.5;
  ctx.setTransform(k, 0, 0, k, 0, 0);
  ctx.textBaseline = "middle";
  const now = p.abStage ?? 0;
  const at = p.abPos ?? 0;
  const blink = (s.tick >> 3) % 2 === 0;
  const step = [0, 0, 0];
  let y = s.party ? ((30 + 5 * s.party.length) * scale) / k : 10;
  set.stages.forEach((st, si) => {
    const cur = si === now;
    const h = cur ? 12 : 9;
    let x = 4;
    let pos = 0;
    // 줄 바탕 (지금 단계는 금빛 테두리)
    const width = 6 + st.reduce((a, n) => a + n * (cur ? 11 : 8), 0) + 2 * (cur ? 9 : 6) + (cur ? 60 : 12);
    ctx.globalAlpha = cur ? 0.85 : 0.5;
    ctx.fillStyle = "rgba(12,10,20,0.85)";
    ctx.fillRect(x - 2, y - h / 2 - 1, width, h + 2);
    if (cur) {
      ctx.strokeStyle = "#ffd84a";
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 1.5, y - h / 2 - 0.5, width - 1, h + 1);
    }
    ctx.globalAlpha = cur ? 1 : 0.55;
    ctx.font = "bold 6px monospace";
    ctx.fillStyle = cur ? "#ffd84a" : "#c8c8d8";
    ctx.fillText(`${si + 1}`, x, y + 0.5);
    x += 6;
    st.forEach((n, m) => {
      if (m > 0) {
        // 탭: 화살표 두 개 (다음이 탭이면 깜빡)
        const next = cur && at === pos;
        const done = cur && at > pos;
        ctx.fillStyle = next && blink ? "#ffd84a" : done ? "#fff" : "#8a8498";
        ctx.font = `bold ${cur ? 8 : 6}px monospace`;
        ctx.fillText("⇄", x, y + 0.5);
        x += cur ? 9 : 6;
        pos++;
      }
      const color = MEMBER_COLORS[m]!;
      for (let i = 0; i < n; i++) {
        step[m]!++;
        const size = cur ? 10 : 7;
        const done = cur && at > pos;
        const next = cur && at === pos;
        ctx.fillStyle = done ? color : "rgba(30,26,40,0.95)";
        ctx.fillRect(x, y - size / 2, size, size);
        ctx.strokeStyle = next && blink ? "#fff" : color;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y - size / 2 + 0.5, size - 1, size - 1);
        if (cur) kidIcon(ctx, m, x + 2, y - 3, done ? "#10101a" : color);
        x += size + 1;
        pos++;
      }
    });
    // 끝: 특수기 (★ + 이름, 틀리면 ✕)
    const missed = si === 0 && (p.abMiss ?? 0) > 0;
    ctx.font = `bold ${cur ? 8 : 6}px monospace`;
    ctx.fillStyle = missed ? "#ff5a5a" : cur && p.abDone ? "#fff4a0" : "#ffd84a";
    ctx.fillText(missed ? "✕" : "★", x + 1, y + 0.5);
    if (cur && special) {
      ctx.font = "bold 6px sans-serif";
      ctx.fillStyle = "#ffe8a0";
      ctx.fillText(special(set.specials[si]!.kind), x + 10, y + 0.5);
    }
    y += h + 3;
  });
  ctx.globalAlpha = 1;
}
