// 관리자 '패왕전 수치 · 역할군': 캐릭터를 끌어서(또는 누르고 칸을 눌러서) 전사·원딜·마법사·암살자·서포터 사이로 옮김. 밴픽 탭·캐릭터 옆 글자에 쓰임
import { CHARACTER_IDS, PW_ROLE_IDS, type BalanceSet, type BalanceValues } from "@pixel-rogue/shared";
import { useState } from "react";
import { TEXT } from "../i18n/text";
import { AdminThumb } from "./AdminThumb";

const ROLE_NAME: Record<string, string> = { warrior: "전사", ranged: "원딜", mage: "마법사", assassin: "암살자", support: "서포터" };
const ko = (k: string) => (TEXT as Record<string, { ko: string } | undefined>)[k]?.ko ?? k;

interface Props {
  set: BalanceSet;
  draft: BalanceValues;
  saved: BalanceValues;
  onChange: (id: string, key: string, v: number | undefined) => void;
}

export function PwRolesEditor({ set, draft, saved, onChange }: Props) {
  /** 누른 캐릭터 (칸을 누르면 그리로 옮김) */
  const [pick, setPick] = useState<string | null>(null);
  const roleOf = (c: string) => draft.pwRoles?.[c]?.role ?? set.balanceDefault("pwRoles", c, "role") ?? 1;
  const first = (c: string) => set.balanceDefault("pwRoles", c, "role") ?? 1;
  const move = (c: string, r: number) => {
    onChange(c, "role", r === first(c) ? undefined : r);
    setPick(null);
  };
  return (
    <div className="pw-roles-editor">
      <p className="admin-hint">캐릭터를 끌어서 다른 역할 칸에 놓으세요 (또는 캐릭터를 누르고 옮길 칸을 누르기). 노란 = 처음 역할과 다름 · 테두리 = 아직 저장 안 함</p>
      <div className="pw-roles-cols">
        {PW_ROLE_IDS.map((r, i) => (
          <section
            key={r}
            className={`pw-roles-col ${pick ? "target" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const c = e.dataTransfer.getData("text/plain");
              if (c) move(c, i);
            }}
            onClick={() => pick && move(pick, i)}
          >
            <h4>{ROLE_NAME[r]}</h4>
            {CHARACTER_IDS.filter((c) => roleOf(c) === i).map((c) => (
              <button
                key={c}
                type="button"
                draggable
                className={`pw-roles-chip ${roleOf(c) !== first(c) ? "changed" : ""} ${(saved.pwRoles?.[c]?.role ?? first(c)) !== roleOf(c) ? "unsaved" : ""} ${pick === c ? "on" : ""}`}
                onDragStart={(e) => e.dataTransfer.setData("text/plain", c)}
                onClick={(e) => {
                  e.stopPropagation();
                  setPick(pick === c ? null : c);
                }}
              >
                <AdminThumb group="pwRoles" id={c} size={24} />
                {ko(c)}
              </button>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
