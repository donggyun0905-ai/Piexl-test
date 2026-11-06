import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.72",
    date: "2026-11-07",
    items: {
      ko: [
        "성국 새 캐릭터 미카엘라 '공허의 인도자' (스킬형): 방에 들어서면 포탈에서 무기가 쏟아져 곳곳에 박힘 · 박힌 무기에 몸을 대면 그 무기(검·투창)로 바꿔 듦 · 대시하면 범위 안의 박힌 무기로 순간 이동해 바꿔 듦 · 해금: 공격 속도 1.7 달성",
        "미카엘라 콤보·연쇄 폭발: 바꾸거나 던질 때마다 콤보 (하나마다 피해 +3%, 최대 20) 와 폭발 · 폭발 둘레의 박힌 무기도 연달아 터짐",
        "미카엘라 3연격: 검이면 베기 · 투창이면 찌르기 둘 → 투척 (박혀 폭발) · 숫자 키 스킬 넷: 1 무기 비 · 2 칼날 교대 · 3 일제 폭파 · 4 무한의 무기고",
        "미카엘라 무기 1 (무한의 무기 보관소) · 전용 아이템 20 · 그림 시트 · 박힌 무기·떠다니는 무기·포탈·폭발 이펙트 · 패왕전 스킬",
      ],
      en: [
        "New Holy Kingdom character Michaela 'The Void Guide' (skill-based): on entering a room, weapons pour from a portal and stick into the ground · touch a planted weapon to swap to it (sword or javelin) · dashing teleports you to a planted weapon in range and swaps · unlock: reach 1.7 attack speed",
        "Michaela's combo and chain explosions: every swap or throw builds combo (+3% damage each, up to 20) and an explosion · planted weapons near an explosion go off in a chain",
        "Michaela's 3-hit chain: two sword slashes or spear thrusts → throw (sticks and explodes) · four number-key skills: 1 Weapon Rain · 2 Blade Swap · 3 Mass Detonation · 4 Infinite Armory",
        "Michaela: 1 weapon (Infinite Armory) · 20 exclusive items · sprite sheet · planted and floating weapons, portal and explosion effects · Paewang skills",
      ],
      ja: [
        "聖国の新キャラクター ミカエラ「虚空の導き手」（スキル型）：部屋に入るとポータルから武器が降り注ぎあちこちに刺さる · 刺さった武器に触れるとその武器（剣・投槍）に持ち替える · ダッシュすると範囲内の刺さった武器へ瞬間移動して持ち替える · 解放：攻撃速度1.7達成",
        "ミカエラのコンボと連鎖爆発：持ち替えや投擲のたびにコンボ（1つごとにダメージ+3%、最大20）と爆発 · 爆発の周りの刺さった武器も連鎖して爆発",
        "ミカエラの3連撃：剣なら斬り・投槍なら突き2回 → 投擲（刺さって爆発）· 数字キーのスキル4つ：1 武器の雨 · 2 刃の交代 · 3 一斉爆破 · 4 無限の武器庫",
        "ミカエラ：武器1（無限の武器庫）· 専用アイテム20 · スプライトシート · 刺さった武器・漂う武器・ポータル・爆発のエフェクト · 覇王戦スキル",
      ],
    },
  },
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
