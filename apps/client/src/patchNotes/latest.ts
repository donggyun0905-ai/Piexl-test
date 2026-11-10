import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.8",
    date: "2026-11-10",
    items: {
      ko: [
        "새 진영 실베르: 몬스터가 강해지기 전부터 강대한 몬스터가 살던 북부를 지켜 온 나라 · 진영 특징 '성장': 처음엔 약하지만 패시브(공용·전용 모두)를 하나 가질 때마다 최대 체력 +3, 공격력·공격 속도·투사체 속도 +2%, 이동 속도 +1%가 더 오름 (30개까지)",
        "새 캐릭터 조커 (실베르): 조준한 쪽으로 카드를 한 장씩 던짐 · 피해는 공격력과 상관없는 고정 4 · 카드는 벽에 끝없이 튕기고 튕길 때마다 피해 +4 · 판 위 카드가 15장을 넘으면 가장 먼저 던진 카드가 사라짐 · 투사체 속도가 빠를수록 빨리 튕겨 세짐",
        "조커 무기 3: 트럼프 카드 · 사신의 낫 (크고 느리게 돌며 더 자주 벰) · 장난감 총 (작은 탄을 빠르고 자주 · 튕길 때 +3)",
        "조커 전용 아이템 15: 모두 새 기술·능력과 능력치를 줌 · 카드뽑기: 맞힐 때마다 게이지 → 머리 위 카드 셋이 섞이다 한 장이 뒤집힘 (달: 히든 캐릭터 아홉 중 하나의 힘 10초 · 붉은 일식: 10초 동안 받는 피해 +30%·카드 처음 피해 16 · 세계수: 체력 20 회복) · 날 선 모서리 · 더블 덱 · 마술사의 소매 · 불꽃·서리 카드 · 지휘봉 · 폭죽 카드 · 분신 카드 · 에이스 · 행운의 7 · 하트 카드 · 가속 카드 · 카드 방패 · 풀 하우스",
      ],
      en: [
        "New faction Silber: the nation that has guarded the North, home of mighty monsters even before monsters grew strong · Faction trait 'Growth': weak at first, but each passive you hold (shared or exclusive) grants +3 max HP, +2% damage, attack speed and projectile speed, and +1% move speed (up to 30)",
        "New character Joker (Silber): throws one card at a time toward your aim · fixed 4 damage, unaffected by attack · cards bounce off walls forever, +4 damage per bounce · past 15 cards on the field, the oldest vanishes · faster projectiles bounce sooner and hit harder",
        "Joker's 3 weapons: Playing Cards · Reaper's Scythe (big, slow spin, cuts more often) · Toy Gun (small fast shots, often · +3 per bounce)",
        "Joker's 15 exclusive items, each granting a new skill or ability plus stats · Card Draw: hits fill a gauge → three cards above your head shuffle and one flips (Moon: one of nine hidden heroes' powers for 10s · Red Eclipse: for 10s +30% damage taken, cards start at 16 · World Tree: heal 20 HP) · Sharpened Edge · Double Deck · Magician's Sleeve · Flame/Frost Card · Baton · Firework Card · Twin Card · Ace · Lucky Seven · Heart Card · Accel Card · Card Shield · Full House",
      ],
      ja: [
        "新陣営シルベル：魔物が強くなる前から強大な魔物が棲む北部を守り続けてきた国・陣営の特徴『成長』：最初は弱いが、パッシブ（共通・専用とも）を1つ持つごとに最大体力+3、攻撃力・攻撃速度・弾速+2%、移動速度+1%がさらに上がる（30個まで）",
        "新キャラクター ジョーカー（シルベル）：狙った方へカードを1枚ずつ投げる・ダメージは攻撃力と関係ない固定4・カードは壁で無限に跳ね、跳ねるたびにダメージ+4・場のカードが15枚を超えると最初に投げたカードが消える・弾速が速いほど早く跳ねて強くなる",
        "ジョーカーの武器3つ：トランプ・死神の鎌（大きくゆっくり回りより頻繁に斬る）・おもちゃの銃（小さな弾を速く頻繁に・跳ねるたび+3）",
        "ジョーカー専用アイテム15：すべて新しい技・能力と能力値をくれる・カード引き：当てるたびにゲージ → 頭上の3枚が混ざり1枚がめくれる（月：隠しキャラ9人のうち1人の力を10秒・赤い日食：10秒間被ダメージ+30%・カードの初期ダメージ16・世界樹：体力20回復）・研いだ角・ダブルデッキ・奇術師の袖・炎/霜のカード・指揮棒・花火のカード・分身カード・エース・幸運の7・ハートのカード・加速カード・カードの盾・フルハウス",
      ],
    },
  },
  {
    version: "0.52.7",
    date: "2026-11-10",
    items: {
      ko: ["레이드 풋내기: 전용 패시브가 모자란 만큼 주던 단련 포인트 보충을 없앰 (레벨업 스탯 포인트 29개가 대신 · 단련은 기본 30)"],
      en: ["Raid Novice: no longer gets the extra training points for missing exclusive passives (its 29 level-up stat points take their place · training stays at the base 30)"],
      ja: ["レイドの新米: 専用パッシブ不足分の鍛錬ポイント補充をなくしました（レベルアップのステータスポイント29が代わり · 鍛錬は基本の30）"],
    },
  },
  {
    version: "0.52.6",
    date: "2026-11-10",
    items: {
      ko: ["레이드 대장간: 암흑 강화로 무기가 부서진 뒤 '처음부터 다시'를 누르면 부서진 무기를 돌려받음 (대장간에 처음 들어온 것처럼 강화·돈·무기 모두 되돌림)"],
      en: ["Raid forge: after a Dark Enhance destroys your weapon, 'Start over' now gives the weapon back (weapon, upgrades and gold reset as if you just entered the forge)"],
      ja: ["レイドの鍛冶場: 暗黒強化で武器が壊れた後「最初からやり直す」を押すと壊れた武器が戻ります（鍛冶場に入った直後のように武器・強化・お金をすべて戻す）"],
    },
  },
  {
    version: "0.52.5",
    date: "2026-11-10",
    items: {
      ko: [
        "레이드 장비창: 창을 좌우로 넓히고 '장비 능력치 합계'(왼쪽)와 '세트 효과'(오른쪽)를 나란히 놓아 줄이 많아져도 덜 길어지게",
        "추가 능력치 색: 범위에서 가장 높은 값은 금색 · 상위 보라 · 중위 흰색 · 하위 하늘색 · 최하위 회색 (장신구 설명 아래에 색 뜻)",
        "레이드 성공 보상: 보상 상자를 열면 로비 칩 30,000개",
        "레이드 랭킹: 보스를 잡기까지 걸린 시간(컷신 빼고)으로 서버 순위표 · 사람마다 가장 빠른 기록 · 같이 싸운 캐릭터·사람 수 표시 · 레이드 화면의 '레이드 랭킹' 버튼",
      ],
      en: [
        "Raid gear window: wider, with 'Total from gear' (left) and 'Set bonus' (right) side by side so it stays shorter as stats pile up",
        "Bonus stat colors: the max value of its range is gold · high purple · mid white · low sky blue · lowest gray (legend under the item details)",
        "Raid clear reward: opening the reward chest gives 30,000 lobby chips",
        "Raid ranking: an online leaderboard by time to defeat the boss (cutscenes excluded) · best time per player · shows party characters and player count · 'Raid ranking' button in the raid menu",
      ],
      ja: [
        "レイド装備画面: 横に広げ、「装備能力の合計」（左）と「セット効果」（右）を並べて、行が増えても縦に長くなりにくく",
        "追加能力の色: 範囲の最高値は金 · 上位は紫 · 中位は白 · 下位は水色 · 最下位は灰色（アクセサリー説明の下に色の意味）",
        "レイド成功報酬: 報酬の箱を開けるとロビーチップ 30,000枚",
        "レイドランキング: ボスを倒すまでの時間（カットシーン除く）のサーバー順位表 · 一人一つの最速記録 · 一緒に戦ったキャラ・人数を表示 · レイド画面の「レイドランキング」ボタン",
      ],
    },
  },
  {
    version: "0.52.4",
    date: "2026-11-10",
    items: {
      ko: ["레이드 장신구 승급 추가: 1성 → 2성(같은 종류 1성 2개) · 2성 → 3성(같은 종류 2성 3개). 이제 1성부터 5성까지 모두 승급할 수 있어요"],
      en: ["Raid accessory promotion extended: 1★→2★ (two 1★ of the same type) · 2★→3★ (three 2★ of the same type). Every star from 1★ to 5★ can now be promoted"],
      ja: ["レイドアクセサリーの昇級を追加: 1★→2★（同じ種類の1★を2つ）· 2★→3★（同じ種類の2★を3つ）。1★から5★まですべて昇級できます"],
    },
  },
  {
    version: "0.52.3",
    date: "2026-11-10",
    items: {
      ko: [
        "같이 하기·협동 화면 새 단장: 입장 화면에 제목과 캐릭터 그림 카드 · 대기실은 위에 제목·방 코드, 사람마다 움직이는 캐릭터 그림 자리 카드(빈 자리를 누르면 초대), 진영 탭이 있는 그림 캐릭터 고르기, 아래 고정된 나가기·시작 줄",
        "협동 게임 중 파티 창: 캐릭터 얼굴 · 자리 색 줄 · 체력 숫자가 보이는 둥근 체력 막대 · 결과 표도 다듬음",
      ],
      en: [
        "Play Together / Co-op screens redesigned: entry screen with a title and character art cards · the room now shows the title and room code on top, a seat card with an animated character for each player (tap an empty seat to invite), a character picker with faction tabs and art, and a fixed Leave/Start bar at the bottom",
        "Co-op party panel in game: character faces, seat color stripes and rounded HP bars with numbers · the results table was polished too",
      ],
      ja: [
        "みんなで遊ぶ・協力プレイの画面を一新: 入場画面にタイトルとキャラ絵カード · 待機室は上にタイトル・部屋コード、プレイヤーごとに動くキャラ絵の席カード（空き席を押すと招待）、陣営タブ付きの絵で選ぶキャラ選択、下に固定の退出・開始バー",
        "協力プレイ中のパーティ欄: キャラの顔・席の色の帯・数字つきの丸い体力バー · 結果表も整えました",
      ],
    },
  },
];
