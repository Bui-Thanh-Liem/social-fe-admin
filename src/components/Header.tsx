import { SidebarTrigger } from "~/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BellRing, AArrowUp } from "lucide-react";
import { Button } from "./ui/button";
import { useLogout } from "~/apis/auth.api";

export function Header() {
  const apiLogout = useLogout();

  //
  function handleLogout() {
    apiLogout.mutateAsync();
  }

  return (
    <header className="w-full h-16 flex items-center justify-between px-4">
      <SidebarTrigger />
      <div className="ml-auto flex items-center justify-end gap-x-8">
        <Button variant="secondary">
          <AArrowUp /> Create New
        </Button>

        <Button variant="outline">
          <AArrowUp /> Create New
        </Button>

        <Button>
          <AArrowUp /> Create New
        </Button>

        <BellRing size={20} />
        <Avatar>
          <AvatarImage src="/favicon.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
