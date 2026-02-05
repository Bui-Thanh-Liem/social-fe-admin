import { z } from "zod";

export const LoginAuthDtoSchema = z.object({
  password: z.string().trim().min(1, "Vui lòng nhập mật khẩu"),
  email: z.string().email("Email không hợp lệ"),
});

export type LoginAuthDto = z.infer<typeof LoginAuthDtoSchema>;
