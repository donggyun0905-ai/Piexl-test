import { describe, expect, it } from "vitest";
import { PW_BALANCE } from "./balance";
import { PW_CHAR } from "./paewangBalance";
import { PW_KITS } from "./pwKits";
import { pwRoleOf } from "./pwRoles";

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
});
