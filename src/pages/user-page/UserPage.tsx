import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { useGetMultiUsers } from "~/apis/managements/user.api";
import { VerifyIcon } from "~/components/icons/verify";
import { Pagination_ } from "~/components/pagination";
import { Table_, type Column } from "~/components/Table_";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Textarea } from "~/components/ui/textarea";
import type { IMediaBare } from "~/shared/interfaces/media.interface";
import type { IUser } from "~/shared/interfaces/user.interface";
import { formatDateToDateVN } from "~/utils/date-time";

export function UserPage() {
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
      title: "Ảnh bìa",
      dataIndex: "cover_photo",
      fixed: "left",
      width: 100,
      render: (value: IMediaBare, record: IUser) => (
        <img
          className="h-10 w-12 rounded"
          src={value?.url || "/favicon.png"}
          alt={record.name}
        />
      ),
    },
    {
      title: "Tên người dùng",
      dataIndex: "name",
      render: (value: boolean, record: IUser) => (
        <div className="flex items-center gap-x-2">
          {value} <VerifyIcon active={!!record.verify} size={20} />
        </div>
      ),
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 200,
      render: (value: string) => <p className="line-clamp-1">{value}</p>,
    },
    {
      title: "Ngày sinh",
      dataIndex: "day_of_birth",
      render: (value: string) => <p>{formatDateToDateVN(new Date(value))}</p>,
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
      title: "Địa điểm",
      dataIndex: "location",
    },
    {
      title: "Website",
      dataIndex: "website",
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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  //
  const { data, isLoading, error } = useGetMultiUsers({
    page: page.toString(),
    limit: limit.toString(),
  });
  const users = data?.metadata?.items || [];
  const total_page = data?.metadata?.total_page || 0;
  const total = data?.metadata?.total || 0;

  //
  const onEdit = (record: IUser) => {
    console.log("Edit user:", record);
  };

  //
  const onDelete = (record: IUser) => {
    console.log("Delete user:", record);
  };

  return (
    <div>
      <div className="max-h-[calc(100vh-9rem)] overflow-y-auto pr-1">
        <Table_
          columns={columns}
          dataSource={users}
          renderActions={(record) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(record)}>
                  Chỉnh sửa
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => onEdit(record)}>
                  Khoá tài khoản
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
