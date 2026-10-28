// 패왕전 밴픽 화면 (혼자 하기 PwDraftSolo · 같이 하기 PwRoom): 두 편 자리 · 밴 · 캐릭터 목록 · 제한 시간 · 누른 캐릭터의 스킬 보기 · 우리 편 AI 말
import { CHARACTER_IDS, draftDone, draftSize, draftTaken, draftTeam, draftTurn, type CharacterId, type PwDraft } from "@pixel-rogue/shared";
import { useEffect, useState, type ReactNode } from "react";
import type { Lang, TextKey } from "../i18n";
import { SkinPreview } from "../shop/SkinPreview";
import { PwSkillList } from "./PwSkillList";

interface Props {
  d: PwDraft;
  /** 자리마다 이름 · AI 자리인지 */
  names: readonly string[];
  ai: readonly boolean[];
  /** 내 자리 (-1 = 보기만) · 지금 차례가 내 것인지 */
  me: number;
  mine: boolean;
  endAt: number;
  onAct: (c: CharacterId | null) => void;
  lang: Lang;
  t: (key: TextKey) => string;
  children?: ReactNode;
}

export function PwDraftView({ d, names, ai, me, mine, endAt, onAct, lang, t, children }: Props) {
  const [sel, setSel] = useState<CharacterId | null>(null);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, []);
  const size = draftSize(d.mode);
  const myTeam = me >= 0 ? draftTeam(d.mode, me) : 0;
  const turn = draftTurn(d);
  const taken = draftTaken(d);
  const done = draftDone(d);
  const sec = Math.max(0, Math.ceil((endAt - now) / 1000));
  const teamName = (team: number) => t(team === myTeam ? "pwDraftOurs" : "pwDraftTheirs");
  const status = done || !turn ? t("pwDraftDone") : turn.ban ? t("pwDraftBanTurn").replace("{team}", teamName(turn.team)) : t("pwDraftPickTurn").replace("{name}", names[turn.seat] ?? "AI");
  // 밴 차례 번호마다 편 (draftTurns 순서 그대로)
  const banTeams = d.turns.filter((x) => x.ban).map((x) => x.team);
  const look = sel ?? d.picks[me] ?? null;
  const say = d.turns
    .slice(0, d.at)
    .filter((x) => !x.ban && x.team === myTeam && x.seat !== me && ai[x.seat])
    .map((x) => `${names[x.seat]}: ${t("pwDraftAiSay").replace("{c}", t(d.picks[x.seat]!))}`);
  const team = (k: 0 | 1) => (
    <div className={`pw-draft-team ${k === myTeam ? "ours" : "theirs"}`}>
      <h4>{teamName(k)}</h4>
      {Array.from({ length: size }, (_, j) => {
        const seat = k * size + j;
        const c = d.picks[seat];
        return (
          <button key={seat} type="button" className={`pw-draft-seat ${turn && !turn.ban && turn.seat === seat ? "now" : ""} ${seat === me ? "me" : ""}`} onClick={() => c && setSel(c)}>
            {c ? <SkinPreview sheet={c} size={32} /> : <span className="pw-draft-empty">?</span>}
            <span>
              <b>{names[seat] ?? "AI"}</b>
              <small>{c ? t(c) : ""}</small>
            </span>
          </button>
        );
      })}
      <div className="pw-draft-bans">
        {t("pwDraftBans")}:
        {d.bans.map((c, i) => banTeams[i] === k && <span key={i}>{c ? <SkinPreview sheet={c} size={24} /> : "—"}</span>)}
      </div>
    </div>
  );
  return (
    <div className="pw-draft pw-skills">
      <h2>
        {t("pwDraft")} · {status} {!done && <b className="pw-draft-sec">{sec}</b>}
      </h2>
      {mine && !done && <p className="pw-draft-mine">{t("pwDraftMine")}</p>}
      <div className="pw-draft-teams">
        {team(0)}
        {team(1)}
      </div>
      {!done && (
        <div className="pw-draft-grid">
          {CHARACTER_IDS.map((c) => (
            <button key={c} type="button" className={`${c === sel ? "on" : ""} ${taken.has(c) ? "taken" : ""}`} title={t(c)} onClick={() => setSel(c)}>
              <SkinPreview sheet={c} size={32} />
            </button>
          ))}
        </div>
      )}
      {mine && turn && !done && (
        <div className="pw-prep-actions">
          <button type="button" className="primary" disabled={!sel || taken.has(sel)} onClick={() => sel && (onAct(sel), setSel(null))}>
            {turn.ban ? t("pwDraftBan") : t("pwDraftPick")}
            {sel && ` · ${t(sel)}`}
          </button>
          {turn.ban && (
            <button type="button" className="ghost" onClick={() => onAct(null)}>
              {t("pwDraftSkip")}
            </button>
          )}
        </div>
      )}
      {say.length > 0 && (
        <div className="pw-draft-say">
          {say.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
      )}
      {look && (
        <div className="pw-draft-look">
          <h3>{t(look)}</h3>
          <PwSkillList characterId={look} lang={lang} t={t} />
        </div>
      )}
      <p className="hint">{t("pwDraftHint")}</p>
      {children}
    </div>
  );
}
