// 화면 글자: 프롤로그(처음 플레이 · 검은 화면에서 서기관이 말함 · 이름 묻기, docs/QUEST.md 2절) · 지도 로딩 화면
// 대사 순서는 prologue/Prologue의 LINES · {name} = 입력한 이름
export const PROLOGUE_TEXT = {
  prl1: { ko: "…아, 드디어 눈을 떴구나.", en: "…Ah, you've finally opened your eyes.", ja: "…ああ、やっと目を覚ましたね。" },
  prl2: { ko: "안녕? 놀라지 마. 여긴 아직 아무것도 적히지 않은 페이지 위야.", en: "Hello there. Don't be scared. We're standing on a page where nothing has been written yet.", ja: "こんにちは。驚かないで。ここはまだ何も書かれていないページの上だよ。" },
  prl3: { ko: "나는 서기관. 이 세계에서 일어나는 모든 이야기를 적어 두는 사람이지.", en: "I am the Scribe. I write down every story that happens in this world.", ja: "私は書記官。この世界で起きるすべての物語を書き留める者さ。" },
  prl4: { ko: "그리고 너는… 그래, 이번 이야기의 주인공이 될 아이구나.", en: "And you… yes, you must be the one who will be the hero of this story.", ja: "そして君は…そう、今度の物語の主人公になる子なんだね。" },
  prl5: { ko: "어둠 속에서 펜 끝이 사각거리는 소리가 들린다.", en: "Somewhere in the dark, the tip of a pen scratches across paper.", ja: "暗闇の中で、ペン先が紙をかすめる音がする。" },
  prl6: { ko: "오해하진 마. 칼을 들고 앞장서는 건 네가 아니야. 그 일은 영웅들이 할 거야.", en: "Don't misunderstand. You won't be the one charging in with a sword. That is the heroes' job.", ja: "誤解しないで。剣を手に先頭に立つのは君じゃない。それは英雄たちの役目だ。" },
  prl7: { ko: "용에게 아버지를 잃은 사냥꾼의 아들, 문을 지키는 기사, 불을 다루는 마법사… 그리고 아직 이름도 적히지 않은 수많은 이들.", en: "A hunter's son who lost his father to a dragon, a knight who guards the gate, a mage who commands fire… and countless others whose names are not yet written.", ja: "竜に父を奪われた狩人の息子、門を守る騎士、炎を操る魔法使い…そして、まだ名前すら書かれていない数多くの者たち。" },
  prl8: { ko: "세상 곳곳에 잠든 흉수들이 깨어나고 있어. 영웅들은 그것들과 맞서 싸우게 될 운명이지.", en: "The fell beasts sleeping all across the world are waking. The heroes are fated to stand against them.", ja: "世界のあちこちで眠っていた凶獣たちが目を覚まし始めている。英雄たちはそれと戦う運命なんだ。" },
  prl9: { ko: "하지만 운명이란 건, 누군가 끝까지 지켜보고 적어 주지 않으면 금세 흐려져 버려.", en: "But fate fades quickly unless someone watches it to the very end and writes it down.", ja: "でも運命っていうのは、誰かが最後まで見届けて書き留めないと、すぐにかすれてしまう。" },
  prl10: { ko: "그래서 네가 필요해. 영웅들 곁에서 그들의 싸움을 보고, 고르고, 이끌어 줄 '기록의 주인공'이.", en: "That's why I need you. A 'hero of the record' who stays beside the heroes, watches their battles, chooses, and guides them.", ja: "だから君が必要なんだ。英雄たちのそばで戦いを見届け、選び、導いてくれる『記録の主人公』が。" },
  prl11: { ko: "네가 고른 영웅이 흉수를 쓰러뜨릴 때마다, 이 빈 페이지에 이야기가 한 줄씩 채워질 거야.", en: "Every time a hero you choose fells a beast, this blank page will fill with one more line of the story.", ja: "君が選んだ英雄が凶獣を倒すたびに、この白紙のページに物語が一行ずつ書き込まれていく。" },
  prl12: { ko: "…아, 내 정신 좀 봐. 가장 중요한 걸 묻지 않았네.", en: "…Oh, where are my manners. I haven't asked the most important thing.", ja: "…ああ、うっかりしていた。一番大事なことを聞いていなかったね。" },
  prl13: { ko: "이름을 알려 줄래? 이야기 첫 줄에 적어 둘게.", en: "Will you tell me your name? I'll write it on the very first line.", ja: "名前を教えてくれる？物語の最初の一行に書いておくよ。" },
  prl14: { ko: "{name}. …좋은 이름이야. 잉크가 잘 번지겠어.", en: "{name}. …A fine name. The ink will take to it nicely.", ja: "{name}。…いい名前だ。インクがよくなじみそうだね。" },
  prl15: { ko: "그럼 이제 눈을 떠 봐. 네가 머무를 곳으로 데려다줄게.", en: "Now, open your eyes. I'll take you to the place where you'll stay.", ja: "さあ、目を開けてごらん。君がとどまる場所へ連れていってあげよう。" },
  prlNameHolder: { ko: "이름 (최대 12자)", en: "Your name (up to 12)", ja: "名前（12文字まで）" },
  prlNameOk: { ko: "적어 두기", en: "Write it down", ja: "書き留める" },
  prlSkip: { ko: "건너뛰기", en: "Skip", ja: "スキップ" },
  prlHint: { ko: "누르기 · Space · Enter: 다음 · Esc: 건너뛰기", en: "Tap · Space · Enter: next · Esc: skip", ja: "タップ・Space・Enter：次へ・Esc：スキップ" },
  worldLoadingStory: { ko: "이야기를 펼치는 중…", en: "Unfolding the story…", ja: "物語を広げています…" },
};
