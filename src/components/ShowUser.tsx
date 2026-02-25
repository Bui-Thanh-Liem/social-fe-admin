import type { IUser } from "~/shared/interfaces/user.interface";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { VerifyIcon } from "./icons/verify";

export function ShowUser({ user }: { user: IUser }) {
  return (
    <div className="flex gap-x-2 items-center">
      <Avatar>
        <AvatarImage src={user?.avatar?.url || "/favicon.png"} />
        <AvatarFallback>{user?.name}</AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center gap-x-2">
          <a
            href={user.username}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline line-clamp-1"
          >
            {user.name}
          </a>
          <VerifyIcon active={!!user.verify} size={20} />
        </div>
        <p className="text-gray-400">{user.username}</p>
      </div>
    </div>
  );
}
