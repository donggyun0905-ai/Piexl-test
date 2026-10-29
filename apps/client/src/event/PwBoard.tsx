// 패왕전 점수판 (Tab을 누르는 동안 · 버튼으로 열고 닫기): 편마다 이름·캐릭터·처치·데스·준 피해·받은 피해·순위·무기·패시브·사용 아이템
import { allPlayers, inPlay, isGrow, type PassiveId, type RunState } from "@pixel-rogue/shared";
import { useEffect, useState, type MouseEvent } from "react";
import { ItemIcon, type IconItem } from "../game/itemIcon";
import { ItemTip, tipPos, useCloseOutside, type TipPos } from "../game/ItemTip";
import type { Lang, TextKey } from "../i18n";
import { itemDesc, itemName } from "../i18n/items";
import { gearLines } from "./PwShop";

interface Props {
  run: RunState;
  me: number;
  /** 사람 이름 (같이 하기) · 없으면 AI는 캐릭터 이름 */
  names?: readonly string[];
  lang: Lang;
  t: (k: TextKey) => string;
}

export function PwBoard({ run, me, names, lang, t }: Props) {
  const pv = run.pvp!;
  // 무기·패시브·사용 아이템에 마우스를 올리면(모바일은 누르면) 설명 말풍선
  const [tip, setTip] = useState<{ pos: TipPos; item: IconItem; grow?: boolean } | null>(null);
  const touch = window.matchMedia("(pointer: coarse)").matches;
  useCloseOutside(!!tip && touch, ".pw-gear span", setTip);
  const hover = (item: IconItem, grow = false) => {
    const show = (e: MouseEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      setTip({ pos: tipPos(r.left + r.width / 2, r.top - 4, r.bottom + 4), item, grow });
    };
    return { onMouseEnter: (e: MouseEvent<HTMLElement>) => !touch && show(e), onMouseLeave: () => !touch && setTip(null), onClick: (e: MouseEvent<HTMLElement>) => touch && show(e) };
  };
  const players = allPlayers(run);
  // 순위: 처치 많은 순 (같으면 데스 적은 순 · 데스매치는 레벨 먼저)
  const order = players.map((_, i) => i).sort((a, b) => {
    const A = pv.seats[a]!;
    const B = pv.seats[b]!;
    return (pv.mode === "gungame" ? B.lv - A.lv : 0) || B.kills - A.kills || A.deaths - B.deaths || a - b;
  });
  const rank = new Map(order.map((i, k) => [i, k + 1]));
  const teams = [...new Set(pv.seats.map((x) => x.team))];
  const mine = pv.seats[me]!.team;
  teams.sort((a, b) => (a === mine ? -1 : b === mine ? 1 : a - b));
  const ffa = teams.length > 2;
  // 성장 대결: 레벨 · 지금까지 번 돈 · 산 장비 (상대 편도 보임)
  const grow = isGrow(run);
  const earned = (i: number) => ((run.seat ?? 0) === i ? run.goldEarned : (run.party?.[i]?.goldEarned ?? 0));
  const groups = ffa ? [order] : teams.map((tm) => order.filter((i) => pv.seats[i]!.team === tm));
  return (
    <div className="pw-board" role="dialog" aria-label={t("pwBoard")}>
      {groups.map((list, g) => (
        <table key={g} className={ffa ? "" : g === 0 ? "ours" : "theirs"}>
          <caption>{ffa ? t("pwBoard") : t(g === 0 ? "pwOurs" : "pwTheirs")}</caption>
          <thead>
            <tr>
              <th>#</th>
              <th>{t("pwWho")}</th>
              <th>K</th>
              <th>D</th>
              <th>{t("pwDealt")}</th>
              <th>{t("pwTaken")}</th>
              <th>{t("pwHealed")}</th>
              {(pv.mode === "gungame" || grow) && <th>Lv</th>}
              {grow && <th>🪙</th>}
              <th>{t("pwGear")}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((i) => {
              const p = players[i]!;
              const seat = pv.seats[i]!;
              const counts = new Map<PassiveId, number>();
              for (const id of p.passives) counts.set(id, (counts.get(id) ?? 0) + 1);
              const who = seatWho(run, i, names, t);
              return (
                <tr key={i} className={`${i === me ? "me" : ""} ${inPlay(run, i) ? "" : "out"}`}>
                  <td>{rank.get(i)}</td>
                  <td>
                    <b>{who}</b> <small>{t(p.characterId)}</small>
                  </td>
                  <td>{seat.kills}</td>
                  <td>{seat.deaths}</td>
                  <td className="pw-dealt">{Math.round(seat.dealt ?? 0)}</td>
                  <td className="pw-taken">{Math.round(seat.taken ?? 0)}</td>
                  <td className="pw-healed">{Math.round(seat.healAll ?? 0)}</td>
                  {pv.mode === "gungame" && <td>{seat.lv}</td>}
                  {grow && <td className="pw-lv">{p.pwLv ?? 1}</td>}
                  {grow && <td className="pw-gold">{earned(i).toLocaleString()}</td>}
                  <td className="pw-gear">
                    <span {...hover({ kind: "weapon", id: p.weaponId })}>
                      <ItemIcon item={{ kind: "weapon", id: p.weaponId }} size={18} />
                    </span>
                    {[...counts].map(([id, c]) => (
                      <span key={id} {...hover({ kind: "passive", id })}>
                        <ItemIcon item={{ kind: "passive", id }} size={18} />
                        {c > 1 && <i>×{c}</i>}
                      </span>
                    ))}
                    {(p.pwGear ?? []).map((id, k) => (
                      <span key={`g${k}`} className="grow" {...hover({ kind: "passive", id: id as PassiveId }, true)}>
                        <ItemIcon item={{ kind: "passive", id: id as PassiveId }} size={18} />
                      </span>
                    ))}
                    {p.useSlots.map((id, k) =>
                      id ? (
                        <span key={`u${k}`} className="use" {...hover({ kind: "use", id })}>
                          <ItemIcon item={{ kind: "use", id }} size={18} />
                        </span>
                      ) : null,
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ))}
      {tip && <ItemTip pos={tip.pos} icon={tip.item} name={itemName(tip.item.kind, tip.item.id, lang)} desc={tip.grow ? gearLines(tip.item.id, t).join(" · ") : itemDesc(tip.item.kind, tip.item.id, lang, t)} />}
    </div>
  );
}

/** 점수판 열림: Tab을 누르는 동안 열림 · 버튼(모바일)은 눌러 열고 닫기 */
export function useBoard(): [boolean, () => void] {
  const [held, setHeld] = useState(false);
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code !== "Tab") return;
      e.preventDefault();
      setHeld(true);
    };
    const up = (e: KeyboardEvent) => e.code === "Tab" && setHeld(false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);
  return [held || pinned, () => setPinned((v) => !v)];
}

/** 자리 이름: 같이 하기는 사람 이름 · 혼자 하기는 나 / AI */
export function seatWho(run: RunState, i: number, names: readonly string[] | undefined, t: (k: TextKey) => string): string {
  return names?.[i] ?? (run.pvp!.seats[i]!.human ? t("pwYou") : "AI");
}
