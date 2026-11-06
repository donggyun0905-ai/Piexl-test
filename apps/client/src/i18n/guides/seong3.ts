// 캐릭터 설명: 성국 3 (가브리엘) · 한·영·일 (수치는 weaponsGabriel·itemsGabriel과 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_SEONG3: Guide = {
  gabriel: [
    "성국 · 가브리엘 '철옹의 방패' · 온몸을 단단한 빛의 갑옷으로 두른 절대 수호자. 강철과 중력을 다루며 전장의 최전선에서 적의 모든 공격을 반감하고 대지를 진동시켜 적을 압박함 · 체력 150 · 공격력 14 · 방어력 5 · 이동 1.2 · 행운 1",
    "성국 캐릭터는 스킬형: 기본 공격 + 숫자 키 스킬 넷 (1·2·3·4, 설정에서 키를 바꿀 수 있음 · 모바일은 스킬 버튼)",
    "철옹: 받는 피해가 언제나 절반",
    "3연격 (누르고 있으면): ① 내려찍기 ② 휘두르기 (앞 부채꼴, 110%) ③ 대지 강타 — 앞 땅에 빛의 망치가 내리꽂힘 (180%, 기절 0.5초, 압박)",
    "압박: 대지 진동·중력에 맞은 적은 1.5초 동안 느려짐",
    "1 방패 돌진 (대기 8초): 방패를 앞세워 돌진 (120%) · 부딪힌 적을 밀쳐내고 기절·압박",
    "2 중력 붕괴 (대기 12초): 앞 땅에 중력장 · 둘레 적을 가운데로 끌어당기고 압박 → 0.5초 뒤 빛의 망치 (200%)",
    "3 성벽 (대기 16초): 최대 체력 30% 보호막 · 둘레 땅을 울려 밀쳐냄 (100%, 압박)",
    "4 불멸의 성벽 (궁극기, 대기 60초): 거대한 빛의 망치가 내리꽂히며 10초 동안 성역 · 성역 안에서는 보호막 +100 (끝나면 천천히 줄어듦) · 그동안 기본 공격마다 친 자리에 빛의 망치 추가타 (최대 체력 20%, 체력이 높을수록 셈)",
    "무기 1: 불멸의 성벽 방패 & 단조 해머 (거대한 타일 모양 파열형 방패와 빛을 머금은 해머) · 무기 대신 아이템이 나옴",
    "전용 아이템 20: 철옹·방어 5 (강철 판갑 · 수호자의 맹세 · 가시 방패 · 성채의 위엄 · 강철 의지) · 망치·대지 5 (단조 해머 · 대지 진동 · 묵직한 일격 · 여진 · 거인의 손) · 중력 5 (중력 핵 · 사건의 지평선 · 무게 · 압괴 · 이중 낙하) · 스킬·성벽 5 (방패 강타 · 성벽 확장 · 빛의 망치 · 불멸 · 굳은 신앙)",
  ],
};

export const GUIDE_EN_SEONG3: Guide = {
  gabriel: [
    "Holy Kingdom · Gabriel 'The Iron Shield' · an absolute guardian clad head to toe in hard armor of light. Wielding steel and gravity on the front line, he halves every enemy attack and shakes the earth to press foes down · HP 150 · Attack 14 · Defense 5 · Move 1.2 · Luck 1",
    "Holy Kingdom characters are skill-based: a basic attack + four number-key skills (1·2·3·4, rebindable in settings · skill buttons on mobile)",
    "Ironclad: always takes half damage",
    "3-hit chain (hold): ① overhead smash ② sweep (front cone, 110%) ③ Earth Slam — a hammer of light crashes down ahead (180%, 0.5s stun, Press)",
    "Press: foes hit by quakes or gravity are slowed for 1.5s",
    "1 Shield Charge (8s cooldown): charge behind your shield (120%) · knocks back, stuns and Presses foes hit",
    "2 Gravity Collapse (12s cooldown): a gravity field ahead · pulls nearby foes to the center and Presses them → 0.5s later a hammer of light (200%)",
    "3 Bulwark (16s cooldown): a shield of 30% max HP · shakes the ground around you, knocking foes back (100%, Press)",
    "4 Immortal Bastion (Ultimate, 60s cooldown): a giant hammer of light crashes down and makes a sanctuary for 10s · inside it you gain a 100 shield (fades slowly afterward) · meanwhile every basic attack drops an extra hammer of light where it lands (20% max HP — stronger the more HP you have)",
    "Weapon 1: Immortal Bastion Shield & Forged Hammer (a huge tile-shaped bursting shield and a hammer brimming with light) · items drop instead of weapons",
    "20 exclusive items: Ironclad/Defense 5 (Steel Plate · Guardian's Vow · Thorned Shield · Majesty of the Citadel · Iron Will) · Hammer/Earth 5 (Forged Hammerhead · Earthquake · Heavy Blow · Aftershock · Giant's Grip) · Gravity 5 (Gravity Core · Event Horizon · Weight · Crush · Double Drop) · Skills/Rampart 5 (Shield Slam · Widened Rampart · Hammer of Light · Immortality · Steadfast Faith)",
  ],
};

export const GUIDE_JA_SEONG3: Guide = {
  gabriel: [
    "聖国 · ガブリエル「鉄壁の盾」· 全身を固い光の鎧で包んだ絶対守護者。鋼と重力を操り、戦場の最前線で敵のあらゆる攻撃を半減し、大地を震わせて敵を圧迫する · 体力150 · 攻撃力14 · 防御力5 · 移動1.2 · 幸運1",
    "聖国のキャラクターはスキル型：通常攻撃 + 数字キーのスキル4つ（1·2·3·4、設定でキー変更可 · モバイルはスキルボタン）",
    "鉄壁：受けるダメージが常に半分",
    "3連撃（押し続ける）：① 振り下ろし ② 薙ぎ払い（前方扇形、110%）③ 大地強打 — 前方の地面に光のハンマーが叩きつけられる（180%、気絶0.5秒、圧迫）",
    "圧迫：震動・重力に当たった敵は1.5秒間遅くなる",
    "1 盾突進（待機8秒）：盾を構えて突進（120%）· ぶつかった敵を押し出し気絶・圧迫",
    "2 重力崩壊（待機12秒）：前方の地面に重力場 · 周りの敵を中心へ引き寄せ圧迫 → 0.5秒後に光のハンマー（200%）",
    "3 城壁（待機16秒）：最大体力30%のシールド · 周りの地面を震わせて押し出す（100%、圧迫）",
    "4 不滅の城壁（必殺技、待機60秒）：巨大な光のハンマーが叩きつけられ10秒間の聖域 · 聖域の中ではシールド+100（終了後ゆっくり減る）· その間通常攻撃ごとに当てた場所へ光のハンマーの追撃（最大体力20%、体力が高いほど強い）",
    "武器1：不滅の城壁の盾＆鍛造ハンマー（巨大なタイル状の破裂型の盾と光を宿したハンマー）· 武器の代わりにアイテムが出る",
    "専用アイテム20：鉄壁・防御5（鋼の板金鎧 · 守護者の誓い · 棘の盾 · 城砦の威厳 · 鋼の意志）· ハンマー・大地5（鍛造の槌頭 · 大地の震動 · 重い一撃 · 余震 · 巨人の手）· 重力5（重力核 · 事象の地平線 · 重み · 圧壊 · 二重落下）· スキル・城壁5（盾強打 · 城壁拡張 · 光のハンマー · 不滅 · 固い信仰）",
  ],
};
