# 헬피스트 이펙트 그림 (사용자 GPT 그림 8프레임, 4×2) → apps/client/public/sprites/{이름}.png (한 줄 8칸, 칸 128)
# hellfist_x: 허공검격 X자 (초록 배경 → 투명) · hellfist_shatter: 균열 파쇄 붉은 유리 (검은 배경 → 밝기를 투명도로, 빛이 부드럽게)
# 실행: python3 scripts/art/hellfist_x.py · 원본 scripts/art/src/{이름}.webp
import os
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SPRITES = os.path.join(HERE, "..", "..", "apps", "client", "public", "sprites")
CELL = 128


def green_key(im):
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    a = np.where((g > r + 40) & (g > b + 40), 0, 255)
    return np.dstack([r, np.minimum(g, np.maximum(r, b)), b, a])


def black_key(im):
    a = im.max(axis=2)
    a = np.where(a < 14, 0, a)
    rgb = np.clip(im * 255 / np.maximum(a, 1)[..., None], 0, 255)
    return np.dstack([rgb, a])


def build(name, key):
    im = np.array(Image.open(os.path.join(HERE, "src", f"{name}.webp")).convert("RGB")).astype(float)
    rgba = key(im).astype("uint8")
    H, W = rgba.shape[:2]
    frames = []
    for k in range(8):
        x0, y0 = (k % 4) * W // 4, (k // 4) * H // 2
        cell = rgba[y0:y0 + H // 2, x0:x0 + W // 4]
        ys, xs = np.nonzero(cell[..., 3])
        cx, cy = ((xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2) if len(xs) else (W / 8, H / 4)
        frames.append((Image.fromarray(cell), cx, cy))
    # 모든 칸 같은 배율 (가장 큰 프레임이 칸에 꼭 맞게)
    half = max(max(f.width - cx, cx, f.height - cy, cy) for f, cx, cy in frames)
    s = (CELL / 2) / half
    sheet = Image.new("RGBA", (CELL * 8, CELL), (0, 0, 0, 0))
    for k, (f, cx, cy) in enumerate(frames):
        small = f.resize((round(f.width * s), round(f.height * s)), Image.LANCZOS)
        sheet.alpha_composite(small, (round(k * CELL + CELL / 2 - cx * s), round(CELL / 2 - cy * s)))
    sheet.save(os.path.join(SPRITES, f"{name}.png"))
    print(name, "ok", sheet.size)


build("hellfist_x", green_key)
build("hellfist_shatter", black_key)
