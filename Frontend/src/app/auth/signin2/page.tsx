"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import InputForm from "@/components/InputForm";
import { Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <svg
            className="w-16 h-16 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-800">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-emerald-600">
          Sign in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10 border border-emerald-100">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputForm
              onInputChange={(value: string) => setEmail(value)}
              labelText="Email Address"
            />

            <div className="relative">
              <InputForm
                onInputChange={(value: string) => setPassword(value)}
                labelText="Password"
                type={showPassword ? "text" : "password"}
                inputClass="text-lg p-4 border border-gray-300 rounded-md w-full pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[44px] text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-300"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New here?</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <a
                href="/auth/signup"
                className="w-full flex justify-center py-2 px-4 border border-emerald-600 rounded-md shadow-sm text-sm font-medium text-emerald-600 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-300"
              >
                Create an Account
              </a>
              <a
                href="/auth/forgotpw"
                className="block text-center text-sm text-emerald-500 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
