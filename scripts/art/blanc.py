# 블랑 그림 (python3 scripts/art/blanc.py) — 원본 art/캐릭터/블랑 (강화 스킬 4개·영혼 전이는 webp로 받은 것을 png로)
# · blancFx.png (192칸 4×16, 투명 바탕, 모두 4칸): 기본 공격 1~4단계·추가 공격 1~4단계·스킬 4개와 강화판 (줄 번호는 화면 render/blancArt와 같게)
#   모두 빛 그림이라 밝기를 투명도로 · 악마 계급 마크는 느아르와 같은 noirMarks.png
# · 몸 시트 원본 src/blanc-1~3.png: 초록 배경을 검정으로 바꿔 둠 → 그다음 python3 scripts/art/import_v2.py blanc
import os

from PIL import Image

from baekryeong import split4
from noir import unkey
from rabbit import glow
from s2_common import SPRITES

HERE = os.path.dirname(__file__)
CHAR = os.path.join(HERE, "../../art/캐릭터/블랑")
C = 192
ROWS = ["기본공격1단계_순백의부채무", "기본공격2단계_거짓된축복", "기본공격3단계_성흔인형극", "기본공격4단계_백색거울궁",
        "추가공격1단계_영혼의틈", "추가공격2단계_백령빙의", "추가공격3단계_강제성전", "추가공격4단계_허수의분신",
        "스킬1번_고해의속삭임", "스킬2번_정화의역설", "스킬3번_천사의거짓날개", "스킬4번_영혼전이",
        "스킬1번(강화)_반전된구원", "스킬2번(강화)_백색성역의기만", "스킬3번(강화)_천개의거짓눈", "스킬4번(강화)_종언의무구한지배"]
# 몸 시트 원본: 1 서기·공격 · 2 걷기 · 3 맞음·쓰러짐·대시
BODY = ["블랑 서기·공격", "블랑 걷기", "블랑 맞음·쓰러짐·대시"]


def main():
    sheet = Image.new("RGBA", (C * 4, C * len(ROWS)), (0, 0, 0, 0))
    for r, name in enumerate(ROWS):
        row = split4(glow(Image.open(os.path.join(CHAR, name + ".png"))))
        # 한 줄은 같은 배율 (커지는 차례가 그대로 보이게)
        k = (C - 4) / max(max(p.width, p.height) for p in row)
        for c, p in enumerate(row):
            q = p.resize((max(1, round(p.width * k)), max(1, round(p.height * k))), Image.LANCZOS)
            sheet.alpha_composite(q, (c * C + (C - q.width) // 2, r * C + (C - q.height) // 2))
    sheet.save(os.path.join(SPRITES, "blancFx.png"), optimize=True)
    for i, name in enumerate(BODY):
        unkey(Image.open(os.path.join(CHAR, name + ".png"))).save(os.path.join(HERE, "src", f"blanc-{i + 1}.png"), optimize=True)
    print("blancFx.png", sheet.size, "· src/blanc-1~3.png")


if __name__ == "__main__":
    main()
