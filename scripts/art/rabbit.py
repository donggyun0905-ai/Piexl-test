# 래빗 그림 (python3 scripts/art/rabbit.py) — 원본 art/캐릭터/래빗
# · rabbitFx.png (256칸 4×3, 투명 바탕): 0줄 땅울림 4칸(커지는 차례) · 1줄 토끼인장 4칸 · 2줄 초거대 망치 4칸
#   땅울림은 빛 그림이라 밝기를 투명도로 (검은 바탕이 자연스럽게 빠짐) · 칸 번호는 화면 render/rabbitArt와 같게
# 캐릭터 몸 시트는 import_v2.py rabbit (src/rabbit-1~3.png)
import os

import numpy as np
from PIL import Image

from puppeteer import cutout, trim
from s2_common import SPRITES

HERE = os.path.dirname(__file__)
CHAR = os.path.join(HERE, "../../art/캐릭터/래빗")
C = 256


def glow(im):
    """빛 그림: 가장 밝은 값을 투명도로, 색은 그만큼 밝게 (검은 바탕이 사라지고 빛만 남음)"""
    rgb = np.asarray(im.convert("RGB")).astype(np.float32)
    a = rgb.max(axis=2)
    a = np.where(a < 14, 0, a)
    k = np.where(a > 0, 255 / np.maximum(a, 1), 0)[..., None]
    out = np.concatenate([np.clip(rgb * k, 0, 255), a[..., None]], axis=2).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def frames(im, n=4):
    """가로로 놓인 n칸: 비어 있는 세로줄로 나눔 (칸 너비가 달라도 됨) · 가장 넓은 n덩어리"""
    a = np.asarray(im.getchannel("A")) > 24
    cols = a.any(axis=0)
    runs, x = [], 0
    w = len(cols)
    while x < w:
        if not cols[x]:
            x += 1
            continue
        x0 = x
        while x < w and cols[x]: x += 1
        runs.append((x0, x))
    # 너무 가까운 덩어리는 합침 (빛 조각이 떨어져 있어도 한 칸)
    merged = []
    for r in runs:
        if merged and r[0] - merged[-1][1] < 24: merged[-1] = (merged[-1][0], r[1])
        else: merged.append(r)
    merged = sorted(sorted(merged, key=lambda r: r[1] - r[0])[-n:])
    return [trim(im.crop((x0, 0, x1, im.height))) for x0, x1 in merged]


def place(sheet, p, c, r, k):
    q = p.resize((max(1, round(p.width * k)), max(1, round(p.height * k))), Image.LANCZOS)
    sheet.alpha_composite(q, (c * C + (C - q.width) // 2, r * C + (C - q.height) // 2))


def main():
    rows = [
        frames(glow(Image.open(os.path.join(CHAR, "땅울림.png")))),
        frames(cutout(Image.open(os.path.join(CHAR, "토끼인장.png")))),
        frames(cutout(Image.open(os.path.join(CHAR, "궁극기_초거대망치.png")))),
    ]
    sheet = Image.new("RGBA", (C * 4, C * 3), (0, 0, 0, 0))
    for r, row in enumerate(rows):
        # 한 줄은 같은 배율 (가장 큰 칸 기준) — 커지는 차례가 그대로 보이게
        big = max(max(p.width, p.height) for p in row)
        for c, p in enumerate(row): place(sheet, p, c, r, (C - 6) / big)
    sheet.save(os.path.join(SPRITES, "rabbitFx.png"), optimize=True)
    print("rabbitFx.png", sheet.size, [len(r) for r in rows])


if __name__ == "__main__":
    main()
