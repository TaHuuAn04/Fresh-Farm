"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateUser } from "@/api/user.api";
import { changeState } from "@/redux/slices/user.slice";

const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." })
    .max(50, { message: "Full name must not exceed 50 characters." }),
  age: z
    .string()
    .refine((val) => !isNaN(Number.parseInt(val)), {
      message: "Age must be a number.",
    })
    .refine((val) => Number.parseInt(val) >= 0 && Number.parseInt(val) <= 120, {
      message: "Age must be between 0 and 120.",
    }),
  email: z.string().email({ message: "Invalid email address." }).optional(),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .max(15, { message: "Phone number must not exceed 15 digits." })
    .refine((val) => /^[0-9+\-\s()]*$/.test(val), {
      message:
        "Phone number can only contain digits, +, -, spaces, and parentheses.",
    }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const defaultValues: ProfileFormValues = {
    fullName: user?.fullName || "John Doe",
    age: user?.age ? String(user.age) : "30",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "0123456789",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (user && isAuthenticated) {
      form.reset({
        fullName: user.fullName || "",
        age: user.age ? String(user.age) : "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user, isAuthenticated, form]);

  // Handle form submission

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    try {
      // Call the updateUser API with the form data
      const response = await updateUser(
        {
          ...data,
          age: Number(data.age), // Convert age back to number if API expects a number
        },
        user?.id || ""
      );
      console.log(data);

      if (response?.statusCode && response.statusCode >= 300) {
        toast.error("Error", {
          description: "Failed to update profile. Please try again.",
        });
        return;
      }

      dispatch(
        changeState({
          fullName: response?.data?.fullName,
          role: response?.data?.role,
          age: response?.data?.age,
          phoneNumber: response?.data?.phone_number,
          email: response?.data?.email,
          id: response?.data?.id,
        })
      );

      // Assuming updateUser returns a success response
      toast.success("Success", {
        description: "Your profile information has been updated successfully.",
      });

      // Optionally, you can reset the form or update Redux state here
      console.log("Updated user data:", response);
    } catch (error) {
      // Handle API errors
      toast.error("Error", {
        description: "Failed to update profile. Please try again.",
      });
      console.error("Update user error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal details here. This information will be displayed
          publicly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your age"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your age must be between 0 and 120.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Your contact email address.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormDescription>Your contact phone number.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
