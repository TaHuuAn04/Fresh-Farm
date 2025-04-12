"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import {
  requestForgotPassword,
  requestResetPassword,
  resendOTP,
  verifyOTP,
} from "@/api/auth.api";
import { useRouter } from "next/navigation";

export default function ForgotPasswordForm() {
  // States for different steps
  const [step, setStep] = useState<"phone" | "otp" | "reset">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Set up countdown timer for OTP
    let interval: NodeJS.Timeout | null = null;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  // Phone number step handlers
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate phone number
    if (
      !phoneNumber ||
      (!/^\d{10}$/.test(phoneNumber) && !/^\d{11}$/.test(phoneNumber))
    ) {
      toast.warning("Failure", {
        description: "Số điện thoại phải chứa 10-11 chữ số",
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call to send OTP
    const result = await requestForgotPassword(phoneNumber);

    if (result?.statusCode && result?.statusCode < 300) {
      setStep("otp");
      setTimer(60);
      toast.success("Success", {
        description: "Mã OTP đã được gửi đến số điện thoại của bạn",
      });
    } else {
      toast.error("Failure", {
        description:
          result?.response?.data?.message[0] || "Lỗi trong quá trình đăng ký",
      });
    }
    setIsLoading(false);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and max 6 characters
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Verify OTP code
    if (otp.length !== 6) {
      setError("Vui lòng nhập mã OTP 6 chữ số hợp lệ");
      return;
    }

    setIsLoading(true);
    const result = await verifyOTP({ phoneNumber, otp });

    if (result?.statusCode && result?.statusCode < 300) {
      setStep("reset");
      toast.success("Success", { description: "Xác thực OTP thành công" });
    } else {
      setError("Mã OTP không chính xác. Vui lòng thử lại.");
      toast.success("Failure", {
        description: "Mã OTP không chính xác. Vui lòng thử lại",
      });
    }
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;

    setIsLoading(true);

    const response = await resendOTP(phoneNumber);
    setTimer(60);

    if (response?.statusCode && response?.statusCode < 300) {
      toast.success("Success", {
        description: "Mã OTP mới đã được gửi",
      });
    } else {
      setError("Không thể gửi lại mã OTP. Vui lòng thử lại sau.");
      toast.error("Failure", {
        description:
          response?.response?.data?.message[0] ||
          "Lỗi trong quá trình gửi lại mã OTP",
      });
    }

    setIsLoading(false);
  };

  // Reset password step handlers
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords
    if (password !== confirmPassword) {
      toast.error("Failure", {
        description: "Mật khẩu không khớp",
      });
      return;
    }

    setIsLoading(true);

    const result = await requestResetPassword({
      phoneNumber,
      newPassword: password,
    });

    if (result?.statusCode && result?.statusCode < 300) {
      toast.success("Success", {
        description: "Đặt lại mật khẩu thành công",
      });
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      toast.error("Failure", {
        description:
          result?.response?.data?.message[0] ||
          "Lỗi trong quá trình đặt lại mật khẩu",
      });
    }
    setIsLoading(false);
  };

  // Go back to previous step
  const handleBack = () => {
    if (step === "otp") {
      setStep("phone");
    } else if (step === "reset") {
      setStep("otp");
    }
    setError("");
  };

  // Render phone number step
  const renderPhoneStep = () => (
    <>
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Quên mật khẩu</h1>
        <p className="text-gray-500">Nhập số điện thoại để nhận mã OTP</p>
      </div>
      <form onSubmit={handlePhoneSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <Input
            type="tel"
            placeholder="Số điện thoại"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700"
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Gửi mã OTP"}
        </Button>
        <div className="text-center">
          <Link href="/" className="text-sm text-purple-500 hover:underline">
            Quay về đăng nhập
          </Link>
        </div>
      </form>
    </>
  );

  // Render OTP step
  const renderOtpStep = () => (
    <>
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Xác thực OTP</h1>
        <p className="text-gray-500">
          Nhập mã 6 chữ số đã gửi đến {phoneNumber}
        </p>
      </div>
      <form onSubmit={handleOtpSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Nhập mã 6 chữ số"
            value={otp}
            onChange={handleOtpChange}
            className="text-center text-lg tracking-widest"
            maxLength={6}
            inputMode="numeric"
            pattern="[0-9]*"
            required
          />
          <p className="text-xs text-gray-500">
            Nhập mã xác thực 6 chữ số đã gửi đến số điện thoại của bạn
          </p>
        </div>
        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700"
          disabled={otp.length !== 6 || isLoading}
        >
          {isLoading ? "Đang xác thực..." : "Xác thực"}
        </Button>
        <div className="text-center text-sm">
          {timer > 0 ? (
            <p>Gửi lại mã sau {timer} giây</p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-purple-500 hover:underline"
              disabled={isLoading}
            >
              Gửi lại mã OTP
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-center text-sm text-purple-500 hover:underline"
          disabled={isLoading}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại nhập số điện thoại
        </button>
      </form>
    </>
  );

  // Render reset password step
  const renderResetStep = () => (
    <>
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Đặt lại mật khẩu</h1>
        <p className="text-gray-500">Tạo mật khẩu mới cho tài khoản của bạn</p>
      </div>
      <form onSubmit={handleResetSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="phone" className="text-sm font-medium">
              Số điện thoại
            </label>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              disabled
              className="bg-gray-100"
            />
          </div>
          <div className="relative space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              Mật khẩu mới
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          <div className="relative space-y-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700"
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        </Button>
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-center text-sm text-purple-500 hover:underline"
          disabled={isLoading}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại xác thực
        </button>
      </form>
    </>
  );

  return (
    <div className="w-full max-w-md space-y-8 px-4 md:px-8">
      {step === "phone" && renderPhoneStep()}
      {step === "otp" && renderOtpStep()}
      {step === "reset" && renderResetStep()}
    </div>
  );
}
