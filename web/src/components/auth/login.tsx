"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { login, refresh, resendOTP } from "@/api/auth.api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { changeState } from "@/redux/slices/user.slice";

export default function LoginForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await login({ phoneNumber, password });

    if (response?.status < 300) {
      toast.success("Success", {
        description: "Đăng nhập thành công",
      });

      dispatch(
        changeState({
          fullName: response?.data?.fullName,
          role: response?.data?.role,
        })
      );
      setInterval(async () => {
        await refresh();
      }, 15 * 1000 * 60);
      router.push("/home");
    } else {
      toast.error("Failure", {
        description:
          response?.response?.data?.message[0] ||
          "Sai tên đăng nhập hoặc mật khẩu",
      });
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 px-4 md:px-8 mb-10">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Đăng nhập</h1>
        <p className="text-gray-500">
          Đăng nhập nhanh chóng chỉ trong vài giây
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Số điện thoại"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-end">
          <Link
            href="/forget-password"
            className="text-sm text-purple-500 hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>
        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          Đăng nhập
        </Button>
      </form>
      <div className="text-center text-sm">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="font-medium text-purple-500 hover:underline"
        >
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
}
