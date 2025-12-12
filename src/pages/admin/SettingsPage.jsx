import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Shield,
  Link as LinkIcon,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register: registerProfile, handleSubmit: handleProfileSubmit } =
    useForm({
      defaultValues: {
        name: user?.name || "",
        email: user?.email || "",
      },
    });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch,
  } = useForm();

  const newPassword = watch("newPassword");

  const onProfileSubmit = async (data) => {
    setSavingProfile(true);
    try {
      await api.put("/auth/profile", data);
      toast.success("Profile updated successfully! 🎉");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (data.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSavingPassword(true);
    try {
      await api.put("/auth/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password updated successfully! 🔒");
      resetPassword();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Gradient */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Settings
              </span>
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <LinkIcon size={16} />
            <span className="font-medium">View Portfolio</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <User size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Profile Information
                </h2>
              </div>
            </div>

            <form
              onSubmit={handleProfileSubmit(onProfileSubmit)}
              className="p-6 space-y-5"
            >
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...registerProfile("name", { required: true })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-white"
                    placeholder="Your name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    {...registerProfile("email", { required: true })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-white"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={savingProfile}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {savingProfile ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Profile
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Shield size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Change Password
                </h2>
              </div>
            </div>

            <form
              onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              className="p-6 space-y-5"
            >
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    {...registerPassword("currentPassword", { required: true })}
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-gray-900 bg-white"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    {...registerPassword("newPassword", {
                      required: true,
                      minLength: 6,
                    })}
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-gray-900 bg-white"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Minimum 6 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...registerPassword("confirmPassword", { required: true })}
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-gray-900 bg-white"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={savingPassword}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {savingPassword ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Shield size={18} />
                    Update Password
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Info Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
              <span className="mt-3 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                {user?.role || "Admin"}
              </span>
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Security Tips
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Use a strong, unique password</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Change password regularly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Never share your credentials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Log out from shared devices</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
