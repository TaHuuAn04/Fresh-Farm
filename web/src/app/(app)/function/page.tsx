import { getDevice } from "@/api/devices";
import { redirect } from "next/navigation";
import { lazy, Suspense } from "react";

const TemperatureCard = lazy(() => import("@/components/function/temperature"));
const FanCard = lazy(() => import("@/components/function/fan"));
const HumidityCard = lazy(() => import("@/components/function/humidity"));
const LightCard = lazy(() => import("@/components/function/light"));

export default function FunctionPage() {
  async function firstFetchHumid() {
    const fan = await getDevice("1854fee1-769c-4bc4-9263-9697853d54a3");

    if (!(fan?.statusCode && fan?.statusCode < 300)) {
      redirect("/");
    }
  }

  firstFetchHumid();
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Fresh Farm Control Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Temperature Control Card */}
        <Suspense fallback={<div>Loading...</div>}>
          {/* <TemperatureCard /> */}
        </Suspense>

        {/* Fan Control Card */}
        <Suspense fallback={<div>Loading...</div>}>
          {/* <FanCard /> */}
        </Suspense>

        {/* Humidity Control Card */}
        <Suspense fallback={<div>Loading...</div>}>
          {/* <HumidityCard /> */}
        </Suspense>

        {/* Light Control Card */}

        <Suspense fallback={<div>Loading...</div>}>
          <LightCard />
        </Suspense>
      </div>
    </div>
  );
}
