import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.94",
    date: "2026-10-25",
    items: {
      ko: [
        "시즌 2 시작: 비르디아 진영에 새 캐릭터 둘",
        "새 캐릭터 '이드라' (세계수의 아이): 무기는 가이아 하나, 대시 키를 누르면 대궁 → 단검 → 방패 → 채찍 차례로 모습이 바뀌며 둘레에 변환 일격 · 공용 아이템 없이 이드라 전용 아이템 20개만 나옴",
        "새 캐릭터 '변희' (만물의 소녀): 무기가 곧 동물, 든 동물로 변해 싸움 (늑대·곰·독수리·뱀·멧돼지·전갈·박쥐·코끼리·거미·불사조) · 동물마다 전용 아이템 셋 (그 동물일 때만 나옴)",
      ],
      en: [
        "Season 2 begins: two new characters join the Virdia faction",
        "New character 'Idra' (Child of the World Tree): her only weapon is Gaia; the dash key shifts it longbow → dagger → buckler → whip with a burst around her · no common items, only Idra's 20 own items",
        "New character 'Byeonhui' (The All-Shaped Girl): her weapons are animals and she becomes the one she holds (wolf, bear, eagle, serpent, boar, scorpion, bat, elephant, spider, phoenix) · three own items per animal (only while that animal)",
      ],
      ja: [
        "シーズン2開始：ヴィルディア陣営に新キャラ二人",
        "新キャラ「イドラ」（世界樹の子）：武器はガイアひとつ、ダッシュキーで大弓 → 短剣 → 盾 → 鞭の順に姿が変わり周囲へ変換の一撃 · 共通アイテムなしでイドラ専用アイテム20個だけが出る",
        "新キャラ「ビョンヒ」（万物の少女）：武器は動物そのもの、持った動物に変身して戦う（狼・熊・鷲・蛇・猪・蠍・蝙蝠・象・蜘蛛・不死鳥）· 動物ごとに専用アイテム3つ（その動物の時だけ出る）",
      ],
    },
  },
  {
    version: "0.48.93",
    date: "2026-10-25",
    items: {
      ko: [
        "새 히든 캐릭터 '서기관' (아카식 레코드): 깃펜으로 잉크 탄을 쏘아 적에게 기록을 새기고, 5번째 공격마다 무기의 글자(劍·爆·封·雷·氷·炎·再·星·滅)가 써지며 발동 · 전용 무기 10개 · 전용 아이템 10개 · 무작위 캐릭터(5%)와 연습장에서",
        "오니 방망이를 무기마다 다른 그림으로: 명뢰봉(번개 금·가시) · 빙각금봉(얼음 결정) · 홍련신주(끝의 업화) · 금봉(금화 징) · 야마타의 그림자(세 갈래 뱀 머리) · 창세의 기둥(대리석 기둥) · 풍신소환(바람 띠) · 류신금봉(물결 마루) · 흑뢰봉(보랏빛 번개) · 청전(얼음 번개)",
        "스토리: 아카식 레코드 1·2장을 장면과 대사를 더해 다시 씀 · 책을 세로로 길게(한 쪽 9줄), 쪽 넘김 움직임·진행 막대·← → 키 · 장 목록에 줄거리 · 진영 카드 꾸밈 · 아카식 레코드 진영에 서기관",
      ],
      en: [
        "New hidden character 'Scribe' (Akashic Records): fires ink shots that leave records on foes; every 5th attack writes the weapon's glyph (劍·爆·封·雷·氷·炎·再·星·滅) and unleashes it · 10 exclusive weapons · 10 exclusive items · available via Random Character (5%) and Practice",
        "Each Oni club now has its own art: Thunder Cudgel (lightning cracks, spikes) · Frostfang (ice crystals) · Crimson Lotus Pillar (hellfire tip) · Golden Club (coin studs) · Shadow of Eight Heads (three snake heads) · Pillar of Genesis (marble pillar) · Wind God's Call (wind ribbons) · Dragon Tide (wave crest) · Black Thunder (violet lightning) · Azure Frost Lightning (ice lightning)",
        "Story: Akashic Records chapters 1 and 2 rewritten with more scenes and dialogue · a taller book (9 lines per page) with page-turn motion, a progress bar and ← → keys · chapter summaries · styled faction cards · the Scribe joins the Akashic Records faction",
      ],
      ja: [
        "新しい隠しキャラ「書記官」（アカシックレコード）：羽根ペンで墨の弾を撃ち敵に記録を刻み、5回目の攻撃ごとに武器の文字（劍·爆·封·雷·氷·炎·再·星·滅）が書かれて発動 · 専用武器10 · 専用アイテム10 · ランダムキャラ（5%）と練習場で",
        "鬼の金棒を武器ごとに違う絵に：鳴雷棒（雷の割れ目・トゲ）· 氷角金棒（氷の結晶）· 紅蓮神柱（先端の業火）· 金棒（金貨の鋲）· 八岐の影（三つ又の蛇の頭）· 創世の柱（大理石の柱）· 風神召喚（風の帯）· 龍神金棒（波の頂）· 黒雷棒（紫の雷）· 青電（氷の雷）",
        "ストーリー：アカシックレコード第1・2章を場面と台詞を足して書き直し · 本を縦に長く（1ページ9行）、ページめくりの動き・進行バー・← →キー · 章一覧にあらすじ · 陣営カードの装飾 · アカシックレコード陣営に書記官",
      ],
    },
  },
  {
    version: "0.48.92",
    date: "2026-10-25",
    items: {
      ko: [
        "버려진 자들: 탭하면 내 자리(화면)는 그대로 들어온 아이가 서고, 나간 아이는 그 아이가 있던 자리로 · 총 아이는 멀리서도 자동 공격",
        "오니: 방망이를 약 3배 크기로 캐릭터 그림(모든 스킨 포함)에 같이 그림 · 신인족이 되면 긴 뿔의 날렵한 사람 모습",
        "오니: 기본 체력 150 · 사거리 32 · 명계의 흑뢰봉은 최대 체력 400 이상 · 극한의 청전은 재생력 60 이상 · 아이템으로 체력·재생력·추가 공격 범위가 오르면 머리 위에 'UP!' · 금봉은 보물방·황금방에 들어가면 체력 가득 + 돈 50 (효과가 보이게)",
        "히든 캐릭터 카드 꾸밈: 오리는 해안가, 별지기는 별이 가득한 밤하늘 · 오니 설명에 숨은 무기 힌트",
        "스토리에 '캐릭터' 탭: 모든 캐릭터의 자세한 설명 · 게임 중 능력치 창(C) 아래 '캐릭터 설명 보기'",
        "상점 휴지통으로 무기를 버리면 처음 무기가 아니라 빈손 · 새 사용 아이템 '돈주머니' (돈 +50)",
        "거인: 연타 무기 사거리 36 · 패링하면 '챙!' 소리 · 방벽 팔 강타의 보호막 없앰 · 드릴을 진짜 드릴처럼(나선 홈·갈리는 불꽃·검격 고리) · 드릴 강타 더 셈",
        "야수: 덮치기 호랑이를 새 그림으로 (근육·줄무늬·빛나는 눈, 걷기 · 덮치기 장면, 발밑 불꽃 기운)",
      ],
      en: [
        "Abandoned: tagging keeps your spot (and the camera) — the incoming kid takes your place and the outgoing kid goes where they stood · the gun kid auto-attacks from far away",
        "Oni: the club is now about 3× bigger, drawn into the character art itself (every skin included) · Shinin form turns into a sleek human shape with long horns",
        "Oni: 150 base HP · 32 range · Netherworld Black Thunder needs 400+ max HP · Azure Frost Lightning needs 60+ regen · 'UP!' appears over your head when items raise HP, regen or extra-attack area · Golden Club: entering treasure or golden rooms gives a full heal + 50 gold (now with visible effects)",
        "Hidden character cards: the Duck gets a beach, the Stargazer a starry night sky · hints for the Oni's hidden weapons in its description",
        "New 'Characters' tab in Story with detailed guides for every character · 'Character guide' under the stats panel (C) in game",
        "Throwing a weapon in the shop trash now leaves you empty-handed instead of giving the starting weapon · new usable item 'Money Pouch' (+50 gold)",
        "Titan: jab weapons reach 36 · parrying plays a 'clang!' · removed the shield from the Bulwark Arm smash · the drill now looks like a real drill (spiral flutes, grinding sparks, slash rings) · stronger drill smash",
        "Beast: new art for the pounce tiger (muscles, stripes, glowing eyes, walking and pouncing frames, a fiery aura underfoot)",
      ],
      ja: [
        "捨てられた者たち：タッチすると自分の場所（画面）はそのまま入った子が立ち、出た子はその子がいた場所へ · 銃の子は遠くからでも自動攻撃",
        "鬼：金棒を約3倍の大きさでキャラの絵（全スキン含む）に一緒に描いた · 神人族になると長い角のしなやかな人の姿",
        "鬼：基本体力150 · 射程32 · 冥界の黒雷棒は最大体力400以上 · 極限の青電は再生力60以上 · アイテムで体力・再生力・追加攻撃範囲が上がると頭上に「UP!」· 金棒は宝部屋・黄金部屋に入ると体力全快＋50G（効果が見えるように）",
        "隠しキャラのカード装飾：アヒルは海辺、星詠みは星いっぱいの夜空 · 鬼の説明に隠し武器のヒント",
        "ストーリーに「キャラクター」タブ：全キャラの詳しい説明 · ゲーム中の能力値窓（C）の下に「キャラクター説明を見る」",
        "ショップのゴミ箱で武器を捨てると最初の武器ではなく素手に · 新しい使用アイテム「銭袋」（お金+50）",
        "巨人：連打武器の射程36 · パリィで「キン！」の音 · 防壁の腕の強打のシールドをなくした · ドリルを本物のドリルらしく（らせん溝・削れる火花・剣撃の輪）· ドリル強打を強化",
        "獣人：飛びかかりの虎を新しい絵に（筋肉・縞・光る目、歩き・飛びかかりの場面、足元の炎の気）",
      ],
    },
  },
];
