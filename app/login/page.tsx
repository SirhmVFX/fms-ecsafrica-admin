"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth";

const slides = [
  {
    src: "/assets/landing/hero-fleet.jpg",
    label: "Fleet intelligence across Africa",
  },
  {
    src: "/assets/landing/trucks-highway.jpg",
    label: "Real-time vehicle tracking",
  },
  {
    src: "/assets/landing/control-room.jpg",
    label: "AI-powered telematics",
  },
  {
    src: "/assets/landing/logistics-port.jpg",
    label: "End-to-end cargo visibility",
  },
];

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setSlide((s) => (s + 1) % slides.length),
      5000,
    );
    return () => clearInterval(id);
  }, []);

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
      {/* Left: brand slideshow */}
      <div className="relative hidden lg:flex lg:w-1/2 overflow-hidden bg-[#0a1628]">
        {slides.map((s, i) => (
          <div
            key={s.src}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === slide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={s.src}
              alt=""
              fill
              priority={i === 0}
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-linear-to-t from-[#0a1628] via-transparent to-black/20" />
          </div>
        ))}

        <div className="relative z-10 flex h-full w-full flex-col justify-between p-12">
          <div>
            <Image
              src="/assets/FMS-Logo-Blue-1.png"
              alt="FMS Africa"
              width={160}
              height={58}
              className="h-12 w-auto brightness-0 invert"
              priority
            />
            <div className="mt-3 h-1 w-16 bg-[#ffd200]" />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#ffd200]">
              Fleet Monitoring Systems
            </p>
            <h1 className="mt-3 max-w-md text-3xl font-semibold text-white">
              FMS Africa Admin
            </h1>
            <p className="mt-3 max-w-sm text-sm text-white/70">
              {slides[slide].label}
            </p>
            <div className="mt-6 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1 transition-all ${
                    i === slide ? "w-8 bg-[#ffd200]" : "w-4 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex flex-1 items-center justify-center bg-white p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Image
              src="/assets/FMS-Logo-Blue-1.png"
              alt="FMS Africa"
              width={140}
              height={50}
              className="mx-auto h-10 w-auto"
            />
            <div className="mx-auto mt-3 h-1 w-12 bg-[#ffd200]" />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c9a800]">
            Admin access
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">Sign in</h2>
          <p className="mt-1 mb-8 text-sm text-gray-500">
            Enter your admin credentials to continue
          </p>

          {error && (
            <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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

          <p className="mt-8 text-center text-xs text-gray-400">
            FMS Africa Admin — restricted access only
          </p>
        </div>
      </div>
    </div>
  );
}
