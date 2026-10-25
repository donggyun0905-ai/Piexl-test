import type { Lang } from "../i18n";

export interface PatchNote {
  version: string;
  date: string;
  items: Record<Lang, string[]>;
}
