"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layout, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 font-sans">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#2563EB] p-2 rounded-xl mb-3 shadow-md shadow-blue-100">
            <Layout size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Welcome Back</h2>
          <p className="text-sm text-[#64748B] mt-1 text-center">
            Login to manage your tasks effectively
          </p>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="bg-rose-50 text-rose-600 text-xs font-bold p-3 rounded-xl border border-rose-100 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-rose-600 rounded-full"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="email@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all sm:text-sm"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* Password Field with Forgot Link */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-bold text-[#2563EB] hover:text-[#1D4ED8]"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all sm:text-sm"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F172A] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#1E293B] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-slate-100 disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Sign In"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-[#F1F5F9] text-center">
          <p className="text-sm text-[#64748B]">
            New to FocusFlow?{" "}
            <Link
              href="/register"
              className="font-bold text-[#2563EB] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
