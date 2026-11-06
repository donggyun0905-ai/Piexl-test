// 캐릭터 설명: 성국 5 (라파엘) · 한·영·일 (수치는 weaponsRafael·itemsRafael과 맞춤)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_SEONG5: Guide = {
  rafael: [
    "성국 · 라파엘 '폭풍의 사수' · 온몸을 로브로 감싼 천공의 저격수. 에테르 스코프를 단 거대한 마도공학 복합 대궁으로 아군의 시야를 빌려 적의 수뇌부를 정확히 저격하는 초장거리 화력 지원 · 체력 90 · 공격력 15 · 방어력 0 · 이동 1.3 · 행운 2",
    "성국 캐릭터는 스킬형: 기본 공격 + 숫자 키 스킬 넷 (1·2·3·4, 설정에서 키를 바꿀 수 있음 · 모바일은 스킬 버튼)",
    "초장거리: 적과의 거리가 40에서 200으로 멀어질수록 피해가 최대 +60%까지 늘어남",
    "표적: 방에서 가장 강한 적(보스 먼저, 그다음 최대 체력 큰 적)에 표적 · 받는 피해 +25% · 쓰러뜨리면 남은 스킬 대기 30% 감소",
    "3연격 (누르고 있으면): ① ② 화살 (앞으로 곧게, 처음 닿은 적 90%) ③ 저격 — 앞쪽에 표적이 있으면 표적을 향해 모든 적을 꿰뚫는 굵은 화살 (220%)",
    "1 바람 걸음 (대기 8초): 떠난 자리에 돌풍 (60%, 밀쳐냄) · 뒤로 뛰어 물러남 (무적) · 다음 공격이 저격",
    "2 폭풍 화살비 (대기 12초): 표적(없으면 앞) 자리에 0.5초 뒤 화살비가 6번 (한 번 40%, 느려짐)",
    "3 에테르 스코프 (대기 16초): 5초 동안 모든 기본 공격이 저격 (피해·거리 1.3배)",
    "4 천공의 빛 화살 (궁극기, 대기 60초): 0.75초 동안 활을 당김 (무적) → 표적을 향해 방을 가로지르는 거대한 빛의 화살 (600%, 모두 꿰뚫음) · 끝에서 폭발 (200%)",
    "무기 1: 천공의 마도 복합 대궁 (에테르 스코프) · 무기 대신 아이템이 나옴",
    "전용 아이템 20: 저격·거리 5 (정밀 스코프 · 긴 시위 · 관통 화살촉 · 숨 고르기 · 머리를 노려라) · 표적·지휘관 5 (사냥꾼의 낙인 · 지휘관 사냥 · 빌린 시야 · 파편 화살 · 두 번째 표적) · 폭풍·바람 5 (폭풍의 눈 · 끝없는 비 · 순풍 · 뇌전 화살 · 바람 깃) · 스킬·빛 5 (집중 · 넓은 빛살 · 천벌 · 후광 화살 · 바람의 기도)",
  ],
};

export const GUIDE_EN_SEONG5: Guide = {
  rafael: [
    "Holy Kingdom · Rafael 'The Storm Archer' · a sniper of the heavens wrapped in a robe. With a giant magitech compound bow fitted with an ether scope, he borrows his allies' sight to snipe enemy commanders — ultra-long-range fire support · HP 90 · ATK 15 · DEF 0 · Move 1.3 · Luck 2",
    "Holy Kingdom characters are skill-based: a basic attack + four number-key skills (1·2·3·4, rebindable in settings · skill buttons on mobile)",
    "Ultra range: as the distance to a foe grows from 40 to 200, damage rises up to +60%",
    "Mark: the strongest foe in the room (bosses first, then the highest max HP) is marked · takes +25% damage · killing it cuts remaining skill cooldowns by 30%",
    "3-hit chain (hold): ① ② arrow (straight ahead, first foe hit, 90%) ③ Snipe — a thick arrow that pierces every foe, aimed at the mark if it is ahead (220%)",
    "1 Wind Step (8s cooldown): a gust where you stood (60%, knockback) · leap backward (invulnerable) · your next attack is a Snipe",
    "2 Storm Volley (12s cooldown): after 0.5s, arrows rain six times on the mark (or ahead) (40% each, slow)",
    "3 Ether Scope (16s cooldown): for 5s every basic attack is a Snipe (1.3x damage and range)",
    "4 Arrow of Heaven (Ultimate, 60s cooldown): draw the bow for 0.75s (invulnerable) → a giant arrow of light crosses the room toward the mark (600%, pierces all) · explodes at the end (200%)",
    "Weapon 1: Celestial Magitech Compound Bow (Ether Scope) · items drop instead of weapons",
    "20 exclusive items: Sniping/Range 5 (Precision Scope · Long Bowstring · Piercing Arrowhead · Steady Breath · Aim for the Head) · Mark/Commander 5 (Hunter's Brand · Commander Hunt · Borrowed Sight · Shard Arrow · Second Mark) · Storm/Wind 5 (Eye of the Storm · Endless Rain · Tailwind · Thunder Arrow · Wind Fletching) · Skills/Light 5 (Focus · Broad Ray · Heaven's Wrath · Halo Arrow · Prayer of Wind)",
  ],
};

export const GUIDE_JA_SEONG5: Guide = {
  rafael: [
    "聖国 · ラファエル「嵐の射手」· 全身をローブで包んだ天空の狙撃手。エーテルスコープ付きの巨大な魔導工学複合大弓で、味方の視界を借りて敵の首脳を正確に狙撃する超長距離火力支援 · 体力90 · 攻撃力15 · 防御力0 · 移動1.3 · 幸運2",
    "聖国のキャラクターはスキル型：通常攻撃 + 数字キーのスキル4つ（1·2·3·4、設定でキー変更可 · モバイルはスキルボタン）",
    "超長距離：敵との距離が40から200へ遠くなるほどダメージが最大+60%まで増える",
    "標的：部屋で最も強い敵（ボス優先、次に最大体力の大きい敵）に標的 · 受けるダメージ+25% · 倒すと残りのスキル待機30%減少",
    "3連撃（押し続ける）：① ② 矢（前へまっすぐ、最初に当たった敵90%）③ 狙撃 — 前方に標的がいれば標的へ向けて全ての敵を貫く太い矢（220%）",
    "1 風の歩み（待機8秒）：離れた場所に突風（60%、押し出し）· 後ろへ跳び退く（無敵）· 次の攻撃が狙撃",
    "2 嵐の矢の雨（待機12秒）：標的（いなければ前方）の位置に0.5秒後、矢の雨が6回（1回40%、鈍足）",
    "3 エーテルスコープ（待機16秒）：5秒間、全ての通常攻撃が狙撃（ダメージ・距離1.3倍）",
    "4 天空の光の矢（必殺技、待機60秒）：0.75秒間弓を引く（無敵）→ 標的へ向けて部屋を貫く巨大な光の矢（600%、全て貫通）· 終点で爆発（200%）",
    "武器1：天空の魔導複合大弓（エーテルスコープ）· 武器の代わりにアイテムが出る",
    "専用アイテム20：狙撃・距離5（精密スコープ · 長い弦 · 貫通の鏃 · 息を整える · 頭を狙え）· 標的・指揮官5（狩人の烙印 · 指揮官狩り · 借りた視界 · 破片の矢 · 二つ目の標的）· 嵐・風5（嵐の目 · 終わらない雨 · 追い風 · 雷電の矢 · 風の矢羽）· スキル・光5（集中 · 広い光条 · 天罰 · 後光の矢 · 風の祈り）",
  ],
};
