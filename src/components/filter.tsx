import { useState, type KeyboardEvent, type ReactNode } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "./ui/select";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import type { IQf } from "~/shared/interfaces/common/query.interface";
import type { IUser } from "~/shared/interfaces/user.interface";
import { DatePickerWithRange } from "./ui/date-picker";
import type { DateRange } from "react-day-picker";
import { Button } from "./ui/button";
import { BrushCleaning } from "lucide-react";

interface IFilterField {
  key: string;
  values: string[];
  placeholder: string;
}

interface FilterProps {
  isSearch?: boolean;
  action?: ReactNode;
  reload?: ReactNode;
  placeholderSearch?: string;
  filters?: IFilterField[];
  isDateRange?: boolean;
}

export function Filter({
  action,
  reload,
  filters,
  isSearch = true,
  placeholderSearch,
  isDateRange = true,
}: FilterProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");

  // 1. Lấy giá trị hiện tại từ params để quản lý UI
  const currentQf = params.get("qf");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeFilters: IQf<Record<string, any>>[] = currentQf
    ? JSON.parse(currentQf)
    : [];

  //
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  //
  function handleSearch(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const newParams = new URLSearchParams(params);

      if (searchValue) {
        newParams.set("q", searchValue);
      } else {
        newParams.delete("q");
      }

      navigate({
        pathname,
        search: newParams.toString(),
      });
    }
  }

  //
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleFilter(key: any, val?: string) {
    const newParams = new URLSearchParams(params);

    const current = newParams.get("qf");
    let filters: IQf<IUser>[] = current ? JSON.parse(current) : [];

    filters = filters.filter((f) => f.f !== key);

    if (val && val !== "undefined" && val !== "null") {
      filters.push({ f: key, o: "$eq", v: val });
    }

    if (filters.length) {
      newParams.set("qf", JSON.stringify(filters));
    } else {
      newParams.delete("qf");
    }

    navigate({
      pathname,
      search: newParams.toString(),
    });
  }

  //
  function handleDateRangeChange(date: DateRange | undefined) {
    setDateRange(date);

    const newParams = new URLSearchParams(params);

    if (date?.from) {
      newParams.set("sd", date.from.toISOString());
    } else {
      newParams.delete("sd");
    }

    if (date?.to) {
      newParams.set("ed", date.to.toISOString());
    } else {
      newParams.delete("ed");
    }

    navigate({
      pathname,
      search: newParams.toString(),
    });
  }

  return (
    <div className="flex items-center gap-x-3 p-3 mb-3 rounded-md border bg-slate-50">
      {action}
      {reload}

      {/* Reset Filters */}
      <Button
        onClick={() => {
          setSearchValue("");
          setDateRange(undefined);
          navigate({ pathname, search: "" });
        }}
        variant="secondary"
        className="rounded-full text-red-500 cursor-pointer"
      >
        <BrushCleaning />
      </Button>

      <div className="flex gap-x-4">
        {/* Search */}
        {isSearch && (
          <div className="min-w-40">
            <Input
              placeholder={placeholderSearch || "Nhập..."}
              onKeyDown={handleSearch}
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
            />
          </div>
        )}

        {/* Filters Fields */}
        {filters &&
          filters?.length > 0 &&
          filters?.map((filter) => {
            // Tìm xem filter này có đang được chọn trong URL không
            const activeValue =
              activeFilters.find((f) => f.f === filter.key)?.v || "undefined";

            return (
              <Select
                value={activeValue}
                key={filter.key}
                onValueChange={(val: string) => {
                  handleFilter(filter.key, val);
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={`Chọn ${filter.placeholder}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key={"all"} value={"undefined"}>
                    {filter.placeholder}
                  </SelectItem>
                  {filter.values.map((val) => (
                    <SelectItem key={val} value={val}>
                      {val}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          })}

        {/* Date Range */}
        {isDateRange && (
          <DatePickerWithRange
            value={dateRange}
            onChange={handleDateRangeChange}
          />
        )}
      </div>
    </div>
  );
}
