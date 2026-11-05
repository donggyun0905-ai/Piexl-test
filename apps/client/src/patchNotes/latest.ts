import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.47",
    date: "2026-11-06",
    items: {
      ko: [
        "오르카: 머리 위에 해방 게이지가 보임 (차는 동안 물빛 · 가득이면 흰빛 깜빡 · 해방 중에는 남은 시간이 노랗게 줄어듦)",
        "오르카 해방: 범고래 돌파로 내려앉은 뒤 10초 동안 모든 공격 범위 +35% · 공격 속도 +30% · 때릴 때마다 물 상어가 날아가 꿰뚫음 · 대시가 번개 대시(번개 소리와 함께 지나간 자리의 적에게 번개 피해 + 기절) · 몸에 번개가 튀는 오라 (해방의 노래 아이템은 해방 시간 +5초로 바뀜)",
        "오르카 이펙트 다듬기: 1타는 앞으로 뻗는 물 주먹 파동으로 · 물기둥은 땅이 부풀었다 굵게 치솟아 무너지는 웅장한 기둥으로 · 무지개 뺌 · 상어는 테일과 같은 물 상어 그림 · 물기·터짐·큰 파도 새로 그림",
        "훅: 갈고리에 걸린 적에게 약화 표식이 쌓임 (머리 위 작은 갈고리, 최대 5) · 표식 하나마다 받는 피해 +5% (최대 +25%) · 더블배럴 산탄총 피해 1.5배 (공격력 100% → 150%)",
      ],
      en: [
        "Orca: the Liberation gauge now shows above his head (aqua while filling · flashes white when full · drains in yellow during Liberation)",
        "Orca Liberation: for 10s after an Orca Breach lands, +35% range on every attack · +30% attack speed · every hit launches a flying water shark that pierces · dashes become Lightning Dashes (thunder crackle, lightning damage + stun along the path) · a crackling lightning aura (Song of Liberation now extends Liberation by 5s)",
        "Orca effects reworked: the 1st hit is now a forward-surging water-fist wave · the geyser swells from the ground, erupts as a thick, towering column and collapses · rainbows removed · the shark uses the same water shark art as Tail · new bite, burst and huge-wave effects",
        "Hook: foes caught by the hook stack weaken marks (tiny hooks above their head, up to 5) · +5% damage taken per mark (up to +25%) · double-barrel shotgun damage x1.5 (100% → 150% ATK)",
      ],
      ja: [
        "オルカ：頭上に解放ゲージが表示されるように（たまる間は水色 · 満タンで白く点滅 · 解放中は残り時間が黄色く減る）",
        "オルカの解放：シャチ突破で着地した後10秒間、全攻撃の範囲+35% · 攻撃速度+30% · 攻撃のたびに水の鮫が飛んで貫く · ダッシュが雷ダッシュに（雷鳴と共に通った道の敵に雷ダメージ＋気絶）· 体に雷が走るオーラ（解放の歌は解放時間+5秒に変更）",
        "オルカのエフェクトを調整：1撃目は前へ伸びる水の拳の波動に · 水柱は地面が膨らんで太く噴き上がり崩れる壮大な柱に · 虹を削除 · 鮫はテイルと同じ水の鮫の絵 · 噛みつき・弾け・大波を新しく",
        "フック：フックに掛かった敵に弱化の印がたまる（頭上の小さなフック、最大5）· 印1つごとに被ダメージ+5%（最大+25%）· ダブルバレル散弾銃のダメージ1.5倍（攻撃力100% → 150%）",
      ],
    },
  },
  {
    version: "0.49.46",
    date: "2026-11-06",
    items: {
      ko: [
        "탈라시아 새 캐릭터 오르카: 바다의 자유를 주먹에 담은 격투가 (체력 110 · 공격력 12 · 이동 1.4, 여는 조건: 공격 속도 1.6 달성)",
        "누르고 있으면 움직이며 4연속 콤보: 물보라 잽(앞쪽 넓은 부채꼴) → 소용돌이 훅(둘레 적을 끌어당김) → 물기둥 어퍼(띄워 올림) → 상어 기공파 · 대시해도 콤보가 끊기지 않음",
        "상어 기공파는 스스로 먹잇감을 찾아 꺾어 헤엄치며 3마리까지 물어뜯고 물보라로 터짐",
        "때릴수록 해방 게이지가 차고, 가득 차면 대시가 '범고래 돌파': 거대한 범고래 물기운이 되어(무적) 적을 양옆으로 가르며 뚫고 나가 큰 파도로 내려앉음",
        "권갑 무기 6 (파도 · 이안류 · 간헐천 · 메갈로돈 · 범고래 무리 · 대소용돌이) · 전용 아이템 10 · 물보라·소용돌이·물기둥·상어·범고래·큰 파도 이펙트 · 효과음 · 그림 시트 · 패왕전 스킬",
      ],
      en: [
        "New Thalassia character Orca: a brawler who carries the freedom of the sea in his fists (HP 110 · ATK 12 · Move 1.4, unlock: reach 1.6 attack speed)",
        "Hold to unleash a 4-hit combo on the move: Spray Jab (wide frontal fan) → Whirl Hook (pulls nearby foes in) → Geyser Upper (launches foes) → Shark Wave · dashing never breaks the combo",
        "The shark-shaped ki blast hunts on its own, turning to chase prey and biting up to 3 foes before bursting into spray",
        "Hits fill the Liberation gauge; when full, your dash becomes Orca Breach: you turn into a giant orca of water (invulnerable), split through foes and land in a huge wave",
        "6 gauntlet weapons (Tide · Riptide · Geyser · Megalodon · Orca Pod · Maelstrom) · 10 exclusive items · spray, whirl, geyser, shark, orca and huge wave effects · sounds · sprite sheet · Champion Clash skills",
      ],
      ja: [
        "タラシアの新キャラ オルカ：海の自由を拳に込めた格闘家（体力110 · 攻撃力12 · 移動1.4、解放条件：攻撃速度1.6達成）",
        "押し続けると動きながら4連続コンボ：飛沫ジャブ（前方の広い扇形）→ 渦巻きフック（周りの敵を引き寄せる）→ 水柱アッパー（打ち上げ）→ 鮫の気功波 · ダッシュしてもコンボが途切れない",
        "鮫の気功波は自ら獲物を探して曲がりながら泳ぎ、3体まで噛みついて飛沫と共に弾ける",
        "攻撃するほど解放ゲージがたまり、満タンでダッシュが「シャチ突破」に：巨大なシャチの水気となって（無敵）敵を左右に裂きながら突き抜け、大波と共に着地",
        "籠手武器6（波 · 離岸流 · 間欠泉 · メガロドン · シャチの群れ · 大渦）· 専用アイテム10 · 飛沫・渦・水柱・鮫・シャチ・大波のエフェクト · 効果音 · スプライトシート · 覇王戦スキル",
      ],
    },
  },
];
