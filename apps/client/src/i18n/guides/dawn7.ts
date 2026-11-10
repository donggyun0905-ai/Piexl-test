// 캐릭터 설명: 새벽의 성흔 (인시전 · 크루세이더) · 한·영·일 (수치는 weaponsIncision·itemsIncision·weaponsDawn과 맞춤, dawn6이 커서 나눔)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_DAWN7: Guide = {
  crusader: [
    "새벽의 성흔 · 크루세이더 '성십자가의 거인' (탱커) · 압도적인 덩치로 전장을 압도하며 거대한 십자가를 둔기로 대지를 내리치고 악마를 궤멸시킴 · 체력 175 · 공격력 18 · 방어력 4 · 이동 1.1 · 행운 1 · 스킬 없음(성흔 게이지)",
    "내려찍기 (누르고 있으면): 십자가를 머리 위로 들어 올림 (약 0.55초, 버팀: 받는 피해 50% · 이동 40%) → 앞 26 자리를 내리찍음 (반지름 26, 160% · 0.2초 기절) → 쉬기 · 대시하면 들어 올리던 것을 내려놓음",
    "십자 균열: 찍은 자리에서 땅이 십자가 모양으로 갈라져 나감 · 앞 긴 팔 4마디 · 양옆 2마디 · 뒤 1마디 (마디 17마다, 0.05초 간격으로 돌판이 솟아 반지름 10, 90%) · 한 번 내려찍기에 적마다 한 번 · 거리는 사거리 증가 따름",
    "속죄의 무게 (최대 100): 깎인 체력 1마다 1.5 · 내려찍기에 맞은 적마다 3 · 가득 차면 그 내려찍기 때 균열 앞에 심판의 십자가가 하늘에서 떨어짐 (0.4초 뒤, 반지름 44, 260% · 0.75초 기절) · 무게는 0으로",
    "성벽 돌진 (대시): 앞 적을 십자가에 붙여 밀고 감 (보스는 한 번 80%) · 벽·기둥에 막히면 벽 충돌 180% · 0.8초 기절 · 대시가 끝나면 잡은 적을 모두 들이받음 (120% · 0.5초 기절)",
    "성흔 차는 양: 맞힐 때 1 · 처치 3 · 심판의 십자가 8 (최대 100)",
    "성십자가 강림 (6초): 둘레 90에 거대한 십자가 (250% · 1초 기절) · 잠깐 무적 · 무게 가득 · 거인화 (몸 1.35배 · 받는 피해 60%) · 내려찍을 때마다 심판의 십자가 (무게 안 씀) · 걸으면 0.37초마다 거인의 발걸음 (반지름 30, 45%)",
    "무기 1: 성십자가 · 무기 대신 아이템이 나옴",
    "전용 아이템 20 (★ 새 공격 방식): 성십자가 5 (무거운 십자가 · 갈라지는 대지 · 단련된 어깨 · ★여진 · ★성주) · 속죄의 무게 5 (굳건한 신앙 · 속죄 · 무거운 심판 · ★가시 면류관 · ★가시 후광) · 성벽 돌진 5 (파성추 · 넓은 방패 · 성벽 충돌 · 순례의 길 · ★돌진 낙인) · 성십자가 강림 5 (신앙의 성흔 · 끝없는 강림 · 거신 · ★십자가 비 · ★성묘)",
  ],
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
  crusader: [
    "Stigma of Dawn · Crusader 'Giant of the Holy Cross' (tank) · a towering giant who dominates the battlefield, swinging a colossal cross like a mace to strike the earth and crush demons · HP 175 · Damage 18 · Defense 4 · Move 1.1 · Luck 1 · no skills (Stigma gauge)",
    "Slam (hold): heave the cross overhead (about 0.55s, Brace: 50% damage taken · 40% move speed) → slam the spot 26 ahead (radius 26, 160% · 0.2s stun) → recover · dashing drops the heave",
    "Cross fissure: the ground splits from the impact in the shape of a cross · long arm ahead 4 joints · sides 2 · back 1 (every 17; a stone slab bursts up every 0.05s, radius 10, 90%) · once per foe per slam · reach scales with range",
    "Weight of Penance (max 100): 1.5 per HP lost · 3 per foe hit by a slam · when full, that slam calls a Cross of Judgment down from the sky ahead of the fissure (after 0.4s, radius 44, 260% · 0.75s stun) · Weight resets to 0",
    "Bulwark Charge (dash): pin foes ahead against the cross and shove them along (bosses take one 80% hit) · if blocked by a wall or pillar: Wall Crash 180% · 0.8s stun · when the dash ends, ram every caught foe (120% · 0.5s stun)",
    "Stigma gain: 1 per hit · 3 per kill · 8 per Cross of Judgment (max 100)",
    "Descent of the Holy Cross (6s): a colossal cross crashes down around you (radius 90, 250% · 1s stun) · brief invulnerability · full Weight · giant form (1.35x body · 60% damage taken) · every slam calls a Cross of Judgment (no Weight spent) · walking makes Giant's Footsteps every 0.37s (radius 30, 45%)",
    "1 weapon: Holy Cross · items drop instead of weapons",
    "20 exclusive items (★ new attack): Holy Cross 5 (Heavy Cross · Splitting Earth · Trained Shoulders · ★Aftershock · ★Holy Pillars) · Weight of Penance 5 (Steadfast Faith · Penance · Heavy Verdict · ★Crown of Thorns · ★Thorned Halo) · Bulwark Charge 5 (Battering Ram · Broad Bulwark · Wall Crash · Pilgrim's Road · ★Charging Brand) · Descent 5 (Stigma of Faith · Endless Descent · Colossus · ★Rain of Crosses · ★Holy Grave)",
  ],
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
  crusader: [
    "夜明けの聖痕・クルセイダー「聖十字の巨人」（タンク）· 圧倒的な巨体で戦場を制し、巨大な十字架を鈍器として大地を打ち、悪魔を壊滅させる · 体力175・攻撃力18・防御力4・移動1.1・幸運1・スキルなし（聖痕ゲージ）",
    "叩きつけ（押し続ける）：十字架を頭上に持ち上げる（約0.55秒、踏ん張り：被ダメージ50%・移動40%）→ 前方26の地点を叩きつける（半径26、160%・0.2秒気絶）→ 硬直 · ダッシュすると持ち上げを解く",
    "十字の亀裂：叩いた場所から地面が十字架の形に裂けていく · 前の長い腕4節・両横2節・後ろ1節（17ごと、0.05秒間隔で石板が突き出て半径10、90%）· 1回の叩きつけで敵ごとに1回 · 距離は射程増加に従う",
    "贖罪の重み（最大100）：減った体力1ごとに1.5 · 叩きつけで当てた敵ごとに3 · 満ちるとその叩きつけで亀裂の先に審判の十字架が空から落ちる（0.4秒後、半径44、260%・0.75秒気絶）· 重みは0に",
    "城壁突進（ダッシュ）：前の敵を十字架に押し付けて押していく（ボスは1回80%）· 壁や柱に阻まれると壁激突180%・0.8秒気絶 · ダッシュが終わると捕らえた敵すべてに体当たり（120%・0.5秒気絶）",
    "聖痕の溜まる量：命中1・撃破3・審判の十字架8（最大100）",
    "聖十字架降臨（6秒）：周囲90に巨大な十字架（250%・1秒気絶）· 少しの間無敵 · 重み満タン · 巨人化（体1.35倍・被ダメージ60%）· 叩きつけるたびに審判の十字架（重みを使わない）· 歩くと0.37秒ごとに巨人の足音（半径30、45%）",
    "武器1：聖十字架 · 武器の代わりにアイテムが出る",
    "専用アイテム20（★新しい攻撃）：聖十字架5（重い十字架・割れる大地・鍛えた肩・★余震・★聖柱）· 贖罪の重み5（揺るがぬ信仰・贖罪・重い審判・★茨の冠・★茨の後光）· 城壁突進5（破城槌・広い盾・城壁激突・巡礼の道・★突進の烙印）· 聖十字架降臨5（信仰の聖痕・果てなき降臨・巨神・★十字架の雨・★聖墓）",
  ],
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
