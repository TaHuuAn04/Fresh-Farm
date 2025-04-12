"use client";

import { Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import { getDevice } from "@/api/devices";
import { toast } from "sonner";

export default function HumidityCard() {
  const [humidState, setHumidState] = useState();

  useEffect(() => {
    setInterval(() => {
      async function firstFetchHumid() {
        const fan = await getDevice("1854fee1-769c-4bc4-9263-9697853d54a3");

        if (fan?.statusCode && fan?.statusCode < 300) {
          setHumidState(fan?.data?.last_value);
        } else {
          toast.error("Failure", {
            description: fan?.data?.message || "",
          });
        }
      }

      firstFetchHumid();
    }, 2000);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-500" />
          <span>Humidity State</span>
        </CardTitle>
        <CardDescription>Environmental humidity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold mb-4">{humidState || 70}%</div>
          <div className="w-full space-y-2">
            <Slider disabled value={[70]} min={30} max={90} step={5} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>30%</span>
              <span>90%</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <Button disabled variant="outline" className="w-full">
            Activate Irrigation
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
