import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { useGetMultiTweets } from "~/apis/managements/tweet.api";
import { Filter } from "~/components/Filter";
// import { VerifyIcon } from "~/components/icons/verify";
import { Pagination_ } from "~/components/Pagination";
import { Table_, type Column } from "~/components/Table_";
// import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { IMediaBare } from "~/shared/interfaces/media.interface";
import type { ITweet } from "~/shared/interfaces/tweet.interface";
// import type { IUser } from "~/shared/interfaces/user.interface";
// import { formatDateToDateVN } from "~/utils/date-time";

export function TweetPage() {
  //
  const columns: Column[] = [
    // {
    //   title: "Avatar",
    //   dataIndex: "avatar",
    //   fixed: "left",
    //   width: 80,
    //   render: (value: IMediaBare, record: IUser) => (
    //     <Avatar>
    //       <AvatarImage src={value?.url || "/favicon.png"} />
    //       <AvatarFallback>{record.name}</AvatarFallback>
    //     </Avatar>
    //   ),
    // },
    {
      title: "Hình ảnh và video",
      dataIndex: "medias",
      width: 100,
      render: (value: IMediaBare[] | null) => (
        <div>
          {value && value.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {value.map((media, index) => (
                <div
                  key={index}
                  className="w-16 h-16 border rounded overflow-hidden"
                >
                  {media.s3_key?.startsWith("video/") ? (
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
      width: 200,
      render: (value: string) => <p className="line-clamp-1">{value}</p>,
    },
  ];

  //
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  //
  const { data } = useGetMultiTweets({
    page: page.toString(),
    limit: limit.toString(),
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
      <Filter />

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
      <Pagination_
        total={total}
        total_page={total_page}
        page={page}
        onChangePage={setPage}
        limit={limit}
        onChangeLimit={setLimit}
      />
    </div>
  );
}
