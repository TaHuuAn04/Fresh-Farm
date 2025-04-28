import { HistoryTable } from "./history-table";

export default function HistoryComp() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          History
        </h1>
        <p className="mt-2 text-gray-500">
          View your activity history and records
        </p>
      </div>
      <HistoryTable />
    </div>
  );
}
