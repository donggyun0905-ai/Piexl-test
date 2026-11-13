# 되살린 검은 짐승(데스웜·거대 전갈·거대 매)의 *_dark 시트: 새 4배 그림에서 색만 바꿈 (2026-11-14)
# python3 scripts/art/dark_beasts.py sandworm scorpion roc
# 몸은 검보라 · 밝고 흰 부분(이빨·부리·발톱)은 흰색 · 초록으로 빛나는 독·독침은 빨강
import os
import sys

import numpy as np
from PIL import Image

from s2_common import SPRITES

OUT = os.path.join(SPRITES, "enemies")


def darken(name):
    src = np.array(Image.open(os.path.join(OUT, f"{name}.png")).convert("RGBA")).astype(float)
    r, g, b, a = src[..., 0], src[..., 1], src[..., 2], src[..., 3]
    lum = (r * 0.3 + g * 0.59 + b * 0.11) / 255
    sat = (np.max(src[..., :3], axis=2) - np.min(src[..., :3], axis=2)) / 255
    out = np.zeros_like(src)
    d = 8 + lum * 62
    out[..., 0], out[..., 1], out[..., 2] = d, d * 0.9, d * 1.15
    white = (lum > 0.78) & (sat < 0.25)
    glow = (g > 170) & (r < 160) & (b < 150)
    out[white, :3] = (236, 236, 240)
    out[glow, :3] = (255, 36, 40)
    out[..., 3] = a
    Image.fromarray(out.clip(0, 255).astype("uint8")).save(os.path.join(OUT, f"{name}_dark.png"), optimize=True)
    print(name + "_dark", "ok")


if __name__ == "__main__":
    for n in sys.argv[1:]:
        darken(n)
