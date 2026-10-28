import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.167",
    date: "2026-10-28",
    items: {
      ko: [
        "잔영: 체력 45 고정 (체력 아이템을 먹어도 늘지 않음)",
        "잔영 그림자: 무적 대신 적 몸에 부딪혀 받는 피해만 막음 (원거리 공격은 맞음)",
        "방랑객 그림: 길게 뻗은 카타나로 새로 그림 (금빛 코등이·감은 손잡이·살짝 휜 칼날) · 공격할 때 치켜듦 → 비스듬히 벰 → 앞으로 그음 · 허리에 긴 칼집 (모든 스킨)",
      ],
      en: [
        "Remnant: HP fixed at 45 (HP items don't raise it)",
        "Remnant shadow: no longer invulnerable — it only blocks contact damage from enemies (ranged attacks still hit)",
        "Wanderer art: redrawn with a long katana (gold guard, wrapped grip, slightly curved blade) · attacks raise it → slash diagonally → cut forward · long scabbard at the hip (all skins)",
      ],
      ja: [
        "残影: 体力45固定（体力アイテムで増えない）",
        "残影の影: 無敵ではなく、敵の体に触れて受けるダメージだけを防ぐ（遠距離攻撃は当たる）",
        "放浪者の絵: 長く伸びた刀で描き直し（金の鍔・巻いた柄・少し反った刀身）· 攻撃時は振りかぶる → 斜めに斬る → 前へ斬り下ろす · 腰に長い鞘（すべてのスキン）",
      ],
    },
  },
  {
    version: "0.48.166",
    date: "2026-10-28",
    items: {
      ko: [
        "제천대성 더 어렵게: 모든 공격 범위 1.5배 (내려선 뒤엔 거기서 1.3배 더) · 체력 10%에 근두운에서 내려오면 체력이 가득 참",
        "대부분의 기술에 뒤따르는 공격: 수직 내려찍기(하늘에서 거대한 여의봉이 꽂히며 바위 파편 · 파동 · 양옆으로 갈라지는 땅) · 찌르기 끝 폭발과 파편 · 두 바퀴 휘두르기마다 흙더미 · X자 가운데 폭발 · 쏟아지는 여의봉 파편 · 여의봉 셋 던지기 · 땅 울림에 솟는 땅 · 뛰어 내려찍기·돌진·분신 파편 · 장풍·지르기·난타 뒤 기 주먹 · 꼬리 채찍 끝 폭발 · 번개 더 많이",
        "기술에 나오는 여의봉을 새로 그림: 금빛 기운 · 검붉은 쇠 봉에 빛 줄과 새긴 금 고리 · 가운데 금 띠 · 양 끝 골 진 금테와 빛나는 끝 · 예고 때 서서히 뻗어 나오고, 치는 순간 번쩍이며 속도선 · 돌리기는 잔상을 남기며 한 바퀴",
      ],
      en: [
        "The Great Sage is harder: every attack range ×1.5 (another ×1.3 after he dismounts) · when he dismounts at 10% health he returns to full health",
        "Most moves now have follow-ups: vertical slam (a giant staff plunges from the sky with rock shards · a shockwave · ground cracking to both sides) · thrusts explode with shards at the tip · each of two spins throws up debris · X cross center blast · raining-staff shards · three thrown staves · rising ground in the quake · shards after the leap, rush and clones · ki fists after the palm, jabs and barrage · tail lash tip blast · more lightning",
        "New staff art for his moves: golden aura · dark crimson iron with a highlight and engraved gold rings · gold middle band · ridged gold caps with glowing tips · it slowly extends during the warning, flashes with speed lines on impact, and spins leaving afterimages",
      ],
      ja: [
        "斉天大聖をより難しく: 全攻撃の範囲1.5倍（降りた後はさらに1.3倍）· 体力10%で觔斗雲から降りると体力が全快",
        "ほとんどの技に追撃: 垂直叩きつけ（空から巨大な如意棒が突き刺さり岩の破片 · 衝撃波 · 左右に裂ける地面）· 突きの先で爆発と破片 · 二回転の度に土砂 · X字の中央爆発 · 降り注ぐ如意棒の破片 · 如意棒三本投げ · 地鳴りで隆起する地面 · 跳び叩き・突進・分身の破片 · 掌風・突き・連打の後に気の拳 · 尾の鞭の先で爆発 · 雷を増量",
        "技で出る如意棒を描き直し: 金色の気 · 光の筋と刻まれた金の輪が入った暗赤色の鉄の棒 · 中央の金の帯 · 両端の溝のある金の口金と光る先端 · 予告中にゆっくり伸び、当たる瞬間に光ってスピード線 · 回転は残像を残して一回り",
      ],
    },
  },
  {
    version: "0.48.165",
    date: "2026-10-28",
    items: {
      ko: [
        "제천대성 그림을 새로: 원숭이 반신 (황금빛 털 · 하트 모양 얼굴과 큰 귀 · 금테와 붉은 보석 · 머리 위 깃털 둘 · 금빛 비늘 갑옷 · 붉은 망토와 전투 치마 · 금빛 장화 · 끝이 밝은 긴 꼬리) · 여의봉을 굵고 정교하게 (붉은 쇠 봉에 빛 줄 · 가운데 금 문양 띠 · 양 끝 세 줄 금테 마개)",
        "펑크 '광학 위장': 대시한 뒤 0.5초 무적 → 대시한 뒤 1.5초 안의 첫 공격이 기습 (피해 ×1.8) · 대시를 자주 써도 무적이 되지 않음",
      ],
      en: [
        "New art for the Great Sage: a monkey demigod (golden fur · heart-shaped face and big ears · golden circlet with a red gem · two plumes on his head · golden scale armor · red cape and battle skirt · golden boots · long tail with a light tip) · a thicker, finer staff (red iron rod with a highlight · golden patterned band in the middle · triple golden caps at both ends)",
        "Punk 'Optical Camo': 0.5s invulnerability after a dash → your first attack within 1.5s after a dash is an ambush (×1.8 damage) · frequent dashing no longer makes you invulnerable",
      ],
      ja: [
        "斉天大聖の絵を一新: 猿の半神（黄金色の毛 · ハート形の顔と大きな耳 · 赤い宝石の金の輪 · 頭上の羽根二本 · 金の鱗鎧 · 赤いマントと戦袴 · 金の長靴 · 先が明るい長い尻尾）· 如意棒を太く精巧に（光の筋が入った赤い鉄の棒 · 中央の金の文様帯 · 両端の三本線の金の口金）",
        "パンク「光学迷彩」: ダッシュ後0.5秒無敵 → ダッシュ後1.5秒以内の最初の攻撃が奇襲（ダメージ×1.8）· ダッシュを多用しても無敵にならない",
      ],
    },
  },
  {
    version: "0.48.164",
    date: "2026-10-28",
    items: {
      ko: [
        "시즌 2 마지막 라스트 보스 '제천대성' 미리 공개 (6층 클리어 뒤 도전 · 연습장, 세레스티아 맵): 근두운을 타고 여의봉을 든 반신 · 몸과 근두운이 따로 공격하는 2대1 · 공격 30가지 중 무작위 (변칙성이 핵심)",
        "몸 갈래 20가지 — 꼬리·주먹 10 (세 번 지르기 · 꼬리 한 바퀴·채찍 · 뛰어올라 내려찍기 · 장풍 · 여의봉으로 뒤를 막고 꼬리로 붙잡아 주먹 · 주먹 난타 · 분신 · 둘러싸기 · 돌진 올려치기) · 여의봉 10 (찌르기 · 한 바퀴 · 내려찍기 · 세 갈래 · 쏟아지는 여의봉 · 던지기 · X자 · 땅 울림 · 맵 전체 휘두르기 · 즉사기)",
        "맵 전체 휘두르기: 맵이 금빛으로 세 번 깜박인 다음 박자에 대시해야 피함 · \"제천대성이 여의봉을 크기를 최대한 늘립니다!\" 문구가 뜨면 즉사기 — 제천대성 몸 가까이(점선 원 안)에 붙어야 삶",
        "근두운 갈래 10가지 — 따라붙는 번개 · 둘레 번개 · 가로지르는 돌진 · 방 전체 번개비 · 둘러싸는 번개 · 들이받기 · 번개 줄기 · 지그재그 돌진 · 떨어지는 번개 · 전기 구슬",
        "체력 10%: 무적으로 근두운에서 내려와 체력 70%로 강해짐 (범위·피해 증가, 근두운은 따로 떠다니며 공격, 모든 공격이 터지기 직전 하얗게 깜박여 대시 시점을 알려 줌)",
      ],
      en: [
        "Season 2's last final boss preview, the Great Sage Equal to Heaven (challenge after clearing floor 6 · Practice, Celestia map): a demigod riding his cloud with his staff · his body and his cloud attack separately, like 2 vs 1 · picks at random from 30 attacks (unpredictability is the point)",
        "Body branch, 20 attacks — 10 tail and fist (triple jab · tail spin and lash · leaping slam · palm blast · staff wall behind you then tail grab and punch · fist barrage · clones · encircling tail · rushing uppercut) · 10 staff (thrust · spin · overhead slam · triple thrust · raining staves · thrown staff · X cross · ground quake · map-wide sweep · instant kill)",
        "Map-wide sweep: the map blinks gold three times, dash on the next beat · When \"The Great Sage stretches his staff to its utmost size!\" appears it is an instant kill — stay right next to him (inside the dotted circle) to survive",
        "Cloud branch, 10 attacks — homing bolts · bolts around you · crossing dash · room-wide lightning storm · encircling bolts · ramming · lightning beam · zigzag dash · falling lightning · electric orbs",
        "At 10% health he dismounts while invincible and comes back with 70% health, stronger (bigger, harder hits; the cloud floats and attacks on its own; every attack blinks white right before it lands to cue your dash)",
      ],
      ja: [
        "シーズン2最後のラストボス「斉天大聖」先行公開（6階クリア後の挑戦 · 練習場、セレスティアマップ）: 觔斗雲に乗り如意棒を持つ半神 · 体と觔斗雲が別々に攻撃する2対1 · 30種の攻撃からランダム（変則性が核心）",
        "体の系統20種 — 尾・拳10（三連突き · 尾の一回転・鞭 · 跳び上がって叩きつけ · 掌風 · 如意棒で背後を塞ぎ尾で捕まえて拳 · 拳の連打 · 分身 · 囲い込み · 突進アッパー）· 如意棒10（突き · 一回転 · 振り下ろし · 三方向 · 降り注ぐ如意棒 · 投げ · X字 · 地鳴り · マップ全体の薙ぎ払い · 即死技）",
        "マップ全体の薙ぎ払い: マップが金色に三回点滅した次の拍子にダッシュで回避 · 「斉天大聖が如意棒を最大まで伸ばします！」が出たら即死技 — 斉天大聖のすぐそば（点線の円の中）にいれば助かる",
        "觔斗雲の系統10種 — 追ってくる雷 · 周りの雷 · 横切る突進 · 部屋全体の雷雨 · 囲む雷 · 体当たり · 雷の筋 · ジグザグ突進 · 降ってくる雷 · 電気の玉",
        "体力10%で無敵になり觔斗雲から降り、体力70%で強化（範囲・ダメージ増加、觔斗雲は別に浮かんで攻撃、全攻撃が当たる直前に白く点滅してダッシュの合図）",
      ],
    },
  },
];
