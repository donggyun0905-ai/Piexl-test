// 빌드 통계 (아카이브): 먼저 캐릭터를 고르는 화면 → 고르면 다른 사람들이 그 캐릭터로 많이 쓴 무기·패시브 (고른 비율 · 그 판의 클리어율)
// 자료는 혼자 하기 한 판이 끝날 때마다 모임 (서버 buildStats) · 열려 있는 캐릭터만 보임
import { CHARACTER_IDS, createPracticeRun, practiceGive, type CharacterId, type PassiveId, type RunState, type WeaponId } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { characterOpen } from "../characterGoals";
import { ItemIcon } from "../game/itemIcon";
import type { Lang, TextKey } from "../i18n";
import { itemDesc, itemName } from "../i18n/items";
import { hallUnlocked } from "../lobby/exhibits";
import { ownedLimited } from "../shop/limitedChars";
import { StoryFace } from "../story/StoryFace";
import { loadBuild, picks, type BuildData, type PickRow } from "./buildData";

interface Props {
  lang: Lang;
  t: (k: TextKey) => string;
  onBack: () => void;
  /** 연습장에서 써 보기: 그 캐릭터가 이 무기·패시브를 든 채로 시작하는 연습장 판 */
  onTry: (c: CharacterId, run: RunState) => void;
}
const pct = (v: number) => `${Math.round(v * 100)}%`;

function Rows({ kind, rows, lang, t, onTry }: { kind: "weapon" | "passive"; rows: PickRow[]; lang: Lang; t: (k: TextKey) => string; onTry: (id: string) => void }) {
  const [open, setOpen] = useState<string | null>(null);
  if (rows.length === 0) return <p className="build-empty">{t("buildNone")}</p>;
  return (
    <ol className="build-rows">
      {rows.map((r, i) => (
        <li key={r.id}>
          <button type="button" className={`build-row${i < 3 ? ` top r${i + 1}` : ""}`} onClick={() => setOpen(open === r.id ? null : r.id)}>
            <span className="build-rank">{i + 1}</span>
            <ItemIcon item={{ kind, id: r.id as WeaponId & PassiveId }} size={28} />
            <span className="build-name">{itemName(kind, r.id, lang)}</span>
            <span className="build-bar">
              <b style={{ width: pct(r.rate) }} />
            </span>
            <span className="build-num">{pct(r.rate)}</span>
            <span className={`build-num win${r.win >= 0.5 ? " good" : ""}`}>{r.n >= 3 ? pct(r.win) : "-"}</span>
          </button>
          {open === r.id && (
            <p className="build-desc">
              {itemDesc(kind, r.id, lang, t)}
              <button type="button" className="secondary build-try" onClick={() => onTry(r.id)}>
                {t("buildTry")}
              </button>
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

export function BuildScreen({ lang, t, onBack, onTry }: Props) {
  const chars = [...new Set<CharacterId>([...CHARACTER_IDS, ...hallUnlocked(), ...ownedLimited()])].filter((c) => characterOpen(c));
  // 먼저 캐릭터를 고르는 화면 → 고르면 그 캐릭터 통계
  const [who, setWho] = useState<CharacterId | null>(null);
  const [by, setBy] = useState<"rate" | "win">("rate");
  // 받은 통계 (어느 캐릭터 것인지 같이 둠 · 다른 캐릭터를 고르면 올 때까지 '불러오는 중')
  const [got, setGot] = useState<{ c: CharacterId; d: BuildData | null } | null>(null);
  useEffect(() => {
    if (!who) return;
    let live = true;
    void loadBuild(who).then((d) => live && setGot({ c: who, d }));
    return () => {
      live = false;
    };
  }, [who]);
  // Esc: 통계 → 캐릭터 고르기 → 아카이브 밖
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (who) setWho(null);
      else onBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [who, onBack]);
  const data = got && got.c === who ? got.d : "loading";
  const d = data === "loading" ? null : data;
  const tryIt = (kind: "weapon" | "passive") => (id: string) => {
    if (!who) return;
    const run = createPracticeRun(who, Date.now() % 1e6);
    practiceGive(run, kind === "weapon" ? { kind, id: id as WeaponId } : { kind, id: id as PassiveId });
    onTry(who, run);
  };
  return (
    <main className="story-screen build-screen">
      <header className="story-head">
        <h2>{t("buildStats")}</h2>
        <span>{t("archive")}</span>
      </header>
      {!who && (
        <>
          <p className="build-pick-title">{t("buildPick")}</p>
          <div className="build-grid">
            {chars.map((c) => (
              <button key={c} type="button" className="build-card" onClick={() => setWho(c)}>
                <StoryFace who={c} size={56} />
                <span>{t(c as TextKey)}</span>
              </button>
            ))}
          </div>
          <p className="tier-note">{t("buildNote")}</p>
        </>
      )}
      {who && (
        <section className="build-body">
          <div className="build-hero">
            <StoryFace who={who} size={72} />
            <div className="build-hero-text">
              <h3>{t(who as TextKey)}</h3>
              <div className="build-tiles">
                <span>
                  <small>{t("buildRunsLabel")}</small>
                  <b>{d && d.runs > 0 ? d.runs.toLocaleString() : "-"}</b>
                </span>
                <span>
                  <small>{t("buildClear")}</small>
                  <b className="good">{d && d.runs > 0 ? pct(d.wins / d.runs) : "-"}</b>
                </span>
              </div>
            </div>
            <button type="button" className="secondary build-change" onClick={() => setWho(null)}>
              {t("buildChange")}
            </button>
          </div>
          {data === "loading" && <p className="build-empty">{t("buildLoading")}</p>}
          {data !== "loading" && (!d || d.runs === 0) && <p className="build-empty">{t(d ? "buildNoData" : "buildOffline")}</p>}
          {d && d.runs > 0 && (
            <>
              <nav className="shop-tabs">
                <button type="button" className={by === "rate" ? "active" : ""} onClick={() => setBy("rate")}>
                  {t("buildByRate")}
                </button>
                <button type="button" className={by === "win" ? "active" : ""} onClick={() => setBy("win")}>
                  {t("buildByWin")}
                </button>
              </nav>
              <div className="build-cols">
                <div className="build-panel">
                  <h4>
                    {t("buildWeapons")} <small>{t("buildCols")}</small>
                  </h4>
                  <Rows kind="weapon" rows={picks(d, "weapons", by).slice(0, 6)} lang={lang} t={t} onTry={tryIt("weapon")} />
                </div>
                <div className="build-panel">
                  <h4>
                    {t("buildPassives")} <small>{t("buildCols")}</small>
                  </h4>
                  <Rows kind="passive" rows={picks(d, "passives", by).slice(0, 20)} lang={lang} t={t} onTry={tryIt("passive")} />
                </div>
              </div>
            </>
          )}
        </section>
      )}
      <button type="button" className="secondary" onClick={who ? () => setWho(null) : onBack}>
        {t("back")}
      </button>
    </main>
  );
}
