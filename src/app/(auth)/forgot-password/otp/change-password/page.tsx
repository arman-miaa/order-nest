/* eslint-disable react-hooks/incompatible-library */

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useResetPasswordMutation } from "@/redux/api/authApi";

import { Eye, EyeOff,  CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const router = useRouter();

  const [resetPassword, { isLoading }] = useResetPasswordMutation() as any;

  const form = useForm<FieldValues>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting } = form.formState;

  const watchNewPassword = form.watch("newPassword");
  const watchConfirmPassword = form.watch("confirmPassword");
  const isPasswordMatch =
    watchNewPassword &&
    watchConfirmPassword &&
    watchNewPassword === watchConfirmPassword;

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleNewPassword = () => setShowNewPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const payload = {
      email: email,
      password: data?.confirmPassword,
    };

    try {
      const res = await resetPassword(payload).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.push("/login");
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-[440px]">
        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-lg border border-slate-100">
          {/* Logo */}
          <Link href="/" className="flex justify-center mb-6">
            <Image
              src="/logo2.png"
              alt="OrderNest Logo"
              width={120}
              height={40}
              className="rounded-2xl"
              priority
            />
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
        
            <h1 className="text-2xl font-bold text-slate-900">
              Change Password
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Create a new password for your account
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* New Password */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          {...field}
                          className="py-6 pr-12 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={toggleNewPassword}
                          className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                          {showNewPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter new password"
                          {...field}
                          className="py-6 pr-12 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={toggleConfirmPassword}
                          className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Match Indicator */}
              {watchConfirmPassword && (
                <div className="flex items-center gap-2 text-sm">
                  {isPasswordMatch ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-emerald-600 font-medium">
                        Passwords match
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-red-400" />
                      <span className="text-red-500 font-medium">
                        Passwords do not match
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-6 rounded-xl font-semibold text-base"
                disabled={isSubmitting || isLoading || !isPasswordMatch}
              >
                {isSubmitting || isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </Form>
        </div>

      </div>
    </div>
  );
}