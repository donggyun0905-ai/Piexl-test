// 제단의 방 창: 성좌 이름 + 세로로 긴 카드 셋 (거래 · 증강 · 무시). 누른 것은 입력 menu → sim/altar
// 카드 색·무늬는 성좌마다 (ALTAR_LOOK 색 · 모양은 styles/altar.css)
import { ALTAR, ALTAR_AUG_MIN, ALTAR_OP, ALTARS, menuCode, type AltarId } from "@pixel-rogue/shared";
import type { TextKey } from "../../i18n";
import { ALTAR_LOOK } from "../render/altarLook";

interface Props {
  altar: { id: AltarId; passives: number; augTaken: boolean; augOk: boolean };
  t: (key: TextKey) => string;
  send: (code: number) => void;
}

export function AltarPanel({ altar, t, send }: Props) {
  const { id } = altar;
  const look = ALTAR_LOOK[id];
  const [a, b] = ALTARS[id].skills;
  const skill = (k: string) => t(`swarmSkill_${k}` as TextKey);
  const hit = id === "unknown" ? t("altarHit_unknown") : `${t(`altarHit_${id}` as TextKey)} ${t("altarOrPassives")}`;
  const cards: { head: TextKey; body: string; off?: boolean }[] = [
    { head: "altarCardTrade", body: t(`altarTrade_${id}` as TextKey) },
    {
      head: altar.augTaken ? "altarCardSwap" : "altarCardAug",
      body: altar.augTaken
        ? t(altar.augOk ? "altarAugSwap" : "altarAugSwapNo").replace("{a}", skill(a)).replace("{b}", skill(b)).replace("{hp}", String(ALTAR.swapHp))
        : altar.passives >= ALTAR_AUG_MIN
          ? t("altarAugDesc").replace("{a}", skill(a)).replace("{b}", skill(b))
          : t("altarAugNone"),
      off: !altar.augOk,
    },
    { head: "altarCardIgnore", body: t("altarIgnoreDesc").replace("{a}", hit) },
  ];
  return (
    <div className="station-window altar" role="dialog" aria-label={t(`altar_${id}` as TextKey)} style={{ ["--al-a" as string]: look.main, ["--al-b" as string]: look.glow }}>
      <header className="altar-head">
        <b>{t(`altar_${id}` as TextKey)}</b>
        <small>{t("altarHead")} · {t("altarMust")}</small>
      </header>
      <div className="altar-cards">
        {cards.map((c, i) => (
          <button key={c.head} type="button" className={`altar-card c${i}`} disabled={c.off} onClick={() => send(menuCode(ALTAR_OP, i))}>
            <span className="altar-card-sigil" aria-hidden="true">
              {look.sigil}
            </span>
            <b>{t(c.head)}</b>
            <span>{c.body}</span>
          </button>
        ))}
      </div>
      <small className="altar-close">{t("stationClose")}</small>
    </div>
  );
}
