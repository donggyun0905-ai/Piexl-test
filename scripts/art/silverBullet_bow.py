# 실버불렛 은빛 활 그림 (사용자 그림 1장, 검은 배경 흰 장식 초승달 활 ")") → apps/client/public/sprites/silverBullet_bow.png
# 검은 배경 → 밝기를 투명도로 (빛이 부드럽게) · 활만 잘라 세로 128칸 높이로 줄임 (활 가운데가 오른쪽 = 바라보는 쪽)
# 실행: python3 scripts/art/silverBullet_bow.py · 원본 scripts/art/src/silverBullet_bow.png
import os
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "..", "apps", "client", "public", "sprites", "silverBullet_bow.png")
H = 128

im = np.array(Image.open(os.path.join(HERE, "src", "silverBullet_bow.png")).convert("RGB")).astype(float)
a = im.max(axis=2)
a = np.where(a < 12, 0, a)
rgb = np.clip(im * 255 / np.maximum(a, 1)[..., None], 0, 255)
img = Image.fromarray(np.dstack([rgb, a]).astype("uint8"))
img = img.crop(img.getbbox())
w = round(img.width * H / img.height)
img.resize((w, H), Image.LANCZOS).save(OUT)
print("silverBullet_bow", w, H)
