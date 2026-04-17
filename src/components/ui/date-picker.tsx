"use client";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { Field } from "./field";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Calendar } from "./calendar";

interface DatePickerWithRangeProps {
  value: DateRange | undefined;
  onChange: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  value,
  onChange,
}: DatePickerWithRangeProps) {
  // const [date, setDate] = React.useState<DateRange | undefined>({
  //   from: new Date(new Date().getFullYear(), 0, 20),
  //   to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  // });

  return (
    <Field className="mx-auto w-60">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-range"
            className="justify-start px-2.5 font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {/* Sử dụng { locale: vi } để format tháng/năm sang Tiếng Việt */}
                  {format(value.from, "dd/MM/yyyy", { locale: vi })} -{" "}
                  {format(value.to, "dd/MM/yyyy", { locale: vi })}
                </>
              ) : (
                format(value.from, "dd/MM/yyyy", { locale: vi })
              )
            ) : (
              <span>Chọn khoảng ngày</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
            locale={vi}
            formatters={{
              formatWeekdayName: (date) => {
                const days = ["CN", "2", "3", "4", "5", "6", "7"];
                return days[date.getDay()];
              },
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
