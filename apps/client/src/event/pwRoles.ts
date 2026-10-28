// 패왕전 역할군 화면 글자 (밴픽 탭·캐릭터 옆 노란 글씨, 마우스를 올리면 설명). 누가 어느 역할인지는 공용 pwRoles (관리자에서 옮김)
import { PW_ROLE_IDS, pwRoleOf, type PwRoleId } from "@pixel-rogue/shared";
import type { TextKey } from "../i18n";

export type PwRole = PwRoleId;
export const PW_ROLES = PW_ROLE_IDS;
export const roleOf = pwRoleOf;

/** 역할 이름 (탭·캐릭터 옆) · 마우스를 올리면 나오는 설명 */
export const ROLE_TAG: Record<PwRole, TextKey> = { warrior: "pwRoleWarrior", ranged: "pwRoleRanged", mage: "pwRoleMage", assassin: "pwRoleAssassin", support: "pwRoleSupport" };
export const ROLE_TIP: Record<PwRole, TextKey> = { warrior: "pwRoleWarriorTip", ranged: "pwRoleRangedTip", mage: "pwRoleMageTip", assassin: "pwRoleAssassinTip", support: "pwRoleSupportTip" };
