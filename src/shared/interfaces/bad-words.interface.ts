import { EPriorityBadWord } from "~/shared/enums/common.enum";
import type { IBase } from "./base.interface";

export interface IBadWord extends IBase {
  words: string;
  priority: EPriorityBadWord;
  replace_with: string;
  count: number;
}
