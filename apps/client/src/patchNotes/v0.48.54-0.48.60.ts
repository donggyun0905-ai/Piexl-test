import type { PatchNote } from "./types";

// 지난 기록 (0.48.54~0.48.60)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.60",
    date: "2026-10-23",
    items: {
      ko: [
        "이무기 밸런스: 풍룡 폭풍 0.1초마다 3% → 2% · 화룡점정 번개마다 적 최대 체력 2% → 1.5% · 토룡 보호막 최대 20 → 30",
        "여의주 번개를 하늘색으로 · 화룡점정이면 연한 파랑 위주에 흰 속빛, 세 줄기 번개와 하늘에서 내리꽂는 빛기둥·큰 고리로 더 웅장하게",
      ],
      en: [
        "Imugi balance: Gale Dragon storm 3% → 2% every 0.1s · The Dragon's Eye bolts 2% → 1.5% of max HP · Earth Dragon shield cap 20 → 30",
        "Dragon Pearl lightning is now sky blue · with The Dragon's Eye it turns pale blue with a white core: three bolts, a pillar of light from the sky and wide rings",
      ],
      ja: [
        "イムギのバランス：風龍の嵐 0.1秒ごとに3% → 2% · 画竜点睛の雷ごとの最大体力 2% → 1.5% · 土龍のシールド上限 20 → 30",
        "如意宝珠の雷を空色に · 画竜点睛なら淡い青に白い芯、3本の稲妻と空から降る光の柱・大きな輪でより壮大に",
      ],
    },
  },
  {
    version: "0.48.59",
    date: "2026-10-23",
    items: {
      ko: ["이무기: 용을 부를 때마다 이번 판 내내 치명타 확률 +15% (치명타 1.5배, 최대 72%) · 콤보가 다시 시작돼도 몸 둘레를 도는 작은 여의주 빛(부른 수만큼)과 은은한 발밑 빛이 영구히 남음 · 왼쪽 위에 'CRIT 45%' 표시"],
      en: ["Imugi: each dragon summon permanently adds +15% crit chance for the run (crits deal 1.5x, up to 72%) · even after the combo restarts, small pearl lights (one per summon) circle your body with a faint glow underfoot · 'CRIT 45%' shown at the top left"],
      ja: ["イムギ：龍を呼ぶたびにこのランの間ずっとクリティカル率+15%（クリティカル1.5倍、最大72%）· コンボが再開しても体の周りを回る小さな如意宝珠の光（呼んだ数だけ）と足元の淡い光が永久に残る · 左上に「CRIT 45%」表示"],
    },
  },
  {
    version: "0.48.58",
    date: "2026-10-23",
    items: {
      ko: [
        "이무기 전용 아이템 '화룡점정' 추가: 콤보를 버리고 이무기로서 완벽해짐 (여의주를 물고 있어야 합니다!) · 번개 공격 속도 +45% · 번개마다 적 최대 체력의 2% 더 (보스는 1/5 기준)",
        "여의주·청룡 번개를 새로 그림: 들쭉날쭉한 굵은 번개 줄기와 곁가지, 땅에 닿는 섬광·불꽃 (화룡점정이면 두 줄기로 더 크게) · 여의주를 들면 왼쪽 위 COMBO 표시를 숨김",
      ],
      en: [
        "New Imugi item 'The Dragon's Eye': cast aside the combo and become a perfect Imugi (you must hold the Dragon Pearl!) · +45% lightning attack speed · each bolt also deals 2% of the foe's max HP (1/5 for bosses)",
        "Redrew the Dragon Pearl and Azure Dragon lightning: thick jagged bolts with branches and a ground flash with sparks (two bigger bolts with The Dragon's Eye) · the top-left COMBO is hidden while holding the Dragon Pearl",
      ],
      ja: [
        "イムギ専用アイテム「画竜点睛」追加：コンボを捨てイムギとして完璧になる（如意宝珠をくわえていなければなりません！）· 雷の攻撃速度+45% · 雷ごとに敵の最大体力の2%追加（ボスは1/5基準）",
        "如意宝珠・青龍の雷を描き直し：ぎざぎざの太い稲妻と枝分かれ、地面に当たる閃光・火花（画竜点睛なら2本でより大きく）· 如意宝珠を持つと左上のCOMBO表示を隠す",
      ],
    },
  },
  {
    version: "0.48.57",
    date: "2026-10-23",
    items: {
      ko: ["이무기: 콤보 108의 용이 지나갈 때 공격력 450%에 더해 적 최대 체력의 20% 피해 (보스는 최대 체력의 1/5 기준)"],
      en: ["Imugi: the combo-108 dragon now also deals 20% of the foe's max HP on top of 450% damage (bosses use 1/5 of max HP)"],
      ja: ["イムギ：コンボ108の龍が通り過ぎる時、攻撃力450%に加えて敵の最大体力の20%ダメージ（ボスは最大体力の1/5基準）"],
    },
  },
  {
    version: "0.48.56",
    date: "2026-10-23",
    items: {
      ko: [
        "이무기: 용이 되는 콤보 100 → 108, 오라 50 → 72 · 72에 용의 기운이 몸에서 차오르는 효과 · 108에 빛기둥과 충격파와 함께 '용이 됨' — 거대한 용이 맵을 지나가고, 8초 동안 오라보다 강한 몸(공격력 +45%·공격 속도 +45%·이동 +0.3·체력 +40·보호막 40)과 몸을 감아 도는 용 기운",
        "이무기 콤보는 머리 위 대신 화면 왼쪽 위에 '35 COMBO'로 크게 표시 (108에 가까울수록 붉게, 72 표시 막대·용이 된 남은 초)",
      ],
      en: [
        "Imugi: becoming the dragon now takes 108 combo (was 100) and the aura starts at 72 (was 50) · At 72 dragon energy surges up from your body · At 108 you become the dragon with a pillar of light and shockwave — a giant dragon sweeps the map and for 8s your body is stronger than the aura (+45% damage, +45% attack speed, +0.3 move, +40 HP, 40 shield) wrapped in coiling dragon energy",
        "Imugi combo is now shown large at the top-left of the screen as '35 COMBO' (redder as it nears 108, with a bar marking 72 and the dragon form's remaining seconds)",
      ],
      ja: [
        "イムギ：龍になるコンボ100 → 108、オーラ50 → 72 · 72で龍の気が体から満ちる演出 · 108で光の柱と衝撃波とともに「龍になる」— 巨大な龍がマップを通り抜け、8秒間オーラより強い体（攻撃力+45%・攻撃速度+45%・移動+0.3・体力+40・シールド40）と体を巻く龍の気",
        "イムギのコンボは頭上ではなく画面左上に「35 COMBO」と大きく表示（108に近いほど赤く、72の目印付きバー・龍の残り秒数）",
      ],
    },
  },
  {
    version: "0.48.55",
    date: "2026-10-23",
    items: {
      ko: ["이무기 그림: 턱 밑이 회색으로 어두워져 수염처럼 보이던 것을 고침 (앞·옆 모습, 모든 스킨)"],
      en: ["Imugi art: fixed the grey shading under the chin that looked like a beard (front and side, all skins)"],
      ja: ["イムギの絵：あごの下が灰色に暗くなりひげのように見えていたのを修正（正面・横、全スキン）"],
    },
  },
  {
    version: "0.48.54",
    date: "2026-10-23",
    items: {
      ko: ["이무기 그림: 얼굴을 더 갸름하게 (볼 옆을 머리카락으로 덮고 턱을 좁힘) · 뿔을 뿌리가 굵고 뒤로 휘어 솟는 진짜 용 뿔로 (기본·테마·한정 스킨 모두)"],
      en: ["Imugi art: a slimmer face (hair covers the cheeks, narrower chin) · horns redrawn as thick, swept-back dragon horns (base, theme and limited skins)"],
      ja: ["イムギの絵：顔をよりほっそりと（頬を髪で覆いあごを細く）· 角を根元が太く後ろへ反って伸びる本物の龍の角に（基本・テーマ・限定スキンすべて）"],
    },
  },
];
