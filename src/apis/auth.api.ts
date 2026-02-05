import { useMutation } from "@tanstack/react-query";
import { apiCall } from "./callApi.util";
import type { IAdmin } from "~/shared/interfaces/admin.interface";
import { useAdminStore } from "~/stores/useAdminStore";
import { useNavigate } from "react-router-dom";
import type { LoginAuthDto } from "~/shared/dtos/req/auth.dto";
import type { ResLogin } from "~/shared/dtos/res/auth.dto";

// 🔐 POST - Login
export const useLogin = () => {
  const getMe = useGetMe();
  const { setAdmin } = useAdminStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginAuthDto) =>
      apiCall<ResLogin>("/auth/login-admin", {
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
        })();

        //
        navigate("/", { replace: true });
      }
    },
  });
};

// 🚪 GET - Get Me
export const useGetMe = () => {
  return useMutation({
    mutationFn: () => apiCall<IAdmin>("/auth/me-admin", { method: "GET" }),
    onSuccess: () => {},
  });
};
