// 화면 글자: 빌드 꼬리표 이름 · 세트 칸 · 단계 알림 · 알 수 없는 성좌 꼬리표 고르기 (효과 줄은 i18n/buildSetLines)
type L = { ko: string; en: string; ja: string };
const l = (ko: string, en: string, ja: string): L => ({ ko, en, ja });

export const BUILD_SET_TEXT = {
  bt_fire: l("불", "Fire", "火"),
  bt_ice: l("얼음", "Ice", "氷"),
  bt_bolt: l("번개", "Lightning", "雷"),
  bt_poison: l("독", "Poison", "毒"),
  bt_light: l("빛", "Light", "光"),
  bt_dark: l("어둠", "Dark", "闇"),
  bt_death: l("죽음", "Death", "死"),
  bt_earth: l("대지", "Earth", "大地"),
  bt_water: l("물", "Water", "水"),
  bt_sharp: l("날카로움", "Sharp", "鋭さ"),
  bt_tough: l("단단함", "Sturdy", "頑丈"),
  bt_wind: l("바람", "Wind", "風"),
  bt_luck: l("행운", "Luck", "幸運"),
  bt_summon: l("소환", "Summon", "召喚"),
  bt_blood: l("피", "Blood", "血"),
  bsTitle: l("빌드 세트", "Build sets", "ビルドセット"),
  bsNone: l("같은 꼬리표 패시브를 2·4·6개 모으면 세트 효과", "Collect 2, 4 or 6 passives with the same tag for set bonuses", "同じタグのパッシブを2・4・6個集めるとセット効果"),
  bsNext: l("다음 단계까지 {n}개", "{n} more for the next tier", "次の段階まであと{n}個"),
  bsUp: l("{tag} 세트 {n}단계!", "{tag} set tier {n}!", "{tag}セット{n}段階！"),
  bsAwake: l("{tag} 각성!", "{tag} awakened!", "{tag}覚醒！"),
  bsTagLabel: l("꼬리표", "Tag", "タグ"),
  bsPickHead: l("알 수 없는 성좌: 행운과 함께 받을 꼬리표 하나를 고르세요", "Unknown constellation: choose one tag to gain along with Luck", "知られざる星座：幸運と一緒に得るタグを1つ選んでください"),
  bsAltarTags: l("증강 꼬리표 +1: {tags}", "Augment tags +1: {tags}", "増強タグ+1：{tags}"),
};
