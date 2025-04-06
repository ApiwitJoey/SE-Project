"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import getMyProfile from "@/libs/Auth/GetMyProfile";
import updateMyProfile from "@/libs/Auth/UpdateMyProfile";
import deleteUser from "@/libs/Users/deleteUser";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "@/redux/features/userSlice";
import { AppDispatch, RootState } from "@/redux/store";
import userLogout from "@/libs/Auth/userLogout";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.token;

  const [user, setUser] = useState({
    name: "",
    email: "",
    telephone: "",
    role: "",
    _id: "",
  });

  const [formData, setFormData] = useState({ ...user });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        console.log("No token available");
        return;
      }

      try {
        const data = await getMyProfile(token);
        console.log("User data:", data);
        setUser(data.data);
        setFormData(data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!token) {
      console.error("No token available.");
      return;
    }

    try {
      const updatedUser = await updateMyProfile(token, formData);
      if (updatedUser.success) {
        setUser(updatedUser.data);
        setIsEditing(false);
      } else {
        console.error("Error updating user data:", updatedUser.message);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
  };

  const logout = async () => {
    if (token) {
      const response = await userLogout();
      if (response.success) {
        console.log("User logged out");
        router.push("/");
      }
    }
  };

  const deleteAcc = async (id: string) => {
    console.log("User id: " + id)
    if (id && token) {
      const response = await deleteUser(id, token);
      if (response.success) {
        dispatch(removeUser(id));
        logout();
      }
    }
  };

  return (
    <div className="min-h-screen pt-[80px] px-4 pb-16 bg-gradient-to-b from-white to-green-100 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 space-y-6">
        {/* Profile Section */}
        <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
          <AccountCircleIcon
            className="text-green-700"
            style={{ fontSize: 50 }}
          />
          <div>
            <h2 className="text-3xl font-semibold text-green-900">
              {formData.name}
            </h2>
            <p className="text-sm text-gray-500">User Profile Overview</p>
          </div>
        </div>

        <div className="grid gap-4 text-sm md:text-base text-gray-700">
          {/* Full Name */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-600">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border rounded px-3 py-2 mt-1"
              />
            ) : (
              <span className="mt-1">{formData.name}</span>
            )}
          </div>

          {/* Email Address */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-600">Email Address</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border rounded px-3 py-2 mt-1"
              />
            ) : (
              <span className="mt-1">{formData.email}</span>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-600">Phone Number</label>
            {isEditing ? (
              <input
                type="text"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="border rounded px-3 py-2 mt-1"
              />
            ) : (
              <span className="mt-1">{formData.telephone || "-"}</span>
            )}
          </div>

          {/* User Role */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-600">User Role</label>
            <span
              className={`w-fit self-start mt-1 px-3 py-1 text-sm font-medium text-white rounded 
              ${
                formData.role
                  ? formData.role === "admin"
                    ? "bg-green-800"
                    : "bg-green-500"
                  : "bg-gray-400"
              }`}
            >
              {formData.role
                ? formData.role.charAt(0).toUpperCase() + formData.role.slice(1)
                : "Unknown Role"}
            </span>
          </div>
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
        </div>
        <div className="flex justify-between">
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow-sm"
            onClick={() => {
              deleteAcc(user._id);
            }}
          >
            Delete Account
          </button>
          <button
            onClick={() => {
              logout();
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
