import { describe, expect, it } from "vitest";
import { PW_BALANCE } from "./balance";
import { PW_CHAR } from "./paewangBalance";
import { PW_KITS } from "./pwKits";
import { pwRoleOf } from "./pwRoles";
import { PW_UNIT } from "./pwRules";
import { PW_BASIC } from "./pwShop";

describe("패왕전 관리자 수치", () => {
  it("역할군·캐릭터 배율·스킬 값을 넣으면 게임 표가 바뀌고, 비우면 처음 값으로", () => {
    expect(pwRoleOf("warden")).toBe("warrior");
    const cd = PW_KITS.gunner!.skills[3]!.cd;
    PW_BALANCE.applyBalance({ pwRoles: { warden: { role: 4 } }, pwChars: { mage: { rate: 1.5 } }, pwSkills: { gunner: { "skills.3.cd": 10 } } });
    expect(pwRoleOf("warden")).toBe("support");
    expect(PW_CHAR.mage!.rate).toBe(1.5);
    expect(PW_KITS.gunner!.skills[3]!.cd).toBe(10);
    PW_BALANCE.applyBalance({});
    expect(pwRoleOf("warden")).toBe("warrior");
    expect(PW_KITS.gunner!.skills[3]!.cd).toBe(cd);
  });

  it("새 대결 수치 (병사·포탑·집 보스·몬스터 · 공통 값 · 기간토 · 상점 장비)도 넣고 되돌림", () => {
    const tower = PW_UNIT.tower.hp;
    PW_BALANCE.applyBalance({ pwUnits: { tower: { hp: 2000 }, etc: { vsHero: 0.5 } }, pwShop: { whetstone: { cost: 500 } } });
    expect(PW_UNIT.tower.hp).toBe(2000);
    expect(PW_UNIT.vsHero).toBe(0.5);
    expect(PW_BASIC.whetstone!.cost).toBe(500);
    PW_BALANCE.applyBalance({});
    expect(PW_UNIT.tower.hp).toBe(tower);
    expect(PW_UNIT.vsHero).toBe(0.35);
  });
});
