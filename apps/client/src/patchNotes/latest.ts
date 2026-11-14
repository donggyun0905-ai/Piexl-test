import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.113",
    date: "2026-11-14",
    items: {
      ko: ["세계 지도(시험 중): 가게 주인에게 말 걸면 게임 상점이 열림 (무기점 뽑기 · 방어구점 스킨 · 물약점 이벤트 효과 · 잡화점 로비 꾸밈) · 대장장이에게 말 걸면 레이드 장신구 장비창·승급·강화·재설정", "세계 지도에서 B로 장비창, C로 걸어 다닐 캐릭터 고르기 (파수꾼 말고도 연 캐릭터 누구나)", "투력: 낀 레이드 장신구로 정해지는 숫자, 지도 왼쪽 위에 보임 — 나중에 지역마다 권장 투력이 생김"],
      en: ["World Map (testing): talk to shopkeepers to open the game shop (weapon shop: gacha · armor shop: skins · potion shop: event effects · general store: lobby decor) · talk to the smith for raid accessory gear, promote, enhance and reroll", "On the World Map, press B for your gear and C to choose which character walks around (any unlocked character, not just the Warden)", "Power: a number set by your equipped raid accessories, shown at the top left of the map — regions will get recommended Power later"],
      ja: ["世界地図（テスト中）：店の主人に話しかけるとゲームの商店が開く（武器屋：ガチャ・防具屋：スキン・薬屋：イベント効果・雑貨屋：ロビー飾り）・鍛冶屋に話しかけるとレイドアクセサリーの装備・昇級・強化・再設定", "世界地図でBで装備画面、Cで歩き回るキャラクターを選べる（ワーデン以外も、解放したキャラなら誰でも）", "戦力：装備したレイドアクセサリーで決まる数値、地図の左上に表示 — のちに地域ごとの推奨戦力が付く"],
    },
  },
  {
    version: "0.52.112",
    date: "2026-11-14",
    items: {
      ko: ["세계 지도(시험 중): 아스칼론이 16배 넓어짐 (256×160칸) — 성벽 도시(광장·분수·안쪽 성과 성채·훈련장·주거지) · 상점가(무기점·방어구점·물약점·잡화점) · 장인 거리(대장간·여관) · 성 남쪽 강과 강가 길 · 서쪽 항구 부두 · 강 건너 농촌과 밭 · 남쪽 사막 끝 · 북쪽 바위산 던전과 서쪽 숲 던전 · 동쪽 테라코어 국경", "순간 이동석 다섯 곳(광장·농촌·던전 앞·항구·동쪽 갈림길): 한 번 만진 돌끼리 바로 이동", "가게·대장간·여관 안으로 들어가 주인과 이야기할 수 있음 (사고팔기는 아직 없음)"],
      en: ["World Map (testing): Ascalon is now 16 times larger (256×160 tiles) — walled city (square, fountain, inner castle and keep, training ground, homes) · market street (weapons, armor, potions, general store) · craft street (smithy, inn) · river and bank path south of the castle · western harbor pier · farms across the river · the edge of the southern desert · a mountain dungeon to the north and a forest dungeon to the west · the Terracore border to the east", "Five warp stones (square, farm, dungeon, harbor, east crossroads): travel instantly between stones you've touched", "Step inside the shops, smithy and inn to chat with their keepers (no buying or selling yet)"],
      ja: ["世界地図（テスト中）：アスカロンが16倍の広さに（256×160マス） — 城壁都市（広場・噴水・内城と城館・訓練場・住宅地） · 商店街（武器屋・防具屋・薬屋・雑貨屋） · 職人通り（鍛冶屋・宿屋） · 城の南の川と土手道 · 西の港の桟橋 · 川向こうの農村と畑 · 南の砂漠のはずれ · 北の岩山のダンジョンと西の森のダンジョン · 東のテラコア国境", "転移石5か所（広場・農村・ダンジョン前・港・東の分かれ道）：一度触れた石どうしならすぐ移動", "店・鍛冶屋・宿屋の中に入って主人と話せるように（売り買いはまだなし）"],
    },
  },
  {
    version: "0.52.111",
    date: "2026-11-14",
    items: {
      ko: ["세계 지도(시험 중): 아스칼론 풀밭과 나무(둥근 나무 둘·뾰족 나무 둘)를 새 그림으로 — 캐릭터가 잘 보이게 풀밭 색은 차분하게"],
      en: ["World Map (testing): new artwork for Ascalon's grass and trees (two round, two pine) — the grass is toned down so characters stand out"],
      ja: ["世界地図（テスト中）：アスカロンの草原と木（丸い木2・とがった木2）を新しい絵に — キャラクターが見やすいよう草原の色は落ち着いた色に"],
    },
  },
  {
    version: "0.52.110",
    date: "2026-11-14",
    items: {
      ko: ["세계 지도(시험 중): 건물 안으로 들어갈 수 있음 — 아스칼론 성 안에 큰 성채가 생기고 장군은 성채 안 왕좌 앞으로 · 집 넷도 문으로 들어가면 민가 안(침대·벽난로·책장) · 문 앞에서 F, 안에서는 아래 문으로 나감"],
      en: ["World Map (testing): you can now go inside buildings — a great keep stands in Ascalon Castle with the General inside before the throne · the four houses open into a home interior (bed, fireplace, bookshelf) · press F at a door, leave through the door at the bottom"],
      ja: ["世界地図（テスト中）：建物の中に入れるように — アスカロン城に大きな城館ができ、将軍は城館の玉座の前に · 4軒の家も扉から民家の中へ（ベッド・暖炉・本棚） · 扉の前でF、中では下の扉から出る"],
    },
  },
  {
    version: "0.52.109",
    date: "2026-11-14",
    items: {
      ko: ["스토리 9장 컷 10 다시 그림: 이드라의 등을 미는 괴력난신이 제 모습으로 나오게"],
      en: ["Redrew Story Chapter 9 cut 10: the Demigod pushing Idra forward now appears correctly"],
      ja: ["ストーリー第9章カット10を描き直し：イドラの背中を押す怪力乱神が正しい姿で登場するように"],
    },
  },
  {
    version: "0.52.108",
    date: "2026-11-14",
    items: {
      ko: ["스토리 9장 「교류」 컷 1~12 일러스트 추가 (탈라시아 회의장 · 은빛 탄환 · 연합국 진지 · 영물들의 도착 · 동굴의 백랑 · 교류의 장)"],
      en: ["Added illustrations for Story Chapter 9 \"Exchange\" cuts 1–12 (the Thalassia council hall, silver bullets, the alliance camp, the divine beasts arrive, the white wolf in the cave, the Forum of Exchange)"],
      ja: ["ストーリー第9章「交流」カット1〜12のイラストを追加（タラシアの会議場・銀の弾丸・連合国の陣地・霊獣たちの到着・洞窟の白狼・交流の場）"],
    },
  },
  {
    version: "0.52.107",
    date: "2026-11-14",
    items: {
      ko: ["스토리 8장 컷 5 다시 그림: 배경을 지하 통로로"],
      en: ["Redrew Story Chapter 8 cut 5: the background is now the underground tunnel"],
      ja: ["ストーリー第8章カット5を描き直し：背景を地下通路に"],
    },
  },
  {
    version: "0.52.106",
    date: "2026-11-14",
    items: {
      ko: ["스토리 8장 「심연」 컷 1~7 일러스트 추가 (성화의 대성당 · 지하 통로의 이클립스 · 학살자의 난입 · 광장 아래 열리는 심연)"],
      en: ["Added illustrations for Story Chapter 8 \"The Abyss\" cuts 1–7 (the Cathedral of the Sacred Flame, Eclipse in the underground tunnel, the Slayer's arrival, the abyss opening beneath the plaza)"],
      ja: ["ストーリー第8章「深淵」カット1〜7のイラストを追加（聖火の大聖堂・地下通路のエクリプス・虐殺者の乱入・広場の下に開く深淵）"],
    },
  },
  {
    version: "0.52.105",
    date: "2026-11-14",
    items: {
      ko: ["스토리 7장 컷 6~8 다시 그림: 천의 사도를 악의 사도와 같은 모습(은발·꽃 두건·십자가 지팡이)에 흰·금 사제복으로"],
      en: ["Redrew Story Chapter 7 cuts 6–8: the Apostle of Heaven now matches the Apostle of Malice (silver hair, flowered hood, cross staff) in white and gold robes"],
      ja: ["ストーリー第7章カット6〜8を描き直し：天の使徒を悪の使徒と同じ姿（銀髪・花のフード・十字架の杖）に白と金の法衣で"],
    },
  },
  {
    version: "0.52.104",
    date: "2026-11-14",
    items: {
      ko: [
        "스토리 7장 「시작」 컷 1~8 일러스트 추가 (지하 감옥의 악마 · 새벽의 성흔 · 황금 결계와 천의 사도)",
      ],
      en: [
        "Added illustrations for Story Chapter 7 \"Beginning\" cuts 1–8 (the demon in the underground prison, the Dawn Stigmata, the golden barrier and the Apostle of Heaven)",
      ],
      ja: [
        "ストーリー第7章「始まり」カット1〜8のイラストを追加（地下牢の悪魔・暁の聖痕・黄金の結界と天の使徒）",
      ],
    },
  },
  {
    version: "0.52.103",
    date: "2026-11-14",
    items: {
      ko: [
        "스토리 6장 「황혼의 종언」 컷 1~12 일러스트 추가 (사막의 결전 · 태초의 빛과 어둠 · 파멸의 용 · 대성의 마지막 버팀)",
      ],
      en: [
        "Added illustrations for Story Chapter 6 \"End of Twilight\" cuts 1–12 (the desert showdown, the Primeval Light and Darkness, the Dragon of Ruin, the Great Sage's last stand)",
      ],
      ja: [
        "ストーリー第6章「黄昏の終焉」カット1〜12のイラストを追加（砂漠の決戦・始原の光と闇・破滅の竜・大聖の最後の踏ん張り）",
      ],
    },
  },
  {
    version: "0.52.102",
    date: "2026-11-14",
    items: {
      ko: [
        "패왕전 밸런스 조정 (5대5·쟁탈전 AI 대결 1,500여 판의 딜량·받은 피해·승률 기준, 공격력과 받는 피해를 함께 조정)",
        "약하게: 오닉스·마젠타·유리엘 크게, 라파엘·매드퀸·악의 사도·아리아·베르·인형술사·실버불렛·블뢰 등 31명",
        "강하게: 래빗·아수라·백인장·라이더·풋내기·펑크·묵인·혼령·시저스·격투가 크게, 그 밖 28명",
        "패왕전에서 아슈바르 진영 캐릭터가 있을 때 바닥 아이템이 떨어지는 순간 게임이 멈출 수 있던 문제 고침",
      ],
      en: [
        "Champion Clash balance pass (based on damage dealt, damage taken and win rate across ~1,500 AI 5v5 and Contest matches; attack and damage taken adjusted together)",
        "Weaker: Onyx, Magenta and Yuriel significantly; Rafael, Mad Queen, Apostle of Malice, Aria, Vert, Puppeteer, Silver Bullet, Bleu and others (31 total)",
        "Stronger: Rabbit, Asura, Baekinjang, Rider, Novice, Punk, Mukin, Honryeong, Scissors and Brawler significantly, plus 28 others",
        "Fixed a Champion Clash freeze that could happen when an item dropped while an Ashvar character was in the match",
      ],
      ja: [
        "覇王戦バランス調整（5対5・争奪戦のAI対戦約1,500試合の与ダメージ・被ダメージ・勝率をもとに、攻撃力と被ダメージを合わせて調整）",
        "弱体化：オニキス・マゼンタ・ユリエルを大きく、ラファエル・マッドクイーン・悪の使徒・アリア・ヴェール・人形使い・シルバーバレット・ブルーなど計31人",
        "強化：ラビット・阿修羅・百人長・ライダー・見習い・パンク・黙忍・魂霊・シザーズ・格闘家を大きく、ほか28人",
        "覇王戦でアシュヴァル陣営のキャラがいるとき、床にアイテムが落ちる瞬間にゲームが止まることがあった問題を修正",
      ],
    },
  },
];
