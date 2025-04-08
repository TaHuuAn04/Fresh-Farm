"use client"

import { useState } from "react"
import { Thermometer, Fan, Droplets, Sun, AlertCircle, ChevronUp, ChevronDown, Power } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function FunctionPage() {
  // Temperature state
  const [temperature, setTemperature] = useState(25)
  const [targetTemperature, setTargetTemperature] = useState(25)

  // Fan state
  const [fanPower, setFanPower] = useState(false)
  const [fanSpeed, setFanSpeed] = useState(50)

  // Humidity state
  const [humidity, setHumidity] = useState(65)

  // Light state
  const [lightIntensity, setLightIntensity] = useState(70)
  const [lightOn, setLightOn] = useState(true)

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Temperature has reached optimal level", time: "10:30 AM" },
    { id: 2, message: "Plants have been watered", time: "09:15 AM" },
  ])

  // Function to increase temperature
  const increaseTemperature = () => {
    if (targetTemperature < 35) {
      setTargetTemperature(targetTemperature + 1)
      // Simulate actual temperature change
      setTimeout(() => {
        setTemperature((prev) => Math.min(prev + 0.5, targetTemperature + 1))
      }, 1000)
    }
  }

  // Function to decrease temperature
  const decreaseTemperature = () => {
    if (targetTemperature > 15) {
      setTargetTemperature(targetTemperature - 1)
      // Simulate actual temperature change
      setTimeout(() => {
        setTemperature((prev) => Math.max(prev - 0.5, targetTemperature - 1))
      }, 1000)
    }
  }

  // Function to toggle fan
  const toggleFan = () => {
    const newState = !fanPower
    setFanPower(newState)

    // Add notification
    if (newState) {
      addNotification("Fan has been turned on")
    } else {
      addNotification("Fan has been turned off")
    }
  }

  // Function to adjust fan speed
  const handleFanSpeedChange = (value: number[]) => {
    setFanSpeed(value[0])
    addNotification(`Fan speed has been adjusted to ${value[0]}%`)
  }

  // Function to add new notification
  const addNotification = (message: string) => {
    const newNotification = {
      id: Date.now(),
      message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setNotifications((prev) => [newNotification, ...prev].slice(0, 5))
  }

  // Function to adjust humidity
  const handleHumidityChange = (value: number[]) => {
    setHumidity(value[0])
    addNotification(`Humidity has been adjusted to ${value[0]}%`)
  }

  // Function to adjust light
  const handleLightChange = (value: number[]) => {
    setLightIntensity(value[0])
    addNotification(`Light intensity has been adjusted to ${value[0]}%`)
  }

  // Function to toggle light
  const toggleLight = () => {
    const newState = !lightOn
    setLightOn(newState)

    // Add notification
    if (newState) {
      addNotification("Light has been turned on")
    } else {
      addNotification("Light has been turned off")
    }
  }

  // Determine temperature status
  const getTemperatureStatus = () => {
    if (temperature < 20) return { label: "Cold", color: "text-blue-500" }
    if (temperature > 30) return { label: "Hot", color: "text-red-500" }
    return { label: "Optimal", color: "text-green-500" }
  }

  const tempStatus = getTemperatureStatus()

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Fresh Farm Control Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Temperature Control Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-red-500" />
              <span>Temperature Control</span>
              <Badge className={tempStatus.color}>{tempStatus.label}</Badge>
            </CardTitle>
            <CardDescription>Adjust environmental temperature</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-6xl font-bold mb-4">{temperature.toFixed(1)}°C</div>
              <div className="text-sm text-muted-foreground mb-4">Target temperature: {targetTemperature}°C</div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={decreaseTemperature} disabled={targetTemperature <= 15}>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-red-500"
                    style={{ width: `${((temperature - 15) / 20) * 100}%` }}
                  ></div>
                </div>
                <Button variant="outline" size="icon" onClick={increaseTemperature} disabled={targetTemperature >= 35}>
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">Range: 15°C - 35°C</div>
            <Button
              variant={temperature > targetTemperature ? "destructive" : "default"}
              size="sm"
              onClick={() => {
                setTargetTemperature(25)
                addNotification("Temperature has been reset to default")
              }}
            >
              Reset
            </Button>
          </CardFooter>
        </Card>

        {/* Fan Control Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Fan className={`h-5 w-5 ${fanPower ? "text-green-500" : "text-gray-500"}`} />
              <span>Fan Control</span>
              {fanPower && (
                <Badge variant="outline" className="animate-pulse">
                  Active
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Turn on/off and adjust fan speed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="mb-6">
                <Button
                  variant={fanPower ? "default" : "outline"}
                  size="lg"
                  onClick={toggleFan}
                  className="h-16 w-16 rounded-full"
                >
                  <Power className={`h-8 w-8 ${fanPower ? "text-white" : "text-gray-500"}`} />
                </Button>
              </div>
              <div className="w-full space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Fan Speed</span>
                  <span className="text-sm font-medium">{fanSpeed}%</span>
                </div>
                <Slider
                  disabled={!fanPower}
                  value={[fanSpeed]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={handleFanSpeedChange}
                  className={fanPower ? "" : "opacity-50"}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto Mode</span>
                <Switch
                  checked={false}
                  onCheckedChange={() => addNotification("Auto mode will be available in the next version")}
                />
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Humidity Control Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              <span>Humidity Control</span>
            </CardTitle>
            <CardDescription>Adjust environmental humidity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold mb-4">{humidity}%</div>
              <div className="w-full space-y-2">
                <Slider value={[humidity]} min={30} max={90} step={5} onValueChange={handleHumidityChange} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>30%</span>
                  <span>90%</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  addNotification("Irrigation activated")
                }}
              >
                Activate Irrigation
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Light Control Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Sun className={`h-5 w-5 ${lightOn ? "text-yellow-500" : "text-gray-500"}`} />
              <span>Light Control</span>
            </CardTitle>
            <CardDescription>Adjust light intensity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="mb-4 flex items-center gap-4">
                <span className="text-sm">Status:</span>
                <Switch checked={lightOn} onCheckedChange={toggleLight} />
                <span className={`text-sm font-medium ${lightOn ? "text-green-500" : "text-gray-500"}`}>
                  {lightOn ? "On" : "Off"}
                </span>
              </div>
              <div className="w-full space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Intensity</span>
                  <span className="text-sm font-medium">{lightIntensity}%</span>
                </div>
                <Slider
                  disabled={!lightOn}
                  value={[lightIntensity]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={handleLightChange}
                  className={lightOn ? "" : "opacity-50"}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Manual</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>
                <TabsContent value="manual" className="pt-2">
                  <div className="text-sm text-muted-foreground">Manual control is currently active</div>
                </TabsContent>
                <TabsContent value="schedule" className="pt-2">
                  <div className="text-sm text-muted-foreground">
                    Scheduling feature will be available in the next version
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Notifications Section */}
      {/* <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Recent Notifications</h2>
        <div className="space-y-2">
          {notifications.map((notification) => (
            <Alert key={notification.id}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="ml-2">{notification.time}</AlertTitle>
              <AlertDescription className="ml-2">{notification.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      </div> */}
    </div>
  )
}

