# 오리 원본 3장에서 새끼 오리만 잘라 냄 (python3 scripts/art/duckling_cut.py [미리보기 경로])
# 칸마다: 본체(가는 이음새를 끊어 가장 큰 덩어리 + 옆에 겹친 키 작은 줄 빼기)를 뺀 나머지 중 가장 큰 덩어리 = 새끼 오리
import os
import sys
from collections import deque

from PIL import Image, ImageFilter

from import_v2 import FILES, HERE, pieces


def main_mask(part, r=12, low=0.58, wide=0.1):
    alpha = part.getchannel("A").point(lambda v: 255 if v else 0)
    opened = alpha.filter(ImageFilter.MinFilter(2 * r + 1)).filter(ImageFilter.MaxFilter(2 * r + 1))
    w, h = part.size
    op = opened.load()
    seen = bytearray(w * h)
    best = []
    for y0 in range(h):
        for x0 in range(w):
            if seen[y0 * w + x0] or not op[x0, y0]: continue
            seen[y0 * w + x0] = 1
            q, pts = deque([(x0, y0)]), []
            while q:
                x, y = q.popleft()
                pts.append((x, y))
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] and op[nx, ny]:
                        seen[ny * w + nx] = 1
                        q.append((nx, ny))
            if len(pts) > len(best): best = pts
    keep = Image.new("L", (w, h), 0)
    kp = keep.load()
    for x, y in best: kp[x, y] = 255
    keep = keep.filter(ImageFilter.MaxFilter(2 * r + 3))
    a = part.getchannel("A").load()
    top = [next((y for y in range(h) if a[x, y]), h) for x in range(w)]
    short = [t > h * low for t in top]
    x0, x1, run = 0, w, 0
    while run < w and short[run]: run += 1
    if run > w * wide: x0 = run
    run = 0
    while run < w and short[w - 1 - run]: run += 1
    if run > w * wide: x1 = w - run
    kp = keep.load()
    return lambda x, y: kp[x, y] and x0 <= x < x1


def duckling(part, thin=7):
    """본체를 뺀 나머지 중 가장 큰 덩어리 (없으면 None)"""
    inside = main_mask(part)
    w, h = part.size
    px = part.load()
    rest = bytearray(w * h)
    for y in range(h):
        for x in range(w):
            if px[x, y][3] and not inside(x, y): rest[y * w + x] = 1
    # 본체 가장자리에 남은 얇은 띠·꽥 소리 같은 가는 선은 깎았다 불려 없앰
    m = Image.new("L", (w, h), 0)
    mp = m.load()
    for y in range(h):
        for x in range(w):
            if rest[y * w + x]: mp[x, y] = 255
    k = 2 * thin + 1
    m = m.filter(ImageFilter.MinFilter(k)).filter(ImageFilter.MaxFilter(k))
    mp = m.load()
    for y in range(h):
        for x in range(w):
            if rest[y * w + x] and not mp[x, y]: rest[y * w + x] = 0
    best = []
    for y0 in range(h):
        for x0 in range(w):
            if rest[y0 * w + x0] != 1: continue
            rest[y0 * w + x0] = 2
            q, pts = deque([(x0, y0)]), []
            while q:
                x, y = q.popleft()
                pts.append((x, y))
                for dx in (-1, 0, 1):
                    for dy in (-1, 0, 1):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < w and 0 <= ny < h and rest[ny * w + nx] == 1:
                            rest[ny * w + nx] = 2
                            q.append((nx, ny))
            if len(pts) > len(best): best = pts
    if len(best) < 1500: return None
    xs, ys = [p[0] for p in best], [p[1] for p in best]
    out = Image.new("RGBA", (max(xs) - min(xs) + 1, max(ys) - min(ys) + 1), (0, 0, 0, 0))
    op = out.load()
    for x, y in best: op[x - min(xs), y - min(ys)] = px[x, y]
    return out


def cut_all():
    """줄(0 서기 · 1 공격 · 2·3 걷기 · 4 맞음·쓰러짐·대시) × 칸(앞·뒤·왼·오) → 새끼 오리 그림"""
    grid = {}
    for tag, cols, rows, at in FILES:
        img = Image.open(os.path.join(HERE, "src", f"duck-{tag}.png")).convert("RGBA")
        for r, line in zip(at, pieces(img, cols, rows, flood=True)):
            for c, part in enumerate(line): grid[r, c] = duckling(part)
    return grid


if __name__ == "__main__":
    grid = cut_all()
    out = sys.argv[1] if len(sys.argv) > 1 else "/tmp/ducklings.png"
    S = 140
    sheet = Image.new("RGBA", (S * 4, S * 5), (70, 70, 90, 255))
    for (r, c), d in grid.items():
        if d is None: continue
        d.thumbnail((S - 8, S - 8))
        sheet.alpha_composite(d, (c * S + (S - d.width) // 2, r * S + S - 4 - d.height))
    sheet.save(out)
    print({k: (v.size if v else None) for k, v in grid.items()})
