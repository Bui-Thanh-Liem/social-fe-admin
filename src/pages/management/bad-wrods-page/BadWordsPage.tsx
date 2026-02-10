import { MostUsedTable } from "./MostUsedTable";
import { BadWordsTable } from "./BadWordsTable";
import { UserMostUsedTable } from "./UserMostUsedTable";

export function BadWordsPage() {
  return (
    <div className="grid grid-cols-2 gap-x-4">
      <BadWordsTable />
      <div className="space-y-8">
        <MostUsedTable />
        <UserMostUsedTable />
      </div>
    </div>
  );
}
