"use client"
import { signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function SignOutButton() {

  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  }

  return (
    <div className="flex min-h-screen flex-col justify-center items-center px-6 py-12 lg:px-8 bg-blue-900">
      <p className="text-white text-lg mb-6 font-semibold">
        Are you sure you want to sign out?
      </p>
      <button
        onClick={handleLogout}
        className="flex w-full max-w-sm justify-center px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
      >
        Sign Out
      </button>
    </div>

  );
}
