// 레이븐 그리기: 바닥(왕국의 체스판 · 그랜드 체크메이트 방 가득 체스판) · 몸 위(왼쪽 퀸·오른쪽 킹 동행 · 움직이는 기물 · 체크 표식)
// 그림 sprites/ravenFx.png (192칸 4×2: 폰·나이트·비숍·룩 / 퀸·킹·금빛 폰·금빛 나이트, 기물은 칸 아래에 붙음) — scripts/art/raven.py
import { boardHalf, inBoard, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, RV_ATTACK, rvChecked, type RunState, type RvUnit } from "@pixel-rogue/shared";
import { img } from "./lunaticFx";
import { lerp, type Snap } from "./palette";
import { additive, alpha, beam, crescent, glow, ring, type Ctx } from "./pwFxBits";

export const RV = { gold: "#ffd040", pale: "#fff2b8", white: "#f4f2fa", black: "#1a1822", violet: "#b08aff" };
/** 효과 시트 칸 차례 */
export const PIECE = { pawn: 0, knight: 1, bishop: 2, rook: 3, queen: 4, king: 5, goldPawn: 6, goldKnight: 7 } as const;
/** 그랜드 체크메이트 기물 6종 (style 0~5) */
export const GRAND_PIECES = [PIECE.goldPawn, PIECE.goldKnight, PIECE.bishop, PIECE.rook, PIECE.queen, PIECE.king];
const FX = img("ravenFx");
const C = 192;
const ok = (im: HTMLImageElement) => im.complete && im.naturalWidth > 0;

/** 기물 하나 (발 자리 x, y · 키 h · 좌우 뒤집기) */
export function rvPiece(ctx: Ctx, kind: number, x: number, y: number, h: number, a = 1, flip = false): void {
  if (!ok(FX) || a <= 0 || h <= 0) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, a);
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(FX, (kind % 4) * C, Math.floor(kind / 4) * C, C, C, -h / 2, -h, h, h);
  ctx.restore();
}

/** 기물 + 금빛 아우라 + 발밑 그림자 */
export function rvPieceLit(ctx: Ctx, kind: number, x: number, y: number, h: number, a = 1, col = RV.gold, flip = false): void {
  ctx.fillStyle = `rgba(10, 8, 20, ${0.3 * a})`;
  ctx.beginPath();
  ctx.ellipse(x, y, h * 0.26, h * 0.07, 0, 0, Math.PI * 2);
  ctx.fill();
  additive(ctx, () => glow(ctx, x, y - h * 0.45, h * 0.6, col, 0.35 * a, 0.2));
  rvPiece(ctx, kind, x, y, h, a, flip);
}

/** 흑백 체스판 (가운데 cx, cy · 절반 h · 칸 수 n · 진하기 a) */
function board(ctx: Ctx, cx: number, cy: number, h: number, n: number, a: number, t: number): void {
  const cs = (h * 2) / n;
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      const dark = (i + j) % 2 === 1;
      ctx.fillStyle = dark ? `rgba(20, 16, 34, ${0.34 * a})` : `rgba(240, 236, 250, ${0.2 * a})`;
      ctx.fillRect(cx - h + i * cs, cy - h + j * cs, cs, cs);
    }
  // 금빛 테두리와 모서리 반짝임 (천천히 도는 빛)
  ctx.strokeStyle = alpha(RV.gold, 0.6 * a);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(cx - h, cy - h, h * 2, h * 2);
  additive(ctx, () => {
    const k = (t * 0.01) % 4;
    const side = Math.floor(k);
    const u = k - side;
    const pts: [number, number][] = [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]];
    const [a0, a1] = [pts[side]!, pts[(side + 1) % 4]!];
    glow(ctx, lerp(a0[0], a1[0], u), lerp(a0[1], a1[1], u), 10, RV.gold, 0.7 * a, 0.5);
    for (const [px, py] of pts) glow(ctx, px, py, 5, RV.pale, 0.5 * a);
  });
}

/** 바닥: 체스판 (몸을 따라옴) · 그랜드 체크메이트 동안 방 가득 체스판 */
export function drawRavenGround(ctx: Ctx, s: RunState, alpha_: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "chessRaven") return;
  const left = (p.rvGrandEnd ?? 0) - s.tick;
  if (left > 0) {
    const a = Math.min(1, left / 24, (184 - left) / 12);
    const [cx, cy] = [(ROOM_MIN_X + ROOM_MAX_X) / 2, (ROOM_MIN_Y + ROOM_MAX_Y) / 2];
    board(ctx, cx, cy, Math.max(ROOM_MAX_X - ROOM_MIN_X, ROOM_MAX_Y - ROOM_MIN_Y) / 2, 16, a * 1.2, s.tick);
  }
  if (!p.passives.includes("rvBoard" as never)) return;
  const x = snap(lerp(p.prevX, p.x, alpha_));
  const y = snap(lerp(p.prevY, p.y, alpha_));
  board(ctx, x, y, boardHalf(p), 8, 1, s.tick);
  // 판 위 적 발밑에 금빛 칸 표시 (받는 피해 증가)
  for (const e of s.enemies) if (e.hp > 0 && inBoard(p, e)) ring(ctx, snap(e.x), snap(e.y) + e.r * 0.6, e.r * 0.9, alpha(RV.gold, 0.45), 1);
}

/** 기물 하나 그리기 (폰·룩·검격·승격 폰·금빛 폰) */
function drawUnit(ctx: Ctx, u: RvUnit, x: number, y: number, t: number): void {
  if (u.kind === "blade") {
    const ang = Math.atan2(u.dy, u.dx);
    additive(ctx, () => {
      crescent(ctx, x - u.dx * 4, y - u.dy * 4, u.r * 1.4, ang, 0.9, 5, RV.gold, 0.9);
      beam(ctx, x - u.dx * 16, y - u.dy * 16, x, y, 2, RV.pale, 0.5);
    });
    return;
  }
  if (u.kind === "rook") {
    // 성벽 룩: 크게 · 뒤로 금빛 먼지 줄
    additive(ctx, () => {
      for (let i = 1; i <= 3; i++) beam(ctx, x - u.dx * (8 + i * 6) - u.dy * (i - 2) * 9, y - u.dy * (8 + i * 6) + u.dx * (i - 2) * 9, x - u.dy * (i - 2) * 9, y + u.dx * (i - 2) * 9, 1.5, RV.gold, 0.35);
    });
    rvPieceLit(ctx, PIECE.rook, x, y + u.r * 0.6, u.r * 2.4, 1, RV.violet);
    return;
  }
  const hop = Math.abs(Math.sin((u.age + u.x * 0.1) * 0.35)) * 3;
  if (u.kind === "promo") {
    // 승격 폰: 나아갈수록 금빛으로 밝아짐
    const k = Math.min(1, u.age / 50);
    additive(ctx, () => glow(ctx, x, y - 8, 10 + k * 16, RV.gold, 0.3 + k * 0.5, k));
    rvPiece(ctx, k > 0.5 ? PIECE.goldPawn : PIECE.pawn, x, y + 6 - hop, 18 + k * 6);
    if (Math.floor(t / 3) % 2 && k > 0.6) additive(ctx, () => ring(ctx, x, y - 8, 12 + k * 6, alpha(RV.pale, 0.6), 1));
    return;
  }
  rvPieceLit(ctx, u.kind === "gold" || u.kind === "pawn" ? PIECE.goldPawn : PIECE.pawn, x, y + 6 - hop, 17);
}

/** 킹·퀸 동행: 쉴 때는 몸 왼쪽(퀸)·오른쪽(킹)에 떠 있고, 공격한 쪽이 앞으로 나왔다 돌아감 */
function drawCourt(ctx: Ctx, s: RunState, x: number, y: number): void {
  const p = s.player;
  const since = s.tick - (p.rvAtkAt ?? -99);
  // 방금 공격한 쪽 (rvStep은 다음 차례라서 반대)
  const kingNow = (p.rvStep ?? 0) === 1;
  const out = since < 16 ? Math.sin((since / 16) * Math.PI) : 0;
  const side = RV_ATTACK.side;
  for (const [kind, sx, col] of [[PIECE.queen, -side, RV.pale], [PIECE.king, side, RV.violet]] as const) {
    const mine = (kind === PIECE.king) === kingNow;
    const f = mine ? out : 0;
    const bob = Math.sin(s.tick * 0.08 + sx) * 1.5;
    const px = lerp(x + sx, x + p.faceX * 24, f);
    const py = lerp(y - 2 + bob, y + p.faceY * 24 - 2 - f * 6, f);
    additive(ctx, () => glow(ctx, px, py - 9, 10 + f * 8, col, 0.3 + f * 0.4, 0.2));
    rvPiece(ctx, kind, px, py, 20 + f * 6, 1, sx < 0);
  }
}

/** 체크 표식: 적 머리 위 작은 금빛 왕관 (깜빡이다 끝날 때 빠르게) */
function checkMark(ctx: Ctx, x: number, y: number, t: number, left: number): void {
  if (left < 60 && Math.floor(t / 4) % 2) return;
  const b = Math.sin(t * 0.15) * 1;
  ctx.fillStyle = RV.gold;
  ctx.beginPath();
  ctx.moveTo(x - 5, y + b);
  ctx.lineTo(x - 5, y - 4 + b);
  ctx.lineTo(x - 2.5, y - 1.5 + b);
  ctx.lineTo(x, y - 5 + b);
  ctx.lineTo(x + 2.5, y - 1.5 + b);
  ctx.lineTo(x + 5, y - 4 + b);
  ctx.lineTo(x + 5, y + b);
  ctx.closePath();
  ctx.fill();
  additive(ctx, () => glow(ctx, x, y - 2 + b, 8, RV.gold, 0.5, 0.4));
}

/** 몸 위: 기물 · 킹·퀸 동행 · 체크 표식 */
export function drawRavenAir(ctx: Ctx, s: RunState, a: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "chessRaven") return;
  for (const u of p.rvUnits ?? []) drawUnit(ctx, u, snap(lerp(u.prevX, u.x, a)), snap(lerp(u.prevY, u.y, a)), s.tick);
  drawCourt(ctx, s, snap(lerp(p.prevX, p.x, a)), snap(lerp(p.prevY, p.y, a)));
  for (const e of s.enemies) if (e.hp > 0 && rvChecked(s, e)) checkMark(ctx, snap(e.x), snap(e.y) - e.r - 10, s.tick, (e.rvCheck ?? 0) - s.tick);
}
