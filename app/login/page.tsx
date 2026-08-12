"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace("/admin");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0a1628] flex-col items-center justify-center p-12">
        <div className="w-16 h-16 mb-6 bg-[#0B3D91] flex items-center justify-center">
          <span className="text-white text-xl font-bold">FMS</span>
        </div>
        <p className="text-xs uppercase tracking-[0.35em] text-blue-300 mb-2">
          Fleet Monitoring Systems
        </p>
        <h1 className="text-3xl font-semibold text-white text-center">
          FMS Africa Admin
        </h1>
        <p className="mt-4 text-gray-400 text-center max-w-xs text-sm">
          Manage services, blog, clientele, pages and everything that powers
          the FMS Africa website.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-sm">
          {["Services", "Blog", "Clientele", "Settings"].map((item) => (
            <div key={item} className="border border-white/10 p-4 text-center">
              <p className="text-white text-sm font-semibold">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-700 mb-1">
              FMS Africa
            </p>
            <h1 className="text-2xl font-semibold">Admin Panel</h1>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Sign in</h2>
          <p className="text-sm text-gray-500 mb-8">
            Enter your admin credentials to continue
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="admin-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
                placeholder="admin@fms-ecsafrica.com"
                required
              />
            </div>
            <div>
              <label className="admin-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-xs text-gray-400 text-center">
            FMS Africa Admin — restricted access only
          </p>
        </div>
      </div>
    </div>
  );
}
