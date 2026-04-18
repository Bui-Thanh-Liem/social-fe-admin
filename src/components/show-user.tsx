import type { IUser } from "~/shared/interfaces/user.interface";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { VerifyIcon } from "./icons/verify";
import { StarPrestige } from "./star";

export function ShowUser({ user }: { user: IUser }) {
  return (
    <div className="flex gap-x-2 items-center">
      <Avatar size="lg">
        <AvatarImage
          className="object-cover"
          src={user?.avatar?.url || "/favicon.png"}
        />
        <AvatarFallback>{user?.name}</AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center gap-x-2">
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline line-clamp-1"
            href={`${import.meta.env.VITE_CLIENT_URL_MAIN}/${user.username}`}
          >
            {user.name}
          </a>
          <VerifyIcon active={!!user.verify} size={20} />
          <StarPrestige count={user?.star || 0} />
        </div>
        <p className="text-gray-400">{user.username}</p>
      </div>
    </div>
  );
}
