import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.97",
    date: "2026-10-25",
    items: {
      ko: [
        "로비에 펫 상점: 미니 게임 칩으로 펫 8마리를 살 수 있음 (3만~15만 칩) · 한 마리를 데리고 게임에 들어가면 곁을 따라다니며 능력 하나 (같이 공격·받는 피해 감소·이동 속도·치명타·사거리·돈·불사조는 목숨 +1) · 순위 경쟁 모드에서는 능력이 쓰이지 않음",
        "광야의 새벽: 무기·패시브 칸이 모두 차고 모두 5레벨이면 새 칸이 열려 계속 모을 수 있음 · 모은 골드는 로비 칩으로 들어옴",
        "변희: 한 동물의 전용 아이템 셋을 모두 모으면 그 동물이 각성 (더 크고 멋진 모습·체력 +20·사거리 +25%·공격력 +3·동물마다 각성 기술, 새 종류는 20% 확률로 하늘로 날아올라 무적으로 맵 끝에서 끝까지 세 번 가로지름)",
        "변희: 대시하면 사람 모습, 공격하면 다시 동물 모습 · 캐릭터 선택창의 이동 속도가 1.4999처럼 보이던 문제 고침",
      ],
      en: [
        "Pet shop in the lobby: buy 8 pets with mini-game chips (30k–150k chips) · take one into a run; it follows you and grants one perk (attacks with you, less damage taken, move speed, crit, range, gold, or the phoenix's extra life) · perks are off in ranked modes",
        "Dawn of the Wilds: once every weapon and passive slot is full and all are level 5, a new slot opens so you can keep collecting · gold you gather now becomes lobby chips",
        "Byeonhui: collect all three items of an animal to awaken it (bigger, fancier look, +20 HP, +25% range, +3 damage, an awakened skill per animal; birds have a 20% chance to soar off the map and sweep across it three times, invulnerable)",
        "Byeonhui: dashing turns her human, attacking turns her back into the animal · fixed move speed showing like 1.4999 on character select",
      ],
      ja: [
        "ロビーにペットショップ：ミニゲームのチップでペット8匹を買える（3万〜15万チップ）· 一匹を連れてゲームに入るとそばについて来て能力をひとつ（一緒に攻撃・被ダメージ減少・移動速度・クリティカル・射程・お金・不死鳥は命+1）· ランキング競争モードでは能力は使われない",
        "荒野の夜明け：武器・パッシブの枠がすべて埋まり全部レベル5になると新しい枠が開いて集め続けられる · 集めたゴールドはロビーのチップになる",
        "ビョンヒ：ひとつの動物の専用アイテム三つを集めるとその動物が覚醒（より大きく格好いい姿・体力+20・射程+25%・攻撃力+3・動物ごとの覚醒技、鳥は20%の確率で空へ舞い上がり無敵でマップの端から端まで三度横切る）",
        "ビョンヒ：ダッシュすると人の姿、攻撃すると再び動物の姿 · キャラ選択画面の移動速度が1.4999のように見えていた問題を修正",
      ],
    },
  },
  {
    version: "0.48.96",
    date: "2026-10-25",
    items: {
      ko: [
        "시즌 2: 비르디아 진영의 마지막 새 캐릭터 둘 (시즌 2 캐릭터 6명 모두 추가)",
        "새 캐릭터 '렌' (토목): 맨손으로 거대한 토목을 부려 차례로 타격·묶기·날려버리기·짓뭉개기·가두기 (넓고 세지만 느림) · 둘레의 수호 토목이 원거리 탄을 70% 확률로 막음 · 전용 아이템 20개",
        "새 캐릭터 '정령사' (교복을 입은 학생): 본인은 매직 미사일만, 곁의 작은 정령 셋(12종, 30초마다 하나씩 무작위로 바뀜)과 무기인 대정령 10이 싸움 · 대정령 이드라는 어른이 된 미래의 이드라 · 전용 아이템 10개",
      ],
      en: [
        "Season 2: the last two new characters join the Virdia faction (all six Season 2 characters are in)",
        "New character 'Ren' (earthwood): wields giant earthwood bare-handed to strike, bind, launch, crush and imprison in turn (wide and strong but slow) · guardian earthwood blocks ranged shots 70% of the time · 20 own items",
        "New character 'Spiritist' (a student in school uniform): she only fires magic missiles; three small spirits (12 kinds, one swaps at random every 30s) and her weapon, one of 10 great spirits, do the fighting · the great spirit Idra is the grown-up Idra of the future · 10 own items",
      ],
      ja: [
        "シーズン2：ヴィルディア陣営に最後の新キャラ二人（シーズン2のキャラ6人がすべて登場）",
        "新キャラ「レン」（土木）：素手で巨大な土木を操り、順に打撃・縛る・吹き飛ばす・押し潰す・閉じ込める（広く強いが遅い）· 周りの守護の土木が遠距離弾を70%の確率で防ぐ · 専用アイテム20",
        "新キャラ「精霊使い」（制服姿の学生）：本人はマジックミサイルだけ、そばの小さな精霊三体（12種、30秒ごとに一体ずつランダムに入れ替わる）と武器の大精霊10が戦う · 大精霊イドラは大人になった未来のイドラ · 専用アイテム10",
      ],
    },
  },
  {
    version: "0.48.95",
    date: "2026-10-25",
    items: {
      ko: [
        "시즌 2: 비르디아 진영에 새 캐릭터 둘 더",
        "새 캐릭터 '플라이' (잠자리 날개): 공격하면 겨눈 쪽으로 공중을 가르며 급습 (그동안 무적), 지나간 적을 날카로운 발톱으로 베고 끝에서 할큄 · 발톱 10개(두 번 베기·바람 칼날·독·번개·서리·흡혈·신기루·그림자·날개 칼날) · 전용 아이템 10개",
        "새 캐릭터 '장로' (진법): 공격하면 적 자리에 네모난 진을 깔고 잠시 뒤 발동 · 진법 10개(덩굴문·오검진 불기둥·협벽진 양쪽 벽·함정진·낙검진 떨어지는 검·뇌인진·빙결진·풍뢰진·암권진 바위 주먹·천원진) · 전용 아이템 10개",
      ],
      en: [
        "Season 2: two more characters join the Virdia faction",
        "New character 'Fly' (dragonfly wings): attacking swoops through the air toward your aim (invulnerable), slashing foes on the way with razor claws and raking at the end · 10 claws (double slash, wind blades, poison, lightning, frost, lifesteal, mirage, shadow, wing blades) · 10 own items",
        "New character 'Elder' (arrays): attacking lays a square array under a foe that triggers after a moment · 10 arrays (Vine Gate, Five-Dagger fire pillar, Crushing Walls, Pit, Falling Swords, Thunder Seal, Frost, Wind Cage, Stone Fist, Heavenly Palace) · 10 own items",
      ],
      ja: [
        "シーズン2：ヴィルディア陣営に新キャラがさらに二人",
        "新キャラ「フライ」（蜻蛉の翅）：攻撃すると狙った方へ空を切って急襲（その間無敵）、通り道の敵を鋭い爪で斬り最後に引っかく · 爪10種（二回斬り・風の刃・毒・雷・霜・吸血・蜃気楼・影・羽の刃）· 専用アイテム10",
        "新キャラ「長老」（陣法）：攻撃すると敵の場所に四角い陣を敷き少し後に発動 · 陣法10種（蔓の門・五剣陣の火柱・挟壁陣の両側の壁・陥穽陣・落剣陣の降る剣・雷印陣・氷結陣・風籠陣・岩拳陣の岩の拳・天元陣）· 専用アイテム10",
      ],
    },
  },
];
