import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.261",
    date: "2026-10-30",
    items: {
      ko: [
        "빛의 사도: '+' 빛의 검을 새로 그린 픽셀 그림으로 바꿈 · 얼굴을 더 갸름하게 (V자 턱)",
        "은총의 옷자락: 최대 체력 +30 대신 → 빛의 검이 1.5배 넓은 곳까지 생기고 한 번에 5개 더 · 머리 위에 빛의 검 날개 두 개 (한 판에 하나)",
        "꿰뚫는 빛: 칼날이 한 명 더 뚫음 대신 → 빛의 검이 생긴 자리에 붉은(안쪽 흰) 빛의 검이 엇갈려 한 번 더 꿰뚫음 (피해 ×0.8)",
      ],
      en: [
        "Apostle of Light: '+' light swords now use new pixel art · slimmer face (V-shaped chin)",
        "Hem of Grace: instead of +30 max HP → light swords form 1.5× farther and 5 more each time · two light-sword wings above her head (one per run)",
        "Piercing Light: instead of piercing one more foe → a crimson (white-cored) light sword pierces again, crossed, where each light sword formed (damage ×0.8)",
      ],
      ja: [
        "光の使徒: 「+」の光の剣を新しいドット絵に · 顔をよりほっそり（V字のあご）",
        "恩寵の裾: 最大体力+30の代わりに → 光の剣が1.5倍広い範囲まで生まれ、1回につき5本多く · 頭上に光の剣の翼が2本（1回のプレイで1つ）",
        "貫く光: 刃が1体多く貫く代わりに → 光の剣が生まれた場所に紅（内側は白）の光の剣が交差してもう一度貫く（ダメージ×0.8）",
      ],
    },
  },
  {
    version: "0.48.260",
    date: "2026-10-30",
    items: {
      ko: [
        "새 한정 캐릭터 '빛의 사도' (서고의 감시자): 떨어진 신의 사도 · 검은 긴 머리(안쪽은 흰 머리)·검은 옷·맨발 · 체력 100 · 공격력 8 · 치명타 12%·예리함 12%",
        "빛의 검: 빠르고 약한 빛의 칼날을 쏨 · 세 번째 공격마다 가까운 적들 자리에 '+' 빛의 검(주황 테두리·노란 속·흰 가운데)이 두 번씩 엇갈려 생겨 벰",
        "빛의 적: 빛의 사도로 하면 층마다 전투방 셋에 떨어진 빛의 힘을 얻은 적이 나옴 (빛을 두른 강한 몬스터 · 빛을 얻은 보스 · 빛을 훔친 그림자와 1대1) · 쓰러뜨리면 빛의 조각",
        "빛의 조각: 공격력·공격 속도·치명타·예리함·빛의 검 피해가 오름 · 6개마다 몸이 커지고 더 아름답게 빛남 (그림 4단계: 귀걸이 → 머리 위 금빛 고리·금테 → 둘레에 떠다니는 빛) · 왼쪽 위 빛의 조각 창",
        "전용 아이템 10 (빛의 고리 · 신속의 깃 · 먼 빛 · 은총의 옷자락 · 겹친 검날 · 빠른 단죄 · 넓은 십자 · 꿰뚫는 빛 · 단죄 · 빛의 문신) · 업적 '빛의 단죄'",
        "상점 '서고의 감시자' 탭: 한정 캐릭터 전용 뽑기 (한 번 10장 · 11번 90장 · 3% · 60번째 확정 · 못 뽑으면 쿠폰 1장, 겹치면 30장 돌려받음) · 테스트 중에는 모두 열림",
        "한정 캐릭터는 패왕전·랭크·일일 도전에는 나오지 않고, 가지면 로그·광야의 새벽 등에서 마음껏 고를 수 있음 (캐릭터 선택창 '서고의 감시자' 탭)",
      ],
      en: [
        "New limited character 'Apostle of Light' (Archive Warden): apostle of a fallen god · long black hair with white underneath · black outfit · barefoot · HP 100 · Attack 8 · Crit 12% · Sharpness 12%",
        "Blade of Light: fires fast, light blades · every third attack, '+' light swords (orange edge, yellow body, white core) form twice, offset, on nearby foes",
        "Light foes: as the Apostle, three combat rooms per floor hold foes touched by fallen light (a glowing monster · a light-fed boss · a 1-on-1 with the shadow that stole the light) · defeat them for Shards of Light",
        "Shards of Light raise attack, attack speed, crit, sharpness and light sword damage · every 6 she grows and shines more beautifully (4 sprite stages: earrings → golden halo and trim → floating lights) · shard window at the top left",
        "10 own items (Halo of Light · Feather of Haste · Distant Light · Hem of Grace · Layered Blades · Swift Judgment · Wide Cross · Piercing Light · Condemnation · Tattoo of Light) · achievement 'Judgment of Light'",
        "Shop 'Archive Wardens' tab: limited-character gacha (10 per pull · 90 for 11 · 3% · guaranteed by pull 60 · a miss refunds 1 coupon, a duplicate 30) · everything is open during testing",
        "Limited characters can't enter Paewang, ranked or daily, but once owned they're free to use in the dungeon, Dawn of the Wilds and more (the 'Archive Wardens' tab in character select)",
      ],
      ja: [
        "新しい限定キャラ「光の使徒」（書庫の監視者）: 堕ちた神の使徒 · 黒い長髪（内側は白髪）· 黒い服 · 裸足 · 体力100 · 攻撃力8 · 会心12% · 鋭さ12%",
        "光の剣: 速く軽い光の刃を放つ · 3回目の攻撃ごとに近くの敵の位置に「+」の光の剣（オレンジの縁・黄色の中・白い中心）が2回ずつずれて生まれて斬る",
        "光の敵: 光の使徒で遊ぶと階ごとに戦闘部屋3つに堕ちた光の力を得た敵が出る（光をまとった強い魔物 · 光を得たボス · 光を盗んだ影と1対1）· 倒すと光のかけら",
        "光のかけら: 攻撃力・攻撃速度・会心・鋭さ・光の剣ダメージが上がる · 6個ごとに体が大きくなり、さらに美しく輝く（絵4段階: 耳飾り → 頭上の金の輪・金の縁 → 周りに漂う光）· 左上に光のかけら表示",
        "専用アイテム10（光の輪 · 迅速の羽 · 遠い光 · 恩寵の裾 · 重なる刃 · 速やかな断罪 · 広い十字 · 貫く光 · 断罪 · 光の紋）· 実績「光の断罪」",
        "ショップ「書庫の監視者」タブ: 限定キャラ専用ガチャ（1回10枚 · 11回90枚 · 3% · 60回目で確定 · 外れはクーポン1枚、重複は30枚返却）· テスト中はすべて開放",
        "限定キャラは覇王戦・ランク・デイリーには出られず、手に入れればローグ・荒野の夜明けなどで自由に選べる（キャラ選択の「書庫の監視者」タブ）",
      ],
    },
  },
  {
    version: "0.48.259",
    date: "2026-10-30",
    items: {
      ko: ["새 분류 '이방인' (세계의 틀을 벗어난 자들): 차원의 순례자 · 몰락한 왕 (스토리 진영·캐릭터 선택창 탭)", "새 분류 '서고의 감시자' (뽑기로 만나는 한정 캐릭터): 캐릭터 선택창 탭·스토리 진영 (곧 등장)"],
      en: ["New group 'Outsiders' (those beyond the world's frame): the Dimensional Pilgrim and the Fallen King (story factions and a character-select tab)", "New group 'Archive Wardens' (limited characters from the gacha): character-select tab and story faction (coming soon)"],
      ja: ["新しい分類「異邦人」（世界の枠を外れた者たち）: 次元の巡礼者 · 堕ちた王（ストーリーの陣営・キャラ選択タブ）", "新しい分類「書庫の監視者」（ガチャで出会える限定キャラ）: キャラ選択タブ・ストーリーの陣営（近日登場）"],
    },
  },
];
