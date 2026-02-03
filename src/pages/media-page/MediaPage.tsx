import { useState } from "react";
import { Pagination_ } from "~/components/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import type { IMedia } from "~/shared/interfaces/media.interface";
import { toastSimple } from "~/utils/toast";

function MediaItem({ media }: { media: IMedia }) {
  const { file_type, url } = media;
  const [openDelete, setOpenDelete] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  //
  function handleDelete() {}

  //
  function handleViewDetail() {}

  //
  function handleRemind() {
    toastSimple("Đã gửi nhắc nhở thành công", "success");
  }

  return (
    <>
      <div className="relative">
        {file_type?.includes("video/") ? (
          <video src={url} controls className="select-none" />
        ) : file_type?.includes("image/") ? (
          <img
            loading="lazy"
            src={url}
            alt={media?.file_name}
            className="object-contain select-none"
            onError={(e) => {
              e.currentTarget.src = "/favicon.png";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-400">Định dạng không hỗ trợ</p>
          </div>
        )}
        <div className="absolute bottom-2 left-2 right-2 flex flex-col gap-2 opacity-0 hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            className="w-full"
            onClick={() => setOpenDetail(true)}
          >
            Xem chi tiết
          </Button>
          <Button size="sm" variant="destructive" onClick={handleRemind}>
            Nhắc nhở
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="w-full"
            onClick={() => setOpenDelete(true)}
          >
            Xóa
          </Button>
        </div>
      </div>

      {/*  */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có chắc chắn muốn xóa không?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Vui lòng xác nhận nếu bạn muốn
              tiếp tục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction variant="destructive">Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/*  */}
      <AlertDialog open={openDetail} onOpenChange={setOpenDetail}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có chắc chắn muốn xem chi tiết không?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Chi tiết media sẽ được hiển thị ở đây.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Thoát</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function MediaPage() {
  return (
    <div className="h-full">
      <div className="grid grid-cols-12 gap-4 max-h-[calc(100vh-9rem)] overflow-y-auto pr-1">
        {Array.from({ length: 100 }).map((_, index) => (
          <div key={index} className="rounded overflow-hidden col-span-1">
            <MediaItem
              media={{
                file_type: "image/png",
                file_size: 12345,
                s3_key: `media-${index}`,
                status: 2,
                url: `https://picsum.photos/200/300?random=${index}`,
              }}
            />
          </div>
        ))}
      </div>
      <Pagination_ />
    </div>
  );
}
