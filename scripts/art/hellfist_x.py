# 헬피스트 허공검격 X자 이펙트 (사용자 GPT 그림 8프레임, 4×2 초록 배경) → apps/client/public/sprites/hellfist_x.png (한 줄 8칸, 칸 128)
# 실행: python3 scripts/art/hellfist_x.py · 원본 scripts/art/src/hellfist_x.webp
import os
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "src", "hellfist_x.webp")
OUT = os.path.join(HERE, "..", "..", "apps", "client", "public", "sprites", "hellfist_x.png")
CELL = 128

im = np.array(Image.open(SRC).convert("RGB")).astype(int)
r, g, b = im[..., 0], im[..., 1], im[..., 2]
alpha = np.where((g > r + 40) & (g > b + 40), 0, 255)
# 초록 번짐 빼기
g2 = np.minimum(g, np.maximum(r, b))
rgba = np.dstack([r, g2, b, alpha]).astype("uint8")
H, W = alpha.shape
frames = []
for k in range(8):
    x0, y0 = (k % 4) * W // 4, (k // 4) * H // 2
    cell = rgba[y0:y0 + H // 2, x0:x0 + W // 4]
    ys, xs = np.nonzero(cell[..., 3])
    cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
    frames.append((Image.fromarray(cell), cx, cy))
# 모든 칸 같은 배율 (가장 큰 프레임이 칸에 꼭 맞게)
half = max(max(f.width - cx, cx, f.height - cy, cy) for f, cx, cy in frames)
s = (CELL / 2) / half
sheet = Image.new("RGBA", (CELL * 8, CELL), (0, 0, 0, 0))
for k, (f, cx, cy) in enumerate(frames):
    small = f.resize((round(f.width * s), round(f.height * s)), Image.LANCZOS)
    sheet.alpha_composite(small, (round(k * CELL + CELL / 2 - cx * s), round(CELL / 2 - cy * s)))
sheet.save(OUT)
print("ok", sheet.size)
