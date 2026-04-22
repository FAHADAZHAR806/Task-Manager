"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        {error && (
          <p className="text-red-500 mb-4 text-sm text-center">{error}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-2 border rounded text-black"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-2 border rounded text-black"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          New here?{" "}
          <Link href="/register" className="text-green-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
