// 캐릭터 설명: 비르디아 둘째 묶음 (영물 펜리르) · 한·영·일 (수치는 weaponsFenrir·itemsFenrir와 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_VIR2: Guide = {
  fenrir: [
    "비르디아 · 펜리르 · 영물, 지난 비르디아 왕이 다스리던 늙은 백랑 · 왕이 쓰던 거대한 대검을 입에 물고 다시 전쟁에 나섬 · 체력 45 · 공격력 16 · 이동 1.55 (아주 빠름)",
    "기본 특성 둘: 회피 25% (확률로 피해를 받지 않음) · 예리함 25% (맞힐 때 확률로 적 방어 -25% + 출혈)",
    "공격: 한 번 누르면 고정 5연 콤보가 저절로 이어짐 · 1 물어 베기(앞 부채꼴) → 2 되베기(더 넓게) → 3 지면 검기(큰 검기가 바닥을 그으며 나아가 적을 뚫음) → 4 난도(가까운 적 자리를 사방에서 6번 빠르게 벰) → 5 천랑 낙인",
    "천랑 낙인: 높이 뛰어오른 동안 무적 → 내려찍는 순간 무적이 풀리고 둘레를 크게 내려찍은 뒤 사방 8갈래로 검기가 바닥을 그으며 날아감 · 콤보가 끝나면 잠깐 쉼",
    "전용 아이템 10: 늙은 늑대의 지혜 · 선왕의 광륜 · 벼린 송곳니 · 질풍 · 늑대의 울부짖음 · 천랑성 · 월광 난무 · 대지 가르기 · 노장의 투혼 · 사냥 본능 (공용 아이템도 나옴)",
  ],
};

export const GUIDE_EN_VIR2: Guide = {
  fenrir: [
    "Virdia · Fenrir · a Spirit Beast, the old white wolf once ruled by the late king of Virdia · it marches to war again with the king's giant blade in its jaws · HP 45 · Attack 16 · Move 1.55 (very fast)",
    "Two base traits: 25% Dodge (chance to take no damage) · 25% Sharpness (hits may cut enemy defense by 25% and cause bleeding)",
    "Attack: one press runs a fixed 5-hit combo · 1 Bite Slash (cone ahead) → 2 Return Slash (wider) → 3 Ground Wave (a huge wave scrapes along the floor and pierces) → 4 Frenzy Cut (6 fast slashes from every side on the nearest foe) → 5 Sirius Brand",
    "Sirius Brand: invincible while leaping high → invincibility ends on the slam, which crushes the area and sends 8 sword waves scraping out in all directions · a short rest after each combo",
    "10 exclusive items: Old Wolf's Wisdom · Halo of the Late King · Honed Fangs · Gale · Wolf's Howl · Sirius · Moonlit Frenzy · Earth Splitter · Veteran's Spirit · Hunting Instinct (common items also appear)",
  ],
};

export const GUIDE_JA_VIR2: Guide = {
  fenrir: [
    "ヴィルディア · フェンリル · 霊獣、先代ヴィルディア王に仕えた老いた白狼 · 王が使っていた巨大な大剣をくわえ、再び戦に出る · 体力45 · 攻撃力16 · 移動1.55（とても速い）",
    "基本特性ふたつ: 回避25%（確率でダメージを受けない）· 鋭さ25%（当てると確率で敵の防御-25% + 出血）",
    "攻撃: 一度押すと固定5連コンボが自動で続く · 1 噛み斬り（前方の扇形）→ 2 返し斬り（より広く）→ 3 地面の剣気（大きな剣気が床をえぐりながら進み貫通）→ 4 乱刀（近くの敵の位置を四方から6回すばやく斬る）→ 5 天狼の烙印",
    "天狼の烙印: 高く跳び上がる間は無敵 → 叩きつける瞬間に無敵が解け、周りを大きく叩きつけたあと四方8本の剣気が床をえぐりながら飛ぶ · コンボのあとは少し休む",
    "専用アイテム10: 老狼の知恵 · 先王の光輪 · 研ぎ澄まされた牙 · 疾風 · 狼の遠吠え · 天狼星 · 月光乱舞 · 大地割り · 老将の闘魂 · 狩りの本能（共通アイテムも出る）",
  ],
};
