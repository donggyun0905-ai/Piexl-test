# 마젠타 그림 (python3 scripts/art/magenta.py) — 원본 art/캐릭터/마젠타
# · magentaFx.png (192칸 4×16, 투명 바탕, 모두 4칸): 기본 공격 1~4단계·추가 공격 1~4단계·스킬 4개와 강화판 (줄 번호는 화면 render/magentaArt와 같게)
#   모두 빛 그림이라 밝기를 투명도로 · 악마 계급 마크는 느아르와 같은 noirMarks.png
# · 몸 시트 원본 src/magenta-1~3.png: 초록 배경을 검정으로 바꿔 둠 → 그다음 python3 scripts/art/import_v2.py magenta
import os

from PIL import Image

from baekryeong import split4
from noir import unkey
from rabbit import glow
from s2_common import SPRITES

HERE = os.path.dirname(__file__)
CHAR = os.path.join(HERE, "../../art/캐릭터/마젠타")
C = 192
ROWS = ["기본공격1단계_자홍저주비", "기본공격2단계_푸시아만개", "기본공격3단계_환영꽃잎파동", "기본공격4단계_저주의꽃가루",
        "추가공격1단계_매혹의시선", "추가공격2단계_푸시아환영분신", "추가공격3단계_자홍화산파", "추가공격4단계_저주의낙인",
        "스킬1번_환상의꽃감옥", "스킬2번_악몽의꽃밭", "스킬3번_유혹의소용돌이", "스킬4번_독화침식",
        "스킬1번(강화)_환영붕괴", "스킬2번(강화)_영혼유린", "스킬3번(강화)_매혹의강우", "스킬4번(강화)_종언의푸시아성역"]
# 몸 시트 원본: 1 서기·공격 · 2 걷기 · 3 맞음·쓰러짐·대시
BODY = ["마젠타 서기·공격", "마젠타 걷기", "마젠타 맞음·쓰러짐·대시"]


def main():
    sheet = Image.new("RGBA", (C * 4, C * len(ROWS)), (0, 0, 0, 0))
    for r, name in enumerate(ROWS):
        row = split4(glow(Image.open(os.path.join(CHAR, name + ".png"))))
        # 한 줄은 같은 배율 (커지는 차례가 그대로 보이게)
        k = (C - 4) / max(max(p.width, p.height) for p in row)
        for c, p in enumerate(row):
            q = p.resize((max(1, round(p.width * k)), max(1, round(p.height * k))), Image.LANCZOS)
            sheet.alpha_composite(q, (c * C + (C - q.width) // 2, r * C + (C - q.height) // 2))
    sheet.save(os.path.join(SPRITES, "magentaFx.png"), optimize=True)
    for i, name in enumerate(BODY):
        unkey(Image.open(os.path.join(CHAR, name + ".png"))).save(os.path.join(HERE, "src", f"magenta-{i + 1}.png"), optimize=True)
    print("magentaFx.png", sheet.size, "· src/magenta-1~3.png")


if __name__ == "__main__":
    main()
