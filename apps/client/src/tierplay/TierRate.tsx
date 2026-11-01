// 티어 플레잉 한 판이 끝난 뒤 작은 창: 자동 기록(클리어 시간·점수·쓰러진 횟수·보스·깎은 체력)을 보여 주고
// 별 다섯 개로 안정성·딜·속도감·재미·템 잘 떴는지 · 비고와 보스 비고를 적어 저장 (Esc: 저장하지 않고 나가기 확인)
import type { CharacterId } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { clock, saveRecord, STAR_FIELDS, type TierRecord } from "./tierPlayData";

type Auto = Pick<TierRecord, "clearTicks" | "score" | "deaths" | "boss" | "bossCleared" | "bossPct">;
type Stars = Pick<TierRecord, (typeof STAR_FIELDS)[number][0]>;

export function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <span className="tier-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" className={n <= value ? "on" : ""} disabled={!onChange} onClick={() => onChange?.(n)} aria-label={`${n}`}>
          ★
        </button>
      ))}
    </span>
  );
}

export function TierRate({ character, auto, onSaved, onQuit }: { character: CharacterId; auto: Auto; onSaved: () => void; onQuit: () => void }) {
  const [stars, setStars] = useState<Stars>({ stable: 3, dmg: 3, speed: 3, fun: 3, items: 3 });
  const [note, setNote] = useState("");
  const [bossNote, setBossNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [warn, setWarn] = useState("");

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape" && window.confirm("저장하지 않고 나갈까요?")) onQuit();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onQuit]);

  const save = async () => {
    setSaving(true);
    const ok = await saveRecord({ character, ...auto, ...stars, note: note.trim(), bossNote: bossNote.trim() });
    setSaving(false);
    if (ok) onSaved();
    else setWarn("서버 저장에 실패해 이 브라우저에만 남겼어요 (관리자 로그인 확인). 다시 누르면 다시 보냅니다.");
  };

  return (
    <div className="game-overlay">
      <div className="modal tier-rate">
        <h2>티어 플레잉 기록</h2>
        <dl className="tier-auto">
          <dt>로그 클리어 시간</dt>
          <dd>{clock(auto.clearTicks)}</dd>
          <dt>점수</dt>
          <dd>{auto.score.toLocaleString()}</dd>
          <dt>쓰러진 횟수</dt>
          <dd>{auto.deaths}</dd>
          <dt>라스트 보스</dt>
          <dd>
            {auto.boss || "-"} · {auto.bossCleared ? "클리어" : `체력 ${auto.bossPct}% 깎음`}
          </dd>
        </dl>
        {STAR_FIELDS.map(([k, label]) => (
          <div key={k} className="tier-star-row">
            <span>{label}</span>
            <Stars value={stars[k]} onChange={(v) => setStars((s) => ({ ...s, [k]: v }))} />
          </div>
        ))}
        <label className="tier-note">
          비고 (로그)
          <textarea value={note} maxLength={600} onChange={(e) => setNote(e.target.value)} />
        </label>
        <label className="tier-note">
          보스 비고
          <textarea value={bossNote} maxLength={600} onChange={(e) => setBossNote(e.target.value)} />
        </label>
        {warn && <p className="tier-warn">{warn}</p>}
        <div className="modal-actions">
          <button type="button" onClick={() => window.confirm("저장하지 않고 나갈까요?") && onQuit()}>
            나가기
          </button>
          <button type="button" className="primary" disabled={saving} onClick={() => void save()}>
            저장하고 다음 캐릭터
          </button>
        </div>
      </div>
    </div>
  );
}
