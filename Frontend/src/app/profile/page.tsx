"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import getMyProfile from "@/libs/Auth/GetMyProfile";
import updateMyProfile from "@/libs/Auth/UpdateMyProfile";
import ConfirmationPopup from "@/components/ConfirmPopup";
import SuccessPopup from "@/components/SuccessPopup";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.token;

  const [user, setUser] = useState({
    name: "",
    email: "",
    telephone: "",
    role: "",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    role: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); 
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showNameSnackbar, setShowNameSnackbar] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
      try {
        const data = await getMyProfile(token);
        const [firstName = "", lastName = ""] = data.data.name.split(" ");
        setUser(data.data);
        setFormData({
          firstName,
          lastName,
          email: data.data.email,
          telephone: data.data.telephone || "",
          role: data.data.role,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const validatePhone = (phone: string): boolean => /^0\d{8,9}$/.test(phone);

  const handleSave = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setShowNameSnackbar(true);
      return;
    }
  
    if (!validatePhone(formData.telephone)) {
      setShowSnackbar(true);
      return;
    }
  
    setShowConfirmBox(true);
  };

  const handleConfirmSave = async () => {
    if (!token) return;

    try {
      const updatedUser = await updateMyProfile(token, {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        telephone: formData.telephone,
        role: formData.role,
      });

      if (updatedUser.success) {
        setUser(updatedUser.data);
        setIsEditing(false);
        setShowSuccessPopup(true);
      } else {
        console.error("Error updating user data:", updatedUser.message);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    } finally {
      setShowConfirmBox(false);
    }
  };

  const handleCancel = () => {
    const [firstName = "", lastName = ""] = user.name.split(" ");
    setFormData({
      firstName,
      lastName,
      email: user.email,
      telephone: user.telephone || "",
      role: user.role,
    });
    setIsEditing(false);
  };

  const logout = () => {
    router.push("/api/auth/signin");
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 md:pt-24 px-2 sm:px-4 pb-16 bg-gradient-to-b from-white to-green-100 flex justify-center">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
        {/* Header with User Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 border-b border-gray-200 pb-4">
          <AccountCircleIcon className="text-green-700" style={{ fontSize: 45 }} />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-900">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">User Profile Overview</p>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4 text-sm md:text-base text-gray-700">
          {/* First + Last Name */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex flex-col w-full">
              <label className="font-medium text-gray-600 text-sm sm:text-base">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border rounded px-3 py-1.5 sm:py-2 mt-1 text-sm sm:text-base"
                />
              ) : (
                <span className="mt-1 break-words">{formData.firstName}</span>
              )}
            </div>

            <div className="flex flex-col w-full">
              <label className="font-medium text-gray-600 text-sm sm:text-base">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border rounded px-3 py-1.5 sm:py-2 mt-1 text-sm sm:text-base"
                />
              ) : (
                <span className="mt-1 break-words">{formData.lastName}</span>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-600 text-sm sm:text-base">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="border bg-gray-100 cursor-not-allowed rounded px-3 py-1.5 sm:py-2 mt-1 text-sm sm:text-base overflow-x-auto"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-600 text-sm sm:text-base">Phone Number</label>
            {isEditing ? (
              <input
                type="text"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="border rounded px-3 py-1.5 sm:py-2 mt-1 text-sm sm:text-base"
              />
            ) : (
              <span className="mt-1 break-words">{formData.telephone || "-"}</span>
            )}
          </div>

          {/* Role */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-600 text-sm sm:text-base">User Role</label>
            <span
              className={`w-fit self-start mt-1 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium text-white rounded 
              ${formData.role ? (formData.role === "admin" ? "bg-green-800" : "bg-green-500") : "bg-gray-400"}`}
            >
              {formData.role ? formData.role.charAt(0).toUpperCase() + formData.role.slice(1) : "Unknown Role"}
            </span>
          </div>
        </div>

        {/* Action Buttons - REDUCED SIZE */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 sm:pt-6">
          {isEditing ? (
            <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 w-full">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 sm:py-1.5 rounded text-sm w-full sm:w-auto"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 sm:py-1.5 rounded text-sm w-full sm:w-auto mt-2 sm:mt-0"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded shadow-sm text-sm"
            >
              Edit Profile
            </button>
          )}

          <button
            onClick={logout}
            className={`bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded shadow-sm text-sm ${isEditing ? "mt-2 sm:mt-0" : ""}`}
          >
            Sign Out
          </button>
        </div>

        {showConfirmBox && (
          <ConfirmationPopup
            title="Confirmation"
            message="Are you sure you want to save the changes?"
            onConfirm={handleConfirmSave}
            onCancel={() => setShowConfirmBox(false)}
          />
        )}
        {showSuccessPopup && (
          <SuccessPopup
            message="Profile updated successfully!"
            onClose={() => setShowSuccessPopup(false)}
          />
        )}

        {/* Snackbars */}
        <Snackbar
          open={showSnackbar}
          autoHideDuration={6000}
          onClose={() => setShowSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }} 
        >
          <Alert onClose={() => setShowSnackbar(false)} severity="error">
            กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (เริ่มด้วย 0 และมี 9-10 หลัก)
          </Alert>
        </Snackbar>

        <Snackbar
          open={showNameSnackbar}
          autoHideDuration={6000}
          onClose={() => setShowNameSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={() => setShowNameSnackbar(false)} severity="error">
            กรุณากรอกชื่อและนามสกุลให้ครบถ้วน
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
