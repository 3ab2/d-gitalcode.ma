"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { isAdminRole } from "@/lib/roles";
import { Logo } from "@/components/brand/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials");
      setLoading(false);
      return;
    }

    const session = await getSession();
    if (!isAdminRole(session?.user?.role)) {
      setError("Admin access only. Use client login on the website.");
      setLoading(false);
      return;
    }

    window.location.assign("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="login" className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-white/50 mt-2">D-GITALCODE Dashboard</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 space-y-5"
        >
          <Input
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button type="submit" isLoading={loading} className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
