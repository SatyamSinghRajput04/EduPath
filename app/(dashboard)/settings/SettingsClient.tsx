"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Trash2,
  LogOut,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  X,
} from "lucide-react";

type SettingsUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  bio: string | null;
  role: string;
  xp: number;
  streak: number;
  level: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  hasPassword?: boolean;
};

type ActiveModal = "none" | "edit-profile" | "change-email" | "change-profile" | "change-password" | "delete-account";

export default function SettingsClient({ initialUser }: { initialUser: SettingsUser }) {
  const router = useRouter();
  const [user, setUser] = useState<SettingsUser>(initialUser);
  const [activeModal, setActiveModal] = useState<ActiveModal>("none");

  // Edit Profile form state
  const [nameInput, setNameInput] = useState(user.name ?? "");
  const [bioInput, setBioInput] = useState(user.bio ?? "");
  const [selectedAvatarColor, setSelectedAvatarColor] = useState("violet");
  const [profilePending, setProfilePending] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  // Change Email form state
  const [newEmailInput, setNewEmailInput] = useState("");
  const [emailPasswordInput, setEmailPasswordInput] = useState("");
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [emailPending, setEmailPending] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

  // Change Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrPass, setShowCurrPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordPending, setPasswordPending] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Delete Account form state
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Global toast/feedback
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const getInitials = (val?: string | null) => {
    if (!val) return "EP";
    return val
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formattedJoinDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(user.createdAt));

  const formattedLastChange = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(user.updatedAt));

  /* ──────────────── Edit Profile Handler ──────────────── */
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (!nameInput.trim()) {
      setProfileError("Full Name cannot be empty.");
      return;
    }

    setProfilePending(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameInput.trim(),
          bio: bioInput.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setProfileError(data.error ?? "Failed to update profile.");
        return;
      }

      setUser((prev) => ({
        ...prev,
        name: data.user.name,
        bio: data.user.bio,
        updatedAt: data.user.updatedAt,
      }));

      setProfileSuccess("Profile updated successfully!");
      showToast("success", "Profile updated successfully!");
      setTimeout(() => {
        setActiveModal("none");
        setProfileSuccess("");
        router.refresh();
      }, 1000);
    } catch {
      setProfileError("An unexpected network error occurred.");
    } finally {
      setProfilePending(false);
    }
  };

  /* ──────────────── Change Email Handler ──────────────── */
  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setEmailSuccess("");

    if (!newEmailInput.trim()) {
      setEmailError("Please enter a valid new email address.");
      return;
    }

    if (newEmailInput.trim().toLowerCase() === user.email.toLowerCase()) {
      setEmailError("New email must be different from your current email.");
      return;
    }

    setEmailPending(true);
    try {
      const res = await fetch("/api/user/email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmailInput.trim(),
          currentPassword: emailPasswordInput,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setEmailError(data.error ?? "Failed to update email.");
        return;
      }

      setUser((prev) => ({
        ...prev,
        email: data.email,
        updatedAt: data.updatedAt,
      }));

      setEmailSuccess("Email successfully changed!");
      showToast("success", "Email address updated!");
      setTimeout(() => {
        setActiveModal("none");
        setEmailSuccess("");
        setNewEmailInput("");
        setEmailPasswordInput("");
        router.refresh();
      }, 1200);
    } catch {
      setEmailError("An unexpected network error occurred.");
    } finally {
      setEmailPending(false);
    }
  };

  /* ──────────────── Change Password Handler ──────────────── */
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    setPasswordPending(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setPasswordError(data.error ?? "Failed to update password.");
        return;
      }

      setPasswordSuccess("Password updated successfully!");
      showToast("success", "Password updated successfully!");
      setTimeout(() => {
        setActiveModal("none");
        setPasswordSuccess("");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 1200);
    } catch {
      setPasswordError("An unexpected network error occurred.");
    } finally {
      setPasswordPending(false);
    }
  };

  /* ──────────────── Delete Account Handler ──────────────── */
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError("");

    if (deleteConfirmationText !== "DELETE") {
      setDeleteError('You must type "DELETE" exactly to confirm.');
      return;
    }

    setDeletePending(true);
    try {
      const res = await fetch("/api/user/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmText: deleteConfirmationText,
          password: deletePassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setDeleteError(data.error ?? "Failed to delete account.");
        setDeletePending(false);
        return;
      }

      showToast("success", "Account deleted. Signing out…");
      // Destroy NextAuth session and send to login
      await signOut({ callbackUrl: "/login" });
    } catch {
      setDeleteError("An unexpected error occurred during account deletion.");
      setDeletePending(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all animate-bounce ${
            toastMessage.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300"
              : "bg-rose-950/90 border-rose-500/30 text-rose-300"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 size={18} className="text-emerald-400" />
          ) : (
            <AlertCircle size={18} className="text-rose-400" />
          )}
          <span className="text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="space-y-1">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage your account, preferences and privacy
        </p>
      </div>

      {/* ── Main Two-Column Layout (Matching Image 1) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── Left Navigation Column (Only Account) ── */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="rounded-2xl bg-[#0f0e1a]/80 backdrop-blur-xl border border-white/5 p-2 space-y-1.5 shadow-xl">
            
            {/* Account Tab */}
            <div
              className="w-full flex items-start gap-3.5 p-3.5 rounded-xl text-left bg-purple-600/15 border border-purple-500/35 text-white shadow-[0_0_20px_rgba(168,85,247,0.15)]"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-purple-500/20 text-purple-300">
                <User size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold tracking-tight text-white">Account</div>
                <div className="text-xs text-slate-400 truncate">Manage your account details</div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Right Content Column ── */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display font-bold text-xl text-white">
              Account
            </h2>
            <span className="text-xs text-purple-400/80 font-medium">
              Member since {formattedJoinDate}
            </span>
          </div>

          <div className="space-y-3">
              
              {/* 1. Edit Profile Card */}
              <div
                onClick={() => {
                  setNameInput(user.name ?? "");
                  setBioInput(user.bio ?? "");
                  setProfileError("");
                  setProfileSuccess("");
                  setActiveModal("edit-profile");
                }}
                className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#0f0e1a]/80 backdrop-blur-xl border border-white/5 hover:border-purple-500/35 hover:bg-[#141224] transition-all cursor-pointer shadow-lg hover:shadow-[0_8px_30px_rgba(168,85,247,0.12)]"
              >
                <div className="space-y-0.5">
                  <div className="text-sm sm:text-base font-semibold text-white group-hover:text-purple-300 transition-colors">
                    Edit Profile
                  </div>
                  <div className="text-xs text-slate-400">
                    Update your name and photo
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300 hidden sm:inline">
                    {user.name || "Set name"}
                  </span>
                  <ChevronRight size={18} className="text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              {/* 2. Change Email Card */}
              <div
                onClick={() => {
                  setNewEmailInput("");
                  setEmailPasswordInput("");
                  setEmailError("");
                  setEmailSuccess("");
                  setActiveModal("change-email");
                }}
                className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#0f0e1a]/80 backdrop-blur-xl border border-white/5 hover:border-purple-500/35 hover:bg-[#141224] transition-all cursor-pointer shadow-lg hover:shadow-[0_8px_30px_rgba(168,85,247,0.12)]"
              >
                <div className="space-y-0.5">
                  <div className="text-sm sm:text-base font-semibold text-white group-hover:text-purple-300 transition-colors">
                    Change Email
                  </div>
                  <div className="text-xs text-purple-300/80 font-mono">
                    {user.email}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ChevronRight size={18} className="text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              {/* 3. Change Profile Card */}
              <div
                onClick={() => {
                  setActiveModal("change-profile");
                }}
                className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#0f0e1a]/80 backdrop-blur-xl border border-white/5 hover:border-purple-500/35 hover:bg-[#141224] transition-all cursor-pointer shadow-lg hover:shadow-[0_8px_30px_rgba(168,85,247,0.12)]"
              >
                <div className="space-y-0.5">
                  <div className="text-sm sm:text-base font-semibold text-white group-hover:text-purple-300 transition-colors">
                    Change Profile
                  </div>
                  <div className="text-xs text-slate-400">
                    Last change: {formattedLastChange}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    {getInitials(user.name)}
                  </div>
                  <ChevronRight size={18} className="text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              {/* 4. Change Password Card */}
              <div
                onClick={() => {
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setPasswordError("");
                  setPasswordSuccess("");
                  setActiveModal("change-password");
                }}
                className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#0f0e1a]/80 backdrop-blur-xl border border-white/5 hover:border-purple-500/35 hover:bg-[#141224] transition-all cursor-pointer shadow-lg hover:shadow-[0_8px_30px_rgba(168,85,247,0.12)]"
              >
                <div className="space-y-0.5">
                  <div className="text-sm sm:text-base font-semibold text-white group-hover:text-purple-300 transition-colors">
                    Change Password
                  </div>
                  <div className="text-xs text-slate-400">
                    Secure your account with a strong password
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ChevronRight size={18} className="text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              {/* 5. Delete Account Card */}
              <div
                onClick={() => {
                  setDeleteConfirmationText("");
                  setDeletePassword("");
                  setDeleteError("");
                  setActiveModal("delete-account");
                }}
                className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#0f0e1a]/80 backdrop-blur-xl border border-rose-500/15 hover:border-rose-500/40 hover:bg-rose-950/20 transition-all cursor-pointer shadow-lg"
              >
                <div className="space-y-0.5">
                  <div className="text-sm sm:text-base font-semibold text-rose-300 group-hover:text-rose-200 transition-colors">
                    Delete Account
                  </div>
                  <div className="text-xs text-rose-400/60">
                    Permanently remove your account
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ChevronRight size={18} className="text-rose-400/50 group-hover:text-rose-300 group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              {/* 6. Logout Card (Bottom of Right Section) */}
              <div
                onClick={() => void signOut({ callbackUrl: "/login" })}
                className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#0f0e1a]/80 backdrop-blur-xl border border-white/5 hover:border-rose-500/30 hover:bg-rose-950/15 transition-all cursor-pointer shadow-lg"
              >
                <div className="space-y-0.5">
                  <div className="text-sm sm:text-base font-semibold text-rose-400 group-hover:text-rose-300 transition-colors">
                    Logout
                  </div>
                  <div className="text-xs text-slate-400">
                    Log out from your account
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <LogOut size={18} className="text-rose-400/60 group-hover:text-rose-300 transition-colors" />
                </div>
              </div>

            </div>
          </div>

        </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── MODALS FOR DYNAMIC ACTIONS ── */}
      {/* ───────────────────────────────────────────────────────────── */}

      {/* Modal 1: Edit Profile */}
      {activeModal === "edit-profile" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-[#121124] border border-purple-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.8)] p-6 sm:p-7 space-y-5 overflow-hidden">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300">
                  <User size={16} />
                </div>
                <h3 className="font-display font-bold text-lg text-white">Edit Profile</h3>
              </div>
              <button
                onClick={() => setActiveModal("none")}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-300 block">Full Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full bg-[#18162d] border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>

              {/* Bio / Title */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-300 block">Short Bio (Optional)</label>
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="e.g. Full-Stack Engineer passionate about AI and distributed systems."
                  rows={3}
                  className="w-full bg-[#18162d] border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all resize-none"
                />
              </div>

              {profileError && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 flex items-start gap-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
                  <p>{profileError}</p>
                </div>
              )}

              {profileSuccess && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs p-3 flex items-start gap-2">
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-400" />
                  <p>{profileSuccess}</p>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal("none")}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profilePending}
                  className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {profilePending ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving…</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Modal 2: Change Email */}
      {activeModal === "change-email" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-[#121124] border border-purple-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.8)] p-6 sm:p-7 space-y-5 overflow-hidden">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300">
                  <Mail size={16} />
                </div>
                <h3 className="font-display font-bold text-lg text-white">Change Email Address</h3>
              </div>
              <button
                onClick={() => setActiveModal("none")}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEmail} className="space-y-4">
              
              {/* Current Email Display */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-400 block">Current Email</label>
                <div className="w-full bg-[#18162d]/50 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-400 font-mono">
                  {user.email}
                </div>
              </div>

              {/* New Email */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-300 block">New Email Address</label>
                <input
                  type="email"
                  value={newEmailInput}
                  onChange={(e) => setNewEmailInput(e.target.value)}
                  placeholder="new.email@example.com"
                  required
                  className="w-full bg-[#18162d] border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>

              {/* Password Verification */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-300 block">
                  Current Password (Identity Verification)
                </label>
                <div className="relative">
                  <input
                    type={showEmailPassword ? "text" : "password"}
                    value={emailPasswordInput}
                    onChange={(e) => setEmailPasswordInput(e.target.value)}
                    placeholder="Enter current password"
                    required
                    className="w-full bg-[#18162d] border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmailPassword(!showEmailPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showEmailPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {emailError && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 flex items-start gap-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
                  <p>{emailError}</p>
                </div>
              )}

              {emailSuccess && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs p-3 flex items-start gap-2">
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-400" />
                  <p>{emailSuccess}</p>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal("none")}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={emailPending}
                  className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {emailPending ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying…</span>
                    </>
                  ) : (
                    <span>Update Email</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Modal 3: Change Profile (Avatar / Visuals) */}
      {activeModal === "change-profile" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-[#121124] border border-purple-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.8)] p-6 sm:p-7 space-y-5 overflow-hidden">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300">
                  <Sparkles size={16} />
                </div>
                <h3 className="font-display font-bold text-lg text-white">Change Profile</h3>
              </div>
              <button
                onClick={() => setActiveModal("none")}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-center">
              
              <div className="relative inline-block mx-auto">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-extrabold text-white shadow-xl ${
                    selectedAvatarColor === "violet"
                      ? "bg-gradient-to-tr from-purple-600 to-indigo-600 ring-4 ring-purple-500/30"
                      : selectedAvatarColor === "cyan"
                      ? "bg-gradient-to-tr from-cyan-600 to-blue-600 ring-4 ring-cyan-500/30"
                      : selectedAvatarColor === "emerald"
                      ? "bg-gradient-to-tr from-emerald-600 to-teal-600 ring-4 ring-emerald-500/30"
                      : "bg-gradient-to-tr from-fuchsia-600 to-pink-600 ring-4 ring-fuchsia-500/30"
                  }`}
                >
                  {getInitials(user.name)}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-base text-white">{user.name || "EduPath User"}</h4>
                <p className="text-xs text-purple-400 font-mono">{user.email}</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {user.role === "ADMIN" ? "Platform Administrator" : "Verified Learner"} · ⭐ {user.xp} XP
                </p>
              </div>

              <div className="space-y-2 text-left pt-2">
                <label className="text-xs font-semibold text-slate-400 block">Avatar Gradient Theme</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "violet", label: "Violet", grad: "from-purple-600 to-indigo-600" },
                    { id: "cyan", label: "Cyan", grad: "from-cyan-600 to-blue-600" },
                    { id: "emerald", label: "Emerald", grad: "from-emerald-600 to-teal-600" },
                    { id: "pink", label: "Fuchsia", grad: "from-fuchsia-600 to-pink-600" },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedAvatarColor(theme.id)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        selectedAvatarColor === theme.id
                          ? "border-purple-400 bg-purple-500/20"
                          : "border-white/5 hover:border-white/20 bg-white/5"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full mx-auto bg-gradient-to-tr ${theme.grad} mb-1`} />
                      <span className="text-[10px] text-slate-300 font-medium block">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveModal("none")}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-all"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast("success", "Profile theme applied!");
                    setActiveModal("none");
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all"
                >
                  Apply Theme
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Modal 4: Change Password */}
      {activeModal === "change-password" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-[#121124] border border-purple-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.8)] p-6 sm:p-7 space-y-5 overflow-hidden">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300">
                  <Lock size={16} />
                </div>
                <h3 className="font-display font-bold text-lg text-white">Change Password</h3>
              </div>
              <button
                onClick={() => setActiveModal("none")}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4">
              
              {/* Current Password */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-300 block">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrPass ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                    className="w-full bg-[#18162d] border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrPass(!showCurrPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showCurrPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-300 block">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 chars (letter + number)"
                    required
                    className="w-full bg-[#18162d] border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-300 block">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    required
                    className="w-full bg-[#18162d] border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showConfirmPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 flex items-start gap-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
                  <p>{passwordError}</p>
                </div>
              )}

              {passwordSuccess && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs p-3 flex items-start gap-2">
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-400" />
                  <p>{passwordSuccess}</p>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal("none")}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordPending}
                  className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {passwordPending ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Updating…</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Modal 5: Delete Account (Danger Zone) */}
      {activeModal === "delete-account" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-[#140e15] border border-rose-500/40 shadow-[0_25px_70px_rgba(244,63,94,0.25)] p-6 sm:p-7 space-y-5 overflow-hidden">
            
            <div className="flex items-center justify-between pb-3 border-b border-rose-500/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400">
                  <Trash2 size={16} />
                </div>
                <h3 className="font-display font-bold text-lg text-rose-200">Delete Account</h3>
              </div>
              <button
                onClick={() => setActiveModal("none")}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              
              <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 space-y-2 text-left">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <AlertCircle size={14} />
                  <span>Permanent Action Warning</span>
                </div>
                <p className="text-xs text-rose-200/80 leading-relaxed">
                  Deleting your account will permanently wipe out your learning roadmaps, streak count, code challenges, quiz history, and resume reviews. This action cannot be reversed.
                </p>
              </div>

              {/* Type DELETE confirmation */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-300 block">
                  To confirm, type <span className="text-rose-400 font-mono font-bold">DELETE</span> below:
                </label>
                <input
                  type="text"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  placeholder="DELETE"
                  required
                  className="w-full bg-[#1d121b] border border-rose-500/30 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all font-mono"
                />
              </div>

              {/* Password confirmation if available */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-300 block">
                  Password Confirmation
                </label>
                <div className="relative">
                  <input
                    type={showDeletePassword ? "text" : "password"}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-[#1d121b] border border-rose-500/30 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showDeletePassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {deleteError && (
                <div className="rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs p-3 flex items-start gap-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
                  <p>{deleteError}</p>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal("none")}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-all"
                >
                  Keep Account
                </button>
                <button
                  type="submit"
                  disabled={deletePending || deleteConfirmationText !== "DELETE"}
                  className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deletePending ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Deleting…</span>
                    </>
                  ) : (
                    <span>Permanently Delete</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
