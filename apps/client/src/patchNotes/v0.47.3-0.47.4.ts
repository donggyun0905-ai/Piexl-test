import type { PatchNote } from "./types";

// 지난 기록 (0.47.3 ~ 0.47.4)
export const NOTES: PatchNote[] = [
  {
    version: "0.47.4",
    date: "2026-10-21",
    items: {
      ko: [
        "의사 전용 아이템 강화: 상처 봉합 회복률 9% · 체력 관리 보호막 최대 60% · 건강 체질 피해 +20% · 응급 처치 처치당 회복 3 · 건강 검진 3초 · 과잉 진료 공격 속도 +25% · 처방전 회복량 +50% · 의사 가운 받는 피해 -15%·이동 속도 +25% · 수술 집도 범위 +25%·사거리 +20% · 항체 반응 200%·범위 60",
        "의사 무기 강화: 주사기 더 빠름 · 메스 사거리 40·회복 3배 · 수혈 튜브 사거리 90·회복 4배 · 제세동기 1.1초마다·1초 기절 · 봉합 바늘 5개·실 80%·봉합 150% · 마취 가스 범위 32·4초·초당 80% · 링거 폴대 0.8초마다·범위 48·더 크게 밀어냄 · 알약 7개 · 구급 키트 범위 32·알약 40%·회복 6 · 붕대 채찍 사거리 80·속박 1.5초 · 구급차 2초마다·너비 12·왕복 보호막 6",
      ],
      en: [
        "Doctor items buffed: Wound Stitching 9% healing · Health Care 60% shield cap · Robust Body +20% damage · First Aid heals 3 per kill · Checkup after 3s · Overtreatment +25% attack speed · Prescription +50% healing · Doctor's Coat -15% damage taken, +25% move speed · Lead Surgeon +25% area, +20% range · Antibody Response 200%, radius 60",
        "Doctor weapons buffed: faster Syringe · Scalpel range 40, triple healing · Transfusion Tube range 90, quadruple healing · Defibrillator every 1.1s, 1s stun · Suture Needle up to 5, threads 80%, suture 150% · Anesthetic Canister radius 32, 4s, 80%/s · IV Pole every 0.8s, radius 48, bigger knockback · 7 pills · Medkit Bomb radius 32, 40% pill chance, pills heal 6 · Bandage Whip range 80, 1.5s root · Ambulance every 2s, width 12, round trip costs 6 shield",
      ],
      ja: [
        "医者専用アイテム強化：傷の縫合 回復率9% · 体調管理 シールド上限60% · 健康体質 ダメージ+20% · 応急処置 撃破ごとに回復3 · 健康診断 3秒 · 過剰診療 攻撃速度+25% · 処方箋 回復量+50% · 白衣 被ダメージ-15%・移動速度+25% · 執刀 範囲+25%・射程+20% · 抗体反応 200%・範囲60",
        "医者の武器強化：注射器がより速く · メス 射程40・回復3倍 · 輸血チューブ 射程90・回復4倍 · 除細動器 1.1秒ごと・1秒気絶 · 縫合針 最大5本・糸80%・縫合150% · 麻酔ガス 範囲32・4秒・毎秒80% · 点滴スタンド 0.8秒ごと・範囲48・大きく吹き飛ばす · 錠剤7個 · 救急キット 範囲32・錠剤40%・回復6 · 包帯ムチ 射程80・拘束1.5秒 · 救急車 2秒ごと・幅12・往復はシールド6",
      ],
    },
  },
  {
    version: "0.47.3",
    date: "2026-10-21",
    items: {
      ko: [
        "의사 강화: 모든 무기 피해 +60% (주사기 초당 피해 19 → 30), 최대 체력 85 → 100",
        "의사 초과 치료 강화: 공격 회복 3% → 4% (상처 봉합 5% → 7%), 초당 회복 상한 2 → 3 (수혈 튜브 3 → 4), 보호막 최대치 최대 체력의 30% → 35% (체력 관리 45% → 50%)",
      ],
      en: [
        "Doctor buff: all weapons deal +60% damage (Syringe 19 → 30 damage per second), max health 85 → 100",
        "Doctor Overheal buffed: attack healing 3% → 4% (Wound Stitching 5% → 7%), heal cap per second 2 → 3 (Transfusion Tube 3 → 4), shield cap 30% → 35% of max health (Health Care 45% → 50%)",
      ],
      ja: [
        "医者強化：全武器のダメージ+60%（注射器の毎秒ダメージ 19 → 30）、最大体力 85 → 100",
        "医者の過剰回復強化：攻撃回復 3% → 4%（傷の縫合 5% → 7%）、毎秒の回復上限 2 → 3（輸血チューブ 3 → 4）、シールド上限 最大体力の30% → 35%（体調管理 45% → 50%）",
      ],
    },
  },
];
