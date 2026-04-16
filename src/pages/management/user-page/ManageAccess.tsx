import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useChangeUserStatus } from "~/apis/managements/user.api";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "~/components/ui/dialog";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  adminChangeUserStatusDtoSchema,
  type AdminChangeUserStatusDto,
} from "~/shared/dtos/req/user.dto";
import { EUserStatus } from "~/shared/enums/status.enum";
import type { IUser } from "~/shared/interfaces/user.interface";
import { useAdminStore } from "~/stores/useAdminStore";
import { cn } from "~/utils/cn.util";

const manageAccessReasons = {
  [EUserStatus.Active]: {
    reason: "Mở khóa",
    className: "text-green-500",
  },
  [EUserStatus.Block]: {
    reason: "Khóa",
    className: "text-red-500",
  },
  [EUserStatus.Hidden]: {
    reason: "Ẩn",
    className: "text-red-500",
  },
};

export function ManageAccess({
  record,
  status,
}: {
  record: IUser;
  status: EUserStatus;
}) {
  //
  const { admin } = useAdminStore();

  // Tính toán trạng thái mới và lý do mặc định dựa trên trạng thái hiện tại của người dùng
  const reason = `${admin?.name || "Admin"} ${manageAccessReasons[status]?.reason} tài khoản`;

  //
  const [open, setOpen] = useState(false);

  //
  const apiChangeUserStatus = useChangeUserStatus();

  //
  const form = useForm<AdminChangeUserStatusDto>({
    resolver: zodResolver(adminChangeUserStatusDtoSchema),
    defaultValues: {
      status: status,
      reason: reason,
    },
  });

  //
  const onSubmit = async (data: AdminChangeUserStatusDto) => {
    const res = await apiChangeUserStatus.mutateAsync({
      _id: record._id,
      body: {
        status: status,
        reason: data.reason || reason,
      },
    });

    if ([200, 201].includes(res.statusCode)) setOpen(false);
  };

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault(); // Ngăn Dropdown đóng ngay lập tức làm ảnh hưởng Dialog
          setOpen(true);
        }}
        className={cn(manageAccessReasons[status]?.className)}
      >
        {manageAccessReasons[status]?.reason} tài khoản
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
              name="reason"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>
                    Lý do
                    <span
                      className={cn(
                        "text-sm",
                        manageAccessReasons[status]?.className,
                      )}
                    >
                      {` ${manageAccessReasons[status]?.reason} tài khoản`}
                    </span>
                  </FieldLabel>
                  <Input {...field} placeholder="Nhập lý do" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <DialogFooter className="mt-6">
              <DialogClose
                asChild
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                <Button type="button" variant="outline">
                  Huỷ
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className={cn(
                  manageAccessReasons[status]?.className,
                  "bg-transparent border hover:bg-gray-100",
                )}
              >
                {manageAccessReasons[status]?.reason} tài khoản
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
