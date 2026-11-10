# 블래스트 산탄총 발사 그림: 훅 발사 그림(hook_fx.png, 푸른빛)을 밝기에 따라 검정 → 검붉음 → 빨강 → 주황 → 밝은 노랑으로 다시 칠함
# → apps/client/public/sprites/blast_fx.png (칸 배치는 훅과 같음: 줄 0 큰 발사 4칸 · 줄 1 둘째 발 4칸 · 칸마다 왼쪽 가운데 = 총구)
import os

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SPR = os.path.join(HERE, "..", "..", "apps", "client", "public", "sprites")
# 밝기(0~1) → 색 (사이는 섞음)
STOPS = [(0.0, (20, 12, 12)), (0.4, (58, 18, 14)), (0.55, (150, 24, 16)), (0.7, (232, 74, 26)), (0.85, (255, 154, 42)), (1.0, (255, 240, 176))]


def color(v):
    for (a, ca), (b, cb) in zip(STOPS, STOPS[1:]):
        if v <= b:
            k = (v - a) / (b - a)
            return tuple(round(x + (y - x) * k) for x, y in zip(ca, cb))
    return STOPS[-1][1]


def main():
    src = Image.open(os.path.join(SPR, "hook_fx.png")).convert("RGBA")
    out = Image.new("RGBA", src.size)
    s, d = src.load(), out.load()
    for y in range(src.height):
        for x in range(src.width):
            r, g, b, a = s[x, y]
            if a == 0:
                continue
            # 훅 그림: 흰 속 → 하늘색 → 진한 파랑. 빨강 채널(흰 정도)과 초록 채널로 밝기를 잼
            v = min(1.0, (0.55 * r + 0.45 * g) / 255 * (a / 255) ** 0.3)
            d[x, y] = (*color(v), min(255, round(a * 1.15)))
    out.save(os.path.join(SPR, "blast_fx.png"))
    print("blast_fx ok", out.size)


if __name__ == "__main__":
    main()
