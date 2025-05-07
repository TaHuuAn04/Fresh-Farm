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
import { DeviceProps } from "@/utils/constant";

export default function TemperatureCard({ value }: DeviceProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-red-500" />
          <span>Temperature State</span>
          <Badge
            className={`${+value > 35 ? "text-red-500" : "text-blue-400"}`}
          >
            {+value > 35 ? "Hot" : "Normal"}
          </Badge>
        </CardTitle>
        <CardDescription>Environmental temperature</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center md:mt-3 mt-7">
          <div className="text-6xl font-bold mb-4">{+value}°C</div>
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
