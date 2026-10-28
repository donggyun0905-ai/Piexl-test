import type { Lang } from "../index";

// 화면 글자: 일일 도전
export const DAILY_TEXT = {
  dailyNote: {
    ko: "하루 한 시드, 모두 같은 조건 (해금 미적용). 도전은 몇 번이든, 최고 기록만 올라갑니다.",
    en: "One seed a day, same conditions for everyone (no unlocks). Try as often as you like; only your best counts.",
    ja: "1日1シード、全員同じ条件 (解放なし)。何回でも挑戦でき、ベスト記録だけが載ります。",
  },
  dailyReset: { ko: "다음 시드까지", en: "Next seed in", ja: "次のシードまで" },
  dailyNormal: { ko: "일반", en: "Normal", ja: "通常" },
  suddenDeath: { ko: "서든데스", en: "Sudden Death", ja: "サドンデス" },
  suddenNote: {
    ko: "같은 시드, 한 대라도 맞으면 끝. 회복약·영약·체력 회복 패시브가 나오지 않고, 잠긴 출구를 체력으로 나갈 수 없습니다. 순위표는 따로입니다.",
    en: "Same seed, but one hit ends the run. No Potions, Elixirs or healing passives, and you can't pay HP to leave a locked exit. Separate leaderboard.",
    ja: "同じシードで、一度でも当たれば終了。回復薬・霊薬・体力回復パッシブは出ず、ロックされた出口を体力で抜けることもできません。ランキングは別です。",
  },
  dailyStart: { ko: "도전하기", en: "Start", ja: "挑戦する" },
  myBest: { ko: "내 최고", en: "My best", ja: "自己ベスト" },
  rankFmt: { ko: "{n}위", en: "#{n}", ja: "{n}位" },
  boardEmpty: { ko: "아직 기록이 없습니다", en: "No records yet", ja: "まだ記録がありません" },
  boardChecking: { ko: "기록 확인 중 (판을 다시 돌려 보는 중)", en: "Checking this record (replaying the run)", ja: "記録を確認中 (プレイを再現中)" },
  submitting: { ko: "기록 보내는 중…", en: "Submitting…", ja: "記録を送信中…" },
  submitImproved: { ko: "기록이 올라갔습니다", en: "Record submitted", ja: "記録を登録しました" },
  submitNotBetter: { ko: "최고 기록보다 낮아 그대로입니다", en: "Not above your best", ja: "ベストを超えませんでした" },
  submitRejected: { ko: "기록이 거절되었습니다", en: "Record rejected", ja: "記録が拒否されました" },
} satisfies Record<string, Record<Lang, string>>;
