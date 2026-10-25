// 광야의 새벽 위쪽 정보: 시간·레벨·경험치 막대·처치 수 · 무기 4칸·패시브 6칸(레벨, 각성은 금빛) · 알림(보스·황금 상자) · 특수 이벤트 안내
import { SWARM, TICK_RATE, weaponLv, xpNeed, type PassiveId, type RunState, type WeaponId } from "@pixel-rogue/shared";
import { useState } from "react";
import { formatTime } from "../game/hudText";
import { ItemIcon } from "../game/itemIcon";
import { ItemTip, tipPos, type TipPos } from "../game/ItemTip";
import type { Lang, TextKey } from "../i18n";
import { itemDesc, itemName } from "../i18n/items";
import { comboLine, pips, skillLine } from "./swarmInfo";

type Tip = { kind: "weapon"; id: WeaponId; evo: boolean; pos: TipPos } | { kind: "passive"; id: PassiveId; pos: TipPos };

/** 알림을 보여 주는 틱 */
const NOTE_TICKS = TICK_RATE * 3;

function note(run: RunState, lang: Lang, t: (k: TextKey) => string): string {
  const sw = run.swarm!;
  const r = sw.reward;
  if (r && run.tick - r.tick < NOTE_TICKS) {
    return r.kind === "evo" ? t("swarmEvo").replace("{name}", itemName("weapon", r.id, lang)) : t("swarmGot").replace("{name}", itemName("passive", r.id, lang)).replace("{lv}", String(r.lv));
  }
  const end = sw.eventEnd;
  if (end && run.tick - end.tick < NOTE_TICKS) return t(end.ok ? "swarmEventWin" : "swarmEventLose");
  const last = SWARM.bossSec.length - 1;
  const boss = SWARM.bossSec.findIndex((sec) => run.tick >= sec * TICK_RATE && run.tick < sec * TICK_RATE + NOTE_TICKS);
  if (boss >= 0) return t(boss === last ? "swarmFinalBoss" : "swarmBoss");
  return "";
}

/** 지금 이벤트 안내 (남은 초·남은 적) */
function eventLine(run: RunState, t: (k: TextKey) => string): string {
  const ev = run.swarm!.event;
  if (!ev) return "";
  const sec = String(Math.max(0, Math.ceil((ev.until - run.tick) / TICK_RATE)));
  const left = String(run.enemies.filter((e) => e.hp > 0 && ev.ids?.includes(e.id)).length);
  return t(`swarmEv_${ev.kind}` as TextKey).replace("{s}", sec).replace("{n}", left);
}

export function SwarmHud({ run, lang, t }: { run: RunState; lang: Lang; t: (k: TextKey) => string }) {
  const [tip, setTip] = useState<Tip | null>(null);
  const sw = run.swarm;
  if (!sw) return null;
  const msg = note(run, lang, t);
  const ev = eventLine(run, t);
  const at = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    return tipPos(r.left + r.width / 2, r.top, r.bottom + 6);
  };
  return (
    <div className="swarm-hud" aria-live="polite">
      <div className="swarm-top">
        <span className="swarm-time">⏱ {formatTime(run.tick)}</span>
        <span>Lv {sw.lv}</span>
        <span>
          {t("swarmKills")} {sw.kills}
        </span>
        {sw.endless && <span className="swarm-endless">∞ {t("swarmEndless")}</span>}
      </div>
      <div className="swarm-xp">
        <span style={{ width: `${Math.min(100, (sw.xp / xpNeed(sw.lv)) * 100)}%` }} />
      </div>
      <div className="swarm-slots">
        {sw.weapons.map((w) => (
          <span
            key={w.id}
            className={`swarm-slot${(w.ghost ? w.ghost.p.svEvo : run.player.svEvo) ? " evo" : ""}`}
            onPointerEnter={(e) => setTip({ kind: "weapon", id: w.id, evo: !!(w.ghost ? w.ghost.p.svEvo : run.player.svEvo), pos: at(e.currentTarget) })}
            onPointerLeave={() => setTip(null)}
          >
            <ItemIcon item={{ kind: "weapon", id: w.id }} size={22} />
            <small>{weaponLv(run, w.id)}</small>
          </span>
        ))}
        <span className="swarm-gap" />
        {sw.passives.map((p) => (
          <span key={p.id} className="swarm-slot passive" onPointerEnter={(e) => setTip({ kind: "passive", id: p.id, pos: at(e.currentTarget) })} onPointerLeave={() => setTip(null)}>
            <ItemIcon item={{ kind: "passive", id: p.id }} size={18} />
            <small>{p.lv}</small>
          </span>
        ))}
      </div>
      {tip && (
        <ItemTip pos={tip.pos} icon={tip.kind === "weapon" ? { kind: "weapon", id: tip.id } : { kind: "passive", id: tip.id }} name={`${itemName(tip.kind, tip.id, lang)} · Lv ${tip.kind === "weapon" ? weaponLv(run, tip.id) : (sw.passives.find((p) => p.id === tip.id)?.lv ?? 1)}`} desc={itemDesc(tip.kind, tip.id, lang, t)}>
          <div className="swarm-tip-pips">{pips(tip.kind === "weapon" ? weaponLv(run, tip.id) : (sw.passives.find((p) => p.id === tip.id)?.lv ?? 1), SWARM.maxLevel)}</div>
          {comboLine(run, tip.kind, tip.id, lang, t) && <div className="swarm-combo">🔗 {comboLine(run, tip.kind, tip.id, lang, t)}</div>}
          {tip.kind === "weapon" && <div className="swarm-skill">{tip.evo ? `★ ${t("swarmEvoDone")}` : ""}</div>}
          {tip.kind === "weapon" && <div className="swarm-skill">✦ {skillLine(tip.id, t)}</div>}
        </ItemTip>
      )}
      {ev && <p className={`swarm-event ${sw.event?.kind ?? ""}`}>{ev}</p>}
      {msg && <p className="swarm-note">{msg}</p>}
    </div>
  );
}
