import { ClipboardClock, Eye, Trash } from "lucide-react";
import { useState } from "react";
import { useGetMultiMedia } from "~/apis/managements/media.api";
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
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { EMediaStatus } from "~/shared/enums/status.enum";
import type { IMedia } from "~/shared/interfaces/media.interface";
import type { IUser } from "~/shared/interfaces/user.interface";
import { toastSimple } from "~/utils/toast";

//
function StatusBadge({ status }: { status: EMediaStatus }) {
  if (status === EMediaStatus.Pending) {
    return (
      <Badge className="bg-red-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        Đang chờ duyệt
      </Badge>
    );
  } else if (status === EMediaStatus.Reject) {
    return (
      <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
        Từ chối
      </Badge>
    );
  }

  return (
    <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
      Đang sử dụng
    </Badge>
  );
}

//
function DotBadge({ status }: { status: EMediaStatus }) {
  const color =
    status === EMediaStatus.Pending
      ? "bg-yellow-500"
      : status === EMediaStatus.Reject
        ? "bg-red-500"
        : "bg-green-500";

  return (
    <span className="relative inline-flex">
      {/* vòng toả ra */}
      <span
        className={`absolute inline-flex h-full w-full rounded-full ${color} opacity-75 animate-ping`}
      />
      {/* chấm chính */}
      <span className={`relative inline-flex w-2 h-2 rounded-full ${color}`} />
    </span>
  );
}

function MediaItem({ media }: { media: IMedia }) {
  const { file_type, url, file_name, file_size, status } = media;
  console.log("media :::", media);

  const user = media.user_id as unknown as IUser;
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
      <div className="relative h-full border border-gray-100 rounded-lg">
        {file_type?.includes("video/") ? (
          <video src={url} controls className="select-none" />
        ) : file_type?.includes("image/") ? (
          <img
            loading="lazy"
            src={url}
            alt={media?.file_name}
            className="object-contain select-none h-full w-full"
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
            size="icon"
            variant="outline"
            onClick={() => setOpenDetail(true)}
          >
            <Eye />
          </Button>
          <Button size="icon" variant="destructive" onClick={handleRemind}>
            <ClipboardClock />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            onClick={() => setOpenDelete(true)}
          >
            <Trash />
          </Button>
        </div>
        <div className="absolute -top-1 right-1">
          <DotBadge status={status} />
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
            <AlertDialogTitle>Thông tin chi tiết</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div className="rounded-lg overflow-hidden max-h-96">
                {file_type?.includes("video/") ? (
                  <video src={url} controls className="select-none" />
                ) : file_type?.includes("image/") ? (
                  <img
                    loading="lazy"
                    src={url}
                    alt={media?.file_name}
                    className="object-contain select-none h-full w-full"
                    onError={(e) => {
                      e.currentTarget.src = "/favicon.png";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-400">Định dạng không hỗ trợ</p>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <strong>Tên file:</strong> {file_name}
                </div>
                <div>
                  <strong>Loại file:</strong> {file_type}
                </div>
                <div>
                  <strong>Kích thước file:</strong>{" "}
                  {(file_size / (1024 * 1024)).toFixed(2)} MB
                </div>
                <div>
                  <strong>Trạng thái:</strong> <StatusBadge status={status} />
                </div>
                <div>
                  <strong>Key:</strong> {media.s3_key}
                </div>
                <div className="flex gap-x-3 items-center">
                  <strong>Người tải lên:</strong>{" "}
                  <span className="flex gap-x-3 items-center">
                    {user?.avatar && (
                      <Avatar>
                        <AvatarImage
                          src={user?.avatar.url}
                          alt={user.username}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    )}
                    {user ? user.name || user.username : "N/A"}
                  </span>
                </div>
              </div>
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
  //
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  //
  const { data, isLoading, error } = useGetMultiMedia({
    page: page.toString(),
    limit: limit.toString(),
  });
  const medias = data?.metadata?.items || [];
  const total_page = data?.metadata?.total_page || 0;
  const total = data?.metadata?.total || 0;

  return (
    <div className="h-full">
      <div className="grid grid-cols-10 gap-4 max-h-[calc(100vh-9rem)] overflow-y-auto pr-1">
        {medias.map((media) => (
          <div
            key={media.s3_key}
            className="rounded overflow-hidden col-span-1 h-36"
          >
            <MediaItem media={media} />
          </div>
        ))}
      </div>
      <Pagination_
        total={total}
        total_page={total_page}
        page={page}
        onChangePage={setPage}
        limit={limit}
        onChangeLimit={setLimit}
      />
    </div>
  );
}
