// 패왕전 밴픽 화면 (혼자 하기 PwDraftSolo · 같이 하기 PwRoom): 왼쪽 우리 편 · 가운데 큰 캐릭터 목록(진영 탭·이름 찾기) · 오른쪽 상대 편
// 위쪽 차례·제한 시간 · 아래 누른 캐릭터의 스킬 보기 · 우리 편 AI 말
import { CHARACTER_IDS, draftDone, draftSize, draftTaken, draftTeam, draftTurn, type CharacterId, type PwDraft } from "@pixel-rogue/shared";
import { useEffect, useState, type ReactNode } from "react";
import type { Lang, TextKey } from "../i18n";
import { FACTION_TEXT } from "../i18n/story/world";
import { SkinPreview } from "../shop/SkinPreview";
import { FACTIONS, type FactionId } from "../story/storyData";
import { PwSkillList } from "./PwSkillList";

/** 캐릭터 고르기 탭 (아카식은 숨은 캐릭터뿐이라 없음) */
const TABS: readonly FactionId[] = ["ascalon", "terracore", "helios", "virdia"];
/** 진영 소속 (버려진 자들은 세 아이 이름으로 들어 있음) */
const inFaction = (f: FactionId, c: CharacterId) => !!FACTIONS.find((x) => x.id === f)?.members.some((m) => m === c || (c === "abandoned" && m === "cain"));

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
  const [tab, setTab] = useState<FactionId | null>(null);
  const [find, setFind] = useState("");
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
  const q = find.trim().toLowerCase();
  const list = CHARACTER_IDS.filter((c) => (!tab || inFaction(tab, c)) && (!q || t(c).toLowerCase().includes(q)));
  const say = d.turns
    .slice(0, d.at)
    .filter((x) => !x.ban && x.team === myTeam && x.seat !== me && ai[x.seat])
    .map((x) => `${names[x.seat]}: ${t("pwDraftAiSay").replace("{c}", t(d.picks[x.seat]!))}`);
  // 왼쪽은 우리 편, 오른쪽은 상대 편
  const team = (k: 0 | 1) => (
    <aside className={`pw-draft-team ${k === myTeam ? "ours" : "theirs"} ${turn && turn.team === k && !done ? "turn" : ""}`}>
      <h4>{teamName(k)}</h4>
      {Array.from({ length: size }, (_, j) => {
        const seat = k * size + j;
        const c = d.picks[seat];
        return (
          <button key={seat} type="button" className={`pw-draft-seat ${turn && !turn.ban && turn.seat === seat ? "now" : ""} ${seat === me ? "me" : ""}`} onClick={() => c && setSel(c)}>
            {c ? <SkinPreview sheet={c} size={64} /> : <span className="pw-draft-empty">?</span>}
            <span>
              <b>{names[seat] ?? "AI"}</b>
              <small>{c ? t(c) : ""}</small>
            </span>
          </button>
        );
      })}
      <div className="pw-draft-bans">
        <small>{t("pwDraftBans")}</small>
        {d.bans.map((c, i) => banTeams[i] === k && <span key={i}>{c ? <SkinPreview sheet={c} size={40} /> : "—"}</span>)}
      </div>
    </aside>
  );
  return (
    <div className="pw-draft pw-skills">
      <header className="pw-draft-top">
        <h2>{t("pwDraft")}</h2>
        <p className={mine && !done ? "mine" : ""}>{mine && !done ? `${t("pwDraftMine")} · ${status}` : status}</p>
        {!done && <b className="pw-draft-sec">{sec}</b>}
      </header>
      <div className="pw-draft-main">
        {team(myTeam as 0 | 1)}
        <section className="pw-draft-center">
          <div className="pw-draft-tabs">
            <button type="button" className={!tab ? "on" : ""} onClick={() => setTab(null)}>
              {t("pwDraftAll")}
            </button>
            {TABS.map((f) => (
              <button key={f} type="button" className={tab === f ? "on" : ""} style={{ ["--fc" as string]: FACTIONS.find((x) => x.id === f)?.color }} onClick={() => setTab(f)}>
                {FACTION_TEXT[f].name[lang]}
              </button>
            ))}
            <input type="search" value={find} placeholder={t("pwDraftSearch")} onChange={(e) => setFind(e.target.value)} />
          </div>
          <div className="pw-draft-grid">
            {list.map((c) => (
              <button key={c} type="button" className={`${c === sel ? "on" : ""} ${taken.has(c) ? "taken" : ""}`} onClick={() => setSel(c)}>
                <SkinPreview sheet={c} size={72} />
                <small>{t(c)}</small>
              </button>
            ))}
          </div>
          {mine && turn && !done && (
            <div className="pw-prep-actions pw-draft-act">
              <button type="button" className="primary big" disabled={!sel || taken.has(sel)} onClick={() => sel && (onAct(sel), setSel(null))}>
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
        </section>
        {team((1 - myTeam) as 0 | 1)}
      </div>
      <div className="pw-draft-bottom">
        {look && (
          <div className="pw-draft-look">
            <h3>{t(look)}</h3>
            <PwSkillList characterId={look} lang={lang} t={t} />
          </div>
        )}
        <div>
          {say.map((l) => (
            <p key={l} className="pw-draft-say">
              {l}
            </p>
          ))}
          <p className="hint">{t("pwDraftHint")}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
