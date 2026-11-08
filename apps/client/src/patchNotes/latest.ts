import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.50.36",
    date: "2026-11-08",
    items: {
      ko: [
        "설명 글 정리: 캐릭터·스킬·아이템 설명의 중요 낱말(상태이상·치명타·약점 공격·성흔·각성·대시·'이름' 등)은 노란 굵은 글씨 · 수치(30%·×1.35·2.5초 등)는 Shift를 누르는 동안만 보임 (안 누르면 늘어남 ↑ · 줄어듦 ↓ · ◇로 짧게) · 단련의 방·능력치 창은 늘 수치 · 터치 기기는 늘 수치",
        "순례자의 월계선 동료: 이제 진짜 그 히든 캐릭터로 싸움 (그 캐릭터의 기본 공격·연계·패시브 기술·스킬 키·대시를 그대로 씀, 예전엔 휘두르기·탄만)",
        "능력치 창: 새벽의 성흔(헬피스트 빼고)에 약점 공격 확률·달빛 스택 확률·약점 추가 피해 줄",
      ],
      en: [
        "Cleaner descriptions: key words in character, skill and item descriptions (status effects, crit, weak-point, Stigma, Awakening, dash, 'names', etc.) are bold yellow · numbers (30%, ×1.35, 2.5s, etc.) show only while holding Shift (otherwise shortened to ↑ / ↓ / ◇) · the Training Room and stat panel always show numbers · touch devices always show numbers",
        "Pilgrim's Laurel Ship ally: now fights as the real hidden character (its own basic attacks, combos, passive techniques, skill keys and dash, instead of just a swing or shot)",
        "Stat panel: Stigma of Dawn characters (except Hellfist) show weak-point chance, Moonlight stack chance and weak-point bonus damage",
      ],
      ja: [
        "説明文の整理：キャラクター・スキル・アイテム説明の重要語（状態異常・クリティカル・弱点攻撃・聖痕・覚醒・ダッシュ・「名前」など）は黄色の太字 · 数値（30%・×1.35・2.5秒など）はShiftを押している間だけ表示（押さないと ↑ ・ ↓ ・ ◇ で短く）· 鍛錬の部屋・能力値画面は常に数値 · タッチ端末は常に数値",
        "巡礼者の月桂船の仲間：本物のそのヒドゥンキャラクターとして戦うように（そのキャラクターの通常攻撃・連携・パッシブ技・スキルキー・ダッシュをそのまま使用、以前は振り・弾のみ）",
        "能力値画面：夜明けの聖痕（ヘルフィスト以外）に弱点攻撃確率・月光スタック確率・弱点追加ダメージを表示",
      ],
    },
  },
];
