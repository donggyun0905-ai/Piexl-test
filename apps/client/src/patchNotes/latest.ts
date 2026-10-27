import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.157",
    date: "2026-10-28",
    items: {
      ko: [
        "검은 잔영: 거대한 짐승 셋(데스웜 · 거대 전갈 · 거대 매)이 한꺼번에 나와 1대3 · 하나 쓰러질 때마다 한마디 · 체력 막대는 짐승마다 같은 길이로 떨어진 막대 셋",
        "거대 전갈이 탱커로: 체력 2000 → 3000 + 흰 보호막(최대 체력의 50%, 체력보다 먼저 깎임) · 데스웜 땅속·거대 매 하늘에 있는 시간을 조금 늘림",
      ],
      en: [
        "Black Remnant: all three colossal beasts (Death Worm · Colossal Scorpion · Colossal Hawk) now appear at once, 1 vs 3 · it speaks each time one falls · three separate health bars of equal length, one per beast",
        "The Colossal Scorpion is now the tank: health 2000 → 3000 plus a white barrier (50% of max health, drained before health) · the Death Worm stays underground and the Hawk in the sky a little longer",
      ],
      ja: [
        "黒き残影: 巨大な獣三体（デスワーム · 巨大サソリ · 巨大な鷹）が同時に現れて1対3 · 一体倒れるごとに一言 · 体力バーは獣ごとに同じ長さで離れた3本",
        "巨大サソリがタンク役に: 体力2000 → 3000 + 白いバリア（最大体力の50%、体力より先に削れる）· デスワームの地中・鷹の空にいる時間を少し延長",
      ],
    },
  },
  {
    version: "0.48.156",
    date: "2026-10-28",
    items: {
      ko: [
        "시즌 2 라스트 보스 '검은 잔영' 미리 공개 (6층 클리어 뒤 도전 · 연습장): 위에서 지켜보며 거대한 짐승 셋을 차례로 부르고, 하나 잡을 때마다 \"호오...\" \"제법이군...\" \"지켜볼 가치가 있어..\" 뒤 사라짐 · 체력 막대 한 줄을 세 칸으로",
        "데스웜: 땅속에서는 예고 없이 다가와 갑자기 표시가 뜨고 솟아오름(사방으로 바위) · 솟는 1초 · 위에서 2초(이때 때리기) · 순식간에 들어감",
        "거대 전갈: 움직이는 표시로 모래 밑을 기어다니다 꼬리 찌르기(맞으면 독) · 앞으로만 밀고 오는 3초 돌진(부딪히면 집게에 3초 붙잡혀 못 움직이고 피해) → 옆으로 피한 뒤 지쳐 있을 때 때리기",
        "거대 매: 늘 하늘에 있어 보이지 않음 · 갑자기 뜨는 내려찍기(피하면 3초 경직, 맞으면 바로 하늘로) · 차례로 뜨는 세 줄 활강 뒤 어지러워 떨어져 3초 경직",
      ],
      en: [
        "Season 2 final boss preview, the Black Remnant (challenge after clearing floor 6 · Practice): it watches from above and calls three colossal beasts in turn; after each one falls it says \"Hoh...\", \"Not bad...\", \"Worth watching..\" and then vanishes · one health bar split into three",
        "Death Worm: moves underground with no warning, then a marker suddenly appears and it bursts up (rocks in all directions) · 1s to rise · 2s up top (strike now) · dives back in an instant",
        "Colossal Scorpion: crawls under the sand with a moving marker · tail sting (poisons) · a 3s straight-line charge it cannot turn (a hit pins you in its claws for 3s) → sidestep and strike while it is worn out",
        "Colossal Hawk: always unseen in the sky · sudden dive (dodge it and it is dazed for 3s, get hit and it flies right back up) · three swoop lines in a row, then it falls dazed for 3s",
      ],
      ja: [
        "シーズン2ラストボス「黒き残影」先行公開（6階クリア後の挑戦 · 練習場）: 上から見届けつつ巨大な獣を三体順に呼び、一体倒すごとに「ほう…」「なかなかやるな…」「見届ける価値がある..」と言い残して消える · 体力バー1本を3区切りに",
        "デスワーム: 地中では予告なく近づき、突然表示が出て飛び出す（全方向に岩）· 出るのに1秒 · 地上に2秒（ここで攻撃）· 一瞬で潜る",
        "巨大サソリ: 動く表示とともに砂の下を這う · 尾の突き（当たると毒）· 向きを変えられない3秒の直進突進（ぶつかるとハサミに3秒捕まり動けずダメージ）→ 横に避けて疲れている間に攻撃",
        "巨大な鷹: いつも空にいて見えない · 突然の急降下（避けると3秒硬直、当たるとすぐ空へ）· 順に出る三本の滑空の後、目を回して落ち3秒硬直",
      ],
    },
  },
  {
    version: "0.48.155",
    date: "2026-10-28",
    items: {
      ko: [
        "시즌 2 히든 캐릭터 제우스 (무작위 캐릭터 5% · 연습장): 번개 무기 10 (번개창 · 하늘의 벼락 · 연쇄 번개 · 폭풍 구름 · 아이기스 · 신의 독수리 · 천둥소리 · 신의 벼락창 · 구전 · 거인 사냥)",
        "제우스: 맞힐 때마다 감전이 쌓여 더 아픔 · 천벌 게이지가 차면 제우스 강림 (방 안 적 모두에게 벼락 · 8초 무적 · 공격 두 배 · 방 곳곳에 벼락) · 대시한 길에 번개 · 전용 아이템 10 (과부하 · 분노한 신 · 응징 등)",
      ],
      en: [
        "New Season 2 hidden character Zeus (5% from Random Character · Practice): 10 lightning weapons (Lightning Javelin · Bolt from the Sky · Chain Lightning · Storm Cloud · Aegis · Eagle of the Sky King · Thunderclap · Divine Thunder Spear · Ball Lightning · Titan Hunt)",
        "Zeus: each hit stacks Shock so foes take more · a full Wrath gauge brings the Descent of Zeus (bolts on every foe · 8s invincible · double attack speed · bolts all over the room) · lightning along your dash · 10 own items (Overload · Wrathful God · Retribution and more)",
      ],
      ja: [
        "シーズン2ヒドゥンキャラクター ゼウス（ランダムキャラ5% · 練習場）: 雷の武器10（雷の槍 · 天の雷 · 連鎖する雷 · 嵐の雲 · アイギス · 天空王の鷲 · 雷鳴 · 神の雷槍 · 球雷 · 巨人狩り）",
        "ゼウス: 当てるたびに感電が溜まり痛くなる · 天罰ゲージが満ちるとゼウス降臨（部屋の敵全員に雷 · 8秒無敵 · 攻撃2倍 · 部屋中に雷）· ダッシュの道に雷 · 専用アイテム10（過負荷 · 怒れる神 · 報いなど）",
      ],
    },
  },
  {
    version: "0.48.154",
    date: "2026-10-28",
    items: {
      ko: [
        "시즌 2 히든 캐릭터 운명의 여행자 (무작위 캐릭터 5% · 연습장): 운명의 활 하나로 시위를 당겨 쏘는 강한 한 발 (아주 느리지만 끝까지 당기면 기술 발동 · 1.5배)",
        "머리 위 모래시계가 15초마다 뒤집히며 주사위를 굴려 운명이 바뀜: 버프 36 · 기술 36(유도·휘는 화살·거대한 마력 화살·화살비·빛줄기·번개 등) · 능력 36(배·병사·세이렌·거인의 바위·나무 목마·충견 등), 이전 운명은 사라짐 · 운명 36칸 목록은 캐릭터 설명에",
        "운명의 여행자 전용 아이템 10 (두 개의 주사위: 36칸 중 정확한 칸 · 손때 묻은 주사위 · 운명 붙잡기 · 여섯 눈의 축복 등)",
      ],
      en: [
        "New Season 2 hidden character Voyager of Fate (5% from Random Character · Practice): one Bow of Fate, drawn for a single strong shot (very slow, but a full draw triggers a skill and deals ×1.5)",
        "Every 15s the hourglass above your head flips and the dice change your fate: 36 buffs · 36 skills (homing, curving arrows, giant mana arrow, arrow rain, beams, lightning and more) · 36 abilities (ships, soldiers, sirens, a giant's boulder, a wooden horse, a loyal hound and more); the previous fate fades · the full 36-cell list is in the character guide",
        "Voyager of Fate has 10 own items (Twin Dice: the exact cell of 36 · Worn Lucky Die · Hold Fast to Fate · Blessing of Sixes and more)",
      ],
      ja: [
        "シーズン2ヒドゥンキャラクター 運命の旅人（ランダムキャラ5% · 練習場）: 運命の弓ひとつで引き絞って撃つ強い一発（とても遅いが最後まで引くと技が発動 · 1.5倍）",
        "頭上の砂時計が15秒ごとに返り、サイコロで運命が変わる: バフ36 · 技36（誘導・曲がる矢・巨大な魔力の矢・矢の雨・光の筋・雷など）· 能力36（船・兵士・セイレーン・巨人の岩・木馬・忠犬など）、前の運命は消える · 36マスの一覧はキャラクター説明に",
        "運命の旅人の専用アイテム10（二つのサイコロ：36マスの正確なマス · 使い込んだサイコロ · 運命をつかむ · 六の目の祝福など）",
      ],
    },
  },
  {
    version: "0.48.153",
    date: "2026-10-28",
    items: {
      ko: ["에테르 광부: 캐릭터 그림을 키워 몸보다 큰 거대한 곡괭이를 직접 듦 (아주 긴 짙은 남색 자루 · 끝이 날카로운 파란 ^ 날) · 걸을 때는 어깨에 메고, 공격하면 치켜들었다가 앞으로 휘두름"],
      en: ["Ether Miner: bigger sprite so the miner now holds a giant pickaxe larger than their body (very long navy handle · sharp-tipped blue ^ blade) · carried on the shoulder while walking, raised and swung forward when attacking"],
      ja: ["エーテル鉱夫: キャラ絵を大きくし、体より大きい巨大なつるはしを直接持つ（とても長い濃紺の柄 · 先の鋭い青い^の刃）· 歩く時は肩に担ぎ、攻撃では振り上げて前へ振り抜く"],
    },
  },
  {
    version: "0.48.152",
    date: "2026-10-28",
    items: {
      ko: [
        "시즌 2 히든 캐릭터 에테르 광부 (무작위 캐릭터 5% · 연습장): 곡괭이로 맞힐 때마다 에테르 원석을 캐고, 원석 100이면 광산 붕괴(방 전체 바위) · 쓰러진 보통 적은 에테르 결정이 되어 깨면 파편이 튐 · 대시는 땅굴(땅속은 무적, 나오며 터뜨림)",
        "에테르 광부 곡괭이 10 (땅 갈라짐 · 드릴 · 다이너마이트 · 광차 · 빠지면 끝나는 구덩이 · 자석 · 보석 · 던지는 곡괭이 · 에테르 기둥) · 전용 아이템 10 (카나리아 · 두더지 · 대박 원석 등)",
      ],
      en: [
        "New Season 2 hidden character Ether Miner (5% from Random Character · Practice): every pickaxe hit mines Ether Ore, and 100 ore causes a Cave-In (rocks over the whole room) · fallen normal foes become Ether Crystals that burst into shards · Dash is a tunnel (invincible underground, erupts on exit)",
        "Ether Miner has 10 pickaxes (ground cracks · Drill · Dynamite · Minecart · a Pit foes never leave · Magnet · Gem · Throwing Pick · Ether Pillar) and 10 own items (Canary · Mole · Jackpot Ore and more)",
      ],
      ja: [
        "シーズン2ヒドゥンキャラクター エーテル鉱夫（ランダムキャラ5% · 練習場）: つるはしで当てるたびにエーテル原石を掘り、原石100で落盤（部屋全体に岩）· 倒れた普通の敵はエーテル結晶になり、割ると破片が飛ぶ · ダッシュはトンネル（地中は無敵、出る時に吹き飛ばす）",
        "エーテル鉱夫のつるはし10（地割れ · ドリル · ダイナマイト · トロッコ · 落ちたら終わりの穴 · 磁石 · 宝石 · 投げつるはし · エーテルの柱）· 専用アイテム10（カナリア · モグラ · 大当たり原石など）",
      ],
    },
  },
  {
    version: "0.48.151",
    date: "2026-10-28",
    items: {
      ko: [
        "패왕전: 체력 ×10을 없애고 모두(AI 포함) 원래 체력에 보호막 500으로 시작",
        "상점 휴지통: F를 누르면 판매 창이 열려 무기·사용 아이템·패시브를 모두 팔 수 있음 (한 번 누르면 확인, 한 번 더 누르면 판매 · 무기를 팔면 빈손) · 장비 줄 아래 판매 줄은 없앰",
        "변희: 사냥 경험치 막대를 노랑으로 (풋내기와 구분) · 경험치로 능력을 얻으면 머리 위에 그 능력이 떠오름 · 각성하면 화면 테두리 안쪽에 동물마다 다른 효과(번개·불꽃·거미줄·독·땅 갈라짐 등)가 1.5초 동안 번쩍이다 꺼짐",
      ],
      en: [
        "Champion Clash: removed the 10× HP; everyone (AI included) starts with normal HP and a 500 shield",
        "Shop trash can: press F to open a sell window where you can sell your weapon, consumables and passives (tap once to confirm, again to sell; selling your weapon leaves you empty-handed) · removed the sell bar under the loadout",
        "Byeonhui: the hunting XP bar is now yellow (unlike the Novice's) · abilities gained from XP pop up above your head · awakening flashes an animal-themed border effect inside the screen edge (lightning, flames, webs, venom, cracks and more) for 1.5 seconds",
      ],
      ja: [
        "覇王戦: 体力×10をやめ、全員（AI含む）元の体力にシールド500で開始",
        "ショップのゴミ箱: Fで売却ウィンドウが開き、武器・使用アイテム・パッシブをすべて売れる（1回で確認、もう1回で売却 · 武器を売ると素手）· 装備欄下の売却欄は廃止",
        "ビョンヒ: 狩りの経験値バーを黄色に（ノービスと区別）· 経験値で能力を得ると頭上にその能力が浮かぶ · 覚醒すると画面の縁の内側に動物ごとの効果（雷・炎・蜘蛛の巣・毒・地割れなど）が1.5秒光って消える",
      ],
    },
  },
];
