import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.346",
    date: "2026-11-02",
    items: {
      ko: [
        "비밀의 방: 히든 상점이 나오는 판(혼자 하기·협동)에서 일반 전투방에 처음 들어가면 5% 확률로 벽 어딘가에 금 간 곳이 생김. 몸이 닿으면 벽이 무너지며(소리·효과) 문이 열리고, 들어가면 악마의 방·도박꾼의 방·암흑가 경매장 중 하나 (같은 확률). 비밀의 방 출구는 원래 방 출구와 같음",
        "악마의 방: 텅 빈 암흑 속 사탄의 석상 앞에 거래 셋 (F로 거래, 최대 체력을 바침) · 악마의 피(공격력 +6·+30%·방어력 +20, 30) · 사탄의 가면(가까운 적 다섯에게 죽음의 오라, 45) · 붉은 반점(방어력 +30, 공격력 패시브마다 +5, 45) · 누군가의 절규(공격 속도 +30%·모든 공격 범위 피해 50%, 30) · 뒤집어진 십자가(보스 피해 +66%, 40) · 그림 리퍼(적 방어력 -30, 35). 오라·낫 효과",
        "악마와 한 번이라도 거래하면 7층(라스트 보스 층)은 여신의 축복을 받은 뒤 여신의 선물·천상의 상점 없이 단순 상점(산 자리는 새로고침해도 다시 안 채움) → 바로 라스트 보스",
        "도박꾼의 방: 상자 셋 야바위 (당첨 상자를 보여 준 뒤 섞음, 한 번만) · 맞히면 패시브 5 + 300원 + 원하는 능력치 10% 2장 · 틀리면 무작위 능력치 둘 -10%",
        "암흑가 경매장: 무대 위 상품 5개(4번째부터 ???) · 그림자 손님들과 값을 겨룸 (손님은 상품의 숨은 값어치까지만 부름) · 진행자가 값 팻말을 들고 하나·둘·셋 → 망치로 낙찰 · 돈이 날아가는 효과·띠링 소리 · 상품은 패시브 또는 증강 기술(가진 패시브에 골라 붙임)",
        "시련 1000점 보상에 '비밀의 방 고르기' 상자 추가: 악마의 방·도박꾼의 방·경매장·히든 상점 중 골라 바로 들어감",
        "방마다 곡(악마·도박꾼·경매장) · 연습장 '방' 탭에서 악마의 방·도박꾼의 방·경매장·금 간 벽을 불러 시험 가능",
      ],
      en: [
        "Secret rooms: in runs where the hidden shop can appear (solo · co-op), entering a normal combat room for the first time has a 5% chance to reveal a cracked wall. Touch it to bring it down (sound · effect) and open a door to the Devil's Room, the Gambler's Room or the Underworld Auction (equal odds). A secret room's exits match the original room's",
        "Devil's Room: three deals before a statue of Satan in empty darkness (press F, pay with max HP) · Devil's Blood (+6 · +30% damage, +20 defense; 30) · Mask of Satan (death aura on the 5 nearest foes; 45) · Crimson Spots (+30 defense, +5 per damage passive; 45) · Someone's Scream (+30% attack speed, every hit splashes for 50%; 30) · Inverted Cross (+66% damage to bosses; 40) · Grim Reaper (-30 enemy defense; 35). With auras and a scythe",
        "Make any deal and floor 7 (the last boss floor) skips the Goddess's Gift and the Celestial Shop after the blessing: a plain shop (bought slots don't refill on refresh) → straight to the last boss",
        "Gambler's Room: a three-box shell game (the winning box is shown, then shuffled; once only) · win: 5 passives + 300 gold + two +10% stat picks · miss: two random stats -10%",
        "Underworld Auction: 5 lots on stage (from the 4th they are ???) · bid against shadow guests (they only go up to each lot's hidden worth) · the auctioneer raises a price sign, counts going-going-gone and drops the gavel · flying money and a chime · lots are passives or augments (graft onto a passive you choose)",
        "The 1000-point trial reward adds a 'choose a secret room' chest: enter the Devil's Room, Gambler's Room, Auction or Hidden Shop right away",
        "Music for each secret room · try the Devil's Room, Gambler's Room, Auction and cracked wall from the practice 'Rooms' tab",
      ],
      ja: [
        "秘密の部屋：ヒドゥンショップが出るラン（ソロ · 協力）で、普通の戦闘部屋に初めて入ると5%で壁のどこかにひびが入る。体が触れると壁が崩れ（音 · 効果）扉が開き、入ると悪魔の部屋 · ギャンブラーの部屋 · 闇街オークションのどれか（同じ確率）。秘密の部屋の出口は元の部屋の出口と同じ",
        "悪魔の部屋：何もない暗闇でサタンの石像の前に取引3つ（Fで取引、最大体力を捧げる）· 悪魔の血（攻撃力+6 · +30% · 防御力+20、30）· サタンの仮面（近くの敵5体に死のオーラ、45）· 赤い斑点（防御力+30、攻撃力パッシブごとに+5、45）· 誰かの絶叫（攻撃速度+30% · すべての攻撃に範囲ダメージ50%、30）· 逆さ十字（ボスへのダメージ+66%、40）· グリムリーパー（敵の防御力-30、35）。オーラ · 鎌の効果",
        "悪魔と一度でも取引すると7階（ラストボス階）は女神の祝福の後、女神の贈り物 · 天上のショップなしで普通のショップ（買った枠は入れ替えても補充されない）→ すぐラストボス",
        "ギャンブラーの部屋：箱3つのシェルゲーム（当たりの箱を見せてから混ぜる、1回のみ）· 当てればパッシブ5 + 300ゴールド + 好きな能力値10% 2枚 · 外すとランダムな能力値2つ-10%",
        "闇街オークション：舞台の品物5個（4番目から???）· 影の客と競り合う（客は品物の隠れた価値までしか入札しない）· 司会者が価格の札を掲げ、1 · 2 · 3でハンマーを打って落札 · お金が舞う効果 · チャイムの音 · 品物はパッシブか増強技（持っているパッシブを選んで付ける）",
        "試練1000点の報酬に「秘密の部屋を選ぶ」箱を追加：悪魔の部屋 · ギャンブラーの部屋 · オークション · ヒドゥンショップから選んですぐ入る",
        "秘密の部屋ごとの曲 · 練習場「部屋」タブで悪魔の部屋 · ギャンブラーの部屋 · オークション · ひびの入った壁を試せる",
      ],
    },
  },
];
