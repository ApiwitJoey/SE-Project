"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.token;
  const [user, setUser] = useState({
    name: "",
    email: "",
    telephone_number: "",
    role: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  useEffect(() => {
    fetch("/api/user")
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setFormData(data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!token) {
      console.error("No token available.");
      return;
    }

    fetch("/api/user/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUser(formData);
          setIsEditing(false);
        } else {
          console.error("Error updating user data:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error saving user data:", error);
      });
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
  };

  const logout = () => {
    console.log("User logged out");
  };

  return (
    <div className="min-h-screen pt-[80px] px-4 pb-16 bg-gradient-to-b from-white to-green-100 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 space-y-6">
        {/* Profile Section */}
        <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
          <AccountCircleIcon className="text-green-700" style={{ fontSize: 50 }} />
          <div>
            <h2 className="text-3xl font-semibold text-green-900">{user.name}</h2>
            <p className="text-sm text-gray-500">User Profile Overview</p>
          </div>
        </div>


        <div className="grid gap-4 text-sm md:text-base text-gray-700">

        </div>

        <div className="flex justify-between pt-6">
          {isEditing ? (
            <div className="space-x-2">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded shadow-sm"
            >
              Edit Profile
            </button>
          )}

          <button
            onClick={() => {
              logout();
              router.push("/api/auth/signin");
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}