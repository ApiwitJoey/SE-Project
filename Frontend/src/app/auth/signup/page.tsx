"use client";
import { useState } from "react";
import userRegister from "@/libs/Auth/userRegister";
import { useRouter } from "next/navigation";
import InputForm from "@/components/InputForm";
import CircularProgress from "@mui/material/CircularProgress";

const SignUp = () => {
  const router = useRouter();

  const [UserName, setUserName] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tel, setTel] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSignUp = async (e: React.FormEvent) => {
    const role = "user";
    e.preventDefault();
    setError("");
    setLoading(true);

    if (tel.length != 0 && /[^0-9]/.test(tel)) {
      setError("Phone number should contain only digits");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      setLoading(false);
      return;
    }

    if (UserName && FirstName && LastName && email && password && role && tel) {
      try {
        const response = await userRegister(UserName,FirstName,LastName, email, password, role, tel);
        if (response.success) {
          router.push("/");
        } else {
          setError(response.message || "Registration failed");
        }
      } catch (err) {
        setError("An error occurred during registration");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress sx={{ color: "#10b981" }} />
      </div>
    );
  }

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
              d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
            />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-800">
          Create Your Account
        </h2>
        <p className="mt-2 text-center text-sm text-emerald-600">
          Join our tropical retreat community
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10 border border-emerald-100">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <form onSubmit={handleSignUp} className="space-y-6">
            <InputForm
              onInputChange={(value: string) => setUserName(value)}
              labelText="Username"
            />
            <InputForm
              onInputChange={(value: string) => setFirstName(value)}
              labelText="First Name"
            />
            <InputForm
              onInputChange={(value: string) => setLastName(value)}
              labelText="Last Name"
            />
            <InputForm
              onInputChange={(value: string) => setEmail(value)}
              labelText="Email Address"
            />
            <InputForm
              onInputChange={(value: string) => setPassword(value)}
              labelText="Password"
            />
            <InputForm
              onInputChange={(value: string) => setTel(value)}
              labelText="Phone Number"
            />

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-300"
              >
                Register Now
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="/api/auth/signin"
                className="w-full flex justify-center py-2 px-4 border border-emerald-600 rounded-md shadow-sm text-sm font-medium text-emerald-600 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-300"
              >
                Sign in instead
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
