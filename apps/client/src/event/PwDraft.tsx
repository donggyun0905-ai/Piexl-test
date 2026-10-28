// 패왕전 밴픽 화면 (혼자 하기 PwDraftSolo · 친구 방·랭크전 PwRoomDraft, 모두 같은 화면): 왼쪽 우리 편 · 가운데 큰 캐릭터 목록(역할 탭·이름 찾기) · 오른쪽 상대 편
// 위쪽 차례·제한 시간 · 아래 밴·확정 · 우리 편 AI 말 (스킬은 다음 준비 화면에서 써 봄)
import { CHARACTER_IDS, draftBlind, draftDone, draftSize, draftTaken, draftTeam, draftTurn, type CharacterId, type PwDraft } from "@pixel-rogue/shared";
import { useEffect, useState, type ReactNode } from "react";
import type { TextKey } from "../i18n";
import { SkinPreview } from "../shop/SkinPreview";
import { PW_ROLES, ROLE_TAG, ROLE_TIP, roleOf, type PwRole } from "./pwRoles";

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
  t: (key: TextKey) => string;
  /** 아래쪽 (채팅·나가기) */
  children?: ReactNode;
}

export function PwDraftView({ d, names, ai, me, mine, endAt, onAct, t, children }: Props) {
  const [sel, setSel] = useState<CharacterId | null>(null);
  const [tab, setTab] = useState<PwRole | null>(null);
  const [find, setFind] = useState("");
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, []);
  const size = draftSize(d.mode);
  const myTeam = me >= 0 ? draftTeam(d.mode, me) : 0;
  const turn = draftTurn(d);
  const taken = draftTaken(d, myTeam);
  const done = draftDone(d);
  // 1대1: 상대 픽은 끝날 때까지 안 보임
  const hide = (seat: number) => draftBlind(d.mode) && !done && draftTeam(d.mode, seat) !== myTeam;
  const sec = Math.max(0, Math.ceil((endAt - now) / 1000));
  const teamName = (team: number) => t(team === myTeam ? "pwDraftOurs" : "pwDraftTheirs");
  const status = done || !turn ? t("pwDraftDone") : turn.ban ? t("pwDraftBanTurn").replace("{team}", teamName(turn.team)) : t("pwDraftPickTurn").replace("{name}", names[turn.seat] ?? "AI");
  // 밴 차례 번호마다 편 (draftTurns 순서 그대로)
  const banTeams = d.turns.filter((x) => x.ban).map((x) => x.team);
  const q = find.trim().toLowerCase();
  const list = CHARACTER_IDS.filter((c) => (!tab || roleOf(c) === tab) && (!q || t(c).toLowerCase().includes(q)));
  const say = d.turns
    .slice(0, d.at)
    .filter((x) => !x.ban && x.team === myTeam && x.seat !== me && ai[x.seat] && !hide(x.seat))
    .map((x) => `${names[x.seat]}: ${t("pwDraftAiSay").replace("{c}", t(d.picks[x.seat]!))}`);
  const role = (c: CharacterId) => (
    <em className="pw-role" title={t(ROLE_TIP[roleOf(c)])}>
      {t(ROLE_TAG[roleOf(c)])}
    </em>
  );
  // 왼쪽은 우리 편, 오른쪽은 상대 편
  const team = (k: 0 | 1) => (
    <aside className={`pw-draft-team ${k === myTeam ? "ours" : "theirs"} ${turn && turn.team === k && !done ? "turn" : ""}`}>
      <h4>{teamName(k)}</h4>
      {Array.from({ length: size }, (_, j) => {
        const seat = k * size + j;
        const c = hide(seat) ? null : d.picks[seat];
        return (
          <div key={seat} className={`pw-draft-seat ${turn && !turn.ban && turn.seat === seat ? "now" : ""} ${seat === me ? "me" : ""}`}>
            {c ? <SkinPreview sheet={c} size={64} /> : <span className="pw-draft-empty">?</span>}
            <span>
              <b>{names[seat] ?? "AI"}</b>
              {c && (
                <small>
                  {t(c)} {role(c)}
                </small>
              )}
            </span>
          </div>
        );
      })}
      <div className="pw-draft-bans">
        <small>{t("pwDraftBans")}</small>
        {d.bans.map((c, i) => banTeams[i] === k && <span key={i}>{c ? <SkinPreview sheet={c} size={40} /> : "—"}</span>)}
      </div>
    </aside>
  );
  return (
    <div className="pw-draft">
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
            {PW_ROLES.map((r) => (
              <button key={r} type="button" className={tab === r ? "on" : ""} title={t(ROLE_TIP[r])} onClick={() => setTab(r)}>
                {t(ROLE_TAG[r])}
              </button>
            ))}
            <input type="search" value={find} placeholder={t("pwDraftSearch")} onChange={(e) => setFind(e.target.value)} />
          </div>
          <div className="pw-draft-grid">
            {list.map((c) => (
              <button key={c} type="button" className={`${c === sel ? "on" : ""} ${taken.has(c) ? "taken" : ""}`} disabled={taken.has(c)} onClick={() => setSel(c)}>
                <SkinPreview sheet={c} size={72} />
                <small>{t(c)}</small>
                {role(c)}
              </button>
            ))}
          </div>
          <div className="pw-draft-act">
            {mine && turn && !done && (
              <>
                <button type="button" className="primary" disabled={!sel || taken.has(sel)} onClick={() => sel && (onAct(sel), setSel(null))}>
                  {turn.ban ? t("pwDraftBan") : t("pwDraftPick")}
                  {sel && ` · ${t(sel)}`}
                </button>
                {turn.ban && (
                  <button type="button" className="ghost" onClick={() => onAct(null)}>
                    {t("pwDraftSkip")}
                  </button>
                )}
              </>
            )}
          </div>
          {say.map((l) => (
            <p key={l} className="pw-draft-say">
              {l}
            </p>
          ))}
          <p className="hint">{t("pwDraftHint")}</p>
        </section>
        {team((1 - myTeam) as 0 | 1)}
      </div>
      {children && <div className="pw-draft-bottom">{children}</div>}
    </div>
  );
}
