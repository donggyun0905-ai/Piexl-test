# 고해상도 시범: 1층 보스 강철 거구 (python3 scripts/art/hd_hulk.py) → apps/client/public/sprites/enemies/hulk.png (88칸 × 4, 게임에서는 44칸으로 줄여 그림)
# 리벳 박힌 강철 판 몸 · 가슴의 이글거리는 용광로 심장(쇠창살) · 어깨 사이에 파묻힌 둥근 투구와 푸른 눈 틈 · 어깨 위 굴뚝 두 개
# 리벳 박힌 둥근 어깨 갑옷 · 피스톤 팔 · 커다란 쇠주먹 · 짧고 굵은 다리
# 칸: 0·1 걷기 · 2 공격 준비(두 주먹을 머리 위로, 심장이 더 밝음) · 3 내려찍기(주먹이 앞 땅에 박히고 불티·먼지)
import os

from PIL import Image

from hd_common import Cell, hx, mix, outline, sh_oval, sh_rect, tones
from s2_common import SPRITES

S = 88
K = dict(
    steel=hx("#7c86a0"), plate=hx("#4c5470"), rivet=hx("#d8deea"), dark=hx("#262a3a"),
    core=hx("#ff8a1a"), hot=hx("#ffe27a"), white=hx("#fff8e0"), visor=hx("#4ae8ff"), pipe=hx("#5a5468"), dust=hx("#c8b8a0"),
)


def rivets(c, x0, y0, x1, y1, gap=6):
    for x in range(int(x0), int(x1) + 1, gap):
        c.px(x, y0, K["rivet"]); c.px(x, y1, K["rivet"])


def core(c, cx, cy, r, heat):
    """용광로 심장: 흰 가운데 → 노랑 → 주황 → 어두운 붉은 테 · 쇠창살 세 줄"""
    for y in range(int(cy - r) - 1, int(cy + r) + 2):
        for x in range(int(cx - r) - 1, int(cx + r) + 2):
            d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5 / r
            if d > 1: continue
            col = K["white"] if d < 0.28 + heat * 0.15 else K["hot"] if d < 0.55 + heat * 0.1 else K["core"] if d < 0.85 else hx("#8a2a10")
            c.px(x, y, col)
    for dy in (-r * 0.45, 0, r * 0.45):
        for x in range(int(cx - r + 1), int(cx + r)): c.px(x, cy + dy, K["dark"])


def fist(c, cx, cy, r):
    """쇠주먹: 둥근 덩어리 · 손가락 마디 네 줄 · 손등 리벳"""
    sh_oval(c, cx, cy, r, r * 0.9, K["steel"])
    for i in range(4):
        x = cx - r * 0.7 + i * r * 0.47
        for y in range(int(cy + r * 0.15), int(cy + r * 0.8)): c.px(x, y, K["plate"])
    c.px(cx - 2, cy - r * 0.4, K["rivet"]); c.px(cx + 2, cy - r * 0.4, K["rivet"])


def arm(c, x0, y0, x1, y1):
    """피스톤 팔: 두 마디 사이 반짝이는 피스톤"""
    n = max(abs(x1 - x0), abs(y1 - y0), 1)
    for i in range(int(n) + 1):
        t = i / n
        x, y = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
        col = K["rivet"] if 0.45 < t < 0.55 else K["plate"] if t < 0.45 else K["steel"]
        for w in range(-4, 5):
            if abs(x1 - x0) > abs(y1 - y0): c.px(x, y + w, mix(col, K["dark"], 0.35) if w > 2 else col)
            else: c.px(x + w, y, mix(col, K["dark"], 0.35) if w > 2 else col)


def frame(f):
    c = Cell(S)
    cx = 44
    low = 4 if f == 3 else 0
    lean = -2 if f == 2 else 0
    step = (2, -2, 0, 0)[f]
    # 다리 · 발
    for i, lx in enumerate((28, 48)):
        dy = step if i == 0 else -step
        sh_rect(c, lx, 62 + low, 12, 18 - max(0, dy) - low, K["plate"], 2)
        sh_rect(c, lx - 2, 79 - max(0, dy), 16, 6, K["steel"], 2)
        rivets(c, lx + 2, 66 + low, lx + 10, 75 - max(0, dy), 8)
    # 몸통: 위가 넓은 강철 판 · 가운데 띠 · 리벳
    for y in range(28 + low + lean, 64 + low):
        k = (y - 28) / 36
        w = 23 - k * 5
        for x in range(int(cx - w), int(cx + w) + 1):
            t = (x - (cx - w)) / (2 * w)
            col = tones(K["steel"])[0] if t < 0.12 else tones(K["steel"])[2] if t > 0.82 else K["steel"]
            c.px(x + lean, y, col)
    sh_rect(c, cx - 17 + lean, 54 + low, 34, 5, K["plate"])
    # 판 이음매 · 심장 둘레 달아오른 금
    for y in range(32 + low + lean, 54 + low):
        c.px(cx - 12 + lean, y, K["plate"]); c.px(cx + 12 + lean, y, K["plate"])
    for i, (dx, dy) in enumerate(((-10, -4), (-11, -3), (10, 4), (11, 5), (9, -6))):
        c.px(cx + dx + lean, 43 + low + lean + dy, K["core"] if i % 2 else K["hot"])
    rivets(c, cx - 15 + lean, 31 + low + lean, cx + 15 + lean, 56 + low, 6)
    core(c, cx + lean, 43 + low + lean, 8 + (1 if f == 2 else 0), 1 if f >= 2 else 0)
    # 머리: 어깨 사이 둥근 투구 · 푸른 눈 틈
    hy = 24 + low + lean
    sh_oval(c, cx + lean, hy, 10, 8, K["steel"])
    c.rect(cx - 7 + lean, hy + 1, 14, 3, K["dark"])
    for x in range(cx - 5, cx + 6): c.px(x + lean, hy + 2 + (1 if abs(x - cx) < 2 else 0), K["visor"])
    c.px(cx - 6 + lean, hy + 2, mix(K["visor"], hx("#ffffff"), 0.6))
    # 굴뚝 두 개
    for px_ in (cx - 14, cx + 11):
        sh_rect(c, px_ + lean, 12 + low + lean, 5, 16, K["pipe"])
        c.rect(px_ - 1 + lean, 11 + low + lean, 7, 2, K["dark"])
    # 어깨 갑옷 · 팔 · 주먹
    for sd in (-1, 1):
        sx = cx + sd * 24 + lean
        sy = 33 + low + lean
        if f == 2:
            arm(c, sx, sy - 4, sx + sd * 2, 12)
            fist(c, sx + sd * 2, 9, 9)
        elif f == 3:
            arm(c, sx, sy + 4, cx + sd * 15, 74)
            fist(c, cx + sd * 15, 78, 9)
        else:
            swing = (3 if f == 0 else -3) * sd
            arm(c, sx + sd, sy + 4, sx + sd * 2, 62 + swing)
            fist(c, sx + sd * 2, 67 + swing, 9)
        sh_oval(c, sx, sy, 12, 11, K["plate"])
        sh_oval(c, sx - sd, sy - 2, 9, 7, K["steel"])
        for a in range(5): c.px(sx - 8 + a * 4, sy - 6 + abs(a - 2), K["rivet"])
        # 어깨 가시 둘
        for j in range(4): c.px(sx + sd * (4 + j), sy - 10 - j * 2, K["plate"]); c.px(sx + sd * (5 + j), sy - 10 - j * 2, K["dark"])
        c.rect(sx - 10, sy + 4, 20, 2, K["plate"])
    outline(c)
    # 굴뚝 연기 · 내려찍기 불티·먼지 (테두리 없이)
    for i, px_ in enumerate((cx - 12, cx + 13)):
        for j in range(3): c.px(px_ + lean + (j + f + i) % 3 - 1, 8 + low + lean - j * 3, mix(K["dust"], hx("#ffffff"), 0.3 * j))
    if f == 3:
        for i in range(14):
            x = cx + (-1) ** i * (14 + i * 2)
            y = 84 - (i * 5) % 12
            c.px(x, y, K["hot"] if i % 3 else K["white"])
            c.px(x + (-1) ** i, y + 1, K["dust"])
    if f == 2:
        for i in range(6): c.px(cx - 9 + i * 3 + lean, 34 - i % 2 * 2, K["hot"])
    return c


def main():
    img = Image.new("RGBA", (S * 4, S), (0, 0, 0, 0))
    for f in range(4):
        for (x, y), col in frame(f).p.items(): img.putpixel((f * S + x, y), col)
    path = os.path.join(SPRITES, "enemies", "hulk.png")
    img.save(path, optimize=True)
    print("hulk ok")


if __name__ == "__main__":
    main()
