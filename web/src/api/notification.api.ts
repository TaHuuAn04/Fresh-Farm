import axiosInstance from "./axios-interceptor.api";

export async function getNotifications() {
  try {
    const res = await axiosInstance.get(`/notifications`);
    // console.log("res", res);

    return res;
  } catch (error) {
    console.log("Error when get specific device", error);
    return error;
  }
}
