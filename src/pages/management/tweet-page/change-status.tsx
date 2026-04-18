import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useChangeTweetStatus } from "~/apis/managements/tweet.api";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  adminChangeTweetStatusDtoSchema,
  type AdminChangeTweetStatusDto,
} from "~/shared/dtos/req/tweet.dto";
import { ETweetStatus } from "~/shared/enums/status.enum";
import type { ITweet } from "~/shared/interfaces/tweet.interface";
import { useAdminStore } from "~/storage/use-admin.storage";
import { cn } from "~/utils/cn.util";

const manageAccessReasons: Record<
  ETweetStatus,
  { reason: string; className: string }
> = {
  [ETweetStatus.Ready]: {
    reason: "Duyệt",
    className: "text-green-600",
  },
  [ETweetStatus.Pending]: {
    reason: "Chờ xử lý",
    className: "text-yellow-600",
  },
  [ETweetStatus.Reject]: {
    reason: "Từ chối",
    className: "text-red-600",
  },
};

export function ChangeStatus({ record }: { record: ITweet }) {
  const { admin } = useAdminStore();
  const [open, setOpen] = useState(false);
  const apiChangeTweetStatus = useChangeTweetStatus();

  // Khởi tạo form
  const form = useForm<AdminChangeTweetStatusDto>({
    resolver: zodResolver(adminChangeTweetStatusDtoSchema),
    defaultValues: {
      status: record.status,
      reason: "",
    },
  });

  const statusState = form.watch("status");

  // Tự động cập nhật lý do mẫu khi status thay đổi
  useEffect(() => {
    if (open) {
      const actionText =
        manageAccessReasons[statusState]?.reason || statusState;
      form.setValue(
        "reason",
        `${admin?.name || "Admin"} đã đổi trạng thái thành: ${actionText}`,
      );
    }
  }, [statusState, open, admin?.name, form]);

  const onSubmit = async (data: AdminChangeTweetStatusDto) => {
    try {
      const res = await apiChangeTweetStatus.mutateAsync({
        _id: record._id,
        body: {
          status: data.status,
          reason: data.reason,
        },
      });

      if ([200, 201].includes(res.statusCode)) {
        setOpen(false);
      }
    } catch (error) {
      console.error("Update status failed:", error);
    }
  };

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        Thay đổi trạng thái
      </DropdownMenuItem>

      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) form.reset();
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái bài viết</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            {/* Field Status */}
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Trạng thái mới</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ETweetStatus).map((val) => (
                        <SelectItem key={val} value={val}>
                          <span
                            className={cn(manageAccessReasons[val]?.className)}
                          >
                            {val}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Field Reason */}
            <Controller
              name="reason"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>
                    Lý do
                    <span
                      className={cn(
                        "ml-2 text-xs font-normal",
                        manageAccessReasons[statusState]?.className,
                      )}
                    >
                      ({manageAccessReasons[statusState]?.reason})
                    </span>
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="Nhập lý do cụ thể..."
                    className="focus-visible:ring-1"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Huỷ
              </Button>
              <Button
                type="submit"
                disabled={apiChangeTweetStatus.isPending}
                className={cn(
                  "min-w-[100px]",
                  statusState === ETweetStatus.Ready &&
                    "bg-green-600 hover:bg-green-700",
                  statusState === ETweetStatus.Reject &&
                    "bg-red-600 hover:bg-red-700",
                  statusState === ETweetStatus.Pending &&
                    "bg-yellow-600 hover:bg-yellow-700",
                )}
              >
                {apiChangeTweetStatus.isPending ? "Đang lưu..." : "Xác nhận"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
