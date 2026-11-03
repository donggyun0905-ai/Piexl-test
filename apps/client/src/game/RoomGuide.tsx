// 로그 '방 설명' 큰 창 (왼쪽 칸 버튼·O): 게임을 멈추고 왼쪽에 방 목록·고른 방 설명(나오는 곳·확률·실패하면·그냥 나가면, 시련은 점수별 보상 표),
// 오른쪽 작은 연습장이 고른 방으로 바뀌어 직접 해 봄 (sim/practiceRoom) · Esc·O·닫기로 닫음. 모양은 CharInfo와 같은 styles/stats-side.css
import { createPracticeRun, PRACTICE_ROOMS, practiceRoom, trialRewardRow, type CharacterId, type PracticeRoom } from "@pixel-rogue/shared";
import { useState } from "react";
import type { Lang, TextKey } from "../i18n";
import { roomGuide } from "../i18n/roomGuide";
import { GameScreen } from "./GameScreen";
import { practiceRoomLook, ROOM_NAME } from "./practice/PracticeRooms";
import { takeGuideRoom } from "./roomPick";

interface Props {
  character: CharacterId;
  lang: Lang;
  t: (k: TextKey) => string;
  onClose: () => void;
}

const COLS: TextKey[] = ["rgColRs", "rgColPs", "rgColRp", "rgColPp", "rgColPu", "rgColRv"];

/** 시련 점수 구간(100점마다) 보상 표 */
function TrialTable({ t }: { t: (k: TextKey) => string }) {
  return (
    <table className="rg-table">
      <caption>{t("rgReward")}</caption>
      <thead>
        <tr>
          <th>{t("rgScore")}</th>
          {COLS.map((k) => (
            <th key={k}>{t(k)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 10 }, (_, i) => (i + 1) * 100).map((score) => (
          <tr key={score}>
            <td>{score === 1000 ? "1000 ★" : `${score}~`}</td>
            {trialRewardRow(score).map((n, k) => (
              <td key={k}>{n || "·"}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function RoomGuide({ character, lang, t, onClose }: Props) {
  const [first] = useState<PracticeRoom>(() => takeGuideRoom() ?? "shop");
  const [run] = useState(() => {
    const r = createPracticeRun(character);
    practiceRoom(r, first);
    return r;
  });
  const [room, setRoom] = useState<PracticeRoom>(first);
  const go = (k: PracticeRoom) => {
    practiceRoom(run, k);
    setRoom(k);
  };
  return (
    <div className="char-info room-guide" role="dialog" aria-label={t("rgTitle")}>
      <header>
        <b>{t("rgTitle")}</b>
        <small>{t("ciPaused")}</small>
        <button type="button" onClick={onClose}>
          {t("rgClose")}
        </button>
      </header>
      <div className="ci-body">
        <section className="ci-left">
          <small>{t("rgPick")}</small>
          <div className="rg-rooms">
            {PRACTICE_ROOMS.map((k) => {
              const look = practiceRoomLook(k);
              return (
                <button key={k} type="button" className={`rg-room${room === k ? " on" : ""}`} onClick={() => go(k)}>
                  <i style={{ background: look.color, borderColor: look.ink }} />
                  {t(ROOM_NAME[k])}
                </button>
              );
            })}
          </div>
          <h4>{t(ROOM_NAME[room])}</h4>
          <ul className="ci-guide">
            {roomGuide(room, lang, t).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          {room === "trial" && <TrialTable t={t} />}
          <button type="button" className="rg-retry" onClick={() => go(room)}>
            {t("rgRetry")}
          </button>
        </section>
        <section className="ci-right">
          <small>{t("ciPractice")}</small>
          <div className="ci-practice">
            <GameScreen mode="practice" embedded characterId={character} seedText="" initialRun={run} unlocks={[]} lang={lang} t={t} onExit={onClose} />
          </div>
        </section>
      </div>
    </div>
  );
}
