import type { PatchNote } from "./types";

export const NOTES: PatchNote[] = [
  {
    version: "0.52.101",
    date: "2026-11-14",
    items: {
      ko: ["보스 21종 그림을 새로 그림 (4배 촘촘한 도트): 갓이터·파멸의 검·혼돈의 검·태초의 빛·태초의 어둠·괴력난신·제천대성(근두운 포함)·검신·천사장·데스·검은 기사·얍삽한 활잡이·세이렌·켄타우로스·하드플랜트·두꺼비 왕·불도롱뇽·번개 해파리·유령선 선장·검은 잔영·데스웜·거대 전갈·거대 매 (되살린 검은 모습 포함)", "데스웜이 땅에서 뛰어올라 날 때 온몸이 드러난 모습으로 보임"],
      en: ["Redrew 21 bosses in 4x finer pixel art: God Eater, Ruin Blade, Chaos Blade, Primeval Light, Primeval Darkness, Demigod of Wild Might, Great Sage (with cloud), Sword God, Archangel, Death, Black Knight, Sly Archer, Siren, Centaur, Hard Plant, Toad King, Fire Salamander, Thunder Jellyfish, Ghost Ship Captain, Black Remnant, Death Worm, Giant Scorpion, Giant Hawk (incl. revived dark forms)", "The Death Worm now shows its whole body when it leaps out of the ground"],
      ja: ["ボス21種の絵を描き直し（4倍細かいドット）：ゴッドイーター・破滅の剣・混沌の剣・太初の光・太初の闇・怪力乱神・斉天大聖（觔斗雲含む）・剣神・天使長・デス・黒騎士・ずるい弓使い・セイレーン・ケンタウロス・ハードプラント・ガマ王・火サラマンダー・雷クラゲ・幽霊船の船長・黒い残影・デスワーム・巨大サソリ・巨大鷹（蘇った黒い姿含む）", "デスワームが地面から跳び出すとき全身が見えるように"],
    },
  },
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
];
