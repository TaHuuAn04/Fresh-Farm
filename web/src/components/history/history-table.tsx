"use client";

import { useEffect, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { format, parseISO } from "date-fns";

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
import { getNotifications } from "@/api/notification.api";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { appearSpinner, disappearSpinner } from "@/redux/slices/spinnerSlice";
import { Notification } from "@/utils/constant";

type Severity = "low" | "medium" | "high" | "critical";

export interface NotificationData {
  id: string;
  content: string;
  severity: Severity;
  time: string;
  stt: number;
  createdAt?: string;
  updatedAt?: string;
  userId: string;
}

const variants: Record<Severity, string> = {
  low: "bg-green-100 text-green-800 hover:bg-green-100",
  medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  high: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  critical: "bg-red-100 text-red-800 hover:bg-red-100",
};

const getSeverityBadge = (severity: Severity) => (
  <Badge className={`px-2 py-1 ${variants[severity]}`}>
    {severity.charAt(0).toUpperCase() + severity.slice(1)}
  </Badge>
);

/* ------------------------------------------------------------------
 * Table columns
 * ------------------------------------------------------------------*/

const columns: ColumnDef<NotificationData>[] = [
  {
    accessorKey: "stt",
    header: "STT",
    cell: ({ row }) => <div className="text-center">{row.getValue("stt")}</div>,
  },
  {
    accessorKey: "content",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 hover:bg-transparent flex items-center"
      >
        Content
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("content")}</div>,
  },
  {
    accessorKey: "time",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 hover:bg-transparent whitespace-nowrap flex items-center"
      >
        Time
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const iso = row.getValue<string>("time");
      if (!iso) return "-";
      const date = parseISO(iso);
      return (
        <div className="whitespace-nowrap">
          {format(date, "dd/MM/yyyy HH:mm")}
        </div>
      );
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "severity",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 hover:bg-transparent flex items-center"
      >
        Severity
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const severity = row.getValue<Severity>("severity");
      return (
        <div className="flex justify-center">{getSeverityBadge(severity)}</div>
      );
    },
  },
];

export function HistoryTable() {
  const dispatch = useDispatch();
  const [data, setData] = useState<NotificationData[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Fetch
  useEffect(() => {
    const firstFetch = async (): Promise<void> => {
      dispatch(appearSpinner());
      const result = await getNotifications();

      if (result && result.status > 299) {
        toast("Failure", { description: "Fail to get notifications" });
        dispatch(disappearSpinner());
        return;
      }

      if (!result) return;

      const temp: NotificationData[] = (result?.data?.data).map(
        (item: Notification, idx: number) => ({
          id: item.id,
          content: item.content,
          severity: item.severity as Severity,
          time: item.time ?? item.createdAt ?? new Date().toISOString(),
          stt: idx + 1,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          userId: item.userId,
        })
      );
      setData(temp);
      dispatch(disappearSpinner());
    };

    void firstFetch();
  }, [dispatch]);

  const table = useReactTable<NotificationData>({
    data, // luôn là mảng, không undefined ⇒ ESLint ok
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
      {/* Filter */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter content..."
          value={(table.getColumn("content")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("content")?.setFilterValue(e.target.value)
          }
          className="max-w-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Table */}
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
                    className="px-4 py-3 text-sm font-semibold text-gray-900 text-center"
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-3 text-sm text-gray-700 text-center"
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

      {/* Pagination */}
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
