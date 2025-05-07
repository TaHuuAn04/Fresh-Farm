import {
  ApiResponse,
  Login,
  LoginDto,
  RegisterType,
  ResetPasswordRequest,
  VerifyOTPType,
} from "@/utils/constant";
import axiosInstance from "./axios-interceptor.api";

export async function register(payload: RegisterType) {
  try {
    const { phoneNumber, ...data } = payload;
    const res = await axiosInstance.post(`/auth/register`, {
      ...data,
      phone_number: phoneNumber,
    });
    return res?.data;
  } catch (error) {
    console.log("Error when get all devices", error);
    return error;
  }
}

export async function verifyOTP(data: VerifyOTPType) {
  try {
    const res = await axiosInstance.post(`/auth/otp/verify`, data);
    console.log(res);

    return res?.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function requestForgotPassword(phoneNumber: string) {
  try {
    const res = await axiosInstance.post(`/auth/forgot-password/request`, {
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
    const res = await axiosInstance.post(`/auth/otp/resend`, {
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
    const res = await axiosInstance.post(`/auth/forgot-password/reset`, data);
    console.log(res);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function login(
  data: LoginDto
): Promise<ApiResponse<Login> | null> {
  try {
    const res = await axiosInstance.post(`/auth/log-in`, data);
    return res;
  } catch (error) {
    console.log(error);

    return null;
  }
}

export async function refresh() {
  try {
    const res = await axiosInstance.get(`/auth/refresh`);
    console.log(res);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function logout() {
  try {
    const res = await axiosInstance.post(`/auth/log-out`);
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getUserInformation(): Promise<ApiResponse<Login> | null> {
  try {
    const res = await axiosInstance.get("/auth/me");
    console.log(res);

    return res;
  } catch (error) {
    console.log(error);

    return null;
  }
}
