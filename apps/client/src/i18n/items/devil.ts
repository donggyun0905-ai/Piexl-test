// 악마의 거래 패시브 이름·설명 (비밀의 방 악마의 방, itemsDevil). 설명 앞에 [악마의 거래] 표시
import type { DevilId } from "@pixel-rogue/shared";
import type { Names } from "./names";

export const DEVIL_NAMES: Record<DevilId, Names> = {
  devilBlood: { ko: "악마의 피", en: "Devil's Blood", ja: "悪魔の血" },
  devilMask: { ko: "사탄의 가면", en: "Mask of Satan", ja: "サタンの仮面" },
  devilSpots: { ko: "붉은 반점", en: "Crimson Spots", ja: "赤い斑点" },
  devilScream: { ko: "누군가의 절규", en: "Someone's Scream", ja: "誰かの絶叫" },
  devilCross: { ko: "뒤집어진 십자가", en: "Inverted Cross", ja: "逆さ十字" },
  devilReaper: { ko: "그림 리퍼", en: "Grim Reaper", ja: "グリムリーパー" },
};

const TAG = { ko: "[악마의 거래] ", en: "[Devil's Deal] ", ja: "[悪魔の取引] " };
const d = (ko: string, en: string, ja: string): Names => ({ ko: TAG.ko + ko, en: TAG.en + en, ja: TAG.ja + ja });

export const DEVIL_DESC: Record<DevilId, Names> = {
  devilBlood: d("공격력 +6 · 공격력 +30% · 방어력 +20", "+6 damage · +30% damage · +20 defense", "攻撃力+6 · 攻撃力+30% · 防御力+20"),
  devilMask: d(
    "1초마다 가까운 적 다섯에게 죽음의 오라, 다 오르면 피해 (최대 체력 10%, 보스는 1/4 기준 + 공격력 60%)",
    "Every second, a death aura rises on the 5 nearest foes and strikes (10% max HP, bosses on 1/4 + 60% damage)",
    "1秒ごとに近くの敵5体に死のオーラ、昇りきるとダメージ (最大体力10%、ボスは1/4基準 + 攻撃力60%)",
  ),
  devilSpots: d("방어력 +30 · 공격력을 올리는 패시브 하나마다 방어력 +5 · 검은 오라", "+30 defense · +5 defense per damage-raising passive · black aura", "防御力+30 · 攻撃力を上げるパッシブ1つごとに防御力+5 · 黒いオーラ"),
  devilScream: d("공격 속도 +30% · 모든 공격에 범위 피해 (50%) · 푸른 오라", "+30% attack speed · every hit splashes nearby foes (50%) · blue aura", "攻撃速度+30% · すべての攻撃に範囲ダメージ (50%) · 青いオーラ"),
  devilCross: d("보스에게 주는 피해 +66% · 붉은 오라", "+66% damage to bosses · red aura", "ボスへのダメージ+66% · 赤いオーラ"),
  devilReaper: d("모든 공격에 적 방어력 -30 (받는 피해 +30%) · 검은 낫", "Every hit strips 30 defense (+30% damage taken) · black scythe", "すべての攻撃で敵の防御力-30 (被ダメージ+30%) · 黒い鎌"),
};
