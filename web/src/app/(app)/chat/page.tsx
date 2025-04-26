import { getDevice } from "@/api/devices";
import { redirect } from "next/navigation";
import { lazy, Suspense } from "react";

const ChatComp = lazy(() => import("../../../components/chat/chat-comp"));

export default function ChatPage() {
  async function firstFetchHumid() {
    const fan = await getDevice("1854fee1-769c-4bc4-9263-9697853d54a3");

    if (!(fan?.statusCode && fan?.statusCode < 300)) {
      redirect("/");
    }
  }

  firstFetchHumid();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatComp />
    </Suspense>
  );
}
