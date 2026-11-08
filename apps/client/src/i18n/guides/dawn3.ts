// 캐릭터 설명: 새벽의 성흔 (헬피스트) · 한·영·일 (수치는 weaponsHellfist·itemsHellfist·weaponsDawn과 맞춤, dawn2가 커서 나눔)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_DAWN3: Guide = {
  hellfist: [
    "새벽의 성흔 · 헬피스트 '적혈의 주먹' · 악마의 신체와 저주를 팔에 이식해, 적보다 더 악마 같은 파괴력으로 적을 짓밟는 사냥꾼 · 체력 125 · 공격력 16 · 방어력 2 · 이동 1.3 · 행운 1 · 스킬 없음(성흔 게이지)",
    "주먹 (누르고 있으면) 세 박자: 1 주먹 후리기 (앞 부채꼴 50 안 90%) → 2 악마 왼팔 내려찍기 (앞 부채꼴 58 안 150%, 크게 밀침 · 그 부채꼴 땅이 갈라져 2.5초 남음) → 3 균열 파쇄 (갈라진 땅이 붉은 유리처럼 깨지며 그 위 적 160%) · 0.8초 안 치면 다시 1타부터",
    "허공검격 (적혈 각성 중에만, 기본 공격이 모두 이것): 커다란 왼손 검지로 170 안에서 겨눈 쪽에 가까운 적 셋을 가리키고 공중을 그음 → 그 자리에 X자 검격 3줄 (55%씩) · 둘레 20 안 다른 적도 합친 피해의 50% · 가리킬 적이 없으면 앞 허공",
    "악마화: 맞힐 때마다 1 쌓임 (최대 10) · 1마다 모든 공격(후리기·내려찍기·균열 파쇄·허공검격 거리) +4% · 2.5초 안 맞히면 0.33초마다 하나씩 빠짐",
    "성흔 차는 양: 후리기로 맞힌 적마다 2 · 내려찍기 3 · 균열 파쇄 4 (최대 100) · 게이지는 흰 테두리 검은 막대에 흰색이 차오름",
    "적혈 각성 (6초, 달빛 각성과 다름): 둘레 90 지옥불 폭발 160% · 잠깐 무적 · 피해 배율·달빛 스택 대신 공격 속도 1.5배 · 맞힌 적마다 최대 체력 0.4% 회복 (한 번에 최대 2%) · 악마화 가득 + 사거리 1.15배 · 기본 공격이 허공검격 · 화면에 붉은 빛과 붉은 깃털",
    "무기 1: 적혈의 주먹 · 무기 대신 아이템이 나옴",
    "전용 아이템 20: 주먹 5 (굳은 주먹 · 쌍주먹 · 짓밟기 · 땅울림 · 무쇠 팔) · 악마화 5 (자라는 팔 · 침식 · 깊은 저주 · 굶주린 팔 · 악마의 아귀) · 허공검격 5 (긴 손톱 · 사냥꾼의 검지 · 찢어발기기 · 먼 손짓 · 잔상 할퀴기) · 적혈 5 (끓는 피 · 깨어난 악마 · 광란 · 피의 갈증 · 지옥불 분출)",
  ],
};

export const GUIDE_EN_DAWN3: Guide = {
  hellfist: [
    "Dawn Stigmata · Hellfist 'The Crimson Blood Fist' · a hunter grafted with a demon's flesh and curse, trampling foes with a destructive power more demonic than theirs · HP 125 · ATK 16 · DEF 2 · Move 1.3 · Luck 1 · no skills (Stigma gauge)",
    "Fists (hold) in three beats: 1 Hook (front cone within 50, 90%) → 2 demon left-arm Slam (front cone within 58, 150%, heavy knockback · the ground in that cone cracks and stays for 2.5s) → 3 Shatter (the cracked ground breaks like red glass, 160% to foes on it) · resets to the Hook after 0.8s without attacking",
    "Air Slash (only during Crimson Awakening, replaces every basic attack): point the huge left index finger at up to three foes closest to your aim within 170 and slash the air → 3 X-shaped slashes (55% each) where they stand · other foes within 20 take 50% of the total · slashes the air ahead if no foe is in sight",
    "Demonization: +1 per hit (up to 10) · each gives +4% to every attack (Hook, Slam, Shatter and Air Slash reach) · after 2.5s without hitting, one drops every 0.33s",
    "Stigma gain: 2 per foe hit by the Hook · 3 by the Slam · 4 by Shatter (max 100) · the gauge is a black bar with a white border that fills with white",
    "Crimson Awakening (6s, unlike Moonlight Awakening): 160% hellfire burst within 90 · brief invulnerability · instead of a damage bonus and moonlight stacks: 1.5x attack speed · heal 0.4% max HP per foe hit (up to 2% per attack) · full Demonization + 1.15x range · every basic attack becomes Air Slash · red light and red feathers on screen",
    "Weapon 1: Crimson Blood Fist · items drop instead of weapons",
    "Exclusive items 20: Fist 5 (Hardened Knuckles · Double Fist · Trample · Ground Quake · Iron Arm) · Demonization 5 (Growing Arm · Corrosion · Deep Curse · Starving Arm · Demon's Maw) · Air Slash 5 (Long Talons · Hunter's Finger · Rend Apart · Distant Beckon · Afterimage Claw) · Crimson 5 (Boiling Blood · Awakened Demon · Frenzy · Blood Thirst · Hellfire Eruption)",
  ],
};

export const GUIDE_JA_DAWN3: Guide = {
  hellfist: [
    "夜明けの聖痕 · ヘルフィスト「赤血の拳」· 悪魔の肉体と呪いを腕に移植し、敵より悪魔らしい破壊力で踏み潰す狩人 · 体力125 · 攻撃力16 · 防御力2 · 移動1.3 · 幸運1 · スキルなし（聖痕ゲージ）",
    "拳（押し続ける）三拍子：1 拳の振り抜き（前方扇形50以内 90%）→ 2 悪魔の左腕叩きつけ（前方扇形58以内 150%、大きく押し出す・その扇形の地面が割れて2.5秒残る）→ 3 亀裂破砕（割れた地面が赤いガラスのように砕け、その上の敵に160%）· 0.8秒攻撃しないと1打目から",
    "虚空剣撃（赤血覚醒中のみ、通常攻撃が全てこれ）：大きな左手の人差し指で170以内、狙った方向に近い敵三体を指し宙を斬る → その位置にX字の斬撃3本（55%ずつ）· 周囲20以内の他の敵にも合計の50% · 指す敵がいなければ前方の虚空",
    "悪魔化：当てるたび1溜まる（最大10）· 1ごとに全攻撃（振り抜き・叩きつけ・亀裂破砕・虚空剣撃の距離）+4% · 2.5秒当てないと0.33秒ごとに一つずつ減る",
    "聖痕の溜まり方：振り抜きで当てた敵ごとに2 · 叩きつけ3 · 亀裂破砕4（最大100）· ゲージは白い縁の黒いバーに白が満ちる",
    "赤血覚醒（6秒、月光覚醒とは別）：周囲90に獄炎爆発160% · 短い無敵 · ダメージ倍率・月光スタックの代わりに攻撃速度1.5倍 · 当てた敵ごとに最大体力0.4%回復（一度に最大2%）· 悪魔化最大＋射程1.15倍 · 通常攻撃が虚空剣撃 · 画面に赤い光と赤い羽根",
    "武器1：赤血の拳 · 武器の代わりにアイテムが出る",
    "専用アイテム20：拳5（硬い拳・双拳・踏み潰し・地鳴り・鉄の腕）· 悪魔化5（伸びる腕・侵食・深い呪い・飢えた腕・悪魔の顎）· 虚空剣撃5（長い爪・狩人の人差し指・引き裂き・遠い手招き・残像の爪）· 赤血5（沸く血・目覚めた悪魔・狂乱・血の渇き・獄炎噴出）",
  ],
};
