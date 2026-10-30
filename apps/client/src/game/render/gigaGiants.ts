// 기간토마키아 뿔 거인 그리기: 흰 뿔 = 던전 거구 그림 그대로 · 푸른 뿔 = 묵인 모습 · 붉은 뿔 = 거인 모습 (빛깔을 입히고 뿔·기운을 꾸밈)
// 머리 위 난이도 표시(별·권장 레벨, 내 레벨과 견줘 초록·노랑·빨강) · 기술 예고(sim/gigaGiants의 u.sk): 돌 그림자 · 돌진 화살 · 레이저 조준선·빛 · 내려찍기 원
import { PW_GIGA, type PwUnit, type RunState } from "@pixel-rogue/shared";
import { drawCharacter } from "../sprites";

type Ctx = CanvasRenderingContext2D;
const K = PW_GIGA.skill;

/** 거인마다: 모습(캐릭터 그림) · 입힐 빛깔 · 진하기 · 뿔 · 기운 · 별 수 */
const LOOK: Record<string, { sheet: string | null; tint: string; alpha: number; horn: string; aura: string; stars: number }> = {
  giantWhite: { sheet: null, tint: "#ffffff", alpha: 0, horn: "#f4f4f8", aura: "rgba(240, 240, 255, 0.25)", stars: 1 },
  giantBlue: { sheet: "mukin", tint: "#3a7aff", alpha: 0.42, horn: "#6ab4ff", aura: "rgba(80, 150, 255, 0.35)", stars: 2 },
  giantRed: { sheet: "titan", tint: "#ff3a2a", alpha: 0.45, horn: "#ff6a3a", aura: "rgba(255, 80, 40, 0.4)", stars: 3 },
};

// 빛깔을 입힐 때 쓰는 작은 캔버스 (한 번만 만듦)
let off: HTMLCanvasElement | null = null;
function tinted(sheet: string, u: PwUnit, tick: number, tint: string, alpha: number): HTMLCanvasElement | null {
  off ??= document.createElement("canvas");
  off.width = off.height = 96;
  const oc = off.getContext("2d");
  if (!oc) return null;
  oc.imageSmoothingEnabled = false;
  const b = u.body;
  const moving = Math.abs(b.x - b.prevX) + Math.abs(b.y - b.prevY) > 0.05;
  if (!drawCharacter(oc, sheet, 48, 48, 10, { faceX: b.dirX < 0 ? -1 : 1, faceY: 0.2, moving, casting: !!u.sk && tick < u.sk.fire, step: Math.floor(tick / 8) })) return null;
  oc.globalCompositeOperation = "source-atop";
  oc.globalAlpha = alpha;
  oc.fillStyle = tint;
  oc.fillRect(0, 0, 96, 96);
  oc.globalAlpha = 1;
  oc.globalCompositeOperation = "source-over";
  return off;
}

/** 거인 몸 (푸른·붉은은 캐릭터 그림으로, 흰 뿔·그림이 없으면 plain) · 뿔 · 기운 */
export const isGiant = (u: PwUnit): boolean => !!LOOK[u.kind];

/** 그림 머리 위 (체력 줄·난이도 표시 자리): 묵인·거인 모습은 키가 커서 더 위 */
export const giantTop = (u: PwUnit): number => (LOOK[u.kind]?.sheet ? u.body.y - 38 * (u.body.r / 11) : u.body.y - u.body.r - 7);

export function drawGiant(ctx: Ctx, s: RunState, u: PwUnit, plain: () => void): void {
  const look = LOOK[u.kind]!;
  const b = u.body;
  // 발밑 기운 (숨 쉬듯)
  const pulse = 0.75 + 0.25 * Math.sin(s.tick / 12 + u.id);
  ctx.fillStyle = look.aura;
  ctx.beginPath();
  ctx.ellipse(b.x, b.y + b.r - 2, (b.r + 6) * pulse, ((b.r + 6) / 2.4) * pulse, 0, 0, Math.PI * 2);
  ctx.fill();
  let drawn = false;
  if (look.sheet) {
    const img = tinted(look.sheet, u, s.tick, b.hitFlash > 0 ? "#ffffff" : look.tint, b.hitFlash > 0 ? 0.7 : look.alpha);
    if (img) {
      const k = b.r / 11;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, Math.round(b.x - 48 * k), Math.round(b.y - 48 * k), Math.round(96 * k), Math.round(96 * k));
      drawn = true;
    }
  }
  if (!drawn) plain();
  // 뿔 둘 (붉은 뿔은 크고 끝이 빛남)
  const big = u.kind === "giantRed" ? 1.25 : 1;
  const top = drawn ? b.y - b.r * 1.35 : b.y - b.r * 0.9;
  ctx.fillStyle = look.horn;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(b.x + side * b.r * 0.3, top);
    ctx.lineTo(b.x + side * b.r * 0.8 * big, top - b.r * 0.8 * big);
    ctx.lineTo(b.x + side * b.r * 0.55, top + b.r * 0.12);
    ctx.fill();
    if (u.kind !== "giantWhite") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(Math.round(b.x + side * b.r * 0.8 * big) - 1, Math.round(top - b.r * 0.8 * big), 2, 2);
      ctx.fillStyle = look.horn;
    }
  }
  // 붉은 뿔: 몸에서 오르는 불티 · 푸른 뿔: 둘레를 도는 푸른 조각
  if (u.kind === "giantRed") {
    for (let n = 0; n < 4; n++) {
      const t = (s.tick + n * 17 + u.id * 5) % 60;
      ctx.fillStyle = n % 2 ? "#ffb040" : "#ff5a2a";
      ctx.fillRect(Math.round(b.x - b.r + ((n * 9 + u.id) % (b.r * 2))), Math.round(b.y + b.r - t * 0.6), 2, 2);
    }
  } else if (u.kind === "giantBlue") {
    for (let n = 0; n < 3; n++) {
      const a = s.tick / 20 + (n * Math.PI * 2) / 3;
      ctx.fillStyle = "#9ad0ff";
      ctx.fillRect(Math.round(b.x + Math.cos(a) * (b.r + 4)), Math.round(b.y + Math.sin(a) * (b.r / 2 + 2)), 2, 2);
    }
  }
}

/** 체력 줄 위: 별(어려움) · 권장 레벨 (내 레벨이 넘으면 초록, 조금 모자라면 노랑, 많이 모자라면 빨강) */
export function drawGiantTag(ctx: Ctx, s: RunState, u: PwUnit): void {
  const look = LOOK[u.kind]!;
  const b = u.body;
  const need = PW_GIGA.botLv[u.kind] ?? 1;
  const my = s.player.pwLv ?? 1;
  const col = my >= need ? "#6af06a" : my >= need - 3 ? "#ffd860" : "#ff5a5a";
  const text = `${"★".repeat(look.stars)} Lv.${need}`;
  const y = Math.round(giantTop(u) - 4);
  ctx.font = "bold 7px monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(10, 8, 16, 0.75)";
  ctx.fillRect(Math.round(b.x - text.length * 2.2) - 2, y - 7, Math.round(text.length * 4.4) + 4, 9);
  ctx.fillStyle = col;
  ctx.fillText(text, Math.round(b.x), y);
  ctx.textAlign = "start";
}

/** 기술 예고·효과 (사람 아래 바닥에) */
export function drawGiantSkill(ctx: Ctx, s: RunState, u: PwUnit): void {
  const sk = u.sk;
  if (!sk) return;
  const b = u.body;
  const t = s.tick;
  const wind = sk.fire > sk.at ? Math.min(1, (t - sk.at) / (sk.fire - sk.at)) : 1;
  ctx.save();
  if (sk.k === "rock") {
    // 떨어질 자리 그림자가 점점 짙어짐 · 날아가는 돌
    const k = Math.max(0, Math.min(1, (t - sk.fire) / (sk.end - sk.fire)));
    ctx.fillStyle = `rgba(20, 16, 30, ${0.2 + 0.4 * k})`;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.beginPath();
    ctx.arc(sk.tx, sk.ty, K.rock.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (t >= sk.fire) {
      const x = sk.x + (sk.tx - sk.x) * k;
      const y = sk.y + (sk.ty - sk.y) * k - Math.sin(k * Math.PI) * 40;
      ctx.fillStyle = "#8a8094";
      ctx.fillRect(Math.round(x) - 4, Math.round(y) - 4, 8, 8);
      ctx.fillStyle = "#c8c0d4";
      ctx.fillRect(Math.round(x) - 3, Math.round(y) - 3, 3, 3);
    }
  } else if (sk.k === "charge") {
    // 준비: 노린 곳까지 깜빡이는 푸른 화살 · 달리는 중: 뒤로 남는 잔상
    if (t < sk.fire) {
      ctx.strokeStyle = `rgba(90, 160, 255, ${0.35 + 0.4 * wind})`;
      ctx.lineWidth = 2 + wind * 4;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(sk.tx, sk.ty);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(90, 160, 255, 0.5)";
      ctx.beginPath();
      ctx.arc(sk.tx, sk.ty, K.charge.r * wind, 0, Math.PI * 2);
      ctx.fill();
    } else {
      for (let n = 1; n <= 3; n++) {
        ctx.fillStyle = `rgba(110, 180, 255, ${0.3 / n})`;
        ctx.beginPath();
        ctx.arc(b.x - (b.dirX > 0 ? 1 : -1) * n * 7, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (sk.k === "laser") {
    if (t < sk.fire) {
      // 조준선: 가늘게 깜빡이다 점점 굵어짐
      ctx.strokeStyle = `rgba(255, 60, 40, ${t % 8 < 4 ? 0.9 : 0.4})`;
      ctx.lineWidth = 1 + wind * 2;
      ctx.beginPath();
      ctx.moveTo(sk.x, sk.y);
      ctx.lineTo(sk.tx, sk.ty);
      ctx.stroke();
    } else {
      const fade = 1 - (t - sk.fire) / Math.max(1, sk.end - sk.fire);
      for (const [w, c] of [
        [K.laser.w * 2.4, `rgba(255, 60, 30, ${0.35 * fade})`],
        [K.laser.w * 1.4, `rgba(255, 140, 60, ${0.8 * fade})`],
        [K.laser.w * 0.5, `rgba(255, 245, 220, ${fade})`],
      ] as const) {
        ctx.strokeStyle = c;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.moveTo(sk.x, sk.y - 6);
        ctx.lineTo(sk.tx, sk.ty);
        ctx.stroke();
      }
    }
  } else if (sk.k === "quake") {
    // 붉은 원이 넓어지다가 찍는 순간 번쩍
    ctx.strokeStyle = "rgba(255, 70, 40, 0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(b.x, b.y, K.quake.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = t >= sk.fire ? "rgba(255, 200, 120, 0.55)" : `rgba(255, 60, 30, ${0.12 + 0.2 * wind})`;
    ctx.beginPath();
    ctx.arc(b.x, b.y, t >= sk.fire ? K.quake.r : K.quake.r * wind, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
