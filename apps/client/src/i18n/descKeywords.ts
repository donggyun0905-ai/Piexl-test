// 설명 글에서 색·굵게 보일 중요 낱말 (game/RichText): 상태이상·핵심 효과·게이지 이름 (한·영·일 모두 한 목록, 긴 낱말이 먼저 맞음)
export const DESC_KEYWORDS: readonly string[] = [
  // 상태이상
  "출혈", "화상", "독", "저주", "폭풍", "부식", "지옥불", "감전", "서리", "빙결", "물결", "황금", "광휘", "달빛", "청염", "공허탄", "치유감소",
  "기절", "속박", "느림", "공포", "밀치기", "넉백",
  // 핵심 효과
  "치명타", "확정 치명타", "약점 공격", "성흔", "각성", "대시", "관통", "흡혈", "보호막", "무적", "처형", "재생", "회복", "패시브", "필살기", "궁극기", "새 공격", "콤보", "스택", "표적",
  "Bleed", "Burn", "Poison", "Curse", "Storm", "Rot", "Hellfire", "Shock", "Frost", "Freeze", "Tide", "Radiance", "Moonlight", "Blue Flame", "Void Bolt",
  "Stun", "Root", "Slow", "Fear", "Knockback", "Crit", "critical", "Weak-point", "weak-point", "Stigma", "Awakening", "Dash", "dash", "Pierce", "Lifesteal", "Shield", "Invincible", "Execute", "Combo", "Passive", "Ultimate", "New attack",
  "出血", "火傷", "毒", "呪い", "嵐", "腐食", "地獄の炎", "感電", "霜", "凍結", "波", "光輝", "月光", "青炎", "気絶", "拘束", "鈍足", "恐怖", "ノックバック",
  "クリティカル", "弱点攻撃", "聖痕", "覚醒", "ダッシュ", "貫通", "吸血", "シールド", "無敵", "処刑", "コンボ", "パッシブ", "必殺技", "新攻撃",
];
