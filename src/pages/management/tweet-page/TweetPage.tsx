import { MoreHorizontalIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useGetMultiTweets } from "~/apis/managements/tweet.api";
import { EditorCodeItem } from "~/components/EditorCode";
import { Filter } from "~/components/Filter";
import { Pagination_ } from "~/components/pagination";
import { ReloadData } from "~/components/ReloadData";
import { Table_, type Column } from "~/components/Table_";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/utils/cn.util";
import { ETweetStatus } from "~/shared/enums/status.enum";
import type { ICommunity } from "~/shared/interfaces/community.interface";
import type { IMediaBare } from "~/shared/interfaces/media.interface";
import type { ITweet } from "~/shared/interfaces/tweet.interface";
import type { IUser } from "~/shared/interfaces/user.interface";
import { motion } from "framer-motion";
import { ShowUser } from "~/components/ShowUser";
import { ShowCommunity } from "~/components/ShowCommunity";
import { formatTimeAgo } from "~/utils/date-time";

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
              : "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
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
      title: "Người dùng - Cộng đồng",
      dataIndex: "user_id",
      width: 250,
      render: (user: IUser, record: ITweet) => {
        const community = record.community_id as unknown as ICommunity;

        if (!user) return "-";
        return (
          <div className="space-y-2">
            <ShowUser user={user} />
            <ShowCommunity community={community} />
          </div>
        );
      },
    },
    {
      title: "Hình ảnh và video",
      dataIndex: "medias",
      width: 200,
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
      title: "Nội dung - Code",
      dataIndex: "content",
      render: (value: string, tweet: ITweet) => {
        return (
          <div className="space-y-2">
            <Textarea value={value} readOnly placeholder="Không có" />
            <motion.div layout className="my-2 flex gap-2 flex-wrap">
              {tweet?.codes &&
                tweet.codes?.length &&
                tweet.codes?.map((codeItem) => (
                  <EditorCodeItem
                    readonly
                    key={codeItem._id}
                    code={codeItem.code}
                    langKey={codeItem.langKey}
                    onClose={() => {}}
                    onChangeCode={() => {}}
                  />
                ))}
            </motion.div>
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 200,
      render: (value: ETweetStatus) => <StatusBadge status={value} />,
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      width: 200,
      render: (value: Date) => (
        <span>{formatTimeAgo(value as unknown as string)}</span>
      ),
    },
  ];

  //
  const [params] = useSearchParams();
  const { page, limit, q, qf } = {
    q: params.get("q") || "",
    page: params.get("page") || "1",
    qf: params.get("qf") || "[]",
    limit: params.get("limit") || "50",
  };

  //
  const { data, refetch, isLoading, isFetching } = useGetMultiTweets({
    q,
    page: page,
    limit: limit,
    qf: JSON.parse(qf),
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
        filters={[
          {
            key: "status",
            placeholder: "Trạng thái",
            values: Object.values(ETweetStatus),
          },
        ]}
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
