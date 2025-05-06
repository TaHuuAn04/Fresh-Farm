"use client";

import { Sun } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toggleDevice } from "@/api/devices";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { appearSpinner, disappearSpinner } from "@/redux/slices/spinnerSlice";

export default function LightCard({ id, deviceKey, value }) {
  const dispatch = useDispatch();

  async function toggleLight() {
    dispatch(appearSpinner());
    const result = await toggleDevice("id", {
      status: value > 0 ? "offline" : "online",
    });

    if (result?.statusCode && result?.statusCode > 299) {
      toast.error("Failure", {
        description: result?.data?.message || "",
      });
      return;
    }
    dispatch(disappearSpinner());
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Sun
            className={`h-5 w-5 ${
              value > 0 ? "text-yellow-500" : "text-gray-500"
            }`}
          />
          <span>Light Control</span>
        </CardTitle>
        <CardDescription>Turn on/off light</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="mb-4 flex items-center gap-4">
            <span className="text-sm">Status:</span>
            <Switch checked={value > 0} onCheckedChange={toggleLight} />
            <span
              className={`text-sm font-medium ${
                value > 0 ? "text-green-500" : "text-gray-500"
              }`}
            >
              {value > 0 ? "On" : "Off"}
            </span>
          </div>
          <div className="w-full space-y-2 mt-7">
            <div className="flex justify-between">
              <span className="text-sm">Intensity</span>
              <span className="text-sm font-medium">50%</span>
            </div>
            <Slider
              disabled
              value={value}
              min={0}
              max={100}
              step={5}
              className={value > 0 ? "" : "opacity-50"}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
