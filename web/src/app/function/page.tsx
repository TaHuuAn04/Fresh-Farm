import { lazy, Suspense } from "react"

const TemperatureCard = lazy(() => import("@/components/function/temperature"))
const FanCard = lazy(() => import("@/components/function/fan"))
const HumidityCard = lazy(() => import("@/components/function/humidity"))
const LightCard = lazy(() => import("@/components/function/light"))

export default function FunctionPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Fresh Farm Control Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Temperature Control Card */}
        <Suspense fallback={<div>Loading...</div>}>
          <TemperatureCard />
        </Suspense>

        {/* Fan Control Card */}
        <Suspense fallback={<div>Loading...</div>}>
            <FanCard />
        </Suspense>

        {/* Humidity Control Card */}
        <Suspense fallback={<div>Loading...</div>}>
            <HumidityCard />
        </Suspense>

        {/* Light Control Card */}
        
        <Suspense fallback={<div>Loading...</div>}>
            <LightCard />
        </Suspense>
      </div>
    </div>
  )
}

