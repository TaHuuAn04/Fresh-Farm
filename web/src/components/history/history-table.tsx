"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Define the data type for history records
type HistoryRecord = {
  id: string;
  stt: number;
  content: string;
  timestamp: Date;
  severity: "low" | "medium" | "high" | "critical";
};

// Sample data (unchanged)
const data: HistoryRecord[] = [
  {
    id: "1",
    stt: 1,
    content: "System update completed",
    timestamp: new Date("2025-04-25T14:30:00"),
    severity: "low",
  },
  {
    id: "2",
    stt: 2,
    content: "New user registered",
    timestamp: new Date("2025-04-24T10:15:00"),
    severity: "low",
  },
  {
    id: "3",
    stt: 3,
    content: "Failed login attempt",
    timestamp: new Date("2025-04-23T18:45:00"),
    severity: "medium",
  },
  {
    id: "4",
    stt: 4,
    content: "Database backup failed",
    timestamp: new Date("2025-04-22T22:10:00"),
    severity: "high",
  },
  {
    id: "5",
    stt: 5,
    content: "Security breach detected",
    timestamp: new Date("2025-04-21T03:25:00"),
    severity: "critical",
  },
  {
    id: "6",
    stt: 6,
    content: "Server maintenance completed",
    timestamp: new Date("2025-04-20T09:00:00"),
    severity: "low",
  },
  {
    id: "7",
    stt: 7,
    content: "API rate limit exceeded",
    timestamp: new Date("2025-04-19T16:30:00"),
    severity: "medium",
  },
  {
    id: "8",
    stt: 8,
    content: "Data synchronization error",
    timestamp: new Date("2025-04-18T11:45:00"),
    severity: "high",
  },
  {
    id: "9",
    stt: 9,
    content: "New feature deployed",
    timestamp: new Date("2025-04-17T14:20:00"),
    severity: "low",
  },
  {
    id: "10",
    stt: 10,
    content: "User permissions updated",
    timestamp: new Date("2025-04-16T08:50:00"),
    severity: "medium",
  },
];

// Helper function to get severity badge
const getSeverityBadge = (severity: HistoryRecord["severity"]) => {
  const variants = {
    low: "bg-green-100 text-green-800 hover:bg-green-100",
    medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    high: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    critical: "bg-red-100 text-red-800 hover:bg-red-100",
  };

  return (
    <Badge className={`px-2 py-1 ${variants[severity]}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </Badge>
  );
};

// Define table columns
const columns: ColumnDef<HistoryRecord>[] = [
  {
    accessorKey: "stt",
    header: "STT",
    cell: ({ row }) => <div className="text-center">{row.getValue("stt")}</div>,
  },
  {
    accessorKey: "content",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Content
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("content")}</div>,
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent whitespace-nowrap"
        >
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const timestamp = row.getValue("timestamp") as Date;
      return (
        <div className="whitespace-nowrap">
          {format(timestamp, "dd/MM/yyyy HH:mm")}
        </div>
      );
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "severity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Severity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const severity = row.getValue("severity") as HistoryRecord["severity"];
      return (
        <div className="flex justify-center">{getSeverityBadge(severity)}</div>
      );
    },
  },
];

export function HistoryTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter content..."
          value={(table.getColumn("content")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("content")?.setFilterValue(event.target.value)
          }
          className="max-w-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="rounded-md border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-gray-200 hover:bg-gray-50 text-center"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-3 text-sm text-gray-700"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-gray-500">
          {table.getFilteredRowModel().rows.length} record(s) total
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
