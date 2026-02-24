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

interface IFilterField {
  key: string;
  values: string[];
  placeholder: string;
}

interface FilterProps {
  action?: ReactNode;
  reload?: ReactNode;
  placeholderSearch?: string;
  filters?: IFilterField[];
}

export function Filter({
  action,
  reload,
  filters,
  placeholderSearch,
}: FilterProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");

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

  return (
    <div className="flex items-center gap-x-3 p-3 mb-3 rounded-md border bg-slate-50">
      {action}
      {reload}
      <div className="flex gap-x-4">
        {/* Search */}
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

        {/* Filters Fields */}
        {filters &&
          filters?.length > 0 &&
          filters?.map((filter) => (
            <Select
              key={filter.key}
              onValueChange={(val: string) => {
                handleFilter(filter.key, val);
              }}
            >
              <SelectTrigger className="w-full w-48">
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
          ))}
      </div>
    </div>
  );
}
