import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.367",
    date: "2026-11-03",
    items: {
      ko: ["관리자 페이지: 다른 서버(시험 서버·라이브)의 지금 수치를 그대로 가져오는 버튼 (가져온 뒤 확인하고 저장)"],
      en: ["Admin page: a button to copy the current values from another server (test or live), then review and save"],
      ja: ["管理者ページ：別のサーバー（テスト・ライブ）の今の数値をそのまま取り込むボタン（取り込んだ後に確認して保存）"],
    },
  },
  {
    version: "0.48.366",
    date: "2026-11-03",
    items: {
      ko: [
        "처음 하는 사람을 위한 단계적 열기 (혼자 하기): 판을 끝낼 때마다 특별한 방이 하나씩 열림 — 1판 뒤 제단 → 2판 뒤 단련 → 3판 뒤 시련 → 4판 뒤 비밀의 방·차원의 순례자 (아직이면 전투방, 판 시작 때 다음에 열릴 방 안내)",
        "처음 만난 특별한 방은 '새로운 방!' 카드로 요약 두 줄 · '자세히'를 누르면 방 설명 창이 그 방으로 열림 (기기마다 방 종류당 한 번)",
        "화면 위에 지금 할 일 한 줄 (적 처치 → 문으로 다음 방 → 계단 등, 설정에서 끔)",
        "패시브 설명 맨 앞에 [공격]·[방어]·[이동]·[특수]·[보조] 꼬리표",
        "설정 '간단한 화면': 적의 위험 표시가 아닌 효과를 흐리게 · 처음 하는 기기는 간단한 화면 켜고 피해 숫자·능력치 칸 끈 채로 시작",
        "캐릭터 선택창: 난이도 별(★~★★★) · 쉬운 캐릭터는 '추천'으로 맨 앞",
        "단계적 열기 중인 판(처음 4판)은 레이드 기록에 들어가지 않음",
      ],
      en: [
        "Gradual unlocks for new players (solo): finishing runs opens special rooms one by one — Altar after 1 run → Training after 2 → Trial after 3 → Secret rooms & the Pilgrim after 4 (locked ones become combat rooms; the next unlock is shown at run start)",
        "The first time you meet a special room, a 'New room!' card gives a two-line summary · 'Details' opens the room guide on that room (once per room type per device)",
        "A one-line current goal at the top (clear enemies → walk to a door → take the stairs…, can be turned off in Settings)",
        "Passive descriptions now start with an [Attack]/[Defense]/[Move]/[Special]/[Utility] tag",
        "New 'Simple view' setting dims effects that aren't enemy warnings · new devices start with simple view on and damage numbers / stats panel off",
        "Character select: difficulty stars (★ to ★★★) · easy characters are marked 'Easy pick' and listed first",
        "Runs still under gradual unlocks (your first 4) don't count for the raid boards",
      ],
      ja: [
        "初めての人向けの段階的な解放（ひとりで遊ぶ）：1回遊び終えるたびに特別な部屋が1つずつ開く — 1回後に祭壇 → 2回後に鍛錬 → 3回後に試練 → 4回後に秘密の部屋・次元の巡礼者（まだなら戦闘部屋、開始時に次に開く部屋を案内）",
        "初めて出会った特別な部屋は「新しい部屋！」カードで2行の要約 · 「詳しく」で部屋の説明ウィンドウがその部屋で開く（端末ごとに部屋の種類1回）",
        "画面上に今やることを1行で表示（敵を倒す → 扉で次の部屋 → 階段など、設定でオフ可）",
        "パッシブの説明の先頭に[攻撃]・[防御]・[移動]・[特殊]・[補助]のタグ",
        "設定「シンプル画面」：敵の危険表示以外のエフェクトを薄く · 初めての端末はシンプル画面オン、ダメージ数字・ステータス欄オフで開始",
        "キャラクター選択：難易度の星（★〜★★★）· やさしいキャラは「おすすめ」で先頭に",
        "段階的な解放中の回（最初の4回）はレイドの記録に入らない",
      ],
    },
  },
  {
    version: "0.48.365",
    date: "2026-11-03",
    items: {
      ko: [
        "악마의 방: 거래를 하나 할 때마다 남은 거래가 최대 체력 20씩 더 비싸짐 (하나 하면 +20, 둘 하면 +40)",
        "시련의 방: 암흑·보스 다섯·끝없는 무리 시련 중 몬스터를 잡을 때마다 이동 속도가 1%씩 느려짐 (보스는 10%, 최대 절반까지, 시련이 끝나면 풀림)",
        "시련의 방: 시련 중에는 제단(성좌)에서 받은 증강 기술이 나가지 않음",
        "시련의 방: 시즌 3 새 몬스터(폭발풍뎅이·스켈레톤 궁병·쇠사슬 간수·하이오크)가 무리에 두 배로 자주 섞임",
      ],
      en: [
        "Devil's Room: each deal makes the remaining deals cost 20 more max HP (+20 after one, +40 after two)",
        "Trial Room: during the dark, five-boss and endless trials each kill slows you 1% (bosses 10%, down to half speed; resets when the trial ends)",
        "Trial Room: altar (constellation) augment skills are off during trials",
        "Trial Room: the new season 3 monsters (Bomb Beetle, Skeleton Archer, Chain Warden, High Orc) now show up twice as often in trial hordes",
      ],
      ja: [
        "悪魔の部屋：取引するたびに残りの取引が最大体力20ずつ高くなる（1つで+20、2つで+40）",
        "試練の部屋：暗闇・ボス5体・終わらない群れの試練中、倒すたびに移動速度が1%ずつ遅くなる（ボスは10%、最大半分まで、試練が終わると解除）",
        "試練の部屋：試練中は祭壇（星座）でもらった増強スキルが発動しない",
        "試練の部屋：シーズン3の新モンスター（爆発甲虫・スケルトン弓兵・鎖の看守・ハイオーク）が群れに2倍の頻度で混ざる",
      ],
    },
  },
  {
    version: "0.48.364",
    date: "2026-11-03",
    items: {
      ko: [
        "회복약: 최대 체력 35% → 체력 40 고정 회복 (명약은 그대로 전부 회복)",
        "악마의 방 거래: 바치는 최대 체력이 모두 +10 (40·55·55·40·50·45)",
        "컴퓨터에서는 자동 공격 없음: 좌클릭으로 조준·공격, 꾹 누르면 계속 공격 (모바일은 자동 공격 그대로)",
        "단련의 방: 미니게임 창에서 설명을 읽고 '시작하기'를 눌러야 시작",
        "차원의 순례자: 도감 한 칸마다 공격력 +2% → +5%, 공격 범위 +3% 새로 (사거리·베기·폭발·파동·자리 범위 모두) · 수집품 이펙트를 더 화려하게 (빛·충격파·문양·불똥)",
      ],
      en: [
        "Potion: heals a flat 40 HP instead of 35% max HP (Elixir still heals fully)",
        "Devil's Room deals: every deal costs 10 more max HP (40/55/55/40/50/45)",
        "No auto-attack on PC: left click to aim and attack, hold to keep attacking (mobile keeps auto-attack)",
        "Training Room: the minigame starts only after you read the rules and press Start",
        "Dimensional Pilgrim: each journal entry now gives +5% damage (was +2%) and a new +3% attack area (range, slashes, blasts, waves, zones) · flashier curio effects (glow, shockwaves, runes, sparks)",
      ],
      ja: [
        "回復薬：最大体力35% → 体力40固定回復（名薬はそのまま全回復）",
        "悪魔の部屋の取引：捧げる最大体力がすべて+10（40・55・55・40・50・45）",
        "PCではオートアタックなし：左クリックで照準・攻撃、長押しで連続攻撃（モバイルはオートアタックのまま）",
        "鍛錬の部屋：ミニゲームは説明を読んで「スタート」を押してから始まる",
        "次元の巡礼者：図鑑1マスごとの攻撃力 +2% → +5%、攻撃範囲 +3% を新たに（射程・斬撃・爆発・波動・設置範囲すべて）· 収集品のエフェクトをより派手に（光・衝撃波・紋様・火花）",
      ],
    },
  },
  {
    version: "0.48.363",
    date: "2026-11-03",
    items: {
      ko: ["수집가 검격 이펙트가 겹쳐 보이던 것 고침: 칼날을 한 줄로만 그림(잔상·바깥 빛 겹침 없앰) · 다음 공격이 나가면 앞 칼날은 바로 사라짐", "스켈레톤 궁병: 선이 굳은 뒤 레이저처럼 선 전체에 피해를 주던 것을 진짜 화살 한 발이 매우 빠르게 날아가는 것으로 바꿈 (선에서 비키면 안 맞음)"],
      en: ["Fixed the Collector's blade arcs looking stacked: each arc is now a single blade (no offset shadow or outer glow layer) · the previous arc vanishes as soon as the next attack starts", "Skeleton Archer: instead of a laser-like hit along the whole locked line, it now fires a single very fast arrow along that line (step off the line to dodge)"],
      ja: ["コレクターの斬撃エフェクトが重なって見えていたのを修正：刃を一本だけで描画（残像・外側の光の重なりを削除）· 次の攻撃が出ると前の刃はすぐ消える", "スケルトン弓兵：線が固まった後、レーザーのように線全体にダメージを与えていたのを、本物の矢が一本とても速く飛ぶように変更（線から外れれば当たらない）"],
    },
  },
];
