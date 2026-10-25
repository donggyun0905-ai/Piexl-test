// 캐릭터 설명: 시즌 2 테라코어 (오토마타·라이더·붐버·아티팩터·펑크) · 한·영·일
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_T2: Guide = {
  punk: [
    "테라코어 · 펑크 · 네온 머리와 크롬 팔의 매혹적인 여자 · 체력 95 · 빠름 · 행운 1",
    "사이버 무기 10: 열선 카타나 · 모노와이어(출혈) · 스마트 건(휘는 총알) · 맨티스 블레이드 · 네온 산탄총 · 관통 권총 · 퀵해킹(감전·멈춤) · 고릴라 팔 · EMP 수류탄 · 네온 쌍검",
    "신경 가속: 맞힐 때마다 오른쪽 옆 게이지가 차고, 가득일 때 대시하면 4초 동안 둘레의 시간이 느려짐 (적·적 탄이 느려지고 내 공격은 1.6배 빨라지며 잔상이 남음, 보스는 느려지지 않음)",
    "전용 아이템은 몸에 심는 능력 10: 크롬 눈(치명타) · 반사 신경 · 가속기 증폭 · 빠른 충전 · 광전사 칩 · 혈액 정화기 · 피하 장갑 · 광학 위장 · 오버클럭 · 잔상 분신",
  ],
  bomber: [
    "테라코어 · 붐버 · '폭발은 예술이다' · 체력 105",
    "모든 무기가 터짐 · 1초 안에 잇따라 터지면 '예술 연쇄'가 한 칸씩 쌓여 폭발 피해·반경이 커짐 (최대 10칸)",
    "폭발로 쓰러진 적 자리에서 여진이 한 번 더 터짐",
    "수류탄 · 끈끈이 폭탄 · 집속탄 · 지뢰(밟으면) · 로켓 · 다이너마이트 셋 · 불꽃놀이(별 모양 여덟 번) · 네이팜(불바다) · 연쇄 폭약 · 메가 폭탄",
  ],
  artifacter: [
    "테라코어 · 아티팩터 · 두 팔에 푸른빛 문신이 가득한 제작자 · 체력 100 · 행운 1",
    "무기는 리펄스 총 하나: 푸른 반발탄이 맞은 자리를 터뜨리며 둘레 적을 밀어냄",
    "쓰러뜨린 적 20마다 오른쪽 옆 제작 게이지가 차서 아이템 하나를 직접 만들어 바로 가짐",
    "만드는 아이템은 보통 아이템이지만, 12% 확률로 제작으로만 나오는 숨겨진 아이템 5개(불사의 문신·과부하 문양·수호 골렘 문신·특이점·무한 회로) 중 하나",
  ],
  automata: [
    "테라코어 · 오토마타 · 처음으로 자아를 가진 기계 인형 · 체력 100",
    "모든 무기의 기본 공격은 손에서 쏘는 레이저 · 가까운 적을 향해 꿰뚫는 레이저를 쏘고, 다시 쏘고",
    "자매 인형: 똑같이 생긴 오토마타 셋이 곁에 줄지어 따라오며 따로 레이저를 쏨 · 미사일 포드: 쏠 때마다 45% 확률로 등 뒤에서 연기를 뿜는 유도 미사일 7~11발",
    "쌍둥이·프리즘(갈라짐)·과충전 캐논·부채·구속·궤도 위성(세 번째마다 빛기둥)·전탄 발사(늘 미사일 12발 넘게)",
  ],
  rider: [
    "테라코어 · 라이더 · 오토바이를 탄 폭주족 · 체력 110 · 아주 빠름",
    "빠를수록 피해가 커짐: 지금 달리는 빠르기와 이동 속도 능력치만큼 모든 공격이 강해짐",
    "달린 거리만큼 오른쪽 옆 게이지가 차고, 가득 차면 둘레를 크게 터뜨리는 펄스 (공격력 300%, 밀어냄)",
    "기계 망치 · 펄스건 · 암살 단검 · 레일건 · 산탄 펄스 · 화염 배기(달린 자리에 불꽃) · 톱날 휠 · 전기 랜스 · 체인 · 니트로 부스터(앞으로 내달려 들이받음)",
  ],
};

export const GUIDE_EN_T2: Guide = {
  punk: [
    "Terracore · Punk · an alluring woman with neon hair and a chrome arm · 95 HP · fast · Luck 1",
    "10 cyber weapons: Thermal Katana · Monowire (bleed) · Smart Gun (curving bullets) · Mantis Blades · Neon Shotgun · Piercing Pistol · Quickhack (shock, stun) · Gorilla Arms · EMP Grenade · Twin Neon Blades",
    "Neural Accel: hits fill the gauge on her right; dash when it's full and time slows around her for 4s (foes and their shots slow down, her attacks are 1.6× faster and leave afterimages; bosses are not slowed)",
    "Her own items are 10 implanted abilities: Chrome Eyes (crits) · Reflex Booster · Accelerator Amp · Quick Charge · Berserker Chip · Blood Pump · Subdermal Armor · Optical Camo · Overclock · Afterimage Clone",
  ],
  bomber: [
    "Terracore · Bomber · 'explosions are art' · 105 HP",
    "Every weapon explodes · blasts within a second of each other stack the Art Chain, growing blast damage and radius (up to 10 stacks)",
    "Foes felled by a blast set off one more aftershock where they fall",
    "Grenade · Sticky Bomb · Cluster Bomb · Land Mine (when stepped on) · Rocket · three Dynamite · Fireworks (eight star bursts) · Napalm (sea of flames) · Chain Charge · Mega Bomb",
  ],
  artifacter: [
    "Terracore · Artifacter · a maker whose arms are covered in glowing blue tattoos · 100 HP · Luck 1",
    "One weapon, the Repulsor Gun: blue repulsor shots burst on impact and push nearby foes away",
    "Every 20 foes defeated fill the craft gauge on his right, and he crafts an item and takes it at once",
    "Crafted items are usually ordinary, but 12% of the time it's one of 5 hidden items only crafting can make (Undying Tattoo, Overdrive Glyph, Golem Ward Tattoo, Singularity, Infinity Circuit)",
  ],
  automata: [
    "Terracore · Automata · the first mechanical doll to gain a self · 100 HP",
    "Every weapon's basic attack is a laser from her hand · fires a piercing laser at the nearest foe, then fires again",
    "Sister Dolls: three identical automata follow beside her and fire their own lasers · Missile Pod: each shot has a 45% chance to launch 7–11 smoking homing missiles from her back",
    "Twin, Prism (splits), Overcharge Cannon, Fan, Binding, Orbital Satellite (a pillar of light every third shot), Full Arsenal (always 12+ missiles)",
  ],
  rider: [
    "Terracore · Rider · a biker on a motorcycle · 110 HP · very fast",
    "Faster means harder hits: every attack scales with how fast he is driving and his move speed stat",
    "Distance driven fills the gauge on his right; when full it bursts into a wide pulse (300% damage, knockback)",
    "Mech Hammer · Pulse Gun · Assassin's Dagger · Railgun · Scatter Pulse · Flame Exhaust (flames where you drive) · Saw Wheel · Shock Lance · Chain · Nitro Booster (boost forward and ram)",
  ],
};

export const GUIDE_JA_T2: Guide = {
  punk: [
    "テラコア · パンク · ネオンの髪とクロームの腕の魅惑的な女 · 体力95 · 速い · 幸運1",
    "サイバー武器10：熱線カタナ · モノワイヤー（出血）· スマートガン（曲がる弾）· マンティスブレード · ネオンショットガン · 貫通ピストル · クイックハック（感電・停止）· ゴリラアーム · EMPグレネード · ネオン双剣",
    "神経加速：当てるたびに右横のゲージが溜まり、満タンでダッシュすると4秒間周囲の時間が遅くなる（敵・敵弾が遅くなり自分の攻撃は1.6倍速く残像が残る、ボスは遅くならない）",
    "専用アイテムは体に埋め込む能力10：クロームアイ（クリティカル）· 反射神経 · 加速器増幅 · 急速充電 · 狂戦士チップ · 血液浄化器 · 皮下装甲 · 光学迷彩 · オーバークロック · 残像分身",
  ],
  bomber: [
    "テラコア · ボマー · 「爆発は芸術だ」 · 体力105",
    "すべての武器が爆発 · 1秒以内に連続で爆発すると「芸術連鎖」が1段ずつ溜まり、爆発ダメージ・範囲が大きくなる（最大10段）",
    "爆発で倒れた敵の跡でもう一度余震が起きる",
    "手榴弾 · 粘着爆弾 · クラスター爆弾 · 地雷（踏むと）· ロケット · ダイナマイト3本 · 花火（星形に8回）· ナパーム（火の海）· 連鎖爆薬 · メガ爆弾",
  ],
  artifacter: [
    "テラコア · アーティファクター · 両腕に青く光る刺青が満ちた製作者 · 体力100 · 幸運1",
    "武器はリパルスガン一つ：青い反発弾が当たった所で弾け、周りの敵を押し返す",
    "敵を20体倒すごとに右横の製作ゲージが溜まり、アイテムを1つ自ら作ってすぐ手に入れる",
    "作るアイテムは普通のアイテムだが、12%で製作でしか出ない隠しアイテム5つ（不死の刺青・過負荷紋様・守護ゴーレムの刺青・特異点・無限回路）のうち一つ",
  ],
  automata: [
    "テラコア · オートマタ · 初めて自我を持った機械人形 · 体力100",
    "すべての武器の基本攻撃は手から撃つレーザー · 近い敵へ貫通レーザーを撃ち、また撃つ",
    "姉妹人形：そっくりなオートマタ3体がそばに並んでついてきて、それぞれレーザーを撃つ · ミサイルポッド：撃つたび45%で背中から煙を吐く誘導ミサイル7〜11発",
    "ツイン・プリズム（分裂）・過充電キャノン・扇・拘束・軌道衛星（3発目ごとに光の柱）・全弾発射（常にミサイル12発以上）",
  ],
  rider: [
    "テラコア · ライダー · バイクに乗った暴走族 · 体力110 · とても速い",
    "速いほどダメージが上がる：今の走る速さと移動速度の能力値ですべての攻撃が強くなる",
    "走った距離で右横のゲージが溜まり、満タンで周囲に大きなパルス（攻撃力300%、押し返す）",
    "機械ハンマー · パルスガン · 暗殺ダガー · レールガン · 散弾パルス · 火炎排気（走った跡に炎）· ノコギリホイール · 電撃ランス · チェーン · ニトロブースター（前へ突っ込んで体当たり）",
  ],
};
