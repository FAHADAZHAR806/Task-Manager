"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Lock, ShieldCheck, ArrowRight } from "lucide-react";

function ResetForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // URL se token uthata hai

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/reset-password", {
        token,
        password,
      });
      setMessage({ type: "success", text: "Success! Password updated." });
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Reset failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 font-sans">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-500 p-2 rounded-xl mb-3 shadow-lg shadow-emerald-100">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A]">
            Set New Password
          </h2>
          <p className="text-sm text-[#64748B] mt-1 text-center">
            Secure your account with a new password.
          </p>
        </div>

        {message.text && (
          <div
            className={`p-3 rounded-xl text-xs font-bold mb-6 border ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                : "bg-rose-50 border-rose-100 text-rose-600"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3 text-[#94A3B8]"
                size={18}
              />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:ring-2 focus:ring-[#2563EB] outline-none transition-all"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3 text-[#94A3B8]"
                size={18}
              />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:ring-2 focus:ring-[#2563EB] outline-none transition-all"
                placeholder="••••••••"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-[#0F172A] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#1E293B] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetForm />
    </Suspense>
  );
}
