import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Login or register to access the app",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex min-h-screen w-full">
        <div className="relative hidden w-1/2 lg:block">
          <Image
            src="/bg.jpg"
            alt="Cánh đồng nông trại xanh tươi với hàng cây trồng"
            fill
            sizes="100%"
            className="object-cover"
            priority
          />
        </div>
        <div className="flex w-full items-center justify-center lg:w-1/2 lg:mt-0 mt-10">
          {children}
        </div>
      </div>
    </div>
  );
}
