import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { useGetMultiCommunities } from "~/apis/managements/communities.api";
import { Filter } from "~/components/Filter";
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
import type { ICommunity } from "~/shared/interfaces/community.interface";
import type { IMediaBare } from "~/shared/interfaces/media.interface";

export function CommunityPage() {
  //
  const columns: Column[] = [
    {
      title: "Ảnh bìa",
      dataIndex: "cover",
      fixed: "left",
      width: 100,
      render: (value: IMediaBare, record: ICommunity) => (
        <img
          className="h-10 w-12 rounded"
          src={value?.url || "/favicon.png"}
          alt={record.name}
        />
      ),
    },
    {
      title: "Tên cộng đồng",
      dataIndex: "name",
      width: 200,
    },
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
      title: "Nội dung",
      dataIndex: "content",
      width: 200,
      render: (value: string) => <p className="line-clamp-1">{value || "-"}</p>,
    },
  ];

  //
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  //
  const { data } = useGetMultiCommunities({
    page: page.toString(),
    limit: limit.toString(),
  });
  const communities = data?.metadata?.items || [];
  const total_page = data?.metadata?.total_page || 0;
  const total = data?.metadata?.total || 0;

  //
  const onEdit = (record: ICommunity) => {
    console.log("Edit community:", record);
  };

  //
  const onDelete = (record: ICommunity) => {
    console.log("Delete community:", record);
  };

  return (
    <div>
      {/*  */}
      <Filter />

      {/*  */}
      <div className="max-h-[calc(100vh-13rem)] overflow-y-auto pr-1">
        <Table_
          columns={columns}
          dataSource={communities}
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
