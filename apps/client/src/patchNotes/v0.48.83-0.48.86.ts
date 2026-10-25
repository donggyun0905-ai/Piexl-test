import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.86",
    date: "2026-10-25",
    items: {
      ko: [
        "버려진 자들: 나와 있지 않은 두 아이도 곁에서 따로 싸움 (낮은 피해) — 방패·검 아이는 다가가 치고 물러났다가 다시, 총 아이는 떨어져서 탕탕 두 발씩",
        "버려진 자들: 탭하면 들어오는 아이와 자리를 바꿈 · 이 아이 차례를 다 치면 탭을 기다림 (왼쪽 위 ⇄가 깜빡임)",
        "버려진 자들: 탭을 잘못 누르면 조합·세 아이 콤보가 모두 처음으로 돌아가고 P1로 강제 교대 (이때는 무적 없음, 머리 위 ✕)",
        "버려진 자들 특수기를 새로: 1단계 암살(그림자 질주 · 그림자 베기), 2단계 총의 춤(건 카타 · 탄환 왈츠), 3단계 방패 일격(하늘 찍기 · 맞받아치기). 무기마다 고르는 특수기와 변형이 다름",
      ],
      en: [
        "The Abandoned: the two off-field kids fight beside you (low damage) — the shield and sword kids dart in, strike and fall back, the gun kid keeps distance and fires in pairs",
        "The Abandoned: tagging swaps places with the incoming kid · once a kid's turn is done, attacks wait for the tag (the ⇄ at the top left blinks)",
        "The Abandoned: a wrong tag resets the chain and all three combos and forces a swap back to P1 (no invulnerability then, ✕ above your head)",
        "New Abandoned specials: stage 1 Assassin (Shadow Rush · Phantom Cut), stage 2 Gun Dance (Gun Kata · Bullet Waltz), stage 3 Shield Strike (Sky Breaker · Ricochet). Each weapon picks its own specials and variations",
      ],
      ja: [
        "捨てられた者たち：出ていない二人もそばで戦う（低ダメージ）— 盾と剣の子は近づいて打っては下がり、銃の子は距離を取って二発ずつ撃つ",
        "捨てられた者たち：タッチすると入ってくる子と位置を入れ替え · その子の番を打ち終えるとタッチ待ち（左上の⇄が点滅）",
        "捨てられた者たち：タッチを間違えると組み合わせと三人のコンボが全部最初に戻り、P1に強制交代（このときは無敵なし、頭上に✕）",
        "捨てられた者たちの特殊技を一新：1段階 暗殺（影の疾走・影斬り）、2段階 銃の舞（ガン・カタ・弾丸ワルツ）、3段階 盾の一撃（天落とし・打ち返し）。武器ごとに選ぶ特殊技と変化が違う",
      ],
    },
  },
  {
    version: "0.48.85",
    date: "2026-10-25",
    items: {
      ko: [
        "거인: 대시 대신 패링. 짧게 막는 자세로, 그동안 맞으면 피해 없이 그 피해가 그대로 기계팔 에너지로 쌓임 · 다시 쓰기까지 2.5초 (체력 줄 오른쪽 원으로 보임)",
        "거인 드릴 팔: 공격 때 앞으로 회전하는 드릴이 나오고, 강타는 커다란 드릴과 함께 앞으로 크게 돌진하며 여러 번 깎음 (돌진 중 무적)",
      ],
      en: [
        "Titan: Parry instead of Dash. A short guard; anything that hits you during it deals no damage and goes straight into mech arm energy · 2.5s cooldown (shown as a circle right of the HP bar)",
        "Titan Drill Arm: attacks thrust a spinning drill forward, and the Smash charges far ahead with a giant drill, grinding many times (invulnerable while charging)",
      ],
      ja: [
        "巨人：ダッシュの代わりにパリィ。短く構え、その間に受けた攻撃はダメージなしでそのまま機械腕のエネルギーに · 再使用まで2.5秒（体力バーの右の円で表示）",
        "巨人のドリルアーム：攻撃で回転するドリルが前に伸び、強打は巨大なドリルと一緒に前へ大きく突進して何度も削る（突進中は無敵）",
      ],
    },
  },
  {
    version: "0.48.84",
    date: "2026-10-25",
    items: {
      ko: [
        "상점에 휴지통: F를 두 번 누르면 들고 있는 무기를 버리고 처음 무기로 (무기 값의 1/4을 돌려받음)",
        "상점에서 산 물건과 바꿔 내려놓은 아이템이 진열 자리를 가려 다른 물건을 못 사던 문제 고침 (진열대 아래에 놓이고, 겹치면 가까운 쪽이 먼저)",
        "능력치 창에 치명타 확률·치명타 피해가 늘 나옴 (이무기 용을 불러 쌓인 치명타, 거너 총 치명타도)",
        "떠돌이: 기본 치명타 25% 없앰, 대신 쇠뇌 공격력 8 → 10",
      ],
      en: [
        "Trash Can in shops: press F twice to throw away your weapon and go back to your starting weapon (refunds 1/4 of a weapon's price)",
        "Fixed items swapped out by a shop purchase covering the shelf so other items couldn't be bought (they now land below the shelf, and the nearest item takes priority)",
        "The stats panel now always shows Crit Chance and Crit Damage (including Imugi's stacked crit and Gunner gun crits)",
        "Drifter: removed the 25% base crit; the Crossbow's attack goes from 8 to 10 instead",
      ],
      ja: [
        "ショップにゴミ箱：Fを2回押すと持っている武器を捨てて最初の武器に（武器の値段の1/4が戻る）",
        "ショップで買った品と入れ替えて置いたアイテムが陳列場所をふさぎ、他の品が買えなかった問題を修正（陳列台の下に置かれ、重なると近い方が優先）",
        "能力値画面にクリティカル率・クリティカルダメージが常に表示（イムギの竜で溜まったクリティカル、ガンナーの銃のクリティカルも）",
        "流れ者：基本クリティカル25%を削除、代わりにクロスボウの攻撃力 8 → 10",
      ],
    },
  },
  {
    version: "0.48.83",
    date: "2026-10-24",
    items: {
      ko: [
        "버려진 자들 새 그림: 굳건한 얼굴의 방패 소년 · 날카로운 눈매의 총 소녀 · 결심한 눈빛의 검 소년, 테마 스킨 10종도 세 아이 모두",
        "거인 새 그림: 수염 난 커다란 몸 + 주황 불빛 코어가 박힌 큰 기계팔 (테마 스킨 10종). 몸이 커진 만큼 맞는 범위도 커짐",
        "거인 기계팔 주먹이 에너지만큼 빛나고, 강타 때 불꽃 줄기가 뻗음 · 상점·캐릭터 선택·타워 디펜스 얼굴 칸에서도 큰 그림이 잘 보이게",
      ],
      en: [
        "New art for The Abandoned: a steadfast shield boy, a sharp-eyed gun girl and a determined sword boy, plus all 10 theme skins for each kid",
        "New art for Titan: a big bearded body with a huge mech arm and a glowing orange core (10 theme skins). The hitbox grew with the body",
        "Titan's mech fist glows with stored energy and fires a burst of sparks on Smash · the larger art now fits in the shop, character select and tower defense portraits",
      ],
      ja: [
        "捨てられた者たちの新しい絵：揺るがない顔の盾の少年 · 鋭い目つきの銃の少女 · 決意の目の剣の少年、テーマスキン10種も三人とも",
        "巨人の新しい絵：ひげの大きな体＋オレンジに光るコア付きの大きな機械腕（テーマスキン10種）。体が大きくなった分、当たり判定も大きく",
        "巨人の機械腕の拳がエネルギー量に応じて光り、強打で火花が伸びる · ショップ・キャラ選択・タワーディフェンスの顔枠でも大きな絵がきちんと見える",
      ],
    },
  },
];
