"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-stone-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-stone-900">
          Art<span className="text-red-700">FOMO</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/artists"
            className="text-sm font-medium text-stone-500 transition hover:text-stone-900"
          >
            Directory
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-stone-500 transition hover:text-stone-900"
          >
            Blog
          </Link>
          <Link
            href="/pricing"
            className="rounded-full border border-red-700 px-4 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-700 hover:text-white"
          >
            Pricing
          </Link>

          {/* Auth state: undefined = loading, null = signed out, User = signed in */}
          {user === undefined ? null : user === null ? (
            <Link
              href="/login"
              className="rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              Sign In
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-stone-500">
                {firstName}
              </span>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-stone-700 transition hover:text-stone-900"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-full border border-stone-300 px-4 py-1.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
