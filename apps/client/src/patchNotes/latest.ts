import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.12",
    date: "2026-11-04",
    items: {
      ko: ["히든 아이템 '떨어진 신의 날개' 모습을 새로 그림: 등 뒤로 활짝 펼친 깃털 날개(긴 첫째 깃·늘어진 둘째 깃·덮깃 세 겹, 짙은 청록 → 하늘빛 → 흰 끝) · 천천히 퍼덕이고 깃 끝에서 빛 가루가 흩날림"],
      en: ["Hidden item 'Fallen God's Wings' redrawn: wide feathered wings spread behind you (three layers of long primaries, drooping secondaries and coverts, deep teal → sky blue → white tips) · they flap slowly and shed motes of light from the tips"],
      ja: ["隠しアイテム「堕ちた神の翼」の見た目を一新：背中に大きく広げた羽根の翼（長い初列風切・垂れた次列風切・雨覆の三層、深い青緑 → 空色 → 白い先端）· ゆっくり羽ばたき、羽先から光の粉が舞う"],
    },
  },
  {
    version: "0.49.11",
    date: "2026-11-04",
    items: {
      ko: [
        "새 캐릭터 오닉스(아스칼론, 영물): 몸에 일곱 보석이 박힌 광석 영물 · 체력 190·방어력 30, 느린 걸음, 맞아도 무적이 거의 없음 · 칠보 광륜으로 방 안 모든 적을 한 번에 치지만 쏘는 동안 못 움직임 · 대시는 하늘을 나는 부스트(한 번 누르면 계속 날고 다시 누르면 내려앉음, 무적 아님) · 날아오를 때·내려앉을 때·비행 중 보석 7개가 저마다 확률로 반응: 홍옥 불기둥·호박 운석·황옥 연쇄 번개·비취 덩굴·청옥 서리·남옥 빛줄기·자수정 공허 · 일곱이 함께 반응하면 칠보 공명 · 전용 아이템 10 (연마된 보석·보석 왕관·비상의 날개·낙하 충격·공명석·광물 갑피·프리즘 광륜·수정 반격·빠른 집광·보석 꼬리)",
      ],
      en: [
        "New character Onyx (Ascalon, Spirit Beast): a mineral spirit with seven gems in its body · 190 HP, 30 Defense, slow walk, almost no invincibility when hit · the Seven-Gem Halo hits every foe in the room at once but roots you while casting · Dash is a flight boost (press once to keep flying, again to land; not invincible) · on takeoff, on landing and in flight each of the 7 gems rolls its own chance: Ruby fire pillar · Amber meteors · Topaz chain lightning · Jade vines · Sapphire frost · Aquamarine beam · Amethyst void · all seven at once trigger Seven-Gem Resonance · 10 exclusive items (Polished Gems · Gem Crown · Soaring Wings · Meteor Landing · Resonance Stone · Mineral Hide · Prism Halo · Crystal Riposte · Quick Focus · Gem Trail)",
      ],
      ja: [
        "新キャラ オニキス（アスカロン、霊獣）：体に七つの宝石が埋まった鉱石の霊獣 · 体力190・防御力30、遅い歩み、被弾しても無敵がほとんどない · 七宝の光輪で部屋の全ての敵を一度に撃つが撃つ間は動けない · ダッシュは空を飛ぶブースト（一度押すと飛び続け、もう一度で着地、無敵ではない）· 飛び立つ時・着地する時・飛行中に7つの宝石がそれぞれの確率で反応：ルビーの火柱・琥珀の隕石・トパーズの連鎖雷・翡翠の茨・サファイアの霜・アクアマリンの光線・アメジストの虚無 · 7つ同時なら七宝共鳴 · 専用アイテム10（磨かれた宝石・宝石の冠・飛翔の翼・落下の衝撃・共鳴石・鉱物の甲殻・プリズムの光輪・水晶の反撃・素早い集光・宝石の尾）",
      ],
    },
  },
  {
    version: "0.49.10",
    date: "2026-11-04",
    items: {
      ko: [
        "새 캐릭터 레오(아스칼론, 영물): 이마에 보석이 박힌 뇌전의 사자 · 뇌전 발톱 하나로 번갈아 할퀴고 세 번째마다 번개 물기 · 맞힌 적에 뇌인 · 전하가 차면 사자후로 방 안 모든 적에게 낙뢰 · 보석이 몇 초마다 가장 먼 적에게 낙뢰 · 전용 아이템 10 (번개 갈기·천뢰 보석·우레 포효·뇌광 도약·연쇄 뇌전·뇌운·사자의 긍지·번개 송곳니·황금 갑주·백수의 왕)",
        "풍류사 분신술: 분신이 옆에 붙어 따라 쓰지 않고, 저마다 다른 적을 찾아 따로 돌아다니며 제 박자로 글자를 씀",
      ],
      en: [
        "New character Leo (Ascalon, Spirit Beast): a thunder lion with a gem in his brow · rakes with his Thunder Claws and bites with lightning every third strike · hits leave Thunder Marks · full charge unleashes Lion's Roar, striking every foe in the room · the gem strikes the farthest foe every few seconds · 10 exclusive items",
        "Pungryu Clone Art: clones no longer just copy your letters at your side — each roams to its own target and writes on its own rhythm",
      ],
      ja: [
        "新キャラ レオ（アスカロン、霊獣）：額に宝石が埋まった雷電の獅子 · 雷電の爪で交互に引っかき3回目ごとに雷の噛みつき · 当てた敵に雷印 · 電荷が満ちると獅子吼で部屋の全ての敵に落雷 · 宝石が数秒ごとに一番遠い敵に落雷 · 専用アイテム10",
        "風流士の分身術：分身が横で真似して書くのではなく、それぞれ別の敵を追って動き回り自分のリズムで文字を書く",
      ],
    },
  },
  {
    version: "0.49.9",
    date: "2026-11-04",
    items: {
      ko: ["숨은 시련 '죽음의 바다': 숨 게이지가 캐릭터 뒤에 가려지던 것을 고쳐, 캐릭터 위 체력 줄 바로 위에 보이게 함"],
      en: ["Hidden trial 'Sea of Death': the breath gauge no longer hides behind your character and now sits right above your health bar"],
      ja: ["隠し試練「死の海」: 息ゲージがキャラクターの後ろに隠れていたのを直し、頭上の体力バーのすぐ上に表示"],
    },
  },
];
