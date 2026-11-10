# 블루 플레임 이펙트 그림 (사용자 GPT 그림, 검은 배경 → 밝기를 투명도로, 빛이 부드럽게) → apps/client/public/sprites/{이름}.png
# 8프레임(4×2) → 한 줄 8칸 (칸 128): blueFlame_bow 푸른 불꽃 활 쏘기 · blueFlame_prison 불꽃 감옥 · blueFlame_pillar 불꽃 기둥 · blueFlame_bomb 폭격
#   칸 안 자리를 그대로 둠 (기둥·폭격은 땅이 칸 아래쪽에 맞게) · 모든 칸 같은 배율 (가장 큰 그림이 칸에 꼭 맞게)
# 한 장: blueFlame_bigBow 각성 큰 활 (폭 512) · blueFlame_bigArrow 큰 화살 (폭 384) · blueFlame_wing 푸른 날개 한 쌍 (높이 128)
# 실행: python3 scripts/art/blueFlame_fx.py · 원본 scripts/art/src/{이름}.png
import os
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SPRITES = os.path.join(HERE, "..", "..", "apps", "client", "public", "sprites")
CELL = 128


def load(name, grid=False):
    im = np.array(Image.open(os.path.join(HERE, "src", f"{name}.png")).convert("RGB")).astype(float)
    if grid:
        # 칸 사이 회색 줄 지우기
        H, W = im.shape[:2]
        for k in range(5):
            im[:, max(0, k * W // 4 - 8):k * W // 4 + 8] = 0
        for k in range(3):
            im[max(0, k * H // 2 - 8):k * H // 2 + 8, :] = 0
    a = im.max(axis=2)
    a = np.where(a < 16, 0, a)
    rgb = np.clip(im * 255 / np.maximum(a, 1)[..., None], 0, 255)
    return np.dstack([rgb, a]).astype("uint8")


def frames8(name, grid=False):
    rgba = load(name, grid)
    H, W = rgba.shape[:2]
    cw, ch = W // 4, H // 2
    cells = [rgba[(k // 4) * ch:(k // 4 + 1) * ch, (k % 4) * cw:(k % 4 + 1) * cw] for k in range(8)]
    # 모든 칸을 합친 테두리 상자 (칸 안 자리를 지킴)
    a = np.max(np.stack([c[..., 3] for c in cells]), axis=0)
    ys, xs = np.nonzero(a)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    s = CELL / max(x1 - x0, y1 - y0)
    sheet = Image.new("RGBA", (CELL * 8, CELL), (0, 0, 0, 0))
    for k, c in enumerate(cells):
        im = Image.fromarray(c[y0:y1, x0:x1])
        small = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
        sheet.alpha_composite(small, (round(k * CELL + (CELL - small.width) / 2), round((CELL - small.height) / 2)))
    sheet.save(os.path.join(SPRITES, f"{name}.png"))
    print(name, "ok", sheet.size)


def single(name, w=None, h=None):
    img = Image.fromarray(load(name))
    img = img.crop(img.getbbox())
    if w: size = (w, round(img.height * w / img.width))
    else: size = (round(img.width * h / img.height), h)
    img.resize(size, Image.LANCZOS).save(os.path.join(SPRITES, f"{name}.png"))
    print(name, "ok", size)


frames8("blueFlame_bow")
frames8("blueFlame_prison")
frames8("blueFlame_pillar", grid=True)
frames8("blueFlame_bomb")
single("blueFlame_bigBow", w=512)
single("blueFlame_bigArrow", w=384)
single("blueFlame_wing", h=128)
