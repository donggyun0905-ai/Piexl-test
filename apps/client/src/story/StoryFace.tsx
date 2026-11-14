// 스토리 얼굴: 캐릭터 그림(서 있는 모습) · art면 일러스트 초상화(있을 때, 대화 장면) · 보스는 도감 그림 · 그 밖은 물음표
import { CHARACTERS, type CharacterId } from "@pixel-rogue/shared";
import type { Lang, TextKey } from "../i18n";
import { EnemyPortrait } from "../codex/EnemyPortrait";
import { SPEAKER_NAME } from "../i18n/story/world";
import { SkinPreview } from "../shop/SkinPreview";
import { charFaceSrc } from "../select/charArt";
import { BOSS_FACE, speakerSheet, type OtherSpeaker, type Speaker } from "./storyData";

export function StoryFace({ who, size, art = false }: { who: Speaker; size: number; art?: boolean }) {
  const face = art ? charFaceSrc(who) : null;
  if (face) return <img className="story-portrait" src={face} alt="" width={size} height={size} draggable={false} />;
  const boss = BOSS_FACE[who];
  if (boss) return <EnemyPortrait kind={boss} size={size} />;
  const sheet = speakerSheet(who);
  if (!sheet) return <span className="story-face-none" style={{ width: size, height: size }}>?</span>;
  return <SkinPreview sheet={sheet} size={size} />;
}

/** 말하는 사람 이름 (캐릭터는 화면 글자, 세 아이·태초 등은 스토리 글자) */
export function speakerName(who: Speaker, lang: Lang, t: (k: TextKey) => string): string {
  return who in CHARACTERS ? t(who as CharacterId & TextKey) : SPEAKER_NAME[who as OtherSpeaker][lang];
}
