import { useGetMultiBadWordMostUsed } from "~/apis/managements/bad-words.api";
import { Table_, type Column } from "~/components/Table_";
import type { EPriorityBadWord } from "~/shared/enums/common.enum";
import { StatusBadge } from "./Badge";
import { ReloadData } from "~/components/ReloadData";

export function MostUsedTable() {
  //
  const columns: Column[] = [
    {
      title: "Từ cấm",
      dataIndex: "words",
      width: 150,
      render: (value: string) => <p className="banned-word">{value}</p>,
    },
    {
      title: "Số lần sử dụng",
      dataIndex: "usage_count",
      width: 100,
      render: (value: string) => <p>{value}</p>,
    },
    {
      title: "Mức độ",
      dataIndex: "priority",
      width: 100,
      render: (value: EPriorityBadWord) => <StatusBadge status={value} />,
    },
  ];

  //
  const { data, refetch, isLoading, isFetching } = useGetMultiBadWordMostUsed({
    page: "1",
    limit: "50",
  });
  const badWords = data?.metadata?.items || [];

  return (
    <div>
      {/*  */}
      <div className="mb-6 flex items-center justify-between pr-3.5">
        <p className="font-bold">Sử dụng nhiều nhất</p>
        <ReloadData
          onClick={() => refetch()}
          isLoading={isLoading || isFetching}
        />
      </div>

      {/*  */}
      <div className="max-h-[calc(100vh-34rem)] overflow-y-auto pr-1 mt-3">
        <Table_ columns={columns} dataSource={badWords} />
      </div>
    </div>
  );
}
