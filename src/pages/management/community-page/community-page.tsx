import { MoreHorizontalIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useGetMultiCommunities } from "~/apis/managements/communities.api";
import { Filter } from "~/components/filter";
import { Pagination_ } from "~/components/pagination";
import { ReloadData } from "~/components/reload-data";
import { ShowCommunity } from "~/components/show-community";
import { ShowUser } from "~/components/show-user";
import { Table_, type Column } from "~/components/table_";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Textarea } from "~/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { EMembershipType, EVisibilityType } from "~/shared/enums/type.enum";
import type { ICommunity } from "~/shared/interfaces/community.interface";
import type { IMediaBare } from "~/shared/interfaces/media.interface";
import type { IUser } from "~/shared/interfaces/user.interface";
import { cn } from "~/utils/cn.util";
import { formatTimeAgo } from "~/utils/date-time.util";

export function CommunityTag({
  text,
  classNameWrap,
  classNameText,
}: {
  text: EVisibilityType | EMembershipType;
  classNameWrap?: string;
  classNameText?: string;
}) {
  const infoMap = {
    [EMembershipType.Open]: "Ai cũng có thể tham gia vào cộng đồng.",
    [EMembershipType.Invite_only]: "Chỉ những người được mời có thể tham gia.",
    [EVisibilityType.Public]: "Ai cũng có thể xem nội dung trong cộng đồng.",
    [EVisibilityType.Private]: "Chỉ thành viên có thể xem nội dung (bài viết).",
  } as const;

  let _private = false;
  if (
    text === EVisibilityType.Private ||
    text === EMembershipType.Invite_only
  ) {
    _private = true;
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className={cn(
            "px-1 bg-gray-50/85 border inline-block rounded-2xl",
            _private ? "border-orange-400" : "border-green-400",
            classNameWrap,
          )}
        >
          <p
            className={cn(
              "text-[10px] font-medium",
              _private ? "text-orange-400" : "text-green-400",
              classNameText,
            )}
          >
            {text}
          </p>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{infoMap[text]}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function CommunityPage() {
  //
  const columns: Column[] = [
    {
      title: "Quản trị viên",
      dataIndex: "admin",
      width: 80,
      render: (user: IUser) => {
        if (!user) return "-";
        return <ShowUser user={user} />;
      },
    },
    {
      title: "Ảnh bìa - Tên",
      dataIndex: "cover",
      fixed: "left",
      width: 80,
      render: (_value: IMediaBare, record: ICommunity) => (
        <ShowCommunity community={record} />
      ),
    },
    {
      title: "Hiển thị - loại cộng đồng",
      dataIndex: "visibility_type",
      width: 50,
      render: (_value: IMediaBare, record: ICommunity) => (
        <div className="space-x-3">
          <CommunityTag text={record.visibility_type} />
          <CommunityTag text={record.membership_type} />
        </div>
      ),
    },
    {
      title: "Số lượng thành viên",
      dataIndex: "admin",
      width: 50,
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
      title: "Bio",
      dataIndex: "bio",
      width: 80,
      render: (value: string) => (
        <Textarea value={value} readOnly placeholder="Không có" />
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      width: 30,
      render: (value: Date) => (
        <span>{formatTimeAgo(value as unknown as string)}</span>
      ),
    },
  ];

  //
  const [params] = useSearchParams();
  const { page, limit, q, qf, ed, sd } = {
    q: params.get("q") || "",
    page: params.get("page") || "1",
    qf: params.get("qf") || "[]",
    limit: params.get("limit") || "50",
    ed: params.get("ed") || undefined,
    sd: params.get("sd") || undefined,
  };

  //
  const { data, refetch, isLoading, isFetching } = useGetMultiCommunities({
    q: q,
    ed: ed,
    sd: sd,
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
