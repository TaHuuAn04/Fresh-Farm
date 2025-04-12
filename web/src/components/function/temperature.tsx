"use client";

import { Thermometer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getDevice } from "@/api/devices";
import { toast } from "sonner";

type tempDataType = {
  label: string;
  color: string;
};

export default function TemperatureCard() {
  const [temperatureState, setTemperatureState] = useState();
  const [temperatureData, setTemperatureData] = useState<tempDataType>({
    label: "Hot",
    color: "text-red-500",
  });

  // Determine temperature status
  useEffect(() => {
    setInterval(() => {
      async function firstFetchTemp() {
        const light = await getDevice("f7e530f2-9896-4d2b-b140-2a95e7fbb340");

        if (light?.statusCode && light?.statusCode < 300) {
          if (light?.data?.last_value > "28") {
            setTemperatureData({
              label: "Hot",
              color: "text-red-500",
            });
          } else {
            setTemperatureData({
              label: "Cold",
              color: "text-blue-500",
            });
          }
          setTemperatureState(light?.data?.last_value);
        } else {
          toast.error("Failure", {
            description: light?.data?.message || "",
          });
        }
      }

      firstFetchTemp();
    }, 2000);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-red-500" />
          <span>Temperature State</span>
          <Badge className={`${temperatureData.color}`}>
            {temperatureData.label}
          </Badge>
        </CardTitle>
        <CardDescription>Environmental temperature</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center md:mt-3 mt-7">
          <div className="text-6xl font-bold mb-4">
            {temperatureState || 24}°C
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground mt-7">
          Range: 15°C - 35°C
        </div>
      </CardFooter>
    </Card>
  );
}
