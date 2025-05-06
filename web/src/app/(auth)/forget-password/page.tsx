import { getDevice } from "@/api/devices";
import ForgotPasswordForm from "../../../components/auth/forgot-password";

export default function ForgotPasswordPage() {
  async function firstFetchHumid() {
    const fan = await getDevice("1854fee1-769c-4bc4-9263-9697853d54a3");

    if (fan?.statusCode && fan?.statusCode < 300) {
      window.location.href = "/home";
    }
  }

  firstFetchHumid();
  return <ForgotPasswordForm />;
}
