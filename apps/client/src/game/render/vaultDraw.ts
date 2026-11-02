// 비밀의 방 그림 (sim/vault·devil·gamble): 금 간 벽(금 → 무너짐 → 어두운 문) · 악마의 방(바닥 마법진·촛불·사탄의 석상·거래 받침)
// · 도박꾼의 방(초록 탁자·상자 셋이 섞임·도박꾼). 경매장은 render/auctionDraw, 효과는 render/vaultFx
import { crackHere, crackSpot, cupState, CUP_GAP, cupY, devilCost, gambleDone, gambleNow, gamblerY, offerY, SECRET_WALL, statueY, type DevilId, type Pickup, type RunState } from "@pixel-rogue/shared";
import { iconCanvas, type IconItem } from "../iconArt";
import { additive, alpha, glow, rnd } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;
const BLOOD = "#c01828";
const EMBER = "#ff5a3a";

/** 금 간 벽: 갈라진 금 → 닿으면 무너지며 돌 부스러기 → 어두운 문 (안쪽에서 보랏빛이 새어 나옴) */
export function drawCrack(ctx: Ctx, s: RunState): void {
  const c = crackHere(s);
  if (!c) return;
  const { x, y } = crackSpot(c);
  const side = c.side;
  // 벽을 따라 (u) · 방 안쪽으로 (v)
  const at = (u: number, v: number): [number, number] => (side === 0 ? [x + v, y + u] : side === 1 ? [x - v, y + u] : [x + u, y - v]);
  const f = c.broke === undefined ? 0 : Math.min(1, (s.tick - c.broke) / SECRET_WALL.crumble);
  if (f < 1) {
    // 금: 가운데에서 뻗는 들쭉날쭉한 줄 (무너질수록 벌어짐)
    // 밝은 깨진 면 위에 검은 금 (벽을 따라 크게 퍼짐)
    for (const [color, w, dv] of [["#8a8098", 2.5, 1], ["#0c0a10", 1.5 + f * 2, 0]] as const) {
      ctx.strokeStyle = alpha(color, 0.95);
      ctx.lineWidth = w;
      for (let k = 0; k < 6; k++) {
        ctx.beginPath();
        let [px, py] = at(0, 1 + dv);
        ctx.moveTo(px, py);
        for (let j = 1; j <= 4; j++) {
          [px, py] = at((rnd(k, j) - 0.5) * 9 * j * (1 + f), j * 3 + rnd(j, k) * 2 + dv);
          ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
    }
    if (c.broke === undefined) {
      // 살짝 새는 빛: 눈치챈 사람만 알아보게
      additive(ctx, () => glow(ctx, ...at(0, 2), 6, "#a070ff", 0.12 + 0.08 * Math.sin(s.tick / 15)));
      return;
    }
  }
  // 문: 무너진 만큼 검은 구멍이 열림 · 아래 부스러기
  const w = 9 * Math.min(1, f * 1.3);
  ctx.fillStyle = "#06040a";
  const [ax, ay] = at(-w, 0);
  const [bx, by] = at(w, 8);
  ctx.fillRect(Math.min(ax, bx), Math.min(ay, by), Math.abs(bx - ax) || 1, Math.abs(by - ay) || 1);
  ctx.fillStyle = "#5a5268";
  for (let i = 0; i < 7; i++) {
    const [rx, ry] = at((rnd(i, 3) - 0.5) * 22, 9 + rnd(i, 5) * 8);
    ctx.fillRect(Math.round(rx), Math.round(ry), 2 + (i % 2), 2);
  }
  if (f >= 1) additive(ctx, () => glow(ctx, ...at(0, 4), 14, "#a070ff", 0.35 + 0.15 * Math.sin(s.tick / 10)));
}

/** 악마의 방 바닥: 핏빛 마법진 · 촛불 넷 · 석상 받침 (석상은 어둠 위에 그림, drawDevilStatue) */
export function drawDevilRoom(ctx: Ctx, s: RunState, cx: number): void {
  const t = s.tick;
  const y0 = statueY() + 30;
  ctx.strokeStyle = alpha(BLOOD, 0.55 + 0.15 * Math.sin(t / 20));
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, y0, 46, 0, Math.PI * 2);
  ctx.stroke();
  // 별 (다섯 점을 둘씩 건너 이음)
  ctx.beginPath();
  for (let i = 0; i <= 5; i++) {
    const a = -Math.PI / 2 + ((i * 2) % 5) * ((Math.PI * 2) / 5) + Math.PI;
    const px = cx + Math.cos(a) * 44;
    const py = y0 + Math.sin(a) * 44;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
}

/** 사탄의 석상 (어둠 위에 그려 붉은 눈·촛불이 보임) */
export function drawDevilStatue(ctx: Ctx, s: RunState, cx: number): void {
  const t = s.tick;
  const y = statueY();
  // 날개
  ctx.fillStyle = "#1a1418";
  for (const d of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(cx + d * 8, y - 6);
    ctx.lineTo(cx + d * 38, y - 26);
    ctx.lineTo(cx + d * 32, y - 8);
    ctx.lineTo(cx + d * 40, y + 2);
    ctx.lineTo(cx + d * 26, y + 4);
    ctx.lineTo(cx + d * 30, y + 16);
    ctx.lineTo(cx + d * 10, y + 10);
    ctx.fill();
  }
  // 몸·머리·뿔
  ctx.fillStyle = "#2a2228";
  ctx.fillRect(cx - 9, y - 4, 18, 26);
  ctx.fillRect(cx - 7, y - 16, 14, 13);
  ctx.fillStyle = "#3a3038";
  ctx.fillRect(cx - 9, y - 4, 3, 26);
  for (const d of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(cx + d * 5, y - 15);
    ctx.quadraticCurveTo(cx + d * 14, y - 22, cx + d * 10, y - 30);
    ctx.lineTo(cx + d * 3, y - 16);
    ctx.fill();
  }
  // 받침
  ctx.fillStyle = "#18121a";
  ctx.fillRect(cx - 16, y + 22, 32, 8);
  ctx.fillStyle = alpha(BLOOD, 0.8);
  ctx.fillRect(cx - 16, y + 22, 32, 1);
  // 붉은 눈 · 촛불
  const blink = Math.sin(t / 40) > -0.9 ? 1 : 0.2;
  additive(ctx, () => {
    for (const d of [-1, 1]) glow(ctx, cx + d * 3, y - 10, 5, BLOOD, 0.9 * blink, 0.4);
    for (const d of [-1, 1, -2, 2]) {
      const fx = cx + d * 28;
      const fy = y + 40 + Math.abs(d) * 6;
      glow(ctx, fx, fy - 6, 9, EMBER, 0.5 + 0.2 * Math.sin(t / 5 + d), 0.6);
    }
  });
  ctx.fillStyle = "#e8e0d0";
  for (const d of [-1, 1, -2, 2]) ctx.fillRect(cx + d * 28 - 1, y + 40 + Math.abs(d) * 6 - 4, 3, 6);
  ctx.fillStyle = "#ffd070";
  for (const d of [-1, 1, -2, 2]) ctx.fillRect(cx + d * 28, y + 40 + Math.abs(d) * 6 - 7 - (Math.floor(t / 6 + d) % 2), 1, 2);
}

/** 거래 받침: 검은 받침 위에 떠 있는 패시브 · 아래 붉은 값 (최대 체력 -N) */
export function drawDevilOffer(ctx: Ctx, s: RunState, pk: Pickup, near: boolean): void {
  const x = Math.round(pk.x);
  const y = offerY();
  const bob = Math.round(Math.sin((s.tick + pk.id * 9) / 14) * 2);
  additive(ctx, () => glow(ctx, x, y - 6 + bob, near ? 16 : 11, BLOOD, near ? 0.7 : 0.45, 0.3));
  ctx.fillStyle = "#140c10";
  ctx.fillRect(x - 9, y + 4, 18, 6);
  ctx.fillStyle = alpha(BLOOD, 0.9);
  ctx.fillRect(x - 9, y + 4, 18, 1);
  ctx.drawImage(iconCanvas({ kind: "passive", id: pk.itemId } as IconItem), x - 8, y - 14 + bob);
  ctx.font = "bold 7px sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#ff6a7a";
  ctx.fillText(`♥-${devilCost(pk.itemId as DevilId)}`, x, y + 18);
  ctx.textAlign = "start";
}

/** 도박꾼의 방: 초록 탁자 · 상자 셋 (보여 줄 때는 당첨 상자 아래 금화, 섞을 때는 두 상자가 엇갈려 지나감, 고른 뒤 열림) */
export function drawGambleTable(ctx: Ctx, s: RunState, cx: number): void {
  const y = cupY();
  ctx.fillStyle = "#3a2410";
  ctx.fillRect(cx - 62, y - 10, 124, 26);
  ctx.fillStyle = "#1e6a3a";
  ctx.fillRect(cx - 60, y - 8, 120, 20);
  ctx.strokeStyle = alpha("#e8c25a", 0.6);
  ctx.strokeRect(cx - 57.5, y - 5.5, 115, 15);
  const g = gambleNow(s);
  const st = g ? cupState(g, s.tick) : { slots: [0, 1, 2], pair: null, f: 0, show: false };
  const picked = g?.pick !== undefined;
  for (let cup = 0; cup < 3; cup++) {
    let slot = st.slots[cup]!;
    let lift = 0;
    let dy = 0;
    if (st.pair && st.pair.includes(slot)) {
      const other = st.pair[0] === slot ? st.pair[1] : st.pair[0];
      const e = (1 - Math.cos(st.f * Math.PI)) / 2;
      dy = Math.sin(st.f * Math.PI) * (st.pair[0] === slot ? -7 : 7);
      slot = slot + (other - slot) * e;
    }
    const x = cx + (slot - 1) * CUP_GAP;
    const prize = cup === (g?.prize ?? -1);
    if (st.show && prize) lift = Math.sin(Math.min(1, (s.tick - (g?.at ?? 0)) / 50) * Math.PI) * 12;
    if (picked && (st.slots[cup] === g!.pick || prize)) lift = Math.min(12, (s.tick - gambleDone(g!)) * 0.6 + 12);
    if (prize && lift > 2) {
      additive(ctx, () => glow(ctx, x, y + 4, 9, "#ffd040", 0.8, 0.5));
      ctx.fillStyle = "#ffd040";
      ctx.fillRect(x - 3, y + 1, 6, 5);
    }
    // 상자 (뚜껑 · 몸 · 띠)
    ctx.fillStyle = "#6a3a18";
    ctx.fillRect(Math.round(x - 9), Math.round(y - 8 + dy - lift), 18, 13);
    ctx.fillStyle = "#8a5228";
    ctx.fillRect(Math.round(x - 9), Math.round(y - 10 + dy - lift), 18, 4);
    ctx.fillStyle = "#e8c25a";
    ctx.fillRect(Math.round(x - 1), Math.round(y - 10 + dy - lift), 2, 15);
  }
  // 다 섞이면 자리 번호 (창에서 고름)
  if (g && g.pick === undefined && s.tick >= gambleDone(g)) {
    ctx.font = "bold 8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff6c0";
    for (let i = 0; i < 3; i++) ctx.fillText(String(i + 1), cx + (i - 1) * CUP_GAP, y + 26);
    ctx.textAlign = "start";
  }
}

/** 도박꾼: 중절모 · 시가 · 손에 카드 (판을 시작하면 손을 흔듦) */
export function drawGambler(ctx: Ctx, s: RunState, x: number): void {
  const y = gamblerY();
  const g = gambleNow(s);
  const busy = g && g.pick === undefined && s.tick < gambleDone(g);
  const sway = busy ? Math.sin(s.tick / 3) * 3 : Math.sin(s.tick / 30);
  ctx.fillStyle = "#2a1e30";
  ctx.fillRect(x - 7, y - 4, 14, 16);
  ctx.fillStyle = "#e8c8a0";
  ctx.fillRect(x - 5, y - 13, 10, 9);
  ctx.fillStyle = "#1a1018";
  ctx.fillRect(x - 8, y - 15, 16, 2);
  ctx.fillRect(x - 5, y - 21, 10, 6);
  ctx.fillStyle = "#c02838";
  ctx.fillRect(x - 5, y - 16, 10, 1);
  ctx.fillStyle = "#101010";
  ctx.fillRect(x - 3, y - 10, 2, 1);
  ctx.fillRect(x + 1, y - 10, 2, 1);
  // 시가 · 연기
  ctx.fillStyle = "#6a4020";
  ctx.fillRect(x + 3, y - 7, 5, 1);
  additive(ctx, () => glow(ctx, x + 8, y - 7, 2, EMBER, 0.8));
  ctx.fillStyle = alpha("#c0c0c0", 0.35);
  ctx.fillRect(x + 9 + Math.round(Math.sin(s.tick / 12) * 2), y - 13 - ((s.tick / 4) % 6), 2, 2);
  // 손 · 카드
  for (const d of [-1, 1]) {
    ctx.fillStyle = "#e8c8a0";
    ctx.fillRect(Math.round(x + d * 10 + (d < 0 ? sway : -sway)) - 1, y + 2, 3, 3);
  }
  ctx.fillStyle = "#f4f0e8";
  ctx.fillRect(Math.round(x - 12 + sway), y - 2, 4, 6);
  ctx.fillStyle = "#c02838";
  ctx.fillRect(Math.round(x - 11 + sway), y, 2, 2);
}
