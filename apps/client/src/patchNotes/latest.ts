import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.50.47",
    date: "2026-11-09",
    items: {
      ko: [
        "아스모데우스의 화신체 강화: 공격 범위가 넓어짐(베기·블랙홀·내려찍기·결정 창·고리·톱니 날·불꽃 담 등) · 보스 탄이 2배 크기 · 공격 사이가 짧아짐 · 블랙홀 4개",
        "욕망의 화신 새 패턴: 불꽃 꽃잎 회오리(돌아가는 다섯 갈래 탄) · 불꽃 감옥(내 둘레 세 변에 불꽃 담 → 안쪽이 터짐, 열린 쪽으로 빠져나가기)",
        "검은 해의 화신 새 패턴: 검은 별 비(방 곳곳과 내 자리에 차례로 떨어짐) · 교차 빛줄기(나를 지나는 십자 → 엑스자)",
        "강철 군주의 화신 새 패턴: 강철 돌진(예고선 끝으로 순식간에 돌진, 끝에서 고리 파동) · 붉은 칼날 폭풍(틈이 엇갈리는 칼날 고리 3번)",
      ],
      en: [
        "Avatar of Asmodeus buffed: wider attacks (slashes, black holes, slam, crystal spears, rings, saw blades, flame walls…) · boss bullets are twice as big · shorter gaps between attacks · 4 black holes",
        "Avatar of Desire new patterns: Petal Whirl (five spinning bullet streams) · Flame Cage (flame walls on three sides around you, then the inside explodes — escape through the open side)",
        "Avatar of the Black Sun new patterns: Black Star Rain (falls across the room and on you in turn) · Crossing Beams (a cross through you, then an X)",
        "Avatar of the Iron Lord new patterns: Iron Charge (dashes instantly along the warning line, ring wave at the end) · Blade Storm (three blade rings with staggered gaps)",
      ],
      ja: [
        "アスモデウスの化身体を強化：攻撃範囲が広く（斬撃・ブラックホール・叩きつけ・結晶の槍・リング・鋸刃・炎の壁など） · ボスの弾が2倍の大きさ · 攻撃の間隔が短く · ブラックホール4つ",
        "欲望の化身の新パターン：花びらの渦（回る5本の弾） · 炎の檻（自分の周り三辺に炎の壁 → 内側が爆発、開いた側から脱出）",
        "黒い太陽の化身の新パターン：黒い星の雨（部屋のあちこちと自分の位置に順に落ちる） · 交差する光（自分を通る十字 → X字）",
        "鋼鉄君主の化身の新パターン：鋼鉄の突進（予告線の先へ一瞬で突進、終点でリング波） · 紅い刃の嵐（隙間がずれる刃のリング3回）",
      ],
    },
  },
  {
    version: "0.50.46",
    date: "2026-11-09",
    items: {
      ko: [
        "로비 게임기 8종 화면을 전체화면으로: 창 대신 화면 전체 무대(게임마다 다른 조명·분위기), 내용이 화면에 맞게 최대 4배까지 커짐 · 위 막대에 브라우저 전체화면 버튼",
        "화질: 별사탕 상자·룬 블록이 커진 화면에 맞춰 선명하게 그려짐 (흐릿하던 문제 해결) · 별사탕은 반짝이는 입체 별, 룬 돌은 깎은 빗면·빛나는 룬 · 우물 벽돌",
        "트럼프 카드를 새로 그림: 숫자마다 실제 카드처럼 무늬 배치 · J·Q·K는 위아래 대칭 왕실 인물(왕관·보석 관·깃 모자) · 에이스 · 뒷면 문장 · 조커 게임도 같은 카드와 광대 조커",
        "카지노 꾸밈: 금액마다 색이 다른 카지노 칩 · 칩 더미 · 나무 테두리 펠트 테이블 · 이기면 동전·색종이가 쏟아지고 크게 이기면 '대박!'·'잭팟!'",
        "슬롯머신: 전구 간판(돌 때 달리고 이기면 번쩍) · 릴 3줄 창과 가운데 줄 · 옆 손잡이를 당겨도 돌아감 · 배당표 · 잭팟이면 기계가 흔들림",
        "주사위 대소: 3D 주사위가 굴러가며 빙글빙글 돌다가 나온 눈이 앞으로 · 숫자 타일: 상아 타일과 색 점",
      ],
      en: [
        "All 8 lobby arcade games are now full screen: a full-screen stage with its own lighting per game instead of a small window, content scales up to 4x to fit · fullscreen button in the top bar",
        "Sharper: Star Candy Box and Rune Drop now render at the enlarged size (no more blur) · glossy 3D candy stars, bevelled rune stones with glowing runes and a brick well",
        "Playing cards redrawn: real pip layouts for each number · mirrored royal figures for J, Q, K (crown, tiara, feathered cap) · aces · crest card backs · the Joker game uses the same cards plus a jester Joker",
        "Casino touches: colour-coded casino chips · chip stack · wood-rimmed felt tables · coins and confetti rain on a win, with 'BIG WIN!' and 'JACKPOT!' for large wins",
        "Slot machine: light-bulb marquee (chases while spinning, flashes on a win) · three-row reel window with a payline · pull the side lever to spin · paytable · the cabinet shakes on a jackpot",
        "Dice: 3D dice tumble and land with the rolled face forward · Number tiles: ivory tiles with colour dots",
      ],
      ja: [
        "ロビーのゲーム機8種を全画面に：小さなウィンドウではなく画面いっぱいのステージ（ゲームごとに照明と雰囲気）、内容は画面に合わせて最大4倍に拡大 · 上のバーにブラウザ全画面ボタン",
        "画質：星キャンディ箱・ルーンブロックが拡大後の大きさで鮮明に描かれる（ぼやけを解消） · つやのある立体的な星キャンディ、面取りした石と光るルーン · 井戸のレンガ",
        "トランプを描き直し：数字ごとに本物のカードのようなマーク配置 · J・Q・Kは上下対称の王族（王冠・ティアラ・羽根帽子） · エース · 紋章入りの裏面 · ジョーカーゲームも同じカードと道化のジョーカー",
        "カジノの演出：金額ごとに色の違うカジノチップ · チップの山 · 木枠のフェルトテーブル · 勝つとコインと紙吹雪、大勝ちで「大当たり！」「ジャックポット！」",
        "スロットマシン：電球の看板（回転中は流れ、勝つと点滅） · 3段のリール窓と中央ライン · 横のレバーを引いても回る · 配当表 · ジャックポットで筐体が揺れる",
        "サイコロ大小：3Dのサイコロが転がり、出た目が正面に · 数字タイル：象牙のタイルと色の点",
      ],
    },
  },
  {
    version: "0.50.45",
    date: "2026-11-09",
    items: {
      ko: [
        "시즌 3 라스트 보스 셋째 '아스모데우스의 화신체' (6층 클리어 뒤 도전 · 연습장): 체력 줄이 ×100 (한 줄 깎을 때마다 색이 바뀌고 ×99, ×98…), 체력 합 9600",
        "100~76줄 욕망의 화신: 보라 불꽃 베기(지나간 자리에 지나갈 수 없는 불꽃 담) · 벽에 두 번 튕기는 마창 · 따라오다 터지는 욕망의 구슬(불꽃 담을 지움) · 깜빡인 순서대로 날아오는 다섯 구슬 · 매혹의 눈(그 순간 보스 쪽으로 움직이면 끌려감) · 1.5초 전 내 자리를 따라오는 잔상 · 두 빛의 바닥(보스 불꽃과 같은 색 칸만 안전)",
        "75~51줄 검은 해의 화신: 3초 빨아들이고 내려찍기 · 블랙홀을 놓고 터뜨려 범위 + 탄막 · 단 하나의 빈자리(방 전체 공격, 아주 작은 빈자리만 안전) · 굶주린 미니 블랙홀(공격을 먹고 먹은 만큼 되돌려 난사 → 공격을 멈추세요) · 위·왼쪽·오른쪽 벽 5구역에서 떨어지는 보라 레이저",
        "50~0줄 강철 군주의 화신: 붉은 베기 2연 · 내 자리에서 퍼지는 붉은 고리 · 하늘 결정 창(꽂히면 잠깐 벽) · 강철의 몸(앞에서 맞는 피해 -90%, 등 뒤로 돌아야) · 톱니 날 고리 · 30줄·15줄 화신의 기억(두 빛의 바닥 + 레이저)",
        "변신할 때마다 궁극기 (시즌 3에서 이 보스만): 75줄 검은 해의 탄생(큰 블랙홀 · 나선 탄 · 보라 파동 3번) · 50줄 군주의 강림(결정 창 격자 · 조여 드는 톱니 고리에 맞춰 대시) · 10줄 욕망의 끝 뒤 지쳐 받는 피해 1.5배",
      ],
      en: [
        "Season 3's third final boss 'Avatar of Asmodeus' (challenge after clearing floor 6 · practice): 100 health bars (each bar you break changes color, ×99, ×98…), 9600 health in total",
        "Bars 100–76, Avatar of Desire: violet flame slash (leaves an impassable flame wall) · a lance that bounces off walls twice · a following orb of desire that bursts (and clears flame walls) · five orbs that fly in the order they blinked · Charming Eyes (moving toward the boss at that moment draws you in) · an afterimage that follows where you were 1.5s ago · two-tone floor (only tiles matching the boss's flame are safe)",
        "Bars 75–51, Avatar of the Black Sun: 3s of suction then a slam · black holes that burst into an area hit plus a bullet ring · the single safe spot (the whole room is hit except one tiny spot) · hungry mini black holes (they eat your attacks and fire back as much → stop attacking) · violet lasers from five zones on the top, left and right walls",
        "Bars 50–0, Avatar of the Iron Lord: double red slash · a red ring spreading from your spot · crystal spears from the sky (briefly become walls) · Iron Body (-90% damage from the front; get behind it) · a ring of saw blades · at 30 and 15 bars, Memories of the Avatar (two-tone floor + lasers)",
        "An ultimate at every transformation (only this Season 3 boss): bar 75 Birth of the Black Sun (huge black hole, spiral shots, three violet waves) · bar 50 Descent of the Lord (crystal spear grid, dash as the saw ring closes) · bar 10 End of Desire, then exhausted and takes 1.5x damage",
      ],
      ja: [
        "シーズン3三体目のラストボス「アスモデウスの化身」（6階クリア後に挑戦 · 練習場）：体力ゲージ×100（1本削るごとに色が変わり×99、×98…）、体力合計9600",
        "100～76本 欲望の化身：紫炎の斬撃（通れない炎の壁が残る） · 壁で2回跳ね返る魔槍 · 追いかけて弾ける欲望の玉（炎の壁を消す） · 点滅した順に飛んでくる五つの玉 · 魅了の眼（その瞬間ボスへ向かって動いていると引き寄せられる） · 1.5秒前の自分の位置を追う残像 · 二色の床（ボスの炎と同じ色のマスだけ安全）",
        "75～51本 黒い太陽の化身：3秒吸い込んで叩きつけ · ブラックホールを置いて弾けさせ範囲＋弾幕 · 唯一の安全地帯（部屋全体攻撃、ごく小さな空きだけ安全） · 飢えたミニブラックホール（攻撃を食べ、食べた分を撃ち返す → 攻撃をやめて） · 上・左・右の壁5区画から落ちる紫のレーザー",
        "50～0本 鋼鉄君主の化身：赤い斬撃2連 · 自分の位置から広がる赤い輪 · 天からの結晶の槍（刺さると少しの間壁になる） · 鋼鉄の体（正面からのダメージ-90%、背後へ回る） · 鋸刃の輪 · 30本・15本で化身の記憶（二色の床＋レーザー）",
        "変身のたびに必殺技（シーズン3でこのボスだけ）：75本 黒い太陽の誕生（巨大ブラックホール・螺旋弾・紫の波動3回） · 50本 君主の降臨（結晶の槍の格子・締まる鋸刃の輪に合わせてダッシュ） · 10本 欲望の終わりの後、疲れて被ダメージ1.5倍",
      ],
    },
  },
];
