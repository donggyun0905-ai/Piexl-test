// 티어표 이유: 새벽의 성흔 캐릭터 + 실베르 조커 (한·영·일, ko·en·ja가 커서 나눔)
import type { CharacterId } from "@pixel-rogue/shared";

type Reasons = Partial<Record<CharacterId, string>>;

export const TIER_KO_DAWN: Reasons = {
  joker: "실베르의 카드 투척자. 고정 피해 4짜리 카드가 벽에 튕길 때마다 4씩 세지는 독특한 방식이라 처음엔 약하지만, 투사체 속도와 패시브가 쌓일수록 판 위 15장이 무섭게 강해짐.",
  crusader: "십자가를 들어 올려(버팀) 내려찍고 땅을 십자가 모양으로 가르는 새벽의 성흔 탱커. 맞을수록 속죄의 무게가 차 심판의 십자가가 떨어지고, 대시로 적을 벽까지 밀어붙임 (새 캐릭터, 아직 평가 전)",
  blast: "5발 탄창 산탄총(5발마다 확정 치명타)과 대시 슬로우모션으로 싸우는 근접 화력형 악마 사냥꾼. 붙을수록 세지고 초근접 처치는 몸째 터뜨림. 맞힐수록 성흔이 차 가득 차면 달빛 각성 (새 캐릭터, 아직 평가 전)",
  nailer: "망치와 못으로 싸우는 스킬형 악마 사냥꾼. 1·2로 적에게 못을 쌓고 3 저주의 도화선으로 한 번에 터뜨림. 4 못비 30개 뒤 터뜨리면 가장 셈 (새 캐릭터, 아직 평가 전)",
  scissors: "쌍가위로 열고 닫는 두 박자 가위질에 운명의 실을 묶고, 대시로 멀리서 실을 끊어 베는 악마 사냥꾼. 체력이 적은 적은 목을 잘라 단죄 (새 캐릭터, 아직 평가 전)",
  blueFlame: "몸 둘레 세 겹 범위에 따라 불꽃 감옥·불꽃 기둥·화살을 쏘고, 모든 공격이 청염으로 타들어 가는 눈먼 마법 전사. 각성 중엔 화면이 까매지고 적만 푸르게 보이며 거대한 활로 직접 조준해 폭격 (새 캐릭터, 아직 평가 전)",
  incision: "쌍도끼 네 박자(베기·베기·교차·회오리) 연타로 도륙 콤보를 쌓는 새벽의 성흔 광전사. 콤보가 오를수록 빨라지고 30마다 도살 도약 (새 캐릭터, 아직 평가 전)",
  lunatic: "매우 빠른 찌르기(약간 돌진)·달빛 없이도 약점 30%·대시 찌르기의 새벽의 성흔 리더. 조준점이 뜬 적에 약점이면 확정 치명타 달빛 베기 (새 캐릭터, 아직 평가 전)",
  silverBullet: "한 번에 은탄 두 발을 쏘고 성수 폭탄으로 광역 정화하는 스타일리시한 엘리트 사냥꾼. 대시로 장애물을 넘고, 적에게 마크 30이면 연사, 각성 중엔 흰 활에서 유도탄 일제 사격 (새 캐릭터, 아직 평가 전)",
  hellfist: "악마의 왼팔로 후리기·내려찍기 뒤 갈라진 땅을 붉은 유리처럼 깨뜨리는 주먹 사냥꾼. 맞힐수록 악마화로 사거리가 늘고, 적혈 각성 중엔 모든 공격이 검지로 가리킨 적에게 X자 허공검격 (새 캐릭터, 아직 평가 전)",
};

export const TIER_EN_DAWN: Reasons = {
  joker: "Silber's card thrower. Cards deal a fixed 4 and grow +4 with every wall bounce, so he starts weak, but with projectile speed and passives his 15 cards on the field become fearsome.",
  crusader: "The Stigma of Dawn's tank: heaves the cross (Brace), slams it down and splits the ground in the shape of a cross. Taking hits fills the Weight of Penance for a Cross of Judgment, and the dash pins foes against walls (new character, not rated yet)",
  blast: "A close-range firepower demon hunter fighting with a 5-shell shotgun (every 5th a guaranteed crit) and dash slow motion. Stronger the closer she is, and point-blank kills blow enemies apart. Hits fill her Stigma; when full she awakens in moonlight (new character, not yet rated)",
  nailer: "A skill-based demon hunter with hammer and nails. Stack nails with 1 and 2, then pop them all at once with 3 Cursed Fuse. Popping right after the 30 nails of 4 hits hardest (new character, not rated yet)",
  scissors: "A demon hunter whose twin shears open and close in two beats, tying threads of fate, then dash away to snap the threads and cut from afar. Low-health foes are beheaded on the spot (new character, not rated yet)",
  blueFlame: "A blind magic warrior who strikes with a Flame Prison, Flame Pillar or arrow depending on which of three range rings the foe stands in, every hit burning with Blue Flame. Awakening blacks out the screen so only foes glow blue, and you aim a giant bow to bombard them (new character, not rated yet)",
  incision: "The Stigma of Dawn's berserker: a four-beat twin-axe chain (slash, slash, cross, whirlwind) that builds the Carnage Combo. Faster with every tier, with a Butcher's Leap every 30 combo (new character, not rated yet)",
  lunatic: "The Stigma of Dawn's leader: very fast rapier thrusts with a slight lunge, a 30% weak-point chance even without Moonlight, and dash thrusts. Weak points on crosshaired foes trigger a guaranteed-crit Moonlight Slash; during awakening every foe is marked (new character, not rated yet)",
  silverBullet: "A stylish elite hunter who fires two silver rounds per attack and purges crowds with holy water bombs. Dashes vault over obstacles; 30 marks on a foe unleash a Barrage, and Awakening roots them behind a white bow for a homing salvo (new character, not rated yet)",
  hellfist: "A fist-fighting hunter who hooks and slams with his demon left arm, then shatters the cracked ground like red glass. Each hit grows his reach through Demonization; during Crimson Awakening every attack becomes an X-shaped Air Slash on foes he points at (new character, not rated yet)",
};

export const TIER_JA_DAWN: Reasons = {
  joker: "シルベルのカード投げ。固定4のカードが壁で跳ねるたびに4ずつ強くなる独特な方式で最初は弱いが、弾速とパッシブが積み重なるほど場の15枚が恐ろしく強くなる。",
  crusader: "聖痕のタンク。十字架を持ち上げ（踏ん張り）叩きつけ、地面を十字に裂く。被弾で贖罪の重みが溜まり審判の十字架、ダッシュで敵を壁まで押し込む",
  blast: "5発弾倉の散弾銃（5発ごとに確定クリティカル）とダッシュのスローモーションで戦う近接火力型の悪魔狩り。近いほど強く、至近距離で倒すと体ごと吹き飛ばす。当てるほど聖痕が満ち、満ちると月光覚醒（新キャラクター、評価前）",
  nailer: "槌と釘で戦うスキル型の悪魔狩り。1・2で敵に釘を溜め、3 呪いの導火線で一気に爆ぜさせる。4の釘30本のあとに爆ぜさせると最も強い（新キャラ、まだ評価前）",
  scissors: "双鋏を開いて閉じる二拍子の鋏さばきで運命の糸を結び、ダッシュで離れて糸を断ち切って斬る悪魔狩り。体力の少ない敵は首を落として断罪（新キャラ、まだ評価前）",
  blueFlame: "体の周りの三重の範囲に応じて炎の牢獄・炎の柱・矢を放ち、全ての攻撃が青炎で燃える盲目の魔法戦士。覚醒中は画面が暗くなり敵だけが青く見え、巨大な弓で直接狙って爆撃（新キャラ、まだ評価前）",
  incision: "聖痕の狂戦士。双斧の四拍子で屠殺コンボを溜め、段階ごとに速く、30ごとに屠殺の跳躍",
  lunatic: "聖痕のリーダー。速い突き・月光なしで弱点30%・ダッシュ突き。照準の敵に弱点で確定クリの月光斬り",
  silverBullet: "一度に銀弾2発を撃ち、聖水爆弾で広範囲を浄化する華麗なエリート狩人。ダッシュで障害物を飛び越え、敵にマーク30で連射、覚醒中は白い弓から誘導弾の一斉射撃（新キャラ、まだ評価前）",
  hellfist: "悪魔の左腕で振り抜き・叩きつけ、割れた地面を赤いガラスのように砕く拳の狩人。当てるほど悪魔化で射程が伸び、赤血覚醒中は全攻撃が指した敵へのX字の虚空剣撃（新キャラ、まだ評価前）",
};
