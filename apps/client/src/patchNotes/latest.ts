import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.48.136",
    date: "2026-10-27",
    items: {
      ko: [
        "아스칼론 새 캐릭터 '잔영' (남, 그림자 속 암살자 · 체력 90 · 빠름 · 치명타 25% · 치명타 피해 250% · 모든 상태이상 면역)",
        "아주 빠른 단검 공격 · 노리는 적이 멀면 그 적 뒤로 순간이동해 등 뒤를 벰 (뒤에서 치면 더 아픔) · 떠난 자리에 잔영이 남아 한 번 더 벰",
        "그림자 단검 10: 잔영 단검 · 쌍단검 · 그림자 발톱 · 스틸레토 · 그림자 투척 · 회전 칼날 · 섬영 · 그림자 낫 · 독니 · 월식",
        "전용 아이템 10 · 테마 스킨 9 + 여름 한정 '여름 파도'",
      ],
      en: [
        "New Ascalon character 'Remnant' (male shadow assassin · HP 90 · fast · 25% crit · 250% crit damage · immune to all status effects)",
        "Very fast dagger cuts · blinks behind far targets to stab their backs (more damage from behind) · leaves an afterimage that cuts once more",
        "10 shadow daggers: Afterimage Dagger · Twin Daggers · Shadow Claws · Stiletto · Shadow Throw · Spinning Blades · Flash Shadow · Shadow Sickle · Venom Fang · Eclipse",
        "10 exclusive items · 9 theme skins + the limited Summer Wave skin",
      ],
      ja: [
        "アスカロンの新キャラクター「残影」（男性、影の暗殺者 · 体力90 · 速い · クリティカル25% · クリティカルダメージ250% · すべての状態異常に免疫）",
        "とても速い短剣攻撃 · 狙う敵が遠いとその背後へ瞬間移動して背中を斬る（背後からはより痛い）· 去った場所に残影が残りもう一度斬る",
        "影の短剣10：残影の短剣 · 双短剣 · 影の爪 · スティレット · 影の投擲 · 回転刃 · 閃影 · 影の鎌 · 毒牙 · 月蝕",
        "専用アイテム10 · テーマスキン9＋限定「夏の波」",
      ],
    },
  },
  {
    version: "0.48.135",
    date: "2026-10-27",
    items: {
      ko: [
        "아스칼론 새 캐릭터 '잊혀진 자' (여, 옛 신의 후손인 반신 · 체력 85 · 아주 빠름 · 재생력 20 · 회피 20%)",
        "빛 무기 10: 빛의 손길 · 여래신장(하늘에서 빛 십자가가 떨어짐) · 빛의 창 · 성광 · 빛비 · 빛의 날개 · 프리즘 · 후광 · 심판의 빛 · 새벽 베기",
        "빛의 고리: 적을 쓰러뜨리면 등의 고리가 차오르고, 가득 차면 10초 동안 신족 (공격 속도 2배 · 빛 날개 · 빛기둥이 둘레 적을 저절로 침, 공격력 30%)",
        "전용 아이템 10 · 테마 스킨 9 + 여름 한정 '여름 파도'",
      ],
      en: [
        "New Ascalon character 'The Forgotten' (female demigod, descendant of the old gods · HP 85 · very fast · Regen 20 · 20% dodge)",
        "10 light weapons: Touch of Light · Tathagata Palm (light crosses fall from the sky) · Spear of Light · Holy Flash · Light Rain · Wings of Light · Prism · Halo · Light of Judgment · Dawn Cleave",
        "Ring of light: kills fill the ring on her back; when full she takes divine form for 10s (double attack speed · wings of light · pillars of light strike nearby foes on their own for 30%)",
        "10 exclusive items · 9 theme skins + the limited Summer Wave skin",
      ],
      ja: [
        "アスカロンの新キャラクター「忘れられし者」（女性、古き神の末裔の半神 · 体力85 · とても速い · 再生力20 · 回避20%）",
        "光の武器10：光の手 · 如来神掌（空から光の十字架が落ちる）· 光の槍 · 聖光 · 光の雨 · 光の翼 · プリズム · 後光 · 審判の光 · 暁の斬撃",
        "光の輪：敵を倒すと背中の輪が満ち、満ちると10秒間神族（攻撃速度2倍 · 光の翼 · 光柱が周りの敵を自動で撃つ、攻撃力30%）",
        "専用アイテム10 · テーマスキン9＋限定「夏の波」",
      ],
    },
  },
  {
    version: "0.48.134",
    date: "2026-10-27",
    items: {
      ko: [
        "새 진영 아스칼론 왕국 (시즌 2): 첫 캐릭터 '추적자' (여, 저격수 · 체력 90)",
        "저격총 하나 + 스킬 셋 (PC 1·2·3 키, 모바일 스킬 버튼): 1 암습 저격 (무적, 화면이 까매지고 조준 원만 보임, 10초 안에 10발 · 한 발 200%) · 2 강력한 한방 (모으는 동안 앞에 탄을 막는 벽, 방을 꿰뚫는 1000% + 최대 체력 20%) · 3 연발사격 (10발 흩뿌림)",
        "전용 아이템 10 · 테마 스킨 9 + 여름 한정 '여름 파도' (물총)",
      ],
      en: [
        "New faction, the Kingdom of Ascalon (Season 2): first character 'Tracker' (female sniper · HP 90)",
        "One sniper rifle + three skills (keys 1·2·3 on PC, skill buttons on mobile): 1 Ambush Snipe (invulnerable, the screen goes black except the scope, 10 shots within 10s · 200% each) · 2 Power Shot (a wall blocks shots while charging, then 1000% + 20% max HP through the room) · 3 Rapid Fire (10 scattered shots)",
        "10 exclusive items · 9 theme skins + the limited Summer Wave skin (water rifle)",
      ],
      ja: [
        "新陣営アスカロン王国（シーズン2）：最初のキャラクター「追跡者」（女性狙撃手 · 体力90）",
        "狙撃銃ひとつ＋スキル3つ（PCは1·2·3キー、モバイルはスキルボタン）：1 暗襲狙撃（無敵、画面が暗転して照準円だけ、10秒以内に10発 · 1発200%）· 2 強力な一撃（溜める間は前の壁が弾を防ぐ、部屋を貫く1000%＋最大体力20%）· 3 連射（10発ばらまく）",
        "専用アイテム10 · テーマスキン9＋限定「夏の波」（水鉄砲）",
      ],
    },
  },
];
