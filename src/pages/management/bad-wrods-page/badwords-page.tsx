import { MostUsedTable } from "./most-used-table";
import { BadWordsTable } from "./badwords-table";
import { UserMostUsedTable } from "./user-most-used-table";

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
