// 캐릭터 설명: 새벽의 성흔 (네일러 · 시저스) · 한·영·일 (수치는 weaponsNailer·itemsNailer·weaponsDawn과 맞춤, dawn이 커서 나눔)
import type { CharacterId } from "@pixel-rogue/shared";

type Guide = Partial<Record<CharacterId, readonly string[]>>;

export const GUIDE_KO_DAWN2: Guide = {
  nailer: [
    "새벽의 성흔 · 네일러 '못 박는 심판관' · 눈을 붕대로 가린 채 악마의 영혼을 대지에 고정하듯 거대한 못과 망치로 영멸시키는 기괴하고 묵직한 사냥꾼 · 체력 120 · 공격력 15 · 방어력 2 · 이동 1.25 · 행운 2 · 스킬형",
    "못: 박힌 적의 체력 줄 위에 못 ×개수 (한도 없음) · 3 저주의 도화선으로 한 번에 터뜨림",
    "기본 공격 (누르고 있으면): 망치 내려치기 · 앞 부채꼴 46 안 120%",
    "1 못 던지기 (세 번까지): 1번 가벼운 못 60% · 2번 더 빠른 못 70% · 3번 더 빠른 못 셋 연달아 55%씩 · 박히면 못 +1 · 3번째 뒤(또는 2.5초 안 누르면) 대기 0.8초",
    "2 붉은 실 (두 번): 1번 바닥에 못을 박고 붉은 실을 끌며 240 안 가장 가까운 적에게 무적 돌진 80% → 못 다섯 · 2.5초 고정 · 2번(5초 안) 망치로 붉은 원 54 안 150% + 출혈 60% → 실을 따라 박은 못 자리로 빠르게 돌아감(무적) · 대기 10초",
    "3 저주의 도화선: 내 자리에 못을 박고(50%) 못이 박힌 모든 적에게 붉은 도화선 → 0.6초 뒤 못 하나마다 공격력 33%를 한 덩어리 저주 피해로 · 못은 0으로 · 대기 12초",
    "4 심판의 못비 (궁극기): 320 안 가장 가까운 적 하나 · 제자리에서 나와 양옆에 나타난 분신이 함께 못 셋씩 0.1초마다 10번 (못 하나 45%, 모두 박힘 = 못 30) · 표적이 죽으면 그대로 끝 · 대기 60초",
    "성흔 차는 양: 박힌 못마다 2 · 망치로 맞힌 적마다 3 · 처치 +6 (최대 100) · 달빛 각성 (6초): 둘레 90 달빛 폭발 150% · 잠깐 무적 · 모든 피해 1.3배 · 모든 공격에 달빛 1스택",
    "무기 1: 심판관의 망치와 못 · 무기 대신 아이템이 나옴",
    "전용 아이템 20: 못 5 (무거운 못 · 미늘 못 · 빠른 손목 · 흩뿌리는 못 · 깊은 못) · 망치 5 (대형 망치 · 넓은 내려치기 · 못 박기 · 머리 치기 · 울리는 쇠) · 심판 5 (붉은 실 · 단단한 고정 · 피의 원 · 깊은 저주 · 긴 도화선) · 사냥꾼 5 (못비 · 단 하나의 표적 · 달빛 못 · 눈가리개 붕대 · 끝없는 사냥)",
  ],
  scissors: [
    "새벽의 성흔 · 시저스 '단죄의 가위' · 악마의 목이나 인과율(운명의 실) 자체를 거대한 가위로 서슴없이 잘라 버리는 냉혹한 도살자 · 체력 105 · 공격력 16 · 방어력 1 · 이동 1.4 · 행운 2 · 스킬 없음(성흔 게이지)",
    "가위질 (누르고 있으면) 두 박자: 열기 (앞 넓게 52 안 80%) → 닫기 (두 날이 앞에서 맞물리는 X자 절단 60 안 150%, 맞힌 적에게 운명의 실) · 0.8초 안 치면 다시 열기부터",
    "운명의 실: 나와 적을 잇는 붉은 실 (최대 6 · 8초 · 가득이면 가장 오래된 실이 풀림) · 멀어질수록 팽팽해져 하얗게 빛남",
    "실 끊기 (대시): 묶인 실을 모두 끊어 그 적을 벰 · 80% + 팽팽함(거리 60→180)에 따라 최대 +170% · 끊기는 실이 지나는 다른 적도 50%",
    "단죄: 가위로 벨 때 체력 20% 이하인 보통 적은 목을 잘라 바로 처치 · 체력 30% 이하인 보스에게는 피해 1.4배",
    "성흔 차는 양: 열기로 맞힌 적마다 2 · 닫기 4 · 끊은 실마다 5 · 단죄 10 (최대 100) · 달빛 각성 (6초): 둘레 90 달빛 폭발 150% · 잠깐 무적 · 피해 1.3배 · 가위 거리 1.35배 · 열기도 실을 묶음 · 1.5초마다 실을 저절로 끊음 · 모든 공격에 달빛 1스택",
    "무기 1: 단죄의 쌍가위 · 무기 대신 아이템이 나옴",
    "전용 아이템 20: 절단 5 (벼린 날 · 크게 벌린 날 · 맞물리는 날 · 녹슨 날 · 쌍날) · 실 5 (실타래 · 질긴 실 · 팽팽한 실 · 엮인 운명 · 얽매임) · 단죄 5 (목 사냥꾼 · 연쇄 단죄 · 거인 사냥 · 수확 · 공포) · 달빛 5 (달빛 실 · 보름달 · 초승달 날 · 달무리 가위 · 남은 달빛)",
  ],
};

export const GUIDE_EN_DAWN2: Guide = {
  nailer: [
    "Dawn Stigmata · Nailer 'The Nailing Judge' · a grotesque, heavy hunter with bandaged eyes who obliterates demons by pinning their souls to the earth with giant nails and a hammer · HP 120 · ATK 15 · DEF 2 · Move 1.25 · Luck 2 · skill-based",
    "Nails: shown above a foe's health bar as nail ×count (no limit) · 3 Cursed Fuse detonates them all at once",
    "Basic attack (hold): hammer slam · front arc within 46 for 120%",
    "1 Nail Throw (up to three presses): 1st a light nail 60% · 2nd a faster nail 70% · 3rd three even faster nails in a row, 55% each · each hit sticks a nail · 0.8s cooldown after the 3rd (or if you wait 2.5s)",
    "2 Red Thread (two presses): 1st drive a nail into the floor and dash invulnerably, trailing a red thread, at the nearest foe within 240 for 80% → five nails · pinned 2.5s · 2nd (within 5s) hammer a red ring within 54 for 150% + 60% bleed → zip back along the thread to the nail (invulnerable) · 10s cooldown",
    "3 Cursed Fuse: drive a nail where you stand (50%); red fuses run to every nailed foe → after 0.6s each takes 33% attack per nail as one curse hit · nails reset to 0 · 12s cooldown",
    "4 Nail Judgment (ultimate): one nearest foe within 320 · stand still while you and two shadow clones at your sides throw three nails every 0.1s, 10 times (45% each, all stick = 30 nails) · ends at once if the target dies · 60s cooldown",
    "Stigma gain: 2 per stuck nail · 3 per foe hit by the hammer · +6 per kill (max 100) · Moonlight Awakening (6s): 150% moonlight burst within 90 · brief invulnerability · 1.3x all damage · every attack adds 1 Moonlight stack",
    "Weapon 1: Judge's Hammer & Nails · items drop instead of weapons",
    "Exclusive items 20: Nails 5 (Heavy Nail · Barbed Nail · Quick Wrist · Scattered Nails · Deep Nail) · Hammer 5 (Sledgehammer · Wide Slam · Drive It Home · Head Strike · Ringing Iron) · Judgment 5 (Crimson Thread · Firm Binding · Circle of Blood · Deep Curse · Long Fuse) · Hunter 5 (Nail Rain · The Only Target · Moonlit Nail · Blindfold Bandage · Relentless Hunt)",
  ],
  scissors: [
    "Dawn Stigmata · Scissors 'The Shears of Condemnation' · a ruthless butcher who snips through demons' necks and the very threads of fate with giant shears · HP 105 · ATK 16 · DEF 1 · Move 1.4 · Luck 2 · no skills (Stigma gauge)",
    "Snipping (hold) in two beats: Open (wide front within 52 for 80%) → Close (the blades meet in an X cut within 60 for 150%, tying a thread of fate to each foe hit) · resets to Open after 0.8s without attacking",
    "Threads of fate: red threads from you to foes (up to 6 · 8s · the oldest unties when full) · they grow taut and glow white as you move away",
    "Thread Snap (dash): snaps every thread, cutting the tied foes · 80% + up to +170% by tautness (distance 60→180) · other foes along a snapping thread take 50%",
    "Condemnation: normal foes at 20% HP or less are beheaded on the spot when cut · bosses at 30% HP or less take 1.4x",
    "Stigma gain: 2 per foe hit by Open · 4 by Close · 5 per snapped thread · 10 per beheading (max 100) · Moonlight Awakening (6s): 150% burst within 90 · brief invulnerability · 1.3x damage · 1.35x shear reach · Open also ties threads · threads snap by themselves every 1.5s · every attack adds 1 Moonlight stack",
    "Weapon 1: Shears of Condemnation · items drop instead of weapons",
    "Exclusive items 20: Cutting 5 (Honed Edge · Wide-Open Blades · Meeting Blades · Rusted Edge · Twin Edges) · Thread 5 (Spool of Fate · Tough Thread · Taut Thread · Woven Fate · Entanglement) · Condemnation 5 (Headhunter · Chain Condemnation · Giant Hunt · Harvest · Dread) · Moonlight 5 (Moonlit Thread · Full Moon Shears · Crescent Edge · Haloed Shears · Lingering Moonlight)",
  ],
};

export const GUIDE_JA_DAWN2: Guide = {
  nailer: [
    "暁の聖痕 · ネイラー「釘打つ審判官」· 目を包帯で覆い、悪魔の魂を大地に縫い止めるように巨大な釘と槌で滅ぼす、異様で重厚な狩人 · 体力120 · 攻撃力15 · 防御力2 · 移動1.25 · 幸運2 · スキル型",
    "釘：刺さった敵の体力バーの上に釘×数（上限なし）· 3 呪いの導火線で一気に爆ぜさせる",
    "通常攻撃（押し続けると）：槌の叩きつけ · 前方扇形46以内に120%",
    "1 釘投げ（3回まで）：1回目 軽い釘60% · 2回目 より速い釘70% · 3回目 さらに速い釘3本連続 各55% · 刺さると釘+1 · 3回目のあと（または2.5秒押さないと）待機0.8秒",
    "2 赤い糸（2回）：1回目 床に釘を打ち赤い糸を引いて240以内の最も近い敵へ無敵突進80% → 釘5本 · 2.5秒固定 · 2回目（5秒以内）槌で赤い円54以内に150%＋出血60% → 糸をたどって釘の場所へ素早く戻る（無敵）· 待機10秒",
    "3 呪いの導火線：自分の位置に釘を打ち（50%）釘が刺さった全ての敵へ赤い導火線 → 0.6秒後に釘1本ごとに攻撃力33%をひとかたまりの呪いダメージで · 釘は0に · 待機12秒",
    "4 釘の審判（必殺技）：320以内の最も近い敵1体 · その場から自分と左右に現れた分身が釘を3本ずつ0.1秒ごとに10回（1本45%、全て刺さる＝釘30）· 標的が倒れるとそのまま終了 · 待機60秒",
    "聖痕の溜まる量：刺さった釘ごとに2 · 槌で当てた敵ごとに3 · 撃破+6（最大100）· 月光覚醒（6秒）：周囲90に月光爆発150% · 一瞬無敵 · 全ダメージ1.3倍 · 全ての攻撃に月光1スタック",
    "武器1：審判官の槌と釘 · 武器の代わりにアイテムが出る",
    "専用アイテム20：釘5（重い釘 · 返し釘 · 素早い手首 · 撒き釘 · 深い釘）· 槌5（大槌 · 広い打ち下ろし · 釘打ち · 脳天打ち · 響く鉄）· 審判5（紅の糸 · 固い縫い止め · 血の円 · 深い呪い · 長い導火線）· 狩人5（釘の雨 · ただ一つの標的 · 月光の釘 · 目隠しの包帯 · 終わらぬ狩り）",
  ],
  scissors: [
    "暁の聖痕 · シザーズ「断罪の鋏」· 悪魔の首や因果律（運命の糸）そのものを巨大な鋏でためらいなく断ち切る冷酷な屠殺者 · 体力105 · 攻撃力16 · 防御力1 · 移動1.4 · 幸運2 · スキルなし（聖痕ゲージ）",
    "鋏さばき（押し続けると）二拍子：開き（前方を広く52以内に80%）→ 閉じ（二枚の刃が前で噛み合うX字切断60以内に150%、当たった敵に運命の糸）· 0.8秒攻撃しないと開きから",
    "運命の糸：自分と敵をつなぐ赤い糸（最大6本・8秒・満杯なら一番古い糸がほどける）· 離れるほど張り詰めて白く光る",
    "糸断ち（ダッシュ）：結んだ糸を全て断ち切りその敵を斬る · 80%＋張り具合（距離60→180）で最大+170% · 断たれる糸が通る他の敵も50%",
    "断罪：鋏で斬る時、体力20%以下の通常の敵は首を落として即撃破 · 体力30%以下のボスにはダメージ1.4倍",
    "聖痕の溜まる量：開きで当てた敵ごとに2 · 閉じ4 · 断った糸ごとに5 · 断罪10（最大100）· 月光覚醒（6秒）：周囲90に月光爆発150% · 一瞬無敵 · ダメージ1.3倍 · 鋏の距離1.35倍 · 開きでも糸を結ぶ · 1.5秒ごとに糸が自動で切れる · 全ての攻撃に月光1スタック",
    "武器1：断罪の双鋏 · 武器の代わりにアイテムが出る",
    "専用アイテム20：切断5（研いだ刃 · 大きく開いた刃 · 噛み合う刃 · 錆びた刃 · 双刃）· 糸5（糸巻き · 丈夫な糸 · 張り詰めた糸 · 編まれた運命 · 絡みつき）· 断罪5（首狩り · 連鎖断罪 · 巨人狩り · 収穫 · 恐怖）· 月光5（月光の糸 · 満月の鋏 · 三日月の刃 · 月暈の鋏 · 残る月光）",
  ],
};
