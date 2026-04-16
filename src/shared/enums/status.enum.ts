export enum EMediaStatus {
  Pending = "Chờ duyệt",
  Reject = "Từ chối",
  Active = "Đang sử dụng",
}

export enum EAuthVerifyStatus {
  Unverified,
  Verified,
  Banned,
}

export enum ETweetStatus {
  Pending = "Chờ duyệt",
  Reject = "Từ chối",
  Ready = "Sẵn sàng",
}

export enum EInvitationStatus {
  Pending,
  Accepted,
}

export enum EUserStatus {
  Block = "Đã khoá",
  Hidden = "Đã ẩn", // Người dùng vẫn tồn tại nhưng không hiển thị trên hệ thống
  Active = "Đang sử dụng",
}
