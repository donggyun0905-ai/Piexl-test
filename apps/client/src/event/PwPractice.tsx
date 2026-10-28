// 패왕전 연습장 (나 + 허수아비 셋, 판이 끝나지 않음): 게임 화면(GameScreen) 위에 정보(PwHud)와 연습 칸 (허수아비 동작 · 스킬 대기 없음 · 캐릭터 바꾸기)
import { createPractice, stepPvp, type CharacterId, type PwPractice as Practice } from "@pixel-rogue/shared";
import { useEffect, useRef, useState } from "react";
import { GameScreen } from "../game/GameScreen";
import type { Lang, TextKey } from "../i18n";
import { PwHud } from "./PwHud";

interface Props {
  characterId: CharacterId;
  lang: Lang;
  t: (key: TextKey) => string;
  onChange: () => void;
  onExit: () => void;
}

const DUMMY: readonly { id: Practice["dummy"]; key: TextKey }[] = [
  { id: "still", key: "pwPrStill" },
  { id: "move", key: "pwPrMove" },
  { id: "fight", key: "pwPrFight" },
];

export function PwPracticeGame({ characterId, lang, t, onChange, onExit }: Props) {
  // 꾸밈이 아니라 판 시드 (허수아비 캐릭터를 정함)
  const [key, setKey] = useState(0);
  const [run, setRun] = useState(() => createPractice(Math.floor(Math.random() * 0x7fffffff), characterId));
  const [pr, setPr] = useState<Practice>(() => ({ ...run.pvp!.practice! }));
  const [, refresh] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => refresh((n) => n + 1), 250);
    return () => window.clearInterval(id);
  }, []);
  // 혼자 하는 판이라 화면이 고른 설정을 틱마다 판에 넣음
  const prRef = useRef(pr);
  useEffect(() => {
    prRef.current = pr;
  }, [pr]);
  const set = setPr;
  const reroll = () => {
    setRun(createPractice(Math.floor(Math.random() * 0x7fffffff), characterId));
    setKey((k) => k + 1);
  };
  return (
    <>
      <GameScreen
        key={key}
        mode="paewang"
        characterId={characterId}
        seedText=""
        initialRun={run}
        unlocks={[]}
        lang={lang}
        t={t}
        onExit={onExit}
        step={(r, input) => {
          r.pvp!.practice = prRef.current;
          stepPvp(r, [input]);
          return true;
        }}
        onRunEnd={() => {}}
      />
      <PwHud run={run} me={0} t={t} onBoard={() => {}} />
      <div className="pw-practice">
        <b>{t("pwPractice")}</b>
        <span>{t("pwPrDummy")}</span>
        {DUMMY.map((d) => (
          <button key={d.id} type="button" className={pr.dummy === d.id ? "on" : ""} onClick={() => set({ ...pr, dummy: d.id })}>
            {t(d.key)}
          </button>
        ))}
        <label>
          <input type="checkbox" checked={pr.noCd} onChange={(e) => set({ ...pr, noCd: e.target.checked })} /> {t("pwPrNoCd")}
        </label>
        <button type="button" onClick={reroll}>
          {t("pwPrReroll")}
        </button>
        <button type="button" onClick={onChange}>
          {t("pwPrChange")}
        </button>
      </div>
    </>
  );
}
