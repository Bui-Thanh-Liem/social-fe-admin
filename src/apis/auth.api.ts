import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { LoginAuthDto } from "~/shared/dtos/req/auth.dto";
import type {
  ResActive2Fa,
  ResLogin,
  ResVerify2Fa,
} from "~/shared/dtos/res/auth.dto";
import type { IAdmin } from "~/shared/interfaces/admin.interface";
import { useAdminStore } from "~/stores/useAdminStore";
import { apiCall } from "./callApi.api";
import { deleteStorageClient } from "~/utils/deleteStoredClient";

// 🔐 POST - Login
export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginAuthDto) =>
      apiCall<ResLogin>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    onSuccess: (_) => {
      if (_.statusCode === 200) {
        // Kiểm tra xem có phải lần đầu đăng nhập hay không, nếu có thì chuyển đến trang thiết lập 2FA
        if (_.metadata?.two_factor_enabled === false) {
          navigate(`/setup-2fa?admin_id=${_.metadata?.admin_id}`, {
            replace: true,
          });
        }
      }
    },
  });
};

// 🔐 POST - Logout
export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () =>
      apiCall("/auth/logout", {
        method: "POST",
      }),
    onSuccess: (data) => {
      if (data.statusCode === 200) {
        // Lưu token
        deleteStorageClient();
        setTimeout(() => {
          console.log('navigate("/login", { replace: true });');
          navigate("/login", { replace: true });
        }, 1000);
      }
    },
  });
};

// 🚪 POST - Setup f2a
export const useSetup2Fa = () => {
  return useMutation({
    mutationFn: (credentials: { _id: string }) =>
      apiCall<{ secret: string; qrCodeUrl: string }>(
        `/auth/2fa/setup/${credentials._id}`,
        {
          method: "POST",
        },
      ),
    onSuccess: () => {},
  });
};

// 🚪 POST - Active f2a
export const useActive2Fa = () => {
  return useMutation({
    mutationFn: (credentials: { token: string; _id: string }) =>
      apiCall<ResActive2Fa>(`/auth/2fa/active/${credentials._id}`, {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    onSuccess: () => {},
  });
};

// 🚪 POST - Verify f2a
export const useVerify2Fa = () => {
  const getMe = useGetMe();
  const { setAdmin } = useAdminStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: { token: string; _id: string }) =>
      apiCall<ResVerify2Fa>(`/auth/2fa/verify/${credentials._id}`, {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    onSuccess: (data) => {
      console.log("verify 2fa response:", data);

      if (data.statusCode === 200) {
        if (data.metadata?.two_factor_session_enabled) {
          // Lưu token
          localStorage.setItem("access_token", data.metadata?.token || "");

          // Nếu đăng nhập thành công thì gọi api getMe lưu vào Store global
          (async () => {
            const resGetMe = await getMe.mutateAsync();
            console.log("resGetMe:", resGetMe);

            if (resGetMe.statusCode === 200 && resGetMe?.metadata) {
              setAdmin(resGetMe.metadata);
              navigate("/", { replace: true });
            }
          })();
        }
      }
    },
  });
};

// 🚪 GET - Get Me
export const useGetMe = () => {
  return useMutation({
    mutationFn: () => apiCall<IAdmin>("/auth/me", { method: "GET" }),
    onSuccess: () => {},
  });
};
