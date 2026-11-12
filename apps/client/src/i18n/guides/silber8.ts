// 캐릭터 설명: 실베르 (기어스) · 한·영·일 (수치는 weaponsGears·itemsGears와 맞춤) — silber7.ts가 커서 나눔
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_SILBER8: Guide = {
  gears: [
    "실베르 · 기어스 '은빛 쌍방패 기사 메이드' · 체력 130 · 공격력 5 · 이동 1.15 · 행운 1 · 공격력은 아주 낮지만 방어력이 높고(받는 피해 ×0.8) 여러 번 때려서 싸움 · 공격력 아이템(+3·+25% 등)은 반만 적용 (진영 특징: 전용 패시브 하나마다 능력치가 더 오름)",
    "무기 1 (은빛 쌍방패): 누르면 앞을 두 방패로 강타 · 두 번 나눠 맞힘 (한 번에 공격력의 55%)",
    "대시 = 구체: 대시를 누르면 푸른 보석 기계 구체로 변해 누른 방향으로 계속 굴러감 · 무적이 없고 받는 피해만 30% 줄어듦 · 벽에 닿으면 튕김 · 적에게 부딪히면 그 적도 공격력의 100% 피해(퉁!) · 굴러가는 동안에도 공격 키로 기본 공격 · 대시를 다시 누르면 풀림",
    "맞을 때 확률 방어 3: 거울 반격(30%, 가까운 적에게 공격력의 300%) · 마법 보호막 돔(20%, 3초 동안 공격 무효) · 푸른 육각 방벽(25%, 보호막 +25, 겹치지 않음)",
    "공격 확률 기술 5: 대지 분쇄(15%, 앞 둘레 3번·기절) · 방패 던지기(20%, 뚫고 지나가며 끝에서 터짐) · 연속 방패타(25%, 8번 연타) · 천상의 수호자(3%, 10초 동안 큰 방패를 앞에 들고 느리게 걸음 · 방패에 부딪힌 적은 60번 맞음) · 청뢰 방패 폭풍(6%, 둘레 적 30번)",
    "그 밖에: 쌍성 방패(기본 공격이 1.3배 크게 4번) · 마법 방패 충격파(구체 앞 적에게 충격파) · 보조 10(은빛 갑주·반동 장갑·가속 구체·반격 태세·철옹성·메아리 방패·육각 결정·위성 방패·불굴·중갑 돌진)",
    "요령: 구체로 적 무리 사이를 튕겨 다니며 부딪히고, 맞을 때 터지는 방어 기술로 버티기 · 60타·30타 필살기는 피해 숫자가 한 대씩 모두 뜸",
  ],
};

export const GUIDE_EN_SILBER8: Guide = {
  gears: [
    "Silber · Gears, the silver twin-shield knight maid · HP 130 · damage 5 · move 1.15 · luck 1 · very low damage, but high defense (damage taken x0.8) and many hits · damage items (+3, +25%, etc.) apply only half (faction trait: each exclusive passive raises stats further)",
    "Weapon 1 (Silver Twin Shields): slam ahead with both shields · hits twice (55% of damage each)",
    "Dash = Orb: press dash to become a blue gem mechanical orb that keeps rolling the way you pressed · no invincibility, only 30% less damage taken · bounces off walls · ramming a foe deals 100% damage to it too (thump!) · you can still basic-attack while rolling · press dash again to return",
    "3 defensive procs when hit: Mirror Counter (30%, 300% damage to the nearest foe) · Magic Barrier Dome (20%, blocks all attacks for 3s) · Azure Hex Bulwark (25%, +25 shield, does not stack)",
    "5 attack procs: Earth Shatter (15%, shakes the area ahead 3 times · stun) · Shield Throw (20%, pierces then bursts) · Shield Barrage (25%, 8 rapid slams) · Celestial Guardian (3%, carry a giant shield ahead for 10s while walking slower · foes that hit it take 60 hits) · Azure Thunder Shield Storm (6%, 30 hits around you)",
    "Also: Twin Star Shields (basic attack 1.3x larger, 4 hits) · Magic Shield Shockwave (shockwave ahead of the orb) · 10 support passives (Silver Plate, Rebound Plating, Accelerating Orb, Counter Stance, Iron Fortress, Echo Shield, Hex Crystal, Satellite Shields, Indomitable, Heavy Charge)",
    "Tip: bounce through packs as an orb to ram them, and hold out with the defensive procs that trigger when hit · every one of the 60-hit and 30-hit ultimates shows its own damage number",
  ],
};

export const GUIDE_JA_SILBER8: Guide = {
  gears: [
    "シルベル・ギアーズ『銀の双盾騎士メイド』・体力130・攻撃力5・移動1.15・幸運1・攻撃力はとても低いが防御力が高く（被ダメージ×0.8）手数で戦う・攻撃力アイテム（+3・+25%など）は半分だけ適用（陣営の特徴：専用パッシブ1つごとに能力値がさらに上がる）",
    "武器1（銀の双盾）：前を2枚の盾で強打・2回に分けてヒット（1回で攻撃力の55%）",
    "ダッシュ＝球体：ダッシュを押すと青い宝石の機械球体になり、押した方向へ転がり続ける・無敵はなく被ダメージが30%減るだけ・壁で跳ね返る・敵にぶつかるとその敵にも攻撃力の100%ダメージ（ドン！）・転がる間も攻撃キーで基本攻撃・ダッシュをもう一度押すと解除",
    "被弾時の確率防御3：鏡の反撃（30%、近くの敵に攻撃力の300%）・魔法障壁ドーム（20%、3秒間攻撃無効）・青き六角防壁（25%、シールド+25、重ならない）",
    "攻撃確率技5：大地粉砕（15%、前方を3回揺らす・気絶）・盾投げ（20%、貫通して最後に炸裂）・連続盾打（25%、8連打）・天上の守護者（3%、10秒間巨大な盾を前に構えてゆっくり歩く・盾にぶつかった敵は60回ヒット）・青雷盾嵐（6%、周りの敵に30回）",
    "その他：双星の盾（基本攻撃が1.3倍大きく4回）・魔法盾の衝撃波（球体の前の敵に衝撃波）・補助10（銀の甲冑・反動装甲・加速球体・反撃態勢・鉄壁の城・残響の盾・六角結晶・衛星の盾・不屈・重甲突進）",
    "コツ：球体で敵の群れの間を跳ね回ってぶつかり、被弾時に発動する防御技で耐える・60ヒット・30ヒットの必殺技はダメージ数字が1発ずつすべて出る",
  ],
};
