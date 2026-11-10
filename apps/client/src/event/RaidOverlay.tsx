// 레이드 방 화면 위: 컷신(전체 화면 그림, 그동안 게임은 멈춤) · 데스 카운트 · 다시 살아나기까지 · 관전 · 어둠의 세계·돔·검기 안내
import { allPlayers, deadlySafe, RAID_LIVES, RAID_ROOM, raidFighting, raidOut, raidTimeLeft, stunWarn, TICK_RATE, type LucCut, type RunState } from "@pixel-rogue/shared";
import { watchingSeat } from "../game/camera";
import { useEffect, useState } from "react";
import type { TextKey } from "../i18n";
import { useBoard } from "./PwBoard";
import { RaidBoard } from "./RaidBoard";

const CUT_GIF: Record<LucCut, string> = { pillars: "cut_pillars.webp", change: "cut_change.webp", p2: "cut_p2.webp", death: "cut_death.webp" };
const RESPAWN = 180;
/** 사슬 방향 (0 위 · 1 오른쪽 · 2 아래 · 3 왼쪽, sim/bossBinds) */
const ARROWS = ["↑", "→", "↓", "←"];

export function RaidOverlay({ run, t, names, me }: { run: RunState; t: (key: TextKey) => string; names?: readonly string[]; me?: number }) {
  const [, tick] = useState(0);
  const [board] = useBoard();
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 100);
    return () => clearInterval(id);
  }, []);
  const f = run.raidBoss?.fight;
  // 보상 방: 상자를 열면 장신구 카드 창 (acc/AccCards, 판 밖에서 그림)
  if (run.raidBoss && run.roomId === RAID_ROOM.reward) return null;
  if (!raidFighting(run)) return null;
  // 관전 중에도 데스·다시 살아나기는 내 것 (화면은 보는 사람 자리를 꺼내 놓음)
  const p = (me !== undefined && allPlayers(run)[me]) || run.player;
  const watching = watchingSeat() !== undefined;
  const deaths = p.raidDeaths ?? 0;
  const down = p.hp <= 0 && p.raidDownAt !== undefined;
  const wait = down ? Math.max(0, Math.ceil((RESPAWN - (run.tick - p.raidDownAt!)) / TICK_RATE)) : 0;
  const wingLeft = f?.p2 === "wings" ? Math.max(0, Math.ceil(((f.fallAt ?? 0) - run.tick) / TICK_RATE)) : 0;
  // 즉사 패턴 (sim/lucDeadly): 무엇을 해야 하는지 + 남은 초 + 지금 내가 안전한지
  const boss = run.enemies.find((e) => e.kind === "lucifer" && e.hp > 0);
  const dk = f?.dk && boss ? f.dk : undefined;
  const dkSafe = dk && boss ? deadlySafe(run, dk, me ?? run.seat ?? 0, boss) : false;
  const dkNote = dk ? `${t(`raidDk${dk.kind}` as TextKey).replace("{s}", String(Math.max(0, Math.ceil((dk.at - run.tick) / TICK_RATE))))} — ${t(dkSafe ? "raidDkSafe" : "raidDkDanger")}` : "";
  const note = dkNote
    ? dkNote
    : p.raidDark
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
  // 제한 시간 (컷신 동안은 멈춤) · 1분 남으면 빨강
  const left = Math.ceil(raidTimeLeft(run) / TICK_RATE);
  const clock = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  const chain = p.chains && p.chains.length > 0 && (p.chainTicks ?? 0) > 0 ? p.chains : null;
  return (
    <>
      {f?.cut && (
        <div className="raid-cut" key={`${f.cut}-${f.cutEnd}`}>
          <img src={`${import.meta.env.BASE_URL}raid/lucifer/${CUT_GIF[f.cut]}?k=${f.cutEnd}`} alt="" />
        </div>
      )}
      <div className="raid-hud">
        <b className={left <= 60 ? "danger" : ""}>⏱ {t("raidTimeLeft").replace("{t}", clock)}</b>
        <b className={deaths >= RAID_LIVES - 2 ? "danger" : ""}>💀 {t("raidDeaths").replace("{n}", String(deaths)).replace("{max}", String(RAID_LIVES))}</b>
        {down && !raidOut(p) && <span>{t("raidRespawn").replace("{s}", String(wait))}</span>}
        {raidOut(p) && <span className="danger">{t("raidOutText")}</span>}
        {(p.raidCut ?? 0) > 0 && <span className="danger">{t("raidCutText")}</span>}
      </div>
      {board && !f?.cut && <RaidBoard run={run} names={names} t={t} float me={me} />}
      {/* 쓰러져 관전하는 동안: 오른쪽에 실시간 기록 · 화면 끌어 보기 안내 */}
      {watching && !board && !f?.cut && <RaidBoard run={run} names={names} t={t} side me={me} />}
      {watching && !f?.cut && <p className="raid-watch-pan">{t("raidWatchPan")}</p>}
      {note && !f?.cut && <div className={`raid-note ${p.raidDark && !dk ? "dark" : ""}${dk ? (dkSafe ? " dk-safe" : " dk-danger") : ""}`}>{note}</div>}
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
