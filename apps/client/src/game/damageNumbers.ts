// 피해 숫자 (화면 전용, 게임 계산에는 영향 없음): 틱마다 적 체력이 준 만큼을 적 위에 띄움. 치명타는 critNumber (굵은 숫자 + 섬광).
// 상태이상 피해는 색과 왼쪽 아이콘으로: 출혈 빨강 핏방울 · 화상 주황 불꽃 · 독 초록 거품 · 저주(수양 부적) 보라 해골 (dotIcons)
// 연습장 허수아비는 평균·초당·직전·총 피해를 세어 허수아비 아래에 그림 (몇 초 안 때리면 처음부터)
import { TICK_RATE, type DotKind, type EnemyState, type RunState } from "@pixel-rogue/shared";
import { dotIconWidth, drawDotIcon } from "./dotIcons";
import { drawTigerNumber } from "./limited/tigerNumber";
import { drawSummerNumber } from "./limited/summerNumber";
import { drawSkinNumber } from "./dmgSkins";
import { drawCrit } from "./critNumber";
import type { DmgStyle } from "../shop/effects";
import type { Snap } from "./render/palette";

/** 숫자가 떠 있는 틱, 위로 떠오르는 거리, 한 번에 떠 있는 최대 수 · 적 하나에 남기는 수 (화면을 덜 가리게) */
const LIFE = 30;
const RISE = 10;
const MAX_NUMBERS = 30;
const PER_ENEMY = 3;
/** 숫자가 뜬 뒤 이만큼(틱) 안에 같은 적이 또 맞으면 합침 (한꺼번에 맞은 빔·폭발 등이 겹치지 않게) */
const MERGE_TICKS = 4;
/** 허수아비를 이만큼(3초) 안 때리면 기록을 처음부터 */
export const DUMMY_RESET_TICKS = 3 * TICK_RATE;

interface FloatNumber {
  enemyId: number;
  x: number;
  y: number;
  amount: number;
  /** 뜬 틱 */
  born: number;
  /** 보통 · 치명타 · 상태이상 종류 */
  kind: NumKind;
  /** 흩뿌려질 자리 (뜰 때 정함, 같은 적 숫자끼리 겹치지 않게 방향·거리를 돌려 가며) */
  ox: number;
  oy: number;
}

export type NumKind = "hit" | "crit" | DotKind;

/** 상태이상 피해 숫자 색 */
export const DOT_COLOR: Record<DotKind, string> = { bleed: "#ff4a4a", burn: "#ff9a2a", poison: "#7ae05a", curse: "#c08aff", storm: "#8ae8ff", rot: "#ff8a1a", death: "#120c16", hellfire: "#6ad8ff", shock: "#ffe04a", frost: "#9ae8ff", tide: "#3a9aff", gold: "#ffc830", radiance: "#fff8d8", voidbolt: "#8a5ab8", moon: "#ffffff", blueflame: "#3a8aff" };
const DOT_KINDS = Object.keys(DOT_COLOR) as DotKind[];

export interface DummyStats {
  avg: number;
  dps: number;
  last: number;
  total: number;
}

export class DamageTracker {
  private hp = new Map<number, number>();
  /** 적마다 마지막으로 본 치명타 틱 */
  private crits = new Map<number, number>();
  /** 적마다 마지막으로 본 상태이상 피해 틱 */
  private dots = new Map<number, number>();
  private where = "";
  private numbers: FloatNumber[] = [];
  /** 지금까지 띄운 숫자 수 (흩뿌리는 방향을 조금씩 바꿈) */
  private spawned = 0;
  private dummy = { total: 0, hits: 0, last: 0, first: 0, lastTick: -Infinity };
  /** 한 판 요약: 종류별 준 피해 합 · 가장 센 한 방 (허수아비 제외) */
  readonly dealt: Partial<Record<NumKind, number>> = {};
  best = 0;
  /** 한정 스킨 숫자 모양 (없으면 기본) */
  style: DmgStyle | null = null;

  /** 틱을 진행할 때마다 */
  observe(s: RunState): void {
    // 방·층이 바뀌면 이전 방의 적은 셈하지 않음
    const where = `${s.floor}/${s.roomId}`;
    if (where !== this.where) {
      this.where = where;
      this.hp.clear();
      this.crits.clear();
      this.dots.clear();
      this.numbers = [];
    }
    const seen = new Set<number>();
    for (const e of s.enemies) {
      seen.add(e.id);
      const before = this.hp.get(e.id);
      this.hp.set(e.id, e.hp);
      const crit = e.critTick !== undefined && e.critTick !== this.crits.get(e.id);
      if (e.critTick !== undefined) this.crits.set(e.id, e.critTick);
      if (before !== undefined && before > e.hp) this.split(s, e, before - Math.max(0, e.hp), crit);
    }
    // 이번 틱에 쓰러진 적: 남아 있던 체력만큼
    for (const [id, before] of this.hp) {
      if (seen.has(id)) continue;
      this.hp.delete(id);
      this.crits.delete(id);
      this.dots.delete(id);
      const n = [...this.numbers].reverse().find((x) => x.enemyId === id);
      if (before > 0 && n) n.amount += before;
    }
    this.numbers = this.numbers.filter((n) => s.tick - n.born < LIFE);
  }

  /** 이번 틱에 준 체력을 상태이상 종류별 · 나머지(보통·치명타)로 나눠 띄움 */
  private split(s: RunState, e: EnemyState, amount: number, crit: boolean): void {
    let left = amount;
    if (e.dotTick !== undefined && e.dotTick !== this.dots.get(e.id)) {
      this.dots.set(e.id, e.dotTick);
      for (const k of DOT_KINDS) {
        const a = Math.min(left, e.dotAmt?.[k] ?? 0);
        if (a <= 0) continue;
        this.hit(s, e.id, e.x, e.y - e.r, a, e.kind === "dummy" && !e.svBox, k);
        left -= a;
      }
    }
    if (left > 0.001) this.hit(s, e.id, e.x, e.y - e.r, left, e.kind === "dummy" && !e.svBox, crit ? "crit" : "hit");
  }

  private hit(s: RunState, id: number, x: number, y: number, amount: number, isDummy: boolean, kind: NumKind): void {
    // 치명타·상태이상은 따로 띄움 (같은 종류끼리만 합침, 상태이상 숫자는 조금 옆에)
    const recent = this.numbers.find((n) => n.enemyId === id && n.kind === kind && s.tick - n.born < MERGE_TICKS);
    if (recent) recent.amount += amount;
    else {
      // 이 적에게 아직 떠 있는 숫자 수만큼 황금각으로 돌려 사방으로 흩뿌림 (멀리·높이도 조금씩 다르게)
      const slot = this.numbers.filter((n) => n.enemyId === id && s.tick - n.born < LIFE).length + (this.spawned++ % 3);
      const ang = slot * 2.4 + id;
      const far = 7 + (slot % 3) * 5;
      this.numbers.push({ enemyId: id, x, y, amount, born: s.tick, kind, ox: Math.cos(ang) * far, oy: -Math.abs(Math.sin(ang)) * far * 0.7 - (slot % 4) * 3 });
      if (this.numbers.length > MAX_NUMBERS) this.numbers.shift();
      // 같은 적의 오래된 숫자는 최근 몇 개만
      const mine = this.numbers.filter((n) => n.enemyId === id);
      if (mine.length > PER_ENEMY) this.numbers = this.numbers.filter((n) => !mine.slice(0, mine.length - PER_ENEMY).includes(n));
    }
    if (!isDummy) {
      this.dealt[kind] = (this.dealt[kind] ?? 0) + amount;
      if (kind === "hit" || kind === "crit") this.best = Math.max(this.best, amount);
      return;
    }
    const d = this.dummy;
    if (s.tick - d.lastTick > DUMMY_RESET_TICKS) Object.assign(d, { total: 0, hits: 0, first: s.tick });
    d.total += amount;
    d.hits++;
    d.last = amount;
    d.lastTick = s.tick;
  }

  /** 허수아비 기록 (안 때린 지 오래면 null) */
  dummyStats(tick: number): DummyStats | null {
    const d = this.dummy;
    if (d.hits === 0 || tick - d.lastTick > DUMMY_RESET_TICKS) return null;
    // 처음 맞힌 때부터 지금까지 (1초보다 짧으면 1초로)
    const sec = Math.max(1, (tick - d.first) / TICK_RATE);
    return { avg: d.total / d.hits, dps: d.total / sec, last: d.last, total: d.total };
  }

  /** 허수아비 바로 아래에 기록 (labels: 평균·초당·직전·총 글자) */
  drawDummy(ctx: CanvasRenderingContext2D, s: RunState, labels: readonly string[], snap: Snap): void {
    const st = this.dummyStats(s.tick);
    const dummy = s.enemies.find((e) => e.kind === "dummy" && !e.svBox);
    if (!st || !dummy) return;
    const values = [st.avg, st.dps, st.last, st.total].map(formatDamage);
    const line = 6;
    const pad = 2;
    ctx.font = "5px monospace";
    ctx.textBaseline = "top";
    const labelW = Math.max(...labels.map((l) => ctx.measureText(l).width));
    const valueW = Math.max(...values.map((v) => ctx.measureText(v).width));
    const w = Math.ceil(labelW + valueW + 6 + pad * 2);
    const h = values.length * line + pad * 2;
    const left = snap(dummy.x - w / 2);
    const top = snap(dummy.y + dummy.r + 4);
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(left, top, w, h);
    values.forEach((v, i) => {
      const y = top + pad + i * line;
      ctx.textAlign = "left";
      ctx.fillStyle = "#e8e4f0";
      ctx.fillText(labels[i] ?? "", left + pad, y);
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffd060";
      ctx.fillText(v, left + w - pad, y);
    });
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
  }

  draw(ctx: CanvasRenderingContext2D, tick: number, snap: Snap): void {
    if (this.numbers.length === 0) return;
    ctx.font = "bold 6px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1a1622";
    // 적마다 가장 최근 숫자 (나머지는 반투명하게 → 최신이 또렷이 맨 위)
    const newest = new Map<number, number>();
    for (const n of this.numbers) newest.set(n.enemyId, Math.max(newest.get(n.enemyId) ?? 0, n.born));
    for (const n of this.numbers) {
      const age = (tick - n.born) / LIFE;
      const old = n.born < (newest.get(n.enemyId) ?? 0);
      const text = formatDamage(n.amount);
      // 빨리 튀어 나갔다 천천히 멈춤 · 숫자마다 정해 둔 방향으로 흩뿌려지며 위로 솟음 (겹쳐도 읽히게)
      const ease = 1 - (1 - Math.min(1, age * 1.6)) ** 3;
      const x = snap(n.x + n.ox * ease);
      const y = snap(n.y - 2 + n.oy * ease - RISE * age);
      ctx.globalAlpha = Math.min(1, 2 - age * 2) * (old ? 0.45 : 1);
      if (this.style && (n.kind === "hit" || n.kind === "crit")) {
        if (this.style === "tiger") drawTigerNumber(ctx, text, x, y, tick - n.born, n.kind === "crit");
        else if (this.style === "summer") drawSummerNumber(ctx, text, x, y, tick - n.born, n.kind === "crit");
        else drawSkinNumber(ctx, this.style, text, x, y, tick - n.born, n.kind === "crit");
        ctx.strokeStyle = "#1a1622";
        ctx.lineWidth = 2;
        continue;
      }
      if (n.kind === "crit") {
        drawCrit(ctx, text, x, y, tick - n.born);
        continue;
      }
      // 처음 살짝 크게 튀어나왔다 제 크기로 (큰 피해일수록 더)
      const big = n.kind === "hit" && n.amount >= 20;
      const pop = 1 + (big ? 0.6 : 0.35) * Math.max(0, 1 - (tick - n.born) / 6);
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(pop, pop);
      // 죽음(검은 숫자)은 밝은 테두리
      ctx.strokeStyle = n.kind === "death" ? "#c8b8d8" : "#1a1622";
      ctx.strokeText(text, 0, 0);
      if (big) {
        // 큰 피해: 위는 흰빛 → 금빛
        const g = ctx.createLinearGradient(0, -6, 0, 0);
        g.addColorStop(0, "#fffbe0");
        g.addColorStop(1, "#ffb830");
        ctx.fillStyle = g;
      } else if (n.kind === "blueflame") {
        // 청염(블루 플레임): 아래는 진한 파랑 → 위로 갈수록 옅게
        const g = ctx.createLinearGradient(0, 0, 0, -6);
        g.addColorStop(0, "#1238d8");
        g.addColorStop(0.5, "#3a8aff");
        g.addColorStop(1, "#c8f0ff");
        ctx.fillStyle = g;
      } else ctx.fillStyle = n.kind !== "hit" ? DOT_COLOR[n.kind] : "#ffffff";
      ctx.fillText(text, 0, 0);
      // 막 나왔을 때 하얗게 번쩍
      if (tick - n.born < 2) {
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.fillText(text, 0, 0);
      }
      ctx.restore();
      // 상태이상: 숫자 왼쪽에 핏방울·불꽃·독 거품·해골·폭풍·녹아내린 구슬·푸른 불꽃
      if (n.kind !== "hit") drawDotIcon(ctx, n.kind, Math.round(x - ctx.measureText(text).width / 2 - 2 - dotIconWidth(n.kind)), y - 6);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
  }
}

/** 10 미만은 소수 첫째 자리까지 (레이저 같은 작은 피해), 나머지는 정수 */
export function formatDamage(v: number): string {
  return v < 10 ? String(Math.round(v * 10) / 10) : String(Math.round(v));
}
