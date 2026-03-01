import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLogin, useVerify2Fa } from "~/apis/auth.api";
import { Logo } from "~/components/Logo";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Field, FieldLabel } from "~/components/ui/field";
import { InputMain } from "~/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import type { LoginAuthDto } from "~/shared/dtos/req/auth.dto";
import { handleResponse } from "~/utils/toast";

export function LoginPage() {
  //
  const [isOpenVerify2Fa, setIsOpenVerify2Fa] = useState(false);
  const [adminId, setAdminId] = useState("");
  const apiLogin = useLogin();
  const apiVerifyF2a = useVerify2Fa();

  //
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    email: string;
    password: string;
  }>({
    // resolver: zodResolver(LoginUserDtoSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //
  function onClickForgotPass() {
    // setOpenFormRegister(true);
  }

  //
  async function onSubmit(data: LoginAuthDto) {
    const res = await apiLogin.mutateAsync(data);
    if (res.statusCode === 200 && !res.metadata?.two_factor_session_enabled) {
      setIsOpenVerify2Fa(true);
      setAdminId(res.metadata?.admin_id || "");
    }
    handleResponse(res);
  }

  //
  function onSubmitVerifyF2a(value: string) {
    // Gửi token OTP mà admin nhập vào để xác thực 2FA
    if (value.length !== 6) {
      return;
    }
    apiVerifyF2a.mutateAsync({ token: value, _id: adminId }).then((res) => {
      handleResponse(res);
    });
  }

  return (
    <Card className="m-auto">
      <CardContent>
        <div className="flex items-center justify-center">
          <Logo />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center justify-center"
        >
          <div className="mt-4 space-y-6 w-full md:min-w-115">
            <InputMain
              id="email"
              name="email"
              sizeInput="lg"
              label="Email"
              errors={errors}
              control={control}
              register={register}
              placeholder="example@gmail.com"
            />

            <InputMain
              id="password"
              name="password"
              sizeInput="lg"
              label="Mật khẩu"
              errors={errors}
              type="password"
              control={control}
              register={register}
              placeholder="Nhập mật khẩu của bạn"
            />

            <Button type="submit" size="lg" className="w-full">
              Tiếp theo
            </Button>
            <Button
              size="lg"
              className="w-full"
              variant="outline"
              onClick={() => onClickForgotPass()}
            >
              Quên mật khẩu ?
            </Button>
          </div>
        </form>
        {isOpenVerify2Fa ? (
          <Field className="w-fit">
            <FieldLabel htmlFor="digits-only">Digits Only</FieldLabel>
            <InputOTP
              maxLength={6}
              id="digits-only"
              pattern={REGEXP_ONLY_DIGITS}
              onChange={onSubmitVerifyF2a}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </Field>
        ) : null}
      </CardContent>
    </Card>
  );
}
