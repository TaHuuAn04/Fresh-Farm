import { CreateDeviceDto, ToggleDeviceDto, UpdateDeviceDto } from '@/utils/constant';
import axios from 'axios';

const BASE_URL = `${process.env.NEXT_PUBLIC_BE_URL}/devices`;

export async function getAllDevices() {
  try {
    const res = await axios.get(BASE_URL);
    return res?.data;
  } catch (error: any) {
    console.log("Error when get all devices", error);
    return error?.data
  }
}

export async function getDevice(id: string) {
  try {
    const res = await axios.get(`${BASE_URL}/${id}`)
    return res?.data
  } catch (error: any) {
    console.log("Error when get specific device", error);
    return error?.data
  }
}

export async function createDevice(createDeviceDto: CreateDeviceDto) {
  try {
    const res = await axios.post(BASE_URL, createDeviceDto)
    return res?.data
  } catch (error: any) {
    console.log("Error when calling createDevice", error);
    return error?.data
  }
}

export async function updateDevice(id: string, updateDeviceDto: UpdateDeviceDto) {
  try {
    const res = await axios.patch(`${BASE_URL}/${id}`, updateDeviceDto)
    return res?.data
  } catch (error: any) {
    console.log("Error when calling updateDevice", error);
    return error?.data
  }
}

export async function toggleDevice(id: string, toggleDeviceDto: ToggleDeviceDto) {
  try {
    const res = await axios.patch(`${BASE_URL}/${id}/toggle`, toggleDeviceDto)
    return res?.data
  } catch (error: any) {
    console.log("Error when calling toggleDevice", error);
    return error?.data
  }
}

export async function deleteDevice(id: string) {
  try {
    const res = await axios.delete(`${BASE_URL}/${id}`)
    return res?.data
  } catch (error: any) {
    console.log("Error when calling deleteDevice", error);
    return error?.data
  }
}
