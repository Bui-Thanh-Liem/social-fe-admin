import { EActionBadWord, EPriorityBadWord } from "~/shared/enums/common.enum";
import type { IBadWord } from "~/shared/interfaces/bad-words.interface";
import { ActionBadge, StatusBadge } from "./Badge";
import {
  useDeleteBadWords,
  useGetMultiBadWords,
} from "~/apis/managements/bad-words.api";
import { useState } from "react";
import { BadWordsAction } from "./BadWordsAction";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Table_, type Column } from "~/components/Table_";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { Pagination_ } from "~/components/Pagination";
import { useDebounce } from "~/hooks/useDebounce";
import { ReloadData } from "~/components/ReloadData";

export function BadWordsTable() {
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
    {
      title: "Hành động",
      dataIndex: "action",
      width: 100,
      render: (value: EActionBadWord) => <ActionBadge action={value} />,
    },
  ];

  //
  const apiDelete = useDeleteBadWords();

  //
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [editData, setEditData] = useState<IBadWord | undefined>(undefined);

  //
  const { data, refetch, isLoading, isFetching } = useGetMultiBadWords({
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

  //
  function onchangeAction(value: EActionBadWord) {
    console.log("Selected action:", value);
  }

  return (
    <div>
      {/*  */}
      <div className="flex items-center gap-x-4 pr-3.5">
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
        <Select value={undefined} onValueChange={onchangeAction}>
          <SelectTrigger className="min-w-30">
            <SelectValue placeholder="Chọn hành động" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(EActionBadWord).map((action) => (
              <SelectItem key={action} value={action}>
                {action}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ReloadData
          onClick={() => refetch()}
          isLoading={isLoading || isFetching}
        />
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
  );
}
