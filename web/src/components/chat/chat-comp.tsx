"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircleQuestion, Send } from "lucide-react";
import { getDevice } from "@/api/devices";
import { redirect } from "next/navigation";
import { getBlockingMessages, getDetection } from "@/api/chat.api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "sonner";

type Message = {
  id: string;
  content: string;
  sender: "system" | "user";
  timestamp: Date;
};

export default function ChatPage() {
  const user = useSelector((state: RootState) => state.user);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help you today?",
      sender: "system",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  // Initial device check
  useEffect(() => {
    async function checkDevice() {
      const fan = await getDevice("1854fee1-769c-4bc4-9263-9697853d54a3");
      if (fan?.statusCode && fan.statusCode >= 300) {
        redirect("/");
      }
    }

    checkDevice();
  }, []);

  const handleDetectFarm = async () => {
    setIsWaiting(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      content: "How is my farm now?",
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const result = await getDetection();
    // Simulate system response after a short delay

    if (result?.statusCode > 299) {
      toast("Error", {
        description: "Something went wrong. Please try again.",
      });
      return;
    }

    const systemMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `${result?.data}`,
      sender: "system",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, systemMessage]);
    setIsWaiting(false);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    // Add user message
    setIsWaiting(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate system response after a short delay
    const result = await getBlockingMessages({
      query: inputValue,
      accessToken: user?.accessToken,
      refreshToken: user?.refreshToken,
    });

    if (result?.statusCode > 299) {
      toast("Error", {
        description: "Something went wrong. Please try again.",
      });
      return;
    }

    const systemMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `${result?.data}`,
      sender: "system",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, systemMessage]);
    setIsWaiting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex justify-between">
            <CardTitle className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="System"
                />
                <AvatarFallback>SYS</AvatarFallback>
              </Avatar>
              <span>Chat System</span>
            </CardTitle>
            <Button onClick={handleDetectFarm} size="icon" disabled={isWaiting}>
              <MessageCircleQuestion className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-2 max-w-[80%] ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="h-8 w-8 mt-1">
                  {message.sender === "system" ? (
                    <>
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt="System"
                      />
                      <AvatarFallback>SYS</AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt="User"
                      />
                      <AvatarFallback>YOU</AvatarFallback>
                    </>
                  )}
                </Avatar>

                <div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                  <div
                    className={`text-xs text-muted-foreground mt-1 ${
                      message.sender === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div />
        </CardContent>

        <CardFooter className="border-t p-4">
          <div className="flex w-full items-center space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isWaiting}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              disabled={inputValue.trim() === "" || isWaiting}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
