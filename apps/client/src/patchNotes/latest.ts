import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.51.6",
    date: "2026-11-10",
    items: {
      ko: [
        "레이드: 기절·공포·느려짐을 거는 캐릭터가 있으면 루시퍼가 계속 묶여 공격도 변신(2페이즈)도 하지 않던 문제 고침 (루시퍼는 이제 묶이지 않음)",
        "레이드: '적 최대 체력의 %' 피해(출혈·역병·이무기 독·악의 사도 가면 등)는 레이드 적에게 던전 라스트 보스 체력(9,600)까지만 셈 — 혼자 루시퍼 체력을 다 깎던 문제 고침",
        "레이드: 캐릭터마다 레이드 피해 배율 (AI 레이드 측정으로 너무 센 캐릭터는 내리고 약한 지원 캐릭터는 조금 올림, 관리자에서 조정 가능)",
        "레이드 AI 동료: 루시퍼 몸에 닿지 않게 사거리 안쪽에 섬 · 원·부채꼴·선·X자 위험 표시를 피함 · 큰 불기둥은 일찍 대시 · 검기 빈칸으로 대시 · 다가오는 루시퍼·검·불길에서 물러남",
        "패왕전: 전체 72명 AI 1대1 리그전(2,556대결)을 두 번 돌려 모든 캐릭터 공격력·받는 피해를 다시 맞춤 (승률 15~83% → 42~65%)",
      ],
      en: [
        "Raid: fixed Lucifer being locked by stun / fear / slow from some characters, so he never attacked or transformed into phase 2 (Lucifer can no longer be locked)",
        "Raid: '% of max HP' damage (bleed, plague, Imugi venom, Apostle mask, etc.) now counts raid enemies' HP only up to the dungeon last boss (9,600) — no more one character melting Lucifer alone",
        "Raid: per-character raid damage multipliers (from AI raid runs: the strongest are lowered, weak supports raised a little; tunable in admin)",
        "Raid AI allies: stay inside range without touching Lucifer · dodge circle / cone / line / X warnings · dash early out of the big fire pillars · dash to sword-slash safe spots · back off approaching Lucifer / swords / flames",
        "Paewang: re-tuned every character's damage and damage taken from two full AI 1v1 round-robins of all 72 characters (2,556 matchups) (win rates 15–83% → 42–65%)",
      ],
      ja: [
        "レイド: スタン・恐怖・鈍足をかけるキャラがいるとルシファーがずっと止まり、攻撃も変身(フェーズ2)もしなかった問題を修正 (ルシファーは止まらなくなった)",
        "レイド: 「敵の最大体力の%」ダメージ (出血・疫病・イムギの毒・悪の使徒の仮面など) はレイドの敵にはダンジョンのラストボス体力(9,600)までで計算 — 1人でルシファーを削り切っていた問題を修正",
        "レイド: キャラごとのレイドダメージ倍率 (AIレイド測定で強すぎるキャラは下げ、弱いサポートは少し上げ、管理者で調整可能)",
        "レイドAIの仲間: ルシファーの体に触れないよう射程の内側に立つ · 円・扇形・線・X字の危険表示を避ける · 大きな火柱は早めにダッシュ · 剣気の空き地へダッシュ · 近づくルシファー・剣・炎から離れる",
        "覇王戦: 全72キャラのAI 1対1総当たり(2,556対戦)を2回回し、全キャラの攻撃力・被ダメージを再調整 (勝率 15〜83% → 42〜65%)",
      ],
    },
  },
];
