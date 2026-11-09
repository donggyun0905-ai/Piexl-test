import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.51.5",
    date: "2026-11-10",
    items: {
      ko: [
        "레이드: 레이드 방에 들어가면 제한 시간 20분 (컷신 동안은 멈춤, 화면 위에 남은 시간 · 1분 남으면 빨강) · 시간이 다 되면 레이드 실패",
        "패왕전: 방 전체·맵 전체를 치는 공격(오닉스 칠보 광륜·보석, 매드퀸 일제사격 등)은 내 둘레 240 안 상대만 · 수풀·투명으로 안 보이는 상대는 맞지 않음 · 매드퀸 터렛·일제사격 포탄은 맵 아무 곳이 아니라 내 둘레에만 · 훅은 갈고리 밧줄을 탈 때 무적이 없어짐",
        "패왕전 시즌 3 캐릭터 밸런스 (AI 1대1로 기존 캐릭터와 승률이 비슷하게, 공격력·받는 피해): 약하게 — 오닉스·베아트리스·펜리르·레오·루나틱·이클립스·크루세이더·테일·라파엘·매드퀸·토르켄·미카엘라·블래스트·훅·세레나·실버불렛·가브리엘·인시전 / 강하게 — 오르카·헬피스트·시저스·네일러·웨이브·이안",
      ],
      en: [
        "Raid: a 20-minute time limit once you enter the raid room (paused during cutscenes; time left shown at the top, red under 1 minute) · the raid fails when time runs out",
        "Paewang: room-wide / map-wide attacks (Onyx's halo and gems, Mad Queen's full salvo, etc.) only reach foes within 240 of you · foes hidden in bushes or invisible aren't hit · Mad Queen's turrets and salvo shells land around you instead of anywhere on the map · Hook no longer becomes invulnerable while riding the grapple rope",
        "Paewang Season 3 balance (AI 1v1 win rates matched to older characters; damage and damage taken): weaker — Onyx, Beatrice, Fenrir, Leo, Lunatic, Eclipse, Crusader, Tail, Rafael, Mad Queen, Thorken, Michaela, Blast, Hook, Serena, Silver Bullet, Gabriel, Incision / stronger — Orca, Hellfist, Scissors, Nailer, Wave, Ian",
      ],
      ja: [
        "レイド: レイド部屋に入ると制限時間20分 (カットシーン中は止まる、画面上に残り時間 · 残り1分で赤) · 時間切れでレイド失敗",
        "覇王戦: 部屋全体・マップ全体を攻撃する技 (オニキスの光輪・宝石、マッドクイーンの一斉射撃など) は自分の周り240以内の相手だけ · 茂み・透明で見えない相手には当たらない · マッドクイーンのタレット・一斉射撃の砲弾はマップのどこかではなく自分の周りに · フックはフックのロープに乗る間の無敵がなくなった",
        "覇王戦 シーズン3キャラのバランス (AI 1対1で既存キャラと勝率が近くなるよう、攻撃力・被ダメージ): 弱く — オニキス・ベアトリス・フェンリル・レオ・ルナティック・エクリプス・クルセイダー・テイル・ラファエル・マッドクイーン・トルケン・ミカエラ・ブラスト・フック・セレナ・シルバーバレット・ガブリエル・インシジョン / 強く — オルカ・ヘルフィスト・シザーズ・ネイラー・ウェーブ・イアン",
      ],
    },
  },
  {
    version: "0.51.4",
    date: "2026-11-10",
    items: {
      ko: [
        "레이드 밸런스: 루시퍼 체력 1페이즈 88,000 · 2페이즈 160,000 · 석화의 기둥 25,000 · 절망의 검 50,000 · 기둥이 남아 있으면 루시퍼에게 피해가 들어가지 않음 · 검이 남아 있으면 받는 피해 -75% · 2페이즈 루시퍼 공격력 1.5배",
        "레이드 즉사 패턴 4가지 (대시로 못 피함, 화면 가운데에 할 일·남은 초·안전/위험 표시): 1페이즈 '석화의 시선'(루시퍼에게 등 돌리기) · '심판의 빛'(돌기둥 그림자 속으로) / 2페이즈 '영혼의 사슬'(묶인 짝 곁으로) · '왕좌의 품'(루시퍼 곁 초록 원으로)",
        "레이드 단련 포인트: 전용 패시브가 모자란 하나마다 +3 → +1 · AI 동료가 하늘 탄막에서 탄만 피하다 루시퍼에게 다가가지 못하던 것 고침",
      ],
      en: [
        "Raid balance: Lucifer HP 88,000 in phase 1 · 160,000 in phase 2 · petrified pillars 25,000 · swords of despair 50,000 · Lucifer is immune while pillars stand · takes 75% less damage while swords remain · hits 1.5× harder in phase 2",
        "4 raid deadly patterns (can't be dashed; the task, seconds left and SAFE/DANGER are shown mid-screen): phase 1 'Petrifying Gaze' (turn your back) · 'Judgment Light' (hide in a stone column's shadow) / phase 2 'Soul Chain' (stay by your chained partner) · 'Embrace of the Throne' (rush into the green circle around Lucifer)",
        "Raid gym points: +3 → +1 per missing exclusive passive · fixed AI allies only dodging shots in the sky phase and never closing in on Lucifer",
      ],
      ja: [
        "レイドバランス: ルシファー体力 フェーズ1 88,000 · フェーズ2 160,000 · 石化の柱 25,000 · 絶望の剣 50,000 · 柱が残っているとルシファーにダメージが通らない · 剣が残っていると被ダメージ-75% · フェーズ2のルシファー攻撃力1.5倍",
        "レイド即死パターン4種 (ダッシュでは避けられない、画面中央にやること・残り秒・安全/危険): フェーズ1「石化の視線」(背を向ける) · 「審判の光」(石柱の影へ) / フェーズ2「魂の鎖」(つながった相手のそばへ) · 「玉座の懐」(ルシファーのそばの緑の円へ)",
        "レイド鍛錬ポイント: 足りない専用パッシブ1個ごと +3 → +1 · AIの仲間が空の弾幕で弾を避けるだけでルシファーに近づかなかったのを修正",
      ],
    },
  },
  {
    version: "0.51.3",
    date: "2026-11-10",
    items: {
      ko: [
        "패왕전 쟁탈전·전쟁의 서막: 상대 캐릭터 처치를 도우면(이번 목숨에 때림) 처치 돈의 절반 · 경험치는 막타 친 사람 + 가까이 있던 같은 편 + 도운 사람이 나눠 받음 (아군 병사·포탑이 잡아도 근처면 받음 · 경험치 받는 범위 190 → 300)",
        "레이드: 내 위치 표시를 크게 (머리 위에 떠서 흔들리는 빛나는 초록 보석 표지 · 발밑 초록 원판과 퍼지는 고리) · AI와 바로 시작한 판에서도 보이게 고침",
      ],
      en: [
        "Paewang Divine Contest / Prelude to War: assisting a kill (hitting that enemy this life) pays half the kill gold · XP is split between the last hitter, nearby allies and assisters (you still get it when allied minions/towers take the kill · XP range 190 → 300)",
        "Raid: much bigger 'you are here' marker (a glowing green gem bobbing over your head · green disc and spreading ring under your feet) · now also shown in AI-only runs",
      ],
      ja: [
        "覇王戦 争奪戦・戦争の序幕: 相手キャラの撃破を手伝うと (この命の間に攻撃) 撃破ゴールドの半分 · 経験値はラストヒット・近くの味方・アシストした人で分け合う (味方の兵士・砲台が倒しても近くなら入る · 経験値範囲 190 → 300)",
        "レイド: 自分の位置表示を大きく (頭上に浮かんで揺れる光る緑の宝石 · 足元に緑の円盤と広がる輪) · AIとすぐ始めた試合でも表示されるように修正",
      ],
    },
  },
  {
    version: "0.51.2",
    date: "2026-11-10",
    items: {
      ko: [
        "레이드 준비: 준비 방을 왼쪽 출구로 앞 방에 돌아갈 수 있음 · 성좌는 다른 제단에서 F로 대가 없이 바꿈 · 대장간 '처음부터 다시'(999원, 3번) · 단련 포인트 '−'로 되돌리기 · 무장실 사용 아이템이 사라지지 않고 바꿔 들기 · 단련의 방 오른쪽에 샌드백(딜 시험)",
        "레이드 단련 포인트: 전용 패시브가 30개보다 적은 캐릭터는 모자란 하나마다 +3 · 풋내기는 레벨 30(스탯 포인트 29)으로 시작 · 변희는 동물 능력 30개를 모두 가짐",
        "레이드 사용 아이템: 써도 사라지지 않고 쿨타임 (회복약 10초 · 영약 1분 · 보호막 15초 · 얼음 세계 1분 · 폭탄 10초, 폭탄 피해 크게) · 칸에 남은 초 표시",
        "레이드 방: 루시퍼에 맞는 흑요석 바닥·빛나는 금·의식 고리·화로·깃발 · 숨는 돌기둥 8개 (옆에 붙으면 루시퍼 공격을 막아 줌 · 6번 막으면 부서지고 20초 뒤 다시 생김)",
        "레이드 루시퍼: 처음부터 보호막 · 석화의 기둥·절망의 검이 남아 있으면 받는 피해 -25% · 보호막 빛 방울이 잘 보이게 · 기둥·검·몬스터 머리 위 체력 줄 · 기둥·검이 밀리지 않음",
        "레이드 타격감: 맞으면 흔들리고 부풀며 하얗게 번쩍 · 피해 숫자·맞는 불꽃 2배 크게 · 루시퍼 기술마다 크고 길게 울리는 웅장한 소리 · 큰 기술은 화면이 살짝 흔들림",
        "레이드 화면: 내 캐릭터 머리 위 화살표·발밑 고리 · 위험 알림(검기! 등) 3배 크게 · 진영 특징(게이지·창) 끔 · 게임 중 ⚙ 버튼(P)으로 설정(이펙트 진하기) 열기 (게임은 멈추지 않음)",
        "레이드 관전: 휠 버튼 끌기(모바일 두 손가락)로 화면 이동 · 쓰러져 있는 동안 오른쪽에 실시간 기록(준 피해·회복 등) · 보상 방에 싸움 효과가 남지 않게 · 받침대·금테로 다듬음",
      ],
      en: [
        "Raid prep: go back to the previous room through the left exit · F at another altar swaps your constellation for free · Forge 'Start over' (999 gold, 3 times) · undo gym points with '−' · armory items no longer vanish, step on one to swap · sandbag in the training room for damage tests",
        "Raid gym points: characters with fewer than 30 exclusive passives get +3 per missing one · Novice starts at level 30 (29 stat points) · Byeonhui gets all 30 animal abilities",
        "Raid usable items: no longer consumed, they have cooldowns (potion 10s · elixir 1min · shield 15s · ice world 1min · bomb 10s with much higher damage) · seconds left shown on the slot",
        "Raid room: obsidian floor, glowing cracks, ritual rings, braziers and banners fit for Lucifer · 8 stone columns to hide behind (they block Lucifer's attacks; break after 6 blocks and return 20s later)",
        "Lucifer: shielded from the start · takes 25% less damage while petrified pillars / swords of despair remain · clearer shield bubble · health bars above pillars, swords and adds · pillars and swords can no longer be pushed",
        "Raid hit feel: foes shake, swell and flash white when hit · damage numbers and hit sparks twice as big · big, long, grand sounds for every Lucifer skill · big skills lightly shake the screen",
        "Raid screen: arrow above your head and ring under your feet · danger alerts (Sword wave! etc.) 3× bigger · faction traits (gauges/windows) off · ⚙ button (P) opens settings (effect opacity) mid-game without pausing",
        "Raid spectating: drag with the wheel button (two fingers on mobile) to move the view · live stats (damage, healing…) on the right while you're down · fight effects no longer linger in the reward room · polished with a pedestal and gold trim",
      ],
      ja: [
        "レイド準備: 左の出口で前の部屋に戻れる · 別の祭壇でFを押すと星座を無償で交換 · 鍛冶場「最初からやり直す」(999ゴールド・3回) · 鍛錬ポイントを「−」で戻す · 武装室の使用アイテムが消えず持ち替え · 鍛錬の間の右にサンドバッグ (火力テスト)",
        "レイド鍛錬ポイント: 専用パッシブが30個より少ないキャラは足りない1個ごとに+3 · 新米はレベル30 (ステータスポイント29) で開始 · ビョンヒは動物能力30個をすべて所持",
        "レイド使用アイテム: 使ってもなくならずクールタイム (回復薬10秒 · 霊薬1分 · シールド15秒 · 氷の世界1分 · 爆弾10秒・爆弾ダメージ大幅アップ) · スロットに残り秒数",
        "レイド部屋: ルシファーにふさわしい黒曜石の床・光る亀裂・儀式の輪・火鉢・旗 · 隠れられる石柱8本 (そばにいるとルシファーの攻撃を防ぐ · 6回防ぐと壊れ20秒後に復活)",
        "ルシファー: 最初からシールド · 石化の柱・絶望の剣が残っている間は被ダメージ-25% · シールドの光の泡を見やすく · 柱・剣・モンスターの頭上に体力ゲージ · 柱・剣が押されなくなった",
        "レイドの打撃感: 当たると揺れて膨らみ白く光る · ダメージ数字・ヒットの火花を2倍の大きさに · ルシファーの技ごとに大きく長く響く壮大な音 · 大技は画面が軽く揺れる",
        "レイド画面: 自分のキャラの頭上に矢印・足元に輪 · 危険通知 (剣気! など) を3倍の大きさに · 陣営特徴 (ゲージ・ウィンドウ) をオフ · ゲーム中も⚙ボタン (P) で設定 (エフェクトの濃さ) を開ける (ゲームは止まらない)",
        "レイド観戦: ホイールボタンでドラッグ (モバイルは二本指) して画面移動 · 倒れている間は右にリアルタイム記録 (与ダメージ・回復など) · 報酬の間に戦闘エフェクトが残らないように · 台座と金縁で整えた",
      ],
    },
  },
];
