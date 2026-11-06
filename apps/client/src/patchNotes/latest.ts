import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.49.64",
    date: "2026-11-07",
    items: {
      ko: [
        "가브리엘 약화: 공격력 18에서 더 오르지 않음 (공격력이 오르는 아이템·효과는 공격력 1마다 최대 체력 +5로 바뀜) · 처음 공격 속도 0.5 · 이동 속도 0.9",
        "가브리엘 스킬 대기 늘림: 방패 돌진 8 → 10초 · 중력 붕괴 12 → 16초 · 성벽 16 → 20초 · 불멸의 성벽 60 → 75초",
        "가브리엘: 맞아도 깜빡이는 무적이 없음 (묵인처럼 아주 짧게)",
      ],
      en: [
        "Gabriel nerf: attack no longer rises above 18 (items and effects that raise attack give +5 max HP per point instead) · starting attack speed 0.5 · move speed 0.9",
        "Gabriel skill cooldowns raised: Shield Charge 8 → 10s · Gravity Collapse 12 → 16s · Bulwark 16 → 20s · Immortal Bastion 60 → 75s",
        "Gabriel: no blinking invulnerability after being hit (very short, like Mukin)",
      ],
      ja: [
        "ガブリエル弱体化：攻撃力は18から上がらない（攻撃力を上げるアイテム・効果は攻撃力1ごとに最大体力+5に変わる）· 初期攻撃速度0.5 · 移動速度0.9",
        "ガブリエルのスキル待機を延長：盾突進 8 → 10秒 · 重力崩壊 12 → 16秒 · 城壁 16 → 20秒 · 不滅の城壁 60 → 75秒",
        "ガブリエル：被弾後の点滅無敵なし（黙忍のようにごく短く）",
      ],
    },
  },
  {
    version: "0.49.63",
    date: "2026-11-07",
    items: {
      ko: [
        "가브리엘 불멸의 성벽: 기본 공격마다 하늘에서 떨어지던 추가타 대신, 거대한 빛의 망치가 내 망치와 함께 휘둘러져 앞을 넓게 침 (최대 체력 20%, 3타는 끝에서 땅이 번쩍)",
        "가브리엘 방패 돌진: 돌진하는 동안 빛나는 방패를 앞세우고 빛줄기가 뒤로 흐름 · 부딪힌 적은 금빛 십자로 터지며 섬멸",
        "가브리엘 보호막이 겹쳐 쌓이지 않음: 성벽을 다시 써도 최대 체력 30% 그대로 · 불멸의 성벽도 100까지",
        "가브리엘 중력 붕괴 새로: 떨어지는 망치 대신 0.8초 동안 둘레 적을 나에게 끌어모음(그동안 보호막 유지) → 보호막을 터뜨려 큰 피해(100% + 보호막 1마다 2.5) · 아이템 이중 낙하 → 궤도 유지(터뜨려도 보호막 50% 남음)",
        "가브리엘 성벽: 몸 둘레를 도는 미니 망치 다섯이 다가온 적을 침(60%) · 보호막이 사라지면 같이 사라짐",
      ],
      en: [
        "Gabriel's Immortal Bastion: instead of follow-up hammers falling from the sky, a giant hammer of light now swings along with each basic attack, striking a wide arc ahead (20% max HP; the 3rd hit flashes the ground)",
        "Gabriel's Shield Charge: charges behind a shining shield with streaks of light trailing behind · foes hit burst apart in a golden cross",
        "Gabriel's shields no longer stack: recasting Bulwark stays at 30% max HP · Immortal Bastion caps at 100",
        "Gabriel's Gravity Collapse reworked: instead of a falling hammer, drags nearby foes to you for 0.8s (shield stays up meanwhile) → bursts your shield for heavy damage (100% + 2.5 per shield point) · item Double Drop → Held Orbit (50% of the shield remains after the burst)",
        "Gabriel's Bulwark: five mini hammers circle you and strike foes that come close (60%) · they vanish with the shield",
      ],
      ja: [
        "ガブリエルの不滅の城壁：通常攻撃ごとに空から落ちていた追撃の代わりに、巨大な光のハンマーが自分のハンマーと一緒に振るわれ前方を広く打つ（最大体力20%、3撃目は最後に地面が光る）",
        "ガブリエルの盾突進：突進中、光り輝く盾を構え光の筋が後ろへ流れる · ぶつかった敵は金色の十字に弾けて殲滅",
        "ガブリエルのシールドが重ならない：城壁を再使用しても最大体力30%のまま · 不滅の城壁も100まで",
        "ガブリエルの重力崩壊を刷新：落ちるハンマーの代わりに0.8秒間周りの敵を自分へ引き寄せる（その間シールド維持）→ シールドを炸裂させ大ダメージ（100% + シールド1ごとに2.5）· アイテム二重落下 → 軌道維持（炸裂後もシールド50%残る）",
        "ガブリエルの城壁：体の周りを回る5つのミニハンマーが近づいた敵を打つ（60%）· シールドが消えると一緒に消える",
      ],
    },
  },
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
];
