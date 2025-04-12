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
import { useEffect, useState } from "react";
import { getDevice, toggleDevice } from "@/api/devices";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { appearSpinner, disappearSpinner } from "@/redux/slices/spinnerSlice";

export default function LightCard() {
  const dispatch = useDispatch();
  const [lightStatus, setLightStatus] = useState("offline");
  const [controlState, setControlState] = useState(false);

  useEffect(() => {
    async function firstFetchLight() {
      dispatch(appearSpinner());
      const light = await getDevice("df9c024d-87a0-4363-97d7-914b8c30b18e");

      if (light?.statusCode && light?.statusCode < 300) {
        setLightStatus(light?.data?.status);
      } else {
        toast.error("Failure", {
          description: light?.data?.message || "",
        });
      }
      dispatch(disappearSpinner());
    }

    firstFetchLight();
  }, [controlState, dispatch]);

  async function toggleLight() {
    dispatch(appearSpinner());
    const result = await toggleDevice("df9c024d-87a0-4363-97d7-914b8c30b18e", {
      status: lightStatus === "online" ? "offline" : "online",
    }); // Gửi trạng thái mới
    if (result?.statusCode && result?.statusCode < 300) {
      setControlState((prev) => !prev);
    } else {
      toast.error("Failure", {
        description: result?.data?.message || "",
      });
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Sun
            className={`h-5 w-5 ${
              lightStatus === "online" ? "text-yellow-500" : "text-gray-500"
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
            <Switch
              checked={lightStatus === "online"}
              onCheckedChange={toggleLight}
            />
            <span
              className={`text-sm font-medium ${
                lightStatus === "online" ? "text-green-500" : "text-gray-500"
              }`}
            >
              {lightStatus === "online" ? "On" : "Off"}
            </span>
          </div>
          <div className="w-full space-y-2 mt-7">
            <div className="flex justify-between">
              <span className="text-sm">Intensity</span>
              <span className="text-sm font-medium">50%</span>
            </div>
            <Slider
              disabled
              value={[50]}
              min={0}
              max={100}
              step={5}
              className={lightStatus === "online" ? "" : "opacity-50"}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
