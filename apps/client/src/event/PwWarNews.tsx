// 전쟁의 서막 큰 보스 알림 (위쪽 가운데): 잡은 뒤 6초 동안 '우리 편/상대 편이 ○○를 쓰러뜨림' · 늘 보이는 줄: 우리 강화(파멸의 용 쌓임 · 갓이터 남은 초) · 처음 나오기까지 남은 시간
import { dragonStacks, PW_WAR, type PlayerState, type RunState } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";

const SHOW = 6 * 60;
const mmss = (ticks: number) => {
  const sec = Math.ceil(ticks / 60);
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
};

export function PwWarNews({ run, me, p, t }: { run: RunState; me: number; p: PlayerState; t: (k: TextKey) => string }) {
  const pv = run.pvp!;
  const g = pv.grow!;
  const mine = pv.seats[me]!.team;
  const news = g.news && run.tick - g.news.at < SHOW ? g.news : null;
  const start = pv.readyAt ?? 0;
  const wait = (at: number) => start + at - run.tick;
  const stacks = dragonStacks(p);
  const eater = p.pwBuffs?.find((b) => b.taken === PW_WAR.godeater.taken && b.regen === PW_WAR.godeater.regen);
  const parts = [
    wait(PW_WAR.dragonAt) > 0 && t("pwWarDragonIn").replace("{t}", mmss(wait(PW_WAR.dragonAt))),
    wait(PW_WAR.godeaterAt) > 0 && t("pwWarEaterIn").replace("{t}", mmss(wait(PW_WAR.godeaterAt))),
    stacks > 0 && t("pwWarDragonBuff").replace("{n}", String(stacks)).replace("{max}", String(PW_WAR.dragon.max)),
    eater && t("pwWarEaterBuff").replace("{t}", mmss(eater.t)),
  ].filter(Boolean);
  return (
    <>
      {news && (
        <div className={`pw-war-news ${news.team === mine ? "ours" : "theirs"}`}>
          {t(`pwWarNews_${news.kind}_${news.team === mine ? "ours" : "theirs"}` as TextKey)}
        </div>
      )}
      {parts.length > 0 && <small className="pw-war-buffs">{parts.join(" · ")}</small>}
    </>
  );
}
