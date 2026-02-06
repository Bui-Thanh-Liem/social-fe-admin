import { RotateCcw } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

export function ReloadData({
  onClick,
  isLoading,
}: {
  onClick?: () => void;
  isLoading?: boolean;
}) {
  return (
    <Button
      variant="outline"
      className="rounded-full w-9 h-9 cursor-pointer"
      onClick={onClick}
    >
      <RotateCcw className={cn(isLoading && "animate-spin")} />
    </Button>
  );
}
