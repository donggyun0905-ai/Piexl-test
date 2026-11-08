// 캐릭터 설명: 새벽의 성흔 (블루 플레임) · 한·영·일 (수치는 weaponsBlueFlame·itemsBlueFlame·weaponsDawn과 맞춤, dawn4가 커서 나눔)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_DAWN5: Guide = {
  blueFlame: [
    "새벽의 성흔 · 블루 플레임 '청염의 맹인' · 시각을 잃은 대신 악마의 사악한 기운을 푸른 불꽃으로 감지하고 그 영혼을 태워 버리는 마법 전사 · 체력 100 · 공격력 14 · 방어력 1 · 이동 1.3 · 행운 2 · 스킬 없음(성흔 게이지)",
    "세 겹 범위: 몸 둘레에 늘 보임 (사거리 보기를 꺼도) · 안쪽 진한 파랑(사거리의 34%) · 가운데 연한 파랑(67%) · 바깥 더 연한 파랑(사거리 150)",
    "푸른 불꽃 활 (누르고 있으면): 조준한 쪽(양옆 60도)에서 가장 가까운 적이 · 안쪽이면 불꽃 감옥 145% (반지름 24, 0.5초 가둠) · 가운데면 불꽃 기둥 115% (반지름 16) · 바깥이면 화살 90% · 범위에 적이 없으면 조준한 쪽으로 화살",
    "청염: 모든 공격에 걸림 · 2.5초 동안 0.5초마다 공격력의 32% (보통 화상 25%보다 셈) · 걸린 적 머리 위 푸른 불꽃 · 피해 숫자는 아래 진한 파랑 → 위 옅은 파랑",
    "성흔 차는 양: 맞힐 때 2 · 처치 4 (최대 100)",
    "열화상 각성 (6초): 화면이 까매지고 적 모양만 푸르게 보임 · 몸은 사라지고(무적·제자리) 화면 아래 거대한 푸른 불꽃 활 · 누른 곳을 직접 조준해 거대한 화살 폭격 (반지름 44, 240%, 자동 조준이면 가까운 적) · 대시하면 바로 풀림 · 끝나면 다시 나타나고 잠깐 무적",
    "무기 1: 청염의 활 · 무기 대신 아이템이 나옴",
    "전용 아이템 20: 활 5 (빠른 시위 · 청염 깃 · 갈래 화살 · 불씨 화살 · 넓은 감각) · 감옥 5 (청염 감옥 · 단단한 감옥 · 감옥 붕괴 · 봉인 · 가까운 공포) · 기둥 5 (솟는 불길 · 쌍기둥 · 불기둥 폭 · 불기둥 밀침 · 남는 불꽃) · 청염·각성 5 (푸른 날개: 공격할 때 12% 확률로 날개가 돋고 머리 위 활 7개가 앞쪽 바닥에 비스듬히 화살비 70% · 영혼 소각 · 맹인의 감각 · 거대한 화살 · 꺼지지 않는 불)",
  ],
};

export const GUIDE_EN_DAWN5: Guide = {
  blueFlame: [
    "Stigma of Dawn · Blue Flame 'The Blind of Blue Fire' · a magic warrior who lost his sight but senses demonic malice as blue flames and burns their souls away · HP 100 · Damage 14 · Defense 1 · Move 1.3 · Luck 2 · no skills (Stigma gauge)",
    "Three rings: always shown around you (even with range display off) · inner deep blue (34% of range) · middle light blue (67%) · outer pale blue (range 150)",
    "Bow of blue fire (hold): the nearest foe where you aim (60° each side) gets · inner ring: Flame Prison 145% (radius 24, traps 0.5s) · middle ring: Flame Pillar 115% (radius 16) · outer ring: an arrow 90% · with no foe in range, an arrow flies where you aim",
    "Blue Flame: every attack inflicts it · 32% of damage every 0.5s for 2.5s (stronger than a normal 25% burn) · a blue flame over afflicted foes · its numbers fade from deep blue at the bottom to pale blue at the top",
    "Stigma gain: 2 per hit · 4 per kill (max 100)",
    "Thermal Awakening (6s): the screen goes black and only foe shapes glow blue · your body vanishes (invulnerable, rooted) and a giant bow of blue fire appears at the bottom of the screen · aim yourself to bombard with giant arrows (radius 44, 240%; auto-aim targets the nearest foe) · dashing ends it at once · you reappear with brief invulnerability",
    "Weapon 1: Blue Flame Bow · items drop instead of weapons",
    "20 exclusive items: Bow 5 (Quick Draw · Blue Fletching · Split Arrow · Ember Arrow · Wide Sense) · Prison 5 (Blue Prison · Sturdy Cage · Prison Collapse · Seal · Close Terror) · Pillar 5 (Rising Blaze · Twin Pillars · Pillar Breadth · Pillar Shove · Lingering Flame) · Flame & Awakening 5 (Blue Wings: 12% chance on attack to sprout wings while 7 bows above your head rain arrows at an angle onto the ground ahead, 70% · Soul Burn · Blind Sense · Giant Arrow · Undying Flame)",
  ],
};

export const GUIDE_JA_DAWN5: Guide = {
  blueFlame: [
    "夜明けの聖痕 · ブルーフレイム「青炎の盲者」· 視力を失った代わりに悪魔の邪悪な気配を青い炎として感じ取り、その魂を焼き尽くす魔法戦士 · 体力100 · 攻撃力14 · 防御力1 · 移動1.3 · 幸運2 · スキルなし（聖痕ゲージ）",
    "三重の範囲：体の周りに常に表示（射程表示をオフにしても）· 内側は濃い青（射程の34%）· 真ん中は薄い青（67%）· 外側はさらに薄い青（射程150）",
    "青い炎の弓（押し続ける）：狙った方向（左右60度）で一番近い敵が · 内側なら炎の牢獄145%（半径24、0.5秒閉じ込める）· 真ん中なら炎の柱115%（半径16）· 外側なら矢90% · 範囲に敵がいなければ狙った方向に矢",
    "青炎：全ての攻撃でかかる · 2.5秒間0.5秒ごとに攻撃力の32%（通常の火傷25%より強い）· かかった敵の頭上に青い炎 · ダメージの数字は下が濃い青→上が薄い青",
    "聖痕の溜まる量：命中2 · 撃破4（最大100）",
    "熱感知覚醒（6秒）：画面が暗くなり敵の形だけが青く見える · 体は消え（無敵・その場に固定）画面下に巨大な青い炎の弓 · 狙った場所を直接狙って巨大な矢で爆撃（半径44、240%、自動照準なら近い敵）· ダッシュするとすぐ解除 · 終わると再び現れ少し無敵",
    "武器1：青炎の弓 · 武器の代わりにアイテムが出る",
    "専用アイテム20：弓5（早引きの弦・青炎の矢羽・分かれ矢・火種の矢・広い感覚）· 牢獄5（青炎の牢獄・堅い牢獄・牢獄崩壊・封印・間近の恐怖）· 柱5（噴き上がる炎・双柱・炎柱の幅・炎柱の押し出し・残り火）· 青炎・覚醒5（青い翼：攻撃時12%で翼が生え、頭上の弓7つから前方の地面に斜めに矢の雨70% · 魂の焼却・盲目の感覚・巨大な矢・消えない炎）",
  ],
};
