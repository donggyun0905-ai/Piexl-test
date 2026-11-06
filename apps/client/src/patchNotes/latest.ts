import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.62",
    date: "2026-11-07",
    items: {
      ko: [
        "성국 새 캐릭터 가브리엘 '철옹의 방패': 온몸을 빛의 갑옷으로 두르고 강철과 중력을 다루는 절대 수호자 (체력 150 · 공격력 14 · 방어력 5 · 이동 1.2 · 행운 1 · 해금: 방어력 15 달성)",
        "철옹: 받는 피해 절반 · 기본 공격 3연격: 내려찍기 · 휘두르기 → 대지 강타(하늘에서 빛의 망치가 내리꽂힘, 180% · 기절 · 압박) · 압박된 적은 느려짐",
        "숫자 키 스킬 넷: 1 방패 돌진(밀쳐내기·기절) · 2 중력 붕괴(끌어당긴 뒤 빛의 망치 200%) · 3 성벽(최대 체력 30% 보호막 · 둘레 진동) · 4 불멸의 성벽(10초 성역: 안에서 보호막 +100, 끝나면 천천히 줄어듦 · 기본 공격마다 최대 체력 20% 빛의 망치 추가타)",
        "무기 1(불멸의 성벽 방패 & 단조 해머) · 전용 아이템 20(철옹·방어 5 · 망치·대지 5 · 중력 5 · 스킬·성벽 5) · 빛의 망치 그림 이펙트·효과음·그림 시트·패왕전 스킬",
      ],
      en: [
        "New Holy Kingdom character Gabriel 'The Iron Shield': an absolute guardian clad in armor of light who wields steel and gravity (HP 150 · ATK 14 · DEF 5 · Move 1.2 · Luck 1 · Unlock: reach 15 defense)",
        "Ironclad: half damage taken · basic 3-hit chain: overhead smash · sweep → Earth Slam (a hammer of light crashes down from the sky, 180% · stun · Press) · Pressed foes are slowed",
        "Four number-key skills: 1 Shield Charge (knockback · stun) · 2 Gravity Collapse (pulls in, then a 200% hammer of light) · 3 Bulwark (30% max HP shield · quake around you) · 4 Immortal Bastion (10s sanctuary: +100 shield inside that fades slowly afterward · every basic attack drops an extra hammer of light for 20% max HP)",
        "1 weapon (Immortal Bastion Shield & Forged Hammer) · 20 exclusive items (Ironclad·Defense 5 · Hammer·Earth 5 · Gravity 5 · Skill·Rampart 5) · hammer-of-light art effect · sounds · sprite sheet · Paewang skills",
      ],
      ja: [
        "聖国の新キャラクター、ガブリエル「鉄壁の盾」：全身を光の鎧で包み、鋼と重力を操る絶対守護者（体力150 · 攻撃力14 · 防御力5 · 移動1.2 · 幸運1 · 解放：防御力15達成）",
        "鉄壁：受けるダメージ半分 · 通常攻撃3連撃：振り下ろし · 薙ぎ払い → 大地強打（空から光のハンマーが叩きつけられる、180% · 気絶 · 圧迫）· 圧迫された敵は遅くなる",
        "数字キーのスキル4つ：1 盾突進（押し出し・気絶）· 2 重力崩壊（引き寄せた後に光のハンマー200%）· 3 城壁（最大体力30%のシールド · 周りに震動）· 4 不滅の城壁（10秒の聖域：中ではシールド+100、終了後ゆっくり減る · 通常攻撃ごとに最大体力20%の光のハンマー追撃）",
        "武器1（不滅の城壁の盾＆鍛造ハンマー）· 専用アイテム20（鉄壁・防御5 · ハンマー・大地5 · 重力5 · スキル・城壁5）· 光のハンマーの絵のエフェクト · 効果音 · スプライトシート · 覇王戦スキル",
      ],
    },
  },
  {
    version: "0.49.61",
    date: "2026-11-06",
    items: {
      ko: [
        "성국 새 캐릭터 이안 '침묵의 서기관': 신의 부름을 기다리며 적의 움직임과 마력을 기록하는 나이 든 서기관, 인과율 조작형 암살자 (체력 95 · 공격력 14 · 방어력 1 · 이동 1.45 · 행운 2 · 해금: 공격 속도 1.8 달성)",
        "기본 공격 3연격: 펜 찌르기 · 펜 찌르기 → 강철 실 휘감기(끌어당김) · 맞힌 적에게 기록(최대 5) → 5면 속박(멈춤 · 받는 피해 +20%) · 속박된 적을 찌르면 급소(180%)",
        "숫자 키 스킬 넷: 1 인과의 실(꿰뚫는 실, 끌어당김·기록 +2) · 2 그림자 걸음(무적 돌진, 다음 공격 급소) · 3 기록 집행(방의 모든 적에게 기록만큼 피해, '執') · 4 인과율 속박(방의 모든 적 5초 속박, 준 피해의 40%를 끝날 때 되돌려 터뜨림)",
        "무기 1(집행의 펜 & 강철 실타래) · 전용 아이템 20(기록·속박 5 · 암살·급소 5 · 실 5 · 인과·스킬 5) · 이펙트·효과음·그림 시트·패왕전 스킬",
      ],
      en: [
        "New Holy Kingdom character Ian 'The Silent Scribe': an old scribe who records foes' movements and mana while awaiting the gods' call, a causality-bending assassin (HP 95 · ATK 14 · DEF 1 · Move 1.45 · Luck 2 · Unlock: reach 1.8 attack speed)",
        "Basic 3-hit chain: pen thrust · pen thrust → steel thread lash (pulls in) · foes hit gain Records (up to 5) → at 5 they are Bound (stopped · +20% damage taken) · stabbing a Bound foe hits a Vital Point (180%)",
        "Four number-key skills: 1 Thread of Causality (piercing thread, pulls · +2 Records) · 2 Shadow Step (invulnerable dash, next attack is a Vital Point) · 3 Writ of Execution (every foe in the room takes damage per Record, '執') · 4 Law of Causality (binds every foe in the room for 5s, returns 40% of damage dealt as a burst at the end)",
        "1 weapon (Pen of Execution & Steel Spool) · 20 exclusive items (Record·Bind 5 · Assassination·Vital 5 · Thread 5 · Causality·Skill 5) · effects · sounds · sprite sheet · Paewang skills",
      ],
      ja: [
        "聖国の新キャラクター、イアン「沈黙の書記官」：神々の呼び声を待ちながら敵の動きと魔力を記録する老いた書記官、因果律操作型の暗殺者（体力95 · 攻撃力14 · 防御力1 · 移動1.45 · 幸運2 · 解放：攻撃速度1.8達成）",
        "通常攻撃3連撃：ペン突き · ペン突き → 鋼の糸の巻きつけ（引き寄せ）· 当てた敵に記録（最大5）→ 5で束縛（停止 · 被ダメージ+20%）· 束縛中の敵を突くと急所（180%）",
        "数字キーのスキル4つ：1 因果の糸（貫く糸、引き寄せ · 記録+2）· 2 影歩き（無敵突進、次の攻撃が急所）· 3 記録執行（部屋の全ての敵に記録分のダメージ、「執」）· 4 因果律束縛（部屋の全ての敵を5秒束縛、与えたダメージの40%を終了時に跳ね返して炸裂）",
        "武器1（執行のペン＆鋼の糸巻）· 専用アイテム20（記録・束縛5 · 暗殺・急所5 · 糸5 · 因果・スキル5）· エフェクト · 効果音 · スプライトシート · 覇王戦スキル",
      ],
    },
  },
  {
    version: "0.49.60",
    date: "2026-11-06",
    items: {
      ko: ["스킬 칸(베아트리스·추적자)에 마우스를 올리면 위에 스킬 설명이 뜸 (효과·피해·대기 시간)"],
      en: ["Hovering a skill button (Beatrice · Tracker) shows the skill's description above it (effect · damage · cooldown)"],
      ja: ["スキル欄（ベアトリス・追跡者）にマウスを乗せると上にスキル説明が出る（効果・ダメージ・待機時間）"],
    },
  },
  {
    version: "0.49.59",
    date: "2026-11-06",
    items: {
      ko: ["베아트리스 일식의 춤: 무희가 춤추며 베고 지나가듯 몸 둘레 곳곳에 작은 초승달 칼빛이 연달아 그어지고, 베인 적마다 가는 일직선 칼선 · 지나가며 베는 범위 넓힘 (경로 둘레 28) · 무거운 일식 고리 잔상은 옅은 빛으로"],
      en: ["Beatrice's Eclipse Dance: like a dancer cutting through as she spins, small crescent blade lights flash all around her, and each foe cut gets a thin straight slash · wider cutting area along the path (28 around it) · the heavy eclipse-ring afterimages are now a faint glow"],
      ja: ["ベアトリスの日食の舞：舞姫が舞いながら斬り抜けるように、体の周りのあちこちに小さな三日月の剣光が次々と走り、斬られた敵ごとに細い一直線の剣線 · 通り抜けて斬る範囲を広げた（道の周り28）· 重い日食の輪の残像は淡い光に"],
    },
  },
  {
    version: "0.49.58",
    date: "2026-11-06",
    items: {
      ko: ["베아트리스 칼빛: 파수꾼 검격과 같은 두께·모양으로 · 색만 평소 주황, 태양 검날(1번)·자애 중 빨강 · 3타·처단도 기본 공격과 같은 칼빛 X자 (심판은 그대로)"],
      en: ["Beatrice's blade light: same thickness and shape as the Warden's slash · only the color differs, orange normally and red during Solar Blade (1) or Mercy · the 3rd hit and Execution use the same X of blade light (Judgment unchanged)"],
      ja: ["ベアトリスの剣光：番人の剣撃と同じ太さ・形に · 色だけ普段はオレンジ、太陽剣刃（1番）・慈愛中は赤 · 3撃目・処断も通常攻撃と同じ剣光のX字（審判はそのまま）"],
    },
  },
  {
    version: "0.49.57",
    date: "2026-11-06",
    items: {
      ko: ["베아트리스 검격: 파수꾼 검격과 같은 초승달 칼빛을 더 두껍게 · 1타·2타 초승달이 대각선으로 겹쳐 X자, 3타도 같은 초승달 둘로 X자를 다시 벰"],
      en: ["Beatrice's slashes: the same crescent blade light as the Warden's, but thicker · hits 1 and 2 overlap diagonally into an X, and hit 3 re-cuts the X with the same two crescents"],
      ja: ["ベアトリスの剣撃：番人の剣撃と同じ三日月の剣光をより太く · 1撃目・2撃目の三日月が斜めに重なってX字、3撃目も同じ三日月2つでX字を斬り直す"],
    },
  },
  {
    version: "0.49.56",
    date: "2026-11-06",
    items: {
      ko: ["베아트리스: 악의 마크와 숫자를 다른 캐릭터 표식 크기로 줄임 ('x숫자') · 칼선 한쪽 끝이 평평하던 것 고침 (양 끝 모두 뾰족)"],
      en: ["Beatrice: the Evil mark and number are now the same size as other characters' marks ('x number') · fixed one end of her slashes being flat (both ends are sharp)"],
      ja: ["ベアトリス：悪のマークと数字を他キャラクターの印と同じ大きさに（「x数字」）· 剣線の片端が平らだったのを修正（両端とも尖る）"],
    },
  },
  {
    version: "0.49.55",
    date: "2026-11-06",
    items: {
      ko: ["캐릭터 선택창 나라 탭·아카이브 나라 색: 탈라시아는 하늘색, 성국은 흰색 (색이 없어 검게 보이던 것 고침)"],
      en: ["Nation colors in the character select tabs and the archive: Thalassia is sky blue, the Holy Kingdom is white (they showed as black before)"],
      ja: ["キャラクター選択の国タブ・アーカイブの国の色：タラシアは空色、聖国は白（色がなく黒く見えていたのを修正）"],
    },
  },
];
