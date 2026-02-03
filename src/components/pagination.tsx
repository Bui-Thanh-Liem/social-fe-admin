import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Field, FieldLabel } from "./ui/field";

export function Pagination_() {
  // Giả sử logic quản lý state (thực tế bạn sẽ dùng từ URL hoặc useState)
  const [pageSize, setPageSize] = React.useState("10");

  return (
    <div className="fixed right-3 bottom-3 flex items-center justify-end gap-x-4">
      {/* PHẦN 1: CHỌN SỐ ITEM TRÊN 1 TRANG */}
      <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="select-rows-per-page">mục trên trang</FieldLabel>
        <Select defaultValue="25">
          <SelectTrigger className="w-20" id="select-rows-per-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      {/* PHẦN 2: ĐIỀU HƯỚNG TRANG (PAGINATION) */}
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            {/* Sử dụng component gốc, text "Trước" sẽ được sửa trong file ui/pagination.tsx hoặc truyền trực tiếp nếu bạn đã tùy biến */}
            <PaginationPrevious
              href="#"
              className="hover:bg-accent cursor-pointer"
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href="#">10</PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              href="#"
              className="hover:bg-accent cursor-pointer"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
