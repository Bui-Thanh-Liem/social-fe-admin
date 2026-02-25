import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { LoginAuthDto } from "~/shared/dtos/req/auth.dto";
import type { ResLogin } from "~/shared/dtos/res/auth.dto";
import type { IAdmin } from "~/shared/interfaces/admin.interface";
import { useAdminStore } from "~/stores/useAdminStore";
import { apiCall } from "./callApi.util";

// 🔐 POST - Login
export const useLogin = () => {
  const getMe = useGetMe();
  const { setAdmin } = useAdminStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginAuthDto) =>
      apiCall<ResLogin>("/admin/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    onSuccess: (data) => {
      if (data.statusCode === 200) {
        // Lưu token
        localStorage.setItem("access_token", data.metadata?.access_token || "");
        localStorage.setItem(
          "refresh_token",
          data.metadata?.refresh_token || "",
        );

        // Nếu đăng nhập thành công thì gọi api getMe lưu vào Store global
        (async () => {
          const resGetMe = await getMe.mutateAsync();
          if (resGetMe.statusCode === 200 && resGetMe?.metadata) {
            setAdmin(resGetMe.metadata);
          }

          // Kiểm tra xem có phải lần đầu đăng nhập hay không, nếu có thì chuyển đến trang thiết lập 2FA
          if (resGetMe.metadata?.twoFactorEnabled === false) {
            navigate("/setup-2fa", {
              replace: true,
            });
          }
        })();

        //
        // navigate("/", { replace: true });
      }
    },
  });
};

// 🚪 POST - Setup f2a
export const useSetup2Fa = () => {
  return useMutation({
    mutationFn: (credentials: { _id: string; email: string }) =>
      apiCall<{ secret: string; qrCodeUrl: string }>("/admin/2fa/setup", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    onSuccess: () => {},
  });
};

// 🚪 POST - Active f2a
export const useActive2Fa = () => {
  return useMutation({
    mutationFn: (credentials: { token: string }) =>
      apiCall("/admin/2fa/active", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    onSuccess: () => {},
  });
};

// 🚪 GET - Get Me
export const useGetMe = () => {
  return useMutation({
    mutationFn: () => apiCall<IAdmin>("/admin/me", { method: "GET" }),
    onSuccess: () => {},
  });
};
