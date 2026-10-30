// 핑 알림 (성장 대결 위쪽 줄 아래): 우리 편이 5초 안에 찍은 핑 셋까지 '이름: 여기로 모여!' 등 · 핑이 없으면 T 안내
import { PW_PING, type RunState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";

const ICON = { go: "➜", attack: "⚔", danger: "⚠", boss: "★" } as const;

export function PwPingFeed({ run, me, t }: { run: RunState; me: number; t: (k: TextKey) => string }) {
  const pv = run.pvp!;
  const mine = pv.seats[me]!.team;
  const list = (pv.grow?.pings ?? []).filter((p) => p.team === mine && run.tick - p.at < PW_PING.show).slice(-3);
  if (!list.length) return <small className="pw-ping-hint">{t("pwPingHint")}</small>;
  return (
    <div className="pw-ping-feed">
      {list.map((p) => {
        const who = p.seat === me ? t("pwPingMe") : t((run.party?.[p.seat]?.player.characterId ?? run.player.characterId) as TextKey);
        const msg = p.kind === "boss" ? t("pwPingBoss").replace("{boss}", t(p.boss === "godeater" ? "pwBossGodeater" : "pwBossDragon")) : t(`pwPing_${p.kind}` as TextKey);
        return (
          <span key={`${p.seat}-${p.at}`} className={`pw-ping-line ${p.kind}`}>
            {ICON[p.kind]} <b>{who}</b>: {msg}
          </span>
        );
      })}
    </div>
  );
}
