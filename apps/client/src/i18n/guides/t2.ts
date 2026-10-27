// 캐릭터 설명: 시즌 2 테라코어 (오토마타·라이더·붐버·아티팩터·펑크) · 한·영·일
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_T2: Guide = {
  punk: [
    "테라코어 · 펑크 · 네온 머리와 크롬 팔의 매혹적인 여자 · 체력 95 · 빠름 · 행운 1",
    "사이버 무기 10: 열선 카타나 · 모노와이어(출혈) · 스마트 건(휘는 총알) · 맨티스 블레이드 · 네온 산탄총 · 관통 권총 · 퀵해킹(감전·멈춤) · 고릴라 팔 · EMP 수류탄 · 네온 쌍검",
    "신경 가속: 맞힐 때마다 오른쪽 옆 게이지가 차고, 가득일 때 대시하면 4초 동안 둘레의 시간이 느려짐 (그동안 무적 · 적은 네 틱 중 한 틱만 움직이고 공격함, 보스는 두 틱 중 한 틱 · 적 탄은 아주 느려짐 · 내 공격 2.6배, 이동 1.7배 빨라지며 잔상이 남음)",
    "전용 아이템은 몸에 심는 능력 10: 크롬 눈(치명타) · 반사 신경 · 가속기 증폭 · 빠른 충전 · 광전사 칩 · 혈액 정화기 · 피하 장갑 · 광학 위장 · 오버클럭 · 잔상 분신",
  ],
  bomber: [
    "테라코어 · 붐버 · '폭발은 예술이다' · 체력 105",
    "모든 무기가 터짐 · 1초 안에 잇따라 터지면 '예술 연쇄'가 한 칸씩 쌓여 폭발 피해·반경이 커짐 (최대 10칸)",
    "폭발로 쓰러진 적 자리에서 여진이 한 번 더 터짐 · 폭발에 휘말리면 자신도 피해 20",
    "수류탄 · 끈끈이 폭탄(4.5초 뒤, 많이 붙을수록 크게) · 집속탄 · 유도 지뢰(눈을 뜨고 달려감) · 로켓(늘 쫓아감, 작은 미사일) · 다이너마이트 셋 · 불꽃놀이(넓게 열두 번) · 네이팜(넓은 불바다, 불꽃 스택) · 연쇄 폭약 · 메가 폭탄",
  ],
  artifacter: [
    "테라코어 · 아티팩터 · 두 팔에 푸른빛 문신이 가득한 제작자 · 체력 100 · 행운 1",
    "무기는 리펄스 총 하나: 푸른 반발탄이 맞은 자리를 터뜨리며 둘레 적을 밀어냄",
    "쓰러뜨린 적 20마다 오른쪽 옆 제작 게이지가 차서 아이템 하나를 직접 만들어 바로 가짐",
    "만드는 아이템은 보통 아이템이지만, 5% 확률로 제작으로만 나오는 숨겨진 아이템 5개(불사의 문신·과부하 문양·수호 골렘 문신·특이점·무한 회로) 중 하나",
  ],
  automata: [
    "테라코어 · 오토마타 · 처음으로 자아를 가진 기계 인형 · 체력 100",
    "모든 무기의 기본 공격은 손에서 쏘는 레이저 · 가까운 적을 향해 꿰뚫는 레이저를 쏘고, 다시 쏘고 · 쏠 때마다 50% 확률로 등 뒤에서 연기를 뿜는 유도 미사일 7~11발",
    "자매 인형: 똑같이 생긴 오토마타 셋이 저마다 다른 적을 찾아 돌아다니며 레이저를 쏨 (쏠 때 35% 확률로 유도 미사일, 인형마다 색이 다름) · 전탄 발사: 쏠 때마다 늘 유도 미사일 12~16발 (느림)",
    "붉은 레이저(치명타 5→10→15→20%)·프리즘(갈라짐)·과충전 캐논·부채·구속·궤도 위성(세 번째마다 빛기둥)·리펄서 소드(양손 대검 두 번 베기)",
  ],
  rider: [
    "테라코어 · 라이더 · 오토바이를 탄 폭주족 · 체력 110 · 아주 빠름",
    "빠를수록 피해가 커짐: 지금 달리는 빠르기와 이동 속도 능력치만큼 모든 공격이 강해짐",
    "달린 거리와 공격만큼 오른쪽 옆 게이지가 차고 (공격할 때마다 이동 속도도 쌓여 빨라짐, 최대 +40%), 가득 차면 둘레를 크게 터뜨리는 펄스 (공격력 300%, 밀어냄) · 오토바이라 위험해서 받는 피해 +20%",
    "기계 망치 · 펄스건 · 암살 단검(더 빠름, 대시로 목 베기, 빠르기 피해는 최대 +40%) · 레일건 · 산탄 펄스 · 화염 배기(푸른 불, 불꽃 스택 x1~x5) · 톱날 휠 · 전기 랜스 · 체인 · 니트로 부스터(앞으로 내달려 들이받음)",
  ],
};

export const GUIDE_EN_T2: Guide = {
  punk: [
    "Terracore · Punk · an alluring woman with neon hair and a chrome arm · 95 HP · fast · Luck 1",
    "10 cyber weapons: Thermal Katana · Monowire (bleed) · Smart Gun (curving bullets) · Mantis Blades · Neon Shotgun · Piercing Pistol · Quickhack (shock, stun) · Gorilla Arms · EMP Grenade · Twin Neon Blades",
    "Neural Accel: hits fill the gauge on her right; dash when it's full and time slows around her for 4s (she is invulnerable · foes move and attack only one tick in four, bosses one in two · enemy shots crawl · her attacks are 2.6× and her movement 1.7× faster, leaving afterimages)",
    "Her own items are 10 implanted abilities: Chrome Eyes (crits) · Reflex Booster · Accelerator Amp · Quick Charge · Berserker Chip · Blood Pump · Subdermal Armor · Optical Camo · Overclock · Afterimage Clone",
  ],
  bomber: [
    "Terracore · Bomber · 'explosions are art' · 105 HP",
    "Every weapon explodes · blasts within a second of each other stack the Art Chain, growing blast damage and radius (up to 10 stacks)",
    "Foes felled by a blast set off one more aftershock where they fall · caught in a blast, he takes 20 damage",
    "Grenade · Sticky Bomb (4.5s, bigger the more stick) · Cluster Bomb · Homing Mine (wakes and runs at foes) · Rocket (always homes, mini missiles) · three Dynamite · Fireworks (twelve wide bursts) · Napalm (wide fire, flame stacks) · Chain Charge · Mega Bomb",
  ],
  artifacter: [
    "Terracore · Artifacter · a maker whose arms are covered in glowing blue tattoos · 100 HP · Luck 1",
    "One weapon, the Repulsor Gun: blue repulsor shots burst on impact and push nearby foes away",
    "Every 20 foes defeated fill the craft gauge on his right, and he crafts an item and takes it at once",
    "Crafted items are usually ordinary, but 5% of the time it's one of 5 hidden items only crafting can make (Undying Tattoo, Overdrive Glyph, Golem Ward Tattoo, Singularity, Infinity Circuit)",
  ],
  automata: [
    "Terracore · Automata · the first mechanical doll to gain a self · 100 HP",
    "Every weapon's basic attack is a laser from her hand · fires a piercing laser at the nearest foe, then fires again · each shot has a 50% chance to launch 7–11 smoking homing missiles from her back",
    "Sister Dolls: three identical automata each roam off to hunt a different foe with their lasers (35% chance of homing missiles when they fire, each in its own color) · Full Arsenal: every shot launches 12–16 homing missiles (slow)",
    "Crimson (crit 5→10→15→20%), Prism (splits), Overcharge Cannon, Fan, Binding, Orbital Satellite (a pillar of light every third shot), Repulser Sword (two greatsword slashes)",
  ],
  rider: [
    "Terracore · Rider · a biker on a motorcycle · 110 HP · very fast",
    "Faster means harder hits: every attack scales with how fast he is driving and his move speed stat",
    "Distance driven and attacks fill the gauge on his right (each attack also stacks move speed, up to +40%); when full it bursts into a wide pulse (300% damage, knockback) · riding is risky: +20% damage taken",
    "Mech Hammer · Pulse Gun · Assassin's Dagger (faster, dash throat-slash, speed bonus up to +40%) · Railgun · Scatter Pulse · Flame Exhaust (blue fire, flame stacks x1–x5) · Saw Wheel · Shock Lance · Chain · Nitro Booster (boost forward and ram)",
  ],
};

export const GUIDE_JA_T2: Guide = {
  punk: [
    "テラコア · パンク · ネオンの髪とクロームの腕の魅惑的な女 · 体力95 · 速い · 幸運1",
    "サイバー武器10：熱線カタナ · モノワイヤー（出血）· スマートガン（曲がる弾）· マンティスブレード · ネオンショットガン · 貫通ピストル · クイックハック（感電・停止）· ゴリラアーム · EMPグレネード · ネオン双剣",
    "神経加速：当てるたびに右横のゲージが溜まり、満タンでダッシュすると4秒間周囲の時間が遅くなる（その間無敵 · 敵は4ティックに1回しか動かず攻撃せず、ボスは2回に1回 · 敵弾はとても遅い · 自分の攻撃2.6倍・移動1.7倍速くなり残像が残る）",
    "専用アイテムは体に埋め込む能力10：クロームアイ（クリティカル）· 反射神経 · 加速器増幅 · 急速充電 · 狂戦士チップ · 血液浄化器 · 皮下装甲 · 光学迷彩 · オーバークロック · 残像分身",
  ],
  bomber: [
    "テラコア · ボマー · 「爆発は芸術だ」 · 体力105",
    "すべての武器が爆発 · 1秒以内に連続で爆発すると「芸術連鎖」が1段ずつ溜まり、爆発ダメージ・範囲が大きくなる（最大10段）",
    "爆発で倒れた敵の跡でもう一度余震が起きる · 爆発に巻き込まれると自分も20ダメージ",
    "手榴弾 · 粘着爆弾（4.5秒後、多く付くほど大きく）· クラスター爆弾 · 誘導地雷（目を開けて走る）· ロケット（常に追尾、小型ミサイル）· ダイナマイト3本 · 花火（広く12回）· ナパーム（広い火の海、炎スタック）· 連鎖爆薬 · メガ爆弾",
  ],
  artifacter: [
    "テラコア · アーティファクター · 両腕に青く光る刺青が満ちた製作者 · 体力100 · 幸運1",
    "武器はリパルスガン一つ：青い反発弾が当たった所で弾け、周りの敵を押し返す",
    "敵を20体倒すごとに右横の製作ゲージが溜まり、アイテムを1つ自ら作ってすぐ手に入れる",
    "作るアイテムは普通のアイテムだが、5%で製作でしか出ない隠しアイテム5つ（不死の刺青・過負荷紋様・守護ゴーレムの刺青・特異点・無限回路）のうち一つ",
  ],
  automata: [
    "テラコア · オートマタ · 初めて自我を持った機械人形 · 体力100",
    "すべての武器の基本攻撃は手から撃つレーザー · 近い敵へ貫通レーザーを撃ち、また撃つ · 撃つたび50%で背中から煙を吐く誘導ミサイル7〜11発",
    "姉妹人形：そっくりなオートマタ3体がそれぞれ別の敵を探して動き回り、レーザーを撃つ（撃つ時35%で誘導ミサイル、人形ごとに色が違う） · 全弾発射：撃つたび常に誘導ミサイル12〜16発（遅い）",
    "紅（会心5→10→15→20%）・プリズム（分裂）・過充電キャノン・扇・拘束・軌道衛星（3発目ごとに光の柱）・リパルサーソード（両手大剣で2連斬り）",
  ],
  rider: [
    "テラコア · ライダー · バイクに乗った暴走族 · 体力110 · とても速い",
    "速いほどダメージが上がる：今の走る速さと移動速度の能力値ですべての攻撃が強くなる",
    "走った距離と攻撃で右横のゲージが溜まり（攻撃するたびに移動速度も上がる、最大+40%）、満タンで周囲に大きなパルス（攻撃力300%、押し返す）· バイクは危険なので被ダメージ+20%",
    "機械ハンマー · パルスガン · 暗殺ダガー（より速い、ダッシュで喉斬り、速さボーナス最大+40%）· レールガン · 散弾パルス · 火炎排気（青い炎、炎スタックx1〜x5）· ノコギリホイール · 電撃ランス · チェーン · ニトロブースター（前へ突っ込んで体当たり）",
  ],
};
