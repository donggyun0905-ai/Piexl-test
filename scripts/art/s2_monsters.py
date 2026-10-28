# 시즌 2 새 몬스터 넷 그림 (python3 scripts/art/s2_monsters.py) → apps/client/public/sprites/enemies/{doppel,venom,landfish,lurker}.png
# 규격(docs/ART.md): 움직임 칸 2장을 가로로, 오른쪽을 봄, 몸 크기 + 6~8
# 도플갱어: 게임에서는 내 캐릭터 모습을 어둡게 그림 · 이 그림은 도감·그림을 못 불러왔을 때 (검보라 사람 그림자 · 붉은 눈)
# 베놈: 녹색 독잠자리 · 보라 무늬 꼬리 · 반투명 날개 (2칸: 날개 위아래)
# 땅 물고기: 흙빛 메기 같은 물고기 · 큰 입 · 등지느러미 (2칸: 꼬리 흔듦)
# 그림자: 검은 안개 사람 · 하얀 눈 · 아래가 흩어짐 (2칸: 안개가 흔들림, 게임에서는 거의 투명)
from s2_common import Cell, hx
from umbra_beasts import poly, save

def doppel(f):
    c = Cell(20)
    body, dark, eye = hx("#3a2a4a"), hx("#22182e"), hx("#ff3a4a")
    c.oval(10, 6, 3, 3, body)
    c.rect(7, 9, 7, 6, body)
    c.rect(7, 12, 7, 1, dark)
    c.rect(8, 15, 2, 3 - f, dark); c.rect(11, 15, 2, 2 + f, dark)
    c.rect(14, 10 + f, 2, 4, body)
    c.px(11, 6, eye); c.px(13, 6, eye)
    c.outline(hx("#0e0a14"))
    return c

def venom(f):
    c = Cell(18)
    body, belly, mark, wing = hx("#5ab83a"), hx("#9ae05a"), hx("#9a4ac8"), hx("#c8f0e0")
    # 날개 (위·아래로 파닥)
    wy = 3 if f else 5
    poly(c, [(8, 8), (5, wy), (11, wy - 1), (10, 8)], wing)
    poly(c, [(8, 10), (5, 14 - (f * 2)), (11, 14 - f), (10, 10)], wing)
    # 긴 꼬리 · 몸 · 머리
    c.line(1, 9, 8, 9, body); c.line(1, 10, 8, 10, body)
    for x in (2, 5): c.px(x, 9, mark); c.px(x, 10, mark)
    c.oval(10, 9, 2, 2, body)
    c.oval(10, 10, 1, 1, belly)
    c.oval(14, 9, 2, 2, body)
    c.px(15, 8, hx("#ff4a8a")); c.px(16, 9, hx("#2a0a1a"))
    c.outline(hx("#123a10"))
    return c

def landfish(f):
    c = Cell(20)
    body, dark, belly = hx("#8a6a3a"), hx("#5a4024"), hx("#d8c098")
    c.oval(10, 11, 7, 4, body)
    c.oval(10, 13, 5, 2, belly)
    # 등지느러미 · 꼬리
    poly(c, [(7, 7), (10, 3), (12, 7)], dark)
    poly(c, [(3, 11), (0, 8 if f else 7), (0, 14 if f else 15)], dark)
    # 큰 입 · 눈 · 수염
    c.line(14, 13, 18, 12, hx("#2a1a0a"))
    c.px(14, 9, hx("#fff27a")); c.px(15, 9, hx("#1a1008"))
    c.line(17, 12, 19, 15 - f, dark)
    for x in (6, 9, 12): c.px(x, 10, dark)
    c.outline(hx("#2a1a0a"))
    return c

def lurker(f):
    c = Cell(18)
    smoke, dark = hx("#2a2a3a"), hx("#14141c")
    c.oval(9, 5, 3, 3, dark)
    poly(c, [(5, 8), (13, 8), (14, 13), (4, 13)], smoke)
    # 흩어지는 아랫몸
    for i, x in enumerate(range(4, 15, 2)):
        h = 2 + ((i + f) % 3)
        c.rect(x, 13, 1, h, smoke)
    # 길게 뻗은 손톱
    c.line(13, 9, 17, 7 + f, dark)
    c.px(10, 5, hx("#f0f0ff")); c.px(12, 5, hx("#f0f0ff"))
    c.outline(hx("#08080c"))
    return c

def main():
    save("doppel", [doppel(0), doppel(1)], 20)
    save("venom", [venom(0), venom(1)], 18)
    save("landfish", [landfish(0), landfish(1)], 20)
    save("lurker", [lurker(0), lurker(1)], 18)

if __name__ == "__main__":
    main()
