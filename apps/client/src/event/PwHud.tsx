// 패왕전 위쪽 정보: 모드 · 내 편·상대 수 (토너먼트는 대기 인원, 대난투는 남은 사람, 데스매치는 레벨) · 쓰러져 지켜보는 중 안내
import type { RunState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";
import { PW_NAME } from "./PwModes";

export function PwHud({ run, t }: { run: RunState; t: (k: TextKey) => string }) {
  const pw = run.pw!;
  const foes = run.enemies.filter((e) => e.pw && e.hp > 0);
  const n = (k: TextKey, v: number) => t(k).replace("{n}", String(v));
  let line: string;
  if (pw.mode === "gungame") {
    const top = Math.max(0, ...foes.map((e) => e.pw!.lv ?? 1));
    line = `${t("pwLevel").replace("{lv}", String(pw.lv))} · ${t("pwTop").replace("{lv}", String(top))}`;
  } else if (pw.mode === "brawl") line = n("pwAlive", foes.length + (pw.down ? 0 : 1));
  else {
    const mine = pw.allies.length + (pw.down ? 0 : 1);
    line = `${n("pwAllies", mine)} · ${n("pwFoes", foes.length)}`;
    if (pw.mode === "tourney") line += ` · ${t("pwBench").replace("{a}", String(pw.benchA.length + pw.waiting.filter((w) => w.team === 0).length)).replace("{b}", String(pw.benchB.length + pw.waiting.filter((w) => w.team !== 0).length))}`;
  }
  return (
    <div className="pw-hud">
      <div className="pw-top">
        <strong>{t(PW_NAME[pw.mode])}</strong> <span>{line}</span>
        {pw.kills > 0 && <span> · {n("pwKills", pw.kills)}</span>}
      </div>
      {pw.down && <div className="pw-watch">{t("pwWatching")}</div>}
    </div>
  );
}
