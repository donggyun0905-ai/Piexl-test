// 캐릭터 카드 오른쪽 위 훈장 4칸 (이 캐릭터로 깬 라스트 보스 · 모드 기록 · 타워 디펜스 공용): 누르면 정보(깬 판의 한 판 요약) → 바꾸기 · 빈칸은 바로 고르기
import type { CharacterId } from "@pixel-rogue/shared";
import { useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { raidTime } from "../daily/raidTime";
import { RunSummary } from "../game/RunSummary";
import { Modal } from "../menu/Modal";
import { MedalArt } from "./MedalArt";
import { tabooTier } from "../taboo/tabooStore";
import { isMode, medalLook, type ModeKind } from "./modeMedals";
import { loadMedals, loadSlots, medalId, medalsOf, saveSlots, type Medal } from "./medals";

const BOSS_NAME: Record<string, TextKey> = { dragon: "bossDragon", godeater: "bossGodEater", plight: "bossPrimeval" };
const MODE_NAME: Record<ModeKind, TextKey> = { endless: "endlessRun", arena: "arenaRun", hero: "heroRun", td: "tdRun", tdAbyss: "tdRun" };
const RECORD: Record<ModeKind, TextKey> = { endless: "medalRecEndless", arena: "medalRecArena", hero: "medalRecHero", td: "medalRecTd", tdAbyss: "medalRecTdAbyss" };

interface Props {
  t: (key: TextKey) => string;
  lang: Lang;
  character: CharacterId;
}

export function CardMedals({ t, lang, character }: Props) {
  const [medals] = useState(loadMedals);
  const [slots, setSlots] = useState(() => loadSlots(character));
  /** 열린 칸과 창 (정보 · 고르기) */
  const [open, setOpen] = useState<{ slot: number; mode: "info" | "choose" } | null>(null);
  const name = (m: Medal) => (isMode(m.boss) ? t(MODE_NAME[m.boss]) + (m.boss === "td" ? ` · ${t("tdMap_sky")}` : m.boss === "tdAbyss" ? ` · ${t("tdMap_abyss")}` : "") : t(BOSS_NAME[m.boss] ?? "bossDragon"));
  const title = (m: Medal) => (isMode(m.boss) ? t("medalModeTitle").replace("{mode}", name(m)) : t("medalTitle").replace("{boss}", name(m)));
  /** 작은 줄: 모드는 기록, 보스는 시간 */
  const record = (m: Medal) => (isMode(m.boss) ? t(RECORD[m.boss]).replace("{n}", String(m.value ?? 0)) : raidTime(m.ticks));
  const charName = (m: Medal) => (m.character === "all" ? t("medalAll") : t(m.character as TextKey));
  const art = (m: Medal, size: number) => <MedalArt boss={m.boss} character={m.character} size={size} {...medalLook(m)} />;

  const put = (slot: number, id: string | null) => {
    // 이미 다른 칸에 단 훈장이면 그 칸은 비움 (같은 훈장 두 번 안 닮)
    const next = slots.map((x) => (x === id ? null : x));
    next[slot] = id;
    setSlots(next);
    saveSlots(character, next);
    setOpen(null);
  };

  const slotButton = (i: number) => {
    const m = slots[i] ? medals[slots[i]!] : undefined;
    return (
      <button
        key={i}
        type="button"
        className={`medal-slot${m ? " filled" : ""}`}
        title={m ? `${title(m)} · ${record(m)}` : t("medalEmpty")}
        onClick={() => setOpen({ slot: i, mode: m ? "info" : "choose" })}
      >
        {m && art(m, 26)}
      </button>
    );
  };

  const cur = open && slots[open.slot] ? medals[slots[open.slot]!] : undefined;
  const all = medalsOf(medals, character);

  return (
    <div className="card-medals">
      {[0, 1, 2, 3].map(slotButton)}

      {open?.mode === "info" && cur && (
        <Modal title={title(cur)} t={t} onClose={() => setOpen(null)} className="medal-info">
          <div className="medal-head">
            {art(cur, 96)}
            <dl>
              <dt>{t("medalChar")}</dt>
              <dd>{charName(cur)}</dd>
              <dt>{t(isMode(cur.boss) ? "medalRecord" : "medalTime")}</dt>
              <dd>{record(cur)}</dd>
              {cur.taboo && (
                <>
                  <dt>{t("medalTaboo")}</dt>
                  <dd className={`taboo-tier-${tabooTier(cur.taboo)}`}>{cur.taboo}</dd>
                </>
              )}
              <dt>{t("medalDate")}</dt>
              <dd>{cur.date}</dd>
            </dl>
          </div>
          {cur.summary && <RunSummary d={cur.summary} t={t} lang={lang} />}
          <button type="button" className="primary medal-change" onClick={() => setOpen({ slot: open.slot, mode: "choose" })}>
            {t("medalChange")}
          </button>
        </Modal>
      )}

      {open?.mode === "choose" && (
        <Modal title={t("medalChoose")} t={t} onClose={() => setOpen(null)} className="medal-chooser">
          {all.length === 0 && <p className="hint">{t("medalNone")}</p>}
          <div className="medal-grid">
            {all.map((m) => {
              const id = medalId(m);
              return (
                <button key={id} type="button" className={`medal-choice${slots.includes(id) ? " worn" : ""}`} onClick={() => put(open.slot, id)}>
                  {art(m, 56)}
                  <strong>{name(m)}</strong>
                  {m.taboo && <small className={`taboo-tier-${tabooTier(m.taboo)}`}>{t("tabooPts").replace("{n}", String(m.taboo))}</small>}
                  <small>{record(m)}</small>
                  {slots.includes(id) && <em>{t("medalWorn")}</em>}
                </button>
              );
            })}
          </div>
          {slots[open.slot] && (
            <button type="button" className="secondary medal-remove" onClick={() => put(open.slot, null)}>
              {t("medalRemove")}
            </button>
          )}
        </Modal>
      )}
    </div>
  );
}

