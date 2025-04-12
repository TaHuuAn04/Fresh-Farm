"use client";
import { RootState } from "@/redux/store";
import { Mic, CircleUserRound } from "lucide-react";
import { useSelector } from "react-redux";

const Header = () => {
  const fullName: string = useSelector(
    (state: RootState) => state.user.fullName
  );
  return (
    <header className="w-full py-3 px-4 md:px-8 lg:px-12 bg-white">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Status Message */}
          <div className="relative">
            <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 w-[250px]">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-gray-800">Plant watered!</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CircleUserRound className="h-5 w-5 text-gray-700" />
              <span className="text-gray-800 font-medium">{fullName}</span>
            </div>
            <button
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Voice command"
            >
              <Mic className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
