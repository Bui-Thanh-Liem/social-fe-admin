import { MoreHorizontalIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useGetMultiCommunities } from "~/apis/managements/communities.api";
import { Filter } from "~/components/Filter";
import { Pagination_ } from "~/components/Pagination";
import { ReloadData } from "~/components/ReloadData";
import { ShowCommunity } from "~/components/ShowCommunity";
import { ShowUser } from "~/components/ShowUser";
import { Table_, type Column } from "~/components/Table_";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Textarea } from "~/components/ui/textarea";
import type { ICommunity } from "~/shared/interfaces/community.interface";
import type { IMediaBare } from "~/shared/interfaces/media.interface";
import type { IUser } from "~/shared/interfaces/user.interface";

export function CommunityPage() {
  //
  const columns: Column[] = [
    {
      title: "Quản trị viên",
      dataIndex: "admin",
      width: 40,
      render: (user: IUser) => {
        if (!user) return "-";
        return <ShowUser user={user} />;
      },
    },
    {
      title: "Số lượng thành viên",
      dataIndex: "admin",
      width: 30,
      render: (user: IUser, record: ICommunity) => {
        if (!user) return "-";
        return (
          <div>
            <p>{record.member_count}</p>
          </div>
        );
      },
    },
    {
      title: "Ảnh bìa - Tên",
      dataIndex: "cover",
      fixed: "left",
      width: 60,
      render: (_value: IMediaBare, record: ICommunity) => (
        <ShowCommunity community={record} />
      ),
    },
    {
      title: "Bio",
      dataIndex: "bio",
      width: 100,
      render: (value: string) => (
        <Textarea value={value} readOnly placeholder="Không có" />
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
  const { data, refetch, isLoading, isFetching } = useGetMultiCommunities({
    q: q,
    page: page,
    limit: limit,
    qf: JSON.parse(qf),
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
      <Filter
        placeholderSearch="Nhập tên"
        reload={
          <ReloadData
            onClick={() => refetch()}
            isLoading={isLoading || isFetching}
          />
        }
      />

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
      <Pagination_ total={total} total_page={total_page} />
    </div>
  );
}
