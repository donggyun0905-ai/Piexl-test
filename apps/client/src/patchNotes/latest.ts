import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.343",
    date: "2026-11-02",
    items: {
      ko: [
        "잔영 리메이크: 기본 공격은 짧은 단검 내려찍기 · 기본 치명타 45% · 순간이동·그림자·분신·뒤치기는 없앰",
        "잔영: 대시로 적 공격을 피하면(안 피했으면 맞았을 공격) 1.5초 슬로우모션 (적·적 탄만 느려지고 화면이 어두워짐) · 그 안에 직접 클릭(휴대폰은 화면을 새로 터치)하면 확정 치명타 3연속 큰 베기 (여러 적, 마지막은 몸 둘레 모두) → 슬로우모션 끝",
        "잔영 무기 10·전용 아이템 10을 새 방식에 맞게 다시 만듦 (섬영 2.5초·5연속, 회전 칼날 모두 몸 둘레, 월식 검은 달 터짐 등) · 효과를 새로 그림 (빛나는 초승달 검격·충격파·불똥)",
        "피해 숫자가 한 자리에 겹치지 않고 사방으로 흩뿌려지며 뜸",
        "단련의 방: 점수가 1000에 가까울수록 팔이 굵어지고 핏줄이 보임 (샌드백·랫풀다운에도 팔) · 미니게임 시작 호루라기와 운동 박자 소리 (맞힐수록 빨라짐)",
      ],
      en: [
        "Remnant remake: basic attack is now a short dagger stab · base crit 45% · blink, shadow, decoy and backstab removed",
        "Remnant: dash through an enemy attack that would have hit you for 1.5s of slow motion (only foes and their shots slow down, the screen darkens) · click yourself in it (new tap on phones) for 3 big sure-crit slashes (many foes, the last one all around) → slow motion ends",
        "Remnant's 10 weapons and 10 items reworked for the new style (Flash Shadow 2.5s and 5 slashes, Spinning Blades all around, Eclipse black-moon burst, etc.) · new effects (glowing crescent slashes, shockwaves, sparks)",
        "Damage numbers now scatter outward instead of stacking on one spot",
        "Training room: arms grow thicker with visible veins as your score nears 1000 (arms added to Sandbag and Lat Pulldown too) · minigame start whistle and workout beat (speeds up as you hit)",
      ],
      ja: [
        "残影リメイク: 通常攻撃は短い短剣の突き下ろし · 基本クリティカル45% · 瞬間移動・影・分身・背後斬りはなくした",
        "残影: 当たるはずの敵の攻撃をダッシュで避けると1.5秒スローモーション（敵と敵の弾だけ遅くなり画面が暗くなる）· その間に自分でクリック（スマホは画面を新しくタッチ）すると確定会心の大きな3連斬り（複数の敵、最後は全周）→ スローモーション終了",
        "残影の武器10・専用アイテム10を新しい方式に合わせて作り直し（閃影は2.5秒・5連、回転刃はすべて全周、月蝕は黒い月が弾けるなど）· エフェクトを新しく（光る三日月の斬撃・衝撃波・火花）",
        "ダメージ数字が一か所に重ならず四方に散らばって出る",
        "鍛錬の部屋: スコアが1000に近づくほど腕が太くなり血管が見える（サンドバッグ・ラットプルダウンにも腕）· ミニゲーム開始のホイッスルとトレーニングのリズム音（当てるほど速くなる）",
      ],
    },
  },
  {
    version: "0.48.342",
    date: "2026-11-02",
    items: {
      ko: [
        "관리자 '맵 만들기': 칸을 드래그로 칠해 던전 방 모양·광야의 새벽 맵·타워 디펜스 맵을 직접 만들고 서버에 저장 (벽·기둥·깊은 물·얕은 물·진흙·용암·가시 함정·미사일 타워·길·지킬 곳)",
        "만든 던전 방 모양은 혼자 하기(아레나·영웅의 길 빼고)의 전투방·강한 적 방에 섞여 나오고, 연습장 '방' 탭에서 바로 바꿔 볼 수 있음 (그 판은 레이드 기록 제외)",
        "만든 광야의 새벽·타워 디펜스 맵은 각 맵 고르기 화면에 나옴",
      ],
      en: [
        "Admin 'Map Maker': paint tiles by dragging to build dungeon room layouts, Dawn of the Wilds maps and Tower Defense maps, saved to the server (walls, pillars, deep water, shallow water, mud, lava, spike traps, missile towers, paths, goal)",
        "Custom room layouts mix into combat and elite rooms in solo runs (not Arena or Hero's Path) and can be tried in the practice 'Rooms' tab (such runs are not sent as raid records)",
        "Custom Dawn of the Wilds and Tower Defense maps appear on their map select screens",
      ],
      ja: [
        "管理者「マップ作り」: マスをドラッグで塗ってダンジョンの部屋の形・荒野の夜明けのマップ・タワーディフェンスのマップを作りサーバーに保存（壁・柱・深い水・浅い水・泥・溶岩・トゲ罠・ミサイル塔・道・守る場所）",
        "作った部屋の形はひとりで遊ぶ（アリーナ・英雄の道を除く）の戦闘部屋・強敵部屋に混ざって出て、練習場の「部屋」タブですぐ試せる（そのランはレイド記録の対象外）",
        "作った荒野の夜明け・タワーディフェンスのマップはそれぞれのマップ選択画面に出る",
      ],
    },
  },
  {
    version: "0.48.341",
    date: "2026-11-02",
    items: {
      ko: ["풋내기 20레벨 판금 옷을 새 그림으로 (빠져 있던 것)"],
      en: ["Novice Lv 20 plate outfit now uses the new art (it was missing)"],
      ja: ["見習いのLv20プレートの服を新しい絵に（抜けていたもの）"],
    },
  },
  {
    version: "0.48.340",
    date: "2026-11-02",
    items: {
      ko: ["풋내기: 레벨업 때 능력치 버튼이 게임 화면 위에 떠서 나옴 (게임 화면이 작아지지 않음)"],
      en: ["Novice: on level up, the stat buttons now float over the game view (the game view no longer shrinks)"],
      ja: ["新米: レベルアップ時の能力値ボタンがゲーム画面の上に浮かんで出る（ゲーム画面が小さくならない）"],
    },
  },
  {
    version: "0.48.339",
    date: "2026-11-02",
    items: {
      ko: [
        "단련의 방 효과 강화 점검: 333개 패시브 모두 효과 수치가 실제로 오르는 것 확인 · 1.4배 같은 배율은 1을 넘는 몫만 키움 (10단계 1.4배 → 1.8배) · 소환술사 유대의 방패가 거꾸로 약해지던 것 고침",
        "단련한 효과가 화면(폭발·범위 원 등)과 능력치 창에도 오른 크기로 보임",
      ],
      en: [
        "Training Room effect check: all 333 passives verified to actually improve · multipliers like ×1.4 now grow only the part above 1 (×1.4 → ×1.8 at level 10) · fixed Summoner's Bond Shield getting weaker instead of stronger",
        "Upgraded effects now also show at their boosted size on screen (blast and area rings, etc.) and in the stats panel",
      ],
      ja: [
        "鍛錬の部屋の効果強化を点検: 333個のパッシブ全部で効果の数値が実際に上がるのを確認 · ×1.4のような倍率は1を超える分だけ伸びる（10段階で×1.4 → ×1.8）· 召喚術師の絆の盾が逆に弱くなっていたのを修正",
        "鍛錬した効果が画面（爆発・範囲の輪など）と能力値画面でも上がった大きさで見える",
      ],
    },
  },
  {
    version: "0.48.338",
    date: "2026-11-02",
    items: {
      ko: [
        "단련의 방 효과 패시브: 공격력 대신 그 패시브의 효과 수치가 단계마다 10%씩 좋아짐 — 범위·피해·확률·회복·개수는 커지고, 재사용 대기·간격·지연·비용·받는 피해는 작아짐 (지속 시간·최대치·조건 수치는 그대로)",
        "단련 창에 효과 수치마다 '원래 → 지금 · 단계당 %'를 보여 줌 · 올릴 효과 수치가 없는 패시브는 단련 목록에 나오지 않음",
      ],
      en: [
        "Training Room effect passives: instead of damage, the passive's own effect numbers improve 10% per level — range, damage, chance, healing and counts go up; cooldown, interval, delay, cost and damage taken go down (durations, caps and conditions stay)",
        "The training window shows each effect number as 'base → now · per level %' · passives with nothing to improve no longer appear in the list",
      ],
      ja: [
        "鍛錬の部屋の効果パッシブ: 攻撃力の代わりにそのパッシブの効果の数値が1段階ごとに10%良くなる — 範囲・ダメージ・確率・回復・数は大きく、クールタイム・間隔・遅延・コスト・被ダメージは小さく（持続・上限・条件の数値はそのまま）",
        "鍛錬の画面に効果の数値ごとに「元 → 現在 · 1段階%」を表示 · 上げられる数値がないパッシブは鍛錬リストに出ない",
      ],
    },
  },
  {
    version: "0.48.337",
    date: "2026-11-02",
    items: {
      ko: ["맞지 않는 상태의 적(검은 잔영처럼 지켜보기만 하는 보스, 땅속·하늘에 있는 보스 등)을 캐릭터 공격이 노리던 것 고침: 격투가·원소술사 검·야수·악의 사도·기계공학자 연쇄·오니·오리 새끼·거너 드론·유도 탄·동료·고양이 펫 등이 맞을 수 있는 적만 노림"],
      en: ["Fixed attacks targeting enemies that can't be hit (like the watching Black Remnant, or bosses underground or in the sky): Brawler, Elementalist blades, Beast, Apostle, Engineer chains, Oni, ducklings, Gunner drones, homing shots, allies and cat pets now only aim at hittable enemies"],
      ja: ["当たらない状態の敵（見ているだけの黒い残影、地中・空中のボスなど）をキャラの攻撃が狙っていたのを修正: 格闘家・元素術師の剣・野獣・悪の使徒・機械工学者の連鎖・鬼・子アヒル・ガンナーのドローン・誘導弾・仲間・猫ペットなどが当たる敵だけを狙う"],
    },
  },
  {
    version: "0.48.336",
    date: "2026-11-02",
    items: {
      ko: ["멸망의 용 때릴 곳 표시를 더 옅게 (그림을 덜 가림)"],
      en: ["Dragon of Ruin hit marker made fainter (covers the art less)"],
      ja: ["滅びの竜の狙う場所の表示をより薄く（絵を隠しにくく）"],
    },
  },
  {
    version: "0.48.335",
    date: "2026-11-01",
    items: {
      ko: ["멸망의 용: 맞는 범위(몸통)에 은은한 주황 빛 원과 점선 표시 — 날개·꼬리는 맞지 않으니 표시된 곳을 때리면 됨"],
      en: ["Dragon of Ruin: a soft orange glow and dashed ring now mark its hitbox (torso) — wings and tail can't be hit, so aim inside the ring"],
      ja: ["滅びの竜: 当たり判定（胴体）にほのかなオレンジの光と点線の輪 — 翼・尾には当たらないので輪の中を狙えばいい"],
    },
  },
  {
    version: "0.48.334",
    date: "2026-11-01",
    items: {
      ko: ["라스트 보스 멸망의 용 새 그림 (시험): 위에서 본 모습 → 옆모습 · 걷기 2 · 숨 들이켜기 · 불길 · 몸통이 맞는 범위 가운데에"],
      en: ["New Dragon of Ruin art (trial): top-down → side view · two walk frames · inhaling · fire breath · torso centered on its hitbox"],
      ja: ["ラストボス滅びの竜の新しい絵（試験）: 上から見た姿 → 横向き · 歩き2 · 息を吸う · 炎 · 胴体が当たり判定の中央に"],
    },
  },
];
