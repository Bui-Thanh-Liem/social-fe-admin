import { MoreHorizontalIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useGetMultiTweets } from "~/apis/managements/tweet.api";
import { Filter } from "~/components/Filter";
// import { VerifyIcon } from "~/components/icons/verify";
import { Pagination_ } from "~/components/Pagination";
import { ReloadData } from "~/components/ReloadData";
import { Table_, type Column } from "~/components/Table_";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { ETweetStatus } from "~/shared/enums/status.enum";
import type { ICommunity } from "~/shared/interfaces/community.interface";
import type { IMediaBare } from "~/shared/interfaces/media.interface";
import type { ITweet } from "~/shared/interfaces/tweet.interface";
import type { IUser } from "~/shared/interfaces/user.interface";
// import type { IUser } from "~/shared/interfaces/user.interface";
// import { formatDateToDateVN } from "~/utils/date-time";

export function StatusBadge({ status }: { status: ETweetStatus }) {
  return (
    <>
      <Badge
        className={cn(
          "",
          status === ETweetStatus.Ready
            ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
            : status === ETweetStatus.Reject
              ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
              : "bg-black-50 text-black-700 dark:bg-black-950 dark:text-black-300",
        )}
      >
        {status}
      </Badge>
    </>
  );
}

export function TweetPage() {
  //
  const columns: Column[] = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      fixed: "left",
      width: 80,
      render: (value: IMediaBare, record: IUser) => (
        <Avatar>
          <AvatarImage src={value?.url || "/favicon.png"} />
          <AvatarFallback>{record.name}</AvatarFallback>
        </Avatar>
      ),
    },
    {
      title: "Sở hữu",
      dataIndex: "user_id",
      width: 200,
      render: (value: IUser, record: ITweet) => {
        const community = record.community_id as unknown as ICommunity;

        if (!value) return "-";
        return (
          <>
            <Avatar>
              <AvatarImage src={value?.avatar?.url || "/favicon.png"} />
              <AvatarFallback>{value?.name}</AvatarFallback>
            </Avatar>
            <a
              href={community?.slug}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline line-clamp-1"
            >
              {community?.name}
            </a>
          </>
        );
      },
    },
    {
      title: "Hình ảnh và video",
      dataIndex: "medias",
      width: 300,
      render: (value: IMediaBare[] | null) => (
        <div>
          {value && value.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {value.map((media, index) => (
                <div
                  key={index}
                  className="w-16 h-16 border rounded overflow-hidden"
                >
                  {media.file_type?.startsWith("video/") ? (
                    <video
                      src={media.url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={media.url}
                      alt={`media-${index}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <span>-</span>
          )}
        </div>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      render: (value: string) => (
        <Textarea value={value} readOnly placeholder="Không có" />
      ),
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 200,
      render: (value: ETweetStatus) => <StatusBadge status={value} />,
    },
  ];

  //
  const [params] = useSearchParams();
  const { page, limit, q } = {
    q: params.get("q") || "",
    page: params.get("page") || "1",
    limit: params.get("limit") || "50",
  };

  //
  const { data, refetch, isLoading, isFetching } = useGetMultiTweets({
    q,
    page: page,
    limit: limit,
  });
  const tweets = data?.metadata?.items || [];
  const total_page = data?.metadata?.total_page || 0;
  const total = data?.metadata?.total || 0;

  //
  const onEdit = (record: ITweet) => {
    console.log("Edit tweet:", record);
  };

  //
  const onDelete = (record: ITweet) => {
    console.log("Delete tweet:", record);
  };

  return (
    <div>
      {/*  */}
      <Filter
        reload={
          <ReloadData
            onClick={() => refetch()}
            isLoading={isLoading || isFetching}
          />
        }
        placeholderSearch="Nhập nội dung tìm kiếm..."
      />

      {/*  */}
      <div className="max-h-[calc(100vh-13rem)] overflow-y-auto pr-1">
        <Table_
          columns={columns}
          dataSource={tweets}
          renderActions={(record) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(record)}>
                  Nhắc nhở
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => onEdit(record)}>
                  Gỡ bài viết
                </DropdownMenuItem>

                {record.status !== "deleted" && (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete(record)}
                  >
                    Xóa
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </div>

      {/*  */}
      <Pagination_ total={total} total_page={total_page} />
    </div>
  );
}
