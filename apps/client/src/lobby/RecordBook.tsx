// 전시장 기록집 창 (가운데 책 · 전시물 앞에서 F): 전시물마다 얻었는지 · 모은 수 · 히든 캐릭터까지 남은 기록 (lobby/exhibits)
import type { TextKey } from "../i18n";
import { HALL_GOALS, loadExhibits, loadRecords, type ExhibitId } from "./exhibits";

const EX: Record<ExhibitId, { name: TextKey; desc: TextKey; goal: TextKey; rec: TextKey }> = {
  soulShard: { name: "exSoulShard", desc: "exSoulShardDesc", goal: "exSoulGoal", rec: "exSoulRec" },
  laurelShip: { name: "exLaurelShip", desc: "exLaurelShipDesc", goal: "exShipGoal", rec: "exShipRec" },
};

export function RecordBook({ t, onClose }: { t: (k: TextKey) => string; onClose: () => void }) {
  const ex = loadExhibits();
  const rec = loadRecords();
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal record-book" role="dialog" aria-modal="true" aria-label={t("exBook")} onClick={(e) => e.stopPropagation()}>
        <h3>📖 {t("exBook")}</h3>
        <p className="record-sub">{t("exBookSub")}</p>
        {HALL_GOALS.map((g) => {
          const e = EX[g.ex];
          const have = ex[g.ex];
          const n = Math.min(rec[g.rec], g.need);
          const done = rec[g.rec] >= g.need;
          return (
            <section key={g.ex} className={`record-row ${have ? "" : "locked"} ${done ? "done" : ""}`}>
              <header>
                <b>{have ? t(e.name) : "???"}</b>
                <small>{have ? t("exGot").replace("{n}", String(have.count)).replace("{date}", have.date) : t("exNotYet")}</small>
              </header>
              {have && <p>{t(e.desc)}</p>}
              <div className="record-goal">
                <span>{t(e.rec)}</span>
                <strong>
                  {n.toLocaleString()} / {g.need.toLocaleString()}
                </strong>
              </div>
              <div className="record-bar">
                <i style={{ width: `${(n / g.need) * 100}%` }} />
              </div>
              <small className="record-reward">{done ? t("exDone") : t(e.goal)}</small>
            </section>
          );
        })}
        <button type="button" className="secondary" onClick={onClose}>
          {t("close")}
        </button>
      </div>
    </div>
  );
}
