"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/brand/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getAdminDashboardPath } from "@/lib/auth-urls";
import { Shield } from "lucide-react";

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

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
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    const destination =
      callbackUrl?.startsWith("/admin") ? callbackUrl : getAdminDashboardPath();

    window.location.assign(destination);
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))] sm:py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo size="login" className="mx-auto mb-4" />
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/10">
            <Shield className="h-6 w-6 text-brand-green" aria-hidden />
          </div>
          <h1 className="text-2xl font-bold text-white">Administration</h1>
          <p className="mt-2 text-sm text-white/50">
            Restricted access — administrators only
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8"
          autoComplete="off"
        >
          <Input
            id="admin-email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
          <Input
            id="admin-password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" isLoading={loading} className="min-h-11 w-full touch-manipulation">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
