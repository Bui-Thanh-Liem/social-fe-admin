import { SidebarTrigger } from "~/components/ui/sidebar";
import { AvatarMain } from "./ui/avatar";
import { BellRing, AArrowUp } from "lucide-react";
import { ButtonMain } from "./ui/button";

function ButtonHeader({
  icon,
  text,
  variant,
}: {
  icon: React.ReactNode;
  text: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
}) {
  return (
    <ButtonMain size="sm" className="rounded-md" variant={variant}>
      {icon} {text}
    </ButtonMain>
  );
}

export function Header() {
  return (
    <header className="w-full h-16 flex items-center justify-between px-4">
      <SidebarTrigger />
      <div className="ml-auto flex items-center justify-end gap-x-8">
        <ButtonHeader
          icon={<AArrowUp />}
          text="Create New"
          variant="secondary"
        />
        <ButtonHeader icon={<AArrowUp />} text="Create New" variant="outline" />
        <ButtonHeader icon={<AArrowUp />} text="Create New" />
        <BellRing size={24} />
        <AvatarMain src="" alt="liem" />
      </div>
    </header>
  );
}
