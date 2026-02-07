import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "~/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { Field, FieldLabel } from "~/components/ui/field";
import { getPaginationPages } from "~/utils/getPaginationPages";
import { cn } from "~/lib/utils";

export interface PaginationProps {
  isCss?: boolean;
  total: number; // tổng số item
  page: number; // trang hiện tại (1-based)
  limit: number; // số item / trang
  total_page: number; // TỔNG SỐ TRANG (backend trả về)
  onChangePage?: (page: number) => void;
  onChangeLimit?: (limit: number) => void;
}

export function Pagination_({
  isCss = true,
  total,
  page,
  limit,
  total_page,
  onChangePage,
  onChangeLimit,
}: PaginationProps) {
  const canPrev = page > 1;
  const canNext = page < total_page;

  const pages = getPaginationPages(page, total_page);

  return (
    <div
      className={cn(
        "fixed right-3 bottom-3 flex items-center justify-end gap-x-4",
        !isCss && "static",
      )}
    >
      {/* ===== SELECT LIMIT ===== */}
      <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="select-rows-per-page">Mục trên trang</FieldLabel>

        <Select
          value={limit.toString()}
          onValueChange={(value) => onChangeLimit?.(Number(value))}
        >
          <SelectTrigger className="w-20" id="select-rows-per-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              {[50, 100, 150, 200].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      {/*  */}
      <FieldLabel htmlFor="select-rows-per-page">Tổng cộng {total}</FieldLabel>

      {/* ===== PAGINATION ===== */}
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          {/* PREVIOUS */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className={
                !canPrev
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:bg-accent"
              }
              onClick={(e) => {
                e.preventDefault();
                if (canPrev) onChangePage?.(page - 1);
              }}
            />
          </PaginationItem>

          {/* PAGE NUMBERS */}
          {pages.map((p, index) =>
            p === "..." ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === page}
                  onClick={(e) => {
                    e.preventDefault();
                    onChangePage?.(p);
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          {/* NEXT */}
          <PaginationItem>
            <PaginationNext
              href="#"
              className={
                !canNext
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:bg-accent"
              }
              onClick={(e) => {
                e.preventDefault();
                if (canNext) onChangePage?.(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
