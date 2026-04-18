import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

import { EActionBadWord, EPriorityBadWord } from "~/shared/enums/common.enum";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useEffect, useState } from "react";
import {
  useCreateBadWords,
  useUpdateBadWords,
} from "~/apis/managements/bad-words.api";
import {
  ActionBadWordDtoSchema,
  type ActionBadWordDto,
} from "~/shared/dtos/req/badword.dto";

interface BadWordsActionProps {
  _id?: string;
  editData?: ActionBadWordDto;
}

export function BadWordsAction({ _id, editData }: BadWordsActionProps) {
  //
  const [open, setOpen] = useState(false); // Quản lý trạng thái Dialog

  //
  const apiCreate = useCreateBadWords();
  const apiUpdate = useUpdateBadWords();

  //
  const form = useForm<ActionBadWordDto>({
    resolver: zodResolver(ActionBadWordDtoSchema),
    defaultValues: {
      words: "",
      replace_with: "",
      priority: EPriorityBadWord.Low,
      action: EActionBadWord.Warn,
    },
  });

  //
  useEffect(() => {
    if (editData) {
      form.reset(editData);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
    }
  }, [editData]);

  //
  function onSubmit(data: ActionBadWordDto) {
    if (editData && _id) {
      apiUpdate.mutate({ _id, body: data });
    } else {
      apiCreate.mutate(data);
    }
    setOpen(false); // Đóng dialog
    form.reset(); // Reset form
  }

  //
  function onCancel() {
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full w-9 h-9">
          <Plus size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        {/* Đưa form vào trong Content */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {editData ? "Chỉnh sửa từ cấm" : "Tạo từ cấm mới"}
            </DialogTitle>
            <DialogDescription>
              Vui lòng nhập thông tin từ cấm bên dưới để tạo mới.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Controller
              name="words"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Từ cấm</FieldLabel>
                  <Input {...field} placeholder="Nhập từ cấm" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="replace_with"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Từ thay thế</FieldLabel>
                  <Input {...field} placeholder="Nhập từ thay thế" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="priority"
              control={form.control}
              render={({ field }) => (
                <Field orientation="responsive">
                  <FieldLabel>Mức độ ưu tiên</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="min-w-30">
                      <SelectValue placeholder="Chọn mức độ" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(EPriorityBadWord).map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <Controller
              name="action"
              control={form.control}
              render={({ field }) => (
                <Field orientation="responsive">
                  <FieldLabel>Hành động</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="min-w-30">
                      <SelectValue placeholder="Chọn hành động" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(EActionBadWord).map((action) => (
                        <SelectItem key={action} value={action}>
                          {action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild onClick={onCancel}>
              <Button type="button" variant="outline">
                Huỷ
              </Button>
            </DialogClose>
            <Button type="submit">Tạo mới</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
