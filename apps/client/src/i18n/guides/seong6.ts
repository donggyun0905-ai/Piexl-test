// 캐릭터 설명: 성국 6 (유리엘) · 한·영·일 (수치는 weaponsYuriel·itemsYuriel과 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_SEONG6: Guide = {
  yuriel: [
    "성국 · 유리엘 '단죄의 성녀' · 빛의 성복을 입은 성국의 수호자. 성수가 담긴 수정구와 사슬이 달린 집행의 철퇴로 정화의 빛과 결계를 다룸. 치유와 결계로 버티며 이단자에게는 자비 없는 철퇴를 내리꽂음 · 체력 120 · 공격력 14 · 방어력 2 · 이동 1.2 · 행운 2",
    "성국 캐릭터는 스킬형: 기본 공격 + 숫자 키 스킬 넷 (1·2·3·4, 설정에서 키를 바꿀 수 있음 · 모바일은 스킬 버튼)",
    "단죄: 맞힌 적에게 하나씩 쌓임 · 5개면 정화의 빛이 터짐 (둘레 적에게 200% 빛 피해 · 체력 3% 회복) · 그 적은 0부터 다시",
    "결계 (수호 결계 · 성녀 강림): 안에서 받는 피해 -30% · 1초마다 체력 2% 회복 · 안의 적은 느려지고 받는 피해 +15% · 0.5초마다 빛 피해 (30%)",
    "3연격 (누르고 있으면): ① ② 철퇴 휘두르기 (앞 부채꼴 100%) ③ 사슬 철퇴 한 바퀴 (둘레 140%) — 맞힌 적 하나마다 체력 1% 회복 (최대 5)",
    "1 정화의 빛 (대기 8초): 수정구의 성수가 둘레로 퍼짐 (80% 빛 피해 · 단죄 +2) · 체력 12% 회복",
    "2 집행의 철퇴 (대기 10초): 사슬 철퇴를 앞으로 던짐 → 떨어진 자리의 적을 나에게 끌어당기며 내리침 (180% · 기절 0.6초 · 단죄 +2)",
    "3 수호 결계 (대기 16초): 내 자리에 6초 동안 결계",
    "4 성녀의 단죄 (궁극기, 대기 60초): 0.66초 기도 (무적) → 하늘에서 빛의 철퇴가 방의 모든 적에게 (300% 빛 피해 · 단죄 가득 → 정화) · 체력 40% 회복 · 8초 동안 성녀 강림 (몸 둘레 결계 · 단죄 두 배)",
    "무기 1: 성수 수정구 & 집행의 철퇴 · 무기 대신 아이템이 나옴",
    "전용 아이템 20: 단죄·정화 5 (이단 심문 · 정화의 불길 · 넓은 정화 · 죄의 낙인 · 자비 없음) · 철퇴·사슬 5 (무거운 철퇴 · 긴 사슬 · 집행자의 손목 · 성수 세례 · 집행의 무게) · 결계·수호 5 (넓은 성역 · 굳건한 결계 · 영원한 기도 · 빛의 가시 · 성국의 수호자) · 치유·스킬 5 (성녀의 손길 · 성수 수정구 · 넘치는 은총 · 천상의 철퇴 · 경건한 기도)",
  ],
};

export const GUIDE_EN_SEONG6: Guide = {
  yuriel: [
    "Holy Kingdom · Yuriel 'The Saint of Judgment' · a guardian of the Holy Kingdom in vestments of light. She wields an orb of holy water and a chained Flail of Execution, commanding purifying light and wards. She endures with healing and wards, and brings the flail down on heretics without mercy · HP 120 · Damage 14 · Defense 2 · Move 1.2 · Luck 2",
    "Holy Kingdom characters are skill-based: a basic attack + four number-key skills (1·2·3·4, rebindable in settings · skill buttons on mobile)",
    "Sin: each hit adds one to the foe · at 5 it bursts into Purging Light (200% light damage to nearby foes · heals 3% HP) · that foe starts again from 0",
    "Wards (Guardian Ward · Saint's Descent): inside, -30% damage taken · heal 2% HP each second · foes inside are slowed, take +15% damage and light damage every 0.5s (30%)",
    "3-hit chain (hold): ① ② flail swing (cone ahead, 100%) ③ chain spin (all around, 140%) — heals 1% HP per foe hit (up to 5)",
    "1 Light of Purification (8s cooldown): holy water from the orb spreads around you (80% light damage · +2 Sin) · heal 12% HP",
    "2 Flail of Execution (10s cooldown): hurl the chained flail ahead → it slams down and drags foes toward you (180% · 0.6s stun · +2 Sin)",
    "3 Guardian Ward (16s cooldown): a ward at your spot for 6s",
    "4 Saint's Judgment (ultimate, 60s cooldown): pray for 0.66s (invulnerable) → flails of light crash down on every foe in the room (300% light damage · Sin filled → Purge) · heal 40% HP · Saint's Descent for 8s (a ward around you · double Sin)",
    "1 weapon: Holy Water Orb & Flail of Execution · items appear instead of weapons",
    "20 exclusive items: Sin·Purge 5 (Inquisition · Purifying Pyre · Wide Purge · Stigma of Sin · No Mercy) · Flail·Chain 5 (Heavy Flail · Long Chain · Executioner's Wrist · Holy Baptism · Weight of Verdict) · Ward·Guard 5 (Wide Sanctuary · Steadfast Ward · Eternal Vigil · Thorns of Light · Guardian of the Kingdom) · Healing·Skill 5 (Saint's Touch · Holy Water Orb · Overflowing Grace · Heavenly Flail · Devout Prayer)",
  ],
};

export const GUIDE_JA_SEONG6: Guide = {
  yuriel: [
    "聖国 · ユリエル「断罪の聖女」· 光の聖衣をまとう聖国の守護者。聖水を湛えた水晶球と鎖付きの執行の鉄槌で浄化の光と結界を操る。治癒と結界で耐え抜き、異端者には慈悲なき鉄槌を振り下ろす · 体力120 · 攻撃力14 · 防御力2 · 移動1.2 · 幸運2",
    "聖国のキャラクターはスキル型：通常攻撃 + 数字キーのスキル4つ（1·2·3·4、設定でキー変更可 · モバイルはスキルボタン）",
    "断罪：当てた敵に1つずつ溜まる · 5つで浄化の光が炸裂（周りの敵に200%光ダメージ・体力3%回復）· その敵は0から",
    "結界（守護結界・聖女降臨）：中では受けるダメージ-30% · 1秒ごとに体力2%回復 · 中の敵は鈍足・被ダメージ+15% · 0.5秒ごとに光ダメージ（30%）",
    "3連撃（押し続ける）：① ② 鉄槌の振り（前方の扇形100%）③ 鎖の一回転（周囲140%）— 当てた敵1体ごとに体力1%回復（最大5）",
    "1 浄化の光（待機8秒）：水晶球の聖水が周りに広がる（80%光ダメージ・断罪+2）· 体力12%回復",
    "2 執行の鉄槌（待機10秒）：鎖の鉄槌を前へ投げる → 落ちた場所の敵を引き寄せながら叩きつける（180%・気絶0.6秒・断罪+2）",
    "3 守護結界（待機16秒）：自分の位置に6秒間結界",
    "4 聖女の断罪（必殺技、待機60秒）：0.66秒祈り（無敵）→ 天から光の鉄槌が部屋の全ての敵へ（300%光ダメージ・断罪満タン → 浄化）· 体力40%回復 · 8秒間聖女降臨（体の周りに結界・断罪2倍）",
    "武器1：聖水の水晶球＆執行の鉄槌 · 武器の代わりにアイテムが出る",
    "専用アイテム20：断罪・浄化5（異端審問・浄化の炎・広がる浄化・罪の烙印・慈悲なし）· 鉄槌・鎖5（重い鉄槌・長い鎖・執行者の手首・聖水の洗礼・執行の重み）· 結界・守護5（広い聖域・堅固な結界・永遠の祈り・光の棘・聖国の守護者）· 治癒・スキル5（聖女の手・聖水の水晶球・溢れる恩寵・天上の鉄槌・敬虔な祈り）",
  ],
};
