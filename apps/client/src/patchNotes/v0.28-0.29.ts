import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.29.0",
    date: "2026-10-20",
    items: {
      ko: [
        "새 캐릭터 '기계공학자': 누르고 있으면 레이저를 계속 쏘아 적을 녹입니다. 0.15초마다 틱 피해를 주고, 공격 속도가 오르면 간격이 짧아집니다 (최소 약 0.03초). 레이저는 빗나가지 않지만 사거리가 짧고 첫 적이나 벽에서 멈춥니다",
        "기계공학자 전용 무기 10개: 무기를 바꾸면 공격 방식이 그 무기의 것으로 바뀝니다. 레이저 포탑(포탑 던지기) · 반사 거울 드론(드론 3기) · 집속 렌즈 캐논(한 대상 레이저) · 플라즈마 커터(부채꼴 화염) · 테슬라 코일(연쇄 번개) · 자기장 발생기(끌어당겼다 터뜨리는 자력 펄스) · 유압 해머(내려찍기·기절) · 과부하 리액터(가득 차면 두 배) · 지뢰 투척기(지뢰 던지기) · 궤도 위성 포(조준한 곳에 낙하). 시작 무기는 레이저 발사기",
        "기계공학자 전용 아이템 10개: 고출력 렌즈 · 빔 스플리터 · 열 축적 · 집속 코일 · 굴절 프리즘 · 냉각 시스템 · 과부하 방출 · 에너지 회수(보호막) · 장갑 용해 · 오버클럭",
        "업적 '기술자의 귀환'(기계공학자로 클리어) 추가. '모두의 탈출'은 이제 기계공학자까지 다섯 캐릭터 모두 클리어해야 합니다 (이미 얻은 업적은 그대로)",
      ],
      en: [
        "New character: Engineer. Hold attack to keep a laser on enemies and melt them. The beam deals tick damage every 0.15s, and attack speed shortens the interval (down to about 0.03s). It never misses, but it has short range and stops at the first enemy or wall",
        "10 Engineer weapons, each changing how you attack: Laser Turret (throw turrets) · Mirror Drones (3 drones) · Focus Lens Cannon (single-target laser) · Plasma Cutter (cone of flame) · Tesla Coil (chain lightning) · Magnetic Field Generator (pull in, then a magnetic pulse) · Hydraulic Hammer (slam and stun) · Overload Reactor (double damage when charged) · Mine Thrower (throw mines) · Orbital Cannon (strikes where you aim). Starts with the Beam Emitter",
        "10 Engineer items: High-Power Lens · Beam Splitter · Heat Buildup · Focus Coil · Refraction Prism · Cooling System · Overload Discharge · Energy Recovery (shield) · Armor Melt · Overclock",
        "New achievement: Engineer's Return (clear as the Engineer). Everyone Escapes now needs clears with all five characters, including the Engineer (already earned achievements stay)",
      ],
      ja: [
        "新キャラクター「エンジニア」：押し続けるとレーザーを照射し続けて敵を溶かします。0.15秒ごとにティックダメージを与え、攻撃速度が上がると間隔が短くなります（最短約0.03秒）。レーザーは外れませんが射程が短く、最初の敵や壁で止まります",
        "エンジニア専用武器10種：武器を替えると攻撃方法がその武器のものに変わります。レーザー砲台（砲台を投げる） · 反射ミラードローン（ドローン3機） · 集束レンズキャノン（単体レーザー） · プラズマカッター（扇形の炎） · テスラコイル（連鎖する稲妻） · 磁場発生器（引き寄せて弾く磁力パルス） · 油圧ハンマー（叩きつけ・気絶） · 過負荷リアクター（たまると2倍） · 地雷投擲機（地雷を投げる） · 軌道衛星砲（狙った場所に落下）。初期武器はレーザー発振器",
        "エンジニア専用アイテム10種：高出力レンズ · ビームスプリッター · 熱蓄積 · 集束コイル · 屈折プリズム · 冷却システム · 過負荷放出 · エネルギー回収（シールド） · 装甲溶解 · オーバークロック",
        "実績「技術者の帰還」（エンジニアでクリア）を追加。「全員脱出」はエンジニアを含む5キャラクターすべてでのクリアが必要になりました（獲得済みの実績はそのまま）",
      ],
    },
  },
  {
    version: "0.28.1",
    date: "2026-10-20",
    items: {
      ko: [
        "음양사 부적이 몬스터 몸에 붙습니다: 몬스터마다 붙은 부적 수를 따로 세고, 추가 효과가 터지면 붙어 있던 부적이 떨어져 사라집니다 (다른 종류의 부적에 맞으면 새로 셈)",
        "벚꽃 부적이 3배 느려져 거의 제자리에 떠 있듯 천천히 흘러갑니다",
        "어둠의 부적·유도 부적이 종이 부적 모양(보라 테두리)으로 보입니다",
      ],
      en: [
        "Talismans now stick to monsters: each monster counts its own talismans, and when the bonus triggers, the stuck talismans fall off and vanish (a different kind of talisman starts a new count)",
        "The Blossom Talisman is 3 times slower and drifts along almost in place",
        "The Dark Talisman and homing talismans now look like paper talismans (purple border)",
      ],
      ja: [
        "陰陽師の符がモンスターに貼り付くようになりました：モンスターごとに貼られた符の数を数え、追加効果が発動すると貼り付いていた符がはがれて消えます（違う種類の符が当たると数え直し）",
        "桜の符が3倍遅くなり、ほとんどその場に浮かぶようにゆっくり流れます",
        "闇の符・追尾する符が紙の符の見た目（紫の縁）になりました",
      ],
    },
  },
  {
    version: "0.28.0",
    date: "2026-10-20",
    items: {
      ko: [
        "새 캐릭터 '음양사': 부적을 맞힐 때마다 쌓여 무기마다 다른 추가 효과가 터집니다. 시작 무기는 수제 부적(맞힐수록 강해지고 5번째에 강한 공격)",
        "음양사 전용 부적 10개: 수제·강력한(주변 3명)·수양(붙어서 도트, 3장까지)·번개(벽 통과, 3번째 추가 공격)·불꽃(불탐, 5번째 3배 폭발)·얼음(5번째 1.5초 경직)·벚꽃(아주 느린 꽃잎, 5번째 폭발)·빛(3번째 밀침)·어둠(부채꼴 5장, 5번째 유도 부적)·땅(사거리 무제한, 지나가는 자리 피해, 5번째 공격 속도 증가). 음양사는 부적만 얻습니다",
        "음양사 전용 아이템 10개: 마음가짐·마음의 눈·음기·양기·결계·옥구슬·사인·영역·흡생·반야",
        "업적 '음양사의 귀환'(음양사로 클리어) 추가. '모두의 탈출'은 이제 네 캐릭터 모두 클리어해야 합니다 (이미 얻은 업적은 그대로)",
      ],
      en: [
        "New character: the Talisman Master. Talisman hits build up and unleash a different bonus per weapon. Starts with the Handmade Talisman (grows stronger with each hit, the 5th is a powerful strike)",
        "10 Talisman Master weapons: Handmade, Mighty (3 nearby enemies), Discipline (sticks and deals damage over time, up to 3), Thunder (through walls, extra strike every 3rd), Flame (burns, 3x blast every 5th), Ice (1.5s stun every 5th), Blossom (very slow petals, blast every 5th), Light (knockback every 3rd), Dark (5 in a fan, homing talisman every 5th), Earth (unlimited range, damages its path, attack speed up every 5th). The Talisman Master only finds talismans",
        "10 Talisman Master items: Resolve, Mind's Eye, Yin Energy, Yang Energy, Barrier, Jade Bead, Death Seal, Domain, Life Siphon, Prajna",
        "New achievement: Talisman Master's Return (clear as the Talisman Master). Everyone Escapes now needs all four characters (already earned achievements stay)",
      ],
      ja: [
        "新キャラクター「陰陽師」：符を当てるたびに溜まり、武器ごとに違う追加効果が発動します。初期武器は手製の符（当てるほど強くなり5回目に強い攻撃）",
        "陰陽師専用の符10種：手製・強力（周りの3体）・修養（貼り付いて継続ダメージ、3枚まで）・雷（壁を通り抜け、3回目に追加攻撃）・炎（燃える、5回目に3倍の爆発）・氷（5回目に1.5秒硬直）・桜（とても遅い花びら、5回目に爆発）・光（3回目に押し返す）・闇（扇状に5枚、5回目に追尾する符）・大地（射程無制限、通り道にダメージ、5回目に攻撃速度アップ）。陰陽師は符だけを手に入れます",
        "陰陽師専用アイテム10種：心構え・心眼・陰の気・陽の気・結界・玉の珠・死印・領域・吸生・般若",
        "実績「陰陽師の帰還」（陰陽師でクリア）を追加。「全員脱出」は4人全員でのクリアが必要になりました（獲得済みの実績はそのまま）",
      ],
    },
  },
];
