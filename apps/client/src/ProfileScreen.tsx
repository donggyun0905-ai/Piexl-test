// 닉네임 · 기기 연동 (가입·로그인 없음)
import { LINK_CODE_LENGTH, NICKNAME_MAX } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { apiPost } from "./api";
import type { TextKey } from "./i18n";
import { applyProfile, getPlayerId, loadNickname, replacePlayerId, resetPlayerId, saveNickname } from "./player";

interface Props {
  t: (key: TextKey) => string;
  onBack: () => void;
}

type Step = "main" | "show" | "enter";

const ERRORS: Record<string, TextKey> = { bad_code: "errBadCode", too_many: "errTooMany", offline: "errOffline" };

export function ProfileScreen({ t, onBack }: Props) {
  const [nickname, setNickname] = useState(loadNickname);
  const [nickSaved, setNickSaved] = useState(false);
  const [step, setStep] = useState<Step>("main");
  const [notice, setNotice] = useState("");

  return (
    <div className="select-screen account-screen">
      <h2>{t("profile")}</h2>
      <label className="form-row">
        {t("nickname")}
        <input
          value={nickname}
          maxLength={NICKNAME_MAX}
          onChange={(e) => {
            setNickname(e.target.value);
            setNickSaved(false);
          }}
        />
        <button
          type="button"
          className="small"
          onClick={() => {
            setNickname(saveNickname(nickname));
            setNickSaved(true);
          }}
        >
          {nickSaved ? t("saved") : t("save")}
        </button>
      </label>
      <p className="account-note">{t("nicknameNote")}</p>

      <h3>{t("linkTitle")}</h3>
      {notice && <p className="link-done">{notice}</p>}
      {step === "main" && (
        <>
          <p className="account-note">{t("linkIntro")}</p>
          <button type="button" onClick={() => setStep("show")}>
            {t("linkShowCode")}
          </button>
          <button type="button" onClick={() => setStep("enter")}>
            {t("linkEnterCode")}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => {
              if (!window.confirm(t("unlinkConfirm"))) return;
              resetPlayerId();
              setNickname(loadNickname());
              setNotice(t("unlinkDone"));
            }}
          >
            {t("unlinkButton")}
          </button>
        </>
      )}
      {step === "show" && <ShowCode t={t} />}
      {step === "enter" && (
        <EnterCode
          t={t}
          onLinked={() => {
            setNickname(loadNickname());
            setNotice(t("linkDone"));
            setStep("main");
          }}
        />
      )}
      <button type="button" className="secondary" onClick={step === "main" ? onBack : () => setStep("main")}>
        {t("back")}
      </button>
    </div>
  );
}

function ShowCode({ t }: { t: (key: TextKey) => string }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    void apiPost<{ code: string }>("/api/player/link/create", { player: getPlayerId() }).then((res) => {
      if (res.ok && res.data) setCode(res.data.code);
      else setError(t(ERRORS[res.error ?? ""] ?? "errUnknown"));
    });
  }, [t]);
  if (error) return <p className="form-error">{error}</p>;
  return (
    <>
      <code className="recovery-code">{code || "……"}</code>
      <p className="account-note">{t("linkCodeHint")}</p>
    </>
  );
}

function EnterCode({ t, onLinked }: { t: (key: TextKey) => string; onLinked: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    setBusy(true);
    setError("");
    const res = await apiPost<{ player: string; nickname: string; unlocks: string[] }>("/api/player/link/redeem", {
      code,
      old: getPlayerId(),
    });
    setBusy(false);
    if (!res.ok || !res.data) return setError(t(ERRORS[res.error ?? ""] ?? "errUnknown"));
    replacePlayerId(res.data.player);
    applyProfile(res.data);
    onLinked();
  };
  return (
    <form
      className="account-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!busy && code.length === LINK_CODE_LENGTH) void submit();
      }}
    >
      <p className="account-note">{t("linkEnterNote")}</p>
      <input
        className="link-code-input"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={LINK_CODE_LENGTH}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
      />
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="primary" disabled={busy || code.length !== LINK_CODE_LENGTH}>
        {t("linkConfirm")}
      </button>
    </form>
  );
}
