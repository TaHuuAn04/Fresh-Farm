import Link from "next/link";
import DeviceTable from "./device-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateButton from "./create-button";

export default async function HomePage() {
  const navigationLinks = [
    {
      href: "/home",
      title: "Home",
      description: "View the main dashboard and overview of your farm devices.",
    },
    {
      href: "/function",
      title: "Function",
      description: "Manage and control the functions of your farm devices.",
    },
    {
      href: "/chat",
      title: "Chat",
      description: "Communicate with AI supporter to easily manage your farm.",
    },
    {
      href: "/history",
      title: "History",
      description: "Review the activity logs and history of your farm devices.",
    },
  ];

  return (
    <div className="flex w-full my-5 px-4">
      <div className="mt-8 w-full">
        {/* Navigation Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Explore FreshFarm</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href} className="no-underline">
                <Card className="hover:shadow-lg transition-shadow duration-200 h-full">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      {link.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Header and Create Button */}
        <div className="flex justify-between items-center mb-5">
          <div className="font-bold text-2xl">FreshFarm</div>
          <CreateButton />
        </div>

        {/* Device Table */}
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
      </div>
    </div>
  );
}
