// 캐릭터 설명: 탈라시아 2 (매드퀸) · 한·영·일 (수치는 weaponsMadQueen·itemsMadQueen과 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_THAL2: Guide = {
  madQueen: [
    "탈라시아 · 매드퀸 · 해방의 바다를 다스리는 은빛 제독 · 체력 100 · 공격력 11 · 이동 1.35",
    "대포: 누를 때마다 손가락으로 가리킨 쪽으로 머리 위 미래형 대포가 터지는 포탄을 한 발씩 (공격력 170%, 폭발 반지름 22) · 대포 아이템 3개로 최대 4문 (둘째부터 60%)",
    "터렛: 쏠 때마다 30% 확률로 맵 아무 곳에 네온 터렛이 내려앉음 (최대 4) · 움직이지 않고 사거리(105) 안 적에게 대포보다 작고 빠른 포탄을 저절로 쏨 (공격력 75%)",
    "날개 무기: 쏠 때마다 30% 확률로 몸 왼쪽·오른쪽에 하나씩 날개처럼 감싸며 생김 (최대 4) · 쏠 때 같이 앞으로 레이저를 쏨 (꿰뚫음, 날개마다 공격력 45%)",
    "전탄 일제사격: 터렛 4 + 날개 4가 모두 모이면 맵 전체에 포탄이 쏟아짐 (적마다 한 발 + 아무 곳 18발, 공격력 240% · 잠깐 기절) → 터렛·날개는 사라지고 대포부터 다시 시작 · 방을 옮기면 터렛·날개는 사라짐",
    "무기는 함대 빛깔 4가지 (대포·터렛·날개 색이 같이 바뀜): 해방의 파도포(하늘, 빠름·넓은 폭발) · 적조 섬멸포(빨강, 큰 폭발·화상) · 등대 번개포(노랑, 번개 튐·터렛 빠름) · 산호 폭풍포(초록, 독·터렛·날개 잘 나옴)",
    "전용 아이템 10: 쌍열 포신 · 현측 포열 · 기함의 위엄 (셋 다 대포 +1) · 고폭 탄두 · 신속 설치 · 과충전 포탑 · 날개 편대 · 프리즘 렌즈 · 해방의 포격 · 자유의 바다 (공용 아이템도 나옴)",
  ],
};

export const GUIDE_EN_THAL2: Guide = {
  madQueen: [
    "Thalassia · Mad Queen · the silver admiral who rules the sea of liberty · HP 100 · ATK 11 · Move 1.35",
    "Cannon: each press fires one exploding shell from the futuristic cannon above her head toward where she points (170% ATK, blast radius 22) · up to 4 cannons with the three cannon items (60% from the second)",
    "Turrets: each shot has a 30% chance to drop a neon turret anywhere on the map (up to 4) · they don't move and auto-fire small, fast shells at foes in range (105) (75% ATK)",
    "Wing weapons: each shot has a 30% chance to add a wing weapon curving around her left or right side (up to 4) · they fire forward lasers with every shot (piercing, 45% ATK each)",
    "All-Guns Salvo: with 4 turrets and 4 wings, shells rain over the whole map (one per foe + 18 anywhere, 240% ATK · brief stun) → turrets and wings vanish and it starts again from the cannon · leaving the room also clears turrets and wings",
    "Weapons are 4 fleet colors (cannon, turret and wing colors change together): Tide Liberator (sky, fast · wide blasts) · Red Tide Annihilator (red, big blasts · burn) · Lighthouse Thunder (gold, chain lightning · faster turrets) · Coral Tempest (green, poison · more turrets and wings)",
    "10 exclusive items: Twin Barrel · Broadside Battery · Flagship's Majesty (each +1 cannon) · High-Yield Warhead · Rapid Deploy · Overclocked Turret · Wing Squadron · Prism Lens · Liberation Barrage · Sea of Freedom (shared items also drop)",
  ],
};

export const GUIDE_JA_THAL2: Guide = {
  madQueen: [
    "タラシア · マッドクイーン · 解放の海を治める銀の提督 · 体力100 · 攻撃力11 · 移動1.35",
    "大砲：押すたびに指さした方へ頭上の未来型大砲が爆発する砲弾を1発（攻撃力170%、爆発半径22）· 大砲アイテム3つで最大4門（2門目から60%）",
    "タレット：撃つたびに30%でマップのどこかにネオンタレットが降りる（最大4）· 動かず射程（105）内の敵へ大砲より小さく速い砲弾を自動で撃つ（攻撃力75%）",
    "翼の武器：撃つたびに30%で体の左右に翼のように1つずつ現れる（最大4）· 撃つとき一緒に前へレーザー（貫通、翼ごとに攻撃力45%）",
    "全弾一斉射撃：タレット4と翼4がそろうとマップ全体に砲弾が降り注ぐ（敵ごとに1発＋どこかに18発、攻撃力240% · 少し気絶）→ タレット・翼は消えて大砲から再スタート · 部屋を移るとタレット・翼は消える",
    "武器は艦隊の色4つ（大砲・タレット・翼の色が一緒に変わる）：解放の波動砲（空色、速射・広い爆発）· 赤潮殲滅砲（赤、大きな爆発・火傷）· 灯台の雷砲（黄、雷が跳ぶ・タレットが速い）· 珊瑚の嵐砲（緑、毒・タレットと翼が出やすい）",
    "専用アイテム10：双連砲身 · 舷側砲列 · 旗艦の威厳（3つとも大砲+1）· 高爆弾頭 · 迅速設置 · 過充電砲台 · 翼の編隊 · プリズムレンズ · 解放の砲撃 · 自由の海（共用アイテムも出る）",
  ],
};
