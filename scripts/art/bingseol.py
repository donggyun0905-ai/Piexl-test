# 빙설 그림 (python3 scripts/art/bingseol.py) — 원본 art/캐릭터/빙설
# · bingseolFx.png (256칸 4×3, 투명 바탕): 0줄 얼음 창 연발 4칸(커지는 차례) · 1줄 얼음가루·유도 얼음·급속 얼음·얼음 빙각
#   2줄 0칸 궁극기 빙설창 · 1칸 얼음 활 · 2칸 빛나는 화살 · 3칸 눈 결정(영역강화 벽)
#   모두 빛 그림이라 밝기를 투명도로 · 칸 번호는 화면 render/bingseolArt와 같게
# 캐릭터 몸 시트는 import_v2.py bingseol (src/bingseol-1~3.png: 룬 눈(서기·공격) · 걷기 · 액션(맞음·쓰러짐·대시))
import os

from PIL import Image

from baekryeong import place, split4
from puppeteer import trim
from rabbit import frames, glow
from s2_common import SPRITES

HERE = os.path.dirname(__file__)
CHAR = os.path.join(HERE, "../../art/캐릭터/빙설")
C = 256


def load(name):
    return glow(Image.open(os.path.join(CHAR, name)))


def halves(im):
    """왼쪽 활 · 오른쪽 화살 (가운데 빈 세로줄로 나눔)"""
    parts = frames(im, 2)
    return parts


def main():
    rows = [
        split4(load("얼음 창 연발.png")),
        frames(load("얼음가루_유도얼음_급속얼음_얼음빙각.png")),
        [trim(load("궁극기 얼음창.png"))] + halves(load("얼음 수정 활과 빛나는 화살.png")) + [trim(load("얼음영역 벽면.png"))],
    ]
    sheet = Image.new("RGBA", (C * 4, C * 3), (0, 0, 0, 0))
    for r, row in enumerate(rows):
        # 0줄은 같은 배율 (커지는 차례가 그대로 보이게) · 나머지는 칸마다 꽉 차게
        big = max(max(p.width, p.height) for p in row)
        for c, p in enumerate(row): place(sheet, p, c, r, (C - 6) / (big if r == 0 else max(p.width, p.height)))
    sheet.save(os.path.join(SPRITES, "bingseolFx.png"), optimize=True)
    print("bingseolFx.png", sheet.size, [len(r) for r in rows])


if __name__ == "__main__":
    main()
