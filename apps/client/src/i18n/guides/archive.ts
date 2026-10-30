// 캐릭터 설명 (한·영·일): 서고의 감시자(한정 캐릭터) · 줄마다 하나씩
import type { CharacterId } from "@pixel-rogue/shared";

export const GUIDE_KO_ARCHIVE: Partial<Record<CharacterId, readonly string[]>> = {
  lux: [
    "한정 · 서고의 감시자 · 떨어진 신의 사도 (뽑기로 얻음, 패왕전·랭크·일일 도전 제외) · 체력 100 · 공격력 8 · 치명타 12% · 예리함 12%",
    "빛의 검: 빠르고 약한 빛의 칼날을 쏨 · 세 번째 공격마다 가까운 적 둘(성장 단계마다 +1)의 자리에 '+' 빛의 검이 두 번씩 엇갈려 생겨 벰",
    "빛의 적: 층마다 전투방 셋에 떨어진 빛의 힘을 얻은 적 (빛을 두른 몬스터 · 빛을 얻은 보스 · 빛을 훔친 그림자와 1대1) · 쓰러뜨리면 빛의 조각",
    "빛의 조각: 공격력 +5% · 공격 속도 +3% · 치명타·예리함 +1.5% · 빛의 검 피해 +4% · 6개마다 몸이 커지고 더 빛남 (최대 3단계)",
    "전용 아이템 10: 빛의 고리 · 신속의 깃 · 먼 빛 · 은총의 옷자락 · 겹친 검날 · 빠른 단죄 · 넓은 십자 · 꿰뚫는 빛 · 단죄 · 빛의 문신",
  ],
};
export const GUIDE_EN_ARCHIVE: Partial<Record<CharacterId, readonly string[]>> = {
  lux: [
    "Limited · Archive Warden · apostle of a fallen god (from the gacha; not in Paewang, ranked or daily) · HP 100 · Attack 8 · Crit 12% · Sharpness 12%",
    "Blade of Light: fires fast, light blades · every third attack, '+' light swords form twice, offset, on the two nearest foes (+1 foe per growth stage)",
    "Light foes: three combat rooms per floor hold foes touched by fallen light (a glowing monster · a light-fed boss · a 1-on-1 with the shadow that stole the light) · defeat them for Shards of Light",
    "Shard of Light: +5% attack · +3% attack speed · +1.5% crit and sharpness · +4% light sword damage · every 6 she grows and shines brighter (up to 3 stages)",
    "10 own items: Halo of Light · Feather of Haste · Distant Light · Hem of Grace · Layered Blades · Swift Judgment · Wide Cross · Piercing Light · Condemnation · Tattoo of Light",
  ],
};
export const GUIDE_JA_ARCHIVE: Partial<Record<CharacterId, readonly string[]>> = {
  lux: [
    "限定 · 書庫の監視者 · 堕ちた神の使徒 (ガチャで入手、覇王戦・ランク・デイリーは除く) · 体力100 · 攻撃力8 · 会心12% · 鋭さ12%",
    "光の剣: 速く軽い光の刃を放つ · 3回目の攻撃ごとに近くの敵2体 (成長段階ごとに+1) の位置に「+」の光の剣が2回ずつずれて生まれて斬る",
    "光の敵: 階ごとに戦闘部屋3つに堕ちた光の力を得た敵 (光をまとった魔物 · 光を得たボス · 光を盗んだ影と1対1) · 倒すと光のかけら",
    "光のかけら: 攻撃力+5% · 攻撃速度+3% · 会心・鋭さ+1.5% · 光の剣ダメージ+4% · 6個ごとに体が大きくなりさらに輝く (最大3段階)",
    "専用アイテム10: 光の輪 · 迅速の羽 · 遠い光 · 恩寵の裾 · 重なる刃 · 速やかな断罪 · 広い十字 · 貫く光 · 断罪 · 光の紋",
  ],
};
