import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import {
  useDeleteBadWords,
  useGetMultiBadWords,
} from "~/apis/managements/bad-words.api";
import { Pagination_ } from "~/components/Pagination";
import { Table_, type Column } from "~/components/Table_";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { IBadWord } from "~/shared/interfaces/bad-words.interface";
import { BadWordsAction } from "./BadWordsAction";
import { EPriorityBadWord } from "~/shared/enums/common.enum";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { useDebounce } from "~/hooks/useDebounce";

//
function StatusBadge({ status }: { status: EPriorityBadWord }) {
  return (
    <Badge
      className={cn(
        "",
        status === EPriorityBadWord.High
          ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
          : status === EPriorityBadWord.Medium
            ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
            : "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
      )}
    >
      {status}
    </Badge>
  );
}

export function BadWordsPage() {
  //
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 800);

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
  const apiDelete = useDeleteBadWords();

  //
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [editData, setEditData] = useState<IBadWord | undefined>(undefined);

  //
  const { data } = useGetMultiBadWords({
    page: page.toString(),
    limit: limit.toString(),
    q: debouncedSearchValue,
  });
  const badWords = data?.metadata?.items || [];
  const total_page = data?.metadata?.total_page || 0;
  const total = data?.metadata?.total || 0;

  //
  const onEdit = (record: IBadWord) => {
    setEditData(record);
  };

  //
  const onDelete = (record: IBadWord) => {
    console.log("Delete bad word:", record);
    apiDelete.mutate(record._id);
  };

  //
  function onchangePriority(value: EPriorityBadWord) {
    console.log("Selected priority:", value);
  }

  return (
    <div className="grid grid-cols-3 gap-x-4">
      <div>
        {/*  */}
        <div className="flex items-center gap-x-4">
          <BadWordsAction editData={editData} _id={editData?._id} />
          <Input
            placeholder="Nhập từ"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Select value={undefined} onValueChange={onchangePriority}>
            <SelectTrigger className="min-w-30">
              <SelectValue placeholder="Chọn mức độ" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(EPriorityBadWord).map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/*  */}
        <div className="max-h-[calc(100vh-13rem)] overflow-y-auto pr-1 mt-3">
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
                  <DropdownMenuItem onClick={() => onEdit(record)}>
                    Chỉnh sửa
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
      <div className="border rounded-md p-3">
        <p className="mb-2">Bị sử dụng gần đây nhất</p>
        <hr />
      </div>
      <div className="border rounded-md p-3">
        <p className="mb-2">Người dùng sử dụng nhiều nhất</p>
        <hr />
      </div>
    </div>
  );
}
