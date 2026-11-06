import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.71",
    date: "2026-11-07",
    items: {
      ko: [
        "성국 새 캐릭터 유리엘 '단죄의 성녀' (스킬형): 맞힌 적에게 단죄가 쌓이고 5개면 정화의 빛이 터짐 (200% 빛 피해 · 체력 회복) · 결계 안에서 받는 피해 -30%·회복, 안의 적은 느려지고 더 맞음 · 해금: 최대 체력 200 달성",
        "유리엘 3연격: 철퇴 휘두르기 둘 → 사슬 철퇴 한 바퀴 (맞힌 적 수만큼 체력 회복)",
        "유리엘 숫자 키 스킬 넷: 1 정화의 빛 (둘레 빛 피해·체력 12% 회복) · 2 집행의 철퇴 (던져서 끌어당기며 기절) · 3 수호 결계 (6초) · 4 성녀의 단죄 (방의 모든 적에게 빛의 철퇴·체력 40% 회복·8초 성녀 강림)",
        "유리엘 무기 1 (성수 수정구 & 집행의 철퇴) · 전용 아이템 20 · 그림 시트 · 철퇴·결계·정화 이펙트 · 패왕전 스킬 (힐러)",
      ],
      en: [
        "New Holy Kingdom character Yuriel 'The Saint of Judgment' (skill-based): hits stack Sin on foes and at 5 it bursts into Purging Light (200% light damage · heals) · inside a ward she takes -30% damage and heals while foes inside are slowed and take more damage · unlock: reach 200 max HP",
        "Yuriel's 3-hit chain: two flail swings → chain spin (heals per foe hit)",
        "Yuriel's four number-key skills: 1 Light of Purification (light damage around her · heal 12% HP) · 2 Flail of Execution (thrown, drags foes in and stuns) · 3 Guardian Ward (6s) · 4 Saint's Judgment (flails of light strike every foe in the room · heal 40% HP · 8s Saint's Descent)",
        "Yuriel: 1 weapon (Holy Water Orb & Flail of Execution) · 20 exclusive items · sprite sheet · flail, ward and purge effects · Paewang skills (healer)",
      ],
      ja: [
        "聖国の新キャラクター ユリエル「断罪の聖女」（スキル型）：当てた敵に断罪が溜まり、5つで浄化の光が炸裂（200%光ダメージ・体力回復）· 結界の中では受けるダメージ-30%・回復、中の敵は鈍足になり被ダメージ増加 · 解放：最大体力200達成",
        "ユリエルの3連撃：鉄槌の振り2回 → 鎖の一回転（当てた敵の数だけ体力回復）",
        "ユリエルの数字キーのスキル4つ：1 浄化の光（周りに光ダメージ・体力12%回復）· 2 執行の鉄槌（投げて引き寄せ気絶）· 3 守護結界（6秒）· 4 聖女の断罪（部屋の全ての敵に光の鉄槌・体力40%回復・8秒聖女降臨）",
        "ユリエル：武器1（聖水の水晶球＆執行の鉄槌）· 専用アイテム20 · スプライトシート · 鉄槌・結界・浄化のエフェクト · 覇王戦スキル（ヒーラー）",
      ],
    },
  },
];
