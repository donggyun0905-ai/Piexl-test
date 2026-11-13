# 제천대성 그림: boss-sage.png(2×2 걷기 1·2·준비·공격) + boss-sage_cloud.png(2×2 근두운 넷) → 게임 시트
# python3 scripts/art/import_sage.py  (게임 크기 96, 4배)
# sage.png 5칸 (render/sage.ts): 0·1 근두운 위 걷기 · 2 근두운 위 휘두르기 · 3 땅 위 · 4 땅 위 휘두르기
# sage_cloud.png 4칸: 따로 떠다니는 근두운 (같은 배율)
import os

from PIL import Image

from import_sheet import HERE, finish, shrink
from import_v2 import pieces
from s2_common import SPRITES

CELL = 96 * 4
BODY = 0.62  # 걷기 1 모습 키 = 칸의 이 비율
CLOUD_W = 0.9  # 근두운 너비 = 칸의 이 비율


def parts(name):
    img = Image.open(os.path.join(HERE, "src", f"boss-{name}.png")).convert("RGBA")
    g = pieces(img, 2, 2, flood=True)
    return [g[0][0], g[0][1], g[1][0], g[1][1]]


def frame(body, k, cloud=None):
    """칸 하나: 몸(가운데) · 근두운이 있으면 그 위에 서게"""
    f = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
    b = shrink(body, min(k, (CELL - 4) / body.width))
    foot = CELL - 2
    if cloud is not None:
        f.alpha_composite(cloud, ((CELL - cloud.width) // 2, CELL - 2 - cloud.height))
        foot = CELL - 2 - int(cloud.height * 0.55)
    f.alpha_composite(b, ((CELL - b.width) // 2, max(0, foot - b.height)))
    return f


if __name__ == "__main__":
    sage, clouds = parts("sage"), parts("sage_cloud")
    ck = CELL * CLOUD_W / clouds[0].width
    clouds = [shrink(c, ck) for c in clouds]
    k = CELL * BODY / sage[0].height
    cells = [frame(sage[0], k, clouds[0]), frame(sage[1], k, clouds[1]), frame(sage[3], k, clouds[2]), frame(sage[0], k), frame(sage[3], k)]
    sheet = Image.new("RGBA", (CELL * len(cells), CELL), (0, 0, 0, 0))
    for i, c in enumerate(cells):
        sheet.alpha_composite(c, (i * CELL, 0))
    finish(sheet).save(os.path.join(SPRITES, "enemies", "sage.png"), optimize=True)
    cs = Image.new("RGBA", (CELL * 4, CELL), (0, 0, 0, 0))
    for i, c in enumerate(clouds):
        cs.alpha_composite(c, (i * CELL + (CELL - c.width) // 2, (CELL - c.height) // 2))
    finish(cs).save(os.path.join(SPRITES, "enemies", "sage_cloud.png"), optimize=True)
    print("sage ok", sheet.size, "cloud", cs.size)
