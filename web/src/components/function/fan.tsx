"use client";

import { Fan, Power } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getDevice, toggleDevice } from "@/api/devices";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { appearSpinner, disappearSpinner } from "@/redux/slices/spinnerSlice";

export default function FanCard({ id, deviceKey, value }) {
  const dispatch = useDispatch();
  const [controlState, setControlState] = useState<boolean>(false);

  async function toggleFan() {
    dispatch(appearSpinner());
    const result = await toggleDevice(id, {
      status: value > 0 ? "offline" : "online",
    }); // Gửi trạng thái mới
    if (result?.statusCode && result?.statusCode < 300)
      setControlState((prev) => !prev);
    else {
      toast.error("Failure", {
        description: result?.data?.message || "",
      });
    }

    dispatch(disappearSpinner());
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Fan
            className={`h-5 w-5 ${
              value > 0 ? "text-green-500" : "text-gray-500"
            }`}
          />
          <span>Fan Control</span>
          {value > 0 && (
            <Badge variant="outline" className="animate-pulse">
              Active
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Turn on/off and adjust fan speed</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mt-5">
          <div className="mb-6">
            <Button
              variant={value > 0 ? "default" : "outline"}
              size="lg"
              onClick={toggleFan}
              className="h-16 w-16 rounded-full"
            >
              <Power
                className={`h-8 w-8 ${
                  value > 0 ? "text-white" : "text-gray-500"
                }`}
              />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
