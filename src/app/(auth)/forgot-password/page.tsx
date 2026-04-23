"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus({
          type: "success",
          msg: "Reset link sent! Please check your email.",
        });
      } else {
        setStatus({
          type: "error",
          msg: "User with this email does not exist.",
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        msg: "Something went wrong. Try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 font-sans">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div className="mb-6">
          <Link
            href="/login"
            className="text-[#64748B] hover:text-[#2563EB] flex items-center gap-2 text-sm font-bold transition-colors"
          >
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0F172A]">
            Forgot Password?
          </h2>
          <p className="text-sm text-[#64748B] mt-2">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {status && (
          <div
            className={`p-4 rounded-xl text-xs font-bold mb-6 border ${
              status.type === "success"
                ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                : "bg-rose-50 border-rose-100 text-rose-600"
            }`}
          >
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
                required
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#1D4ED8] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? "Sending..." : "Send Reset Link"}
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
