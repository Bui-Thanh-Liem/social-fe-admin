import { useQuery } from "@tanstack/react-query";
import { apiCall } from "../callApi.util";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { buildQueryString } from "~/utils/buildQueryString";
import type { IUser } from "~/shared/interfaces/user.interface";
import type { ITweet } from "~/shared/interfaces/tweet.interface";

export const useGetMultiTweets = (queries?: IQuery<IUser>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["admin", "tweets", queries?.q, normalizedQueries],
    queryFn: async () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/admin/tweets/${queryString ? `?${queryString}` : ""}`;
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
