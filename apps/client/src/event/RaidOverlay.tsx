// 레이드 방 화면 위: 컷신(전체 화면 그림, 그동안 게임은 멈춤) · 데스 카운트 · 다시 살아나기까지 · 관전 · 어둠의 세계·돔·검기 안내
import { RAID_LIVES, raidFighting, raidOut, stunWarn, TICK_RATE, type LucCut, type RunState } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import type { TextKey } from "../i18n";

const CUT_GIF: Record<LucCut, string> = { pillars: "cut_pillars.webp", change: "cut_change.webp", p2: "cut_p2.webp", death: "cut_death.webp" };
const RESPAWN = 180;
/** 사슬 방향 (0 위 · 1 오른쪽 · 2 아래 · 3 왼쪽, sim/bossBinds) */
const ARROWS = ["↑", "→", "↓", "←"];

export function RaidOverlay({ run, t }: { run: RunState; t: (key: TextKey) => string }) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 100);
    return () => clearInterval(id);
  }, []);
  if (!raidFighting(run)) return null;
  const f = run.raidBoss?.fight;
  const p = run.player;
  const deaths = p.raidDeaths ?? 0;
  const down = p.hp <= 0 && p.raidDownAt !== undefined;
  const wait = down ? Math.max(0, Math.ceil((RESPAWN - (run.tick - p.raidDownAt!)) / TICK_RATE)) : 0;
  const wingLeft = f?.p2 === "wings" ? Math.max(0, Math.ceil(((f.fallAt ?? 0) - run.tick) / TICK_RATE)) : 0;
  const note = p.raidDark
    ? t("raidDarkText")
    : f?.dome
      ? t("raidDomeText")
      : f?.safe
        ? t("raidSlashText")
        : f?.p2 === "rain"
          ? t("raidRainText")
          : f?.p2 === "wings" && !p.raidWing
            ? t("raidWingText").replace("{s}", String(wingLeft))
            : f && stunWarn(run, f)
              ? t("raidStunText")
              : "";
  const chain = p.chains && p.chains.length > 0 && (p.chainTicks ?? 0) > 0 ? p.chains : null;
  return (
    <>
      {f?.cut && (
        <div className="raid-cut" key={`${f.cut}-${f.cutEnd}`}>
          <img src={`${import.meta.env.BASE_URL}raid/lucifer/${CUT_GIF[f.cut]}?k=${f.cutEnd}`} alt="" />
        </div>
      )}
      <div className="raid-hud">
        <b className={deaths >= RAID_LIVES - 2 ? "danger" : ""}>💀 {t("raidDeaths").replace("{n}", String(deaths)).replace("{max}", String(RAID_LIVES))}</b>
        {down && !raidOut(p) && <span>{t("raidRespawn").replace("{s}", String(wait))}</span>}
        {raidOut(p) && <span className="danger">{t("raidOutText")}</span>}
        {(p.raidCut ?? 0) > 0 && <span className="danger">{t("raidCutText")}</span>}
      </div>
      {note && !f?.cut && <div className={`raid-note ${p.raidDark ? "dark" : ""}`}>{note}</div>}
      {chain && !f?.cut && (
        <div className="raid-chain" aria-label={t("raidChainText")}>
          <small>{t("raidChainText")}</small>
          <div>
            {chain.map((d, i) => (
              <b key={i} className={i === 0 ? "now" : ""}>
                {ARROWS[d]}
              </b>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
