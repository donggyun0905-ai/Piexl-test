# 인시전 이펙트 그림 (사용자 GPT 그림, 검은 배경 → 밝기를 투명도로, 빛이 부드럽게) → apps/client/public/sprites/{이름}.png
# 8프레임(4×2) → 한 줄 8칸 (모든 칸을 합친 테두리 상자로 자르고 같은 배율 · 칸 안 자리를 지킴)
#   incision_slash 붉은 초승달 참격 (1·2타) · incision_cross 화염 초승달 X 베기 (3타) · incision_whirl 소용돌이 참격 (4타)
#   incision_rush 돌진 연참 (대시, 오른쪽으로 나아감) · incision_leap 점프 강타 (앞 4칸 뜀 · 뒤 4칸 착지) · incision_awake 쌍도끼 강타 (광란 각성)
# 실행: python3 scripts/art/incision_fx.py · 원본 scripts/art/src/{이름}.png (art/인시전/)
from lunatic_fx import frames8

frames8("incision_slash", 128, 128)
frames8("incision_cross", 128, 128)
frames8("incision_whirl", 128, 128)
frames8("incision_rush", 160, 112, 60)
frames8("incision_leap", 128, 128, 60)
frames8("incision_awake", 144, 112)
