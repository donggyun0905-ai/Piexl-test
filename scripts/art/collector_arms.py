# 수집가 수집 무기 30 그림 (python3 scripts/art/collector_arms.py) → apps/client/public/sprites/collector_arms.png
# 원본: 사용자가 준 무기 시트 src/collector_arms.png (검은 바탕 · 3줄 × 10개, 차례 = itemsCollector.CL_ARMS)
# 칸마다 검은 바탕(테두리에서 이어진 아주 어두운 곳)을 지우고 → 무기만 남겨 CELL칸 정사각형 가운데에 맞춰 줄임 (게임에서는 등 뒤에 작게)
import os
from collections import deque

from PIL import Image

HERE = os.path.dirname(__file__)
SRC = os.path.join(HERE, "src", "collector_arms.png")
OUT = os.path.join(HERE, "../../apps/client/public/sprites/collector_arms.png")
CELL = 48
# 줄마다 세로 범위 · 무기 가운데 x (원본 1536×1024 기준, 그림을 보고 정함)
ROWS = [
    ((10, 352), [83, 230, 355, 493, 630, 771, 926, 1091, 1275, 1441]),
    ((352, 648), [85, 206, 345, 472, 632, 770, 940, 1113, 1284, 1445]),
    ((648, 1020), [68, 178, 290, 417, 590, 760, 935, 1090, 1265, 1440]),
]
DARK = 40


def clear_bg(img):
    w, h = img.size
    p = img.load()
    seen = set()
    q = deque([(x, 0) for x in range(w)] + [(x, h - 1) for x in range(w)] + [(0, y) for y in range(h)] + [(w - 1, y) for y in range(h)])
    while q:
        x, y = q.popleft()
        if (x, y) in seen or not (0 <= x < w and 0 <= y < h):
            continue
        c = p[x, y]
        if c[0] + c[1] + c[2] > DARK:
            continue
        seen.add((x, y))
        p[x, y] = (0, 0, 0, 0)
        q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])
    # 남은 아주 어두운 반투명 번짐도 지움 (빛 번짐 끝)
    for y in range(h):
        for x in range(w):
            r, g, b, a = p[x, y]
            if a and r + g + b < 25:
                p[x, y] = (0, 0, 0, 0)
    return img


def cell(src, y0, y1, xs, i):
    left = (xs[i - 1] + xs[i]) // 2 if i > 0 else max(0, xs[0] - (xs[1] - xs[0]) // 2)
    right = (xs[i] + xs[i + 1]) // 2 if i < len(xs) - 1 else min(src.width, xs[i] + (xs[i] - xs[i - 1]) // 2)
    part = clear_bg(src.crop((left, y0, right, y1)))
    box = part.getbbox()
    if box:
        part = part.crop(box)
    k = (CELL - 2) / max(part.width, part.height)
    small = part.resize((max(1, round(part.width * k)), max(1, round(part.height * k))), Image.LANCZOS)
    a = small.getchannel("A").point(lambda v: 255 if v > 100 else 0)
    small.putalpha(a)
    out = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
    out.paste(small, ((CELL - small.width) // 2, (CELL - small.height) // 2), small)
    return out


if __name__ == "__main__":
    src = Image.open(SRC).convert("RGBA")
    cells = [cell(src, y0, y1, xs, i) for (y0, y1), xs in ROWS for i in range(len(xs))]
    sheet = Image.new("RGBA", (CELL * len(cells), CELL), (0, 0, 0, 0))
    for i, c in enumerate(cells):
        sheet.paste(c, (i * CELL, 0))
    sheet.save(OUT, optimize=True)
    print("collector_arms ok", sheet.size)
