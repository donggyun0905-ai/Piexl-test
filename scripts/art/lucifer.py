# 레이드 보스 루시퍼 그림 (원본 art/레이드보스/루시퍼/) → public/raid/lucifer/
# (python3 scripts/art/lucifer.py)
# · p1.png / p2.png: 1페이즈(여성형)·2페이즈(남성형) 가로 5칸 = 서기 + 공격 모션 4 (검은 바탕은 테두리에서 이어진 것만 지움)
# · pillar.png 석화의 기둥 · sword.png 절망의 검 · portrait.png 메뉴용 (1페이즈 서기)
# · fx.jpg 기본공격 모션 시트 · map1.jpg / map2.jpg 레이드용 맵 잔패턴 (검은 바탕 그대로, 화면에서 더하기로 그림)
# · 컷신 GIF 4개는 그대로 복사 (cut_pillars · cut_p2 · cut_change · cut_death)
import os
import shutil

from PIL import Image

from import_sheet import finish, shrink
from import_v2 import pieces
from s2_common import SPRITES

ROOT = os.path.join(os.path.dirname(__file__), "../../art/레이드보스/루시퍼")
OUT = os.path.join(SPRITES, "..", "raid", "lucifer")
CELL = 400


def load(name):
    return Image.open(os.path.join(ROOT, name)).convert("RGBA")


def fit(p, box):
    k = min((box - 4) / p.width, (box - 4) / p.height)
    return shrink(p, k)


def body_sheet(out, idle, motion):
    first = pieces(load(idle), 1, 1, flood=True)[0][0]
    parts = [first] + [c for row in pieces(load(motion), 2, 2, flood=True) for c in row]
    # 공격 모션은 2×2 시트라 몸이 서기 그림의 절반쯤: 같은 몸 크기가 되게 2배로 (칸을 넘으면 칸에 맞춤)
    k0 = min((CELL - 4) / first.width, (CELL - 4) / first.height)
    sheet = Image.new("RGBA", (CELL * len(parts), CELL), (0, 0, 0, 0))
    for i, p in enumerate(parts):
        p = shrink(p, k0 if i == 0 else min(k0 * 2, (CELL - 4) / p.width, (CELL - 4) / p.height))
        sheet.alpha_composite(p, (i * CELL + (CELL - p.width) // 2, (CELL - p.height) // 2))
    finish(sheet).save(os.path.join(OUT, out), optimize=True)
    print(out, sheet.size)


def single(out, src, box):
    p = fit(pieces(load(src), 1, 1, flood=True)[0][0], box)
    finish(p).save(os.path.join(OUT, out), optimize=True)
    print(out, p.size)


def plain(out, src, width):
    img = Image.open(os.path.join(ROOT, src)).convert("RGB")
    img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    img.save(os.path.join(OUT, out), quality=88)
    print(out, img.size)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    body_sheet("p1.png", "루시퍼_페이즈1.png", "루시퍼_페이즈1_공격모션.png")
    body_sheet("p2.png", "루시퍼_페이즈2.png", "루시퍼_페이즈2_공격모션.png")
    single("pillar.png", "석화의 기둥.png", 360)
    single("sword.png", "절망의검.png", 360)
    single("portrait.png", "루시퍼_페이즈1.png", 360)
    plain("fx.jpg", "루시퍼 기본공격모션.png", 1536)
    plain("map1.jpg", "레이드용 맵 잔패턴.png", 1536)
    plain("map2.jpg", "레이드용 맵 잔패턴 (2).png", 1536)
    for src, out in [("기둥4개 부서진 이후 필살기 컷신.gif", "cut_pillars.gif"), ("2페이즈_필살기 컷신.gif", "cut_p2.gif"), ("페이즈1에서2로 변신.gif", "cut_change.gif"), ("피가다해_죽는모습.gif", "cut_death.gif")]:
        shutil.copyfile(os.path.join(ROOT, src), os.path.join(OUT, out))
