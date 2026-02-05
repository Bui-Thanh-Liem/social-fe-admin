import { MoreHorizontalIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { cn } from "~/lib/utils";

/* ================= TYPES ================= */

export interface Column {
  title: string;
  dataIndex: string;
  width?: number | string;
  maxWidth?: number | string;
  ellipsis?: boolean;
  fixed?: "left" | "right";
  render?: (value: any, record: any, index: number) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  dataSource: any[];
  rowKey?: string;
  renderActions?: (record: any, index: number) => React.ReactNode;
}

/* ================= HELPERS ================= */

const toCssSize = (v?: number | string) =>
  typeof v === "number" ? `${v}px` : v;

const getValue = (record: any, dataIndex: string) =>
  dataIndex.split(".").reduce((acc, key) => acc?.[key], record);

/* ================= COMPONENT ================= */

export function Table_({
  columns,
  dataSource,
  rowKey = "id",
  renderActions,
}: TableProps) {
  const hasAction = !!renderActions;

  return (
    <div className="relative overflow-x-auto">
      <Table className="table-fixed w-full">
        {/* ================= HEADER ================= */}
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={`${col.dataIndex}-${col.title}`}
                style={{
                  width: toCssSize(col.width),
                  maxWidth: toCssSize(col.maxWidth),
                }}
                className={cn(
                  col.fixed === "left" && "sticky left-0 z-20 bg-background",
                  col.fixed === "right" && "sticky right-0 z-20 bg-background",
                )}
              >
                {col.title}
              </TableHead>
            ))}

            {hasAction && (
              <TableHead className="text-right sticky right-0 z-20 bg-background w-[80px]">
                Hành động
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        {/* ================= BODY ================= */}
        <TableBody>
          {dataSource.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length + (hasAction ? 1 : 0)}
                className="text-center text-muted-foreground"
              >
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}

          {dataSource.map((record, rowIndex) => {
            const key = record[rowKey] ?? rowIndex;

            return (
              <TableRow key={key}>
                {columns.map((col) => {
                  const value = getValue(record, col.dataIndex);

                  return (
                    <TableCell
                      key={col.dataIndex}
                      style={{
                        width: toCssSize(col.width),
                        maxWidth: toCssSize(col.maxWidth),
                      }}
                      className={cn(
                        col.ellipsis && "truncate",
                        col.fixed === "left" &&
                          "sticky left-0 z-10 bg-background",
                        col.fixed === "right" &&
                          "sticky right-0 z-10 bg-background",
                      )}
                      title={
                        col.ellipsis && typeof value === "string"
                          ? value
                          : undefined
                      }
                    >
                      {col.render
                        ? col.render(value, record, rowIndex)
                        : value || "-"}
                    </TableCell>
                  );
                })}

                {/* ================= ACTION (DYNAMIC) ================= */}
                {hasAction && (
                  <TableCell className="text-right sticky right-0 z-10 bg-background">
                    {renderActions ? (
                      renderActions(record, rowIndex)
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <MoreHorizontalIcon />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive">
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
