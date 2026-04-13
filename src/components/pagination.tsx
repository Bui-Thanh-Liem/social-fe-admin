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
import { cn } from "~/utils/cn.util";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export interface PaginationProps {
  isCss?: boolean;
  total: number; // tổng số item
  total_page: number; // TỔNG SỐ TRANG (backend trả về)
}

export function Pagination_({
  isCss = true,
  total,
  total_page,
}: PaginationProps) {
  //
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { page, limit } = {
    page: Number(params.get("page") || 1),
    limit: Number(params.get("limit") || 50),
  };

  //
  const canPrev = page > 1;
  const canNext = page < total_page;
  const pages = getPaginationPages(page, total_page);

  //
  function handleChangePage(page: number) {
    const newParams = new URLSearchParams(params);

    if (page) {
      newParams.set("page", page.toString());
    } else {
      newParams.delete("page");
    }

    navigate({
      pathname,
      search: newParams.toString(),
    });
  }

  //
  function handleChangeLimit(limit: number) {
    const newParams = new URLSearchParams(params);

    if (page) {
      newParams.set("limit", limit.toString());
    } else {
      newParams.delete("limit");
    }

    navigate({
      pathname,
      search: newParams.toString(),
    });
  }

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
          onValueChange={(value) => handleChangeLimit(Number(value))}
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
                if (canPrev) handleChangePage(page - 1);
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
                    handleChangePage(p);
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
                if (canNext) handleChangePage(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
