// 화면 글자: 단련의 방 (game/gym: 미니게임 셋·강화 목록)
type L = { ko: string; en: string; ja: string };
const l = (ko: string, en: string, ja: string): L => ({ ko, en, ja });

export const GYM_TEXT = {
  gymTitle: l("단련의 방", "Training Room", "鍛錬の部屋"),
  gymHowSandbag: l("화살표가 뜨면 고리가 줄어드는 동안 같은 방향(화살표·WASD·아래 버튼)을 눌러요. 맞힐수록 빨라지고, 3번 틀리면 끝", "When an arrow appears, press the same direction (arrows, WASD or the buttons) before the ring closes. It speeds up; 3 misses ends it", "矢印が出たら輪が縮む間に同じ方向（矢印・WASD・下のボタン）を押そう。当てるほど速くなり、3回ミスで終わり"),
  gymHowLat: l("공이 가운데 초록 칸에 들어왔을 때 패드(Space·F·동그라미)를 눌러 터뜨려요. 칸 밖에서 누르거나 놓치면 실수, 3번이면 끝", "Press the pad (Space, F or the circle) while a ball is in the green zone. Pressing outside or letting one pass is a miss; 3 misses ends it", "ボールが真ん中の緑の枠に入ったらパッド（Space・F・丸）を押して割ろう。枠の外で押すか見逃すとミス、3回で終わり"),
  gymHowBench: l("패드(Space·F·동그라미)를 계속 눌러 힘을 채워 바벨을 버텨요. 갈수록 빨리 빠지고, 힘이 다 빠지면 안전바에 내려놓고 끝", "Keep tapping the pad (Space, F or the circle) to hold the barbell up. Your strength drains faster over time; when it runs out the bar goes on the safety rack", "パッド（Space・F・丸）を押し続けて力を溜め、バーベルを支えよう。だんだん早く抜け、力が尽きたらセーフティに置いて終わり"),
  gymEnd: l("끝!", "Done!", "終了！"),
  gymRack: l("안전바에 내려놓음", "Racked on the safety bar", "セーフティに置いた"),
  gymPad: l("누르기", "Press", "押す"),
  gymScore: l("{n}점", "{n} pts", "{n}点"),
  gymGot: l("강화 포인트 +{n}", "+{n} upgrade points", "強化ポイント+{n}"),
  gymPts: l("남은 강화 포인트: {n} (누르면 한 단계씩, 나중에 다시 와서 써도 돼요)", "Upgrade points left: {n} (one level per press; you can come back later)", "残り強化ポイント: {n}（押すと1段階ずつ、後で戻って使ってもOK）"),
  gymPer: l("단계당", "per level", "1段階"),
  gymNow: l("지금", "now", "現在"),
  gymPassivePlainNote: l("능력치가 없는 효과 패시브라 대신 공격력이 오름 (효과는 그대로)", "Effect-only passive, so damage goes up instead (the effect itself stays the same)", "能力値のない効果パッシブなので代わりに攻撃力が上がる（効果はそのまま）"),
  gymPassiveBadNote: l("깎는 몫(체력·이동 속도 등 −)은 커지지 않고 그대로", "Penalties (− HP, move speed, etc.) don't grow", "マイナス分（体力・移動速度など）は増えずそのまま"),
  gymStat_projectileSpeed: l("탄 속도", "Projectile speed", "弾速"),
  gymStat_damage: l("공격력", "Damage", "攻撃力"),
  gymStat_maxHp: l("최대 체력", "Max HP", "最大体力"),
  gymStat_attackSpeed: l("공격 속도", "Attack speed", "攻撃速度"),
  gymStat_moveSpeed: l("이동 속도", "Move speed", "移動速度"),
  gymStat_range: l("사거리", "Range", "射程"),
  gymStat_luck: l("행운", "Luck", "幸運"),
  gymStat_critChance: l("치명타 확률", "Crit chance", "クリティカル率"),
  gymStat_critDamage: l("치명타 피해", "Crit damage", "クリティカルダメージ"),
  gymStat_defense: l("방어력", "Defense", "防御力"),
  gymStat_regen: l("재생력", "Regen", "再生力"),
  gymStat_lifesteal: l("흡혈", "Lifesteal", "吸血"),
  gymStat_dodge: l("회피", "Dodge", "回避"),
  gymStat_weapon: l("무기 숙련 (공격력·공격 속도)", "Weapon mastery (damage & attack speed)", "武器熟練（攻撃力・攻撃速度）"),
} as const;
