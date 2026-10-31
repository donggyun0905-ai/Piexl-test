// 패왕전·로그 화면 정보 (계산과 상관없음): 틱마다 모든 자리를 보고 바뀐 것을 머리 위에 띄움
// 로그(패왕전 아님): 내가 받은 피해는 상태이상 피해도 모두 빨강 −숫자 하나로 · 적이 건 상태이상 이름(독·치유감소·출혈 등)
// 회복 초록 +숫자 · 보호막 파랑 +숫자 · 내가 받은 피해 빨강 −숫자 · 상태이상 글자(기절·둔화·속박·침묵) · 버프 글자(공격력↑·피해 감소·속도↑·재생) · 풋내기 버팀
import { allPlayers, type RunState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import type { Snap } from "./render/palette";

const LIFE = 50;
const MERGE = 10;

interface Pop {
  seat: number;
  text: string;
  amount: number;
  color: string;
  born: number;
  /** 숫자면 합침 · 글자면 그대로 */
  num: boolean;
  /** 같은 자리에서 몇 번째 줄 (겹치지 않게) */
  lane: number;
}

interface Seen {
  hp: number;
  shield: number;
  stun: number;
  slow: number;
  root: number;
  silence: number;
  buffs: number;
  stand: boolean;
}

/** 로그 상태이상 [PlayerState 값, 글자, 색] (글자만 색, 피해 숫자는 늘 빨강) */
const RUN_STATUS: readonly [string, TextKey, string][] = [
  ["poison", "dbPoison", "#8aff6a"],
  ["corrode", "dbHealCut", "#c88aff"],
  ["dbBleed", "dbBleed", "#ff7a7a"],
  ["dbRot", "dbRot", "#b8e04a"],
  ["dbCurse", "dbCurse", "#b06aff"],
  ["dbFear", "dbFear", "#c890ff"],
  ["dbStun", "dbStun", "#ffe070"],
  ["dbRoot", "dbRoot", "#c8c8d0"],
  ["dbSlow", "dbSlow", "#8ad8ff"],
  ["venomTicks", "dbVenom", "#8aff6a"],
  ["doomTicks", "dbDoom", "#a080c0"],
];

const STATUS: readonly { key: "stun" | "slow" | "root" | "silence"; text: TextKey; color: string }[] = [
  { key: "stun", text: "pwInfoStun", color: "#ffe070" },
  { key: "slow", text: "pwInfoSlow", color: "#8ad8ff" },
  { key: "root", text: "pwInfoRoot", color: "#c8c8d0" },
  { key: "silence", text: "pwInfoSilence", color: "#c88aff" },
];

export class PwInfoNumbers {
  private seen: Seen[] = [];
  private runSeen: Record<string, number>[] = [];
  private pops: Pop[] = [];

  constructor(private readonly t: (k: TextKey) => string) {}

  private add(s: RunState, seat: number, text: string, color: string, amount = 0): void {
    const num = amount > 0;
    const same = num && this.pops.find((p) => p.seat === seat && p.num && p.color === color && s.tick - p.born < MERGE);
    if (same) {
      same.amount += amount;
      return;
    }
    const lane = this.pops.filter((p) => p.seat === seat && s.tick - p.born < LIFE / 2).length;
    this.pops.push({ seat, text, amount, color, born: s.tick, num, lane });
  }

  /** 틱마다 (me = 내 자리, 받은 피해는 나만) */
  observe(s: RunState, me: number): void {
    const pv = s.pvp;
    if (!pv) return this.observeRun(s, me);
    allPlayers(s).forEach((p, i) => {
      const seat = pv.seats[i]!;
      const now: Seen = { hp: p.hp, shield: p.shieldPts ?? 0, stun: seat.stun, slow: seat.slow, root: seat.root, silence: seat.silence ?? 0, buffs: p.pwBuffs?.length ?? 0, stand: (p.pwStand ?? 0) > 0 };
      const was = this.seen[i];
      this.seen[i] = now;
      if (!was || !seat.on) return;
      const healed = now.hp - was.hp;
      // 다시 살아나 체력이 다 찬 것(라운드·연습장)은 회복이 아님
      if (healed >= 0.5 && was.hp > 0.5 && healed < p.stats.maxHp * 0.9) this.add(s, i, "+", "#7aff8a", healed);
      if (i === me && healed <= -0.5) this.add(s, i, "−", "#ff5a5a", -healed);
      if (now.shield - was.shield >= 0.5) this.add(s, i, "+", "#6ab8ff", now.shield - was.shield);
      for (const st of STATUS) if (now[st.key] > 0 && was[st.key] <= 0) this.add(s, i, this.t(st.text), st.color);
      if (now.buffs > was.buffs) {
        const b = p.pwBuffs![p.pwBuffs!.length - 1]!;
        const key: TextKey | null = b.dmg ? "pwInfoAtk" : b.taken ? "pwInfoGuard" : b.rate || b.move ? "pwInfoFast" : b.regen ? "pwInfoRegen" : b.hide ? "pwInfoHide" : null;
        if (key) this.add(s, i, this.t(key), b.dmg ? "#ff7a5a" : b.taken ? "#8ac8ff" : b.hide ? "#b8a8e8" : b.regen ? "#7aff8a" : "#ffe070");
      }
      if (now.stand && !was.stand) this.add(s, i, this.t("pwInfoStand"), "#ffd060");
    });
    this.pops = this.pops.filter((p) => s.tick - p.born < LIFE);
  }

  /** 로그·협동: 내 피해 빨강 −숫자 · 새로 걸린 상태이상 이름 (모든 자리) */
  private observeRun(s: RunState, me: number): void {
    allPlayers(s).forEach((p, i) => {
      const now: Record<string, number> = { hp: p.hp };
      for (const [f] of RUN_STATUS) now[f] = ((p as unknown as Record<string, number | undefined>)[f] ?? 0) > 0 ? 1 : 0;
      const was = this.runSeen[i];
      this.runSeen[i] = now;
      if (!was) return;
      if (i === me && now.hp! - was.hp! <= -0.5) this.add(s, i, "−", "#ff5a5a", was.hp! - now.hp!);
      for (const [f, key, color] of RUN_STATUS) if (now[f] && !was[f]) this.add(s, i, this.t(key), color);
    });
    this.pops = this.pops.filter((p) => s.tick - p.born < LIFE);
  }

  draw(ctx: CanvasRenderingContext2D, s: RunState, snap: Snap): void {
    if (this.pops.length === 0) return;
    const ps = allPlayers(s);
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#140f1c";
    for (const p of this.pops) {
      const who = ps[p.seat];
      if (!who) continue;
      const age = (s.tick - p.born) / LIFE;
      const text = p.num ? `${p.text}${Math.round(p.amount)}` : p.text;
      // 숫자는 오른쪽 위로, 글자는 머리 위 가운데로 떠오름
      const x = snap(who.x + (p.num ? 8 : 0));
      const y = snap(who.y - who.r - 16 - p.lane * 7 - age * 10);
      ctx.globalAlpha = Math.min(1, 2.2 - age * 2.2);
      ctx.font = p.num ? "bold 6px monospace" : "bold 5px sans-serif";
      ctx.strokeText(text, x, y);
      ctx.fillStyle = p.color;
      ctx.fillText(text, x, y);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
  }
}
