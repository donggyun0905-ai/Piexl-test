// 대장간 창 (대장장이 앞 F, sim/forge): 지금 무기(노란 별 강화 · 보라 별 암흑 강화 · 꼬리표) + 무기 강화 · 꼬리표 변환 · 암흑 강화
// 누른 것은 입력 menu (FORGE_OP) · 결과 연출은 StationResultFx
import { useState } from "react";
import { FORGE_OP, FORGE_RULES as F, ITEM_TAGS, menuCode, RAID_OP } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../../i18n";
import { itemName } from "../../i18n/items";
import { ItemIcon } from "../itemIcon";
import { StationResultFx } from "../StationResultFx";
import type { StationView } from "../stationView";
import { TagChip } from "../build/TagChip";
import { ForgeStars } from "./ForgeStars";

interface Props {
  view: StationView;
  forge: NonNullable<StationView["forge"]>;
  lang: Lang;
  t: (key: TextKey) => string;
  send: (code: number) => void;
}

const pct = (v: number) => Math.round(v * 100);

export function ForgePanel({ view, forge, lang, t, send }: Props) {
  // 꼬리표 변환 대상: 0 = 무기, k+1 = k번째 패시브
  const [target, setTarget] = useState(0);
  const [up, tagCost, dark] = forge.costs;
  const afford = (c: number) => c >= 0 && view.gold >= c;
  const cost = (c: number) => (c < 0 ? t("forgeMax") : c === 0 ? t("forgeFree") : `${c}G`);
  const pickedTag = target === 0 ? forge.tag : forge.passives[target - 1]?.tag;
  return (
    <div className="station-window forge" role="dialog" aria-label={t("forgeTitle")}>
      <header className="station-head">
        <b>{t("forgeTitle")}</b>
        <span className="station-gold">
          {t("stationGold")} <strong>{view.gold}G</strong>
        </span>
        <small>{t("stationClose")}</small>
      </header>
      <div className="forge-weapon">
        <ItemIcon item={{ kind: "weapon", id: forge.weapon }} size={40} />
        <b>{itemName("weapon", forge.weapon, lang)}</b>
        <ForgeStars lv={forge.lv} dark={forge.dark} />
        {forge.tag && <TagChip tag={forge.tag} />}
      </div>
      <div className="forge-ops">
        <section className="forge-op">
          <h3>⚒ {t("forgeUp")}</h3>
          <p>{t("forgeUpDesc").replace("{p}", String(pct(forge.chance))).replace("{d}", String(pct(F.UP_DMG)))}</p>
          <button type="button" className="forge-btn" disabled={!afford(up)} onClick={() => send(menuCode(FORGE_OP.up, 0))}>
            +{forge.lv} → +{forge.lv + 1} · {cost(up)}
          </button>
        </section>
        <section className="forge-op dark">
          <h3>☠ {t("forgeDark")}</h3>
          <p>{t("forgeDarkDesc").replace("{p}", String(pct(F.DARK_CHANCE))).replace("{d}", String(pct(F.DARK_DMG)))}</p>
          <button type="button" className="forge-btn dark" disabled={!afford(dark)} onClick={() => send(menuCode(FORGE_OP.dark, 0))}>
            +{forge.dark} → +{forge.dark + 1} · {cost(dark)}
          </button>
        </section>
      </div>
      <section className="forge-op tag">
        <h3>✦ {t("forgeTag")} · {cost(tagCost)}</h3>
        <p>{t("forgeTagDesc")}</p>
        <div className="forge-targets">
          <button type="button" className={target === 0 ? "on" : ""} onClick={() => setTarget(0)}>
            <ItemIcon item={{ kind: "weapon", id: forge.weapon }} size={24} />
          </button>
          {forge.passives.map((x, k) => (
            <button key={`${x.id}${k}`} type="button" className={target === k + 1 ? "on" : ""} title={itemName("passive", x.id, lang)} onClick={() => setTarget(k + 1)}>
              <ItemIcon item={{ kind: "passive", id: x.id }} size={24} />
            </button>
          ))}
        </div>
        <div className="forge-tags">
          {ITEM_TAGS.map((g, i) => (
            <span key={g} className={g === pickedTag ? "now" : ""}>
              <TagChip tag={g} onClick={afford(tagCost) && g !== pickedTag ? () => send(menuCode(FORGE_OP.tag, target, i)) : undefined} />
            </span>
          ))}
        </div>
      </section>
      {/* 레이드 대장간: 999원으로 처음부터 다시 (3번까지, sim/raidPrep) */}
      {forge.resets !== undefined && (
        <button type="button" className="forge-btn forge-reset" disabled={forge.resets <= 0} onClick={() => send(menuCode(RAID_OP.forgeReset, 0))}>
          {t("raidForgeReset").replace("{n}", String(forge.resets))}
        </button>
      )}
      <StationResultFx last={view.last} lang={lang} t={t} />
    </div>
  );
}
