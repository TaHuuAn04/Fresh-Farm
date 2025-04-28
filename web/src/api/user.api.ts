import axios from "axios";

interface UpdateUserDto {
  fullName?: string;
  age?: number;
  phoneNumber?: string;
  password?: string;
  email?: string;
}

export async function updateUser(data: UpdateUserDto, id: string) {
  try {
    const res = await axios.put(`/users/${id}`, data);
    return res?.data;
  } catch (error) {
    console.log("Error when get all devices", error);
    return error;
  }
}
