# 매드퀸 무기 그림 3장(art/매드퀸) → apps/client/public/sprites/madQueen_arms.png
# 줄: 0 미래형 대포 · 1 네온 터렛 · 2 에너지 하이브리드 날개 / 칸: 0 하늘 · 1 빨강 · 2 노랑 · 3 초록 (원본 2×2 순서 그대로)
# 배경(가장자리에서 이어진 검정·흰색)을 지우고 덩어리마다 잘라 64칸에 맞춰 줄임. 그림은 모두 오른쪽을 봄
import os
from collections import deque

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..", "..")
SRC = os.path.join(ROOT, "art", "매드퀸")
OUT = os.path.join(ROOT, "apps", "client", "public", "sprites", "madQueen_arms.png")
CELL = 64
FILES = [("미래형 대포 4색 스프라이트 시트.png", "dark"), ("사색 네온 터렛 픽셀아트 스프라이트 시트.png", "dark"), ("4색 에너지 하이브리드 무기 시트.png", "light")]


def is_bg(c, mode):
    return max(c[:3]) < 34 if mode == "dark" else min(c[:3]) > 222 and max(c[:3]) - min(c[:3]) < 20


def clear_bg(img, mode):
    """가장자리에서 이어진 배경색을 투명으로"""
    w, h = img.size
    px = img.load()
    seen = bytearray(w * h)
    q = deque([(x, y) for x in range(w) for y in (0, h - 1)] + [(x, y) for y in range(h) for x in (0, w - 1)])
    while q:
        x, y = q.popleft()
        if seen[y * w + x] or not is_bg(px[x, y], mode): continue
        seen[y * w + x] = 1
        px[x, y] = (0, 0, 0, 0)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx]: q.append((nx, ny))
    return img


def quarters(img):
    """2×2 칸마다 보이는 부분만 잘라 냄 (하늘 · 빨강 · 노랑 · 초록)"""
    w, h = img.size
    out = []
    for r in range(2):
        for c in range(2):
            part = img.crop((c * w // 2, r * h // 2, (c + 1) * w // 2, (r + 1) * h // 2))
            out.append(part.crop(part.getbbox()))
    return out


def main():
    sheet = Image.new("RGBA", (CELL * 4, CELL * 3), (0, 0, 0, 0))
    for row, (name, mode) in enumerate(FILES):
        img = clear_bg(Image.open(os.path.join(SRC, name)).convert("RGBA"), mode)
        for col, part in enumerate(quarters(img)):
            k = (CELL - 2) / max(part.width, part.height)
            small = part.resize((max(1, round(part.width * k)), max(1, round(part.height * k))), Image.LANCZOS)
            sheet.alpha_composite(small, (col * CELL + (CELL - small.width) // 2, row * CELL + (CELL - small.height) // 2))
    sheet.save(OUT)
    print("madQueen_arms ok", sheet.size)


if __name__ == "__main__":
    main()
