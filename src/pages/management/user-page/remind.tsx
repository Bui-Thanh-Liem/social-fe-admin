import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRemindUser } from "~/apis/managements/user.api";
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
  adminRemindUserDtoSchema,
  type AdminRemindUserDto,
} from "~/shared/dtos/req/user.dto";
import type { IUser } from "~/shared/interfaces/user.interface";
import { useAdminStore } from "~/storage/use-admin.storage";

export function Remind({ record }: { record: IUser }) {
  //
  const { admin } = useAdminStore();

  // Lý do mặc định khi nhắc nhở người dùng
  const reason = `${admin?.name || "Admin"} nhắc nhở tài khoản`;

  //
  const [open, setOpen] = useState(false);

  //
  const apiRemindUser = useRemindUser();

  //
  const form = useForm<AdminRemindUserDto>({
    resolver: zodResolver(adminRemindUserDtoSchema),
    defaultValues: {
      reason: reason,
    },
  });

  //
  const onSubmit = async (data: AdminRemindUserDto) => {
    const res = await apiRemindUser.mutateAsync({
      _id: record._id,
      body: {
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
      >
        Nhắc nhở
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
              name="reason"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Lý do</FieldLabel>
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
              <Button type="submit">Nhắc nhở</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
