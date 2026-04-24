"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { User, Mail, Lock, UserPlus, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/auth/register", formData);

      if (res.status === 201 || res.status === 200) {
        router.push("/login");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 font-sans">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
        {/* Brand/Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#2563EB] p-2 rounded-xl mb-3 shadow-lg shadow-blue-100">
            <UserPlus size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Create Account</h2>
          <p className="text-sm text-[#64748B] mt-1">
            Join FocusFlow to stay organized
          </p>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="bg-rose-50 text-rose-600 text-xs font-bold p-3 rounded-xl border border-rose-100 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
              Full Name
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-3 text-[#94A3B8]"
                size={18}
              />
              <input
                type="text"
                placeholder="Enter your Name"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:ring-2 focus:ring-[#2563EB] outline-none transition-all sm:text-sm"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-3 text-[#94A3B8]"
                size={18}
              />
              <input
                type="email"
                placeholder="Enter your Email"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:ring-2 focus:ring-[#2563EB] outline-none transition-all sm:text-sm"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3 text-[#94A3B8]"
                size={18}
              />
              <input
                type="password"
                placeholder="Enter your Password"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:ring-2 focus:ring-[#2563EB] outline-none transition-all sm:text-sm"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F172A] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#1E293B] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-slate-100 disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Register"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[#F1F5F9] text-center">
          <p className="text-sm text-[#64748B]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#2563EB] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
