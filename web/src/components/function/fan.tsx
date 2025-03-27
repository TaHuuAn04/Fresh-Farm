"use client"

import { Fan, Power } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from 'react'
import { getDevice, toggleDevice } from '@/api/devices'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { appearSpinner, disappearSpinner } from '@/redux/slices/spinnerSlice'

interface FanCardProps {
  fanPower: boolean;
  toggleFan: () => void;
}

export default function FanCard() {
  const dispatch = useDispatch()
  const [fanStatus, setFanStatus] = useState('offline')
  const [controlState, setControlState] = useState<boolean>(false)

  useEffect(() => {
    async function firstFetchFan() {
      dispatch(appearSpinner())
      const fan = await getDevice('c0d84e00-5352-40e8-8def-271baace6d8e')

      if(fan?.statusCode >= 400) {
        toast.error("Failure", {
          description: fan?.message || ""
        })
      } else {
        setFanStatus(fan?.data?.status)
      }
      dispatch(disappearSpinner())
    }
    console.log(1);
    
    firstFetchFan()
    
  }, [controlState])

  async function toggleFan() {
    dispatch(appearSpinner())
    try {
      const response = await toggleDevice('c0d84e00-5352-40e8-8def-271baace6d8e', { status: fanStatus === 'online' ? 'offline' : 'online' }) // Gửi trạng thái mới
      setControlState(prev => !prev)
    } catch (error: any) {
      toast.error("Failure", {
        description: error?.message || ""
      })
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Fan className={`h-5 w-5 ${fanStatus === "online" ? "text-green-500" : "text-gray-500"}`} />
          <span>Fan Control</span>
          {fanStatus === "online" && (
            <Badge variant="outline" className="animate-pulse">
              Active
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Turn on/off and adjust fan speed</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mt-5">
          <div className="mb-6">
            <Button
              variant={fanStatus === "online" ? "default" : "outline"}
              size="lg"
              onClick={toggleFan}
              className="h-16 w-16 rounded-full"
            >
              <Power className={`h-8 w-8 ${fanStatus === "online" ? "text-white" : "text-gray-500"}`} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
