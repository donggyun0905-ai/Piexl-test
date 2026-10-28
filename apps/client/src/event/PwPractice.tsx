// 패왕전 연습장 (나 + 허수아비 셋, 판이 끝나지 않음, 스킬 보기 화면 오른쪽에 작게도 씀 PwPrep): 게임 화면(GameScreen) 위에 정보(PwHud)와 연습 칸 (허수아비 동작 · 스킬 대기 없음 · 캐릭터 바꾸기)
import { allPlayers, CHARACTER_IDS, createPractice, stepPvp, type CharacterId, type PwPractice as Practice } from "@pixel-rogue/shared";
import { useEffect, useRef, useState } from "react";
import { GameScreen } from "../game/GameScreen";
import type { Lang, TextKey } from "../i18n";
import { PwHud } from "./PwHud";

interface Props {
  characterId: CharacterId;
  lang: Lang;
  t: (key: TextKey) => string;
  /** 없으면 작은 연습장 (스킬 보기 화면 오른쪽: 캐릭터 바꾸기·나가기 없음) */
  onChange?: () => void;
  onExit?: () => void;
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
  // 허수아비 셋 (처음엔 무작위, 고를 수 있음) · 초기화 = 같은 허수아비로 새로
  const [dummies, setDummies] = useState<CharacterId[]>(() => allPlayers(run).slice(3).map((p) => p.characterId));
  const remake = (list: CharacterId[]) => {
    setDummies(list);
    setRun(createPractice(run.seed + 1, characterId, undefined, list));
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
        onExit={onExit ?? (() => {})}
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
        <span>{t("pwPrReroll")}</span>
        {dummies.map((c, k) => (
          <select key={k} value={c} onChange={(e) => remake(dummies.map((x, j) => (j === k ? (e.target.value as CharacterId) : x)))}>
            {CHARACTER_IDS.map((id) => (
              <option key={id} value={id}>
                {t(id)}
              </option>
            ))}
          </select>
        ))}
        <button type="button" onClick={() => remake(dummies)}>
          {t("pwPrReset")}
        </button>
        {onChange && (
          <button type="button" onClick={onChange}>
            {t("pwPrChange")}
          </button>
        )}
      </div>
    </>
  );
}
