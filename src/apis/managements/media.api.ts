import { useQuery } from "@tanstack/react-query";
import { apiCall } from "../callApi.util";
import type { IMedia } from "~/shared/interfaces/media.interface";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { buildQueryString } from "~/utils/buildQueryString";

export const useGetMultiMedia = (queries?: IQuery<IMedia>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["media", queries?.q, normalizedQueries],
    queryFn: async () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/media/${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<IMedia>>(url);
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
