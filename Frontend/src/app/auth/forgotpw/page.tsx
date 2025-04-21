"use client";

import { useEffect, useState } from "react";
import InputForm from "@/components/InputForm";
import { Eye, EyeOff } from "lucide-react";
import forgotPassword from "@/libs/Auth/forgotPassword";
import resetPassword from "@/libs/Auth/resetPassword";
import validateOtp from "@/libs/Auth/validateOtp";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter(); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [error, setError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (step === "email") {
      if (!email.includes("@")) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }
      try {
        const response = await forgotPassword(email);

        if (!response.success) {
          setError(response.message + ' ⚠️');
        } else {
          setStep("otp");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // Reset loading state after response
      }
    } else if (step === "otp") {
      try {
        const response = await validateOtp(otp);

        if (!response.success) {
          setError(response.message + ' ⚠️');
        } else {
          setStep("reset");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // Reset loading state after response
      }
    } else if (step === "reset") {
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
      if (newPassword.length < 6) {
        setError("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }
      try {
        const response = await resetPassword(otp,newPassword);

        if (!response.success) {
          setError(response.message + ' ⚠️');
        } else {
          setSuccessMessage(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // Reset loading state after response
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-60 z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-green-600">✅ Password Reset Successful </h2>
          <p className="text-gray-600 mt-2">You can now log in with your new password 🔑.</p>
          <button
            className="mt-4 px-5 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition"
            onClick={() => window.location.href = '/auth/signin2'}
          >
            Go to Sign-in
          </button>
        </div>
      </div>     
      )}
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
                <div className="text-lg text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap max-w-full" title={otp}>
                  {otp}
                </div>
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
                disabled={loading} // Disable button while submitting
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-300 ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "opacity-100 cursor-pointer"
                }`}
              >
                {loading ? (
                  <div className="flex justify-center items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 border-4 border-gray-200 rounded-full border-t-emerald-600"
                      viewBox="0 0 24 24"
                    />
                    Processing...
                  </div>
                ) : (
                  <span>
                    {step === "email"
                      ? "Reset My Password"
                      : step === "otp"
                      ? "Confirm"
                      : "Save New Password"}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
