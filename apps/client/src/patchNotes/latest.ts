import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
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
      ko: ["차원의 순례자를 더 귀엽게 다시 그림: 큰 머리·갸름한 얼굴 · 노란 별 핀 · 세일러 깃 블라우스와 주름치마 · 배낭은 덮개·버클 끈·별 패치 앞주머니·옆주머니·차원 수정 열쇠고리·랜턴·냄비, 위에 침낭과 지팡이·깃발·칼·지도", "포탈이 아이 키보다 크게 열림 (소용돌이 고리·테두리 룬·빨려 드는 별 가루) · 차원이동문·포탈건·테라포밍도 같은 포탈", "히든 아이템 아이콘을 모두 자세하게 다시 그림 · 머리 위 주사위는 입체로(저주받은 주사위는 뿔) · 보물 상자는 금 띠·자물쇠·보석"],
      en: ["Redrew the Dimensional Pilgrim cuter: bigger head and a slimmer face, a yellow star pin, a sailor-collar blouse and pleated skirt, and a backpack with a flap, buckled straps, a star-patch pocket, side pockets, a dimension crystal keychain, a lantern and a pot, topped by a bedroll, staff, flag, sword and map", "Portals now open taller than she is (swirling rings, edge runes, star dust being pulled in) · Dimension Gate, Portal Gun and Terraform use the same portal", "Redrew every hidden item icon in more detail · the dice over your head are now 3D (the cursed one has horns) · the treasure chest has gold bands, a lock and gems"],
      ja: ["次元の巡礼者をもっとかわいく描き直し: 大きな頭・すっきりした顔 · 黄色い星のピン · セーラーカラーのブラウスとプリーツスカート · リュックはフタ・バックル・星のワッペンの前ポケット・横ポケット・次元水晶のキーホルダー・ランタン・鍋、上に寝袋と杖・旗・剣・地図", "ポータルが少女の背より大きく開くように (渦の輪・縁のルーン・吸い込まれる星くず) · 次元移動門・ポータルガン・テラフォーミングも同じポータル", "ヒドゥンアイテムのアイコンをすべて細かく描き直し · 頭上のサイコロは立体に (呪われたサイコロは角つき) · 宝箱は金の帯・錠前・宝石つき"],
    },
  },
];
