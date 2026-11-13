import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.94",
    date: "2026-11-14",
    items: {
      ko: ["스토리 4장 장면 일러스트 8장 추가: 빛 없는 의식의 방, 사도의 세 수하, 응접실의 귓속말, 묶인 이터와 황금 깃털, 갓이터의 강림, 새벽의 이터, 돌아온 수하들, 아카식 레코드의 관찰자 (4장 8컷 모두 완성)"],
      en: ["8 new Chapter 4 scene illustrations: the lightless ritual chamber, the Apostle's three servants, a whisper at the reception, the chained Eater and the golden feather, the God Eater's descent, the Eater at dawn, the servants' return and the watchers of the Akashic Record (all 8 Chapter 4 scenes done)"],
      ja: ["ストーリー4章のシーンイラスト8枚追加：光なき儀式の間、使徒の三人の配下、応接間のささやき、鎖につながれたイーターと黄金の羽、ゴッドイーターの降臨、夜明けのイーター、戻った配下たち、アカシックレコードの観察者（4章の8カットすべて完成）"],
    },
  },
  {
    version: "0.52.93",
    date: "2026-11-14",
    items: {
      ko: ["스토리 4장을 장면 8개로 나눔 (일러스트는 차례로 추가, 그 전에는 장면마다 임시 배경)"],
      en: ["Story Chapter 4 split into 8 scenes (illustrations coming; placeholder backgrounds until then)"],
      ja: ["ストーリー4章を8つのシーンに分割（イラストは順次追加、それまではシーンごとの仮背景）"],
    },
  },
  {
    version: "0.52.92",
    date: "2026-11-14",
    items: {
      ko: ["스토리 3장 장면 일러스트 10장 추가: 테라코어 뒷골목의 세 아이부터 사막 신전의 태초 강림, 세계수 통로, 잿빛 새벽의 후퇴까지 (3장 10컷 모두 완성)"],
      en: ["10 new Chapter 3 scene illustrations: from three children in a Terracore back alley to the Primeval awakening in the desert temple, the World Tree passage and the retreat at an ashen dawn (all 10 Chapter 3 scenes done)"],
      ja: ["ストーリー3章のシーンイラスト10枚追加：テラコアの裏路地の三人の子どもから、砂漠の神殿での太初の降臨、世界樹の通路、灰色の夜明けの撤退まで（3章の10カットすべて完成）"],
    },
  },
  {
    version: "0.52.91",
    date: "2026-11-14",
    items: {
      ko: ["새 캐릭터 베르 (아슈바르, 태초의 초록): 덩굴 쌍낫 하나 · 패시브 없음 · 적응력·강화·승격·제약은 느아르와 같음 · 로비 칩 45만 개로 열기 · 녹독: 독이 2배 빨리 들어가고 들어갈수록 세짐 · 맞을 때마다 확률로 몸속에 씨앗 → 독을 45번 받으면 발아(겹마다 큰 한 방 + 출혈·독·화상) · 공격 16종: 녹식 쌍낫격·가시 회전무·부패의 난무·맹독 덩굴채찍 · 추가 공격(씨앗 바로 발아) 기생 씨앗·체내 개화(독가스 꽃)·생명 착취(회복)·시든 육신(씨앗을 뿌리며 늘어나는 덩굴) · 스킬 부패의 꽃밭/사령화 조종(쓰러진 적을 덩굴 인형으로)·가시숲 강림/만개의 포식자(무는 꽃 설치)·대지 부식/천륜 가시무·기생 덩굴 감옥/종언의 생명수확"],
      en: ["New character Vert (Ashvar, the Primordial Green): one weapon, the Twin Vine Scythes · no passives · Adaptation, upgrades, ranks and Restraint like Noir · unlock with 450,000 lobby chips · Verdant Venom: poison ticks twice as fast and grows stronger · hits may plant seeds inside foes → after 45 poison ticks they sprout (big hit per seed + bleed, poison, burn) · 16 attacks: Verdant Twin Slash, Thorn Whirl, Frenzy of Decay, Venom Vine Whip · extra attacks (instant sprout) Parasitic Seed, Inner Bloom (gas flower), Life Siphon (heal), Withered Husk (spreading seed vines) · skills Garden of Decay/Puppetry of the Dead (raise fallen foes as vine puppets), Thornwood Descent/Full-Bloom Devourer (biting flowers), Earth Corrosion/Heavenwheel Thorn Dance, Parasite Vine Prison/Final Harvest of Life"],
      ja: ["新キャラクター ヴェール（アシュヴァル、太初の緑）：武器は蔓の双鎌ひとつ・パッシブなし・適応力・強化・昇格・制約はノワールと同じ・ロビーチップ45万枚で解放・緑毒：毒が2倍速く入り、入るほど強くなる・ヒットごとに確率で体内に種 → 毒を45回受けると発芽（1重ごとに大ダメージ＋出血・毒・火傷）・攻撃16種：緑蝕双鎌撃・棘の回転舞・腐敗の乱舞・猛毒の蔓鞭・追加攻撃（種をすぐ発芽）寄生の種・体内開花（毒ガスの花）・生命搾取（回復）・枯れた肉体（種をまいて増える蔓）・スキル 腐敗の花畑／死霊化操縦（倒れた敵を蔓の人形に）・棘森降臨／満開の捕食者（噛みつく花を設置）・大地腐食／天輪棘舞・寄生蔓の牢獄／終焉の生命収穫"],
    },
  },
  {
    version: "0.52.90",
    date: "2026-11-14",
    items: {
      ko: ["스토리 3장을 장면 10개로 나눔 (일러스트는 차례로 추가, 그 전에는 장면마다 임시 배경)"],
      en: ["Story Chapter 3 split into 10 scenes (illustrations coming; placeholder backgrounds until then)"],
      ja: ["ストーリー3章を10のシーンに分割（イラストは順次追加、それまではシーンごとの仮背景）"],
    },
  },
  {
    version: "0.52.89",
    date: "2026-11-14",
    items: {
      ko: ["스토리 2장 장면 일러스트 3장 추가: 풋내기와 격투가 · 아스트랄 로드와 탈출 · 국경 언덕의 새벽 (2장 8컷 모두 완성)"],
      en: ["3 new Chapter 2 scene illustrations: the Novice and the Brawler · the astral rod and the escape · dawn on the border hill (all 8 Chapter 2 scenes done)"],
      ja: ["ストーリー2章のシーンイラスト3枚追加：見習いと格闘家・アストラルロッドと脱出・国境の丘の夜明け（2章の8カットすべて完成）"],
    },
  },
  {
    version: "0.52.88",
    date: "2026-11-14",
    items: {
      ko: ["스토리 2장 장면 일러스트 5장 추가: 테라코어의 경고 · 헬리오스로 떠나는 장수와 풋내기 · 황금빛 연회 · 달빛 공터의 갓이터 · 테라코어의 난입"],
      en: ["5 new Chapter 2 scene illustrations: Terracore's warning · the General and the Novice set out for Helios · the golden banquet · the God Eater in the moonlit clearing · Terracore breaks in"],
      ja: ["ストーリー2章のシーンイラスト5枚追加：テラコアの警告・ヘリオスへ発つ武将と見習い・黄金の宴・月明かりの空き地のゴッドイーター・テラコアの乱入"],
    },
  },
  {
    version: "0.52.87",
    date: "2026-11-13",
    items: {
      ko: ["스토리 장면을 화면 가득: 그림이 화면 전체를 채우고 대사 상자는 아래에 반투명하게 겹침 (세로 휴대폰은 그림 전체가 보이게) · '⛶ 전체 화면' 버튼으로 브라우저 전체 화면 (장면을 닫으면 자동으로 꺼짐)"],
      en: ["Story scenes now fill the screen: the illustration covers the whole view with a translucent dialogue box at the bottom (portrait phones show the full picture) · '⛶ Fullscreen' button for browser fullscreen (turns off when the scene closes)"],
      ja: ["ストーリーのシーンを画面いっぱいに：イラストが画面全体を覆い、台詞ボックスは下に半透明で重なる（縦向きスマホは絵全体を表示）・「⛶ 全画面」ボタンでブラウザ全画面（シーンを閉じると自動で解除）"],
    },
  },
  {
    version: "0.52.86",
    date: "2026-11-13",
    items: {
      ko: ["스토리 2장을 장면 8개로 나눔 (일러스트는 차례로 추가, 그 전에는 장면마다 임시 배경)"],
      en: ["Story Chapter 2 split into 8 scenes (illustrations coming; placeholder backgrounds until then)"],
      ja: ["ストーリー2章を8つのシーンに分割（イラストは順次追加、それまではシーンごとの仮背景）"],
    },
  },
  {
    version: "0.52.85",
    date: "2026-11-13",
    items: {
      ko: ["스토리 1장 컷 1·2 일러스트: 잠든 어린 용을 겨누는 사냥꾼 · 아스칼론을 습격하는 어미 용 (1장 8컷 모두 그림으로)"],
      en: ["Chapter 1 cuts 1 and 2 illustrated: a hunter aiming at a sleeping young dragon · the mother dragon attacking Ascalon (all 8 Chapter 1 cuts now illustrated)"],
      ja: ["ストーリー1章カット1・2のイラスト：眠る幼い竜を狙う狩人・アスカロンを襲う母竜（1章の8カットすべてイラストに）"],
    },
  },
  {
    version: "0.52.84",
    date: "2026-11-13",
    items: {
      ko: ["스토리 1장 장면 일러스트 4장 추가: 폭풍 속 용과의 싸움 · 치유소 앞의 갈라섬 · 그림자 속 검은 약 · 새벽의 작별"],
      en: ["4 new Chapter 1 scene illustrations: the battle with the dragon in the storm · the split before the healing hut · the black potion in the shadows · the farewell at dawn"],
      ja: ["ストーリー1章のシーンイラスト4枚追加：嵐の中の竜との戦い・治療所の前の決裂・影の中の黒い薬・夜明けの別れ"],
    },
  },
  {
    version: "0.52.83",
    date: "2026-11-13",
    items: {
      ko: ["스토리 1장 장면 일러스트 추가: 깊은 숲에서 새끼 용을 지키는 야수와 원소술사"],
      en: ["New Chapter 1 scene illustration: the Beastkin and the Elementalist protecting a young dragon in the deep forest"],
      ja: ["ストーリー1章のシーンイラスト追加：深い森で子竜を守る獣人と元素術師"],
    },
  },
  {
    version: "0.52.82",
    date: "2026-11-13",
    items: {
      ko: ["스토리 1장 장면 일러스트 첫 장: 의료소에서 맹세하는 세 아이 (나머지 컷은 차례로 추가)"],
      en: ["First Chapter 1 scene illustration: three children swearing an oath in the infirmary (more cuts coming)"],
      ja: ["ストーリー1章のシーンイラスト1枚目：療養所で誓う三人の子ども（ほかのカットも順次追加）"],
    },
  },
];
