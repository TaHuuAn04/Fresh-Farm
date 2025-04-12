import { getDevice } from "@/api/devices";
import { redirect } from "next/navigation";

export default function HomePage() {
  async function firstFetchHumid() {
    const fan = await getDevice("1854fee1-769c-4bc4-9263-9697853d54a3");

    if (!(fan?.statusCode && fan?.statusCode < 300)) {
      redirect("/");
    }
  }

  firstFetchHumid();
  return <div>asdf</div>;
}
