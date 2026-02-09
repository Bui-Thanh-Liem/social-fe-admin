import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { useGetMultiBadWordMostUsed } from "~/apis/managements/bad-words.api";
import { Pagination_ } from "~/components/Pagination";
import { Table_, type Column } from "~/components/Table_";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { EPriorityBadWord } from "~/shared/enums/common.enum";
import { StatusBadge } from "./StatusBadge";

export function MostUsed() {
  //
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  //
  //
  const columns: Column[] = [
    {
      title: "Từ cấm",
      dataIndex: "words",
      width: 150,
      render: (value: string) => <p className="banned-word">{value}</p>,
    },
    {
      title: "Kí tự thay thế",
      dataIndex: "replace_with",
      width: 150,
    },
    {
      title: "Mức độ",
      dataIndex: "priority",
      width: 100,
      render: (value: EPriorityBadWord) => <StatusBadge status={value} />,
    },
  ];

  //
  const { data } = useGetMultiBadWordMostUsed({
    page: page.toString(),
    limit: limit.toString(),
  });
  const badWords = data?.metadata?.items || [];
  const total_page = data?.metadata?.total_page || 0;
  const total = data?.metadata?.total || 0;

  return (
    <div>
      {/*  */}
      <div className="max-h-[calc(100vh-16rem)] overflow-y-auto pr-1 mt-3">
        <Table_
          columns={columns}
          dataSource={badWords}
          renderActions={(record) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {}}>
                  Chỉnh sửa
                </DropdownMenuItem>

                {record.status !== "deleted" && (
                  <DropdownMenuItem variant="destructive" onClick={() => {}}>
                    Xóa
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </div>

      {/*  */}
      <div className="py-3">
        <Pagination_
          isCss={false}
          total={total}
          total_page={total_page}
          page={page}
          onChangePage={setPage}
          limit={limit}
          onChangeLimit={setLimit}
        />
      </div>
    </div>
  );
}
