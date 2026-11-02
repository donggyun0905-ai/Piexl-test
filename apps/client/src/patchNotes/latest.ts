import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.345",
    date: "2026-11-02",
    items: {
      ko: [
        "새 방 '제단의 방' (3층부터 층마다 하나, 푸른 바다 같은 방): 성좌 여덟 중 하나가 방을 감쌀 만큼 크게 떠 있고, 방 색·떠도는 것·음악이 성좌마다 다름",
        "성좌: 바다(흰수염고래) · 화산(용암 거북) · 하늘(천둥 매) · 바람(세실리아) · 빛과 어둠(시온) · 그린우드(실베스타) · 일곱 갈래의 마녀(세티아) · 알 수 없는 성좌(???)",
        "제단 앞 F → 긴 카드 셋: 거래(성좌마다 주고 받는 능력치) · 증강(무작위 패시브 둘을 바치고 남은 패시브 하나에 광야의 새벽 각성 기술 둘을 새김, 그 패시브를 가진 동안 늘 발동) · 무시(30%로 성좌가 노해 능력치나 패시브 둘을 가져감)",
        "카드를 고르기 전에는 방을 나갈 수 없음 (잠긴 출구도 못 지남) · 연습장 '방' 탭에서 제단의 방 시험 가능",
      ],
      en: [
        "New room 'Altar Room' (one per floor from floor 3, sea-blue): one of eight constellations looms large enough to wrap the room, with its own colors, drifting motes and music",
        "Constellations: Sea (Blue Whale) · Volcano (Lava Tortoise) · Sky (Thunder Hawk) · Wind (Cecilia) · Light and Dark (Sion) · Greenwood (Sylvester) · Witch of the Seven Paths (Setia) · Unknown (???)",
        "Press F at the altar → three tall cards: Bargain (a stat trade per constellation) · Augment (offer 2 random passives; the remaining one gains 2 Dawn of the Wilds awakened skills that fire while you hold it) · Ignore (30% chance the constellation takes stats or 2 passives)",
        "You can't leave until you choose (locked exits too) · try it from the practice 'Rooms' tab",
      ],
      ja: [
        "新しい部屋「祭壇の部屋」（3階から各階に一つ、海のような青い部屋）：8つの星座のどれかが部屋を包むほど大きく浮かび、部屋の色・漂うもの・音楽が星座ごとに違う",
        "星座：海（シロナガスクジラ）· 火山（溶岩亀）· 空（雷鷹）· 風（セシリア）· 光と闇（シオン）· グリーンウッド（シルベスタ）· 七筋の魔女（セティア）· 知られざる星座（???）",
        "祭壇の前でF → 縦長のカード3枚：取引（星座ごとの能力値の交換）· 増強（ランダムなパッシブ2つを捧げ、残ったパッシブ1つに荒野の夜明けの覚醒技2つを刻む。そのパッシブを持つ間ずっと発動）· 無視（30%で星座が怒り能力値かパッシブ2つを奪う）",
        "カードを選ぶまで部屋を出られない（鍵のかかった出口も通れない）· 練習場「部屋」タブで試せる",
      ],
    },
  },
  {
    version: "0.48.344",
    date: "2026-11-02",
    items: {
      ko: [
        "새 방 '시련의 방' (4층부터 층마다 하나, 새빨간 방): 가운데 거대한 비석에서 F → 시련을 시작하겠습니까? YES/NO",
        "NO: 비석이 하나를 빼앗음 (최대 체력 20% · 공격력 3 · 공격 속도 10% · 사거리 6 · 무기 · 패시브 1 · 사용 아이템 2 · 이번 층 암흑 · 이번 층 체력 1 · 이동 속도 0.3 중 하나)",
        "YES: 시련 하나 (암흑 속 무리 10% · 체력 1로 무리 5% · 보스 셋 20% · 끝없는 무리 65%). 앞의 셋은 이기면 1000점, 쓰러지면 끝 · 끝없는 무리는 처치마다 점수, 쓰러져도 죽지 않음 (700점부터 매우 어려워짐)",
        "점수 100점마다 보상이 커지고, 비석에서 상자가 쏟아짐 (능력치 10% · 고르는 능력치·패시브·사용 아이템 · 무작위 패시브 · 900점부터 체력 가득 되살아남 1회). 상자는 다가가 F",
        "비석이 깨어나는 웅장한 소리·붉고 검은 효과, 시련 중에는 웅장한 시련 곡 · 연습장 '방' 탭에서 시련의 방을 불러 시험 가능",
      ],
      en: [
        "New room 'Trial Room' (one per floor from floor 4, blood-red): press F at the giant monolith → Will you begin the trial? YES/NO",
        "NO: the monolith takes one thing (20% max HP · 3 damage · 10% attack speed · 6 range · your weapon · 1 passive · 2 items · darkness for this floor · 1 HP for this floor · 0.3 move speed)",
        "YES: one trial (horde in darkness 10% · horde at 1 HP 5% · three bosses 20% · endless horde 65%). The first three give 1000 points if you win and end the run if you fall · the endless horde scores per kill and falling won't kill you (very hard past 700)",
        "Rewards grow every 100 points and pour out of the monolith as chests (stat +10% · stat/passive/item of your choice · random passives · a full-HP revive from 900). Walk up and press F",
        "Grand sound and red-black effects as the monolith wakes, a grand trial theme during the trial · try it from the practice 'Rooms' tab",
      ],
      ja: [
        "新しい部屋「試練の部屋」（4階から各階に一つ、真っ赤な部屋）：中央の巨大な石碑でF → 試練を始めますか？ YES/NO",
        "NO：石碑が一つ奪う（最大体力20% · 攻撃力3 · 攻撃速度10% · 射程6 · 武器 · パッシブ1 · 使用アイテム2 · この階は暗黒 · この階は体力1 · 移動速度0.3のどれか）",
        "YES：試練一つ（暗黒の群れ10% · 体力1の群れ5% · ボス三体20% · 果てなき群れ65%）。前の三つは勝てば1000点、倒れたら終わり · 果てなき群れは倒すごとに点数、倒れても死なない（700点から非常に難しい）",
        "100点ごとに報酬が大きくなり、石碑から箱があふれ出る（能力値10% · 選べる能力値・パッシブ・使用アイテム · ランダムパッシブ · 900点から体力満タン復活1回）。近づいてF",
        "石碑が目覚める荘厳な音と赤黒いエフェクト、試練中は荘厳な試練曲 · 練習場「部屋」タブで呼び出して試せる",
      ],
    },
  },
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
];
