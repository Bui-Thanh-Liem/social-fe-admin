import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import { EPriorityBadWord } from "~/shared/enums/common.enum";

export function StatusBadge({ status }: { status: EPriorityBadWord }) {
  return (
    <Badge
      className={cn(
        "",
        status === EPriorityBadWord.High
          ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
          : status === EPriorityBadWord.Medium
            ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
            : "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
      )}
    >
      {status}
    </Badge>
  );
}
