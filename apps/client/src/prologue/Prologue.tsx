// 프롤로그 (처음 '플레이'를 누른 사람, docs/QUEST.md 2절): 검은 화면 · 떠다니는 잉크 글자 · 아래 대사 상자(서기관) · 글자가 한 자씩 나옴
// 13번째 줄 뒤에 이름 입력 (닉네임과 같은 값, player.saveNickname) → 14·15번째 줄 → 화면이 하얗게 밝아지며 onDone
// 넘기기: 누르기·Space·Enter (글자가 다 안 나왔으면 먼저 다 보여 줌) · Esc·건너뛰기: 이름을 아직 안 정했으면 이름 칸으로, 정했으면 끝
import { NICKNAME_MAX, DEFAULT_NICKNAME } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { uiSfx } from "../audio/uiSounds";
import type { TextKey } from "../i18n";
import { loadNickname, saveNickname } from "../player";
import { StoryFace } from "../story/StoryFace";
import { markPrologue } from "../progress/prologue";

/** 대사 차례: [글자 키, 서기관이 말하면 true(아니면 서술)] · "name" = 이름 입력 */
const LINES: readonly (readonly [TextKey, boolean] | "name")[] = [
  ["prl1", true], ["prl2", true], ["prl3", true], ["prl4", true], ["prl5", false], ["prl6", true], ["prl7", true],
  ["prl8", true], ["prl9", true], ["prl10", true], ["prl11", true], ["prl12", true], ["prl13", true],
  "name",
  ["prl14", true], ["prl15", true],
];
const NAME_AT = LINES.indexOf("name");
/** 한 글자 나오는 간격 (ms) */
const TYPE_MS = 28;
/** 끝날 때 하얗게 밝아지는 시간 (ms) */
const FADE_MS = 1400;
/** 떠다니는 잉크 글자 (자리·늦게 시작 고정, 게임 결과와 상관없는 꾸밈) */
const INK = "ᚠ✶◇ᛟ∴✧ᚱ◈ᛉ✦ᚨ∵".split("").map((c, k) => ({ c, x: (k * 37 + 11) % 92 + 4, y: (k * 53 + 7) % 70 + 6, d: (k * 0.9) % 7 }));

interface Props {
  t: (key: TextKey) => string;
  onDone: () => void;
}

export function Prologue({ t, onDone }: Props) {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(0);
  const [name, setName] = useState(() => (loadNickname() === DEFAULT_NICKNAME ? "" : loadNickname()));
  const [saved, setSaved] = useState("");
  const [ending, setEnding] = useState(false);
  const line = LINES[i]!;
  const text = line === "name" ? "" : t(line[0]).replace("{name}", saved);
  const typing = shown < text.length;

  const finish = () => {
    if (ending) return;
    markPrologue();
    setEnding(true);
    window.setTimeout(onDone, FADE_MS);
  };
  const next = () => {
    if (line === "name" || ending) return;
    if (typing) return setShown(text.length);
    if (i + 1 < LINES.length) {
      setI(i + 1);
      setShown(0);
    } else finish();
  };
  const skip = () => {
    if (i < NAME_AT) {
      setI(NAME_AT);
      setShown(0);
    } else if (line !== "name") finish();
  };
  const submit = () => {
    if (!name.trim()) return;
    setSaved(saveNickname(name));
    uiSfx("uiSave");
    setI(NAME_AT + 1);
    setShown(0);
  };

  // 글자 한 자씩
  useEffect(() => {
    if (!typing) return;
    const id = window.setTimeout(() => setShown((n) => n + 1), TYPE_MS);
    return () => window.clearTimeout(id);
  }, [typing, shown]);
  // 키보드 (이름 칸에서는 칸이 받음)
  useEffect(() => {
    if (line === "name") return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });

  return (
    <section className={`prologue${ending ? " ending" : ""}`} onClick={next}>
      <div className="prologue-ink" aria-hidden="true">
        {INK.map((g) => (
          <span key={g.c} style={{ left: `${g.x}%`, top: `${g.y}%`, animationDelay: `${g.d}s` }}>
            {g.c}
          </span>
        ))}
      </div>
      <button type="button" className="ghost prologue-skip" onClick={(e) => (e.stopPropagation(), skip())} disabled={line === "name"}>
        {t("prlSkip")}
      </button>
      <div className="prologue-bottom">
        {line === "name" ? (
          <form className="scene-box prologue-name" onClick={(e) => e.stopPropagation()} onSubmit={(e) => (e.preventDefault(), submit())}>
            <StoryFace who="scribe" size={96} art />
            <div>
              <b>{t("scribe")}</b>
              <p>{t("prl13")}</p>
              <span className="prologue-name-row">
                <input value={name} maxLength={NICKNAME_MAX} autoFocus autoComplete="nickname" placeholder={t("prlNameHolder")} aria-label={t("nickname")} onChange={(e) => setName(e.target.value)} />
                <button type="submit" className="primary" data-sfx="none" disabled={!name.trim()}>
                  {t("prlNameOk")}
                </button>
              </span>
            </div>
          </form>
        ) : (
          <div className={`scene-box${line[1] ? "" : " narration"}`} key={i}>
            {line[1] && <StoryFace who="scribe" size={96} art />}
            <div>
              {line[1] && <b>{t("scribe")}</b>}
              <p>{text.slice(0, shown)}</p>
            </div>
          </div>
        )}
        <footer className="scene-foot">
          <span />
          <small>{t("prlHint")}</small>
        </footer>
      </div>
    </section>
  );
}
