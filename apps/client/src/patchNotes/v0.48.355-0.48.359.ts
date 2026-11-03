import type { PatchNote } from "./types";

export const NOTES: PatchNote[] = [
  {
    version: "0.48.359",
    date: "2026-11-03",
    items: {
      ko: [
        "새 캐릭터 수집가 (테라코어): 등에 무기를 잔뜩 짊어진 푸른 머리의 무기 수집가 · 무기는 잃지 않는 수집가의 검 하나 + 바닥·상자·상점에서 모으는 수집 무기 30 (검·활·지팡이·창·망치·도끼·마법서·건틀릿 등, 무기마다 작은 능력치)",
        "수집가 콤보: 공격마다 한 칸씩 기본 검 → 얻은 차례대로 수집 무기의 기술 · 하나 얻을 때마다 콤보가 한 칸 늘고, 모은 무기는 등 뒤 위 공중에 줄지어 뜸",
        "수집가 기본 패시브: 콤보에 쓴 무기는 등 뒤에서 사라져 방 어딘가에 날아가 박힘 → 몸이 닿으면 그 자리에서 그 기술이 바로 터지고(공격 주기와 따로, 120%) 등 뒤로 돌아옴 · 방을 나가면 저절로 돌아옴 · 기술 이펙트는 무기 색",
        "수집가 패왕전: 스킬 넷(푸른 창 던지기·공허 구슬·붉은 발도·서른 자루 폭풍) · 전용 패시브 '수집품의 무게' (등 뒤 수집 무기 하나마다 평타 +4%, 최대 +30%) · 역할 전사",
      ],
      en: [
        "New character Collector (Terracore): a blue-haired weapon collector with a back full of blades · his only weapon is the Collector's Blade (never lost), plus 30 collectibles gathered from floors, chests and shops (swords, bows, staves, spears, hammers, axes, tomes, gauntlets and more, each with a small stat)",
        "Collector combo: one step per attack — blade → each collectible's technique in the order obtained · every new collectible adds a step, and the collection floats in a row above his back",
        "Collector passive: a weapon used in the combo vanishes from his back and sticks somewhere in the room → touch it to unleash its technique on the spot (apart from the attack cycle, 120%) and it returns · leaving the room brings them back · effects take each weapon's color",
        "Collector in the Paewang arena: 4 skills (Azure Javelin, Void Orb, Crimson Draw, Storm of Thirty Blades) · passive 'Weight of the Hoard' (+4% basic damage per collectible on his back, up to +30%) · Warrior role",
      ],
      ja: [
        "新キャラクター コレクター（テラコア）：背中に武器をどっさり背負った青髪の武器コレクター · 武器は失わないコレクターの剣一つ＋床・宝箱・ショップで集める収集武器30（剣・弓・杖・槍・大槌・斧・魔導書・籠手など、武器ごとに小さな能力値）",
        "コレクターのコンボ：攻撃ごとに一段ずつ基本の剣 → 手に入れた順に収集武器の技 · 一つ手に入れるたびにコンボが一段伸び、集めた武器は背中の上の空中に並んで浮かぶ",
        "コレクターの基本パッシブ：コンボで使った武器は背中から消えて部屋のどこかに飛んで刺さる → 体が触れるとその場で技がすぐ炸裂し（攻撃周期とは別、120%）背中に戻る · 部屋を出ると自動で戻る · 技のエフェクトは武器の色",
        "コレクターの覇王戦：スキル4つ（蒼槍投げ・虚空珠・紅の抜刀・三十振りの嵐）· 専用パッシブ「収集品の重み」（背中の収集武器1つごとに通常攻撃+4%、最大+30%）· 役割 戦士",
      ],
    },
  },
  {
    version: "0.48.358",
    date: "2026-11-02",
    items: {
      ko: ["하이오크 큰 도트 다시 그림 (붉은 피부·상투·뼈 가시 어깨 갑옷·엄니·해골 허리띠·양날 도끼) · 휘두르기 직전 노랗게 깜빡이지 않고 도끼를 치켜든 모습으로 예고"],
      en: ["High Orc redrawn as big pixel art (red skin, topknot, bone-spiked pauldron, tusks, skull belt, double axe) · no more yellow flashing before a swing; it telegraphs by raising its axe"],
      ja: ["ハイオークを大きなドットで描き直し（赤い肌・まげ・骨トゲの肩当て・牙・ドクロのベルト・両刃斧）· 振り下ろし前に黄色く点滅せず、斧を振り上げた姿で予告"],
    },
  },
  {
    version: "0.48.357",
    date: "2026-11-02",
    items: {
      ko: ["하이오크 몸이 커지고 도끼 범위도 넓어짐"],
      en: ["High Orc: bigger body and wider axe reach"],
      ja: ["ハイオーク：体が大きくなり斧の範囲も広く"],
    },
  },
  {
    version: "0.48.356",
    date: "2026-11-02",
    items: {
      ko: [
        "새 몬스터(3층부터): 쇠사슬 간수(사슬이 날아갈 길이 먼저 보이고, 맞으면 피해 + 간수 쪽으로 끌려감 · 대시나 길 밖으로 피함) · 하이오크(큰 도끼 반원 휘두르기·맞으면 출혈, 체력이 적을수록 빨라지고 세짐 · 붉은 기운)",
      ],
      en: [
        "New monsters (from floor 3): Chain Warden (its chain's path shows first; a hit deals damage and drags you toward it · dash or step off the path) · High Orc (half-circle great-axe swings that cause Bleed; the lower its HP, the faster and stronger it gets · red aura)",
      ],
      ja: [
        "新モンスター（3階から）：鎖の看守（鎖の飛ぶ道が先に見え、当たるとダメージ + 看守の方へ引き寄せられる · ダッシュか道の外へ避ける）· ハイオーク（大斧の半円振り・当たると出血、体力が少ないほど速く強くなる · 赤いオーラ）",
      ],
    },
  },
  {
    version: "0.48.355",
    date: "2026-11-02",
    items: {
      ko: [
        "시련의 방 뒤 몬스터 강화: 얻은 시련 점수 비율만큼 그 뒤 모든 몬스터·보스의 체력(700점에 +35%)·주는 피해(+25%)가 오름 · 700점을 넘긴 몫은 그대로라 그만큼 강해짐",
        "시련 '다섯 보스': 보스 다섯이 한꺼번에 나오고 사용 아이템 금지 · 무리 시련은 5물결, 한 물결 몬스터 수 증가 · 암흑 시련은 내 몸 둘레 말고는 완전히 깜깜",
        "새 몬스터(2층부터): 폭발풍뎅이(빠르게 달라붙어 1.5초 뒤 폭발 + 화상, 대시로 떼어 냄) · 스켈레톤 궁병(얇은 선으로 겨누다 깜빡이면 매우 빠른 화살)",
      ],
      en: [
        "Monsters grow after Trial Rooms: by the share of trial points earned, all later monsters and bosses gain HP (+35% at 700 pts) and damage (+25%) · points beyond 700 add nothing, so you come out ahead",
        "Trial 'Five Bosses': five bosses appear at once and items are sealed · horde trials now have 5 waves with more monsters per wave · the darkness trial is pitch black except right around you",
        "New monsters (from floor 2): Blast Beetle (clings to you and explodes after 1.5s with Burn; dash to shake it off) · Skeleton Archer (aims with a thin line; when it blinks, a lightning-fast arrow flies)",
      ],
      ja: [
        "試練の部屋の後のモンスター強化：得た試練点数の割合で以後の全モンスター・ボスの体力（700点で+35%）・与ダメージ（+25%）が上がる · 700点を超えた分は上がらず、その分強くなれる",
        "試練「五体のボス」：ボス5体が同時に出現し使用アイテム禁止 · 群れの試練は5波、1波のモンスター数増加 · 暗黒の試練は自分の周り以外が真っ暗",
        "新モンスター（2階から）：爆発コガネ（素早く張り付き1.5秒後に爆発 + 火傷、ダッシュで振り払う）· スケルトン弓兵（細い線で狙い、点滅すると非常に速い矢）",
      ],
    },
  },
];
