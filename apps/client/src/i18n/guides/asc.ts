// 캐릭터 설명: 시즌 2 아스칼론 (추적자 · 잊혀진 자 · 잔영 …) · 한·영·일
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
  forgotten: [
    "아스칼론 · 잊혀진 자 · 옛 신의 마지막 후손인 반신, 빛으로 싸우는 여자 · 체력 85 · 아주 빠름 · 재생력 20 · 회피 20%",
    "빛 무기 10: 빛의 손길 · 여래신장(하늘에서 빛 십자가 셋) · 빛의 창 · 성광 · 빛비 · 빛의 날개 · 프리즘 · 후광 · 심판의 빛 · 새벽 베기",
    "빛의 고리: 적을 쓰러뜨리면 등의 고리가 차오름 (25마리). 가득 차면 10초 동안 신족: 공격 속도 2배 + 둘레 적을 빛기둥이 저절로 침 (0.3초마다 셋, 공격력 30%)",
    "전용 아이템 10: 잊힌 기억 · 신의 잔향 · 빛기둥 강화 · 늘어나는 기둥 · 신의 가호 · 광휘 · 성흔 · 빛의 박동 · 깨어남 · 잔광",
  ],
  remnant: [
    "아스칼론 · 잔영 · 그림자 속을 움직이는 남자 암살자 · 체력 90 · 빠름 · 치명타 25% · 치명타 피해 250% · 모든 상태이상 면역",
    "그림자 단검 10: 잔영 단검 · 쌍단검 · 그림자 발톱 · 스틸레토 · 그림자 투척 · 회전 칼날 · 섬영 · 그림자 낫 · 독니 · 월식",
    "아주 빠르게 벰. 노리는 적이 칼끝에서 멀면 그 적 뒤로 순간이동해 등 뒤를 벰 (뒤에서 치면 1.5배, 스틸레토는 2.5배). 떠난 자리에는 잔영이 남아 0.3초 뒤 한 번 더 벰",
    "전용 아이템 10: 그림자 걸음 · 등 뒤의 칼 · 처형 · 겹친 잔영 · 사라짐 · 피의 칼날 · 그림자 손놀림 · 소리 없는 발 · 연쇄 암살 · 그림자 숨기",
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
  forgotten: [
    "Ascalon · The Forgotten · a demigod woman, last descendant of the old gods, who fights with light · HP 85 · very fast · Regen 20 · 20% dodge",
    "10 light weapons: Touch of Light · Tathagata Palm (three light crosses from the sky) · Spear of Light · Holy Flash · Light Rain · Wings of Light · Prism · Halo · Light of Judgment · Dawn Cleave",
    "Ring of light: kills fill the ring on her back (25). When full she takes divine form for 10s: double attack speed + pillars of light strike nearby foes on their own (three every 0.3s, 30% damage)",
    "10 exclusive items: Forgotten Memory · Echo of the Gods · Brighter Pillars · More Pillars · Divine Ward · Radiance · Stigma · Pulse of Light · Awakening · Afterglow",
  ],
  remnant: [
    "Ascalon · Remnant · a male assassin who moves through shadows · HP 90 · fast · 25% crit · 250% crit damage · immune to all status effects",
    "10 shadow daggers: Afterimage Dagger · Twin Daggers · Shadow Claws · Stiletto · Shadow Throw · Spinning Blades · Flash Shadow · Shadow Sickle · Venom Fang · Eclipse",
    "Very fast cuts. If the target is out of reach he blinks behind it and stabs its back (×1.5 from behind, Stiletto ×2.5). An afterimage stays where he left and cuts once more 0.3s later",
    "10 exclusive items: Shadow Step · Knife in the Back · Execution · Double Afterimage · Vanish · Bloody Edge · Shadow Hands · Silent Feet · Chain Assassination · Shadow Shroud",
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
  forgotten: [
    "アスカロン · 忘れられし者 · 古き神の最後の末裔、光で戦う半神の女性 · 体力85 · とても速い · 再生力20 · 回避20%",
    "光の武器10：光の手 · 如来神掌（空から光の十字架3つ）· 光の槍 · 聖光 · 光の雨 · 光の翼 · プリズム · 後光 · 審判の光 · 暁の斬撃",
    "光の輪：敵を倒すと背中の輪が満ちる（25体）。満ちると10秒間神族：攻撃速度2倍＋光柱が周りの敵を自動で撃つ（0.3秒ごとに3本、攻撃力30%）",
    "専用アイテム10：忘れられた記憶 · 神の残響 · 光柱強化 · 増える光柱 · 神の加護 · 光輝 · 聖痕 · 光の鼓動 · 目覚め · 残光",
  ],
  remnant: [
    "アスカロン · 残影 · 影の中を動く男の暗殺者 · 体力90 · 速い · クリティカル25% · クリティカルダメージ250% · すべての状態異常に免疫",
    "影の短剣10：残影の短剣 · 双短剣 · 影の爪 · スティレット · 影の投擲 · 回転刃 · 閃影 · 影の鎌 · 毒牙 · 月蝕",
    "とても速く斬る。狙う敵が刃先から遠いとその敵の背後へ瞬間移動して背中を斬る（背後から1.5倍、スティレットは2.5倍）。去った場所に残影が残り0.3秒後にもう一度斬る",
    "専用アイテム10：影歩き · 背中の刃 · 処刑 · 重なる残影 · 消失 · 血の刃 · 影の手さばき · 音なき足 · 連鎖暗殺 · 影隠れ",
  ],
};
