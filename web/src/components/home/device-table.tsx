"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { appearSpinner, disappearSpinner } from "@/redux/slices/spinnerSlice";
import { getAllDevices } from "@/api/devices";
import { RootState } from "@/redux/store";

interface Device {
  id: string;
  name: string;
  status: string;
  key: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  ownerId: string | null;
  last_value: string;
}

export default function DeviceTable() {
  const [sortColumn, setSortColumn] = useState<keyof Device | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const dispatch = useDispatch();
  const [devices, setDevices] = useState<Device[]>([]);
  const reload = useSelector((state: RootState) => state.reload.reload);

  useEffect(() => {
    const firstFetch = async () => {
      dispatch(appearSpinner());
      const result = await getAllDevices();
      setDevices(result?.data);
      dispatch(disappearSpinner());
    };

    firstFetch();
  }, [reload]);

  const handleSort = (column: keyof Device) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "online":
        return <Badge className="bg-green-500">Online</Badge>;
      case "offline":
        return (
          <Badge variant="outline" className="text-gray-500">
            Offline
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/5" onClick={() => handleSort("id")}>
            No.
          </TableHead>
          <TableHead onClick={() => handleSort("name")}>Device Name</TableHead>
          <TableHead onClick={() => handleSort("status")}>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {devices &&
          devices.map((device, index) => (
            <TableRow key={device.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{device.name}</TableCell>
              <TableCell>{getStatusBadge(device.status)}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
