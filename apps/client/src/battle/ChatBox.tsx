// 대기실 채팅: 받은 말 목록 + 입력 칸 (내 말은 오른쪽)
import { useEffect, useRef, useState } from "react";
import type { TextKey } from "../i18n";

interface Props {
  t: (key: TextKey) => string;
  messages: { name: string; text: string }[];
  myName: string;
  onSend: (text: string) => void;
}

export function ChatBox({ t, messages, myName, onSend }: Props) {
  const [text, setText] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    logRef.current?.scrollTo(0, logRef.current.scrollHeight);
  }, [messages.length]);

  return (
    <section className="lobby-chat">
      <span className="field-label">{t("chat")}</span>
      <div ref={logRef} className="lobby-chat-log">
        {messages.length === 0 && <p className="hint">{t("chatEmpty")}</p>}
        {messages.map((m, i) => (
          <div key={i} className={m.name === myName ? "chat-line mine" : "chat-line"}>
            {m.name !== myName && <small>{m.name}</small>}
            <span>{m.text}</span>
          </div>
        ))}
      </div>
      <form
        className="join-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim()) onSend(text.trim());
          setText("");
        }}
      >
        <input value={text} maxLength={80} placeholder={t("chatInput")} aria-label={t("chat")} onChange={(e) => setText(e.target.value)} />
        <button type="submit" className="primary" disabled={!text.trim()}>
          {t("send")}
        </button>
      </form>
    </section>
  );
}
