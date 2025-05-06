"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Added for navigation
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { toast } from "sonner";
import type { RegisterType } from "@/utils/constant";
import { register, resendOTP, verifyOTP } from "@/api/auth.api";

export default function RegisterForm() {
  const router = useRouter(); // Initialize router for navigation
  const [age, setAge] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== verifyPassword) {
      toast.warning("Failure", {
        description: "Mật khẩu và xác nhận mật khẩu không khớp",
      });
      return;
    }

    const payload: RegisterType = {
      age: Number.parseInt(age),
      fullName,
      phoneNumber,
      password,
      email,
    };

    setIsVerifying(true);

    const result = await register(payload);
    console.log(result);

    if (result?.statusCode && result?.statusCode < 300) {
      toast.success("Success", {
        description: "Tạo tài khoản thành công. Vui lòng xác thực OTP",
      });
      setIsRegistered(true);
    } else {
      toast.error("Failure", {
        description:
          result?.response?.data?.message[0] || "Lỗi trong quá trình đăng ký",
      });
    }

    setIsVerifying(false);
  };

  const handleVerifyOTP = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!otp || otp.length < 4) {
      toast.warning("Failure", {
        description: "Vui lòng nhập mã OTP hợp lệ",
      });
      return;
    }
    console.log(typeof otp);

    setIsVerifying(true);
    const response = await verifyOTP({ phoneNumber, otp });
    console.log(response);

    if (response?.statusCode && response?.statusCode < 300) {
      toast.success("Success", {
        description: "Xác thực thành công",
      });
      router.push("/"); // Navigate to home or login page
    } else {
      toast.error("Failure", {
        description:
          response?.response?.data?.message[0] ||
          "Lỗi trong quá trình xác thực",
      });
    }
    setIsVerifying(false);
  };

  // Render OTP verification form if registration was successful
  if (isRegistered) {
    return (
      <div className="w-full max-w-md space-y-8 px-4 md:px-8 mb-10">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold">Xác thực OTP</h1>
          <p className="text-gray-500">
            Vui lòng nhập mã OTP đã được gửi đến số điện thoại của bạn
          </p>
        </div>
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Số điện thoại"
              value={phoneNumber}
              disabled
              required
            />
            <Input
              type="text"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isVerifying}
          >
            {isVerifying ? "Đang xác thực..." : "Xác thực"}
          </Button>
          <div className="text-center text-sm">
            <button
              type="button"
              className="font-medium text-purple-500 hover:underline"
              onClick={async () => {
                const response = await resendOTP(phoneNumber);

                if (response?.statusCode && response?.statusCode < 300) {
                  toast.success("Success", {
                    description: "Mã OTP mới đã được gửi",
                  });
                } else {
                  toast.error("Failure", {
                    description:
                      response?.response?.data?.message[0] ||
                      "Lỗi trong quá trình gửi lại mã OTP",
                  });
                }
              }}
            >
              Gửi lại mã OTP
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Render registration form by default
  return (
    <div className="w-full max-w-md space-y-8 px-4 md:px-8 mb-10">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Đăng ký</h1>
        <p className="text-gray-500">Tạo tài khoản chỉ trong vài giây</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Họ và tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="Tuổi"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="Số điện thoại"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={agreeTerms}
            onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Tôi đồng ý với điều khoản và chính sách của ứng dụng
          </label>
        </div>
        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700"
          disabled={!agreeTerms || isVerifying}
        >
          {isVerifying ? "Đang xử lý..." : "Tạo tài khoản"}
        </Button>
      </form>
      <div className="text-center text-sm">
        Đã có tài khoản?{" "}
        <Link href="/" className="font-medium text-purple-500 hover:underline">
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
}
