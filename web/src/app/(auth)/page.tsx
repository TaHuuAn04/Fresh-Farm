import { getDevice } from "@/api/devices";
import LoginForm from "../../components/auth/login";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <div className="w-full lg:mt-0 mt-10 flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
