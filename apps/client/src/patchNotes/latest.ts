import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
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
  {
    version: "0.48.163",
    date: "2026-10-28",
    items: {
      ko: ["패왕전: 준비방에서는 캐릭터 전용 패시브 5개만 고르고, 공용 패시브 5개는 전투에 나갈 때 무작위로 받음 (AI도 같은 규칙) · 자동 공격 없이 직접 조준해 공격 (자동 공격 버튼·R 키 없음)"],
      en: ["Champion Battle: in preparation you pick only 5 character passives; 5 common passives are given at random when the battle starts (same for AI) · No auto-attack, you aim and attack yourself (no auto-attack button or R key)"],
      ja: ["覇王戦: 準備部屋ではキャラ専用パッシブ5個だけ選び、共通パッシブ5個は戦闘開始時にランダムで付与（AIも同じ）· オートアタックなし、自分で照準して攻撃（オートアタックボタン・Rキーなし）"],
    },
  },
  {
    version: "0.48.162",
    date: "2026-10-28",
    items: {
      ko: [
        "시즌 2 라스트 보스 '괴력난신' 미리 공개 (6층 클리어 뒤 도전 · 연습장, 아르테의 태산 맵): 거인만 한 반신이 맨주먹으로 사람처럼 1대1 — 거리를 재며 옆으로 돌고, 거대한 부채꼴 주먹 파동 · 연달아 터지는 폭발 · 원형 파동 · 돌진 콤보 · 이따금 2초 무적으로 사방에 기 주먹 100발 · 체력이 적을수록 공격이 빨라짐",
        "괴력난신 근접 콤보는 앞으로만 (뒤로 피해도 끝까지 앞으로) · 넓은 공격 중 붙어 있으면 콤보도 같이",
        "괴력난신 필살기 셋 (그동안 무적): 70% 플레이어 등 뒤로 순간이동해 넓은 콤보 (보스 뒤로 대시하면 피함) · 50% 주먹에 붉은 기를 두르고 아주 빠르게 쫓아오며 계속 콤보 · 10% 원기옥을 세 번 내리꽂음 — 맵이 노랗게 세 번 깜박인 다음 박자에 정확히 대시해야 피함, 세 번 다 피하면 3초 그로기",
        "검은 잔영: 되살린 검은 짐승 셋은 체력(과 전갈 보호막)이 절반",
      ],
      en: [
        "Season 2 final boss preview, the Demigod of Wild Might (challenge after clearing floor 6 · Practice, Mount Arte map): a giant-sized demigod fighting one-on-one with bare fists like a real player — circles and keeps its distance, huge fan-shaped fist waves · chained explosions · ring waves · lunge combos · now and then 2s of invincibility firing 100 ki fists in all directions · attacks speed up as its health drops",
        "Its melee combo only goes forward (dodging behind it doesn't turn it) · if you stay close during a wide attack it combos at the same time",
        "Three ultimates (invincible meanwhile): 70% teleports behind you for a wide combo (dash past its back) · 50% fists wrapped in red ki, chasing you very fast with nonstop combos · 10% slams a giant spirit bomb three times — the whole map blinks yellow three times and you must dash exactly on the next beat; dodge all three and it is stunned for 3s",
        "Black Remnant: the revived black beasts come back with half health (and half the scorpion's barrier)",
      ],
      ja: [
        "シーズン2ラストボス「怪力乱神」先行公開（6階クリア後の挑戦 · 練習場、アルテの泰山マップ）: 巨人ほどの半神が素手で人のように一対一 — 間合いを測って横に回り、巨大な扇形の拳の波動 · 連続爆発 · 円形の波動 · 突進コンボ · 時々2秒無敵で全方向に気の拳100発 · 体力が減るほど攻撃が速くなる",
        "近接コンボは前にだけ（後ろへ避けても最後まで前へ）· 広い攻撃中に近くにいるとコンボも同時に",
        "必殺技三つ（その間は無敵）: 70% プレイヤーの背後に瞬間移動して広いコンボ（ボスの後ろへダッシュで回避）· 50% 拳に赤い気をまとい非常に速く追いかけ連続コンボ · 10% 元気玉を三回叩きつける — マップが黄色く三回点滅した次の拍子に正確にダッシュで回避、三回とも避けると3秒グロッキー",
        "黒き残影: 蘇った黒い獣三体は体力（とサソリのバリア）が半分",
      ],
    },
  },
  {
    version: "0.48.161",
    date: "2026-10-28",
    items: {
      ko: [
        "검은 잔영 2단계: 짐승 셋을 다 잡으면 \"……아직이다. 일어나라.\" 하고 셋을 검은 모습(검은 몸 · 흰 이빨·부리·독침 · 붉은 눈)으로 되살림 · 필살기는 다시 쓰지 않지만 공격 주기가 더 빠름 · 체력 막대는 보라색 · 되살린 셋도 다 잡아야 클리어",
        "추적자: 1 암습 저격을 일찍 끝내면 남은 시간만큼 대기가 줄어듦 · 1·2·3 스킬을 서로 쓰는 도중에도 같이 쓸 수 있음",
      ],
      en: [
        "Black Remnant phase 2: once all three beasts fall it says \"...Not yet. Rise.\" and revives them in black (black bodies · white teeth, beak and stinger · red eyes) · no ultimates this time, but they attack more often · purple health bars · you must beat the revived three to clear",
        "Tracker: ending Ambush Snipe early shortens its cooldown by the time left · skills 1, 2 and 3 can now be used while another is active",
      ],
      ja: [
        "黒き残影の第2段階: 獣三体を倒すと「……まだだ。起きろ。」と黒い姿（黒い体 · 白い牙・くちばし・毒針 · 赤い目）で三体を蘇らせる · 必殺技は使わないが攻撃の間隔が短い · 体力バーは紫 · 蘇った三体も倒すとクリア",
        "追跡者: 暗襲狙撃を早く終えると残り時間分だけ待ち時間が短くなる · スキル1・2・3を他のスキルの使用中でも同時に使える",
      ],
    },
  },
  {
    version: "0.48.160",
    date: "2026-10-28",
    items: {
      ko: ["연습장 적 부르기: 라스트 보스 묶음의 검은 잔영 버튼에 이름이 안 보이던 문제 고침"],
      en: ["Practice enemy spawner: fixed the missing name on the Black Remnant button in the final boss group"],
      ja: ["練習場の敵呼び出し: ラストボスの黒き残影ボタンに名前が出ない問題を修正"],
    },
  },
];
