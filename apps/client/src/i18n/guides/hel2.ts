// 캐릭터 설명: 헬리오스 둘째 묶음 (이클립스) · 한·영·일 (수치는 weaponsEclipse·itemsEclipse와 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_HEL2: Guide = {
  eclipse: [
    "헬리오스 · 이클립스 · 헬리오스 제국의 태양인 그녀와, 그 거대한 뒷면 일식의 밤의 주인인 그 · 체력 115 · 공격력 11 · 이동 1.3",
    "태양(여자): 누를 때마다 작은 불의 도끼로 한 동작 (누르고 있으면 이어짐) · 90°로 꺾인 긴 직각 검격(바깥 노랑·안쪽 빨강): 1 위에서 꺾임 → 2 가운데 → 3 아래에서 꺾임 → 4·5 깊게 찌름 (꺾이는 끝이 앞으로 멀리 뻗음) · 공격력은 낮지만 치명타 35% · 이글거리는 영역(적을 불태움) + 치유의 빛(1초마다 최대 체력 1.5% 회복)",
    "일식(남자): 누를 때마다 한 동작 · 도끼가 거대해짐 · 공격력 220%·공격 속도 50%·치명타 없음 · 6연 콤보: 내려베기 → 올려베기 → 흑월 회전 → 그림자 돌진 → 초승달 참격 → 일식 낙하(뛰어오른 동안 무적, 아주 넓게 내려찍고 가운데에 둘레 적을 끌어당기는 블랙홀) · 죽음의 영역(피해 + 둔화)",
    "게이지: 맞힐 때마다 차고(적을 쓰러뜨리면 더) 다 차면 모습이 바뀜 · 태양 → 일식: 보라 오라에 감싸여 무적, 보라 빛이 아래로 꺼지면 일식 · 일식 → 태양: 노란 오라에 감싸여 무적, 노란 빛이 위로 꺼지면 태양",
    "전용 아이템 10: 여명의 손길 · 코로나 · 태양 플레어 · 흑점 · 본영 · 사건의 지평선 · 개기일식 · 황혼 · 헬리오스의 왕관 · 월식의 대도끼 (공용 아이템도 나옴)",
  ],
};

export const GUIDE_EN_HEL2: Guide = {
  eclipse: [
    "Helios · Eclipse · she is the Sun of the Helios empire, he is its vast far side, lord of the eclipsed night · 115 HP · 11 attack · 1.3 move",
    "Sun (her): each press is one move with a small fire axe (hold to keep going) · long slashes bent at 90° (gold outside, red inside): 1 bends high → 2 middle → 3 bends low → 4 and 5 stab deep (the bend reaches far ahead) · low attack but 35% crit · a Blazing zone around her (burns foes) + healing light (1.5% max HP every second)",
    "Eclipse (him): one move per press · the axe becomes giant · 220% attack, 50% attack speed, no crits · 6-hit combo: Hew → Rising Cut → Black Moon Spin → Shadow Rush → Crescent Slash → Eclipse Fall (invincible in the air, a huge slam and a black hole in the center that drags foes in) · Death zone (damage + slow)",
    "Gauge: fills on every hit (more on kills); when full, the form changes · Sun → Eclipse: a purple aura wraps you (invincible), and as the purple light sinks down he appears · Eclipse → Sun: a golden aura wraps you (invincible), and as the golden light rises she returns",
    "10 exclusive items: Touch of Dawn · Corona · Solar Flare · Sunspot · Umbra · Event Horizon · Totality · Twilight · Crown of Helios · Great Axe of the Eclipse (common items also appear)",
  ],
};

export const GUIDE_JA_HEL2: Guide = {
  eclipse: [
    "ヘリオス · エクリプス · ヘリオス帝国の太陽である彼女と、その巨大な裏側、日食の夜の主である彼 · 体力115 · 攻撃力11 · 移動1.3",
    "太陽（女）: 押すたびに小さな炎の斧で1動作（押し続けると続く）· 90°に折れた長い直角の斬撃（外は金・内は赤）: 1 上で折れる → 2 中央 → 3 下で折れる → 4・5 深く突く（折れる先が前へ遠く伸びる） · 攻撃力は低いが会心35% · 灼熱の領域（敵を焼く）+ 癒しの光（1秒ごとに最大体力1.5%回復）",
    "日食（男）: 押すたびに1動作 · 斧が巨大になる · 攻撃力220%・攻撃速度50%・会心なし · 6連コンボ: 振り下ろし → 斬り上げ → 黒月回転 → 影の突進 → 三日月斬 → 日食落下（跳んでいる間は無敵、とても広く叩きつけ、中央に周りの敵を引き寄せるブラックホール）· 死の領域（ダメージ + 鈍化）",
    "ゲージ: 当てるたびにたまり（敵を倒すともっと）満タンで姿が変わる · 太陽 → 日食: 紫のオーラに包まれ無敵、紫の光が下へ消えると日食 · 日食 → 太陽: 金色のオーラに包まれ無敵、金色の光が上へ消えると太陽",
    "専用アイテム10: 黎明の手 · コロナ · ソーラーフレア · 黒点 · 本影 · 事象の地平線 · 皆既日食 · 黄昏 · ヘリオスの王冠 · 月食の大斧（共通アイテムも出る）",
  ],
};
