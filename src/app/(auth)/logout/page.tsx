"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LogOut, Loader2, ShieldCheck } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Backend API call to clear cookies/session
        await axios.post("/api/auth/logout");

        const timeout = setTimeout(() => {
          router.push("/login");
          router.refresh();
        }, 3000);

        return () => clearTimeout(timeout);
      } catch (error) {
        console.error("Logout error", error);
        router.push("/login");
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 font-sans">
      <div className="w-full max-w-md p-10 bg-white rounded-3xl border border-[#E2E8F0] shadow-sm text-center">
        {/* Animated Icon Container */}
        <div className="relative mx-auto w-20 h-20 mb-6">
          <div className="absolute inset-0 bg-rose-100 rounded-2xl rotate-6 animate-pulse"></div>
          <div className="relative bg-white border border-rose-100 rounded-2xl w-full h-full flex items-center justify-center shadow-sm">
            <LogOut size={32} className="text-rose-500" />
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Logging Out</h2>
        <p className="text-sm text-[#64748B] mb-8 leading-relaxed">
          We're safely closing your session and encrypting your tasks. <br />
          See you soon!
        </p>

        {/* Loading Indicator */}
        <div className="flex items-center justify-center gap-3 bg-[#F1F5F9] py-3 px-6 rounded-2xl w-fit mx-auto">
          <Loader2 className="animate-spin text-[#2563EB]" size={20} />
          <span className="text-[13px] font-bold text-[#475569] uppercase tracking-wider">
            Securing Session
          </span>
        </div>

        {/* Footer Note */}
        <div className="mt-10 pt-6 border-t border-[#F1F5F9] flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-widest">
            TaskFlow Security Protocol Active
          </span>
        </div>
      </div>
    </div>
  );
}
