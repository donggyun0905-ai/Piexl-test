// 설정: 효과음·음악 크기, 진동, 화면 흔들림, 능력치·사거리·맞는 범위 보기, 모바일 조작키 크기·위치 (이 기기에 저장)
import { useState } from "react";
import type { Lang, TextKey } from "./i18n";
import { applyVolume, play, unlockAudio } from "./audio/sound";
import { ControlsEditor } from "./game/ControlsEditor";
import { SkillKeysRow } from "./SkillKeysRow";
import { setSettings, useSettings, type Settings } from "./settings";

/** 터치 화면이 있는 기기에서만 조작키 바꾸기를 보여 줌 */
const hasTouch = typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;

export function SettingsPanel({ lang, t }: { lang: Lang; t: (key: TextKey) => string }) {
  const s = useSettings();
  const [editing, setEditing] = useState(false);
  const volume = (key: "sfx" | "music" | "myFx" | "otherFx", label: TextKey) => (
    <label className="setting-row">
      <span>{t(label)}</span>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={Math.round(s[key] * 100)}
        onChange={(e) => {
          unlockAudio();
          setSettings({ [key]: Number(e.target.value) / 100 } as Partial<Settings>);
          if (key === "sfx" || key === "music") applyVolume();
        }}
        onPointerUp={() => key === "sfx" && play("coin")}
      />
      <small>{Math.round(s[key] * 100)}</small>
    </label>
  );
  const toggle = (key: "vibration" | "shake" | "showStats" | "showRange" | "showNames" | "showHitbox" | "showDamage" | "simpleView" | "glowFx" | "showGoal" | "heartbeat" | "uiSound", label: TextKey) => (
    <label className="setting-row">
      <span>{t(label)}</span>
      <input type="checkbox" checked={s[key]} onChange={(e) => setSettings({ [key]: e.target.checked } as Partial<Settings>)} />
    </label>
  );
  return (
    <div className="settings">
      {volume("sfx", "soundEffects")}
      {volume("music", "music")}
      {toggle("heartbeat", "setHeartbeat")}
      {toggle("uiSound", "setUiSound")}
      {toggle("vibration", "vibration")}
      {toggle("shake", "screenShake")}
      {toggle("showStats", "showStats")}
      {toggle("showRange", "showRange")}
      {toggle("showNames", "showNames")}
      {toggle("showDamage", "showDamage")}
      {toggle("showHitbox", "showHitbox")}
      {toggle("simpleView", "simpleView")}
      {volume("myFx", "fxMine")}
      {volume("otherFx", "fxOthers")}
      {toggle("glowFx", "glowFx")}
      {toggle("showGoal", "showGoal")}
      <SkillKeysRow t={t} />
      {hasTouch && (
        <div className="setting-row">
          <span>{t("touchControls")}</span>
          <button type="button" className="small" onClick={() => setEditing(true)}>
            {t("editControls")}
          </button>
        </div>
      )}
      {editing && <ControlsEditor lang={lang} t={t} onClose={() => setEditing(false)} />}
    </div>
  );
}
