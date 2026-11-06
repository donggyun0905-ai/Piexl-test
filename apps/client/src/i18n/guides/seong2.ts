// 캐릭터 설명: 성국 2 (이안) · 한·영·일 (수치는 weaponsIan·itemsIan과 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_SEONG2: Guide = {
  ian: [
    "성국 · 이안 '침묵의 서기관' · 신의 부름을 기다리는 나이 든 서기관. 적의 움직임과 마력을 기록하고 그 규칙을 강제로 속박하는 인과율 조작형 암살자 · 체력 95 · 공격력 14 · 방어력 1 · 이동 1.45 · 행운 2",
    "성국 캐릭터는 스킬형: 기본 공격 + 숫자 키 스킬 넷 (1·2·3·4, 설정에서 키를 바꿀 수 있음 · 모바일은 스킬 버튼)",
    "3연격 (누르고 있으면): ① 펜 찌르기 ② 펜 찌르기 (앞으로 길게 꿰뚫음, 100%) ③ 강철 실이 앞을 휘감아 끌어당김 (130%, 기록 +2)",
    "기록: 맞힌 적에게 기록이 하나씩 쌓임 (최대 5) · 5가 되면 '속박' — 1.5초 동안 멈추고 받는 피해 +20% (보스는 멈추지 않고 시간 절반)",
    "급소: 속박된 적을 찌르면 급소 (180%) · 그림자 걸음 뒤 첫 기본 공격도 급소",
    "1 인과의 실 (대기 10초): 앞으로 강철 실 (꿰뚫음, 120%) · 맞은 적을 끌어당기고 기록 +2",
    "2 그림자 걸음 (대기 6초): 그림자가 되어 미끄러지며 찌름 (100%, 무적, 기록 +1) · 다음 기본 공격이 급소",
    "3 기록 집행 (대기 12초): 방의 모든 적에게 기록 하나마다 50% 피해 ('執' 글자) · 속박된 적은 기록 5로 치고 급소 · 기록을 지움",
    "4 인과율 속박 (궁극기, 대기 45초): 방의 모든 적을 5초 동안 실로 속박 · 그동안 이안이 준 피해의 40%를 기록해 두었다가 끝날 때 되돌려 터뜨림",
    "무기 1: 집행의 펜 & 강철 실타래 (얇고 긴 자와 칼날이 하나가 된 펜, 인과의 저주가 깃든 실) · 무기 대신 아이템이 나옴",
    "전용 아이템 20: 기록·속박 5 (깃펜 촉 · 두꺼운 장부 · 조항 · 연쇄 조문 · 봉인 낙관) · 암살·급소 5 (급소 해부도 · 침묵의 서약 · 그림자 잉크 · 바늘 끝 · 마지막 문장) · 실 5 (강철 실타래 · 엮음 · 올가미 · 실패 · 매듭) · 인과·스킬 5 (메아리 각주 · 인과의 무게 · 절대 조문 · 침묵의 기도 · 신의 부름)",
  ],
};

export const GUIDE_EN_SEONG2: Guide = {
  ian: [
    "Holy Kingdom · Ian 'The Silent Scribe' · an old scribe awaiting the gods' call, a causality-bending assassin who records foes' movements and mana and forcibly binds those rules · HP 95 · ATK 14 · DEF 1 · Move 1.45 · Luck 2",
    "Holy Kingdom characters are skill-based: basic attack + four number-key skills (1·2·3·4, rebindable in settings · skill buttons on mobile)",
    "3-hit chain (hold): ① pen thrust ② pen thrust (a long piercing stab, 100%) ③ a steel thread lashes the front and pulls foes in (130%, +2 Records)",
    "Records: each hit adds a Record (up to 5) · at 5 the foe is 'Bound' — stopped for 1.5s and takes +20% damage (bosses aren't stopped, half duration)",
    "Vital Point: stabbing a Bound foe hits a Vital Point (180%) · the first basic attack after Shadow Step is also a Vital Point",
    "1 Thread of Causality (10s cooldown): a steel thread forward (pierces, 120%) · pulls foes hit and gives +2 Records",
    "2 Shadow Step (6s cooldown): glide as a shadow, stabbing on the way (100%, invulnerable, +1 Record) · next basic attack is a Vital Point",
    "3 Writ of Execution (12s cooldown): every foe in the room takes 50% per Record (a '執' glyph) · Bound foes count as 5 and take a Vital Point · clears Records",
    "4 Law of Causality (ultimate, 45s cooldown): binds every foe in the room with threads for 5s · records 40% of the damage Ian deals meanwhile and returns it as a burst at the end",
    "Weapon 1: Pen of Execution & Steel Spool (a pen fused with a thin long ruler and blade, a thread carrying the curse of causality) · items drop instead of weapons",
    "20 exclusive items: Record·Bind 5 (Quill Nib · Thick Ledger · Clause · Chained Article · Sealing Stamp) · Assassination·Vital 5 (Anatomy of Vitals · Vow of Silence · Shadow Ink · Needle Point · Final Sentence) · Thread 5 (Steel Spool · Weave · Snare · Bobbin · Knot) · Causality·Skill 5 (Echoing Footnote · Weight of Causality · Absolute Article · Silent Prayer · Call of the Gods)",
  ],
};

export const GUIDE_JA_SEONG2: Guide = {
  ian: [
    "聖国 · イアン「沈黙の書記官」· 神々の呼び声を待つ老いた書記官。敵の動きと魔力を記録し、その規則を強制的に束縛する因果律操作型の暗殺者 · 体力95 · 攻撃力14 · 防御力1 · 移動1.45 · 幸運2",
    "聖国のキャラクターはスキル型：通常攻撃 + 数字キーのスキル4つ（1·2·3·4、設定でキー変更可 · モバイルはスキルボタン）",
    "3連撃（押し続けると）：① ペン突き ② ペン突き（前方に長く貫く、100%）③ 鋼の糸が前方を巻きつけて引き寄せる（130%、記録+2）",
    "記録：当てた敵に記録が1つずつ溜まる（最大5）· 5で「束縛」— 1.5秒間止まり被ダメージ+20%（ボスは止まらず時間半分）",
    "急所：束縛中の敵を突くと急所（180%）· 影歩きの後の最初の通常攻撃も急所",
    "1 因果の糸（待機10秒）：前方に鋼の糸（貫通、120%）· 当たった敵を引き寄せ記録+2",
    "2 影歩き（待機6秒）：影となって滑りながら突く（100%、無敵、記録+1）· 次の通常攻撃が急所",
    "3 記録執行（待機12秒）：部屋の全ての敵に記録1つごとに50%ダメージ（「執」の文字）· 束縛中の敵は記録5扱いで急所 · 記録を消す",
    "4 因果律束縛（必殺技、待機45秒）：部屋の全ての敵を5秒間糸で束縛 · その間イアンが与えたダメージの40%を記録し、終了時に跳ね返して炸裂",
    "武器1：執行のペン＆鋼の糸巻（細長い定規と刃が一つになったペン、因果の呪いが宿る糸）· 武器の代わりにアイテムが出る",
    "専用アイテム20：記録・束縛5（羽ペンの先 · 分厚い台帳 · 条項 · 連鎖条文 · 封印の落款）· 暗殺・急所5（急所解剖図 · 沈黙の誓約 · 影のインク · 針の先 · 最後の一文）· 糸5（鋼の糸巻 · 編み込み · 輪縄 · 糸車 · 結び目）· 因果・スキル5（残響の脚注 · 因果の重み · 絶対条文 · 沈黙の祈り · 神の呼び声）",
  ],
};
