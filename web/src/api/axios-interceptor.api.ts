import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BE_URL,
  withCredentials: true,
});

type RefreshSubscriber = (token: string) => void;

interface CustomRequestConfig extends AxiosRequestConfig {
  sent?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: RefreshSubscriber[] = [];

const onRefreshed = (newToken: string): void => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const subscribeTokenRefresh = (callback: RefreshSubscriber): void => {
  refreshSubscribers.push(callback);
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError): Promise<AxiosResponse | never> => {
    const originalRequest = error.config as CustomRequestConfig;

    if (error.response?.status === 401 && !originalRequest.sent) {
      originalRequest.sent = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const result = await axiosInstance.post("/auth/refresh");

          if (result.status > 299) {
            // Redirect nếu refresh thất bại
            if (window.location.pathname !== "/") window.location.href = "/";
            throw new Error("Refresh token failed");
          }

          isRefreshing = false;
          onRefreshed("new-token");
          return axiosInstance(originalRequest);
        } catch (refreshErr) {
          isRefreshing = false;
          refreshSubscribers = [];

          if (window.location.pathname !== "/") window.location.href = "/";
          return Promise.reject(refreshErr);
        }
      }

      return new Promise<AxiosResponse>((resolve) => {
        subscribeTokenRefresh(() => {
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
