// 캐릭터 설명: 아스칼론 둘째 묶음 (영사 · 풍류사) · 한·영·일
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_ASC2: Guide = {
  pungryu: [
    "아스칼론 · 풍류사 · 구름을 타고 다니는 의적 선비 · 체력 90 · 빠름 · 행운 5",
    "공격할 때마다 천자문 글자 하나를 써서 날림. 네 개(천자문 책이면 셋)를 쓰면 구절 완성 → 무기마다 큰 마법. 2초 동안 쓰지 않으면 구절은 처음부터",
    "구름 타기: 지형·지속 피해 절반",
    "천자문 무기 10: 천지현황 · 우주홍황 · 일월영측 · 진수열장 · 한래서왕 · 추수동장 · 운등치우 · 노결위상 · 금생여수 · 검호거궐",
    "전용 아이템 10: 축지법 · 분신술 · 둔갑술 · 의적 주머니 · 오색 구름 · 먹물 붓 · 서당 개 삼 년 · 풍류 피리 · 천자문 책 · 활빈당 깃발",
  ],
  silk: [
    "아스칼론 · 영사 · 보이지 않는 실을 다루는 매혹적인 여자 · 체력 90 · 빠름 · 아주 빠른 공격, 한 가닥 피해는 작음",
    "실 100가닥 장전 (거너처럼 다 쓰면 1.5초 장전, 발밑 막대로 남은 실). 실 하나는 방 끝에서 끝까지 1초 동안 보이는 실선이고, 그 줄 위의 적을 모두 벰",
    "얽힘: 실에 맞을 때마다 하나씩 쌓이고 (머리 위 분홍 점), 5가 되면 둘레에 실 다섯이 나타나 \"띵\" 소리와 함께 당겨 찢고 방 끝으로 날아감 (공격력 250% + 출혈)",
    "실 30가닥을 쓸 때마다 노리는 적을 가로지르는 실 30가닥 연사 (남은 실이 10 이하일 때 쏜 실은 안 셈)",
    "실 무기 10: 영사의 실 · 쌍실 · 거미줄 · 강철실 · 핏빛 실 · 바늘실 · 하프 현 · 큰 실패 · 마리오네트 · 고치",
    "전용 아이템 10: 빠른 손 · 실타래 · 날 선 실 · 찢는 손 · 얽힘 · 폭주 · 핏방울 · 가벼운 걸음 · 손끝 감각 · 비단 방패",
  ],
};

export const GUIDE_EN_ASC2: Guide = {
  pungryu: [
    "Ascalon · Pungryu · a scholar-outlaw who rides a cloud · HP 90 · fast · Luck 5",
    "Each attack writes one character of the Thousand Character Classic and hurls it. Write four (three with the Thousand Character Book) to complete a verse and unleash the weapon's spell. Stop writing for 2s and the verse starts over",
    "Riding a cloud: terrain and damage-over-time hurt is halved",
    "10 verse weapons: Heaven Dark, Earth Gold · Vast Cosmos · Sun and Moon · Spread Stars · Cold Comes, Heat Goes · Autumn Harvest · Rising Clouds · Dew Turns Frost · Gold in the River · Sword Named Geogwol",
    "10 exclusive items: Earth-Folding Step · Clone Art · Shape-Shift · Outlaw's Pouch · Five-Color Cloud · Ink Brush · Three Years at School · Wandering Flute · Thousand Character Book · Banner of the Poor's Friends",
  ],
  silk: [
    "Ascalon · Silk · an alluring woman who wields unseen threads · HP 90 · fast · very fast attacks with small damage per thread",
    "100 threads loaded (like the Gunner, a 1.5s reload when empty; the bar under her feet shows what's left). Each thread is a line from wall to wall shown for 1s, cutting every foe on it",
    "Tangles: each thread hit adds one (pink dots overhead); at 5, five threads appear around the foe, pull tight with a 'ting' and tear it apart before flying off to the walls (250% + bleed)",
    "Every 30 threads used, a barrage of 30 threads crosses the target (threads fired with 10 or fewer left don't count)",
    "10 thread weapons: Silken Thread · Twin Threads · Spider Web · Steel Wire · Crimson Thread · Needle Thread · Harp Strings · Great Spool · Marionette · Cocoon",
    "10 exclusive items: Quick Hands · Skein · Edged Thread · Rending Hands · Entangle · Frenzy · Blood Drop · Light Step · Fingertip Sense · Silk Shield",
  ],
};

export const GUIDE_JA_ASC2: Guide = {
  pungryu: [
    "アスカロン · 風流士 · 雲に乗る義賊の書生 · 体力90 · 速い · 幸運5",
    "攻撃するたびに千字文の文字を1つ書いて飛ばす。4つ（千字文の書なら3つ）書くと句が完成し、武器ごとの魔法が発動。2秒書かないと句は最初から",
    "雲に乗る：地形・持続ダメージ半分",
    "千字文の武器10：天地玄黄 · 宇宙洪荒 · 日月盈昃 · 辰宿列張 · 寒来暑往 · 秋収冬蔵 · 雲騰致雨 · 露結為霜 · 金生麗水 · 剣号巨闕",
    "専用アイテム10：縮地法 · 分身術 · 遁甲術 · 義賊の巾着 · 五色の雲 · 墨の筆 · 門前の小僧 · 風流の笛 · 千字文の書 · 活貧党の旗",
  ],
  silk: [
    "アスカロン · 影糸使い · 見えない糸を操る魅惑的な女性 · 体力90 · 速い · とても速い攻撃、1本のダメージは小さい",
    "糸100本を装填（ガンナーのように使い切ると1.5秒装填、足元のバーで残り）。糸1本は部屋の端から端まで1秒見える糸で、その線上の敵をすべて斬る",
    "絡み：糸が当たるたびに1つ溜まり（頭上のピンクの点）、5になると周りに糸5本が現れ「ティン」と鳴って引き裂き、部屋の端へ飛んでいく（攻撃力250%＋出血）",
    "糸を30本使うごとに狙う敵を横切る糸30本の連射（残り10本以下で撃った糸は数えない）",
    "糸の武器10：影糸 · 双糸 · 蜘蛛の巣 · 鋼糸 · 緋の糸 · 針糸 · 竪琴の弦 · 大糸巻き · マリオネット · 繭",
    "専用アイテム10：早い手 · 糸かせ · 刃の糸 · 裂く手 · 絡み · 暴走 · 血の雫 · 軽い足取り · 指先の感覚 · 絹の盾",
  ],
};
