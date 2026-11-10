import type { PatchNote } from "./types";

export const NOTES: PatchNote[] = [
  {
    version: "0.48.230",
    date: "2026-10-29",
    items: {
      ko: [
        "패왕전 시간 제한 (판마다): 1대1 3분 · 3대3 5분 · 5대5 10분 · 토너먼트 7분 · 대난투 10분 · 데스매치 30분 · 시간이 다 되면 남은 사람·체력 비율이 많은 편이 이김 · 화면 위에 남은 시간",
        "5대5 · 대난투 자기장: 1분마다 줄어들고 다음 원이 점선으로 미리 보임 · 원 밖은 아프고 단계가 오를수록 더 아픔",
        "불도롱뇽 패턴 다듬기: 벽에 막혀 멈춰 서지 않고 그 자리에서 잠수 · 돌진하다 벽에 부딪히면 불꽃 고리 + 비틀거림 · 새 패턴 용암 분출",
        "타워 디펜스: 타워별 실시간 딜량·체력 창(끌어 옮기기) · 별 7개 맵 '심연의 균열' (역대 최고 난이도, 막아 내면 전용 훈장)",
        "광야의 새벽 새 이벤트 '원 안에서 버티기' · 테스트용 히든 캐릭터는 버튼 하나 → 목록 창",
      ],
      en: [
        "Paewang time limits (per round): 1v1 3 min · 3v3 5 min · 5v5 10 min · Tournament 7 min · Brawl 10 min · Deathmatch 30 min · when time runs out, the side with more fighters and more HP left wins · time shown at the top",
        "Shrinking zone in 5v5 and Brawl: it shrinks every minute and the next circle is shown as a dotted line · outside the circle hurts, more each stage",
        "Fire Salamander reworked: no longer stands still against walls, it dives on the spot · hitting a wall mid-charge bursts a fire ring and staggers it · new Lava Eruption pattern",
        "Tower Defense: a draggable window with each tower's live damage and HP · new 7-star map 'Abyssal Rift' (the hardest ever, with its own medal)",
        "New Dawn of the Wilds event 'Stay in the Circle' · test hidden characters now use one button that opens a list",
      ],
      ja: [
        "覇王戦の時間制限（1戦ごと）: 1対1 3分 · 3対3 5分 · 5対5 10分 · トーナメント7分 · 大乱闘10分 · デスマッチ30分 · 時間切れなら残り人数・体力の多い側が勝ち · 画面上に残り時間",
        "5対5 · 大乱闘に縮小ゾーン: 1分ごとに縮み、次の円が点線で見える · 円の外はダメージ、段階が上がるほど強く",
        "炎のサンショウウオのパターン改善: 壁に止まらずその場で潜る · 突進中に壁にぶつかると炎の輪 + よろめき · 新パターン溶岩噴出",
        "タワーディフェンス: タワーごとのリアルタイム与ダメージ・体力ウィンドウ（ドラッグ移動）· 星7マップ「深淵の裂け目」（史上最高難度、専用勲章）",
        "荒野の夜明けに新イベント「円の中で耐えろ」 · テスト用の隠しキャラはボタン1つ → 一覧ウィンドウ",
      ],
    },
  },
  {
    version: "0.48.229",
    date: "2026-10-29",
    items: {
      ko: ["차원의 순례자 배낭을 키보다 훨씬 큰 거대한 배낭으로 (입구 조임 끈·귀 같은 덮개·푹신한 주름·옆주머니) · 뒤돌면 배낭만 보임 (큰 앞주머니·별/달 패치·수정 열쇠고리) · 등장 포탈도 더 크게"],
      en: ["The Dimensional Pilgrim's backpack is now huge, far taller than she is (drawstring top, ear-like flaps, squishy folds, side pockets) · from behind you only see the backpack (big front pocket, star and moon patches, crystal keychain) · her entrance portal is bigger too"],
      ja: ["次元の巡礼者のリュックを背よりずっと大きな巨大リュックに (口の絞りひも・耳のようなフタ・ふかふかのしわ・横ポケット) · 後ろを向くとリュックだけが見える (大きな前ポケット・星と月のワッペン・水晶のキーホルダー) · 登場ポータルもさらに大きく"],
    },
  },
  {
    version: "0.48.228",
    date: "2026-10-29",
    items: {
      ko: ["차원의 순례자 그림 새로: 허리까지 물결치는 분홍빛 긴 머리 · 파랑 눈 안 노란 십자 · 헐렁한 회녹색 후드 재킷·흰 티·남색 반바지·끈 부츠 · 몸보다 큰 둥글고 푹신한 배낭(귀 같은 덮개·옆주머니·수정 열쇠고리)을 두 손으로 꼭 쥠"],
      en: ["New look for the Dimensional Pilgrim: long wavy pink hair down to her waist, blue eyes with a yellow cross, a baggy grey-green hoodie jacket, white tee, navy shorts and laced boots, gripping the straps of a round, squishy backpack bigger than she is (ear-like flaps, side pockets, crystal keychain)"],
      ja: ["次元の巡礼者の新しい姿: 腰まで波打つピンクの長い髪 · 青い瞳に黄色い十字 · だぼっとした灰緑のパーカージャケット・白T・紺のショートパンツ・ひもブーツ · 体より大きな丸くてふかふかのリュック (耳のようなフタ・横ポケット・水晶のキーホルダー) の肩ひもを両手でぎゅっ"],
    },
  },
  {
    version: "0.48.227",
    date: "2026-10-29",
    items: {
      ko: [
        "히든 캐릭터 '차원의 순례자' (무작위 캐릭터 5% · 연습장): 히든 상점의 그 아이. 수많은 차원을 다니며 무기·능력·물건을 모으는 수집가 · 차원 수집품 무기 20 (지팡이·칼·깃발·랜턴·냄비·지도·나침반·부메랑·새총·우산·은방울·종이학·수정·태엽 폭탄·떨어진 별·씨앗·거울 조각·모래시계·만능 열쇠·차원의 문)",
        "수집 도감: 한 번이라도 든 순례자 무기는 도감에 남아 한 칸마다 공격력 +2% (발밑에 칸 수) · 다섯 번째 공격마다 배낭에서 도감의 다른 수집품을 꺼내 씀 (머리 위로 튀어나옴) · 전용 아이템 20 (수집 일지·두 겹 배낭·차원 도장·행운 동전·세계수 잎 등)",
      ],
      en: [
        "Hidden character 'Dimensional Pilgrim' (5% random pick · practice): the girl from the hidden shop, a collector who wanders countless dimensions gathering weapons, powers and trinkets · 20 curio weapons (staff, blade, flag, lantern, pot, map, compass, boomerang, slingshot, umbrella, silver bell, paper cranes, crystal, clockwork bomb, fallen star, seed, mirror shards, hourglass, master key, Door of Dimensions)",
        "Collector's journal: every pilgrim weapon you have held stays in it for +2% damage each (count under your feet) · every 5th attack she pulls another curio from the pack and uses it (it pops out over her head) · 20 own items (Collector's Journal, Double Pack, Dimension Stamp, Lucky Coin, World Tree Leaf and more)",
      ],
      ja: [
        "ヒドゥンキャラクター「次元の巡礼者」（ランダムキャラ5% · 練習場）: ヒドゥンショップのあの子。数多の次元を巡り武器・能力・品物を集めるコレクター · 次元の収集品の武器20（杖・剣・旗・ランタン・鍋・地図・羅針盤・ブーメラン・パチンコ・傘・銀の鈴・折り鶴・水晶・ぜんまい爆弾・落ちた星・種・鏡のかけら・砂時計・万能の鍵・次元の扉）",
        "収集図鑑: 一度でも持った巡礼者の武器は図鑑に残り1マスごとに攻撃力+2%（足元にマス数）· 5回目の攻撃ごとにリュックから図鑑の別の収集品を取り出して使う（頭上に飛び出す）· 専用アイテム20（収集日誌・二重リュック・次元スタンプ・幸運のコイン・世界樹の葉など）",
      ],
    },
  },
  {
    version: "0.48.226",
    date: "2026-10-29",
    items: {
      ko: ["차원의 순례자를 더 귀엽게 다시 그림: 큰 머리·갸름한 얼굴 · 노란 별 핀 · 세일러 깃 블라우스와 주름치마 · 배낭은 덮개·버클 끈·별 패치 앞주머니·옆주머니·차원 수정 열쇠고리·랜턴·냄비, 위에 침낭과 지팡이·깃발·칼·지도", "포탈이 아이 키보다 크게 열림 (소용돌이 고리·테두리 룬·빨려 드는 별 가루) · 차원이동문·귀환의 문·테라포밍도 같은 포탈", "히든 아이템 아이콘을 모두 자세하게 다시 그림 · 머리 위 주사위는 입체로(저주받은 주사위는 뿔) · 보물 상자는 금 띠·자물쇠·보석"],
      en: ["Redrew the Dimensional Pilgrim cuter: bigger head and a slimmer face, a yellow star pin, a sailor-collar blouse and pleated skirt, and a backpack with a flap, buckled straps, a star-patch pocket, side pockets, a dimension crystal keychain, a lantern and a pot, topped by a bedroll, staff, flag, sword and map", "Portals now open taller than she is (swirling rings, edge runes, star dust being pulled in) · Dimension Gate, Gate of Return and Terraform use the same portal", "Redrew every hidden item icon in more detail · the dice over your head are now 3D (the cursed one has horns) · the treasure chest has gold bands, a lock and gems"],
      ja: ["次元の巡礼者をもっとかわいく描き直し: 大きな頭・すっきりした顔 · 黄色い星のピン · セーラーカラーのブラウスとプリーツスカート · リュックはフタ・バックル・星のワッペンの前ポケット・横ポケット・次元水晶のキーホルダー・ランタン・鍋、上に寝袋と杖・旗・剣・地図", "ポータルが少女の背より大きく開くように (渦の輪・縁のルーン・吸い込まれる星くず) · 次元移動門・帰還の門・テラフォーミングも同じポータル", "ヒドゥンアイテムのアイコンをすべて細かく描き直し · 頭上のサイコロは立体に (呪われたサイコロは角つき) · 宝箱は金の帯・錠前・宝石つき"],
    },
  },
];
