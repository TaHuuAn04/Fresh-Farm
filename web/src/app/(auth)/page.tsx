import { getDevice } from "@/api/devices";
import LoginForm from "../../components/auth/login";
import { redirect } from "next/navigation";

export default function Home() {
  async function firstFetchHumid() {
    const fan = await getDevice("1854fee1-769c-4bc4-9263-9697853d54a3");

    if (fan?.statusCode && fan?.statusCode < 300) {
      redirect("/home");
    }
  }

  firstFetchHumid();

  return (
    <div className="w-full lg:mt-0 mt-10 flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
