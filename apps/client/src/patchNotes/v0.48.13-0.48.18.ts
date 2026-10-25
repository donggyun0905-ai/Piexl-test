import type { PatchNote } from "./types";

// 지난 기록 (0.48.13~0.48.18)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.18",
    date: "2026-10-22",
    items: {
      ko: [
        "보스들을 더 크고 멋지게 다시 그렸습니다: 무리 여왕은 박쥐 날개의 서큐버스(부르는 졸개는 작은 인큐버스), 세이렌은 노래하는 매혹적인 인어, 뿔 투구에 찢어진 망토의 검은 기사, 두건 속 눈이 빛나는 활잡이, 떠 있는 검을 거느린 검신, 날개 넷의 천사장, 가슴 용광로의 강철 거구, 황금 홍채의 공허의 눈, 창을 든 켄타우로스 기사, 이빨 가득한 붉은 꽃 하드플랜트, 왕관 쓴 갓이터, 룬이 새겨진 대검, 열두 갈래 빛의 태초의 빛, 일식 같은 태초의 어둠, 날개를 펼친 멸망의 용",
      ],
      en: [
        "Bosses redrawn bigger and cooler: the Brood Queen is now a bat-winged succubus (her minions appear as little incubi), the Siren a singing, alluring mermaid, plus a horned Black Knight in a torn cape, an Archer with glowing eyes under the hood, a Sword Saint with floating blades, a four-winged Archangel, an Iron Hulk with a furnace heart, a golden-irised Void Seer, a lance-wielding Centaur knight, a toothy crimson Hardplant, a crowned God Eater, rune-etched greatswords, a twelve-rayed Primeval Light, an eclipse-like Primeval Dark and a wing-spread Dragon of Ruin",
      ],
      ja: [
        "ボスを大きくかっこよく描き直しました：群れの女王はコウモリの翼のサキュバス（呼ぶ手下は小さなインキュバス）、セイレーンは歌う魅惑の人魚、角兜と裂けたマントの黒騎士、フードの奥で目が光る弓使い、浮かぶ剣を従える剣聖、四枚翼の大天使、胸に溶鉱炉の鋼の巨体、黄金の虹彩の虚空の目、槍を構えるケンタウロス騎士、牙だらけの赤い花ハードプラント、王冠のゴッドイーター、ルーンの大剣、十二筋の原初の光、日食のような原初の闇、翼を広げた滅びの竜",
      ],
    },
  },
  {
    version: "0.48.17",
    date: "2026-10-22",
    items: {
      ko: ["보스 '데스'의 모습을 바꿨습니다: 긴 은빛 머리 · 붉은 눈 · 검보라 드레스에 큰 낫을 든 매혹적인 죽음의 여인"],
      en: ["Boss 'Death' has a new look: an alluring lady of death with long silver hair, red eyes, a dark violet gown and a great scythe"],
      ja: ["ボス「デス」の姿を変更：長い銀髪・赤い瞳・黒紫のドレスに大鎌を持つ魅惑的な死の淑女"],
    },
  },
  {
    version: "0.48.16",
    date: "2026-10-22",
    items: {
      ko: ["몬스터·보스 36종을 네모 대신 도트 그림으로: 애벌레·독두꺼비·대포 게·멧돼지·날벌레·수호 골렘·성기사·슬라임·도마뱀·박쥐·딱정벌레·바위 골렘·주술사·알주머니·도깨비불 등과 강철 거구·무리 여왕·공허의 눈·검은 기사·활잡이·세이렌·켄타우로스·하드플랜트·데스·검신·천사장·갓이터·대검·태초의 빛과 어둠·멸망의 용. 맞으면 하얗게, 기절하면 푸르게, 공격 준비 때는 노랗게 번쩍입니다"],
      en: ["36 monsters and bosses are now pixel art instead of squares: grubs, poison toads, cannon crabs, boars, gnats, golem guards, paladins, slimes, lizards, bats, beetles, rock golems, shamans, egg sacs, wisps, plus the Iron Hulk, Brood Queen, Void Seer, Black Knight, Archer, Siren, Centaur, Hardplant, Death, Sword Saint, Archangel, God Eater, the greatswords, Primeval Light & Dark and the Dragon of Ruin. They flash white when hit, blue when stunned and yellow while winding up"],
      ja: ["モンスター・ボス36種を四角からドット絵に：イモムシ・毒ガエル・大砲ガニ・イノシシ・羽虫・守護ゴーレム・聖騎士・スライム・トカゲ・コウモリ・甲虫・岩ゴーレム・呪術師・卵袋・鬼火など、鋼の巨体・群れの女王・虚空の目・黒騎士・弓使い・セイレーン・ケンタウロス・ハードプラント・デス・剣聖・大天使・ゴッドイーター・大剣・原初の光と闇・滅びの竜。被弾で白、気絶で青、攻撃準備で黄色に光ります"],
    },
  },
  {
    version: "0.48.15",
    date: "2026-10-22",
    items: {
      ko: ["한정 테마 '범 풍류' 스킨을 캐릭터마다 다른 디자인으로: 백호 두건 한복(마법사) · 갓과 백호 목도리(거너) · 까치(떠돌이) · 호랑이 장군(파수꾼) · 소리꾼(음양사) · 주황 호랑이 정비공(기계공학자) · 눈꽃 백호(원소술사) · 호랑이 발톱(격투가) · 한의사(의사) · 백호(야수) · 흑호(닌자) · 어사화(시간술사) · 까치 소환사(소환술사) · 아기 호랑이(풋내기)"],
      en: ["Each character now gets its own 'Tiger Revelry' design: white-tiger hood and hanbok (Mage) · gat and tiger-fur stole (Gunner) · magpie (Drifter) · tiger general (Warden) · folk singer (Talisman Master) · orange-tiger mechanic (Engineer) · snow tiger (Elementalist) · tiger claws (Brawler) · herbal doctor (Doctor) · white tigress (Beastkin) · black tiger (Ninja) · royal-exam flower hat (Chronomancer) · magpie summoner (Summoner) · tiger cub (Novice)"],
      ja: ["限定テーマ「虎の風流」スキンをキャラごとに別デザインに：白虎頭巾と韓服（魔法使い）・カッと虎の毛皮（ガンナー）・カササギ（流れ者）・虎の将軍（番人）・唄い手（陰陽師）・オレンジ虎の整備士（エンジニア）・雪の白虎（元素術師）・虎の爪（格闘家）・漢方医（医者）・白虎（獣人）・黒虎（忍者）・御賜花の冠（時間術師）・カササギ召喚（召喚術師）・子虎（見習い）"],
    },
  },
  {
    version: "0.48.14",
    date: "2026-10-22",
    items: {
      ko: [
        "뽑기 한정 테마 '범 풍류' (시험): 뽑기에서 2%로 나오고, 나오면 모든 캐릭터에게 백호·갓·한복 스킨이 생깁니다. 입으면 금빛 타격·발톱 자국·금빛 피해 숫자, 처치하면 먹·금가루로 흩어짐(보스는 K.O 도장), 금빛 발자국, 가만히 있으면 거대한 백호 기운과 갓 쓴 까치, 무기·패시브를 얻으면 '범의 기운!', 호랑이 울음과 전용 음악",
        "뽑기 상품이 바뀌었습니다: 한정 테마 2% · 상점 스킨 43% · 쿠폰 1~5장 55%. 이미 가진 한정 테마가 나오면 쿠폰 30장",
      ],
      en: [
        "Limited gacha theme 'Tiger Revelry' (trial): 2% in the gacha, and it unlocks a white-tiger, gat and hanbok skin for every character. Wearing it adds golden hit sparks and claw marks, golden damage numbers, foes dissolving into ink and gold dust (bosses get a K.O stamp), golden paw prints, a giant white-tiger aura with a gat-wearing magpie when you stand still, 'Tiger's Might!' on new weapons and passives, tiger roars and its own music",
        "Gacha prizes changed: limited theme 2% · shop skin 43% · 1–5 coupons 55%. A duplicate limited theme gives 30 coupons",
      ],
      ja: [
        "ガチャ限定テーマ「虎の風流」（試験）：ガチャで2%、出ると全キャラに白虎・カッ・韓服スキンが付きます。着ると金色の打撃・爪痕・金色のダメージ数字、撃破で墨と金粉に散る（ボスはK.O印）、金色の足跡、じっとしていると巨大な白虎の気とカッをかぶったカササギ、武器・パッシブ入手で「虎の気！」、虎の咆哮と専用音楽",
        "ガチャの景品を変更：限定テーマ2%・ショップスキン43%・クーポン1〜5枚55%。所持済み限定テーマはクーポン30枚",
      ],
    },
  },
  {
    version: "0.48.13",
    date: "2026-10-22",
    items: {
      ko: [
        "캐릭터 12명과 모든 스킨을 다시 그렸습니다: 마법사·떠돌이와 같은 체형·머리 크기로 맞춤. 여자 캐릭터: 떠돌이·마법사·음양사·원소술사·격투가·야수·닌자·소환술사",
        "상점에 새 스킨 테마 '성별 바꾸기'를 캐릭터마다 추가 (뽑기에도 나옴)",
        "메인에서 '혼자 하기'를 누르면 메인 목록이 선택 창을 가리던 문제를 고쳤습니다",
      ],
      en: [
        "Redrew 12 characters and every skin to match the Mage and Drifter's body shape and head size. Female characters: Drifter, Mage, Talisman Master, Elementalist, Brawler, Beastkin, Ninja, Summoner",
        "New 'Gender Swap' skin for every character in the shop (also in the gacha)",
        "Fixed the main menu covering the play-mode window after tapping 'Play Solo'",
      ],
      ja: [
        "キャラ12人とすべてのスキンを描き直し、魔法使い・流れ者と同じ体型・頭の大きさに。女性キャラ：流れ者・魔法使い・陰陽師・元素術師・格闘家・獣人・忍者・召喚術師",
        "ショップに新スキン「性別チェンジ」をキャラごとに追加（ガチャにも出ます）",
        "メインで「ひとりで遊ぶ」を押すとメニューが選択ウィンドウを隠していた問題を修正",
      ],
    },
  },
];
