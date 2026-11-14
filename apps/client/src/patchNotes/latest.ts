import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
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
