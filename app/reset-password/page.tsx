"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// Page the "reset password" email link points to. Supabase automatically
// creates a temporary recovery session from the link's URL fragment, and
// this page lets the resident set a new password while that session is
// active, then sends them to their account.
export default function ResetPasswordPage() {
  const router = useRouter();
  const updatePassword = useAuthStore((s) => s.updatePassword);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setReady(true);
      return;
    }
    // The recovery link sets the session asynchronously; wait for it.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    // Fallback in case the event already fired before we subscribed
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    const result = await updatePassword(password);
    setSubmitting(false);
    if (result.ok) {
      toast.success("Password updated! You're all set.");
      router.push("/account");
    } else {
      toast.error(result.error || "Could not update password. The link may have expired — request a new one.");
    }
  };

  return (
    <div className="container-x py-16 flex justify-center">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-saffron-500 text-white flex items-center justify-center font-bold text-2xl mx-auto mb-3">
            A
          </div>
          <h1 className="text-xl font-bold">Set a New Password</h1>
          <p className="text-sm text-gray-400">Choose a new password for your account</p>
        </div>

        {!ready ? (
          <p className="text-center text-sm text-gray-400">Verifying your reset link...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              required
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-saffron-400"
            />
            <input
              required
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-saffron-400"
            />
            <button type="submit" disabled={submitting} className="btn-primary w-full py-3 mt-2 disabled:opacity-60">
              {submitting ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
