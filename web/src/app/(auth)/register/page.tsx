import { getDevice } from "@/api/devices";
import RegisterForm from "../../../components/auth/register";
import Image from "next/image";

export default function RegisterPage() {
  async function firstFetchHumid() {
    const fan = await getDevice("1854fee1-769c-4bc4-9263-9697853d54a3");

    if (fan?.statusCode && fan?.statusCode < 300) {
      window.location.href = "/home";
    }
  }

  firstFetchHumid();
  return <RegisterForm />;
}
