# 루나틱 이펙트 그림 (사용자 GPT 그림, 검은 배경 → 밝기를 투명도로, 빛이 부드럽게) → apps/client/public/sprites/{이름}.png
# 8프레임(4×2) → 한 줄 8칸: lunatic_thrust 레이피어 찌르기 (칸 192×64, 왼쪽 = 칼끝이 나가는 자리 · 오른쪽 = 찌르는 쪽) · lunatic_slash 달빛 베기 (칸 128×128)
#   모든 칸을 합친 테두리 상자로 자르고 같은 배율 (칸 안 자리를 지킴)
# 실행: python3 scripts/art/lunatic_fx.py · 원본 scripts/art/src/{이름}.png (art/루나틱/)
import os
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SPRITES = os.path.join(HERE, "..", "..", "apps", "client", "public", "sprites")


def load(name, floor=18):
    """floor: 이보다 어두우면 투명 (18보다 크면 그 위 밝기를 0~255로 다시 펴서, 원본의 어두운 회색 상자가 안 보이게)"""
    im = np.array(Image.open(os.path.join(HERE, "src", f"{name}.png")).convert("RGB")).astype(float)
    a = im.max(axis=2)
    a = np.where(a < floor, 0, a if floor <= 18 else (a - floor) * 255 / (255 - floor))
    rgb = np.clip(im * 255 / np.maximum(a, 1)[..., None], 0, 255)
    return np.dstack([rgb, a]).astype("uint8")


def frames8(name, cw_out, ch_out, floor=18):
    rgba = load(name, floor)
    H, W = rgba.shape[:2]
    cw, ch = W // 4, H // 2
    cells = [rgba[(k // 4) * ch:(k // 4 + 1) * ch, (k % 4) * cw:(k % 4 + 1) * cw] for k in range(8)]
    a = np.max(np.stack([c[..., 3] for c in cells]), axis=0)
    ys, xs = np.nonzero(a)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    s = min(cw_out / (x1 - x0), ch_out / (y1 - y0))
    sheet = Image.new("RGBA", (cw_out * 8, ch_out), (0, 0, 0, 0))
    for k, c in enumerate(cells):
        im = Image.fromarray(c[y0:y1, x0:x1])
        small = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
        sheet.alpha_composite(small, (round(k * cw_out + (cw_out - small.width) / 2), round((ch_out - small.height) / 2)))
    sheet.save(os.path.join(SPRITES, f"{name}.png"))
    print(name, "ok", sheet.size)


def boxes8(name, boxes, cw_out, ch_out):
    """칸 경계를 넘는 그림: 프레임마다 직접 정한 상자로 잘라 같은 배율 · 칸 왼쪽에 붙이고 세로 가운데"""
    rgba = load(name)
    cells = [rgba[y0:y1, x0:x1] for x0, y0, x1, y1 in boxes]
    s = min(min(cw_out / c.shape[1], ch_out / c.shape[0]) for c in cells)
    sheet = Image.new("RGBA", (cw_out * 8, ch_out), (0, 0, 0, 0))
    for k, c in enumerate(cells):
        im = Image.fromarray(c)
        im = im.crop(im.getbbox())
        small = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
        sheet.alpha_composite(small, (k * cw_out + 2, round((ch_out - small.height) / 2)))
    sheet.save(os.path.join(SPRITES, f"{name}.png"))
    print(name, "ok", sheet.size)


# 찌르기 원본(1536×1024)의 프레임 자리 (4번째 칼빛이 칸 경계를 넘어 직접 정함)
THRUST = [(90, 225, 263, 405), (352, 210, 593, 413), (660, 195, 998, 428), (1035, 172, 1530, 443),
          (37, 570, 413, 818), (450, 555, 743, 818), (795, 562, 1118, 810), (1192, 577, 1493, 795)]
if __name__ == "__main__":
    boxes8("lunatic_thrust", THRUST, 192, 64)
    frames8("lunatic_slash", 128, 128)
