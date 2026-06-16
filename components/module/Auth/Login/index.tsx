/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PHInput from "@/components/form/NRInput";
import { Button } from "@/components/ui/button";
import { useLoginMutation } from "@/redux/api/authApi";
import { setUser } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";

import { setCookie } from "@/src/utils/cookies";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { ChefHat, LayoutDashboard, User } from "lucide-react";

type LoginFormValues = {
  email: string;
  password: string;
};
interface CustomJwtPayload extends JwtPayload {
  role: string;
}

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

// Demo credentials
const demoAccounts = {
  manager: {
    email: "arman.smtech24@gmail.com",
    password: "123456",
    label: "Manager", 
    color: "bg-slate-900 hover:bg-slate-800",
  },
  staff: {
    email: "arman.smtech25@gmail.com",
    password: "123456",
    label: "Staff",
    color: "bg-blue-600 hover:bg-blue-500",
  },
  kitchen: {
    email: "arman.smtech26@gmail.com",
    password: "123456",
    label: "Kitchen",
    color: "bg-orange-600 hover:bg-orange-500",
  },
};

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation() as any;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await login(data).unwrap();

      if (res.success) {
        const token = res.data.token;

        setCookie(token);

        const user = jwtDecode<CustomJwtPayload>(token);

        dispatch(setUser({ token, user }));

        toast.success(res.message || "Login successful!");

        if (user?.role === "ADMIN" || user?.role === "MANAGER") {
          router.push("/manager/dashboard");
        } else if (user?.role === "STAFF") {
          router.push("/staff/dashboard");
        } else if (user?.role === "KITCHEN") {
          router.push("/kitchen/dashboard");
        } else {
          router.push("/");
        }
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  // Quick login handler
  const handleQuickLogin = (role: keyof typeof demoAccounts) => {
    const account = demoAccounts[role];
    form.setValue("email", account.email);
    form.setValue("password", account.password);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Login Card */}
        <div className="rounded-2xl bg-white p-8 shadow-lg border border-slate-100">
          {/* Logo */}
          <Link href="/" className="flex justify-center mb-6">
            <Image
              src="/logo2.png"
              alt="OrderNest Logo"
              width={150}
              height={50}
              className="rounded-2xl"
              priority
            />
          </Link>

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to your OrderNest account
            </p>
          </div>

          {/* Quick Role Selection */}
          <div className="mb-6">
      
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(demoAccounts) as Array<keyof typeof demoAccounts>).map(
                (role) => {
                  const account = demoAccounts[role];
                 
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleQuickLogin(role)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-white transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer ${account.color}`}
                    >
                    
                      <span className="text-xs font-bold">{account.label}</span>
                    </button>
                  );
                }
              )}
            </div>
          </div>

 

          {/* Form */}
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <PHInput
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
              />

              <PHInput
                control={form.control}
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
              />

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 font-semibold text-base"
              >
                {isLoading ? (
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
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </FormProvider>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} OrderNest. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;