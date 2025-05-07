"use client";

import type React from "react";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createDevice } from "@/api/devices";
import { useDispatch } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setReload } from "@/redux/slices/reloadSlide";
import { appearSpinner, disappearSpinner } from "@/redux/slices/spinnerSlice";

export enum DeviceType {
  SENSOR_HUMIDITY = "SENSOR_HUMIDITY",
  SENSOR_TEMPERATURE = "SENSOR_TEMPERATURE",
  ACTUATOR_PUMP = "ACTUATOR_PUMP",
  ACTUATOR_FAN = "ACTUATOR_FAN",
  ACTUATOR_LIGHT = "ACTUATOR_LIGHT",
  CAMERA = "CAMERA",
  OTHERS = "OTHERS",
}

const deviceTypeOptions = [
  { value: DeviceType.SENSOR_HUMIDITY, label: "Sensor Humidity" },
  { value: DeviceType.SENSOR_TEMPERATURE, label: "Sensor Temperature" },
  { value: DeviceType.ACTUATOR_PUMP, label: "Actuator Pump" },
  { value: DeviceType.ACTUATOR_FAN, label: "Actuator Fan" },
  { value: DeviceType.ACTUATOR_LIGHT, label: "Actuator Light" },
  { value: DeviceType.CAMERA, label: "Camera" },
  { value: DeviceType.OTHERS, label: "Others" },
];

export function CreateDeviceDialog() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceDescription, setDeviceDescription] = useState("");
  const [deviceType, setDeviceType] = useState<DeviceType | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (deviceName.trim() === "") {
      toast("failure", {
        description: "Tên thiết bị không được để trống",
      });
      return;
    }

    if (deviceType === "") {
      toast("failure", {
        description: "Vui lòng chọn loại thiết bị",
      });
      return;
    }

    const dataApi = {
      name: deviceName,
      description: deviceDescription,
      type: deviceType,
      key: uuidv4(),
    };

    dispatch(appearSpinner());
    await createDevice(dataApi);

    dispatch(setReload());
    setDeviceName("");
    setDeviceDescription("");
    setDeviceType("");
    setOpen(false);
    dispatch(disappearSpinner());
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tạo mới</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tạo thiết bị mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin thiết bị mới của bạn. Nhấn Lưu khi hoàn tất.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Tên thiết bị
              </Label>
              <Input
                id="name"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Loại thiết bị
              </Label>
              <Select
                value={deviceType}
                onValueChange={(value) => setDeviceType(value as DeviceType)}
              >
                <SelectTrigger id="type" className="col-span-3">
                  <SelectValue placeholder="Chọn loại thiết bị" />
                </SelectTrigger>
                <SelectContent>
                  {deviceTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right">
                Mô tả
              </Label>
              <Textarea
                id="description"
                value={deviceDescription}
                onChange={(e) => setDeviceDescription(e.target.value)}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit">Lưu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
