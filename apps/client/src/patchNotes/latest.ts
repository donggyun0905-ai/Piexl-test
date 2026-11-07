import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.74",
    date: "2026-11-07",
    items: {
      ko: [
        "미카엘라 무기 그림: 사용자 그림의 창 21개·검 16개를 하나씩 잘라 게임 무기로 · 방에 쏟아지는 무기·박힌 무기·손에 든 무기·몸 둘레에 떠다니는 무기·던진 무기·떨어지는 무기·베기·찌르기·바꿔 들기·무기고 모두 그 그림으로",
        "무기마다 그림 색에 맞는 속성 (예: 붉은 창 홍염 · 하늘색 수정 검 빙결 · 보라 낫창 자전 · 금빛 검 천광) · 그 무기로 공격하고 터질 때 그 속성 효과와 색 · 투척 뒤에는 다른 종류(검 ↔ 창)의 새 무기를 꺼냄",
      ],
      en: [
        "Michaela's weapon art: the 21 spears and 16 swords from the provided artwork are cut out one by one as in-game weapons · weapons raining into rooms, planted weapons, the weapon in hand, the floating swarm, thrown and falling weapons, slashes, thrusts, swaps and the Armory all use that art",
        "Each weapon has the element matching its colours (e.g. red spear Crimson Flame · sky-blue crystal sword Frost · violet scythe-spear Violet Storm · golden sword Heavenly Light) · attacks and explosions with it carry that element's effect and colour · after a throw she draws a new weapon of the other kind (sword ↔ spear)",
      ],
      ja: [
        "ミカエラの武器の絵：ユーザーの絵の槍21本・剣16本を1本ずつ切り出してゲームの武器に · 部屋に降り注ぐ武器・刺さった武器・手に持つ武器・体の周りに漂う武器・投げた武器・落ちてくる武器・斬り・突き・持ち替え・武器庫の全てがその絵",
        "武器ごとに絵の色に合う属性（例：赤い槍は紅炎 · 水色の水晶の剣は氷結 · 紫の鎌槍は紫電 · 金の剣は天光）· その武器での攻撃と爆発にその属性効果と色 · 投擲後は別の種類（剣 ↔ 槍）の新しい武器を取り出す",
      ],
    },
  },
  {
    version: "0.49.73",
    date: "2026-11-07",
    items: {
      ko: [
        "미카엘라 무기 속성 8가지: 쏟아지는 무기마다 성은·빙결·홍염·혈월·천광·자전·비취·청해 중 하나 · 그 무기로 베고·찌르고·던지고·터질 때 속성 효과 (성은 피해 +25%·크게 밀침 · 빙결 얼음·느려짐 · 홍염 화상 · 혈월 출혈 · 천광 빛 피해 · 자전 옆 적에게 번개 · 비취 독 · 청해 물결·멀리 밀침)",
        "미카엘라 무기 그림: 속성마다 날 색·폭·코등이·창 촉 모양이 다름 · 박힌 무기는 그 속성 색으로 빛남 · 몸 둘레에 여덟 속성 무기가 떠다님",
        "미카엘라 폭발이 속성마다 다르게: 은빛 충격파 · 얼음 가시 · 불기둥 · 붉은 X 베기 · 빛 십자 · 번개 갈래 · 독 거품 · 물결 고리 · 베기·찌르기·투척 빛도 그 무기 색",
        "버프 창에 지금 든 무기 (예: 홍염의 투창) · 투척 뒤 꺼내는 무기는 새 속성",
      ],
      en: [
        "Michaela's 8 weapon elements: every weapon that rains down has one of Sacred Silver, Frost, Crimson Flame, Blood Moon, Heavenly Light, Violet Storm, Jade or Azure Tide · slashes, thrusts, throws and explosions with it carry the element (Silver +25% damage and heavy knockback · Frost ice and slow · Flame burn · Blood Moon bleed · Light light damage · Storm lightning to a nearby foe · Jade poison · Tide water and far knockback)",
        "Michaela's weapon art: blade colour, width, guard and spearhead shape differ by element · planted weapons glow in their element colour · weapons of all eight elements float around her",
        "Michaela's explosions now differ by element: silver shockwave · ice spikes · fire pillars · crimson X slash · cross of light · forking lightning · poison bubbles · water rings · slash, thrust and throw trails take the weapon's colour",
        "The buff panel shows the weapon in hand (e.g. Crimson Flame Javelin) · the weapon drawn after a throw has a new element",
      ],
      ja: [
        "ミカエラの武器属性8種：降り注ぐ武器ごとに聖銀・氷結・紅炎・血月・天光・紫電・翡翠・青海のいずれか · その武器で斬る・突く・投げる・爆発する時に属性効果（聖銀 ダメージ+25%・大きく押し出す · 氷結 氷・鈍足 · 紅炎 火傷 · 血月 出血 · 天光 光ダメージ · 紫電 隣の敵へ雷 · 翡翠 毒 · 青海 水・遠くへ押し出す）",
        "ミカエラの武器の絵：属性ごとに刃の色・幅・鍔・槍の穂先の形が違う · 刺さった武器はその属性の色で光る · 体の周りに8属性の武器が漂う",
        "ミカエラの爆発が属性ごとに違う形に：銀の衝撃波 · 氷の棘 · 火柱 · 赤いX斬り · 光の十字 · 枝分かれする雷 · 毒の泡 · 水の輪 · 斬り・突き・投擲の光もその武器の色",
        "バフ欄に今持っている武器（例：紅炎の投槍）· 投擲後に取り出す武器は新しい属性",
      ],
    },
  },
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
