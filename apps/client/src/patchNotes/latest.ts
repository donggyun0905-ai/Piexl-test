import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
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
