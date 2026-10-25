// 연습장 적 부르기: 세기(층) 고르기 + 졸개·단계별 보스·라스트 보스 묶음 (몬스터 그림과 이름)
import type { EnemyKind } from "@pixel-rogue/shared";
import type { TextKey } from "../../i18n";
import { EnemyPortrait } from "../../codex/EnemyPortrait";
import { ENEMY_GROUPS, ENEMY_NAMES } from "./practiceGroups";
import { groupTitle } from "./PracticeItems";

interface Props {
  floor: number;
  t: (key: TextKey) => string;
  onFloor: (floor: number) => void;
  onSpawn: (kind: EnemyKind) => void;
}

const FLOORS = [1, 2, 3, 4, 5, 6, 7];

export function PracticeEnemies({ floor, t, onFloor, onSpawn }: Props) {
  return (
    <>
      <div className="practice-floor">
        <span>{t("practiceFloor")}</span>
        {FLOORS.map((f) => (
          <button key={f} type="button" className={f === floor ? "on" : ""} onClick={() => onFloor(f)}>
            {f}
          </button>
        ))}
      </div>
      <small className="practice-floor-note">{t("practiceFloorNote")}</small>
      {ENEMY_GROUPS.map((g) => (
        <details key={g.key} className="practice-group" open={g.open}>
          <summary>
            {groupTitle(g, t)}
            {g.key !== "minion" && (
              <button type="button" className="practice-fit" onClick={(e) => (e.preventDefault(), onFloor(g.floor))}>
                {t("practiceFit").replace("{n}", String(g.floor))}
              </button>
            )}
          </summary>
          <div className="practice-enemies">
            {g.list.map((kind) => (
              <button key={kind} type="button" className="practice-enemy" onClick={() => onSpawn(kind)}>
                <EnemyPortrait kind={kind} size={32} />
                <span>{t(ENEMY_NAMES[kind]!)}</span>
              </button>
            ))}
          </div>
        </details>
      ))}
    </>
  );
}
