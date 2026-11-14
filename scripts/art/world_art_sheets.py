"""세계 지도 물건 묶음 표 (world_art.py가 씀): 묶음 → (이름, 기준, 픽셀) 왼쪽부터
기준 h = 높이, w = 폭 (그림 픽셀, 지도 1픽셀 = 4) · 이름이 None인 것은 지도에 쓸 곳이 없어 만들지 않음 (게임이 받지 않게)
큰 건물은 게임에서 건물 덩어리 폭에 맞춰 늘림 (여기 크기는 해상도)
"""
SHEETS = {
    "trees": [("tree_oak", "h", 152), ("tree_oak2", "h", 140), ("tree_pine", "h", 160), ("tree_pine2", "h", 148)],
    "rocks": [("rock_big", "w", 68), ("rock_small", "w", 48), ("bush", "w", 52)],
    "houses": [("house_red", "w", 192), ("house_blue", "w", 192)],
    "places": [("cave", "w", 176), ("sign", "h", 72)],
    # 큰 건물은 게임에서 건물 덩어리 폭에 맞춰 늘림 (여기 크기는 해상도)
    # 이름이 None인 것은 아직 지도에 쓸 곳이 없어 만들지 않음 (게임이 받지 않게)
    "palace": [("palace", "w", 1024), ("villa_helios", "w", 320), ("city_gate", "w", 512)],
    "giantTrees": [("giant_tree", "w", 704), ("willow", "h", 176), ("root_arch", "w", 256)],
    "elfCastle": [("elf_castle", "w", 1024), ("treehouse", "w", 192)],
    "desertPlants": [("palm", "h", 176), ("palm2", "h", 152), ("cactus", "h", 112), ("tumbleweed", "w", 48)],
    "ruins": [("column", "h", 120), ("stone_head", "w", 112), ("ribcage", "w", 140), ("tent", "w", 128)],
    "northTrees": [("snow_pine", "h", 160), ("snow_pine2", "h", 136), ("dead_tree", "h", 140)],
    "defense": [("watchtower", "h", 200), ("barricade", "w", 96), ("catapult", "w", 120), ("brazier", "h", 72)],
    "battleScars": [("monster_skull", "w", 128), ("spear_pile", "w", 80), ("ice_crystal", "h", 96), ("army_tent", "w", 136)],
    "ships": [("ship_big", "w", 224), ("boat", "w", 80), ("pirate_ship", "w", 224)],
    "harbor": [("crane", "h", 192), ("cargo", "w", 96), ("warehouse_t", "w", 640), ("lighthouse", "h", 240)],
    "portProps": [("mooring", "h", 48), ("fish_net", "w", 80), ("anchor", "h", 72), ("fish_stall", "w", 112)],
    "factories": [("factory", "w", 448), ("chimney_tower", "h", 320), ("warehouse_metal", "w", 320)],
    # 0.52.123: 건물 안 가구·헬리오스 소품·술집·테라코어·비르디아 장식 (장식 deco 그림, worldDecoArt)
    "homeFurniture": [("bed", "w", 72), ("dining_table", "w", 76), ("bookshelf", "w", 64), ("fireplace", "w", 76)],
    "shopFurniture": [("shop_counter", "w", 80), ("potion_shelf", "w", 68), ("crates", "w", 60), ("potted_plant", "h", 64)],
    "hallFurniture": [("throne", "w", 76), ("long_table", "w", 128), ("armor_stand", "h", 100), ("pillar", "h", 124)],
    "tavernProps": [("barrels", "w", 52), ("bar_counter", "w", 80), ("round_table", "w", 60), ("fireplace_stone", "w", 72)],
    "hideoutProps": [("weapon_rack", "w", 72), ("dummy", "h", 92), ("map_table", "w", 96), ("prison_cell", "w", 84)],
    "imperialProps": [("fountain_gold", "w", 128), ("ruler_statue", "h", 184), (None, "h", 120), ("black_altar", "w", 60)],
    "machines": [("gear_machine", "w", 112), ("yard_crane", "h", 140), ("steam_tank", "h", 104), ("guard_robot", "h", 68)],
    "cityProps": [("gas_lamp", "h", 104), ("pipe_bundle", "w", 72), ("crate_stack", "w", 76), ("train_car", "w", 124)],
    "forestProps": [("glow_mushroom", "w", 68), ("fern", "w", 60), ("flower_bush", "w", 60), ("lantern_post", "h", 96)],
    # 0.53.0 지옥 (keep_art = 악마의 문 성채)
    "hellPillars": [("skull_pillar", "h", 176), ("twisted_tower", "h", 196), ("demon_gate", "w", 1024)],
    "hellProps": [("chain_post", "h", 88), ("bone_tree", "h", 152), ("fire_pit", "w", 72), ("spiky_rock", "w", 64)],
    # 해저 도시
    "seaHouses": [("shell_house", "w", 192), ("bubble_dome", "w", 192), ("sea_temple", "w", 1024)],
    "seaProps": [("coral_big", "w", 84), ("kelp_tall", "h", 156), ("clam", "w", 64), ("sunken_chest", "w", 64)],
    # 사이버펑크 (빌딩은 villa·palace 덩어리 그림)
    "buildings": [("office_tower", "w", 512), ("neon_tower", "w", 512), ("corner_store", "w", 192)],
    "streetProps": [("street_lamp", "h", 104), ("vending", "w", 52), ("hologram", "h", 84), ("car", "w", 104)],
    "cyberProps": [("utility_pole", "h", 152), ("air_vent", "w", 72), ("trash_bin", "w", 40), ("neon_sign", "w", 92)],
    # 바람골
    "hanokHouses": [("hanok", "w", 192), ("hanok_big", "w", 512), ("pavilion", "w", 148)],
    "windProps": [("windmill", "h", 196), ("pinwheel", "h", 104), ("cloth_banner", "h", 136), ("bamboo", "h", 168)],
    "townProps": [("stone_wall", "w", 76), ("jars", "w", 72), ("kite", "h", 92), ("blossom_tree", "h", 156)],
    # 성국
    "cathedral": [("cathedral", "w", 1024), ("bell_tower", "h", 256), ("monastery", "w", 192)],
    "holyProps": [("sacred_brazier", "h", 96), ("angel_statue", "h", 120), ("candle_stand", "h", 100), ("white_banner", "h", 120)],
    "churchFurniture": [("church_altar", "w", 80), ("pew", "w", 76), ("candle_tall", "h", 100), ("organ", "w", 76)],
    # 새벽의 성흔 아지트 (술집 지하) · 계단
    "tavernOutside": [("tavern_outside", "w", 192), ("cellar_stairs", "w", 72)],
    "doorMat": [("inner_door", "w", 72), ("stairs_down", "w", 72), ("stairs_up", "w", 64)],
}
