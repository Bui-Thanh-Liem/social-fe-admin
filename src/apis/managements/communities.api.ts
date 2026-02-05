import { useQuery } from "@tanstack/react-query";
import { apiCall } from "../callApi.util";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { buildQueryString } from "~/utils/buildQueryString";
import type { ICommunity } from "~/shared/interfaces/community.interface";

export const useGetMultiCommunities = (queries?: IQuery<ICommunity>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["admin", "communities", queries?.q, normalizedQueries],
    queryFn: async () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/admin/communities/${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<ICommunity>>(url);
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
