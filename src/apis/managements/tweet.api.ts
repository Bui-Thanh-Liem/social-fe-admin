import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "../call-api.api";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { buildQueryString } from "~/utils/build-query-string.util";
import type { ITweet } from "~/shared/interfaces/tweet.interface";
import type {
  AdminChangeTweetStatusDto,
  AdminRemindTweetDto,
} from "~/shared/dtos/req/tweet.dto";

export const useGetMultiTweets = (queries?: IQuery<ITweet>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["private/tweets", queries?.q, normalizedQueries],
    queryFn: async () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/private/tweets/${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<ITweet>>(url);
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

// 🔐 PATCH - change status tweet
export const useChangeTweetStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      _id,
      body,
    }: {
      _id: string;
      body: AdminChangeTweetStatusDto;
    }) =>
      apiCall<ITweet>(`/private/tweets/change-status/${_id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      // Sau khi tạo bad word thành công thì invalidate cache
      queryClient.invalidateQueries({
        queryKey: ["private/tweets"],
      });
    },
  });
};

// 🔐 PATCH - remind tweet
export const useRemindTweet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ _id, body }: { _id: string; body: AdminRemindTweetDto }) =>
      apiCall<ITweet>(`/private/tweets/remind/${_id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      // Sau khi tạo bad word thành công thì invalidate cache
      queryClient.invalidateQueries({
        queryKey: ["private/tweets"],
      });
    },
  });
};
