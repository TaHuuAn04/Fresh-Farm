import {
  CreateDeviceDto,
  ToggleDeviceDto,
  UpdateDeviceDto,
} from "@/utils/constant";
import axios from "axios";
import axiosInstance from "./axios-interceptor.api";

export async function getAllDevices() {
  try {
    const res = await axiosInstance.get("/devices");
    return res?.data;
  } catch (error) {
    console.log("Error when get all devices", error);
    return error;
  }
}

export async function getDevice(id: string) {
  try {
    const res = await axiosInstance.get(`/devices/${id}`);
    // console.log("res", res);

    return res?.data;
  } catch (error) {
    console.log("Error when get specific device", error);
    return error;
  }
}

export async function createDevice(createDeviceDto: CreateDeviceDto) {
  try {
    const res = await axiosInstance.post("/devices", createDeviceDto);
    return res?.data;
  } catch (error) {
    console.log("Error when calling createDevice", error);
    return error;
  }
}

export async function updateDevice(
  id: string,
  updateDeviceDto: UpdateDeviceDto
) {
  try {
    const res = await axiosInstance.patch(`/devices/${id}`, updateDeviceDto);
    return res?.data;
  } catch (error) {
    console.log("Error when calling updateDevice", error);
    return error;
  }
}

export async function toggleDevice(
  id: string,
  toggleDeviceDto: ToggleDeviceDto
) {
  try {
    const res = await axiosInstance.patch(
      `/devices/${id}/toggle`,
      toggleDeviceDto
    );
    return res?.data;
  } catch (error) {
    console.log("Error when calling toggleDevice", error);
    return error;
  }
}

export async function deleteDevice(id: string) {
  try {
    const res = await axiosInstance.delete(`/devices/${id}`);
    return res?.data;
  } catch (error) {
    console.log("Error when calling deleteDevice", error);
    return error;
  }
}
