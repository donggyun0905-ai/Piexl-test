# 그림 공장 프롬프트 틀 (factory.py) · 그림 모델에는 영어로 · 다른 게임·작품 캐릭터를 따라 하지 않게 매번 적음
LAYOUT = (
    "Layout: one horizontal row of 4 poses of the SAME character, evenly spaced: front view, back view, right-facing side view, "
    "and a casting/attack pose facing front. Chibi proportions (2 heads tall, big head, cute), every pose the same size with feet on one baseline. "
)
STYLE = (
    "Clean high-quality pixel art, crisp pixels, bold dark outline, soft top-left lighting, rich but readable colors. "
    "Solid pure black background, no ground shadow, no text, no labels, no frames or UI. "
    "Original design that does not resemble any character from existing games or other works."
)
THEMES = {
    "xmas": "Christmas: red and white winter outfit with white fur trim, santa hat, small holly ornament",
    "halloween": "Halloween: purple and black witch-style outfit with orange accents, pointed witch hat, tiny pumpkin charm",
    "school": "School: neat navy school uniform with red ribbon tie, graduation mortarboard cap with gold tassel",
    "swim": "Summer swim: light cyan swimwear with a sheer white beach cover-up, hibiscus flower in the hair (tasteful, not revealing)",
    "usa": "American western: denim blue and red outfit, brown cowboy hat, star badge",
    "china": "Chinese style: red and gold qipao-inspired outfit, hair buns with gold ornaments and red tassels",
    "japan": "Japanese style: pink and red kimono-inspired outfit with obi sash, flower hairpin",
    "newyear": "Korean New Year: hanbok with blue jacket (jeogori) and pink skirt (chima), red hair ribbon (daenggi)",
    "swap": "Color swap: same outfit shapes but a dark olive and charcoal color scheme, silver hair",
    "victory": "Victory: regal navy and gold version of the outfit, golden laurel crown, subtle golden glow",
}


def prompt_for(kind, target, theme, desc):
    if kind == "character":
        who = desc or f"Redraw the character from the reference image ({target})"
        return f"Pixel art game character sprite sheet. Character: {who}. " + LAYOUT + STYLE
    if kind == "skin":
        t = THEMES.get(theme, theme)
        extra = f" {desc}." if desc else ""
        return (
            "Pixel art game character sprite sheet. Use the character in the reference image: keep exactly the same face, eyes, hair style and color, "
            f"body proportions, weapon and art style. Change ONLY the outfit to this theme — {t}.{extra} " + LAYOUT + STYLE
        )
    # 이펙트·소품: 한 장 (움직임은 게임 코드가 붙임)
    return (
        f"Single pixel art game effect or object sprite: {desc or target}. One item only, centered, filling most of the image. "
        "Clean high-quality pixel art, crisp pixels, bold outline where suitable, glowing parts bright and clear. "
        "Solid pure black background, no text, no labels. Original design."
    )
