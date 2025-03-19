"use client"; // Bắt buộc vì có useSelector

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function Spinner() {
  const spinnerState: boolean = useSelector((state: RootState) => state.spinner.appear);

  if (!spinnerState) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center opacity-90 w-full h-full">
      <img src="/spinner.svg" alt="Loading..." className="w-2/6" />
    </div>
  );
}
