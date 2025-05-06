import { BlockingMessageDto } from "@/utils/constant";
import axios from "axios";
import axiosInstance from "./axios-interceptor.api";

const DETECTION_API_URL = process.env.NEXT_DETECTION_URL;

export const getBlockingMessages = async ({
  query,
  accessToken,
  refreshToken,
}: BlockingMessageDto) => {
  try {
    const response = await axiosInstance.post(
      `/chat-bot/blocking`,
      {
        query,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5YjIwZjUwNC1kNTIwLTQ1YmYtOWI1ZS01MzMwNGRmZDJmYTciLCJpYXQiOjE3NDYxNzI1MjAsImV4cCI6MTc0NjE3NjEyMH0.nOqr4NyTedU1-LlHtSVhs_8vMcb1_lkAnS1W9chI7eU",
          Cookie: `Authentication=${accessToken}; Refresh=${refreshToken}`,
        },
        withCredentials: true,
      }
    );

    console.log(response.data);
    return response?.data;
  } catch (error) {
    console.error("Error calling blocking API:", error);
    return error;
  }
};

export const getDetection = async () => {
  try {
    const response = await axios.post(
      `${DETECTION_API_URL}/v1/timed-detection`,
      {
        duration: 10,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Cookie:
            "Authentication=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5YjIwZjUwNC1kNTIwLTQ1YmYtOWI1ZS01MzMwNGRmZDJmYTciLCJpYXQiOjE3NDYxNzY2NzUsImV4cCI6MTc0NjE4MDI3NX0.a-8VkvrElYR9AtOg-PL7EUwBsR2JU7dEyyGBR6hj1xw; Refresh=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5YjIwZjUwNC1kNTIwLTQ1YmYtOWI1ZS01MzMwNGRmZDJmYTciLCJpYXQiOjE3NDYxNzY2NzUsImV4cCI6MTc0Njc4MTQ3NX0.mtDbsZ4-PR3MmpCITa6Psn3EhzdPPSkIXayTC_-Eo-E",
        },
        withCredentials: true,
      }
    );

    console.log(response.data);
    return response?.data;
  } catch (error) {
    console.error("Error calling timed detection API:", error);
    throw error;
  }
};
