// 화면 글자: 새벽의 성흔 네일러(못 박는 심판관) 이름·설명 · 스킬 이름·설명 · 버프 창 (charactersBlast가 커서 나눔)
export const CHARACTER_TEXT_NAILER = {
  nailer: { ko: "네일러", en: "Nailer", ja: "ネイラー" },
  nail: { ko: "망치와 못", en: "Hammer & Nails", ja: "槌と釘" },
  nailerDesc: {
    ko: "못을 박아 쌓고 3 저주의 도화선으로 한 번에 터뜨리는 스킬형 악마 사냥꾼 · 박힌 못은 적 체력 줄 위에 못 ×개수 (한도 없음) · 터뜨리면 못 하나마다 공격력 33%가 한 덩어리 피해로 · 누르고 있으면 망치로 내려침 (앞 부채꼴 120%) · 1 못 던지기: 세 번까지 눌러 점점 빠른 못 (3번째는 셋 연달아) → 0.8초 대기 · 2 붉은 실: 바닥에 못을 박고 가장 가까운 적에게 무적 돌진해 못 다섯·고정 → 한 번 더 누르면 망치 원(출혈) 뒤 실을 따라 박은 못으로 돌아감 · 4 심판의 못비: 제자리에서 한 적에게 나와 양옆에서 못 셋씩 10번 (표적이 죽으면 끝) · 맞힐수록 성흔이 차고 가득 차면 달빛 각성 (피해 1.3배·달빛 상태이상) · 요령: 1·2로 못을 박아 두고 3으로 터뜨리기 · 4 못비 30개 뒤 3을 쓰면 가장 셈",
    en: "A skill-based demon hunter who drives nails in and detonates them all at once with 3 Cursed Fuse · stuck nails show above the foe's health bar as a nail ×count (no limit) · detonation deals 33% attack per nail as one big hit · hold to slam the hammer (front arc 120%) · 1 Nail Throw: press up to three times for faster nails (the 3rd throws three in a row) → 0.8s cooldown · 2 Red Thread: drive a nail into the floor and dash invulnerably at the nearest foe, pinning it with five nails → press again for a hammer ring (bleed), then fly back along the thread to the nail · 4 Nail Judgment: stand still while you and two flanking points hammer three nails at a time into one foe, 10 times (ends if it dies) · hits fill your Stigma; when full you awaken in moonlight (1.3x damage, moonlight status) · Tip: Stack nails with 1 and 2, then pop them with 3 · using 3 right after the 30 nails of 4 hits hardest",
    ja: "釘を打ち込んで溜め、3 呪いの導火線で一気に爆ぜさせるスキル型の悪魔狩り · 刺さった釘は敵の体力バーの上に釘×数（上限なし）· 爆ぜると釘1本ごとに攻撃力33%がひとかたまりのダメージに · 押し続けると槌で叩きつける（前方扇形120%）· 1 釘投げ：3回まで押すとだんだん速い釘（3回目は3本連続）→ 待機0.8秒 · 2 赤い糸：床に釘を打ち最も近い敵へ無敵突進し釘5本で固定 → もう一度押すと槌の円（出血）のあと糸をたどって釘の場所へ戻る · 4 釘の審判：その場から1体の敵へ自分と左右から釘3本ずつ10回（標的が倒れると終了）· 当てるほど聖痕が満ち、満ちると月光覚醒（ダメージ1.3倍・月光状態異常）· コツ: 1・2で釘を打ち込み3で爆ぜさせる · 4の釘30本のあとに3を使うと最も強い",
  },
  nlSkill1: { ko: "못 던지기", en: "Nail Throw", ja: "釘投げ" },
  nlSkill2: { ko: "붉은 실", en: "Red Thread", ja: "赤い糸" },
  nlSkill3: { ko: "저주의 도화선", en: "Cursed Fuse", ja: "呪いの導火線" },
  nlSkill4: { ko: "심판의 못비", en: "Nail Judgment", ja: "釘の審判" },
  nlSkillTip1: {
    ko: "세 번까지 눌러 못을 던짐: 1번 가볍게(60%) · 2번 더 빠르게(70%) · 3번 더 빠른 못 셋 연달아(55%씩) · 박히면 못 +1 · 3번째 뒤(또는 2.5초 안 누르면) 대기 0.8초",
    en: "Press up to three times: 1st a light nail (60%) · 2nd a faster one (70%) · 3rd three even faster nails in a row (55% each) · each hit sticks a nail · 0.8s cooldown after the 3rd (or if you wait 2.5s)",
    ja: "3回まで押して釘を投げる：1回目は軽く（60%）· 2回目はより速く（70%）· 3回目はさらに速い釘3本連続（各55%）· 刺さると釘+1 · 3回目のあと（または2.5秒押さないと）待機0.8秒",
  },
  nlSkillTip2: {
    ko: "1번: 바닥에 못을 박고 붉은 실을 끌며 가장 가까운 적에게 무적 돌진(80%) → 못 다섯·2.5초 고정 · 2번(5초 안): 망치로 내려쳐 붉은 원(150% + 출혈) → 실을 따라 박은 못으로 빠르게 돌아감 · 대기 10초",
    en: "1st: drive a nail into the floor and dash invulnerably at the nearest foe trailing a red thread (80%) → five nails, pinned 2.5s · 2nd (within 5s): hammer a red ring (150% + bleed) → zip back along the thread to the nail · 10s cooldown",
    ja: "1回目：床に釘を打ち赤い糸を引いて最も近い敵へ無敵突進（80%）→ 釘5本・2.5秒固定 · 2回目（5秒以内）：槌で叩いて赤い円（150%＋出血）→ 糸をたどって釘の場所へ素早く戻る · 待機10秒",
  },
  nlSkillTip3: {
    ko: "내 자리에 못을 박아 못이 박힌 모든 적에게 붉은 도화선 → 0.6초 뒤 못 하나마다 공격력 33%를 한 번에 (저주 피해) · 못은 0으로 · 대기 12초",
    en: "Drive a nail where you stand; red fuses run to every nailed foe → after 0.6s each takes 33% attack per nail in a single hit (curse damage) · nails reset to 0 · 12s cooldown",
    ja: "自分の位置に釘を打ち、釘が刺さった全ての敵へ赤い導火線 → 0.6秒後に釘1本ごとに攻撃力33%を一度に（呪いダメージ）· 釘は0に · 待機12秒",
  },
  nlSkillTip4: {
    ko: "궁극기: 제자리에서 가장 가까운 적 하나에게 나와 양옆에서 망치로 친 못 셋씩 빠르게 10번 (못 하나 45%, 모두 박힘) · 표적이 죽으면 그대로 끝 · 대기 60초",
    en: "Ultimate: stand still and hammer nails at the nearest foe from yourself and both flanks, three at a time, 10 times fast (45% each, all stick) · ends at once if the target dies · 60s cooldown",
    ja: "必殺技：その場から最も近い敵1体へ自分と左右から槌で打った釘を3本ずつ素早く10回（1本45%、全て刺さる）· 標的が倒れるとそのまま終了 · 待機60秒",
  },
  bfNlAwake: { ko: "달빛 각성 {s}초: 피해 1.3배", en: "Moonlight Awakening {s}s: 1.3x damage", ja: "月光覚醒{s}秒：ダメージ1.3倍" },
  pwSk_nailer1: { ko: "못 던지기", en: "Nail Throw", ja: "釘投げ" },
  pwSk_nailer2: { ko: "붉은 실", en: "Red Thread", ja: "赤い糸" },
  pwSk_nailer3: { ko: "저주의 도화선", en: "Cursed Fuse", ja: "呪いの導火線" },
  pwSk_nailer4: { ko: "심판의 못비", en: "Nail Judgment", ja: "釘の審判" },
  cg_nailer: { ko: "최대 체력 {n} 달성", en: "Reach {n} max HP", ja: "最大体力{n}達成" },
};
