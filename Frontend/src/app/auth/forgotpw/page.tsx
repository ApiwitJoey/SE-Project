"use client";

import { useState } from "react";
import InputForm from "@/components/InputForm";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [error, setError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (step === "email") {
      if (!email.includes("@")) {
        setError("Please enter a valid email address");
        return;
      }
      setStep("otp");
    } else if (step === "otp") {
      if (otp.length !== 6 || /\D/.test(otp)) {
        setError("Please enter a valid 6-digit OTP");
        return;
      }
      setStep("reset");
    } else if (step === "reset") {
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      alert("Password successfully reset!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-emerald-800">
          Password Reset
        </h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10 border border-emerald-100">
          <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-lg text-yellow-800">
              {step === "email"
                ? "Enter your email to receive an OTP."
                : step === "otp"
                ? "Check your email for the OTP and enter it below."
                : "Enter your new password."}
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-6">
            {step === "email" && (
              <InputForm
                labelText="E-mail address"
                onInputChange={(val: string) => setEmail(val)}
                inputClass="text-lg p-4 border border-gray-300 rounded-md w-full"
              />
            )}
            {step !== "email" && (
              <div className="border border-gray-300 rounded-md p-4">
                <label className="block text-lg font-medium text-gray-700 mb-1">
                  E-mail address
                </label>
                <div className="text-lg text-gray-500">{email}</div>
              </div>
            )}

            {step === "otp" && (
              <InputForm
                labelText="OTP"
                onInputChange={(val: string) => setOtp(val)}
                inputClass="text-lg p-4 border border-gray-300 rounded-md w-full"
              />
            )}
            {step === "reset" && (
              <div className="border border-gray-300 rounded-md p-4">
                <label className="block text-lg font-medium text-gray-700 mb-1">
                  OTP
                </label>
                <div className="text-lg text-gray-500">{otp}</div>
              </div>
            )}

            {step === "reset" && (
              <>
                <div className="relative">
                  <InputForm
                    labelText="New Password"
                    onInputChange={(val: string) => setNewPassword(val)}
                    inputClass="text-lg p-4 border border-gray-300 rounded-md w-full pr-12"
                    type={showNewPassword ? "text" : "password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-[44px] text-gray-500"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="relative">
                  <InputForm
                    labelText="Confirm Password"
                    onInputChange={(val: string) => setConfirmPassword(val)}
                    inputClass="text-lg p-4 border border-gray-300 rounded-md w-full pr-12"
                    type={showConfirmPassword ? "text" : "password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-[44px] text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-300"
              >
                {step === "email"
                  ? "Reset My Password"
                  : step === "otp"
                  ? "Confirm"
                  : "Save New Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
