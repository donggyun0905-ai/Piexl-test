// 캐릭터 설명: 시즌 2 아스칼론 (추적자 …) · 한·영·일
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_ASC: Guide = {
  tracker: [
    "아스칼론 · 추적자 · 조용히 노리는 여자 저격수 · 체력 90 · 조금 빠름",
    "저격총 하나: 멀리 꿰뚫는 한 발. 스킬 셋은 PC 1·2·3 키, 모바일은 오른쪽 스킬 버튼",
    "1 암습 저격(대기 10초): 무적이 되고 화면이 까매지며 조준 원만 보임. 10초 안에 10발 (한 발 공격력 200%, 조준 원 안의 적). 모바일·자동 조준은 가까운 적을 노림",
    "2 강력한 한방(대기 60초): 1.5초 모으는 동안 앞에 적 탄을 막는 빛 벽 (무적은 아님) → 방을 꿰뚫는 한 줄 (공격력 1000% + 최대 체력 20%, 보스는 그 1/5)",
    "3 연발사격(대기 3초): 조준 없이 10발을 흩뿌려 쏨",
    "전용 아이템 10: 고배율 조준경 · 할로 포인트탄 · 소음기 · 양각대 · 사냥감 표식 · 도탄 · 확장 탄창 · 고압 장약 · 위장복 · 헤드샷",
  ],
};

export const GUIDE_EN_ASC: Guide = {
  tracker: [
    "Ascalon · Tracker · a quiet female sniper · HP 90 · a bit fast",
    "One sniper rifle: a long piercing shot. Three skills on keys 1·2·3 (PC) or the skill buttons (mobile)",
    "1 Ambush Snipe (10s cooldown): invulnerable, the screen goes black except the scope circle. 10 shots within 10s (200% each, foes inside the circle). Mobile/auto-aim targets the nearest foe",
    "2 Power Shot (60s cooldown): charge 1.5s behind a light wall that blocks enemy shots (not invulnerable) → a line through the room (1000% + 20% max HP, 1/5 of that on bosses)",
    "3 Rapid Fire (3s cooldown): 10 scattered shots without aiming",
    "10 exclusive items: High-Power Scope · Hollow Points · Suppressor · Bipod · Quarry Mark · Ricochet · Extended Mag · High-Pressure Charge · Ghillie Suit · Headshot",
  ],
};

export const GUIDE_JA_ASC: Guide = {
  tracker: [
    "アスカロン · 追跡者 · 静かに狙う女性狙撃手 · 体力90 · やや速い",
    "狙撃銃ひとつ：遠くまで貫く一発。スキル3つはPCの1·2·3キー、モバイルは右のスキルボタン",
    "1 暗襲狙撃（待ち10秒）：無敵になり画面が暗転、照準円だけが見える。10秒以内に10発（1発200%、照準円内の敵）。モバイル・自動照準は近い敵を狙う",
    "2 強力な一撃（待ち60秒）：1.5秒溜める間、前に敵弾を防ぐ光の壁（無敵ではない）→ 部屋を貫く一直線（1000%＋最大体力20%、ボスはその1/5）",
    "3 連射（待ち3秒）：狙わずに10発ばらまく",
    "専用アイテム10：高倍率スコープ · ホローポイント弾 · サプレッサー · バイポッド · 獲物の印 · 跳弾 · 拡張マガジン · 高圧装薬 · ギリースーツ · ヘッドショット",
  ],
};
