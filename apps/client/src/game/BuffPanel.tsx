// 로그 왼쪽 칸 맨 아래 버프 창: 방에서 얻은 것(제단·증강·바뀐 능력치 등, 금빛 · roomBuffs) · 변희 각성한 동물(보라, 마우스를 올리면 능력)·지금 켜진 버프(초록)·걸린 상태이상(빨강)·다시 쓰기까지 대기(회색)와 남은 초·막대 (buffView, 0.2초마다 새로)
import { useEffect, useRef, useState } from "react";
import { evolvedAnimals, type AnimalKind, type RunState } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { EVO_DESC } from "../i18n/items/morphEvo";
import { buffRows, type BuffRow } from "./buffView";
import { factionBuffs } from "./factionBuffs";
import { roomBuffs, type RoomBuff } from "./roomBuffs";

/** 변희 각성 설명 "각성(전용 능력 3개): 하이울프 · 20%로 …" → [이름, 능력] */
function evoText(a: AnimalKind, lang: Lang): [string, string] {
  const body = EVO_DESC[a][lang].split(/[:：]\s*/).slice(1).join(": ");
  const [name, ...rest] = body.split(" · ");
  return [name ?? a, rest.join(" · ")];
}

export function BuffPanel({ run, t, lang }: { run: () => RunState | null; t: (k: TextKey) => string; lang: Lang }) {
  const [rows, setRows] = useState<BuffRow[]>([]);
  const [evo, setEvo] = useState<AnimalKind[]>([]);
  const [room, setRoom] = useState<RoomBuff[]>([]);
  const max = useRef(new Map<string, number>());
  useEffect(() => {
    const id = window.setInterval(() => {
      const r = run();
      if (r) {
        setRows(buffRows(r.player, max.current));
        // 변희: 한 번이라도 각성한 동물 (다른 동물을 들어도 그 각성 기술이 계속 나옴)
        const now = evolvedAnimals(r.player);
        setEvo((was) => (was.join() === now.join() ? was : now));
        // 진영 특징 줄이 맨 위 (로그만)
        const got = [...factionBuffs(r, t), ...roomBuffs(r.player, r.floor, lang, t)];
        setRoom((was) => (JSON.stringify(was) === JSON.stringify(got) ? was : got));
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [run, lang, t]);
  return (
    <div className="buff-panel">
      <b>{t("bfTitle")}</b>
      {rows.length === 0 && evo.length === 0 && room.length === 0 && <small>{t("bfNone")}</small>}
      {room.map((b) => (
        <div key={b.key} className={`buff-row evo room${b.bad ? " bad" : ""}`} data-tip={b.tip}>
          <span>{b.label}</span>
        </div>
      ))}
      {evo.map((a) => {
        const [name, skill] = evoText(a, lang);
        return (
          <div key={a} className="buff-row evo" data-tip={`${name} · ${skill}`}>
            <span>
              {t("bfEvo")} · {name}
            </span>
          </div>
        );
      })}
      {rows.map((r) => (
        <div key={r.key} className={`buff-row ${r.kind}`}>
          <span>{t(r.key)}</span>
          <em>{r.sec}s</em>
          <i style={{ width: `${Math.round(r.ratio * 100)}%` }} />
        </div>
      ))}
    </div>
  );
}
