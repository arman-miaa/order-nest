
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "next/link";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

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

import { useForgotPasswordMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";


export default function ResetPassword() {
  const router = useRouter();

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation() as any;

  const form = useForm<FieldValues>({
    defaultValues: {
      email: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await forgotPassword(data).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.push(`/forgot-password/otp?email=${data?.email}`);
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
         router.push(`/forgot-password/otp?email=${data?.email}`);
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">


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
              Forgot Password?
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              No worries, we&apos;ll send you an OTP to reset your password
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        {...field}
                        className="py-6 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full py-6 rounded-xl font-semibold text-base"
                disabled={isSubmitting || isLoading}
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
                    Sending OTP...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>


      </div>
    </div>
  );
}