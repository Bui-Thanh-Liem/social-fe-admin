import z from "zod";
import { EPriorityBadWord } from "~/shared/enums/common.enum";

export const ActionBadWordDtoSchema = z.object({
  words: z
    .string()
    .min(1, "Vui lòng nhập từ")
    .max(50, "Tối đa 50 kí tự")
    .trim(),
  replace_with: z
    .string()
    .min(1, "Vui lòng nhập từ thay thế")
    .max(50, "Tối đa 50 kí tự")
    .trim(),
  priority: z.nativeEnum(EPriorityBadWord),
});

export type ActionBadWordDto = z.infer<typeof ActionBadWordDtoSchema>;
