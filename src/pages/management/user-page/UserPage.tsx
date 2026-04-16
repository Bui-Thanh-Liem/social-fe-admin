import { MoreHorizontalIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useGetMultiUsers } from "~/apis/managements/user.api";
import { Filter } from "~/components/Filter";
import { Pagination_ } from "~/components/pagination";
import { ReloadData } from "~/components/ReloadData";
import { ShowUser } from "~/components/ShowUser";
import { Table_, type Column } from "~/components/Table_";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/utils/cn.util";
import { EUserStatus } from "~/shared/enums/status.enum";
import type { IMediaBare } from "~/shared/interfaces/media.interface";
import type { IUser, IUserStatus } from "~/shared/interfaces/user.interface";
import { formatDateToDateVN } from "~/utils/date-time";
import { ManageAccess } from "./ManageAccess";
import { Remind } from "./Remind";

export function StatusBadge({ status }: Pick<IUserStatus, "status">) {
  return (
    <>
      <Badge
        className={cn(
          "",
          status === EUserStatus.Active
            ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
            : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
        )}
      >
        {status}
      </Badge>
    </>
  );
}

export function UserPage() {
  //
  const columns: Column[] = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      fixed: "left",
      width: 250,
      render: (_value: IMediaBare, record: IUser) => <ShowUser user={record} />,
    },
    {
      title: "Ảnh bìa",
      dataIndex: "cover_photo",
      fixed: "left",
      render: (value: IMediaBare, record: IUser) => (
        <img
          className="h-10 w-12 rounded"
          src={value?.url || "/favicon.png"}
          alt={record.name}
        />
      ),
    },
    {
      title: "Email và ngày sinh",
      dataIndex: "email",
      width: 250,
      render: (value: string, user: IUser) => (
        <div>
          <p className="line-clamp-1">{value}</p>
          <p>{formatDateToDateVN(new Date(user.day_of_birth))}</p>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 250,
      render: (value: IUserStatus) => (
        <div>
          <StatusBadge status={value.status} />
          {value.reason && <p className="pl-2 line-clamp-2">{value.reason}</p>}
        </div>
      ),
    },
    {
      title: "Tiểu sử",
      dataIndex: "bio",
      width: 250,
      render: (value: string) => (
        <Textarea value={value} readOnly placeholder="Chưa có" />
      ),
    },
    {
      title: "Vị trí",
      dataIndex: "location",
      width: 200,
    },
    {
      title: "Website",
      dataIndex: "website",
      width: 200,
      render: (value: string) => {
        if (!value) return "-";
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline line-clamp-1"
          >
            {value}
          </a>
        );
      },
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
  const { data, refetch, isLoading, isFetching } = useGetMultiUsers({
    q: q,
    page: page,
    limit: limit,
    qf: JSON.parse(qf),
  });
  const users = data?.metadata?.items || [];
  const total_page = data?.metadata?.total_page || 0;
  const total = data?.metadata?.total || 0;

  return (
    <div>
      {/*  */}
      <Filter
        placeholderSearch="Nhập tên người dùng"
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
            values: Object.values(EUserStatus),
          },
        ]}
      />

      {/*  */}
      <div className="max-h-[calc(100vh-13rem)] overflow-y-auto pr-1">
        <Table_
          columns={columns}
          dataSource={users}
          renderActions={(record: IUser) => {
            const statusRest = Object.values(EUserStatus).filter(
              (status) => status !== record.status.status,
            );

            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <Remind record={record} />
                  {statusRest.map((status) => (
                    <ManageAccess
                      key={status}
                      record={record}
                      status={status}
                    />
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }}
        />
      </div>

      {/*  */}
      <Pagination_ total={total} total_page={total_page} />
    </div>
  );
}
