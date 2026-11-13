# 루주 그림 (python3 scripts/art/rouge.py) — 원본 art/캐릭터/루주
# · rougeFx.png (192칸 4×16, 투명 바탕, 모두 4칸): 기본 공격 1~4단계·추가 공격 1~4단계·스킬 4개와 강화판 (줄 번호는 화면 render/rougeArt와 같게)
#   모두 빛 그림이라 밝기를 투명도로 · 악마 계급 마크는 느아르와 같은 noirMarks.png
# · 몸 시트 원본 src/rouge-1~3.png: 초록 배경을 검정으로 바꿔 둠 → 그다음 python3 scripts/art/import_v2.py rouge
import os

from PIL import Image

from baekryeong import split4
from noir import unkey
from rabbit import glow
from s2_common import SPRITES

HERE = os.path.dirname(__file__)
CHAR = os.path.join(HERE, "../../art/캐릭터/루주")
C = 192
ROWS = ["기본공격1단계_적장미쌍검격", "추가공격1단계_혈화개화", "기본공격2단계_혈염난무", "추가공격2단계_장미꽃잎폭풍",
        "기본공격3단계_광란의회전참", "추가공격3단계_선혈가시숲", "기본공격4단계_장미가시찌르기", "추가공격4단계_업화의장미",
        "스킬1번(강화)_혈화만개", "스킬1번_혈영돌진", "스킬2번(강화)_광란의혈검무", "스킬2번_장미낙인",
        "스킬3번(강화)_붉은장미의장례", "스킬3번_쌍검혈월참", "스킬4번(강화)_종언의혈장미", "스킬4번_진홍의폭우"]
# 몸 시트 원본: 1 서기·공격 · 2 걷기 · 3 맞음·쓰러짐·대시
BODY = ["붉은 머리 검객의 픽셀 스프라이트 시트", "붉은 머리 전사의 검무 워킹 스프라이트", "붉은 머리 전사의 네 가지 전투 동작"]


def main():
    sheet = Image.new("RGBA", (C * 4, C * len(ROWS)), (0, 0, 0, 0))
    for r, name in enumerate(ROWS):
        row = split4(glow(Image.open(os.path.join(CHAR, name + ".png"))))
        # 한 줄은 같은 배율 (커지는 차례가 그대로 보이게)
        k = (C - 4) / max(max(p.width, p.height) for p in row)
        for c, p in enumerate(row):
            q = p.resize((max(1, round(p.width * k)), max(1, round(p.height * k))), Image.LANCZOS)
            sheet.alpha_composite(q, (c * C + (C - q.width) // 2, r * C + (C - q.height) // 2))
    sheet.save(os.path.join(SPRITES, "rougeFx.png"), optimize=True)
    for i, name in enumerate(BODY):
        unkey(Image.open(os.path.join(CHAR, name + ".png"))).save(os.path.join(HERE, "src", f"rouge-{i + 1}.png"), optimize=True)
    print("rougeFx.png", sheet.size, "· src/rouge-1~3.png")


if __name__ == "__main__":
    main()
