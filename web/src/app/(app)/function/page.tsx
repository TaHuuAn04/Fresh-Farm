"use client";
import { getUserDevice } from "@/api/devices";
import { RootState } from "@/redux/store";
import { lazy, Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

const TemperatureCard = lazy(() => import("@/components/function/temperature"));
const FanCard = lazy(() => import("@/components/function/fan"));
const HumidityCard = lazy(() => import("@/components/function/humidity"));
const LightCard = lazy(() => import("@/components/function/light"));

interface Device {
  id: string;
  deviceKey: string;
  type: string;
  value: string;
}

export default function FunctionPage() {
  const userId = useSelector((state: RootState) => state.user.id);
  const [listDevice, setListDevice] = useState<Device[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    async function firstFetch() {
      const result = await getUserDevice();

      if (result?.status > 299) {
        toast("Error", {
          description: "Error while getting devices",
        });
        return;
      }

      setListDevice(result?.data?.data);
    }

    firstFetch();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const socketIo = io("http://localhost:3010/user", {
      query: { userId },
      transports: ["websocket"],
    });

    socketIo.on("connect", () => {
      console.log("Socket.IO connected");
    });

    socketIo.on("device-update", (message) => {
      try {
        if (message.statusCode === 200 && message.data) {
          const updatedDevice = message.data;

          setListDevice((prevDevices) =>
            prevDevices.map((device) =>
              device.id === updatedDevice.id
                ? { ...device, value: updatedDevice.value }
                : device
            )
          );
        }
      } catch (error) {
        console.error("Error processing device-update:", error);
      }
    });

    socketIo.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
      toast("Error", {
        description: "Socket.IO connection error",
      });
    });

    socketIo.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [userId]);

  const renderDeviceCard = (device: Device) => {
    const props = {
      id: device.id,
      deviceKey: device.deviceKey,
      value: device.value,
    };

    switch (device.type) {
      case "SENSOR_TEMPERATURE":
        return (
          <Suspense key={device.id} fallback={<div>Loading...</div>}>
            <TemperatureCard {...props} />
          </Suspense>
        );
      case "ACTUATOR_FAN":
        return (
          <Suspense key={device.id} fallback={<div>Loading...</div>}>
            <FanCard {...props} />
          </Suspense>
        );
      case "SENSOR_HUMIDITY":
        return (
          <Suspense key={device.id} fallback={<div>Loading...</div>}>
            <HumidityCard {...props} />
          </Suspense>
        );
      case "ACTUATOR_LIGHT":
        return (
          <Suspense key={device.id} fallback={<div>Loading...</div>}>
            <LightCard {...props} />
          </Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Fresh Farm Control Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listDevice.length > 0 ? (
          listDevice.map((device) => renderDeviceCard(device))
        ) : (
          <p>No devices found.</p>
        )}
      </div>
    </div>
  );
}
