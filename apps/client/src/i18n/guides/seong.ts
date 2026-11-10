// 캐릭터 설명: 성국 (베아트리스) · 한·영·일 (수치는 weaponsBeatrice·itemsBeatrice와 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_SEONG: Guide = {
  beatrice: [
    "성국 · 베아트리스 '심판의 불꽃' · 성국의 최고 전력, 단 한 번의 참격으로 성벽을 가르는 묵직한 브레이커 · 체력 130 · 공격력 15 · 방어력 3 · 이동 1.3 · 행운 1",
    "성국 캐릭터는 스킬형: 기본 공격 + 숫자 키 스킬 넷 (1·2·3·4, 설정에서 키를 바꿀 수 있음 · 모바일은 스킬 버튼)",
    "쌍검 3연격 (누르고 있으면): ① 왼쪽에서 오른쪽 베기 ② 오른쪽에서 왼쪽 베기 — X자가 만들어짐 ③ 그 X자를 다시 X자로 베어 터뜨림 (170%, 밀어냄) · 평소 칼빛은 주황",
    "악: 나를 때린 적에게 '악'이 하나씩 쌓임 (최대 10) · 악 하나마다 그 적이 받는 피해 +4% · 10이 되면 '처단' — X자 10개가 그 적에게 난발되며 터짐",
    "심판: 처단으로 지운 악이 100개가 되면 '심판' — 맵 전체를 태양 같은 거대한 X자 검격이 갈라 모든 적에게 큰 피해 (다시 0부터 모아 반복)",
    "꺼지지 않는 재생력: 체력이 적을수록 재생력이 올라감 (최대 30) · 화염 계수도 올라감 (공격력의 40% → 최대 200%)",
    "1 태양 검날 (대기 18초): 10초 동안 공격 속도 +30% · 기본 공격에 화염 피해 + 화상(최대 5겹) · 칼빛이 태양처럼 새빨간 붉은색",
    "2 일식의 춤 (대기 7초): 바라보는 쪽으로 빠르게 돌진하며 지나는 적에게 물리 + 화염 피해 (돌진 중 무적) · 다음 기본 공격이 두 자루로 앞을 빠르게 2연속 베어 넘김",
    "3 태양의 낙인 (대기 9초): 앞으로 커다란 검기 하나 (꿰뚫음, 물리 200% + 화염) · 맞은 적에게 악 +2",
    "4 자애 (궁극기, 대기 60초): 체력이 1이 되고 10초 동안 체력이 줄지 않음 · 화염 계수 한계가 400%까지 뚫리고 기본 공격이 늘 태양 검날 · 끝나면 10초 동안 어떤 회복도 안 됨 (버프 창 '치유 감소')",
    "무기 1: 사멸·절멸의 쌍검 (성스러운 백은과 꺼지지 않는 화염의 성석) · 무기 대신 아이템이 나옴",
    "전용 아이템 20: 악·처단 5 (원한의 낙인 · 죄의 무게 · 처단자 · 최후의 심판 · 증인) · 화염 5 (불씨 · 태양의 핵 · 작열 · 홍염 · 낙인 각인) · 재생 5 (꺼지지 않는 불꽃 · 성녀의 서약 · 피의 맹세 · 은총 · 백은의 갑주) · 스킬 5 (정오의 태양 · 개기일식 · 성국의 신속 · 무한한 자애 · 성채 파쇄)",
  ],
};

export const GUIDE_EN_SEONG: Guide = {
  beatrice: [
    "Holy Kingdom · Beatrice 'Flame of Judgment' · the Holy Kingdom's greatest warrior, a heavy breaker who splits walls with one slash · HP 130 · ATK 15 · DEF 3 · Move 1.3 · Luck 1",
    "Holy Kingdom characters are skill-based: a basic attack + four number-key skills (1·2·3·4, rebindable in Settings · skill buttons on mobile)",
    "Twin-blade 3-hit chain (hold): ① left-to-right slash ② right-to-left slash — forming an X ③ cuts that X again into an X and bursts it (170%, knockback) · normal blade light is orange",
    "Evil: foes that hit her gain one 'Evil' (up to 10) · each Evil makes that foe take +4% damage · at 10, 'Execution' — 10 X-slashes rain on that foe",
    "Judgment: every 100 Evil purged by Executions triggers 'Judgment' — a giant sun-like X slash splits the whole map, heavily damaging every foe (then collect again from 0)",
    "Undying regeneration: the lower her HP, the higher her regeneration (up to 30) and fire coefficient (40% of ATK → up to 200%)",
    "1 Solar Blade (18s cooldown): for 10s, +30% attack speed · basic attacks add fire damage + Burn (up to 5 stacks) · blade light turns sun-red",
    "2 Eclipse Dance (7s cooldown): dash quickly where she faces, dealing physical + fire damage on the way (invulnerable while dashing) · her next basic attack becomes a fast twin double slash",
    "3 Solar Brand (9s cooldown): one huge sword wave forward (pierces, 200% physical + fire) · +2 Evil to foes hit",
    "4 Mercy (ultimate, 60s cooldown): HP becomes 1 and can't drop for 10s · fire coefficient cap breaks to 400% and basic attacks always have Solar Blade · afterwards no healing at all for 10s (buff panel 'Healing cut')",
    "Weapon 1: Twin Blades of Demise & Annihilation (holy silver and the undying flame's sacred stone) · items drop instead of weapons",
    "20 exclusive items: Evil·Execution 5 (Brand of Grudge · Weight of Sin · Executioner · Final Verdict · Witness) · Fire 5 (Ember · Solar Core · Scorch · Crimson Flare · Engraved Brand) · Regeneration 5 (Undying Flame · Saint's Vow · Blood Oath · Grace · Holy Silver Armor) · Skills 5 (Noon Sun · Totality · Holy Kingdom's Swiftness · Boundless Mercy · Fortress Breaker)",
  ],
};

export const GUIDE_JA_SEONG: Guide = {
  beatrice: [
    "聖国 · ベアトリス「審判の炎」· 聖国の最高戦力、一太刀で城壁を断つ重いブレイカー · 体力130 · 攻撃力15 · 防御力3 · 移動1.3 · 幸運1",
    "聖国のキャラクターはスキル型：通常攻撃 + 数字キーのスキル4つ（1·2·3·4、設定でキー変更可 · モバイルはスキルボタン）",
    "双剣の3連撃（押し続ける）：① 左から右へ斬る ② 右から左へ斬る — X字ができる ③ そのX字をもう一度X字に斬って破裂（170%、押し出し）· 普段の剣光はオレンジ",
    "悪：自分を攻撃した敵に「悪」が1つずつ溜まる（最大10）· 悪1つごとにその敵の被ダメージ+4% · 10になると「処断」— X字10個がその敵に乱れ撃たれて炸裂",
    "審判：処断で消した悪が100個になると「審判」— 太陽のような巨大なX字の剣撃がマップ全体を断ち、全ての敵に大ダメージ（また0から集めて繰り返す）",
    "消えない再生力：体力が少ないほど再生力が上がる（最大30）· 火炎係数も上がる（攻撃力の40% → 最大200%）",
    "1 太陽剣刃（待機18秒）：10秒間、攻撃速度+30% · 通常攻撃に火炎ダメージ + 火傷（最大5重）· 剣光が太陽のような真紅に",
    "2 日食の舞（待機7秒）：向いている方へ素早く突進し、通り道の敵に物理 + 火炎ダメージ（突進中無敵）· 次の通常攻撃が二振りで前方を素早く2連続で斬り払う",
    "3 太陽の烙印（待機9秒）：前方に大きな剣気を1つ（貫通、物理200% + 火炎）· 当たった敵に悪+2",
    "4 慈愛（必殺技、待機60秒）：体力が1になり10秒間減らない · 火炎係数の上限が400%まで突破し通常攻撃が常に太陽剣刃 · 終了後10秒間どんな回復もできない（バフ欄「治癒減少」）",
    "武器1：死滅・絶滅の双剣（聖なる白銀と消えない炎の聖石）· 武器の代わりにアイテムが出る",
    "専用アイテム20：悪・処断5（怨恨の烙印 · 罪の重さ · 処断者 · 最後の審判 · 証人）· 火炎5（火種 · 太陽の核 · 灼熱 · 紅炎 · 烙印刻印）· 再生5（消えない炎 · 聖女の誓約 · 血の誓い · 恩寵 · 白銀の甲冑）· スキル5（正午の太陽 · 皆既日食 · 聖国の神速 · 無限の慈愛 · 城砦破砕）",
  ],
};
