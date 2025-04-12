import {
  LoginDto,
  RegisterType,
  ResetPasswordRequest,
  VerifyOTPType,
} from "@/utils/constant";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_BE_URL}/auth`;

export async function register(payload: RegisterType) {
  try {
    const res = await axios.post(`${BASE_URL}/register`, payload);
    return res?.data;
  } catch (error) {
    console.log("Error when get all devices", error);
    return error;
  }
}

export async function verifyOTP(data: VerifyOTPType) {
  try {
    const res = await axios.post(`${BASE_URL}/otp/verify`, data);
    console.log(res);

    return res?.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function requestForgotPassword(phoneNumber: string) {
  try {
    const res = await axios.post(`${BASE_URL}/forgot-password/request`, {
      phoneNumber,
    });
    console.log(res);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function resendOTP(phoneNumber: string) {
  try {
    const res = await axios.post(`${BASE_URL}/otp/resend`, {
      phoneNumber,
    });
    console.log(res);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function requestResetPassword(data: ResetPasswordRequest) {
  try {
    const res = await axios.post(`${BASE_URL}/forgot-password/reset`, data);
    console.log(res);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function login(data: LoginDto) {
  try {
    const res = await axios.post(`${BASE_URL}/log-in`, data);
    console.log("reds", res);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function refresh() {
  try {
    const res = await axios(`${BASE_URL}/refresh`);
    console.log(res);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function logout() {
  try {
    const res = await axios.post(`${BASE_URL}/log-out`);
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}
