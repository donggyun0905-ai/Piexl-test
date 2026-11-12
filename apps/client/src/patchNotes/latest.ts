import type { PatchNote } from "./types";

// 새 기능은 여기 맨 위에 기록 (한·영·일 모두). 맨 위 버전 = GAME_VERSION
// 이 파일이 12KB를 넘으면 오래된 버전을 새 묶음 파일로 옮기고 index.ts에 이어 붙임
export const NOTES: PatchNote[] = [
  {
    version: "0.52.43",
    date: "2026-11-12",
    items: {
      ko: [
        "피해 출처 3차: 패시브가 만든 소환물·장판·예약 공격이 나중에 준 피해가 묶음 이름(예: 그림 소환) 대신 그것을 만든 패시브 줄로 나옴 — 모든 캐릭터의 소환물 목록 100여 종에 적용",
        "패시브 조건 바로 뒤에 이어지는 추가 타격 17곳도 그 패시브 줄로 (예: 별 그림·달 그림·지진·여진·거미줄 등)",
      ],
      en: [
        "Damage sources, stage 3: damage dealt later by summons, zones and delayed attacks that a passive created is now listed under that passive instead of a group name (e.g. Painted spirits) — applied to about 100 summon lists across all characters",
        "17 extra hits that directly follow a passive check are also credited to that passive (e.g. star and moon drawings, quakes, aftershocks, webs)",
      ],
      ja: [
        "ダメージの出どころ 第3弾：パッシブが作った召喚物・領域・予約攻撃が後から与えたダメージが、まとめ名（例：描いた霊）ではなくそれを作ったパッシブの行に表示 — 全キャラの召喚物リスト約100種に適用",
        "パッシブ条件の直後に続く追加攻撃17か所もそのパッシブの行に（例：星の絵・月の絵・地震・余震・クモの巣など）",
      ],
    },
  },
  {
    version: "0.52.42",
    date: "2026-11-12",
    items: {
      ko: [
        "맞는 소리가 무기에 따라 달라짐: 베임 · 둔기 · 찔림 · 마법 (전용 소리가 있는 캐릭터는 그대로)",
        "적 쪽 소리 추가: 적이 탄을 쏠 때 · 적 기술 예고 · 보스의 큰 기술 예고(낮게 깔리는 경고음)",
        "음악: 층마다 가락이 바뀜(4가지) · 보스마다 다른 보스 가락(4가지, 같은 보스는 늘 같은 가락) · 라스트 보스와 아레나 마지막 방도 가장 웅장한 편성",
        "새 곡: 메인 화면 · 상점 방 · 쉼터 방",
        "설정에 '체력 낮을 때 심장 소리' · '메뉴 버튼 소리' 끄기 추가",
        "피해 출처: 추적자의 스킬(암습 저격·강력한 한방·연발사격)이 '스킬' 줄로 따로 나옴",
      ],
      en: [
        "Hit sounds now depend on your weapon: slash · blunt · pierce · magic (characters with their own sounds are unchanged)",
        "Enemy sounds added: enemy shots · enemy attack warnings · a low rising alarm when a boss telegraphs a big attack",
        "Music: a different melody per floor (4) · a different boss melody per boss (4, the same boss always gets the same one) · last bosses and the final arena room get the grandest arrangement",
        "New tracks: main menu · shop room · rest room",
        "Settings: new toggles for 'Low-health heartbeat' and 'Menu button sound'",
        "Damage sources: the Tracker's skills (Ambush Snipe, Power Shot, Burst Fire) are listed in their own 'Skills' row",
      ],
      ja: [
        "当たった音が武器によって変化：斬撃 · 打撃 · 刺突 · 魔法（専用の音があるキャラはそのまま）",
        "敵側の音を追加：敵が弾を撃つとき · 敵の技の予告 · ボスの大技の予告（低く響く警告音）",
        "音楽：階ごとにメロディが変化（4種） · ボスごとに違うボス曲（4種、同じボスはいつも同じ曲） · ラストボスとアリーナ最後の部屋も最も壮大な編成に",
        "新しい曲：メイン画面 · ショップの部屋 · 休憩所の部屋",
        "設定に「体力が少ないとき心臓の音」「メニューボタンの音」のオン・オフを追加",
        "ダメージの出どころ：追跡者のスキル（奇襲狙撃・強力な一発・連発射撃）が「スキル」の行に分かれて表示",
      ],
    },
  },
  {
    version: "0.52.41",
    date: "2026-11-12",
    items: {
      ko: [
        "백인장 그림이 사라지던 문제 고침",
        "백령·빙설·아수라·혼령·백인장·아리아의 몸 크기를 다른 캐릭터와 같게 줄임",
        "아리아 음표 크기를 작게",
      ],
      en: [
        "Fixed Baekinjang's sprite disappearing",
        "Baekryeong, Bingseol, Asura, Honryeong, Baekinjang and Aria are now drawn at the same size as the other characters",
        "Aria's notes are smaller",
      ],
      ja: [
        "百人長の絵が消えていた問題を修正",
        "白霊・氷雪・阿修羅・魂霊・百人長・アリアの体の大きさを他のキャラと同じに",
        "アリアの音符を小さく",
      ],
    },
  },
  {
    version: "0.52.40",
    date: "2026-11-12",
    items: {
      ko: [
        "새 캐릭터 아리아 (실베르): 영혼 팔이 맨 큰 악기와 노래로 싸우는 지휘자 소녀 · 음표가 느리게 둥실거리며 방 끝까지 날아가 적을 뚫고 지나감",
        "기본 패시브 여덟 음표 터짐: 방에 서로 다른 음표 8개가 모이면 8개가 저마다 다른 색으로 크게 터짐",
        "무기 10: 황금 지휘봉 · 은빛 플루트 · 첼로 활 · 금빛 트럼펫(셋 부채꼴) · 종 지휘봉(기절) · 서정의 리라(적에게 휨) · 작은 북(울림) · 겨울 오르골(느려짐) · 불꽃 탬버린(화상) · 진혼곡 악보(출혈)",
        "전용 패시브 10: 피아노 · 하프 · 호른 · 클라리넷(방 어딘가에 놓여 음표로 공격 · 클라리넷은 적을 따라다니며 느리게·공격을 늦게·받는 피해 증가) · 영혼의 바이올린 · 화음 · 돌림노래 · 포르티시모 · 앙코르 · 마에스트로",
        "악보 완성: 악기 넷이 모두 놓인 채 여덟 음표가 터지면 10초 동안 방 전체에 8색 폭죽이 쉬지 않고 터짐",
        "피해 출처에 '여덟 음표 터짐' · '악보 완성' · 악기·바이올린·앙코르가 저마다 따로 나옴 · 그림 시트·악기·폭죽 이펙트·음표마다 다른 음의 효과음",
      ],
      en: [
        "New character Aria (Silber): a young conductor who fights with song and the big instruments her soul hands carry · her notes float slowly all the way to the room's edge, passing through foes",
        "Base passive Octet Burst: when eight different notes are in the room, all eight burst in different colors",
        "10 weapons: Golden Baton · Silver Flute · Cello Bow · Golden Trumpet (fan of three) · Bell Baton (stun) · Lyric Lyre (curves to foes) · Little Drum (echo) · Winter Music Box (slow) · Flame Tambourine (burn) · Requiem Score (bleed)",
        "10 exclusive passives: Piano · Harp · Horn · Clarinet (placed somewhere in the room and attack with notes · the clarinet follows foes, slowing them, delaying their attacks and raising damage taken) · Soul Violin · Chord · Canon · Fortissimo · Encore · Maestro",
        "Score Complete: if all four instruments are placed when the eight notes burst, fireworks in eight colors burst all over the room for 10s",
        "Damage sources list Octet Burst, Score Complete and each instrument, the violin and Encore separately · sprite sheet, instrument and firework effects, and a different pitch for every note",
      ],
      ja: [
        "新キャラ アリア（シルベル）：魂の手が担ぐ大きな楽器と歌で戦う指揮者の少女 · 音符がゆっくりふわふわと部屋の端まで飛び、敵を貫く",
        "基本パッシブ 八音符の破裂：部屋に違う音符が8個集まると8個がそれぞれ違う色で大きく弾ける",
        "武器10：黄金の指揮棒 · 銀のフルート · チェロの弓 · 金のトランペット（3つ扇形） · 鐘の指揮棒（気絶） · 叙情のリラ（敵へ曲がる） · 小太鼓（響き） · 冬のオルゴール（鈍化） · 炎のタンバリン（火傷） · 鎮魂歌の楽譜（出血）",
        "専用パッシブ10：ピアノ · ハープ · ホルン · クラリネット（部屋のどこかに置かれ音符で攻撃 · クラリネットは敵を追い、遅く・攻撃を遅く・被ダメージ増加） · 魂のバイオリン · 和音 · 輪唱 · フォルティッシモ · アンコール · マエストロ",
        "楽譜完成：楽器4つがそろった状態で八音符が弾けると、10秒間部屋全体に8色の花火が絶え間なく弾ける",
        "ダメージの出どころに「八音符の破裂」「楽譜完成」、楽器・バイオリン・アンコールがそれぞれ別に表示 · スプライトシート・楽器と花火のエフェクト・音符ごとに違う音程の効果音",
      ],
    },
  },
  {
    version: "0.52.39",
    date: "2026-11-12",
    items: {
      ko: [
        "소리 전체를 약 2배 크게 (효과음·음악 모두 · 설정의 소리 크기로 조절) — 여러 소리가 겹쳐도 찢어지지 않게 마지막에 한 번 눌러 줌",
        "무기에 맞는 공격 소리: 검 · 단검 · 망치/도끼 · 창 · 주먹 · 활 · 던지는 무기 · 총 · 지팡이(마법) · 폭탄이 저마다 다른 소리 (전용 소리가 있는 캐릭터는 그대로)",
        "빠져 있던 소리 추가: 대시 · 체력 회복 · 방을 정리해 문이 열릴 때 · 체력이 25% 이하일 때 심장 소리 · 메뉴 버튼",
        "음악: 3층부터 하이햇, 5층부터 북이 붙고, 보스전은 북·낮은 현·금관 화음이 겹침. 7층 라스트 보스는 합창·팀파니·심벌까지 더해 가장 웅장하게",
        "피해 출처: 파수꾼 '반격의 방패' 충격파가 '캐릭터 특징'이 아니라 그 패시브 줄로 나옴",
      ],
      en: [
        "All audio is about twice as loud (sound effects and music · still adjustable in Settings) — a final limiter keeps overlapping sounds from distorting",
        "Weapon-matched attack sounds: swords · daggers · hammers/axes · spears · fists · bows · thrown weapons · guns · staves (magic) · bombs each sound different (characters with their own sounds are unchanged)",
        "Added missing sounds: dash · healing · the doors unlocking when a room is cleared · a heartbeat at 25% health or less · menu buttons",
        "Music: hi-hats from floor 3 and drums from floor 5; boss fights layer drums, low strings and brass chords. The floor 7 last boss adds choir, timpani and cymbals for the grandest sound",
        "Damage sources: the Warden's 'Counter Shield' shockwave is now listed under that passive instead of 'Character trait'",
      ],
      ja: [
        "音全体を約2倍の大きさに（効果音・音楽とも · 設定の音量で調整可能）— 重なっても割れないよう最後にリミッターをかけています",
        "武器に合った攻撃音：剣 · 短剣 · ハンマー/斧 · 槍 · 拳 · 弓 · 投げ武器 · 銃 · 杖（魔法） · 爆弾がそれぞれ別の音に（専用の音があるキャラはそのまま）",
        "足りなかった音を追加：ダッシュ · 体力回復 · 部屋を片付けて扉が開くとき · 体力25%以下で心臓の音 · メニューボタン",
        "音楽：3階からハイハット、5階から太鼓が加わり、ボス戦は太鼓・低い弦・金管の和音が重なります。7階のラストボスは合唱・ティンパニ・シンバルまで加わり最も壮大に",
        "ダメージの出どころ：番人の「反撃の盾」の衝撃波が「キャラ特性」ではなくそのパッシブの行に表示",
      ],
    },
  },
];
