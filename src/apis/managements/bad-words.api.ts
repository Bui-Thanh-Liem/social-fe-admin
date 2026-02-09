import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "../callApi.util";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { buildQueryString } from "~/utils/buildQueryString";
import type { IBadWord } from "~/shared/interfaces/bad-words.interface";
import type { ActionBadWordDto } from "~/shared/dtos/req/badword.dto";

// 🔐 POST - bad words
export const useCreateBadWords = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ActionBadWordDto) =>
      apiCall<IBadWord>("/bad-words", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      // Sau khi tạo bad word thành công thì invalidate cache
      queryClient.invalidateQueries({
        queryKey: ["admin", "bad-words"],
      });
    },
  });
};

// 🔐 PATCH - bad words
export const useUpdateBadWords = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ _id, body }: { body: ActionBadWordDto; _id: string }) =>
      apiCall<IBadWord>(`/bad-words/${_id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      // Sau khi tạo bad word thành công thì invalidate cache
      queryClient.invalidateQueries({
        queryKey: ["admin", "bad-words"],
      });
    },
  });
};

// ❌ DELETE - bad words
export const useDeleteBadWords = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bad_word_id: string) =>
      apiCall<IBadWord>(`/bad-words/${bad_word_id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      // Sau khi xóa bad word thành công thì invalidate cache
      queryClient.invalidateQueries({
        queryKey: ["admin", "bad-words"],
      });
    },
  });
};

// 🚪 GET - bad words
export const useGetMultiBadWords = (queries?: IQuery<IBadWord>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["admin", "bad-words", queries?.q, normalizedQueries],
    queryFn: async () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/bad-words/${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<IBadWord>>(url);
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

// 🚪 GET - bad words most used
export const useGetMultiBadWordMostUsed = (queries?: IQuery<IBadWord>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["admin", "bad-words", queries?.q, normalizedQueries],
    queryFn: async () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/bad-words/most-used${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<IBadWord>>(url);
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
