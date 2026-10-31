// 상태이상 탭: 게임의 상태이상 14종(+ 피해 없는 기절·느림)마다 쓰이는 값만 모든 묶음(무기·규칙·아이템 효과·적·보스)에서 모아 보여 줌
// 값은 원래 묶음에 그대로 저장 (같은 값을 두 번 넣지 않음). 값 이름을 낱말로 나눠 상태이상 낱말과 맞으면 그 상태이상으로 묶음
import type { BalanceSet, BalanceValues, DotKind } from "@pixel-rogue/shared";
import { useEffect, useRef, useState } from "react";
import { drawDotIcon } from "../game/dotIcons";
import { Cell } from "./BalanceEditor";
import { fieldLabel, GROUP_LABEL, rowLabel } from "./labels";

/** 상태이상 14종 (게임의 상태이상 피해 종류 DotKind와 같음, 문서 docs/STATUS.md) + 피해 없는 상태이상
 * words = 값 이름을 낱말로 나눴을 때 이 낱말이 있으면 · paths = "묶음/항목/값 앞부분" (낱말로 못 찾는 것) */
const KINDS: { kind?: DotKind; label: string; words: string[]; paths?: string[] }[] = [
  { kind: "bleed", label: "출혈", words: ["bleed", "blood", "sharpness"] },
  { kind: "burn", label: "화상", words: ["burn", "ignite", "fire", "flame", "ember", "napalm", "blaze"] },
  { kind: "poison", label: "독", words: ["poison", "venom", "toxic", "gas", "sting"] },
  { kind: "curse", label: "저주", words: ["curse", "hex", "seal"], paths: ["rules/ONI/yamata"] },
  { kind: "storm", label: "폭풍", words: ["storm", "gale"] },
  { kind: "rot", label: "부식", words: ["rot", "melt", "corrode", "corro", "acid", "decay"] },
  { kind: "death", label: "죽음", words: ["death", "doom", "reap"] },
  { kind: "hellfire", label: "지옥불", words: ["hellfire", "heresy"] },
  { kind: "shock", label: "감전", words: ["shock", "lightning", "thunder", "zap", "volt", "spark"] },
  { kind: "frost", label: "서리·빙결", words: ["frost", "freeze", "frozen", "ice", "chill", "cold", "snow"] },
  { kind: "tide", label: "물결", words: ["tide", "wet", "water"] },
  { kind: "gold", label: "황금", words: [], paths: ["rules/ONI/gold"] },
  { kind: "radiance", label: "광휘", words: ["radiance", "radiant", "holy"], paths: ["rules/ONI/genesis"] },
  { kind: "voidbolt", label: "공허탄", words: ["void", "voidbolt"], paths: ["rules/ONI/black"] },
  { label: "기절·속박·느림 (피해 없음)", words: ["stun", "root", "slow", "fear", "bind", "sluggish"] },
];

/** 값 이름 → 낱말 ("poisonDmg" → poison·dmg, "BURN_TICKS" → burn·ticks) */
const words = (key: string) => key.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase().split(/[._\d]+/).filter(Boolean);
/** 캐릭터 기본 스탯(돈 획득·예리함 0 등)은 상태이상 값이 아니라 뺌 */
const SKIP_GROUPS = new Set(["characters"]);

/** 상태이상 아이콘 (게임 피해 숫자 옆과 같은 그림) */
function DotIcon({ kind }: { kind: DotKind }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 10, 10);
    drawDotIcon(ctx, kind, 1, 1);
  }, [kind]);
  return <canvas ref={ref} width={10} height={10} className="admin-dot-icon" aria-hidden="true" />;
}

interface Props {
  set: BalanceSet;
  draft: BalanceValues;
  saved: BalanceValues;
  onChange: (group: string, id: string, key: string, v: number | undefined) => void;
}

export function StatusView({ set, draft, saved, onChange }: Props) {
  const [kind, setKind] = useState(0);
  const k = KINDS[kind]!;
  const hit = (gid: string, id: string, key: string) => words(key).some((w) => k.words.includes(w)) || !!k.paths?.some((p) => `${gid}/${id}/${key}`.startsWith(p));
  const rows = set.groups
    .filter((g) => !SKIP_GROUPS.has(g.id))
    .flatMap((g) => g.ids.map((id) => ({ g, id, fields: set.balanceFields(g, id).filter((f) => hit(g.id, id, f.key)) })).filter((r) => r.fields.length > 0));
  return (
    <div className="admin-table-wrap">
      <p className="admin-hint">상태이상에 쓰이는 값만 모았습니다. 여기서 바꾸면 원래 묶음(캐릭터·무기·규칙·아이템 효과)의 값이 바뀝니다.</p>
      <div className="admin-filter">
        {KINDS.map(({ kind: dk, label }, i) => (
          <button key={label} type="button" className={i === kind ? "active" : undefined} onClick={() => setKind(i)}>
            {dk && <DotIcon kind={dk} />}
            {label}
          </button>
        ))}
        <span className="admin-hint">{rows.length}개</span>
      </div>
      {rows.slice(0, 80).map(({ g, id, fields }) => (
        <section key={`${g.id}/${id}`} className="admin-row">
          <h4>
            {GROUP_LABEL[g.id]} · {rowLabel(g.id, id)} <small>{id}</small>
          </h4>
          <div className="admin-grid">
            {fields.map((f) => (
              <Cell
                key={`${f.key}:${draft[g.id]?.[id]?.[f.key] ?? ""}`}
                grid
                label={fieldLabel(f.key, g.id)}
                field={f}
                base={set.balanceDefault(g.id, id, f.key)!}
                value={draft[g.id]?.[id]?.[f.key]}
                saved={saved[g.id]?.[id]?.[f.key]}
                onChange={(v) => onChange(g.id, id, f.key, v)}
              />
            ))}
          </div>
        </section>
      ))}
      {rows.length > 80 && <p className="admin-hint">처음 80개만 보입니다.</p>}
    </div>
  );
}
