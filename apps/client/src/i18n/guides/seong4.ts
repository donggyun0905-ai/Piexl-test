// 캐릭터 설명: 성국 4 (세레나) · 한·영·일 (수치는 weaponsSerena·itemsSerena와 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_SEONG4: Guide = {
  serena: [
    "성국 · 세레나 '환혹의 무희' · 춤추듯 휘날리는 강철 가시 채찍과 맹독성 에테르 비수를 다루는 무희. 빛의 강철 가시를 퍼뜨려 적의 감각을 마비시키고 서서히 말려 죽이는 전술가 · 체력 100 · 공격력 12 · 방어력 1 · 이동 1.4 · 행운 3",
    "성국 캐릭터는 스킬형: 기본 공격 + 숫자 키 스킬 넷 (1·2·3·4, 설정에서 키를 바꿀 수 있음 · 모바일은 스킬 버튼)",
    "도는 사슬 채찍 (기본): 비수 달린 사슬 채찍 둘이 늘 몸 둘레를 크게 돌며 안팎으로 휘저음 · 지나가는 적에게 35% (같은 적은 0.4초마다)",
    "무희: 기본 치명타 25% (치명타 1.8배) · 맞힐 때마다 그 피해의 30%를 빛 피해로 한 번 더",
    "3연격 (누르고 있으면): ① ② 채찍 휘두르기 (앞 넓은 부채꼴, 60%) ③ 환혹의 회오리 — 여러 사슬 채찍이 둘레를 세 번 연달아 크게 휘저음 (한 번 45%)",
    "가시: 맞힌 적마다 +1 (최대 5) · 0.5초마다 가시 하나에 8% · 가득 차면 마비 2초 (느려짐 · 받는 피해 +15%)",
    "1 환혹의 스텝 (대기 8초): 빙글 돌며 미끄러짐 (무적, 80%) · 지나간 적에 가시 +2",
    "2 가시 정원 (대기 14초): 둘레에 빛의 강철 가시 장판 일곱 (5초) · 안의 적은 느려지고 0.5초마다 30% + 가시",
    "3 맹독 비수 (대기 10초): 앞 부채꼴로 맹독 에테르 비수 (120%) · 가시 +3 · 3초 독",
    "4 환혹의 무도 (궁극기, 대기 60초): 8초 동안 사슬 채찍 여섯 · 더 크게 돌고 피해 2배 · 방의 모든 적 가시 +2 · 1·2타에도 환혹의 회오리",
    "무기 1: 강철 가시 채찍 & 맹독성 에테르 비수 · 무기 대신 아이템이 나옴",
    "전용 아이템 20: 가시·마비 5 (장미 가시 · 미늘 · 마취 향 · 맹독 꽃 · 가시 꽃망울) · 사슬·비수 5 (두 겹 사슬 · 긴 사슬 · 빠른 손목 · 벼린 비수 · 에테르 결정) · 무희·치명 5 (무희의 눈길 · 치명적인 입맞춤 · 끝없는 박자 · 긴 소매 · 신기루 베일) · 스킬·환혹 5 (날개 신 · 가시덤불 · 비수 꾸러미 · 한밤의 무대 · 뮤즈의 축복)",
  ],
};

export const GUIDE_EN_SEONG4: Guide = {
  serena: [
    "Holy Kingdom · Serena 'The Bewitching Dancer' · a dancer wielding a fluttering steel thorn whip and venomous ether daggers. A tactician who scatters thorns of steel and light, numbs her foes' senses and slowly wears them down · HP 100 · ATK 12 · DEF 1 · Move 1.4 · Luck 3",
    "Holy Kingdom characters are skill-based: a basic attack + four number-key skills (1·2·3·4, rebindable in settings · skill buttons on mobile)",
    "Orbiting chain whips (base): two dagger-tipped chain whips always circle wide around you, swaying in and out · 35% to foes they pass (same foe every 0.4s)",
    "Dancer: 25% base crit (1.8x) · every hit deals 30% of its damage again as light damage",
    "3-hit chain (hold): ① ② whip lashes (wide front cone, 60%) ③ Bewitching Whirl — many chain whips sweep around you three times in a row (45% each)",
    "Thorns: +1 per hit (max 5) · 8% per thorn every 0.5s · a full set Numbs for 2s (slowed · +15% damage taken)",
    "1 Bewitching Step (8s cooldown): spin and glide (invulnerable, 80%) · +2 thorns on foes passed",
    "2 Thorn Garden (14s cooldown): seven fields of steel-and-light thorns around you (5s) · foes inside are slowed and take 30% + a thorn every 0.5s",
    "3 Venom Daggers (10s cooldown): venomous ether daggers in a cone ahead (120%) · +3 thorns · 3s poison",
    "4 Dance of Bewitchment (Ultimate, 60s cooldown): six chain whips for 8s · wider orbit and 2x damage · +2 thorns on every foe in the room · hits 1 and 2 also trigger a Bewitching Whirl",
    "Weapon 1: Steel Thorn Whip & Venom Ether Daggers · items drop instead of weapons",
    "20 exclusive items: Thorns/Numb 5 (Rose Thorns · Barbs · Numbing Incense · Venom Blossom · Thorn Bud) · Chains/Daggers 5 (Doubled Chain · Long Chain · Quick Wrist · Honed Dagger · Ether Crystal) · Dancer/Crit 5 (Dancer's Glance · Fatal Kiss · Endless Tempo · Long Sleeves · Mirage Veil) · Skills 5 (Winged Shoes · Briar Patch · Dagger Bundle · Midnight Stage · Muse's Blessing)",
  ],
};

export const GUIDE_JA_SEONG4: Guide = {
  serena: [
    "聖国 · セレナ「幻惑の舞姫」· 舞うようにはためく鋼の棘の鞭と猛毒のエーテル短剣を操る舞姫。光の鋼の棘をまき散らして敵の感覚を麻痺させ、じわじわと追い詰める戦術家 · 体力100 · 攻撃力12 · 防御力1 · 移動1.4 · 幸運3",
    "聖国のキャラクターはスキル型：通常攻撃 + 数字キーのスキル4つ（1·2·3·4、設定でキー変更可 · モバイルはスキルボタン）",
    "周回する鎖鞭（基本）：短剣付きの鎖鞭2本がいつも体の周りを大きく回り内外に薙ぐ · 通った敵に35%（同じ敵は0.4秒ごと）",
    "舞姫：基本会心25%（1.8倍）· 当てるたびにそのダメージの30%を光ダメージでもう一度",
    "3連撃（押し続ける）：① ② 鞭の振り（前方の広い扇形、60%）③ 幻惑の旋風 — 多くの鎖鞭が周りを3回続けて大きく薙ぐ（1回45%）",
    "棘：当てた敵ごとに+1（最大5）· 0.5秒ごとに棘1つにつき8% · 満タンで麻痺2秒（遅くなる · 受けるダメージ+15%）",
    "1 幻惑のステップ（待機8秒）：くるりと回って滑る（無敵、80%）· 通った敵に棘+2",
    "2 棘の庭（待機14秒）：周りに光の鋼の棘の床を7つ（5秒）· 中の敵は遅くなり0.5秒ごとに30% + 棘",
    "3 猛毒の短剣（待機10秒）：前方の扇形に猛毒のエーテル短剣（120%）· 棘+3 · 3秒間毒",
    "4 幻惑の舞（必殺技、待機60秒）：8秒間鎖鞭6本 · より大きく回りダメージ2倍 · 部屋の全ての敵に棘+2 · 1・2撃目にも幻惑の旋風",
    "武器1：鋼の棘の鞭＆猛毒のエーテル短剣 · 武器の代わりにアイテムが出る",
    "専用アイテム20：棘・麻痺5（薔薇の棘 · かえし · 痺れの香 · 猛毒の花 · 棘のつぼみ）· 鎖・短剣5（二重の鎖 · 長い鎖 · 速い手首 · 研いだ短剣 · エーテル結晶）· 舞姫・会心5（舞姫の眼差し · 致命の口づけ · 終わらない拍子 · 長い袖 · 蜃気楼のヴェール）· スキル・幻惑5（翼の靴 · 茨の茂み · 短剣の束 · 真夜中の舞台 · ミューズの祝福）",
  ],
};
