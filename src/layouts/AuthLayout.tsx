import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useForm } from "react-hook-form";
import { InputMain } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export function AuthLayout() {
  // OAUTH
  const [params] = useSearchParams();
  const status = params.get("s") || "";

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

  // Handle OAuth login/signup
  useEffect(() => {
    async function onLoginOAuthSuccess() {
      const access_token = params.get("access_token") || "";
      const refresh_token = params.get("refresh_token") || "";

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      // Nếu đăng nhập thành công thì gọi api getMe lưu vào Store global
      // const resGetMe = await getMe.mutateAsync();

      //
      // if (resGetMe.statusCode === 200 && resGetMe?.metadata) {
      // setUser(resGetMe.metadata);
      // }
    }
    if (["login", "signup"].includes(status)) onLoginOAuthSuccess();
  }, [status]);

  //
  function onClickForgotPass() {
    // setOpenFormRegister(true);
  }

  //
  function onSubmit() {
    // const res = await apiLogin.mutateAsync(data);
    // handleResponse(res, successForm);
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
