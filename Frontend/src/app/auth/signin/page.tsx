"use client"
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import InputForm from "@/components/InputForm";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-blue-900">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
      Sign in to your account
    </h2>
  </div>

  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-red-500 text-center">{error}</p>}
      <InputForm onInputChange={(value: string) => { setEmail(value); }} labelText="Email" />
      <InputForm onInputChange={(value: string) => { setPassword(value); }} labelText="Password" />
      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-md hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Sign in
        </button>
      </div>
    </form>
    <p className="mt-10 text-center text-sm text-gray-400">
      Not a member?{' '}
      <a href="/auth/signup" className="font-semibold text-blue-600 hover:text-blue-500">
        Sign Up
      </a>
    </p>
  </div>
</div>

  );
}
