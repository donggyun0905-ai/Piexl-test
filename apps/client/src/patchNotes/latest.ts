import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.100",
    date: "2026-11-14",
    items: {
      ko: ["세계 지도(시험 중) 그림을 새로 다듬음: 땅끼리 경계가 자연스럽게 섞이고 풀·흙·물에 결 무늬 · 나무 4종이 겹쳐 숲이 되고 바람에 흔들림(캐릭터와 앞뒤도 맞음) · 둥근 바위·풀숲·꽃·울타리 밭·연못 · 성벽 톱니·벽돌, 돌 바닥, 지붕과 문·창이 있는 집 · 판자 다리·던전 굴 입구·펄럭이는 깃발 · 그림자·물 반짝임·나비·구름 그림자 · 아스칼론 필드 길을 구불구불하게"],
      en: ["World Map (testing) art refresh: terrain edges blend naturally, with textured grass, dirt and water · four tree types overlap into forests and sway in the wind (correctly in front of/behind characters) · round boulders, grass tufts, flowers, a fenced field and a pond · castle battlements and bricks, stone paving, houses with roofs, doors and windows · plank bridge, dungeon cave entrance and a waving flag · shadows, water sparkles, butterflies and drifting cloud shadows · winding roads in the Ascalon field"],
      ja: ["世界地図（テスト中）の絵を作り直し：地面の境目が自然に混ざり、草・土・水に質感 · 4種類の木が重なって森になり風に揺れる（キャラとの前後も正しく）· 丸い岩・草むら・花・柵の畑・池 · 城壁の狭間と煉瓦、石畳、屋根と扉・窓のある家 · 板の橋・ダンジョンの洞窟入口・はためく旗 · 影・水のきらめき・蝶・流れる雲の影 · アスカロン平原の道を曲がりくねらせた"],
    },
  },
  {
    version: "0.52.99",
    date: "2026-11-14",
    items: {
      ko: ["스토리 6장을 장면 12개로 나눔 (일러스트는 차례로 추가, 그 전에는 장면마다 임시 배경)"],
      en: ["Story Chapter 6 split into 12 scenes (illustrations coming; placeholder backgrounds until then)"],
      ja: ["ストーリー6章を12のシーンに分割（イラストは順次追加、それまではシーンごとの仮背景）"],
    },
  },
  {
    version: "0.52.98",
    date: "2026-11-14",
    items: {
      ko: ["베르: 가시숲 강림·대지 부식·사령화 조종의 범위와 이펙트 크기를 줄임", "블랑: 순백의 부채무 이펙트가 바라보는 쪽으로 펼쳐짐(부채 끝이 캐릭터 쪽) · 빙의 방향키를 → 모양 화살표로 · 스킬 칸 옆에 백무(빙의) 대기 칸 · 대시할 때 누르고 있던 방향키는 손을 뗄 때까지 세지 않음(바로 실패하지 않게) · 반전된 구원·백색 성역의 기만·천개의 거짓 눈의 범위와 이펙트 크기를 줄임"],
      en: ["Vert: smaller range and effects for Thornwood Descent, Earth Corrosion and Puppetry of the Dead", "Blanc: Pure White Fan Dance now opens toward where you face (fan tip at the character) · possession keys shown as → style arrows · a White Dance (possession) cooldown slot next to the skills · a direction held while dashing no longer counts until released (no instant miss) · smaller range and effects for Inverted Salvation, Deceit of the White Sanctuary and Thousand False Eyes"],
      ja: ["ヴェール：棘森降臨・大地腐食・死霊化操縦の範囲とエフェクトを小さく", "ブラン：純白の扇舞が向いている方へ開く（扇の要がキャラ側）・憑依の方向キーを→型の矢印に・スキル欄の横に白舞（憑依）の待ち時間欄・ダッシュ時に押していた方向は離すまで数えない（すぐ失敗しない）・反転した救済・白き聖域の欺瞞・千の偽りの眼の範囲とエフェクトを小さく"],
    },
  },
  {
    version: "0.52.97",
    date: "2026-11-14",
    items: {
      ko: ["스토리 5장 장면 일러스트 10장 추가: 세 왕의 원탁, 장로의 사념, 세계수 아래의 명령, 테라코어 거리, 아스칼론 대기실, 패왕전 개막, 숲에 내려서는 정예들, 괴력난신의 등장, 검은 불꽃의 천 조각, 세 나라의 연합 (5장 10컷 모두 완성)"],
      en: ["10 new Chapter 5 scene illustrations: the three kings' round table, the Elder's thoughts, an order beneath the World Tree, the streets of Terracore, the Ascalon waiting room, the Champion Clash opening, the elites landing in the forest, the Demigod of Wild Might's arrival, the black-flame cloth and the alliance of three nations (all 10 Chapter 5 scenes done)"],
      ja: ["ストーリー5章のシーンイラスト10枚追加：三王の円卓、長老の思念、世界樹の下の命令、テラコアの街、アスカロンの控え室、覇王戦の開幕、森に降り立つ精鋭たち、怪力乱神の登場、黒い炎の布切れ、三国の連合（5章の10カットすべて完成）"],
    },
  },
  {
    version: "0.52.96",
    date: "2026-11-14",
    items: {
      ko: ["새 캐릭터 블랑 (아슈바르, 태초의 하양): 순백의 부채 하나 · 패시브 없음 · 적응력·강화·승격·제약은 느아르와 같음 · 로비 칩 45만 개로 열기 · 백무(빙의): 대시하면 3초 동안 화면이 회색이 되고 모든 움직임이 느려짐 → 둘레 적(보스 빼고) 머리 위 방향키를 그대로 누르면 그 적 몸속에 들어가 조종(무적·최대 10초, 3초 뒤 다른 적으로 옮겨 탈 수 있고 그때마다 방향키 +1 · 나올 때 그 적에게 큰 한 방 · 틀리면 그냥 대시, 다음 빙의까지 10초) · 공격 16종(순백의 부채무·거짓된 축복·성흔 인형극·백색 거울궁 · 추가 공격 영혼의 틈·백령 빙의·강제 성전·허수의 분신 · 고해의 속삭임/반전된 구원·정화의 역설/백색 성역의 기만·천사의 거짓 날개/천개의 거짓 눈·영혼 전이/종언의 무구한 지배)"],
      en: ["New character Blanc (Ashvar, the Primordial White): one weapon, the Pure White Fan · no passives · Adaptation, upgrades, ranks and Restraint like Noir · unlock with 450,000 lobby chips · White Dance (possession): dashing turns the screen gray and slows everything for 3s → enter the arrow keys shown over a nearby foe (not bosses) to slip inside and control it (invulnerable, up to 10s; hop to another foe after 3s, +1 key each hop · a big hit on that foe when you leave · a mistake is just a dash, next try in 10s) · 16 attacks (Pure White Fan Dance, False Blessing, Stigmata Puppet Show, White Mirror Palace · extra attacks Soul Rift, White Spirit Possession, Forced Crusade, Imaginary Double · Whisper of Confession/Inverted Salvation, Paradox of Purification/Deceit of the White Sanctuary, False Wings of the Angel/Thousand False Eyes, Soul Transfer/Final Immaculate Dominion)"],
      ja: ["新キャラクター ブラン（アシュヴァル、太初の白）：武器は純白の扇ひとつ・パッシブなし・適応力・強化・昇格・制約はノワールと同じ・ロビーチップ45万枚で解放・白舞（憑依）：ダッシュすると3秒間画面が灰色になりすべての動きが遅くなる → 周りの敵（ボス以外）の頭上の方向キーをその通り押すとその敵の体内に入って操る（無敵・最大10秒、3秒後に別の敵へ乗り移れ、そのたびに方向キー+1・抜ける時その敵に大きな一撃・間違えるとただのダッシュ、次の憑依まで10秒）・攻撃16種（純白の扇舞・偽りの祝福・聖痕の人形劇・白き鏡宮・追加攻撃 魂の隙間・白霊憑依・強制聖戦・虚数の分身・告解の囁き／反転した救済・浄化の逆説／白き聖域の欺瞞・天使の偽りの翼／千の偽りの眼・魂の転移／終焉の無垢なる支配）"],
    },
  },
  {
    version: "0.52.95",
    date: "2026-11-14",
    items: {
      ko: ["스토리 5장을 장면 10개로 나눔 (일러스트는 차례로 추가, 그 전에는 장면마다 임시 배경)"],
      en: ["Story Chapter 5 split into 10 scenes (illustrations coming; placeholder backgrounds until then)"],
      ja: ["ストーリー5章を10のシーンに分割（イラストは順次追加、それまではシーンごとの仮背景）"],
    },
  },
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
];
