import { ESourceViolation } from "~/shared/enums/common.enum";
import type { IBase } from "./base.interface";

export interface IUserViolation extends IBase {
  user_id: string;

  bad_word_ids: string[]; // chỉ các từ bị dính trong LẦN NÀY
  final_content: string;

  source: ESourceViolation;
  source_id: string;
}
