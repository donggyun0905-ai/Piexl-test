// 광야의 새벽 레벨 업 창: 후보 카드 3장 (종류 띠·아이콘·이름·레벨 점·설명·조합 짝·각성 기술). 다 키운 뒤엔 회복·돈·힘. 누르거나 1~3 키로 고름
import { SWARM, type RunState, type SwarmChoice } from "@pixel-rogue/shared";
import { useEffect } from "react";
import { ItemIcon } from "../game/itemIcon";
import type { Lang, TextKey } from "../i18n";
import { itemDesc, itemName } from "../i18n/items";
import { comboLine, pips, skillLine } from "./swarmInfo";

interface Props {
  run: RunState;
  choices: SwarmChoice[];
  lang: Lang;
  t: (k: TextKey) => string;
  onPick: (i: number) => void;
}

/** 다 키운 뒤 보너스 카드: 그림 · 글자 */
const BONUS = { heal: ["❤", "swarmHeal"], gold: ["🪙", "swarmGold"], might: ["⚔", "swarmMight"] } as const;

function Card({ run, c, lang, t }: { run: RunState; c: SwarmChoice; lang: Lang; t: (k: TextKey) => string }) {
  if (c.kind === "heal" || c.kind === "gold" || c.kind === "might") {
    const [icon, key] = BONUS[c.kind];
    return (
      <>
        <span className="swarm-bonus-icon">{icon}</span>
        <strong>{t(key)}</strong>
        {c.kind === "might" && (run.player.svMight ?? 0) > 0 && <small>× {(run.player.svMight ?? 0) + 1}</small>}
      </>
    );
  }
  const combo = comboLine(run, c.kind, c.id, lang, t);
  return (
    <>
      <span className={`swarm-kind ${c.kind}`}>{t(c.kind === "weapon" ? "swarmKindWeapon" : "swarmKindPassive")}</span>
      <span className="swarm-card-head">
        <ItemIcon item={c.kind === "weapon" ? { kind: "weapon", id: c.id } : { kind: "passive", id: c.id }} size={36} />
        <strong>{itemName(c.kind, c.id, lang)}</strong>
      </span>
      <span className={c.lv === 1 ? "swarm-lv new" : "swarm-lv"}>{c.lv === 1 ? t("swarmNew") : `Lv ${c.lv} ${pips(c.lv, SWARM.maxLevel)}`}</span>
      <small>{itemDesc(c.kind, c.id, lang, t)}</small>
      {combo && <small className="swarm-combo">🔗 {combo}</small>}
      {c.kind === "weapon" && <small className="swarm-skill">✦ {skillLine(c.id, run.player.characterId, t)}</small>}
    </>
  );
}

export function SwarmLevelUp({ run, choices, lang, t, onPick }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const i = Number(e.key) - 1;
      if (i >= 0 && i < choices.length) onPick(i);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choices, onPick]);
  const maxed = choices.every((c) => c.kind === "heal" || c.kind === "gold" || c.kind === "might");

  return (
    <div className="game-overlay swarm-levelup">
      <div className="modal">
        <h2 className="swarm-lvup-title">
          ✨ {t("swarmLevelUp")} <span>Lv {run.swarm?.lv}</span>
        </h2>
        {maxed && <p className="swarm-allmax">{t("swarmAllMax")}</p>}
        <div className="swarm-cards">
          {choices.map((c, i) => (
            <button key={i} type="button" className={`swarm-card ${c.kind}`} onClick={() => onPick(i)}>
              <Card run={run} c={c} lang={lang} t={t} />
              <kbd>{i + 1}</kbd>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
