import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "../call-api.api";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { buildQueryString } from "~/utils/build-query-string.util";
import type { IUser } from "~/shared/interfaces/user.interface";
import type {
  AdminChangeUserStatusDto,
  AdminRemindUserDto,
} from "~/shared/dtos/req/user.dto";

// 🔐 GET - users
export const useGetMultiUsers = (queries?: IQuery<IUser>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["private/users", queries?.q, normalizedQueries],
    queryFn: async () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/private/users/${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<IUser>>(url);
    },

    //
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: false,
    refetchInterval: false,
    networkMode: "online",
  });
};

// 🔐 PATCH - change status user
export const useChangeUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      _id,
      body,
    }: {
      _id: string;
      body: AdminChangeUserStatusDto;
    }) =>
      apiCall<IUser>(`/private/users/change-status/${_id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      // Sau khi tạo bad word thành công thì invalidate cache
      queryClient.invalidateQueries({
        queryKey: ["private/users"],
      });
    },
  });
};

// 🔐 PATCH - remind user
export const useRemindUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ _id, body }: { _id: string; body: AdminRemindUserDto }) =>
      apiCall<IUser>(`/private/users/remind/${_id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      // Sau khi tạo bad word thành công thì invalidate cache
      queryClient.invalidateQueries({
        queryKey: ["private/users"],
      });
    },
  });
};
