// 캐릭터 설명: 실베르 (아리아) · 한·영·일 (수치는 weaponsAria·itemsAria와 맞춤) — silber5.ts가 커서 나눔
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_SILBER6: Guide = {
  aria: [
    "실베르 · 아리아 '영혼 팔이 맨 큰 악기와 노래로 싸우는 지휘자 소녀' · 체력 85 · 공격력 8 · 이동 1.2 · 행운 1 · 처음엔 약하지만 패시브를 먹을수록 강해짐 (진영 특징: 패시브 하나마다 능력치가 더 오름)",
    "무기 10 (음표): 누르면 음표가 느리게 둥실거리며 앞으로 날아가 방 끝까지 감 · 적을 뚫고 지나가며 적마다 한 번씩 맞힘 · 음표는 8종 (방에 없는 종류가 자주 나옴)",
    "무기마다: 황금 지휘봉(기본) · 은빛 플루트(작고 빠르게 자주) · 첼로 활(크고 무겁게) · 금빛 트럼펫(셋 부채꼴) · 종 지휘봉(15% 기절) · 서정의 리라(적에게 휨) · 작은 북(맞은 자리 울림) · 겨울 오르골(느려짐) · 불꽃 탬버린(화상) · 진혼곡 악보(출혈·크게 출렁임)",
    "기본 패시브 여덟 음표 터짐: 방에 서로 다른 음표 8개가 모이면 8개가 저마다 다른 색으로 크게 터짐 (하나마다 공격력의 220%, 음표가 자주 모이는 무기는 약하게)",
    "악기 4 (전용 패시브, 공격마다 확률로 방 어딘가에): 피아노(하나·60초, 음표 셋) · 하프(하나·60초, 음표 다섯 부채꼴) · 호른(둘·30초, 빠른 음표 하나씩) · 클라리넷(둘·30초, 적을 따라다니며 둘레 적을 느리게·공격을 늦게·받는 피해 1.25배)",
    "악보 완성 (궁극기): 피아노·하프·호른·클라리넷이 모두 놓인 채 여덟 음표가 터지면 10초 동안 방 전체에 8색 폭죽이 쉬지 않고 터짐 · 끝나고 5초 뒤 다시 될 수 있음",
    "그 밖의 전용 패시브: 영혼의 바이올린(곁을 떠다니며 활로 둘레를 2번 벰) · 화음(공격마다 다른 음표 하나 더) · 돌림노래(음표가 방 끝에서 한 번 튕김) · 포르티시모(음표 피해 1.25배·터짐 범위 1.3배) · 앙코르(터진 자리에서 한 번 더·악보 완성 +3초) · 마에스트로(악기 확률 1.5배·시간 1.5배·악기 음표 1.3배)",
  ],
};

export const GUIDE_EN_SILBER6: Guide = {
  aria: [
    "Silber · Aria, the young conductor who fights with song and the big instruments her soul hands carry · HP 85 · damage 8 · move 1.2 · luck 1 · weak at first but stronger with every passive (faction trait: each passive raises stats further)",
    "10 weapons (notes): press to send a note floating slowly ahead all the way to the room's edge · it passes through foes, hitting each once · there are 8 kinds of notes (kinds missing from the room come up often)",
    "By weapon: Golden Baton (basic) · Silver Flute (small, fast and frequent) · Cello Bow (big and heavy) · Golden Trumpet (fan of three) · Bell Baton (15% stun) · Lyric Lyre (curves toward foes) · Little Drum (echo where it hits) · Winter Music Box (slow) · Flame Tambourine (burn) · Requiem Score (bleed · wide sway)",
    "Base passive Octet Burst: when eight different notes are in the room, all eight burst in different colors (220% of damage each; weaker on weapons that gather notes quickly)",
    "4 instruments (exclusive passives, placed somewhere in the room by chance on attack): Piano (one · 60s · three notes) · Harp (one · 60s · fan of five) · Horn (two · 30s · fast single notes) · Clarinet (two · 30s · follows foes; nearby foes are slowed, attack later and take x1.25 damage)",
    "Score Complete (ultimate): if the piano, harp, horn and clarinet are all placed when the eight notes burst, fireworks in eight colors burst all over the room for 10s · can happen again 5s after it ends",
    "Other exclusive passives: Soul Violin (floats beside you and sweeps its bow twice around you) · Chord (one more note of a different kind per attack) · Canon (notes bounce once at the room's edge) · Fortissimo (note damage x1.25 · burst radius x1.3) · Encore (each burst spot bursts again · Score Complete +3s) · Maestro (instrument chance x1.5 · duration x1.5 · instrument notes x1.3)",
  ],
};

export const GUIDE_JA_SILBER6: Guide = {
  aria: [
    "シルベル・アリア「魂の手が担ぐ大きな楽器と歌で戦う指揮者の少女」・体力85・攻撃力8・移動1.2・幸運1・最初は弱いがパッシブを取るほど強くなる（陣営の特徴：パッシブ1つごとに能力値がさらに上がる）",
    "武器10（音符）：押すと音符がゆっくりふわふわと前へ飛び、部屋の端まで進む・敵を貫いて敵ごとに1回当たる・音符は8種（部屋にない種類がよく出る）",
    "武器ごと：黄金の指揮棒（基本）・銀のフルート（小さく速く頻繁に）・チェロの弓（大きく重く）・金のトランペット（3つ扇形）・鐘の指揮棒（15%気絶）・叙情のリラ（敵へ曲がる）・小太鼓（当たった場所に響き）・冬のオルゴール（鈍化）・炎のタンバリン（火傷）・鎮魂歌の楽譜（出血・大きく揺れる）",
    "基本パッシブ 八音符の破裂：部屋に違う音符が8個集まると8個がそれぞれ違う色で大きく弾ける（1個 攻撃力の220%、音符が早く集まる武器は弱め）",
    "楽器4（専用パッシブ、攻撃ごとに確率で部屋のどこかに）：ピアノ（1台・60秒、音符3つ）・ハープ（1台・60秒、音符5つ扇形）・ホルン（2台・30秒、速い音符を1つずつ）・クラリネット（2台・30秒、敵を追い周りの敵を遅く・攻撃を遅く・被ダメージ1.25倍）",
    "楽譜完成（究極技）：ピアノ・ハープ・ホルン・クラリネットがそろった状態で八音符が弾けると、10秒間部屋全体に8色の花火が絶え間なく弾ける・終わって5秒後に再び可能",
    "その他の専用パッシブ：魂のバイオリン（そばに浮かび弓で周りを2回斬る）・和音（攻撃ごとに別の音符がもう1つ）・輪唱（音符が部屋の端で1回跳ね返る）・フォルティッシモ（音符ダメージ1.25倍・破裂範囲1.3倍）・アンコール（弾けた場所でもう一度・楽譜完成+3秒）・マエストロ（楽器の確率1.5倍・時間1.5倍・楽器の音符1.3倍）",
  ],
};
