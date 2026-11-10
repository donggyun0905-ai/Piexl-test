# 네일러 피 폭발 그림 (사용자 그림 2026-11-08): python3 scripts/art/nailer_blood.py → apps/client/public/sprites/nailer_blood.png
# 원본 scripts/art/src/nailer-blood.webp (검은 바탕 4장면: 튐 → 퍼짐 → 크게 터짐 → 웅덩이) · 장면마다 같은 칸으로 잘라 검정을 투명으로 · 칸 128 × 4 (render/nailerFx가 씀)
import os

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "src", "nailer-blood.webp")
OUT = os.path.join(HERE, "..", "..", "apps", "client", "public", "sprites", "nailer_blood.png")
CELL = 128
# 원본 한 장면 크기 (가로 4등분) · 피가 터지는 바닥 자리(원본 y)를 칸 아래쪽 3/4에 둠
FOOT = 340


def clear_black(im):
    """검정 바탕 → 투명 (밝기만큼 불투명, 색은 되살림)"""
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, _ = px[x, y]
            m = max(r, g, b)
            a = min(255, int(m * 2.4)) if m > 24 else 0
            px[x, y] = (min(255, r * 255 // max(1, a)), min(255, g * 255 // max(1, a)), min(255, b * 255 // max(1, a)), a) if a else (0, 0, 0, 0)
    return im


def main():
    src = Image.open(SRC).convert("RGBA")
    w = src.width // 4
    side = w
    top = FOOT - int(side * 0.75)
    sheet = Image.new("RGBA", (CELL * 4, CELL), (0, 0, 0, 0))
    for k in range(4):
        part = src.crop((k * w, top, k * w + side, top + side))
        part = clear_black(part).resize((CELL, CELL), Image.BOX)
        sheet.paste(part, (k * CELL, 0))
    sheet.save(OUT)
    print("saved", OUT)


if __name__ == "__main__":
    main()
