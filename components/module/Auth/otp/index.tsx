/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/api/authApi";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Image from "next/image";


const OTP_LENGTH = 6;

const otpSchema = z.object({
  otp: z
    .array(
      z
        .string()
        .length(1)
        .regex(/^[0-9]$/, "Must be a digit")
    )
    .length(OTP_LENGTH),
});

type OtpFormData = z.infer<typeof otpSchema>;

export default function Otp() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [reSendOtp] = useResendOtpMutation() as any;
  const [verifiedOtp, { isLoading: isVerifyingOtp }] =
    useVerifyOtpMutation() as any;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpValues, setOtpValues] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(30);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: Array(OTP_LENGTH).fill(""),
    },
  });

  // Timer countdown
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        const newTimer = prev - 1;
        return newTimer <= 0 ? 0 : newTimer;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const canResend = timer === 0;

  const handleResendOtp = useCallback(async () => {
    if (!email) {
      toast.error("Email not found");
      return;
    }
    if (!canResend) return;

    try {
      const res = await reSendOtp({ email: email }).unwrap();
      if (res.success) {
        toast.success(res.message);
        setTimer(30);
        setOtpValues(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      } else {
        toast.error(res.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  }, [email, canResend, reSendOtp]);

  const handleChange = (index: number, value: string) => {
    // Handle paste of multiple digits
    if (value.length > 1) {
      const digits = value.replace(/[^0-9]/g, "").split("").slice(0, OTP_LENGTH - index);
      const newOtpValues = [...otpValues];

      digits.forEach((digit, i) => {
        if (index + i < OTP_LENGTH) {
          newOtpValues[index + i] = digit;
          setValue(`otp.${index + i}`, digit);
        }
      });

      setOtpValues(newOtpValues);
      const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
      trigger("otp");
      return;
    }

    // Handle single digit
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);
      setValue(`otp.${index}`, value);

      // Auto-focus next input
      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      trigger("otp");
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        const newOtpValues = [...otpValues];
        newOtpValues[index - 1] = "";
        setOtpValues(newOtpValues);
        setValue(`otp.${index - 1}`, "");
        inputRefs.current[index - 1]?.focus();
        trigger("otp");
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").replace(/[^0-9]/g, "");
    const digits = pastedData.split("").slice(0, OTP_LENGTH);
    
    const newOtpValues = Array(OTP_LENGTH).fill("");
    digits.forEach((digit, i) => {
      newOtpValues[i] = digit;
      setValue(`otp.${i}`, digit);
    });
    
    setOtpValues(newOtpValues);
    const nextIndex = Math.min(digits.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
    trigger("otp");
  };

  const router = useRouter();

  const onSubmit = async (data: OtpFormData) => {
    if (!email) {
      toast.error("Email not found");
      return;
    }

    const payload = { email: email, otp: Number(data.otp.join("")) };

    try {
      const res = await verifiedOtp(payload).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.push(`/forgot-password/otp/change-password?email=${email}`);
      } else {
        
        toast.error(res.message || "Failed to verify OTP");
      }
    } catch (err: any) {
        router.push(`/forgot-password/otp/change-password?email=${email}`);

      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const isAllFilled = otpValues.every((v) => v !== "");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-[440px]">
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
          className="rounded-2xl bg-white p-8 shadow-lg border border-slate-100"
        >
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
              Enter OTP Code
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              We&apos;ve sent a {OTP_LENGTH}-digit code to{" "}
              <span className="font-semibold text-slate-700">{email}</span>
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* OTP Inputs */}
            <div onPaste={handlePaste}>
              <div className="flex justify-center gap-2 sm:gap-3">
                {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index, duration: 0.2 }}
                    className="flex-1 max-w-14"
                  >
                    <input
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={OTP_LENGTH}
                      value={otpValues[index]}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-full aspect-square text-center text-xl sm:text-2xl font-bold rounded-xl border-2 transition-all duration-200 outline-none
                        ${
                          otpValues[index]
                            ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm"
                            : "border-slate-200 bg-white text-slate-900 hover:border-slate-300"
                        }
                        focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:bg-white`}
                      aria-label={`Digit ${index + 1} of OTP`}
                    />
                  </motion.div>
                ))}
              </div>
              {errors.otp && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-sm text-red-600 text-center font-medium"
                >
                  Please enter a valid {OTP_LENGTH}-digit code
                </motion.p>
              )}
            </div>

            {/* Resend Timer */}
            <div className="text-center">
              <p className="text-sm text-slate-500">
                Didn&apos;t receive the code?{" "}
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span className="text-slate-400">
                    Resend in {timer}s
                  </span>
                )}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isVerifyingOtp || !isAllFilled}
                className="flex-1 py-6 rounded-xl font-semibold text-base"
              >
                {isVerifyingOtp ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Verify OTP"
                )}
              </Button>

              <Link href="/forgot-password" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-6 rounded-xl font-semibold text-base border-slate-200 cursor-pointer"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </motion.div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} OrderNest. All rights reserved.
        </p>
      </div>
    </div>
  );
}