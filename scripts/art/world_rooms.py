"""0.53.0 안 지도 (world_map.room 틀): 해저 열차 칸 · 새벽의 성흔 아지트 (헬리오스 술집 지하)
가구·사람·창문은 장소 표 (places/cyberField.ts SEA_TRAIN · places/dawnHideout.ts)
"""
from world_map import room


def sea_train():
    """해저 열차 칸 40×9: 위 벽(앞면에 창문) · 철판 바닥 · 가운데 통로 카펫 · 나가는 문 없음 (도착하면 내림)"""
    g = room(40, 9, "floor")
    for x in range(1, 39):
        g[4][x] = g[5][x] = "carpet"
    return g


def dawn_hideout():
    """아지트 36×22: 계단(위 가운데)으로 내려옴 · 왼쪽 무기고 · 가운데 작전실 · 오른쪽 훈련장 · 아래 감옥 (벽으로 나눔, 문 틈)"""
    g = room(36, 22, "floor")
    for y in range(2, 21):
        if y not in (7, 8, 15, 16):
            g[y][12] = g[y][23] = "innerWall"
    for x in range(1, 35):
        if x not in (5, 6, 17, 18, 29, 30):
            g[13][x] = "innerWall"
    for y in range(3, 7):
        for x in range(16, 20):
            g[y][x] = "carpet"
    return g
