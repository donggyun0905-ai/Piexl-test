// 특별한 방 결과 알림 (화면 가운데 위, 3초): 시련 시작(어떤 시련인지) · 시련 거절 벌칙(무엇을 빼앗겼는지) · 시련 결과 점수
// · 보상 상자에서 받은 것 · 야바위 당첨/꽝(깎인 능력치). 글자는 화면 언어 (text: 키 → 글자, 없는 키면 키 그대로)
import { TRIAL_FOE_RULES as F, trialCap, type RunState } from "@pixel-rogue/shared";

type Ctx = CanvasRenderingContext2D;
const SHOW = 180;

/** 시련 점수만큼 세진 적 (sim/trialFoes) */
function foesUp(total: number, text: (key: string) => string): string {
  const k = Math.min(total, F.CAP) / F.CAP;
  return text("trialFoesUp").replace("{hp}", String(Math.round(F.HP * k * 100))).replace("{dmg}", String(Math.round(F.DMG * k * 100)));
}

/** 이 틱에 보일 알림 (가장 최근 것 하나) */
function notice(s: RunState, text: (key: string) => string, name: (kind: "passive" | "use", id: string) => string): { head: string; sub: string; color: string; at: number } | null {
  const p = s.player;
  const out: { head: string; sub: string; color: string; at: number }[] = [];
  const last = p.trial?.last;
  if (last && s.tick - last.tick < SHOW) {
    if (last.penalty) out.push({ head: text("noticeTrialNo"), sub: text(`trialPen_${last.penalty}`), color: "#ff8a8a", at: last.tick });
    else if (last.score !== undefined) out.push({ head: text("trialResult").replace("{n}", String(last.score)), sub: `${text("noticeChests")} · ${foesUp(p.trial?.total ?? 0, text)}`, color: "#ffd84a", at: last.tick });
    else if (last.kind) {
      // 이 판에 남은 최대 점수 (판 전체 1000점까지)
      const cap = s.trialRun ? trialCap(p) : 1000;
      const sub = `${text(`trialKindHint_${last.kind === 4 || last.kind === 3 ? last.kind : 1}`)}${cap < 1000 ? ` · ${text("noticeTrialCap").replace("{n}", String(cap))}` : ""}`;
      out.push({ head: text(`trialKind_${last.kind}`), sub, color: "#ffd0d0", at: last.tick });
    }
  }
  // 숨은 시련 (시작·라운드·구조물·끝)
  const hn = s.hidden?.on && s.hidden.floor === s.floor ? s.hidden.note : undefined;
  if (hn && s.tick - hn.tick < SHOW) {
    const k = s.hidden!.kind;
    const round = hn.code.startsWith("round");
    const head = hn.code === "start" ? text(`hiddenName_${k}`) : round ? text("hiddenRound").replace("{n}", hn.code.slice(5)) : text(`hidden_${hn.code}`);
    const sub = hn.code === "start" ? text(`hiddenHint_${k}`) : hn.code === "round3" ? text(`hiddenLast_${k}`) : hn.code === "clear" ? text("hiddenClearSub") : "";
    out.push({ head, sub, color: hn.code === "clear" ? "#ffd84a" : "#c8a0ff", at: hn.tick });
  }
  // 미리 정한 길로 가는 중 (sim/routeGo)
  if (p.routeGo) out.push({ head: text("routeGoing"), sub: "", color: "#8ad8ff", at: s.tick });
  const got = p.trial?.got;
  if (got && s.tick - got.tick < SHOW) {
    const [k, id = ""] = got.code.split(":");
    const sub = k === "rv" ? text("trialChestRevive") : k === "pp" ? name("passive", id) : k === "pu" ? name("use", id) : `${text(`gymStat_${id}`)} +10%`;
    out.push({ head: text("noticeGot"), sub, color: "#ffd84a", at: got.tick });
  }
  const g = p.gamble;
  if (g && g.win !== undefined && g.pickAt !== undefined && s.tick - g.pickAt < SHOW) {
    if (g.win) out.push({ head: text("gambleWin"), sub: "", color: "#ffd84a", at: g.pickAt });
    else out.push({ head: text("noticeGambleLose"), sub: (g.lost ?? []).map((x) => `${text(`gymStat_${x}`)} -10%`).join(" · "), color: "#ff8a8a", at: g.pickAt });
  }
  return out.sort((a, b) => b.at - a.at)[0] ?? null;
}

export function drawRoomNotice(ctx: Ctx, s: RunState, scale: number, text: ((key: string) => string) | undefined, name: (kind: "passive" | "use", id: string) => string): void {
  if (!text) return;
  const n = notice(s, text, name);
  if (!n) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.textAlign = "center";
  const W = ctx.canvas.width;
  const y = Math.round(ctx.canvas.height * 0.3);
  ctx.font = `bold ${Math.round(12 * scale)}px sans-serif`;
  const hw = ctx.measureText(n.head).width;
  ctx.font = `bold ${Math.round(9 * scale)}px sans-serif`;
  const sw = ctx.measureText(n.sub).width;
  const w = Math.max(hw, sw) + 36 * scale;
  ctx.fillStyle = "rgba(10, 4, 12, 0.82)";
  ctx.fillRect(W / 2 - w / 2, y - 20 * scale, w, (n.sub ? 36 : 26) * scale);
  ctx.strokeStyle = n.color;
  ctx.lineWidth = Math.max(1, scale);
  ctx.strokeRect(W / 2 - w / 2, y - 20 * scale, w, (n.sub ? 36 : 26) * scale);
  ctx.font = `bold ${Math.round(12 * scale)}px sans-serif`;
  ctx.fillStyle = n.color;
  ctx.fillText(n.head, W / 2, y);
  if (n.sub) {
    ctx.font = `bold ${Math.round(9 * scale)}px sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(n.sub, W / 2, y + 13 * scale);
  }
  ctx.restore();
}
