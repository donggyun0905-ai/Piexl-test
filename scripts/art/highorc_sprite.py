# 하이오크 큰 도트 그림 (python3 scripts/art/highorc_sprite.py)
# 원본: 사용자가 준 그림 src/highorc_ref.png (검은 바탕 · 정면 · 걷기 2 · 도끼 들어 휘두르기)
# → 검은 바탕 지우기 · 칸마다 발끝을 맞춰 정사각형 · 3배 촘촘한 칸(CELL)으로 줄이고 색 줄이기 → sprites/enemies/highorc.png
# 칸 차례: 걷기 1 · 걷기 2 · 도끼 휘두르기(공격 준비·공격) · 정면 (게임 크기 = CELL ÷ 3, game/enemySprites ENEMY_SRC)
import os
from collections import deque

from PIL import Image

HERE = os.path.dirname(__file__)
SRC = os.path.join(HERE, "src", "highorc_ref.png")
OUT = os.path.join(HERE, "../../apps/client/public/sprites/enemies/highorc.png")
CELL = 144
# 원본에서 그림마다 가로 범위 (정면 · 걷기 1 · 걷기 2 · 휘두르기)
SPANS = [(11, 518), (530, 996), (1054, 1497), (1542, 2163)]
ORDER = [1, 2, 3, 0]
TOP, BOTTOM = 40, 630


def clear_bg(img):
    """테두리에서 이어진 거의 검은 칸만 투명하게 (그림 안 검은 테두리 선은 남김)"""
    w, h = img.size
    p = img.load()
    dark = lambda c: c[0] + c[1] + c[2] < 45
    seen = set()
    q = deque()
    for x in range(w):
        q.extend([(x, 0), (x, h - 1)])
    for y in range(h):
        q.extend([(0, y), (w - 1, y)])
    while q:
        x, y = q.popleft()
        if (x, y) in seen or not (0 <= x < w and 0 <= y < h) or not dark(p[x, y]):
            continue
        seen.add((x, y))
        p[x, y] = (0, 0, 0, 0)
        q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])
    return img


def frame(src, span):
    x0, x1 = span
    side = BOTTOM - TOP
    cx = (x0 + x1) // 2
    # 이웃 그림이 끼지 않게 이 그림 범위 밖은 지움
    only = Image.new("RGBA", src.size, (0, 0, 0, 255))
    only.paste(src.crop((x0, 0, x1, src.height)), (x0, 0))
    box = only.crop((cx - side // 2, TOP, cx + side // 2, BOTTOM))
    small = clear_bg(box).resize((CELL, CELL), Image.LANCZOS)
    # 반투명 가장자리는 또렷하게 (픽셀 느낌)
    px = small.load()
    for y in range(CELL):
        for x in range(CELL):
            r, g, b, a = px[x, y]
            px[x, y] = (r, g, b, 255) if a >= 110 else (0, 0, 0, 0)
    return small


if __name__ == "__main__":
    src = Image.open(SRC).convert("RGBA")
    frames = [frame(src, SPANS[i]) for i in ORDER]
    sheet = Image.new("RGBA", (CELL * len(frames), CELL), (0, 0, 0, 0))
    for k, f in enumerate(frames):
        sheet.paste(f, (k * CELL, 0))
    # 색 수 줄이기 (도트 느낌), 투명은 그대로
    alpha = sheet.getchannel("A")
    q = sheet.convert("RGB").quantize(colors=48, method=Image.MEDIANCUT, dither=Image.NONE).convert("RGBA")
    q.putalpha(alpha)
    q.save(OUT, optimize=True)
    print("highorc ok", q.size)
