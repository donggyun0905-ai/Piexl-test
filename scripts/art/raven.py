# 레이븐 그림 (python3 scripts/art/raven.py) — 원본 art/캐릭터/레이븐
# · ravenFx.png (192칸 4×2, 투명 바탕): 0줄 폰·나이트·비숍·룩 · 1줄 퀸(백색)·킹(흑색)·금빛 폰·금빛 나이트
#   칸 차례는 화면 render/ravenArt의 PIECE와 같게 (금빛 둘은 은빛 원본을 금색으로 물들임)
# 캐릭터 몸 시트는 import_v2.py chessRaven (src/chessRaven-1~3.png: 서기·공격 · 걷기 · 맞음·쓰러짐·대시)
import os

import numpy as np
from PIL import Image

from baekryeong import trim
from PIL import ImageDraw
from s2_common import SPRITES

HERE = os.path.dirname(__file__)
CHAR = os.path.join(HERE, "../../art/캐릭터/레이븐")
C = 192
NAMES = ["정교한 보석 장식 픽셀 체스 폰", "정교한 픽셀 체스 나이트 조각", "픽셀 아트 체스 비숍 말", "은빛 보석 장식 픽셀 룩 타워", "황금 장식의 픽셀 아트 체스 퀸", "황금 장식의 픽셀 체스 킹"]


def cutout(im, dark=1):
    """바깥 테두리에서 이어진 검은 바탕만 투명하게 (흑색 기물 몸의 검정은 남김)"""
    rgb = np.asarray(im.convert("RGB"))
    mask = Image.fromarray(np.where(rgb.max(axis=2) <= dark, 255, 0).astype(np.uint8), "L").copy()
    w, h = mask.size
    for x in range(0, w, 8):
        for y in (0, h - 1):
            if mask.getpixel((x, y)) == 255: ImageDraw.floodfill(mask, (x, y), 128)
    for y in range(0, h, 8):
        for x in (0, w - 1):
            if mask.getpixel((x, y)) == 255: ImageDraw.floodfill(mask, (x, y), 128)
    out = im.convert("RGBA")
    out.putalpha(Image.fromarray(np.where(np.asarray(mask) == 128, 0, 255).astype(np.uint8), "L"))
    return out


def load(name):
    return trim(cutout(Image.open(os.path.join(CHAR, name + ".png"))))


def gild(im):
    """은빛·흑빛 기물을 금빛으로: 밝기를 어두운 금 → 밝은 금으로 이어 칠함 (투명도 그대로)"""
    a = im.getchannel("A")
    l = np.asarray(im.convert("L")).astype(np.float32) / 255
    dark = np.array([110, 62, 10], np.float32)
    mid = np.array([240, 180, 50], np.float32)
    hi = np.array([255, 248, 200], np.float32)
    t = l[..., None]
    rgb = np.where(t < 0.55, dark + (mid - dark) * (t / 0.55), mid + (hi - mid) * ((t - 0.55) / 0.45))
    out = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB").convert("RGBA")
    out.putalpha(a)
    return out


def main():
    pieces = [load(n) for n in NAMES]
    pieces += [gild(pieces[0]), gild(pieces[1])]
    sheet = Image.new("RGBA", (C * 4, C * 2), (0, 0, 0, 0))
    # 모두 같은 높이 비율 (기물마다 원본 키를 살림: 가장 큰 기물이 칸에 꽉 차게)
    big = max(p.height for p in pieces)
    for i, p in enumerate(pieces):
        k = min((C - 4) / big, (C - 4) / p.width)
        q = p.resize((max(1, round(p.width * k)), max(1, round(p.height * k))), Image.LANCZOS)
        c, r = i % 4, i // 4
        sheet.alpha_composite(q, (c * C + (C - q.width) // 2, r * C + C - 2 - q.height))
    sheet.save(os.path.join(SPRITES, "ravenFx.png"), optimize=True)
    print("ravenFx.png", sheet.size)


if __name__ == "__main__":
    main()
