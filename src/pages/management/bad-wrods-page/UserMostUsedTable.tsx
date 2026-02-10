import { MoreHorizontalIcon } from "lucide-react";
import { useGetMultiUserViolations } from "~/apis/managements/bad-words.api";
import { ReloadData } from "~/components/ReloadData";
import { Table_, type Column } from "~/components/Table_";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { IUser } from "~/shared/interfaces/user.interface";

export function UserMostUsedTable() {
  //
  const columns: Column[] = [
    {
      title: "Người dùng",
      dataIndex: "user_id",
      width: 100,
      render: (user: IUser) => (
        <div className="flex items-center gap-x-2">
          <Avatar>
            <AvatarImage src="/favicon.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <a
            className="hover:underline"
            href={`${import.meta.env.VITE_CLIENT_URL_MAIN}/${user.username}`}
            target="_blank"
          >
            {user.name}
          </a>
        </div>
      ),
    },
    {
      title: "Từ cấm",
      dataIndex: "final_content",
      width: 100,
      render: (value: string) => <p className="banned-word">{value}</p>,
    },
    {
      title: "Đang hiển thị trong",
      dataIndex: "source",
      width: 100,
      render: (value: string) => <p>{value}</p>,
    },
  ];

  //
  const { data, refetch, isLoading, isFetching } = useGetMultiUserViolations({
    page: "1",
    limit: "50",
  });
  const userViolations = data?.metadata?.items || [];

  //
  function onBlock(user: IUser) {
    console.log("Block user:", user);
  }

  return (
    <div>
      {/*  */}
      <div className="mb-6 flex items-center justify-between pr-3.5">
        <p className="font-bold">Người dùng sử dụng nhiều nhất</p>
        <ReloadData
          onClick={() => refetch()}
          isLoading={isLoading || isFetching}
        />
      </div>

      {/*  */}
      <div className="max-h-[calc(100vh-34rem)] overflow-y-auto pr-1 mt-3">
        <Table_
          columns={columns}
          dataSource={userViolations}
          renderActions={(record) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onBlock(record)}
                >
                  Chặn người dùng
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </div>
    </div>
  );
}
