import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.50.27",
    date: "2026-11-08",
    items: {
      ko: [
        "새벽의 성흔 새 캐릭터 블루 플레임 '청염의 맹인' (스킬 없음, 성흔 게이지): 시각을 잃은 대신 악마의 기운을 푸른 불꽃으로 감지해 영혼을 태우는 마법 전사 · 체력 100 · 공격력 14 · 해금: 최대 체력 180 달성 · 그림 시트 (사용자 그림)",
        "세 겹 범위가 늘 보임 (안쪽 진한 파랑 · 가운데 연한 파랑 · 바깥 더 연한 파랑) · 푸른 불꽃 활: 조준한 쪽 가장 가까운 적이 안쪽이면 불꽃 감옥(가둠) · 가운데면 불꽃 기둥 · 바깥이면 화살이 날아가 박힘 (활·감옥·기둥 사용자 그림)",
        "모든 공격이 청염 상태이상 (보통 화상보다 셈) · 적 머리 위 푸른 불꽃 표시 · 피해 숫자는 아래 진한 파랑 → 위 옅은 파랑",
        "성흔이 가득 차면 열화상 각성: 화면이 까매지고 적 모양만 푸르게 보임 · 몸은 사라지고 무적 · 화면 아래 거대한 푸른 불꽃 활로 직접 조준해 거대한 화살 폭격 (사용자 그림 활·화살·폭격)",
        "청염의 활 1 · 전용 아이템 20 (푸른 날개: 확률로 날개가 돋고 머리 위 활들이 앞쪽 바닥에 비스듬히 화살비) · 이펙트·효과음·패왕전 스킬",
      ],
      en: [
        "New Stigma of Dawn character Blue Flame 'The Blind of Blue Fire' (no skills, Stigma gauge): a magic warrior who lost his sight but senses demonic malice as blue flames and burns their souls · HP 100 · Damage 14 · Unlock: reach 180 max HP · sprite sheet (user artwork)",
        "Three range rings are always shown (inner deep blue, middle light blue, outer pale blue) · Bow of blue fire: if the nearest foe where you aim is in the inner ring, a Flame Prison (traps); middle ring, a Flame Pillar; outer ring, an arrow that flies in and sticks (bow, prison and pillar user artwork)",
        "Every attack inflicts Blue Flame (stronger than a normal burn) · a blue flame mark over afflicted foes · damage numbers fade from deep blue at the bottom to pale blue at the top",
        "Full Stigma triggers Thermal Awakening: the screen goes black and only foe shapes glow blue · your body vanishes, invulnerable · aim a giant bow of blue fire at the bottom of the screen to bombard with giant arrows (user artwork bow, arrow and explosion)",
        "Blue Flame Bow · 20 exclusive items (Blue Wings: a chance to sprout wings while bows above your head rain arrows at an angle onto the ground ahead) · effects, sounds and Paewang skills",
      ],
      ja: [
        "夜明けの聖痕の新キャラ ブルーフレイム「青炎の盲者」（スキルなし、聖痕ゲージ）：視力を失った代わりに悪魔の気配を青い炎として感じ、魂を焼く魔法戦士 · 体力100 · 攻撃力14 · 解放：最大体力180達成 · スプライト（ユーザーの絵）",
        "三重の範囲が常に見える（内側は濃い青・真ん中は薄い青・外側はさらに薄い青）· 青い炎の弓：狙った方向で一番近い敵が内側なら炎の牢獄（閉じ込める）· 真ん中なら炎の柱 · 外側なら矢が飛んで刺さる（弓・牢獄・柱はユーザーの絵）",
        "全ての攻撃が青炎状態異常（通常の火傷より強い）· かかった敵の頭上に青い炎 · ダメージの数字は下が濃い青→上が薄い青",
        "聖痕が満ちると熱感知覚醒：画面が暗くなり敵の形だけが青く見える · 体は消えて無敵 · 画面下の巨大な青い炎の弓で直接狙って巨大な矢で爆撃（ユーザーの絵の弓・矢・爆撃）",
        "青炎の弓1 · 専用アイテム20（青い翼：確率で翼が生え、頭上の弓から前方の地面に斜めに矢の雨）· エフェクト・効果音・覇王戦スキル",
      ],
    },
  },
  {
    version: "0.50.26",
    date: "2026-11-08",
    items: {
      ko: [
        "실버불렛 각성 은빛 활을 새 그림으로: 흰 장식 초승달 활 ) (사용자 그림) · 전보다 약 2배 크게 펼쳐지며 빛남 · 양끝 유도탄이 커진 활 끝에서 나감",
        "실버불렛 이펙트 다듬기: 은탄(금빛 탄피·은빛 몸·빛 꼬리) · 총구 별 섬광·불길·연기 · 맞을 때 은빛 고리·반짝임 · 성수 폭탄 빛 십자 기둥·유리 조각·고이는 성수 · 연사 조준 고리 회전 · 각성 초승달",
      ],
      en: [
        "Silver Bullet's awakening bow redrawn: an ornate white crescent bow ) (user artwork), about twice as large and glowing · the homing side rounds now leave from the bigger bow's tips",
        "Silver Bullet effects polished: silver rounds (gold casing, silver body, light trail) · star muzzle flash with flame and smoke · silver ring and sparkle on hit · holy water bomb with a cross of light, glass shards and a pool of holy water · rotating Barrage reticle · crescent moon on awakening",
      ],
      ja: [
        "シルバーバレットの覚醒の銀の弓を新しい絵に：白い装飾の三日月の弓 )（ユーザーの絵）· 以前の約2倍の大きさで光る · 両端の誘導弾が大きくなった弓の端から出る",
        "シルバーバレットのエフェクト調整：銀弾（金の薬莢・銀の弾体・光の尾）· 銃口の星の閃光・炎・煙 · 命中時の銀の輪・きらめき · 聖水爆弾の光の十字柱・ガラス片・溜まる聖水 · 連射の照準リングが回転 · 覚醒時の三日月",
      ],
    },
  },
  {
    version: "0.50.25",
    date: "2026-11-08",
    items: {
      ko: ["실버불렛 그림 시트: 은발 땋은 머리·깃털 모자·검은 코트의 쌍권총 사냥꾼 (서기·쌍권총 사격·걷기·맞음·쓰러짐·대시, 사용자 그림)"],
      en: ["Silver Bullet sprite sheet: a twin-pistol hunter with a silver braid, feathered hat and black coat (idle, firing, walking, hit, down and dash; user artwork)"],
      ja: ["シルバーバレットのスプライト：銀髪の三つ編み・羽根付き帽子・黒いコートの双銃の狩人（立ち・双銃射撃・歩き・被弾・ダウン・ダッシュ、ユーザーの絵）"],
    },
  },
  {
    version: "0.50.24",
    date: "2026-11-08",
    items: {
      ko: [
        "새벽의 성흔 새 캐릭터 실버불렛 '은빛 집행자' (스킬 없음, 성흔 게이지): 쌍권총·은탄·성수 폭탄으로 전장을 누비는 정통파 엘리트 사냥꾼 · 체력 105 · 공격력 11 · 해금: 공격 속도 2 달성",
        "쌍권총: 한 번 공격에 은탄 두 발 (오른손 → 조금 뒤 왼손, 탕-탕) · 공격력은 낮고 빠름 · 모든 공격이 달빛 상태이상 · 8번째마다 성수 폭탄 (광역 정화)",
        "대시: 앞 장애물·기둥을 넘어가고 대시 순간 가까운 적에게 은탄 두 발 · 은탄 마크(체력 줄 위 ×개수)가 30이면 연사: 2초 동안 두 발씩 몰아 쏨 (성흔 안 참)",
        "달빛 각성: 피해·공격 속도 1.3배 + 몸이 고정되고 앞에 흰 활 ) → 2.5초 동안 가운데 두 발·양끝 유도 두 발씩 매우 빠르게 · 전용 아이템 20 · 패왕전 스킬 넷",
      ],
      en: [
        "New Dawn Stigmata character Silver Bullet, 'the Silver Executioner' (no skills, Stigma gauge): an orthodox elite hunter with twin pistols, silver rounds and holy water bombs · HP 105 · Attack 11 · Unlock: reach 2 attack speed",
        "Twin pistols: two silver rounds per attack (right hand, then the left a beat later) · low damage, fast · every attack inflicts Moonlight · a holy water bomb every 8th attack (area purge)",
        "Dash: vault over obstacles and pillars ahead and fire two rounds at the nearest foe · at 30 Silver Marks (×count above the HP bar), Barrage: rapid pairs for 2s (no Stigma gain)",
        "Moonlight Awakening: 1.3x damage & attack speed, and you are rooted behind a white bow ) firing two center rounds and two homing side rounds very fast for 2.5s · 20 exclusive items · 4 Paewang skills",
      ],
      ja: [
        "夜明けの聖痕の新キャラ シルバーバレット「銀の執行者」（スキルなし、聖痕ゲージ）：双銃・銀弾・聖水爆弾で戦場を駆ける正統派エリート狩人 · 体力105 · 攻撃力11 · 解放：攻撃速度2達成",
        "双銃：一度の攻撃で銀弾2発（右手→少し遅れて左手）· 攻撃力は低く速い · 全ての攻撃が月光状態異常 · 8回ごとに聖水爆弾（広範囲浄化）",
        "ダッシュ：前の障害物・柱を飛び越え、ダッシュの瞬間 近い敵に銀弾2発 · 銀弾マーク（体力バーの上に×個数）が30で連射：2秒間2発ずつ撃ち込む（聖痕は溜まらない）",
        "月光覚醒：ダメージ・攻撃速度1.3倍＋体が固定され前に白い弓 ) → 2.5秒間 中央2発・両端の誘導2発ずつ非常に速く · 専用アイテム20 · 覇王戦スキル4つ",
      ],
    },
  },
];
