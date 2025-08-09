"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "../../../lib/supabase";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("jeffotieno65@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const sb = getSupabase();
      const { error: signInError } = await sb.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        return;
      }
      router.push("/");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="fixed inset-0 -z-20">
        <video autoPlay loop muted className="w-full h-full object-cover">
          <source src="/videos/f1d123fb-bbf9-42df-acb3-24d4f9ec2aec.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="glass rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">Sign in</h1>
        <p className="text-gray-300 mb-6">Use your email and password</p>

        {error && <div className="mb-3 text-sm text-red-300">{error}</div>}

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-gray-300 mt-6">
          No account? {" "}
          <a href="/auth/sign-up" className="text-red-400 hover:text-red-300">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}


