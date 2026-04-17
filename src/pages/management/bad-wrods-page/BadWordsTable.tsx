import { EActionBadWord, EPriorityBadWord } from "~/shared/enums/common.enum";
import type { IBadWord } from "~/shared/interfaces/bad-words.interface";
import { ActionBadge, StatusBadge } from "./Badge";
import {
  useDeleteBadWords,
  useGetMultiBadWords,
} from "~/apis/managements/bad-words.api";
import { useState } from "react";
import { BadWordsAction } from "./BadWordsAction";
import { Table_, type Column } from "~/components/Table_";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { ReloadData } from "~/components/ReloadData";
import { useSearchParams } from "react-router-dom";
import { Filter } from "~/components/Filter";
import { Pagination_ } from "~/components/pagination";

export function BadWordsTable() {
  //
  const columns: Column[] = [
    {
      title: "Từ cấm",
      dataIndex: "words",
      width: 250,
      render: (value: string) => <p className="banned-word">{value}</p>,
    },
    {
      title: "Kí tự thay thế",
      dataIndex: "replace_with",
      width: 250,
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
      render: (value: EActionBadWord) => <ActionBadge action={value} />,
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
  const apiDelete = useDeleteBadWords();

  //
  const [editData, setEditData] = useState<IBadWord | undefined>(undefined);

  //
  const { data, refetch, isLoading, isFetching } = useGetMultiBadWords({
    q: q,
    page: page,
    limit: limit,
    qf: JSON.parse(qf),
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
    apiDelete.mutate(record._id);
  };

  return (
    <div>
      {/*  */}
      <Filter
        action={<BadWordsAction editData={editData} _id={editData?._id} />}
        reload={
          <ReloadData
            onClick={() => refetch()}
            isLoading={isLoading || isFetching}
          />
        }
        placeholderSearch="Nhập từ cấm..."
        filters={[
          {
            key: "priority",
            placeholder: "Chọn mức độ",
            values: Object.values(EPriorityBadWord),
          },
          {
            key: "action",
            placeholder: "Chọn hành động",
            values: Object.values(EActionBadWord),
          },
        ]}
        isDateRange={false}
      />

      {/*  */}
      <div className="max-h-[calc(100vh-14.4rem)] overflow-y-auto pr-1 mt-3">
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
        <Pagination_ isCss={false} total={total} total_page={total_page} />
      </div>
    </div>
  );
}
