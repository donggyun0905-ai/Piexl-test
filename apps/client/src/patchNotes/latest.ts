import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.280",
    date: "2026-10-31",
    items: {
      ko: ["베두인이 차크람을 던지면 예전 그림으로 바뀌던 문제 고침 (새 그림 그대로)"],
      en: ["Fixed the Bedouin switching back to the old art after throwing the chakram (keeps the new art)"],
      ja: ["ベドウィンがチャクラムを投げると古い絵に戻る問題を修正（新しい絵のまま）"],
    },
  },
  {
    version: "0.48.279",
    date: "2026-10-31",
    items: {
      ko: ["좌우가 반대로 나오던 그림 고침: 소환술사 공격 · 풋내기 공격 · 버려진 자들(검 소년) 서기·걷기"],
      en: ["Fixed mirrored poses: Summoner attack · Novice attack · The Abandoned (sword boy) standing and walking"],
      ja: ["左右が逆になっていた絵を修正: 召喚術師の攻撃 · 見習いの攻撃 · 捨てられた者たち（剣の少年）の立ち・歩き"],
    },
  },
  {
    version: "0.48.278",
    date: "2026-10-31",
    items: {
      ko: ["새 캐릭터 그림 6명 추가: 풋내기·베두인·장수·이무기·악의 사도·버려진 자들(세 아이 모두) · 앞·뒤·왼·오 모습과 방향별 공격, 걷기, 맞음·쓰러짐·대시 자세"],
      en: ["New art for 6 more characters: Novice, Bedouin, General, Imugi, Apostle of Malice, The Abandoned (all three kids) · front/back/left/right poses with directional attacks, walking, flinch, downed and dash poses"],
      ja: ["新しいキャラ絵を6人追加: 見習い・ベドウィン・武将・イムギ・悪の使徒・捨てられた者たち（3人とも）· 前・後ろ・左・右の姿と向きごとの攻撃、歩き、ひるみ・ダウン・ダッシュのポーズ"],
    },
  },
  {
    version: "0.48.277",
    date: "2026-10-31",
    items: {
      ko: ["새 캐릭터 그림 6명 추가: 거너·닌자·소환술사·시간술사·야수·의사 · 앞·뒤·왼·오 모습과 방향별 공격, 걷기, 맞음·쓰러짐·대시 자세"],
      en: ["New art for 6 more characters: Gunner, Ninja, Summoner, Chronomancer, Beastkin, Doctor · front/back/left/right poses with directional attacks, walking, flinch, downed and dash poses"],
      ja: ["新しいキャラ絵を6人追加: ガンナー・忍者・召喚術師・時間術師・獣人・医者 · 前・後ろ・左・右の姿と向きごとの攻撃、歩き、ひるみ・ダウン・ダッシュのポーズ"],
    },
  },
  {
    version: "0.48.276",
    date: "2026-10-31",
    items: {
      ko: ["새 그림 캐릭터의 왼쪽·오른쪽 공격 자세가 반대로 나오던 문제 고침 (파수꾼·떠돌이·음양사·기계공학자·원소술사·격투가) · 기계공학자가 레이저를 쏠 때 공격 자세 · 그림 칸 위에 붙어 나오던 작은 조각 지움"],
      en: ["Fixed left/right attack poses being swapped on the new art (Warden, Drifter, Talisman Master, Engineer, Elementalist, Brawler) · Engineer now shows its attack pose while firing the laser · removed stray fragments at the top of some frames"],
      ja: ["新しい絵のキャラの左右の攻撃ポーズが逆になる問題を修正（番人・流れ者・陰陽師・機械工学者・元素術師・格闘家）· 機械工学者がレーザーを撃つ間は攻撃ポーズ · 一部のコマ上部に出ていた小さなかけらを削除"],
    },
  },
  {
    version: "0.48.275",
    date: "2026-10-31",
    items: {
      ko: ["캐릭터 선택창·설명 창·스킨 미리보기의 캐릭터 그림을 화면 해상도로 또렷하게 그림 (새 그림이 흐릿하던 문제)"],
      en: ["Character art in the selection screen, info window and skin previews is now drawn at screen resolution (new art no longer looks blurry)"],
      ja: ["キャラクター選択画面・説明ウィンドウ・スキンプレビューのキャラ絵を画面解像度でくっきり描画（新しい絵がぼやける問題）"],
    },
  },
  {
    version: "0.48.274",
    date: "2026-10-31",
    items: {
      ko: ["새 캐릭터 그림 7명: 파수꾼·마법사·떠돌이·음양사·기계공학자·원소술사·격투가 · 앞·뒤·왼·오 모습과 방향마다 공격 자세, 다리를 움직이는 걷기, 맞을 때 움찔·대시 때 돌진 자세·협동에서 쓰러진 모습"],
      en: ["New art for 7 characters: Warden, Mage, Drifter, Talisman Master, Engineer, Elementalist, Brawler · front/back/left/right poses with an attack pose for each direction, walking with moving legs, a flinch when hit, a lunge while dashing and a downed pose in co-op"],
      ja: ["7人のキャラクターを新しい絵に: 番人・魔法使い・流れ者・陰陽師・機械工学者・元素術師・格闘家 · 前・後ろ・左・右の姿と向きごとの攻撃ポーズ、足を動かす歩き、被弾時のひるみ・ダッシュ時の突進ポーズ・協力プレイで倒れた姿"],
    },
  },
  {
    version: "0.48.273",
    date: "2026-10-31",
    items: {
      ko: ["파수꾼 그림을 진한 색·굵은 테두리 그림으로 바꿈: 은빛 판금 갑옷, 붉은 깃털 투구, 푸른 망토 · 어두운 바닥에서도 또렷하게 보임"],
      en: ["Warden art swapped to a bolder version with rich colors and thick outlines: silver plate armor, red-plumed helmet, blue cape · stands out clearly on dark floors"],
      ja: ["番人の絵を濃い色・太い縁取りの絵に変更: 銀のプレートアーマー、赤い羽根の兜、青いマント · 暗い床でもはっきり見える"],
    },
  },
  {
    version: "0.48.272",
    date: "2026-10-31",
    items: {
      ko: ["파수꾼 그림을 4배(128칸) 새 그림으로: 흰·금빛 판금 갑옷, 붉은 깃털 머리 장식, 푸른 망토, 큰 칼 · 마법사와 같은 화풍"],
      en: ["Warden redrawn with new 4× (128-px) art: white-and-gold plate armor, red plume crest, blue cape, greatsword · same art style as the Mage"],
      ja: ["番人を4倍（128マス）の新しい絵に: 白と金のプレートアーマー、赤い羽根飾り、青いマント、大剣 · 魔法使いと同じ画風"],
    },
  },
  {
    version: "0.48.271",
    date: "2026-10-31",
    items: {
      ko: ["보스 '공허의 눈'을 2배 촘촘한 그림으로: 흔들리는 촉수 · 공격 준비 때 눈을 가늘게 뜨며 둘레 구슬이 모이고, 공격 때 눈을 부릅뜨며 빛살"],
      en: ["Boss 'Void Eye' redrawn at twice the detail: swaying tentacles · narrows its eye and gathers its orbs when winding up, then glares with rays of light when attacking"],
      ja: ["ボス「虚空の目」を2倍細かい絵に: 揺れる触手 · 攻撃準備で目を細め周りの玉が集まり、攻撃で目を見開き光線"],
    },
  },
  {
    version: "0.48.270",
    date: "2026-10-31",
    items: {
      ko: ["마법사 스킨 10종을 새 그림에 맞춰 다시 만듦: 크리스마스(산타 모자)·할로윈(마녀 모자)·학교(학사모)·수영복(꽃)·미국(카우보이 모자)·중국(쪽머리 장식)·일본(꽃 비녀)·설날(댕기)·색 바꾸기(은빛 머리)·승리(금빛 테두리·월계관) · 옷의 푸른 천이 테마 색으로"],
      en: ["All 10 Mage skins rebuilt on the new art: Christmas (santa hat), Halloween (witch hat), School (mortarboard), Swim (flower), USA (cowboy hat), China (hair buns), Japan (flower hairpin), New Year (ribbon), Swap (silver hair), Victory (gold outline, laurel) · the blue cloth takes the theme color"],
      ja: ["魔法使いのスキン10種を新しい絵に合わせて作り直し: クリスマス（サンタ帽）・ハロウィン（魔女帽）・学校（角帽）・水着（花）・アメリカ（カウボーイハット）・中国（お団子飾り）・日本（花かんざし）・お正月（リボン）・色替え（銀髪）・勝利（金の縁取り・月桂冠）· 服の青い布がテーマ色に"],
    },
  },
  {
    version: "0.48.269",
    date: "2026-10-31",
    items: {
      ko: ["마법사 그림 해상도를 4배(128칸)로 올림: 확대해서 봐도 눈·리본·지팡이 장식이 또렷함 · 바깥 테두리를 두껍게 해 바닥과 구분"],
      en: ["Mage sprite resolution raised to 4× (128-px cells): eyes, ribbon and staff details stay sharp when zoomed · thicker outer outline to stand out from the floor"],
      ja: ["魔法使いの絵の解像度を4倍（128マス）に: 拡大しても目・リボン・杖の飾りがくっきり · 外側の縁取りを太くして床と区別"],
    },
  },
  {
    version: "0.48.268",
    date: "2026-10-31",
    items: {
      ko: ["시험: 마법사 그림을 새 설정 그림(금빛 긴 웨이브 머리·후광·흰 옷과 푸른 천·별 지팡이)의 도트로 바꿔 봄 (앞·뒤·옆·공격 대기 모습, 걷기는 한 장면)"],
      en: ["Trial: the Mage sprite swapped to pixel art from new concept art (long golden wavy hair, halo, white robe with blue cloth, star staff) · front, back, side and casting poses (walking uses one frame)"],
      ja: ["試験: 魔法使いの絵を新しい設定画（金色の長いウェーブ髪・光輪・白い服と青い布・星の杖）のドットに変更（前・後ろ・横・攻撃待機、歩きは1枚）"],
    },
  },
  {
    version: "0.48.267",
    date: "2026-10-31",
    items: {
      ko: ["고해상도 몸 틀 (마법사): 머리 높이를 조금 낮춤 · 뒷모습 긴 머리를 결 묶음 두 층(길이가 다른 뾰족한 끝·윤기 고리)으로 · 뒤통수 금빛 리본(고리와 꼬리) · 옆모습 머리가 이마선을 따라가고 귀 앞 옆머리 · 옆얼굴 홍조·입 자리 고침"],
      en: ["High-res body template (Mage): slightly shorter head · back hair as two layers of strand clumps (pointed tips of varied length, shine ring) · gold ribbon with loops and tails · side-view hair follows the forehead with a lock in front of the ear · fixed side-face blush and mouth"],
      ja: ["高解像度の体テンプレート（魔法使い）: 頭の高さを少し低く · 後ろ髪を毛束2層に（長さの違う尖った毛先・天使の輪）· 後頭部の金のリボン（輪と垂れ）· 横向きの髪が額の線に沿い、耳の前に横髪 · 横顔の頬の赤み・口の位置を修正"],
    },
  },
  {
    version: "0.48.266",
    date: "2026-10-31",
    items: {
      ko: ["고해상도 몸 틀 다듬기 (마법사): 게임 크기에서도 또렷한 둥근 큰 눈·진한 테두리·덩어리 홍조 · 둥글고 볼륨 있는 머리(결 묶음·왼쪽 위 윤기) · 좁은 어깨와 들어간 허리 · 옆모습 걷기에서 두 다리가 엇갈리고 팔이 흔들림"],
      en: ["High-res body template polish (Mage): big round eyes, darker outlines and solid blush that stay clear at game size · rounder, fuller hair (strand clumps, top-left shine) · narrower shoulders and waist · side walk with crossing legs and swinging arm"],
      ja: ["高解像度の体テンプレート調整（魔法使い）: ゲームの大きさでもはっきりした丸く大きな瞳・濃い縁取り・まとまった頬の赤み · 丸くボリュームのある髪（毛束・左上のつや）· 細い肩とくびれ · 横向きの歩きで両脚が交差し腕が揺れる"],
    },
  },
  {
    version: "0.48.265",
    date: "2026-10-31",
    items: {
      ko: ["고해상도 그림 시범 2: 마법사를 손으로 찍은 몸 틀로 다시 그림 (더 귀여운 얼굴·큰 눈·볼 홍조·얼굴을 감싸는 옆머리 · 뒷모습 V자 머리끝과 리본 · 옆얼굴)"],
      en: ["High-res art trial 2: the Mage redrawn on a hand-pixeled body template (cuter face, big eyes, blush, side locks framing the face · V-tipped hair and ribbon from behind · side profile)"],
      ja: ["高解像度の試作2: 魔法使いを手打ちの体テンプレートで描き直し（よりかわいい顔・大きな瞳・頬の赤み・顔を包む横髪 · 後ろ姿のV字の毛先とリボン · 横顔）"],
    },
  },
  {
    version: "0.48.264",
    date: "2026-10-30",
    items: {
      ko: [
        "고해상도 그림 시범: 마법사(별빛 마법사)를 2배 촘촘한 그림으로 새로 그림 (큰 눈·결이 보이는 은빛 머리·명암·금 장식·수정 지팡이)",
        "고해상도 그림 시범: 1층 보스 강철 거구를 2배 촘촘하게 새로 그림 (용광로 심장·성난 눈·어깨 가시·굴뚝 연기) · 걷기·공격 준비(주먹을 머리 위로)·내려찍기(불티) 그림",
      ],
      en: [
        "High-res art trial: the Mage (Starlight Mage) redrawn at twice the detail (big eyes, strand-lit silver hair, shading, gold trim, crystal staff)",
        "High-res art trial: floor 1 boss Iron Hulk redrawn at twice the detail (furnace heart, angry eyes, shoulder spikes, chimney smoke) · walk, wind-up (fists overhead) and slam (sparks) frames",
      ],
      ja: [
        "高解像度の試作: 魔法使い（星光の魔法使い）を2倍細かい絵で描き直し（大きな瞳・毛筋の見える銀髪・陰影・金の飾り・水晶の杖）",
        "高解像度の試作: 1階ボス鋼鉄の巨躯を2倍細かく描き直し（溶鉱炉の心臓・怒った目・肩の棘・煙突の煙）· 歩き・攻撃準備（拳を頭上に）・叩きつけ（火花）の絵",
      ],
    },
  },
];
