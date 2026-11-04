// 처음 하는 사람 안내 (GameScreen이 판 위에 띄움, 스스로 게임 상태를 읽음):
// 지금 할 일 한 줄(설정 showGoal) · 처음 만난 특별한 방 카드(이 기기에서 한 번, 요약 두 줄 + '자세히' = 방 설명 창) · 새 방이 열리기까지(sim/intro)
import { crackHere, introNext, introRuns, type PracticeRoom, type RunState } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { roomGuide } from "../i18n/roomGuide";
import { useSettings } from "../settings";
import { loadText, saveText } from "../storage";
import { ROOM_NAME } from "./practice/PracticeRooms";
import { pickGuideRoom } from "./roomPick";

/** 방 종류 → 방 설명 창의 방 (없으면 카드 없음) */
function roomKind(s: RunState): PracticeRoom | null {
  if (crackHere(s)) return "crack";
  const info = s.map.rooms[s.roomId];
  if (!info) return null;
  if (info.type === "shop") return info.heaven ? "heaven" : "shop";
  const list: string[] = ["golden", "treasure", "gym", "trial", "altar", "forge", "devil", "gamble", "auction", "rest"];
  return list.includes(info.type) ? (info.type as PracticeRoom) : null;
}

/** 지금 할 일 */
function goal(s: RunState): TextKey | null {
  if (s.over) return null;
  const info = s.map.rooms[s.roomId];
  const st = s.rooms[s.roomId];
  if (!info || !st) return null;
  if (!st.cleared && s.enemies.length > 0) return info.type === "exit" ? "goalBoss" : "goalClear";
  if (info.type === "exit") return "goalStairs";
  const special: Record<string, TextKey> = { shop: "goalShop", treasure: "goalTreasure", golden: "goalGolden", rest: "goalRest" };
  if (special[info.type]) return special[info.type]!;
  return ["gym", "trial", "altar", "forge", "devil", "gamble", "auction"].includes(info.type) ? "goalSpecial" : "goalExit";
}

/** 새 방이 열리기까지 안내 (단계적 열기가 끝났으면 null) */
function introText(s: RunState, t: (k: TextKey) => string): string | null {
  const runs = introRuns(s);
  const next = Number.isFinite(runs) ? introNext(runs) : null;
  if (!next) return null;
  const room = next.room === "SECRET" ? t("introSecret") : t(ROOM_NAME[next.room.toLowerCase() as PracticeRoom]);
  return t("introNext").replace("{room}", room).replace("{n}", String(next.at - runs));
}

const seen = (): string[] => (loadText("seenRooms") ?? "").split(",").filter(Boolean);
const SHOW_MS = 14000;

export function RunGuide({ run, lang, t, onMore }: { run: () => RunState | null; lang: Lang; t: (k: TextKey) => string; onMore: () => void }) {
  const set = useSettings();
  const [now, setNow] = useState<{ goal: TextKey | null; card: PracticeRoom | null }>({ goal: null, card: null });
  const [intro, setIntro] = useState<string | null>(null);
  useEffect(() => {
    let hide = 0;
    let told = false;
    const id = setInterval(() => {
      const s = run();
      if (!s || s.swarm || s.pvp) return;
      // 판 시작 때 한 번: 새 방이 열리기까지 (잠깐 보이고 사라짐)
      if (!told) {
        told = true;
        const text = introText(s, t);
        if (text) {
          setIntro(text);
          window.setTimeout(() => setIntro(null), SHOW_MS);
        }
      }
      const kind = roomKind(s);
      const list = seen();
      const fresh = kind && !list.includes(kind) ? kind : null;
      if (fresh) {
        saveText("seenRooms", [...list, fresh].join(","));
        clearTimeout(hide);
        hide = window.setTimeout(() => setNow((n) => ({ ...n, card: null })), SHOW_MS);
      }
      setNow((n) => ({ goal: goal(s), card: fresh ?? n.card }));
    }, 250);
    return () => {
      clearInterval(id);
      clearTimeout(hide);
    };
  }, [run, t]);
  const card = now.card;
  return (
    <>
      {set.showGoal && now.goal && <p className="run-goal">▶ {t(now.goal)}</p>}
      {intro && <p className="run-intro">{intro}</p>}
      {card && (
        <div className="room-card" role="status">
          <small>{t("newRoom")}</small>
          <b>{t(ROOM_NAME[card])}</b>
          <ul>
            {roomGuide(card, lang, t)
              .filter((line) => !/^(나오는 곳|Where|出現)/.test(line))
              .slice(0, 2)
              .map((line) => (
                <li key={line}>{line}</li>
              ))}
          </ul>
          <div>
            <button type="button" onClick={() => (pickGuideRoom(card), setNow((n) => ({ ...n, card: null })), onMore())}>
              {t("newRoomMore")}
            </button>
            <button type="button" onClick={() => setNow((n) => ({ ...n, card: null }))}>
              {t("newRoomClose")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
