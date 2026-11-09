import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.50.48",
    date: "2026-11-09",
    items: {
      ko: [
        "새 이벤트 '레이드' (만드는 중): 이벤트 창 → 레이드 → 보스 목록(루시퍼) → 준비하기 · 친구 초대·자동으로 사람 찾기·AI와 바로 시작 (늘 5명, 빈자리는 AI 동료)",
        "레이드 준비: 고른 캐릭터의 전용 패시브 전부 + 여신의 축복 · 무장실(무기 하나·사용 아이템 2개) → 대장간(999원) → 성좌의 방(제단 8개 중 하나, 증강을 대가 없이) → 단련의 방(포인트 30) → 레이드 방 (보스는 다음 업데이트)",
      ],
      en: [
        "New event 'Raid' (in progress): Events → Raid → boss list (Lucifer) → Get ready · invite friends, find others automatically, or start now with AI (always 5 players, AI allies fill empty seats)",
        "Raid prep: all of your character's exclusive passives + Goddess's Blessing · Armory (one weapon, 2 usable items) → Forge (999 gold) → Constellation hall (one of 8 altars, augment for free) → Training room (30 points) → Raid arena (boss in the next update)",
      ],
      ja: [
        "新イベント「レイド」(制作中)：イベント → レイド → ボス一覧(ルシファー) → 準備する · 友達招待・自動で人を探す・AIとすぐ始める (常に5人、空き席はAIの仲間)",
        "レイド準備：選んだキャラの専用パッシブすべて + 女神の祝福 · 武装室(武器ひとつ・使用アイテム2つ) → 鍛冶場(999ゴールド) → 星座の間(8つの祭壇からひとつ、増強を代償なし) → 鍛錬の間(ポイント30) → レイド部屋 (ボスは次のアップデート)",
      ],
    },
  },
];
