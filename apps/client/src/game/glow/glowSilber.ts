// 빛 층: 크루세이더 뒤 실베르 캐릭터 효과 빛 (효과 색·세기는 silberFxKinds) + 늘 켜진 빛 (아수라 각성·날아가는 주먹·표식 · 빙설 궁극기 기 모으기 · 조커 카드 · 쉐도잉 영혼 · 백령 검기)
import { asMarked, BINGSEOL_PERKS, ULT_LIFT, type RunState } from "@pixel-rogue/shared";
import type { GlowCues } from "./glowCanvas";
import { FxSeen } from "./fxSeen";
import type { GlowParts } from "./glowParts";
import { SILBER_FX, SILBER_GLOW as G } from "./silberFxKinds";

/** 늘 켜진 빛을 한 화면에 놓는 가장 많은 수 */
const MAX_STEADY = 40;

export class GlowSilber {
  private seen = new FxSeen();
  /** 아수라 각성 빛을 낸 시작 틱 (화면이 여러 번 그려도 한 번만) */
  private awake = -1;

  observe(s: RunState, parts: GlowParts, cues: GlowCues): void {
    for (const fx of this.seen.fresh(s)) {
      const k = SILBER_FX[fx.kind];
      if (!k) continue;
      const [blue, power] = k;
      // 아수라 분노의 팔: 빛도 붉게
      const color = fx.kind.startsWith("as") && s.player.passives.includes("asRage" as never) ? G.crimson : blue;
      const size = Math.max(5, Math.min(90, fx.size || 10));
      // 홈런 내리찍기는 크게
      const p = fx.kind === "rbSlam" && fx.style === 1 ? 3 : power;
      if (p === 1) {
        parts.spawn(fx.x, fx.y, { life: 0.2, s0: size * 0.8, s1: size * 1.3, color, alpha: 0.35 });
        parts.burst(fx.x, fx.y, 3, 90 + size * 2, color, 0.3, 1.6);
        continue;
      }
      parts.spawn(fx.x, fx.y, { life: p >= 3 ? 0.45 : 0.3, s0: size * 1.5, s1: size * (p >= 3 ? 2.4 : 1.8), color, alpha: p >= 3 ? 0.6 : 0.45 });
      parts.spawn(fx.x, fx.y, { kind: "ring", life: p >= 3 ? 0.5 : 0.35, s0: size * 0.5, s1: size * (p >= 3 ? 3 : 2.2), color, alpha: 0.8 });
      parts.burst(fx.x, fx.y, p >= 3 ? 16 : 8, 140 + size * 2.5, color, p >= 3 ? 0.6 : 0.45, p >= 3 ? 2.6 : 2);
      if (p === 4) this.ult(parts, fx.x, fx.y, size, color, cues);
    }
    this.steady(s, parts, cues);
  }

  /** 필살기: 흰 심 · 빛기둥 · 고리 여러 겹 · 화면 살짝 번쩍 */
  private ult(parts: GlowParts, x: number, y: number, size: number, color: number, cues?: GlowCues): void {
    parts.spawn(x, y, { life: 0.5, s0: size * 0.8, s1: size * 1.4, color: 0xffffff, alpha: 0.5 });
    for (let i = 1; i <= 5; i++) parts.spawn(x, y - i * size * 0.5, { life: 0.5 + i * 0.05, s0: size * 0.7, s1: size * 0.3, color, alpha: 0.5 });
    parts.spawn(x, y, { kind: "ring", life: 0.8, s0: size, s1: size * 4, color, alpha: 0.6 });
    if (cues) cues.flash = Math.max(cues.flash, 0.2);
  }

  /** 늘 켜진 빛 (매 화면) */
  private steady(s: RunState, parts: GlowParts, cues: GlowCues): void {
    const p = s.player;
    let n = 0;
    const put = (x: number, y: number, size: number, color: number, a: number) => {
      if (n++ < MAX_STEADY) parts.steady(x, y, size, color, a);
    };
    switch (p.characterId) {
      case "asura": {
        const red = p.passives.includes("asRage" as never);
        const B = red ? G.crimson : G.blue;
        const L = red ? G.red : G.light;
        if ((p.asAwake ?? 0) > 0) {
          // 각성: 등 뒤에 은은한 남색 빛 (몸을 가리지 않게 약하게) · 시작하는 순간만 크게
          put(p.x, p.y - 22, 44 * (0.85 + 0.15 * Math.sin(s.tick * 0.15)), B, 0.18);
          if (p.asAwakeAt !== undefined && p.asAwakeAt !== this.awake && s.tick - p.asAwakeAt < 3) {
            this.awake = p.asAwakeAt;
            this.ult(parts, p.x, p.y, 40, B, cues);
          }
        }
        for (const f of p.asFists ?? []) put(f.x, f.y, 18, B, 0.7);
        if (p.passives.includes("asField" as never)) for (const e of s.enemies) if (e.hp > 0 && asMarked(s, e)) put(e.x, e.y - e.r - 7, 9, L, 0.55);
        return;
      }
      case "bingseol": {
        const u = p.bsUlt;
        const charge = BINGSEOL_PERKS.bsUlt.charge;
        if (u) put(u.t < charge ? p.x : u.x, u.t < charge ? p.y - ULT_LIFT : u.y, 26 + Math.min(1, u.t / charge) * 30, G.ice, 0.5);
        for (const sh of p.bsShots ?? []) if (sh.age > 0) put(sh.x, sh.y, 10 + sh.r, G.ice, 0.45);
        return;
      }
      case "joker":
        for (const c of p.jkCards ?? []) put(c.x, c.y, 12, G.violet, 0.4);
        return;
      case "shadowing":
        for (const sp of p.sdSpirits ?? []) put(sp.x, sp.y, 16, G.soul, 0.5);
        return;
      case "baekryeong":
        for (const sh of p.byShots ?? []) put(sh.x, sh.y, 12 + sh.r, G.sky, 0.5);
        for (const w of p.byWhirls ?? []) put(w.x, w.y, w.r * 1.4, G.sky, 0.3);
        return;
      case "rabbit":
        for (const w of p.rbWaves ?? []) put(w.x, w.y, w.r * 1.2, G.green, 0.3);
        return;
    }
  }
}
