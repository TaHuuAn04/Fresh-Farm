import axiosInstance from "./axios-interceptor.api";

interface UpdateUserDto {
  fullName?: string;
  age?: number;
  phoneNumber?: string;
  password?: string;
  email?: string;
}

export async function updateUser(data: UpdateUserDto, id: string) {
  try {
    const res = await axiosInstance.put(`/users/${id}`, {
      ...data,
      phone_number: data?.phoneNumber ?? null,
    });
    return res?.data;
  } catch (error) {
    console.log("Error when get all devices", error);
    return error;
  }
}
