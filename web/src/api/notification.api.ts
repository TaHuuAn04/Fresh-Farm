import { ApiResponse, Notification } from "@/utils/constant";
import axiosInstance from "./axios-interceptor.api";

export async function getNotifications(): Promise<ApiResponse<
  Notification[]
> | null> {
  try {
    const res = await axiosInstance.get(`/notifications`);

    return res;
  } catch (error) {
    console.log(error);

    return null;
  }
}
