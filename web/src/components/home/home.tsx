import Link from "next/link";
import DeviceTable from "./device-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateButton from "./create-button";

export default async function HomePage() {
  return (
    <div className="flex w-full my-5">
      <div className="mt-8 w-full mr-7">
        <div className="flex justify-between">
          <div className="pb-5 font-bold text-2xl">FreshFarm</div>
          <CreateButton />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Farm Devices Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeviceTable />
          </CardContent>
        </Card>
        <div className="map-container flex gap-2 mt-4 text-base">
          <span>You can go to</span>
          <Link href="/home" className="text-blue-500 hover:underline">
            Home
          </Link>
          <span>,</span>
          <Link href="/function" className="text-blue-500 hover:underline">
            Function
          </Link>
          <span>,</span>
          <Link href="/chat" className="text-blue-500 hover:underline">
            Chat
          </Link>
          <span>or</span>
          <Link href="/history" className="text-blue-500 hover:underline">
            History
          </Link>
          <span>to explore more</span>
        </div>
      </div>
    </div>
  );
}
