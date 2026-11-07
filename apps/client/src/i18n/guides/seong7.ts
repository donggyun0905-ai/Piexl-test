// 캐릭터 설명: 성국 7 (미카엘라) · 한·영·일 (수치는 weaponsMichaela·itemsMichaela와 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_SEONG7: Guide = {
  michaela: [
    "성국 · 미카엘라 '공허의 인도자' · 빛의 성복을 입은 전투광. 공중에 떠다니는 무수한 소형 투창과 검의 비행 집합체(무한의 무기 보관소)로 끊임없이 무기를 바꿔치며 전장을 폭격함 · 체력 100 · 공격력 14 · 방어력 1 · 이동 1.4 · 행운 3",
    "성국 캐릭터는 스킬형: 기본 공격 + 숫자 키 스킬 넷 (1·2·3·4, 설정에서 키를 바꿀 수 있음 · 모바일은 스킬 버튼)",
    "무기 비: 방에 들어서면 가운데 포탈에서 무기 8개가 쏟아져 곳곳에 박힘 (떨어질 때 50%) · 박힌 무기는 최대 14개",
    "무기 속성 8가지 (무기마다 하나, 맞히거나 터질 때): 성은 피해 +25%·크게 밀침 · 빙결 얼음 피해 20%·느려짐 · 홍염 화상 · 혈월 출혈 35% · 천광 빛 피해 30% · 자전 70 안 다른 적에게 번개 50% · 비취 독 · 청해 물결 피해 20%·멀리 밀침 · 투척 뒤 꺼내는 무기는 새 속성",
    "무기 기술: 37가지 무기가 저마다 3연격 기술 셋과 닿았을 때 기술 둘을 지님 (예: 은적 대검 3연격 내려찍기 → 휘두르기 → 땅 가르기 · 닿으면 내려찍고 휘두르기 / 보라 낫창 휘두르기 둘 → 회오리 · 닿으면 회오리 치고 던지기) · 기술 14가지: 베기 · 내려찍기(기절) · 휘두르기(밀침) · 회전 베기 · 찌르기 · 돌진 찌르기 · 던지기(박힘) · 세 갈래 던지기 · X 베기 · 땅 가르기(느려짐) · 올려베기(크게 밀침) · 회오리(이어 침) · 칼비(무기가 쏟아져 박힘) · 꿰뚫는 빛 창",
    "바꿔 들기: 박힌 무기에 몸을 대면 그 무기로 바꿔 듦 → 그 무기의 기술 둘이 연달아 · 콤보 +1",
    "대시: 150 안에 박힌 무기가 있으면 (대시 쪽을 먼저) 그 무기로 순간 이동해 바꿔 듦 → 그 무기의 기술 둘 · 잠깐 무적",
    "콤보: 바꾸거나 던질 때마다 +1 (최대 20, 하나마다 피해 +3%) · 3초 동안 바꾸거나 던지지 않으면 0",
    "3연격 (누르고 있으면): 든 무기의 기술 셋 · 던지기로 끝나는 무기는 던진 무기가 박히고 다른 종류(검 ↔ 창)의 새 무기를 꺼냄 · 콤보 +1",
    "1 무기 비 (대기 8초): 앞에 포탈 → 무기 6개가 쏟아져 박힘 (떨어질 때 70%)",
    "2 칼날 교대 (대기 6초): 220 안 가장 가까운 박힌 무기로 순간 이동해 바꿔 듦 · 그 무기 기술 둘 (1.5배) · 콤보 +2",
    "3 일제 폭파 (대기 14초): 박힌 무기가 모두 차례로 터짐 (하나마다 100%) · 무기는 사라짐",
    "4 무한의 무기고 (궁극기, 대기 60초): 8초 동안 0.25초마다 적에게 무기가 쏟아져 꽂힘 (70%, 박혀 남음) · 그동안 기본 공격이 모두 투척",
    "무기 1: 무한의 무기 보관소 · 무기 대신 아이템이 나옴",
    "전용 아이템 20: 콤보·광기 5 (광란 · 광기 · 끊이지 않는 박자 · 바꿔치기 · 메아리 투척) · 기술·폭파 5 (성스러운 화약 · 넓은 폭심 · 공명 · 긴 도화선 · 파편) · 투척·무기 5 (공허의 투창 · 무거운 날 · 백은의 검 · 백금의 창 · 무기 수집가) · 포탈·스킬 5 (쏟아지는 하늘 · 공허 걸음 · 공허의 칼날 · 끝없는 무기고 · 인도자의 기도)",
  ],
};

export const GUIDE_EN_SEONG7: Guide = {
  michaela: [
    "Holy Kingdom · Michaela 'The Void Guide' · a battle-mad warrior in vestments of light. With a flying swarm of countless small javelins and swords (the Infinite Armory) she swaps weapons endlessly and bombards the field · HP 100 · Damage 14 · Defense 1 · Move 1.4 · Luck 3",
    "Holy Kingdom characters are skill-based: a basic attack + four number-key skills (1·2·3·4, rebindable in settings · skill buttons on mobile)",
    "Weapon rain: on entering a room, 8 weapons pour from a portal in the center and stick into the ground (50% on landing) · up to 14 planted weapons",
    "8 weapon elements (one per weapon, applied on hit and explosion): Sacred Silver +25% damage, heavy knockback · Frost 20% ice damage, slow · Crimson Flame burn · Blood Moon 35% bleed · Heavenly Light 30% light damage · Violet Storm 50% lightning to another foe within 70 · Jade poison · Azure Tide 20% water damage, far knockback · the weapon drawn after a throw has a new element",
    "Weapon techniques: each of the 37 weapons has three chain techniques and two touch techniques (e.g. silver-crimson greatsword chain slam → sweep → ground split · on touch slam then sweep / violet scythe-spear two sweeps → whirlwind · on touch whirlwind then throw) · 14 techniques: slash · slam (stun) · sweep (knockback) · spin · thrust · lunge · throw (sticks) · triple throw · cross slash · ground split (slow) · rising slash (heavy knockback) · whirlwind (repeats) · blade rain (weapons fall and stick) · piercing lance",
    "Swapping: touch a planted weapon to take it up → its two techniques fire in a row · +1 combo",
    "Dash: if a planted weapon is within 150 (dash direction first), you teleport to it and swap → its two techniques · brief invulnerability",
    "Combo: +1 on every swap or throw (up to 20, +3% damage each) · resets after 3s without swapping or throwing",
    "3-hit chain (hold): the held weapon's three techniques · weapons ending with a throw stick where they land and you draw a new weapon of the other kind (sword ↔ spear) · +1 combo",
    "1 Weapon Rain (8s cooldown): a portal ahead → 6 weapons pour down and stick (70% on landing)",
    "2 Blade Swap (6s cooldown): teleport to the nearest planted weapon within 220 and swap · its two techniques (1.5x) · +2 combo",
    "3 Mass Detonation (14s cooldown): every planted weapon explodes in turn (100% each) · the weapons are spent",
    "4 Infinite Armory (ultimate, 60s cooldown): for 8s a weapon crashes onto a foe every 0.25s (70%, stays planted) · all basic attacks are throws meanwhile",
    "1 weapon: Infinite Armory · items appear instead of weapons",
    "20 exclusive items: Combo·Madness 5 (Frenzy · Madness · Unbroken Tempo · Quick Switch · Echo Throw) · Technique·Detonation 5 (Holy Powder · Wide Blast · Resonance · Long Fuse · Shrapnel) · Throw·Weapon 5 (Void Javelin · Heavy Edge · Silver Sword · Platinum Lance · Weapon Hoarder) · Portal·Skill 5 (Pouring Sky · Void Step · Void Edge · Endless Arsenal · Guide's Prayer)",
  ],
};

export const GUIDE_JA_SEONG7: Guide = {
  michaela: [
    "聖国 · ミカエラ「虚空の導き手」· 光の聖衣をまとう戦闘狂。空中に漂う無数の小型投槍と剣の飛行集合体（無限の武器庫）で絶えず武器を持ち替えながら戦場を爆撃する · 体力100 · 攻撃力14 · 防御力1 · 移動1.4 · 幸運3",
    "聖国のキャラクターはスキル型：通常攻撃 + 数字キーのスキル4つ（1·2·3·4、設定でキー変更可 · モバイルはスキルボタン）",
    "武器の雨：部屋に入ると中央のポータルから武器8本が降り注ぎあちこちに刺さる（落下時50%）· 刺さった武器は最大14本",
    "武器の属性8種（武器ごとに1つ、当たる時・爆発時）：聖銀 ダメージ+25%・大きく押し出す · 氷結 氷ダメージ20%・鈍足 · 紅炎 火傷 · 血月 出血35% · 天光 光ダメージ30% · 紫電 70以内の別の敵へ雷50% · 翡翠 毒 · 青海 水ダメージ20%・遠くへ押し出す · 投擲後に取り出す武器は新しい属性",
    "武器の技：37本の武器それぞれが3連撃の技3つと触れた時の技2つを持つ（例：白銀紅の大剣 3連撃 叩きつけ → 薙ぎ払い → 地割り · 触れると叩きつけて薙ぎ払う / 紫の鎌槍 薙ぎ払い2回 → 旋風 · 触れると旋風から投げ）· 技14種：斬り · 叩きつけ（気絶）· 薙ぎ払い（押し出し）· 回転斬り · 突き · 突進突き · 投げ（刺さる）· 三方投げ · X斬り · 地割り（鈍足）· 斬り上げ（大きく押し出す）· 旋風（続けて斬る）· 剣の雨（武器が降って刺さる）· 貫く光の槍",
    "持ち替え：刺さった武器に触れるとその武器に持ち替える → その武器の技2つが連続で · コンボ+1",
    "ダッシュ：150以内に刺さった武器があれば（ダッシュ方向を優先）その武器へ瞬間移動して持ち替える → その武器の技2つ · 少しの間無敵",
    "コンボ：持ち替えや投擲のたびに+1（最大20、1つごとにダメージ+3%）· 3秒間持ち替えも投擲もしないと0",
    "3連撃（押し続ける）：持っている武器の技3つ · 投げで終わる武器は投げた武器が刺さり、別の種類（剣 ↔ 槍）の新しい武器を取り出す · コンボ+1",
    "1 武器の雨（待機8秒）：前方にポータル → 武器6本が降り注いで刺さる（落下時70%）",
    "2 刃の交代（待機6秒）：220以内の最も近い刺さった武器へ瞬間移動して持ち替え · その武器の技2つ（1.5倍）· コンボ+2",
    "3 一斉爆破（待機14秒）：刺さった武器が全て順に爆発（1本ごとに100%）· 武器は消える",
    "4 無限の武器庫（必殺技、待機60秒）：8秒間0.25秒ごとに敵へ武器が降り注ぐ（70%、刺さって残る）· その間、通常攻撃が全て投擲",
    "武器1：無限の武器庫 · 武器の代わりにアイテムが出る",
    "専用アイテム20：コンボ・狂気5（狂乱・狂気・途切れぬ拍子・すり替え・こだまの投擲）· 技・爆破5（聖なる火薬・広い爆心・共鳴・長い導火線・破片）· 投擲・武器5（虚空の投槍・重い刃・白銀の剣・白金の槍・武器収集家）· ポータル・スキル5（降り注ぐ空・虚空の歩み・虚空の刃・果てなき武器庫・導き手の祈り）",
  ],
};
