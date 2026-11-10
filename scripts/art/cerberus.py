# 시즌 3 라스트 보스 켈베로스 그림 (GPT 원본 art/최종보스/켈베로스/, 가로 4칸) → enemies/{이름}.png 가로 4칸, 칸 = 게임 크기 × 4
# (python3 scripts/art/cerberus.py) 칸: 0 서기 · 1~3 공격 모습 (모두 같은 배율, 발을 같은 줄에) · render/cerberus가 sim의 cbPose로 고름
import os

from PIL import Image

from import_sheet import finish, shrink
from import_v2 import pieces
from s2_common import SPRITES

HD = 4
ROOT = os.path.join(os.path.dirname(__file__), "../../art/최종보스/켈베로스")
SHEETS = {
    # 이름: (원본, 게임 칸 크기)
    "cerberus": ("세 머리 지옥견의 연속 공격 자세.png", 100),
    "cerbfist": ("붉은 악마 전사의 연속 공격 자세.png", 56),
    "cerbflame": ("불꽃 악마술사의 궁극기 연출.png", 60),
    "cerbblade": ("암흑 대검사의 붉은 검무 4연속 Poses.png", 56),
}


def sheet(name, path, size):
    cell = size * HD
    img = Image.open(os.path.join(ROOT, path)).convert("RGBA")
    grid = pieces(img, 4, 1, flood=True)
    parts = [grid[0][i] for i in range(4)]
    k = min(min((cell - 4) / p.width, (cell - 4) / p.height) for p in parts)
    out = Image.new("RGBA", (cell * 4, cell), (0, 0, 0, 0))
    for i, p in enumerate(parts):
        p = shrink(p, k)
        out.alpha_composite(p, (i * cell + (cell - p.width) // 2, cell - 2 - p.height))
    finish(out).save(os.path.join(SPRITES, "enemies", f"{name}.png"), optimize=True)
    print(name, out.size)


if __name__ == "__main__":
    for name, (path, size) in SHEETS.items():
        sheet(name, path, size)
