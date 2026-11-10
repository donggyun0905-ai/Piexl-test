# 인형술사 그림 (python3 scripts/art/puppeteer.py) — 원본 art/캐릭터/인형술사
# · puppeteerFx.png (128칸, 투명 바탕): 0줄 미니 인형 8종(리본·태엽·광대·신사·공주·춤꾼·빨간 망토·고양이)
#   1줄 나무 왕관 · 시체 폭발 인형 · 왼손 · 오른손(커서)   — 칸 번호는 화면 render/puppetArt와 같게
# · puppeteerGolem.png (160칸 4×4, 투명 바탕): 줄 = 걷기1·걷기2·공격1·공격2, 칸 = 앞·뒤·왼·오 — 인형 친구(내 친구~)
# 캐릭터 몸 시트는 import_v2.py puppeteer (src/puppeteer-1~3.png)
import os

import numpy as np
from PIL import Image, ImageDraw

from s2_common import SPRITES

HERE = os.path.dirname(__file__)
CHAR = os.path.join(HERE, "../../art/캐릭터/인형술사")


def cutout(im, dark=20):
    """바깥 테두리에서 이어진 검은 바탕(가장 밝은 값 dark 이하)만 투명하게 (몸 안 검은 선은 남김)"""
    rgb = np.asarray(im.convert("RGB"))
    mask = Image.fromarray(np.where(rgb.max(axis=2) <= dark, 255, 0).astype(np.uint8), "L").copy()
    w, h = mask.size
    for x in range(0, w, 8):
        for y in (0, h - 1):
            if mask.getpixel((x, y)) == 255: ImageDraw.floodfill(mask, (x, y), 128)
    for y in range(0, h, 8):
        for x in (0, w - 1):
            if mask.getpixel((x, y)) == 255: ImageDraw.floodfill(mask, (x, y), 128)
    # 실·막대 사이에 갇힌 넓은 검은 칸(완전한 검정)도 바탕으로
    pure = rgb.max(axis=2) <= 4
    m = np.asarray(mask).copy()
    m[(m == 255) & ~pure] = 0
    mask = Image.fromarray(m, "L").copy()
    for y in range(0, h, 6):
        for x in range(0, w, 6):
            if mask.getpixel((x, y)) != 255: continue
            ImageDraw.floodfill(mask, (x, y), 64)
            arr = np.asarray(mask)
            n = int((arr == 64).sum())
            fill = 128 if n > 300 else 1
            arr = arr.copy()
            arr[arr == 64] = fill
            mask = Image.fromarray(arr, "L").copy()
    a = np.where(np.asarray(mask) == 128, 0, 255).astype(np.uint8)
    out = im.convert("RGBA")
    out.putalpha(Image.fromarray(a, "L"))
    return out


def trim(im):
    box = im.getchannel("A").getbbox()
    return im.crop(box) if box else im


def fit(im, cell):
    k = min((cell - 4) / im.width, (cell - 4) / im.height)
    im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
    out = Image.new("RGBA", (cell, cell), (0, 0, 0, 0))
    out.alpha_composite(im, ((cell - im.width) // 2, cell - 2 - im.height))
    return out


def grid(name, cols, rows):
    """원본을 cols×rows 칸으로 잘라 (투명 바탕) 칸 목록"""
    im = cutout(Image.open(os.path.join(CHAR, name)))
    fw, fh = im.width / cols, im.height / rows
    return [[trim(im.crop((round(c * fw), round(r * fh), round((c + 1) * fw), round((r + 1) * fh)))) for c in range(cols)] for r in range(rows)]


def fx_sheet():
    C = 128
    dolls = grid("시체폭발_인형.png", 4, 2)  # 파일 이름과 달리 이 그림이 미니 인형 8종
    hands = grid("붉은 인형을 매단 픽셀 손들.png", 2, 1)[0]
    crown = trim(cutout(Image.open(os.path.join(CHAR, "픽셀 아트 나뭇가지 왕관.png"))))
    corpse = trim(cutout(Image.open(os.path.join(CHAR, "미니인형_폭발.png"))))  # 앉아 있는 거대 인형
    cells = [dolls[0] + dolls[1], [crown, corpse, hands[0], hands[1]]]
    sheet = Image.new("RGBA", (C * 8, C * 2), (0, 0, 0, 0))
    for r, row in enumerate(cells):
        for c, p in enumerate(row):
            sheet.alpha_composite(fit(p, C), (c * C, r * C))
    sheet.save(os.path.join(SPRITES, "puppeteerFx.png"), optimize=True)
    print("puppeteerFx.png", sheet.size)


def golem_sheet():
    C = 160
    walk = grid("나뭇잎 왕관 인형의 걷기 모음 crescent.png", 4, 2)
    atk = grid("인형 골렘 8종 스프라이트 시트.png", 4, 2)
    rows = walk + atk
    # 모든 칸을 같은 배율로 (가장 큰 칸 기준) — 걷다 때릴 때 크기가 튀지 않게
    big = max(max(p.width, p.height) for row in rows for p in row)
    k = (C - 4) / big
    sheet = Image.new("RGBA", (C * 4, C * 4), (0, 0, 0, 0))
    for r, row in enumerate(rows):
        for c, p in enumerate(row):
            q = p.resize((max(1, round(p.width * k)), max(1, round(p.height * k))), Image.LANCZOS)
            sheet.alpha_composite(q, (c * C + (C - q.width) // 2, r * C + C - 2 - q.height))
    sheet.save(os.path.join(SPRITES, "puppeteerGolem.png"), optimize=True)
    print("puppeteerGolem.png", sheet.size)


if __name__ == "__main__":
    fx_sheet()
    golem_sheet()
