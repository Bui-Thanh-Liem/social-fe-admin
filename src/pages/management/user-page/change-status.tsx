import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useChangeUserStatus } from "~/apis/managements/user.api";
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
  adminChangeUserStatusDtoSchema,
  type AdminChangeUserStatusDto,
} from "~/shared/dtos/req/user.dto";
import { EUserStatus } from "~/shared/enums/status.enum";
import type { IUser } from "~/shared/interfaces/user.interface";
import { useAdminStore } from "~/storage/use-admin.storage";
import { cn } from "~/utils/cn.util";

const manageAccessReasons: Record<
  EUserStatus,
  { reason: string; className: string }
> = {
  [EUserStatus.Active]: {
    reason: "Hoạt động",
    className: "text-green-500",
  },
  [EUserStatus.Block]: {
    reason: "Khóa",
    className: "text-red-500",
  },
  [EUserStatus.Hidden]: {
    reason: "Ẩn danh",
    className: "text-gray-500",
  },
};

export function ChangeStatus({ record }: { record: IUser }) {
  const { admin } = useAdminStore();
  const [open, setOpen] = useState(false);
  const apiChangeUserStatus = useChangeUserStatus();

  // Khởi tạo form giống hệt bên ChangeStatus của Tweet
  const form = useForm<AdminChangeUserStatusDto>({
    resolver: zodResolver(adminChangeUserStatusDtoSchema),
    defaultValues: {
      status: record.status.status,
      reason: "",
    },
  });

  const statusState = form.watch("status");

  // Cập nhật lý do mẫu khi status trong Select thay đổi
  useEffect(() => {
    if (open) {
      const actionText =
        manageAccessReasons[statusState]?.reason || statusState;
      form.setValue(
        "reason",
        `${admin?.name || "Admin"} thay đổi trạng thái người dùng thành ${actionText}`,
      );
    }
  }, [statusState, open, admin?.name, form]);

  const onSubmit = async (data: AdminChangeUserStatusDto) => {
    const res = await apiChangeUserStatus.mutateAsync({
      _id: record._id,
      body: {
        status: data.status,
        reason: data.reason,
      },
    });

    if ([200, 201].includes(res.statusCode)) setOpen(false);
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thay đổi trạng thái người dùng</DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* 1. Phần chọn Status tương tự Tweet */}
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Trạng thái mới</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(EUserStatus).map((val) => (
                        <SelectItem key={val} value={val}>
                          <span
                            className={cn(manageAccessReasons[val]?.className)}
                          >
                            {manageAccessReasons[val]?.reason}
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

            {/* 2. Phần nhập lý do */}
            <Controller
              name="reason"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>
                    Lý do
                    <span
                      className={cn(
                        "ml-2 text-sm font-normal",
                        manageAccessReasons[statusState]?.className,
                      )}
                    >
                      ({manageAccessReasons[statusState]?.reason})
                    </span>
                  </FieldLabel>
                  <Input {...field} placeholder="Nhập lý do thay đổi" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <DialogFooter className="mt-6 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Huỷ
              </Button>
              <Button
                type="submit"
                disabled={apiChangeUserStatus.isPending}
                className={cn(
                  "text-white min-w-[120px]",
                  statusState === EUserStatus.Active
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700",
                )}
              >
                {apiChangeUserStatus.isPending ? "Đang lưu..." : "Cập nhật"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
