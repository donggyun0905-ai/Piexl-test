// 패왕전 점수판 (Tab을 누르는 동안 · 버튼으로 열고 닫기): 편마다 이름·캐릭터·처치·데스·순위·무기·패시브·사용 아이템
import { allPlayers, inPlay, type PassiveId, type RunState } from "@pixel-rogue/shared";
import { useEffect, useState } from "react";
import { ItemIcon } from "../game/itemIcon";
import type { Lang, TextKey } from "../i18n";
import { itemName } from "../i18n/items";

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
              {pv.mode === "gungame" && <th>Lv</th>}
              <th>{t("pwGear")}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((i) => {
              const p = players[i]!;
              const seat = pv.seats[i]!;
              const counts = new Map<PassiveId, number>();
              for (const id of p.passives) counts.set(id, (counts.get(id) ?? 0) + 1);
              const who = names?.[i] ?? (seat.human ? t("pwYou") : `AI`);
              return (
                <tr key={i} className={`${i === me ? "me" : ""} ${inPlay(run, i) ? "" : "out"}`}>
                  <td>{rank.get(i)}</td>
                  <td>
                    <b>{who}</b> <small>{t(p.characterId)}</small>
                  </td>
                  <td>{seat.kills}</td>
                  <td>{seat.deaths}</td>
                  {pv.mode === "gungame" && <td>{seat.lv}</td>}
                  <td className="pw-gear">
                    <span title={itemName("weapon", p.weaponId, lang)}>
                      <ItemIcon item={{ kind: "weapon", id: p.weaponId }} size={18} />
                    </span>
                    {[...counts].map(([id, c]) => (
                      <span key={id} title={itemName("passive", id, lang)}>
                        <ItemIcon item={{ kind: "passive", id }} size={18} />
                        {c > 1 && <i>×{c}</i>}
                      </span>
                    ))}
                    {p.useSlots.map((id, k) =>
                      id ? (
                        <span key={`u${k}`} className="use" title={itemName("use", id, lang)}>
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
