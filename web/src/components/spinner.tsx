"use client"; // Bắt buộc vì có useSelector

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";

export default function Spinner() {
  const spinnerState: boolean = useSelector((state: RootState) => state.spinner.appear);

  if (!spinnerState) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-gray-300">
      <Image src="/spinner.svg" alt="Loading..." className="w-2/6" width={20} height={20}/>
    </div>
  );
}
