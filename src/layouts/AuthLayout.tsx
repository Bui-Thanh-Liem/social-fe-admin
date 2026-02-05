import { Logo } from "../components/Logo";
import { useForm } from "react-hook-form";
import { InputMain } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { useLogin } from "~/apis/auth.api";
import type { LoginAuthDto } from "~/shared/dtos/req/auth.dto";
import { handleResponse } from "~/utils/toast";

export function AuthLayout() {
  //
  const apiLogin = useLogin();

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
    handleResponse(res);
  }

  return (
    <div className="flex min-h-screen bg-black">
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
        </CardContent>
      </Card>
    </div>
  );
}
