import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.53.15",
    date: "2026-11-15",
    items: {
      ko: ["메인 화면 정리: 버튼은 플레이 · 아카이브 · 상점 셋만 · 기록·업적·도감·패치 노트·기기 연동은 아카이브 창으로 · 일일 도전·함께 하기·협동·이벤트·로비는 플레이 창 안으로 (세계 지도 장소가 생기면 옮길 예정)"],
      en: ["Cleaner main screen: only Play, Archive and Shop · Records, Achievements, Codex, Patch Notes and Link devices moved into the Archive window · Daily Challenge, Play Together, Co-op, Events and Lobby moved into the Play window (they will move to places on the world map later)"],
      ja: ["メイン画面を整理：ボタンはプレイ・アーカイブ・ショップの3つだけ・記録・実績・図鑑・パッチノート・端末連携はアーカイブ画面へ・デイリーチャレンジ・みんなで遊ぶ・協力プレイ・イベント・ロビーはプレイ画面の中へ（後で世界地図の場所へ移す予定）"],
    },
  },
  {
    version: "0.53.14",
    date: "2026-11-15",
    items: {
      ko: ["범 풍류 스킨 새 그림 (파수꾼·떠돌이·마법사·음양사·기계공학자·원소술사·격투가·의사): 한복·백호 옷의 새 걷기·공격·맞음·쓰러짐·대시 그림 · 입으면 캐릭터 선택 카드와 정보 창에 스킨 일러스트"],
      en: ["New Tiger Revelry skin art (Warden, Drifter, Mage, Talisman Master, Engineer, Elementalist, Brawler, Doctor): new hanbok and white-tiger outfits with walk, attack, hit, down and dash frames · wearing one shows its skin illustration on the character select card and info window"],
      ja: ["虎の風流スキンの新しい絵（番人・流れ者・魔法使い・陰陽師・エンジニア・元素術師・格闘家・医者）：韓服と白虎の衣装で歩き・攻撃・被弾・ダウン・ダッシュの新しい絵・着るとキャラクター選択カードと情報ウィンドウにスキンのイラスト"],
    },
  },
  {
    version: "0.53.13",
    date: "2026-11-15",
    items: {
      ko: ["던전 방 물건 새 그림: 출구 아치(깨면 푸른 빛)·입구 발판·내려가는 계단 · 쉼터 샘·보물 상자·상인 깔개·여신상 · 단련 기구 셋 · 대장간 화덕·연장 걸이·무기 걸이 · 돌 층의 기둥·안쪽 벽·구덩이 · 광야의 새벽 상자·경험치 보석·고기·자석·폭탄·금화·황금 상자"],
      en: ["New dungeon room art: exit arches (glowing blue once cleared), entrance mat and stairs down · rest spring, treasure chest, merchant rug and goddess statue · the three training machines · forge furnace, tool rack and weapon rack · pillars, inner walls and pits on stone floors · Wildland Dawn crates, XP gems, meat, magnet, bomb, gold and golden chest"],
      ja: ["ダンジョンの部屋の新しい絵：出口のアーチ（クリアで青く光る）・入口の敷石・下り階段・休憩の泉・宝箱・商人の敷物・女神像・鍛錬器具3つ・鍛冶場の炉・道具掛け・武器掛け・石の階の柱・内壁・穴・荒野の夜明けの木箱・経験値の宝石・肉・磁石・爆弾・金貨・黄金の箱"],
    },
  },
  {
    version: "0.53.12",
    date: "2026-11-15",
    items: {
      ko: ["메인 로비 새 그림: 오락실 바닥·네온 벽 · 분수·소파·화분·자판기 · 게임기 8대와 펫 상점 · 펫 8종 (게임 속 따라다니는 펫도)"],
      en: ["New main lobby art: arcade carpet and neon wall · fountain, sofa, plants and vending machine · all 8 game cabinets and the pet shop · all 8 pets (including the pet that follows you in a run)"],
      ja: ["メインロビーの新しい絵：ゲームセンターの床・ネオンの壁・噴水・ソファ・鉢植え・自販機・ゲーム機8台とペットショップ・ペット8種（プレイ中についてくるペットも）"],
    },
  },
  {
    version: "0.53.11",
    date: "2026-11-15",
    items: {
      ko: ["세계 지도(시험 중) 새 그림: 전체 지도가 그려진 세계 지도 위에서 지역 고르기 · 아스칼론 성 안 큰길 포장 · 실베르·탈라시아·테라코어 나라 집 · 순간 이동석·가게 간판·기억의 탑 · 길가 노점·우물·기사 동상·사자 분수·마차·장작·경보 종 등 · 성채·궁전·요새 경비병과 헬리오스 궁전의 꼭두각시 황제"],
      en: ["World Map (testing) new art: pick regions on a painted world map · Ascalon's main avenue paving · houses for Silber, Thalassia and Terracore · warp stones, shop signs and the Tower of Memory · street stalls, wells, a knight statue, a lion fountain, carriages, firewood, alarm bells and more · guards in the keeps and the Puppet Emperor in the Helios palace"],
      ja: ["世界地図（テスト中）新しい絵：描かれた世界地図の上で地域を選択・アスカロン城内の大通り舗装・シルベル・タラシア・テラコアの家・転移石・店の看板・記憶の塔・露店・井戸・騎士像・獅子の噴水・馬車・薪・警鐘など・城砦・宮殿・砦の衛兵とヘリオス宮殿の傀儡の皇帝"],
    },
  },
  {
    version: "0.53.10",
    date: "2026-11-15",
    items: {
      ko: ["던전 바닥·벽을 새 그림으로: 기본 방과 보스 27종 층마다 그 보스에 어울리는 바닥·벽 그림"],
      en: ["New dungeon floor and wall art: the basic rooms and every floor of the 27 bosses now use painted floors and walls matching that boss"],
      ja: ["ダンジョンの床・壁を新しい絵に：基本の部屋とボス27種の階ごとに、そのボスに合う床・壁の絵"],
    },
  },
  {
    version: "0.53.9",
    date: "2026-11-15",
    items: {
      ko: ["캐릭터 일러스트를 더 많은 곳에: 판 결과 창 옆에 크게(깨면 빛나고, 쓰러지면 어둡게) · 스토리 대화의 말하는 사람 초상화 · 숙련도가 오르면 판이 끝난 뒤 일러스트와 함께 알림 · 캐릭터 설명 창(I) 위쪽 그림"],
      en: ["Character illustrations in more places: shown large beside the run result (glowing on a clear, dimmed on a defeat) · speaker portraits in story scenes · a mastery level-up is announced with the illustration after the run · on top of the character guide (I)"],
      ja: ["キャラクターイラストをさらに多くの場所に：結果画面の横に大きく（クリアで輝き、倒れると暗く）・ストーリー会話の話し手の肖像・熟練度が上がるとプレイ後にイラスト付きでお知らせ・キャラクター説明（I）の上部"],
    },
  },
  {
    version: "0.53.8",
    date: "2026-11-15",
    items: {
      ko: ["캐릭터 일러스트: 캐릭터 선택 창 카드 그림을 일러스트로 · 새 캐릭터를 얻으면 메인·선택 화면에 일러스트가 크게 떠오름(빈 곳을 누르면 닫힘) · 숨은·한정 캐릭터까지 100명"],
      en: ["Character illustrations: character select cards now show illustrations · getting a new character pops up its illustration on the main/select screen (click outside to close) · all 100 characters including hidden and limited ones"],
      ja: ["キャラクターイラスト：キャラクター選択のカードの絵をイラストに・新キャラクターを手に入れるとメイン・選択画面にイラストが大きく表示（空いている所を押すと閉じる）・隠し・限定キャラクターまで100人"],
    },
  },
  {
    version: "0.53.7",
    date: "2026-11-15",
    items: {
      ko: ["패왕전: 기간토마키아(30명 생존) 대결을 없앴습니다"],
      en: ["Paewang: removed the Gigantomachia (30-player survival) match type"],
      ja: ["覇王戦：ギガントマキア（30人サバイバル）を削除しました"],
    },
  },
  {
    version: "0.53.6",
    date: "2026-11-15",
    items: {
      ko: ["세계 지도(시험 중): B 장비창은 끼고 빼기만 (승급·강화·재설정은 대장장이에게서) · 장비창 옆 지도 없앰 · 순간 이동석에서 F를 누르면 지도가 열려 만진 돌로 바로 이동 · 지도(M)에 '전체 지도 보기': 모든 지역이 펼쳐진 세계 지도에서 지역에 마우스를 올리면 흰 테두리, 누르면 그 지역 지도가 열리고 그곳 이동석으로 순간 이동"],
      en: ["World Map (testing): the B gear window is now for equipping only (promote, enhance and reroll at the blacksmith) · removed the map beside the gear window · pressing F at a warp stone opens the map so you can teleport to a touched stone right away · 'World map' button in the map (M): hover a region on the full world map for a white outline, click it to open that region's map and teleport to its warp stones"],
      ja: ["世界地図（テスト中）：B装備ウィンドウは付け外しのみ（昇級・強化・再設定は鍛冶屋で）・装備ウィンドウ横の地図を削除・転移石でFを押すと地図が開き、触れた石へすぐ移動・地図（M）に「全体地図を見る」：全地域が広がる世界地図で地域にカーソルを合わせると白い枠、押すとその地域の地図が開きそこの転移石へ瞬間移動"],
    },
  },
  {
    version: "0.53.5",
    date: "2026-11-15",
    items: {
      ko: [
        "세계 지도(시험 중): 성벽 안 풀밭을 나라마다 포장 바닥으로(아스칼론·탈라시아 돌길 · 헬리오스 누런 돌 · 성국 흰 대리석 · 비르디아 성 흰 잎무늬 돌 · 실베르 돌 바닥), 공원·정원만 풀밭과 꽃 · 길가에 가로등·금빛 화로·화로·촛대, 집 앞에 통·상자·화분 · 이클립스는 왕좌가 아닌 헬리오스 궁전 문 앞 수문장으로",
        "세계 지도 소리: 발밑 땅에 따라 풀·눈·얼음·쇠·나무·돌·모래 발소리 · 문 여는 소리·나가는 소리·순간 이동·표지판·말 걸기·잠긴 문 · 나라마다 환경음(산들바람·새소리·눈보라·파도·용암·물속·비·기계·성가 울림, 건물 안은 불 타닥) · 나라마다 다른 곡 열두 개(건물 안은 들어온 나라 곡)",
      ],
      en: [
        "World Map (testing): grass inside city walls is now paved for each nation (stone streets in Ascalon and Thalassia · sandstone in Helios · white marble in Seongguk · leaf-carved white stone in Virdia's castle · stone yards in Silber), with only parks and gardens left green with flowers · lamp posts, golden braziers, braziers and candle stands along streets, barrels, crates and potted plants by doors · Eclipse now guards the Helios palace gate instead of sitting on the throne",
        "World Map sounds: footsteps change with the ground (grass, snow, ice, metal, wood, stone, sand) · door creaks, leaving, warps, signs, talking and locked doors · ambience for each nation (breeze, birds, blizzard, waves, lava, underwater, rain, machines, chapel echoes, crackling fires indoors) · twelve nation themes (interiors use the theme of the nation you entered from)",
      ],
      ja: [
        "世界地図（テスト中）：城壁の中の草地を国ごとに舗装（アスカロン・タラシアは石畳・ヘリオスは砂岩・聖国は白い大理石・ヴィルディアの城は葉模様の白い石・シルベルは石の床）、公園と庭だけ草地と花に・道沿いに街灯・金の火鉢・火鉢・燭台、家の前に樽・木箱・植木鉢・エクリプスは玉座ではなくヘリオス宮殿の門の門番に",
        "世界地図の音：足元の地面で草・雪・氷・鉄・木・石・砂の足音・扉のきしみ・外に出る音・転移・看板・会話・鍵のかかった扉・国ごとの環境音（そよ風・鳥・吹雪・波・溶岩・水中・雨・機械・聖歌の響き、建物の中は火のはぜる音）・国ごとに違う曲12曲（建物の中は入ってきた国の曲）",
      ],
    },
  },
  {
    version: "0.53.4",
    date: "2026-11-15",
    items: {
      ko: ["세계 지도(시험 중): 처음 받는 지도 그림이 11MB에서 4.6MB로 줄어 더 빨리 열림(그림은 그대로) · 그림자를 미리 그려 두고 다시 써서 가벼워짐 · 탈라시아 젖은 돌·테라코어 돌길을 밝게, 사막·비르디아·테라코어 색 보정을 옅게 해 나라끼리 색이 고르게"],
      en: ["World Map (testing): the map art downloaded on first visit shrank from 11MB to 4.6MB, so it opens faster (the art looks the same) · shadows are prepared once and reused for smoother play · brighter wet stone in Thalassia and cobblestones in Terracore, and softer color grading in the desert, Virdia and Terracore so the nations look more even"],
      ja: ["世界地図（テスト中）：最初に受け取る地図の絵が11MBから4.6MBに減り、早く開くように（絵はそのまま）・影を一度作って使い回し軽く・タラシアの濡れた石とテラコアの石畳を明るく、砂漠・ヴィルディア・テラコアの色補正を薄くして国ごとの色をそろえました"],
    },
  },
];
