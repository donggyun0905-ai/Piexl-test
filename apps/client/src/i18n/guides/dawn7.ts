// 캐릭터 설명: 새벽의 성흔 (인시전) · 한·영·일 (수치는 weaponsIncision·itemsIncision·weaponsDawn과 맞춤, dawn6이 커서 나눔)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_DAWN7: Guide = {
  incision: [
    "새벽의 성흔 · 인시전 '쌍도끼의 도살자' (광전사) · 자비란 존재하지 않는 무자비한 연타로 악마들을 말 그대로 도륙내고 찢어발김 · 체력 130 · 공격력 13 · 방어력 2 · 이동 1.35 · 행운 1 · 스킬 없음(성흔 게이지)",
    "네 박자 (누르고 있으면): 1 오른 도끼 베기 (앞 부채꼴 50, 75%) → 2 왼 도끼 베기 (75%) → 3 쌍도끼 교차 베기 (X자, 앞 58, 115%) → 4 회오리 베기 (몸 둘레 54, 140%) · 0.8초 넘게 안 치면 다시 1타부터 · 거리는 사거리 증가 따름",
    "도륙 콤보: 맞힌 적마다 +1 (한 번 휘두를 때 최대 4) · 10마다 한 단계 (공격 속도 +5% · 피해 +4%, 최대 6단계) · 2초 안 맞히면 끊김 · 맞으면 반으로",
    "도살 도약: 콤보 30마다 다음 공격이 도약 · 조준한 쪽 170 안 가장 가까운 적에게 뛰어올라(공중 0.3초 무적) 내려찍음 (반지름 48, 220% · 0.5초 기절)",
    "돌진 연참 (대시): 대시하는 동안 몸 둘레 적을 적마다 두 번 벰 (60%)",
    "성흔 차는 양: 맞힐 때 1 · 처치 3 · 도살 도약 8 (최대 100)",
    "광란 각성 (6초): 둘레 쌍도끼 강타 180% (출혈) · 잠깐 무적 · 공격 속도 ×1.4 · 피해 ×1.2 · 콤보 두 배로 오름 · 콤보가 안 끊김",
    "무기 1: 도살자의 쌍도끼 · 무기 대신 아이템이 나옴",
    "전용 아이템 20 (★ 새 공격 방식): 쌍도끼 5 (무거운 도끼날 · 크게 휘두르기 · 피에 젖은 손잡이 · ★날아가는 초승달 · ★피의 소용돌이) · 도륙 콤보 5 (끈질긴 광기 · 흔들리지 않는 광기 · 끝없는 광란 · 피의 연타 · ★도륙 폭발) · 도살 도약 5 (사냥감 냄새 · 무너지는 땅 · 도살자의 무게 · ★갈라진 땅 · ★연속 도약) · 돌진·광란 5 (짓밟는 돌진 · ★피의 길 · 광기의 성흔 · 멈추지 않는 광란 · ★학살)",
  ],
};

export const GUIDE_EN_DAWN7: Guide = {
  incision: [
    "Stigma of Dawn · Incision 'The Butcher of Twin Axes' (berserker) · with merciless, relentless blows, she quite literally butchers and tears demons apart · HP 130 · Damage 13 · Defense 2 · Move 1.35 · Luck 1 · no skills (Stigma gauge)",
    "Four beats (hold): 1 right-axe slash (front cone 50, 75%) → 2 left-axe slash (75%) → 3 crossing twin-axe slash (X, front 58, 115%) → 4 whirlwind slash (all around 54, 140%) · pause over 0.8s to restart from beat 1 · reach scales with range",
    "Carnage Combo: +1 per foe hit (up to 4 per swing) · a tier every 10 (+5% attack speed · +4% damage, up to 6 tiers) · breaks after 2s without a hit · halves when you're hit",
    "Butcher's Leap: every 30 combo, your next attack is a leap · jump onto the nearest foe within 170 in your aim direction (0.3s airborne, invulnerable) and slam (radius 48, 220% · 0.5s stun)",
    "Rushing Cleave (dash): while dashing, slashes each foe around you twice (60%)",
    "Stigma gain: 1 per hit · 3 per kill · 8 per Butcher's Leap (max 100)",
    "Frenzy Awakening (6s): twin-axe slam around you 180% (bleed) · brief invulnerability · ×1.4 attack speed · ×1.2 damage · combo rises twice as fast · the combo never breaks",
    "1 weapon: Butcher's Twin Axes · items drop instead of weapons",
    "20 exclusive items (★ new attack): Twin axes 5 (Heavy Axeheads · Wide Swings · Blood-Soaked Grip · ★Flying Crescents · ★Blood Vortex) · Carnage Combo 5 (Stubborn Madness · Unshaken Madness · Endless Rampage · Blood Flurry · ★Carnage Burst) · Butcher's Leap 5 (Scent of Prey · Crumbling Ground · Butcher's Weight · ★Split Earth · ★Chain Leap) · Rush·Frenzy 5 (Trampling Rush · ★Trail of Blood · Stigma of Madness · Unstoppable Frenzy · ★Massacre)",
  ],
};

export const GUIDE_JA_DAWN7: Guide = {
  incision: [
    "夜明けの聖痕・インシジョン「双斧の屠殺者」（狂戦士）· 慈悲など存在しない無慈悲な連打で悪魔を文字通り屠り、引き裂く · 体力130・攻撃力13・防御力2・移動1.35・幸運1・スキルなし（聖痕ゲージ）",
    "四拍子（押し続ける）：1 右斧斬り（前方扇形50、75%）→ 2 左斧斬り（75%）→ 3 双斧交差斬り（X字、前方58、115%）→ 4 旋風斬り（周囲54、140%）· 0.8秒以上止めると1撃目から · 距離は射程増加に従う",
    "屠殺コンボ：当てた敵ごとに+1（1振り最大4）· 10ごとに1段階（攻撃速度+5%・ダメージ+4%、最大6段階）· 2秒当てないと途切れる · 被弾で半分に",
    "屠殺の跳躍：コンボ30ごとに次の攻撃が跳躍 · 狙った方向170以内の最も近い敵に飛び上がり（空中0.3秒無敵）叩きつける（半径48、220%・0.5秒気絶）",
    "突進連斬（ダッシュ）：ダッシュ中、周囲の敵を敵ごとに2回斬る（60%）",
    "聖痕の溜まる量：命中1・撃破3・屠殺の跳躍8（最大100）",
    "狂乱覚醒（6秒）：周囲に双斧の強打180%（出血）· 少しの間無敵 · 攻撃速度×1.4 · ダメージ×1.2 · コンボが2倍で上昇 · コンボが途切れない",
    "武器1：屠殺者の双斧 · 武器の代わりにアイテムが出る",
    "専用アイテム20（★新しい攻撃）：双斧5（重い斧刃・大振り・血に濡れた柄・★飛ぶ三日月・★血の渦）· 屠殺コンボ5（しつこい狂気・揺るがぬ狂気・果てなき狂乱・血の連打・★屠殺の爆発）· 屠殺の跳躍5（獲物の匂い・崩れる大地・屠殺者の重み・★裂けた大地・★連続跳躍）· 突進・狂乱5（踏み潰す突進・★血の道・狂気の聖痕・止まらぬ狂乱・★虐殺）",
  ],
};
