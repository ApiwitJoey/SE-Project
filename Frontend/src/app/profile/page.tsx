"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import getMyProfile from "@/libs/Auth/GetMyProfile";
import updateMyProfile from "@/libs/Auth/UpdateMyProfile";
import ConfirmationPopup from "@/components/ConfirmPopup";
import SuccessPopup from "@/components/SuccessPopup";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import deleteUser from "@/libs/Users/deleteUser";
import { removeUser } from "@/redux/features/userSlice";
import { signOut } from "next-auth/react";
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
  const [showPopup, setShowPopup] = useState(false);
  const [popupProps, setPopupProps] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        console.log("No token available");
        return;
      }
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

  const validatePhone = (phone: string) => /^0\d{8,9}$/.test(phone);

  const handleSave = () => {
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

  const handleShowSignOutPopup = () => {
    setPopupProps({
      title: "Are you sure you want to sign out?",
      message: "You will be logged out and redirected to the homepage.",
      onConfirm: async () => {
        await logout();
        setShowPopup(false);
      },
      onCancel: () => setShowPopup(false),
    });
    setShowPopup(true);
  };

  const handleShowDeleteAccountPopup = () => {
    setPopupProps({
      title: "Are you sure you want to delete your account?",
      message: "Your account will be gone forever, there is no redo.",
      onConfirm: async () => {
        await deleteAcc(user._id);
        setShowPopup(false);
      },
      onCancel: () => setShowPopup(false),
    });
    setShowPopup(true);
  };

  const logout = async () => {
    if (token) {
      const response = await userLogout();
      if (response.success) {
        console.log("User logged out");
        await signOut({ redirect : false });
        router.push("/");
        router.refresh();
      }
    }
  };

  const deleteAcc = async (id: string) => {
    console.log("User id: " + id);
    try{
      if (id && token) {
        const response = await deleteUser(id, token);
        if (response.success) {
          dispatch(removeUser(id));
          logout();
        }
      }
    }
    catch(err){
      console.log("Error Message : " + err);
    }
  };

  return (
    <div className="min-h-screen pt-[80px] px-4 pb-16 bg-gradient-to-b from-white to-green-100 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
          <AccountCircleIcon
            className="text-green-700"
            style={{ fontSize: 50 }}
          />
          <div>
            <h2 className="text-3xl font-semibold text-green-900">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-sm text-gray-500">User Profile Overview</p>
          </div>
        </div>

        <div className="grid gap-4 text-sm md:text-base text-gray-700">
          {/* First + Last Name */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col w-full">
              <label className="font-medium text-gray-600">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 mt-1"
                />
              ) : (
                <span className="mt-1">{formData.firstName}</span>
              )}
            </div>

            <div className="flex flex-col w-full">
              <label className="font-medium text-gray-600">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 mt-1"
                />
              ) : (
                <span className="mt-1">{formData.lastName}</span>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-600">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="border bg-gray-100 cursor-not-allowed rounded px-3 py-2 mt-1"
            />
          </div>

          {/* Phone */}
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

          {/* Role */}
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
            onClick={handleShowDeleteAccountPopup}
          >
            Delete Account
          </button>
          <button
            onClick={handleShowSignOutPopup}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded shadow-sm"
          >
            Sign Out
          </button>
        </div>

        {showConfirmBox && (
          <ConfirmationPopup
            title="Confirmationed"
            message="Are you sure you want to save the changes?"
            onConfirm={handleConfirmSave}
            onCancel={() => setShowConfirmBox(false)}
          />
        )}
        {showSuccessPopup && (
          <SuccessPopup
            message="Profile updated successfully!"
            onClose={() => setShowSuccessPopup(false)} // Close the success popup
          />
        )}
        {showPopup && (
          <ConfirmationPopup
            title={popupProps.title}
            message={popupProps.message}
            onConfirm={popupProps.onConfirm}
            onCancel={popupProps.onCancel}
          />
        )}

        {/* Snackbar for phone validation */}
        {/* Snackbar for phone validation */}
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
      </div>
    </div>
  );
}
