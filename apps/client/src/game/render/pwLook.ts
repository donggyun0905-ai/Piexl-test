// 패왕전 편 구별 그리기: 캐릭터 그림 외곽선을 편 색으로 바꿔 그림(스킨 외곽선은 가림) · 편 색 · 가장 가까운 적(내 둘레 빨간 화살표 · 적 머리 위 조준 표시)
import { allPlayers, inBush, inPlay, PW, type CharacterId, type RunState } from "@pixel-rogue/shared";
import { drawCharacter, type CharacterPose } from "../sprites";
import { drawBody } from "./actors";

type Ctx = CanvasRenderingContext2D;

export const PW_ALLY = "#4aa8ff";
export const PW_FOE = "#ff3c3c";

/** 화면 주인 자리 (그리기 처음 drawPwGround에서 정함: 사람마다 자리를 바꿔 그려도 색은 화면 주인 기준) */
let viewer = 0;
export function setPwViewer(s: RunState): void {
  viewer = s.seat ?? 0;
}

/** 화면 주인과 같은 편이면 파랑, 아니면 빨강 (대난투·데스매치는 나 말고 모두 빨강) */
export function pwIsAlly(s: RunState, i: number): boolean {
  const seats = s.pvp!.seats;
  return seats[i]!.team === seats[viewer]?.team;
}
export const pwTint = (s: RunState, i: number) => (pwIsAlly(s, i) ? PW_ALLY : PW_FOE);

/** 화면 주인에게 보이는 정도: 0 안 보임(쓰러짐 · 수풀에 숨은 상대) · 0.5 수풀 속 나·내 편(반투명) · 1 보통 */
export function pwShown(s: RunState, i: number): number {
  if (!inPlay(s, i)) return 0;
  const ps = allPlayers(s);
  const p = ps[i]!;
  if (!inBush(s.pvp!.arena, p.x, p.y)) return 1;
  if (pwIsAlly(s, i)) return 0.5;
  // 상대는 내 편 누군가가 아주 가까이 있어야 보임 (AI가 보는 규칙과 같음)
  const near = ps.some((q, j) => pwIsAlly(s, j) && inPlay(s, j) && (q.x - p.x) ** 2 + (q.y - p.y) ** 2 <= PW.hideNear ** 2);
  return near ? 1 : 0;
}

/** 자리마다 캐릭터 그림 맨 위(발 기준 y에서 뺄 값). 체력 줄을 머리 위에 정확히 두려고 그림에서 잼 */
const heads = new Map<number, number>();
export const pwHead = (i: number, r: number): number => heads.get(i) ?? 31 - r;

/** 외곽선을 바꾼 그림 (그림 이름·자세·편 색마다 한 번 만들어 둠) */
const SIZE = 80;
const cache = new Map<string, { c: HTMLCanvasElement; top: number }>();

function outlined(sheet: string, id: CharacterId, r: number, pose: CharacterPose, club: string | null | undefined, color: string): { c: HTMLCanvasElement; top: number } | null {
  const side = Math.abs(pose.faceX) > Math.abs(pose.faceY);
  const key = `${sheet}|${club}|${r}|${side}|${pose.faceY < 0}|${pose.faceX < 0}|${pose.casting && pose.faceY > -0.5}|${pose.moving ? pose.step % 4 : 0}|${color}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = SIZE;
  c.height = SIZE;
  const o = c.getContext("2d", { willReadFrequently: true });
  if (!o) return null;
  // 그림을 아직 못 불러왔으면 만들지 않음 (다음에 다시)
  if (!drawCharacter(o, sheet, SIZE / 2, SIZE / 2, r, pose, club) && !drawCharacter(o, id, SIZE / 2, SIZE / 2, r, pose, club)) return null;
  const img = o.getImageData(0, 0, SIZE, SIZE);
  const d = img.data;
  const solid = (x: number, y: number) => x >= 0 && y >= 0 && x < SIZE && y < SIZE && d[(y * SIZE + x) * 4 + 3]! > 40;
  const cr = parseInt(color.slice(1, 3), 16);
  const cg = parseInt(color.slice(3, 5), 16);
  const cb = parseInt(color.slice(5, 7), 16);
  const ring: number[] = [];
  const edge: number[] = [];
  let top = SIZE;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (solid(x, y)) top = Math.min(top, y);
      const near = solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1);
      const open = !solid(x - 1, y) || !solid(x + 1, y) || !solid(x, y - 1) || !solid(x, y + 1);
      if (!solid(x, y)) {
        if (near) ring.push(y * SIZE + x);
      } else if (open) {
        // 그림 맨 바깥의 어두운 칸 = 스킨 외곽선 → 편 색으로 덮음
        const k = (y * SIZE + x) * 4;
        if (d[k]! * 0.3 + d[k + 1]! * 0.59 + d[k + 2]! * 0.11 < 90) edge.push(y * SIZE + x);
      }
    }
  }
  const paint = (list: number[], f: number) => {
    for (const p of list) {
      d[p * 4] = Math.round(cr * f);
      d[p * 4 + 1] = Math.round(cg * f);
      d[p * 4 + 2] = Math.round(cb * f);
      d[p * 4 + 3] = 255;
    }
  };
  paint(ring, 1);
  paint(edge, 0.7);
  o.putImageData(img, 0, 0);
  // 그림 맨 위(외곽선 한 칸 포함)가 몸 가운데에서 얼마나 위인지
  const out = { c, top: SIZE / 2 - top + 1 };
  cache.set(key, out);
  return out;
}

/** 패왕전 사람 몸: 편 색 외곽선 그림 (못 만들면 보통 그림) */
export function drawPwBody(ctx: Ctx, s: RunState, id: CharacterId, x: number, y: number, r: number, pose: CharacterPose, frame: number, sheet: string, club: string | null): void {
  const i = s.seat ?? 0;
  const o = outlined(sheet, id, r, pose, club, pwTint(s, i));
  // 수풀 속 나·내 편은 반투명
  const a = ctx.globalAlpha;
  ctx.globalAlpha = a * Math.max(0.5, pwShown(s, i));
  if (!o) drawBody(ctx, id, x, y, r, pose, frame, sheet, club);
  else {
    heads.set(i, o.top);
    ctx.drawImage(o.c, Math.round(x) - SIZE / 2, Math.round(y) - SIZE / 2);
  }
  ctx.globalAlpha = a;
}

/** 화면 주인에게서 가장 가까운 경기 중인 적 자리 (없으면 -1) */
export function pwNearestFoe(s: RunState, me: number): number {
  if (!inPlay(s, me)) return -1;
  const ps = allPlayers(s);
  const m = ps[me]!;
  let best = -1;
  let bestD = Infinity;
  ps.forEach((p, i) => {
    if (i === me || pwShown(s, i) === 0 || s.pvp!.seats[i]!.team === s.pvp!.seats[me]!.team) return;
    const dd = (p.x - m.x) ** 2 + (p.y - m.y) ** 2;
    if (dd < bestD) {
      bestD = dd;
      best = i;
    }
  });
  return best;
}

/** 내 둘레 빨간 화살표(가까운 적 쪽) + 그 적 머리 위 조준 표시 */
export function drawFoeCue(ctx: Ctx, s: RunState, at: (i: number) => { x: number; y: number; top: number }): void {
  const me = viewer;
  const foe = pwNearestFoe(s, me);
  if (foe < 0) return;
  const a = at(me);
  const b = at(foe);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy) || 1;
  const pulse = (Math.sin(s.tick / 5) + 1) / 2;
  // 가까울수록 진하고 크게
  const near = Math.max(0, Math.min(1, 1 - (dist - 40) / 260));
  const ux = dx / dist;
  const uy = dy / dist;
  const R = 16 + pulse * 2;
  const tx = a.x + ux * (R + 7);
  const ty = a.y + uy * (R + 7);
  const bx = a.x + ux * R;
  const by = a.y + uy * R;
  const w = 4 + near * 2;
  ctx.globalAlpha = 0.55 + near * 0.45;
  for (const [col, grow] of [["#1a0608", 1.5], [PW_FOE, 0]] as const) {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(tx + ux * grow, ty + uy * grow);
    ctx.lineTo(bx - uy * (w + grow) - ux * grow, by + ux * (w + grow) - uy * grow);
    ctx.lineTo(bx + uy * (w + grow) - ux * grow, by - ux * (w + grow) - uy * grow);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  // 적: 네 귀퉁이 조준 괄호 + 머리 위에서 통통 튀는 빨간 꺾쇠
  const k = 10 + (1 - pulse) * 3;
  ctx.strokeStyle = PW_FOE;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
    const cx = b.x + sx * k;
    const cy = b.y - 6 + sy * k;
    ctx.moveTo(cx, cy - sy * 4);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx - sx * 4, cy);
  }
  ctx.stroke();
  ctx.lineWidth = 1;
  const hy = b.top - 8 - pulse * 3;
  ctx.fillStyle = "#1a0608";
  ctx.beginPath();
  ctx.moveTo(b.x - 5, hy - 5);
  ctx.lineTo(b.x + 5, hy - 5);
  ctx.lineTo(b.x, hy + 1);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = PW_FOE;
  ctx.beginPath();
  ctx.moveTo(b.x - 3.5, hy - 4);
  ctx.lineTo(b.x + 3.5, hy - 4);
  ctx.lineTo(b.x, hy - 0.5);
  ctx.closePath();
  ctx.fill();
}
