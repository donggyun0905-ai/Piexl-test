import type { PatchNote } from "./types";

// 지난 버전 기록 (고치지 않음)
export const NOTES: PatchNote[] = [
  {
    version: "0.48.114",
    date: "2026-10-26",
    items: {
      ko: ["관리자 페이지의 시험(test) 서버 주소를 새 서버로 바꿈"],
      en: ["The admin page now points to the new test server"],
      ja: ["管理者ページの試験（test）サーバーのアドレスを新しいサーバーに変更"],
    },
  },
  {
    version: "0.48.113",
    date: "2026-10-26",
    items: {
      ko: [
        "테라코어 시즌 2 새 캐릭터 '오토마타' (미완성): 처음 자아를 가진 기계 인형 · 모든 무기의 기본 공격이 손에서 쏘는 레이저 · 자매 인형 셋이 곁에서 함께 쏘는 무기, 등 뒤에서 연기를 뿜는 유도 미사일이 7발 넘게 솟는 무기 등 레이저 무기 10 · 전용 아이템 10",
        "테라코어 시즌 2 새 캐릭터 '라이더' (미완성): 진한 파랑 스포츠 오토바이를 탄 검은 가죽 재킷의 폭주족 · 빠를수록 피해가 커지고, 달린 거리만큼 옆 게이지가 차서 가득 차면 둘레 펄스 · 기계 망치·펄스건·암살 단검·레일건·니트로 부스터 등 무기 10 · 전용 아이템 10",
        "테라코어 시즌 2 새 캐릭터 '붐버' (미완성): '폭발은 예술이다' · 모든 무기가 터지고, 1초 안에 잇따라 터지면 예술 연쇄로 폭발이 커지며, 터져 쓰러진 적 자리에 여진 · 수류탄·끈끈이 폭탄·집속탄·지뢰·불꽃놀이·메가 폭탄 등 무기 10 · 전용 아이템 10",
        "테라코어 시즌 2 새 캐릭터 '아티팩터' (미완성): 두 팔에 푸른빛 문신이 가득한 제작자 · 무기는 리펄스 총 하나 · 쓰러뜨린 적 20마다 아이템을 직접 만들고, 12% 확률로 제작으로만 나오는 숨겨진 아이템 5개 중 하나 · 전용 아이템 10 + 숨겨진 5",
        "테라코어 시즌 2 새 캐릭터 '펑크' (미완성): 네온 머리와 크롬 팔의 사이버 전사 · 열선 카타나·모노와이어·스마트 건·맨티스 블레이드·퀵해킹 등 무기 10 · 몸에 심는 능력 10 · 맞힐수록 차는 '신경 가속'을 대시로 켜면 4초 동안 둘레의 시간이 느려지고 공격이 빨라지며 잔상이 남음",
        "캐릭터 선택창에서 아직 다 만들지 않은 캐릭터 이름 옆에 (미완성) 표시",
      ],
      en: [
        "New Terracore Season 2 character 'Automata' (WIP): the first mechanical doll to gain a self · every weapon's basic attack is a laser from her hand · 10 laser weapons including three sister dolls that fire beside her and 7+ smoking homing missiles launched from her back · 10 exclusive items",
        "New Terracore Season 2 character 'Rider' (WIP): a biker in black leather on a deep-blue sport bike · the faster he goes the harder he hits, and the gauge beside him fills with distance driven, bursting into a pulse when full · 10 weapons such as Mech Hammer, Pulse Gun, Assassin's Dagger, Railgun and Nitro Booster · 10 exclusive items",
        "New Terracore Season 2 character 'Bomber' (WIP): 'explosions are art' · every weapon explodes, blasts within a second of each other build an Art Chain that grows them, and foes felled by blasts leave aftershocks · 10 weapons such as Grenade, Sticky Bomb, Cluster Bomb, Land Mine, Fireworks and Mega Bomb · 10 exclusive items",
        "New Terracore Season 2 character 'Artifacter' (WIP): a maker with glowing blue tattoos all over his arms · his only weapon is the Repulsor Gun · every 20 foes defeated he crafts an item himself, with a 12% chance of one of 5 hidden items only crafting can make · 10 exclusive items + 5 hidden",
        "New Terracore Season 2 character 'Punk' (WIP): a cyber fighter with neon hair and a chrome arm · 10 weapons such as Thermal Katana, Monowire, Smart Gun, Mantis Blades and Quickhack · 10 implanted abilities · dash with a full 'Neural Accel' gauge to slow time around her for 4s, attacking faster and leaving afterimages",
        "Characters still in progress show (WIP) next to their name on the character select screen",
      ],
      ja: [
        "テラコアのシーズン2新キャラ「オートマタ」（未完成）：初めて自我を持った機械人形 · すべての武器の基本攻撃は手から撃つレーザー · そばで一緒に撃つ姉妹人形3体、背中から煙を吐く誘導ミサイル7発以上などレーザー武器10 · 専用アイテム10",
        "テラコアのシーズン2新キャラ「ライダー」（未完成）：濃い青のスポーツバイクに乗った黒い革ジャンの暴走族 · 速いほどダメージが上がり、走った距離で横のゲージが溜まり満タンで周囲にパルス · 機械ハンマー・パルスガン・暗殺ダガー・レールガン・ニトロブースターなど武器10 · 専用アイテム10",
        "テラコアのシーズン2新キャラ「ボマー」（未完成）：「爆発は芸術だ」 · すべての武器が爆発し、1秒以内の連続爆発で芸術連鎖が溜まり爆発が大きくなり、爆発で倒れた敵の跡に余震 · 手榴弾・粘着爆弾・クラスター爆弾・地雷・花火・メガ爆弾など武器10 · 専用アイテム10",
        "テラコアのシーズン2新キャラ「アーティファクター」（未完成）：両腕に青く光る刺青が満ちた製作者 · 武器はリパルスガン一つ · 敵を20体倒すごとにアイテムを自ら作り、12%で製作でしか出ない隠しアイテム5つのうち一つ · 専用アイテム10＋隠し5",
        "テラコアのシーズン2新キャラ「パンク」（未完成）：ネオンの髪とクロームの腕のサイバー戦士 · 熱線カタナ・モノワイヤー・スマートガン・マンティスブレード・クイックハックなど武器10 · 体に埋め込む能力10 · 当てるほど溜まる「神経加速」をダッシュで発動すると4秒間周囲の時間が遅くなり、攻撃が速くなり残像が残る",
        "キャラ選択画面で、まだ完成していないキャラの名前の横に（未完成）と表示",
      ],
    },
  },
  {
    version: "0.48.112",
    date: "2026-10-26",
    items: {
      ko: [
        "헬리오스 시즌 2 다섯 명(역병의사·학살자·이터·묵인·사멸)에 테마 스킨 9개(수영복·크리스마스·할로윈·학생·설날·일본·중국·미국·성별 바꾸기)가 생김",
        "한정 스킨 '여름 파도'에 헬리오스 다섯 명 추가: 학살자는 진홍 프릴 비키니·비치 스카프·히비스커스, 사멸은 보랏빛 비키니·파레오, 역병의사는 가면 그대로 알로하 셔츠·밀짚모자, 묵인은 구조원, 이터는 상어 수영복",
        "로비 펫의 능력치(이동 속도·사거리)가 판 시작부터 능력치 창에 바로 반영되고, 병아리 치명타·슬라임 받는 피해·황금 거북 돈·불사조 부활도 능력치 창에 보임",
      ],
      en: [
        "The five Helios Season 2 characters (Plague Doctor, Slayer, Eater, Mukin, Samyeol) get 9 theme skins (Swimsuit, Christmas, Halloween, School, New Year, Japan, China, USA, Gender Swap)",
        "The five Helios characters join the limited 'Summer Wave' skin: Slayer in a crimson frilled bikini with a beach scarf and hibiscus, Samyeol in a violet bikini and pareo, Plague Doctor keeps the mask with an aloha shirt and straw hat, Mukin as a lifeguard, Eater in a shark swimsuit",
        "Lobby pet stats (move speed, range) now show in the stats panel from the start of a run, and Chick crit, Slime damage taken, Golden Turtle gold and Phoenix revive are listed too",
      ],
      ja: [
        "ヘリオスのシーズン2の5人（疫病医・虐殺者・イーター・黙忍・死滅）にテーマスキン9種（水着・クリスマス・ハロウィン・学生・正月・日本・中国・アメリカ・性別反転）が登場",
        "限定スキン「夏の波」にヘリオスの5人を追加：虐殺者は真紅のフリルビキニ・ビーチスカーフ・ハイビスカス、死滅は紫のビキニ・パレオ、疫病医は仮面のままアロハシャツ・麦わら帽子、黙忍はライフガード、イーターはサメ水着",
        "ロビーペットの能力値（移動速度・射程）が開始時から能力値ウィンドウに反映され、ヒヨコのクリティカル・スライムの被ダメージ・黄金ガメのゴールド・不死鳥の復活も表示",
      ],
    },
  },
  {
    version: "0.48.111",
    date: "2026-10-26",
    items: {
      ko: [
        "학살자: 평소엔 흡혈하지 않고 피의 학살(게이지 가득) 중에만 입힌 피해의 50%를 흡혈 · 공격으로 줄어드는 체력의 하한 20 → 40 · 받는 피해 +50% · 기본 공격력 11 → 16 · 피의 학살 중에는 대낫 날의 절반이 피로 젖고 날에 찢어진 입이 웃으며, 피에 젖은 몸·광기 어린 붉은 눈·둥실 떠오른 머리카락의 모습으로 바뀜",
        "이터: 재생력 상한 20 → 100 (끝없는 허기 150) · 재생력 10마다 공격력 +3 · 연타·세 번 씹기·낚아채기도 둘레를 함께 무는 범위 공격으로",
        "사멸: 독·불 같은 상태이상 피해에도 치명타가 뜨고, 상태이상 치명타는 2배 · 독침 10개 모두 공격 속도 +0.5",
        "공격 소리가 없던 캐릭터(원소술사·야수·베두인·장수·악의 사도·오니·변희·플라이·장로·렌·역병의사·이터·묵인·별지기 등)도 공격할 때 소리가 남",
      ],
      en: [
        "Slayer: no lifesteal normally, only 50% during Blood Massacre (full gauge) · attacks can't drop her below 40 HP (was 20) · takes 50% more damage · base damage 11 → 16 · during Blood Massacre half the scythe blade is soaked in blood and a torn mouth grins on it, and she turns blood-soaked with crazed red eyes and hair floating in the air",
        "Eater: regen cap 20 → 100 (150 with Endless Hunger) · +3 damage per 10 regen · barrage, triple bite and ambush now bite an area",
        "Samyeol: status damage like poison and burn can crit, and status crits deal double · all 10 needle weapons get +0.5 attack speed",
        "Characters that had no attack sound (Elementalist, Beastkin, Bedouin, General, Apostle of Malice, Oni, Byeonhui, Fly, Elder, Ren, Plague Doctor, Eater, Mukin, Stargazer and more) now make sounds when attacking",
      ],
      ja: [
        "虐殺者：普段は吸血せず、血の虐殺（ゲージ満タン）中だけ与ダメージの50%を吸血 · 攻撃で減る体力の下限20 → 40 · 被ダメージ+50% · 基本攻撃力11 → 16 · 血の虐殺中は大鎌の刃の半分が血に濡れて刃に裂けた口が笑い、血に濡れた体・狂気の赤い目・宙に浮く髪の姿に変わる",
        "イーター：再生力の上限20 → 100（果てなき飢えで150）· 再生力10ごとに攻撃力+3 · 連打・三度噛み・捕食も周りをまとめて噛む範囲攻撃に",
        "死滅：毒・炎などの状態異常ダメージにもクリティカルが出て、状態異常のクリティカルは2倍 · 毒針10本すべて攻撃速度+0.5",
        "攻撃音がなかったキャラ（元素術師・獣人・ベドウィン・武将・悪の使徒・鬼・ビョンヒ・フライ・長老・レン・疫病医・イーター・黙忍・星守りなど）も攻撃時に音が鳴る",
      ],
    },
  },
];
